'use strict';
const assert = require('node:assert/strict');
const {once} = require('node:events');
const {setImmediate: immediate} = require('node:timers/promises');
const WebSocket = require('ws');
const {createApp} = require('../index.cjs');
const P = require('../protocol.cjs');
class Peer {
  constructor(url, options) {
    this.messages = []; this.room = null; this.session = null; this.snapshot = null; this.result = null; this.seq = 0; this.driving = false; this.lastRace = null;
    this.ws = new WebSocket(url, options);
    this.ws.on('error', () => {});
    this.ws.on('message', raw => {
      const m = JSON.parse(raw.toString()); this.messages.push(m);
      if (m.type === 'session') { this.session = m; this.room = m.room; }
      if (m.type === 'room') this.room = m.room;
      if (m.type === 'snapshot') {
        this.snapshot = m;
        if (m.raceId !== this.lastRace) { this.lastRace = m.raceId; this.seq = 0; }
        if (this.driving && ['countdown', 'running'].includes(m.phase)) {
          const car = m.state.cars.find(car => car.player === this.session.pilotId);
          const ack = m.inputs.find(p => p.pilotId === this.session.pilotId)?.seq ?? -1;
          this.seq = Math.max(this.seq, ack + 1);
          if (car && !car.done && !car.retired) this.send({type: 'input', raceId: m.raceId, seq: this.seq++, controls: navigate(car, this.world)});
        }
      }
      if (m.type === 'results') this.result = m;
    });
  }
  async open() { await once(this.ws, 'open'); const hello = await this.wait('hello'); this.send({type: 'hello', protocol: hello.protocol, simulation: hello.simulation}); await this.wait('welcome'); return this; }
  send(message) { if (this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(message)); }
  async wait(type, predicate = () => true, from = 0, timeout = 4000) {
    const end = Date.now() + timeout;
    while (Date.now() < end) { const found = this.messages.slice(from).find(m => m.type === type && predicate(m)); if (found) return found; await new Promise(r => setTimeout(r, 2)); }
    throw Error('Timeout waiting for ' + type + ': ' + JSON.stringify(this.messages.slice(-3).map(m => ({type: m.type, code: m.type === 'error' ? m.code : undefined, phase: m.room?.phase || m.phase}))));
  }
  async request(message, type = 'room', predicate) { const from = this.messages.length; this.send(message); return this.wait(type, predicate, from); }
  async close() { if (this.ws.readyState === WebSocket.CLOSED) return; const closed = once(this.ws, 'close'); this.ws.close(); await closed; }
}
function navigate(car, world) {
  const g = P.geometry, d = P.driving, before = g.nearestOnTrack(car.x, car.y, null, world.track), bend = world.curvatureAt(before.progress);
  const look = 42 + Math.abs(car.speed) * .25, p = g.sampleAt(before.progress + look, world.track);
  const angle = Math.atan2(p.y - car.y, p.x - car.x) - car.heading, error = Math.atan2(Math.sin(angle), Math.cos(angle));
  const material = world.terrainAt(car.x, car.y).material;
  const handling = d.vehicleHandling(Math.abs(car.speed), d.rules.models[car.model], material, bend.safeSpeed, 0, false);
  const yaw = error / Math.max(.3, look / Math.max(35, Math.abs(car.speed) * d.rules.worldSpeedScale));
  let target = Math.min(145, bend.safeSpeed * .86, world.curvatureAt(before.progress + 90).safeSpeed * .86);
  if (Math.abs(error) > 1) target = 55;
  return {throttle: car.speed < target - 2 ? 1 : 0, brake: car.speed > target + 2 ? 1 : 0, steering: Math.max(-1, Math.min(1, yaw / handling.turnRate + error * .2)), hand: false};
}
async function harness(options = {}) {
  let time = 0; const errors = [];
  const app = createApp({autoTick: false, clock: () => time, onError: error => errors.push(error), ...options});
  const url = await app.listen(); const peers = [];
  return {app, url, errors, get now() { return time; },
    async peer() { const p = await new Peer(url.ws).open(); peers.push(p); return p; },
    async ticks(n, yieldEvery = 3) { for (let i = 0; i < n; i++) { time += 1000 / 60; app.tick(); if (i % yieldEvery === yieldEvery - 1) { await immediate(); await immediate(); } } },
    jump(ms) { time += ms; },
    async close() { await Promise.all(peers.map(p => p.close())); await app.close(); assert.deepEqual(errors, []); }
  };
}
async function roomFor(h, count = 2, config = {}) {
  const peers = await Promise.all(Array.from({length: count}, () => h.peer()));
  const session = await peers[0].request({type: 'create', config}, 'session'); const code = session.code;
  for (const p of peers.slice(1)) await p.request({type: 'join', code}, 'session');
  await Promise.all(peers.map(p => p.wait('room', m => m.room.players.length === count)));
  return peers;
}
async function start(peers) {
  const revision = peers[0].room.revision;
  for (const p of peers) await p.request({type: 'ready', ready: true, revision}, 'room', m => m.room.players.find(x => x.pilotId === p.session.pilotId)?.ready);
  await peers[0].request({type: 'start', revision}, 'race_started');
  await Promise.all(peers.map(p => p.wait('snapshot', m => m.phase === 'countdown')));
}
module.exports = {Peer, harness, roomFor, start, navigate, P, immediate};
