// Independent browser WebSocket clients against the real server. No game UI or physics override.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createApp} = require('../server/index.cjs');
const {navigate} = require('../server/test/helpers.cjs');
const {setImmediate: immediate} = require('node:timers/promises');
const root = path.resolve(__dirname, '..');
(async () => {
  let now = 0; const serverErrors = [], browserErrors = [];
  const app = createApp({autoTick: false, clock: () => now, onError: e => serverErrors.push(e)});
  const url = await app.listen();
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox']});
  const contexts = [];
  try {
    async function client() {
      const context = await browser.newContext(); contexts.push(context); const page = await context.newPage(); page.on('pageerror', e => browserErrors.push(e.message));
      await page.goto(url.http);
      for (const file of ['driving-core.js', 'track-core.js']) await page.addScriptTag({content: fs.readFileSync(path.join(root, file), 'utf8')});
      await page.evaluate(({socket, navigation}) => {
        const P = {geometry: PixelTrackCore.create(), driving: PixelDrivingCore.create()}; const world = P.geometry.createWorld(2, 'auto');
        // The helper is trusted test code. Clients still transmit only legal normalized commands.
        const navigate = new Function('P', 'return (' + navigation + ')')(P);
        const c = {socket: new WebSocket(socket), room: null, session: null, snapshot: null, result: null, errors: [], welcome: false, drive: false, seq: 0, sent: -1, race: null, snapshots: 0};
        c.send = message => { if (c.socket.readyState === WebSocket.OPEN) c.socket.send(JSON.stringify(message)); };
        c.socket.onmessage = event => {
          const m = JSON.parse(event.data);
          if (m.type === 'hello') c.send({type: 'hello', protocol: m.protocol, simulation: m.simulation});
          if (m.type === 'welcome') c.welcome = true;
          if (m.type === 'session') { c.session = m; c.room = m.room; }
          if (m.type === 'room') c.room = m.room;
          if (m.type === 'error') c.errors.push(m.code);
          if (m.type === 'results') c.result = m;
          if (m.type === 'snapshot') {
            c.snapshot = m; c.snapshots++;
            if (m.raceId !== c.race) { c.race = m.raceId; c.seq = 0; }
            if (c.drive && ['countdown', 'running'].includes(m.phase)) {
              const car = m.state.cars.find(car => car.player === c.session.pilotId), ack = m.inputs.find(p => p.pilotId === c.session.pilotId)?.seq ?? -1;
              c.seq = Math.max(c.seq, ack + 1);
              if (car && !car.done && !car.retired) { c.sent = c.seq++; c.send({type: 'input', raceId: m.raceId, seq: c.sent, controls: navigate(car, world)}); }
            }
          }
        };
        window.roomClient = c;
      }, {socket: url.ws, navigation: navigate.toString()});
      await page.waitForFunction(() => roomClient.welcome); return page;
    }
    const pages = await Promise.all(Array.from({length: 4}, client));
    await pages[0].evaluate(() => roomClient.send({type: 'create', config: {track: 2, laps: 1}}));
    await pages[0].waitForFunction(() => roomClient.session); const code = await pages[0].evaluate(() => roomClient.session.code);
    for (let i = 1; i < 4; i++) { await pages[i].evaluate(code => roomClient.send({type: 'join', code}), code); await pages[i].waitForFunction(() => roomClient.session); }
    await Promise.all(pages.map(p => p.waitForFunction(() => roomClient.room.players.length === 4)));
    const revision = await pages[0].evaluate(() => roomClient.room.revision);
    for (const page of pages) await page.evaluate(revision => { roomClient.drive = true; roomClient.send({type: 'ready', ready: true, revision}); }, revision);
    await pages[0].waitForFunction(() => roomClient.room.players.every(p => p.ready));
    await pages[0].evaluate(revision => roomClient.send({type: 'start', revision}), revision);
    await Promise.all(pages.map(p => p.waitForFunction(() => roomClient.snapshot)));
    let ticks = 0;
    for (; ticks < 12000; ticks += 3) {
      for (let k = 0; k < 3; k++) { now += 1000 / 60; app.tick(); }
      await immediate(); await immediate();
      const room = app.service.rooms.get(code);
      await Promise.all(pages.map(page => page.waitForFunction(tick => roomClient.snapshot?.tick >= tick || !!roomClient.result, room.tick, {timeout: 3000})));
      const sent = await Promise.all(pages.map(page => page.evaluate(() => ({id: roomClient.session.pilotId, seq: roomClient.sent}))));
      const end = Date.now() + 3000;
      while (sent.some(p => room.players.get(p.id).seq < p.seq) && Date.now() < end) { await immediate(); await immediate(); }
      assert.ok(sent.every(p => room.players.get(p.id).seq >= p.seq), 'Server did not acknowledge browser command');
      if (room.phase === 'results') break;
    }
    const rows = await Promise.all(pages.map(p => p.evaluate(() => ({result: roomClient.result, errors: roomClient.errors, snapshots: roomClient.snapshots, id: roomClient.session.pilotId}))));
    assert.ok(rows.every(row => row.result), 'Browser race did not finish'); assert.equal(new Set(rows.map(row => row.id)).size, 4);
    assert.ok(rows.every(row => JSON.stringify(row.result) === JSON.stringify(rows[0].result)), 'Browser results disagree');
    assert.ok(rows.every(row => row.errors.length === 0 && row.snapshots > 100));
    assert.ok(rows[0].result.rows.every(row => row.done && !row.retired && row.status === 'FINISHED' && row.lapTimes.length === 1 && row.lapTimes[0] > 15));
    assert.deepEqual(serverErrors, []); assert.deepEqual(browserErrors, []);
    console.log(JSON.stringify({participants: rows.length, laps: rows[0].result.rows.map(row => row.lapTimes), finish: rows[0].result.rows.map(row => row.finishTime), snapshots: rows.map(row => row.snapshots), digest: rows[0].result.digest}));
    console.log('PASS: four isolated Chromium contexts use native WebSocket hello/create/join/revision-ready/start/inputs/snapshots/results; four actual server-computed gated laps and identical results, no JS errors. Accelerated server clock and automated navigation are test instrumentation; this is not the game frontend, Internet latency or human online play.');
  } finally { await browser.close(); await app.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
