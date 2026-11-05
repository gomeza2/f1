'use strict';
const http = require('node:http');
const {WebSocketServer, WebSocket} = require('ws');
const {RoomService} = require('./room-service.cjs');
const P = require('./protocol.cjs');
function createApp({autoTick = true, clock = () => performance.now(), allowedOrigins = [], maxPerIp = 16, serviceOptions = {}, onError = () => console.error('Pixel GP: internal room error')} = {}) {
  const service = new RoomService({...serviceOptions, now: clock});
  let closing = false, closePromise = null;
  const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'GET') { res.writeHead(405).end('GET only'); return; }
    if (req.url === '/health') { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ok: !closing, protocol: P.PROTOCOL, simulation: P.SIMULATION, ...service.stats()})); return; }
    if (req.url === '/protocol') { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(service.manifest())); return; }
    if (req.url === '/') { res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.end('PIXEL GRAND PRIX — servidor de salas privadas 0.79\nGET /health · GET /protocol · WebSocket /ws\nServidor local de desarrollo. El cliente del juego se integra en la fase 33.\n'); return; }
    res.writeHead(404).end('Not found');
  });
  const wss = new WebSocketServer({noServer: true, maxPayload: 4096, perMessageDeflate: false});
  const byIp = new Map();
  server.on('upgrade', (req, socket, head) => {
    const reject = status => { socket.end(`HTTP/1.1 ${status}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`); };
    if (closing) { reject('503 Service Unavailable'); return; }
    if (req.url !== '/ws') { reject('404 Not Found'); return; }
    const origin = req.headers.origin, port = server.address()?.port;
    const localOrigins = ['http://127.0.0.1:' + port, 'http://localhost:' + port];
    if (origin && ![...localOrigins, ...allowedOrigins].includes(origin)) { reject('403 Forbidden'); return; }
    const ip = req.socket.remoteAddress || 'unknown';
    if ((byIp.get(ip) || 0) >= maxPerIp || service.connections.size >= service.limits.maxConnections) { reject('429 Too Many Requests'); return; }
    wss.handleUpgrade(req, socket, head, ws => { ws.peerIp = ip; wss.emit('connection', ws); });
  });
  wss.on('connection', ws => {
    byIp.set(ws.peerIp, (byIp.get(ws.peerIp) || 0) + 1); ws.alive = true;
    const c = service.connect({
      send(message) {
        if (ws.readyState !== WebSocket.OPEN) return;
        if (ws.bufferedAmount > 262144) { ws.close(1013, 'slow_consumer'); return; }
        ws.send(JSON.stringify(message), error => { if (error) ws.terminate(); });
      },
      close(code, reason) { if (ws.readyState === WebSocket.OPEN) ws.close(code, reason); }
    });
    if (!c) { byIp.set(ws.peerIp, Math.max(0, (byIp.get(ws.peerIp) || 1) - 1)); ws.close(1013, 'server_full'); return; }
    ws.on('pong', () => { ws.alive = true; });
    ws.on('message', (data, binary) => {
      if (binary) { ws.close(1003, 'text_only'); return; }
      try { service.receive(c, data.toString('utf8')); }
      catch (error) { onError(error); ws.close(1011, 'room_error'); service.disconnect(c); }
    });
    ws.on('close', () => {
      const count = (byIp.get(ws.peerIp) || 1) - 1;
      if (count) byIp.set(ws.peerIp, count); else byIp.delete(ws.peerIp);
      service.disconnect(c);
    });
    ws.on('error', () => {});
  });
  let last = clock(), accumulator = 0, loop = null, heartbeat = null;
  function pump() {
    const now = clock(), delta = (now - last) / 1000; last = now;
    if (delta < 0 || delta > .25) { accumulator = 0; service.overload(); return; }
    accumulator += delta;
    if (accumulator > .1 + 1e-9) { accumulator = 0; service.overload(); return; }
    let steps = 0;
    while (accumulator + 1e-9 >= 1 / 60 && steps++ < 6) {
      try { service.step(); } catch (error) { onError(error); accumulator = 0; service.overload(); return; }
      accumulator = Math.max(0, accumulator - 1 / 60);
    }
  }
  function tick() { service.step(); }
  async function listen(port = 0, host = '127.0.0.1') {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, () => { server.removeListener('error', reject); resolve(); }); });
    last = clock();
    if (autoTick) loop = setInterval(pump, 1000 / 60);
    heartbeat = setInterval(() => { for (const ws of wss.clients) { if (!ws.alive) ws.terminate(); else { ws.alive = false; ws.ping(); } } }, 15000);
    heartbeat.unref();
    return {http: 'http://127.0.0.1:' + server.address().port, ws: 'ws://127.0.0.1:' + server.address().port + '/ws'};
  }
  async function close() {
    if (closePromise) return closePromise;
    closing = true;
    closePromise = (async () => {
      clearInterval(loop); clearInterval(heartbeat); service.shutdown();
      for (const ws of wss.clients) ws.terminate();
      await new Promise(resolve => wss.close(resolve));
      if (server.listening) await new Promise(resolve => server.close(resolve));
    })();
    return closePromise;
  }
  return {server, service, listen, close, tick, pump};
}
if (require.main === module) {
  const port = Number(process.env.PGP_PORT || 8787), host = process.env.PGP_HOST || '127.0.0.1';
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new RangeError('Invalid PGP_PORT');
  const allowedOrigins = (process.env.PGP_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const app = createApp({allowedOrigins});
  app.listen(port, host).then(() => console.log('Pixel GP private-room server listening on port ' + port)).catch(() => { console.error('Pixel GP could not listen'); process.exitCode = 1; });
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => app.close().then(() => process.exit(0)));
}
module.exports = {createApp};
