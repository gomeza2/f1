'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const WebSocket = require('ws');
const {once} = require('node:events');
const {harness, roomFor, start, Peer, P, immediate} = require('./helpers.cjs');
test('real WebSockets: simultaneous 2/4-player rooms, full valid races, reconnect and identical authoritative results', {timeout: 120000}, async () => {
  const h = await harness();
  try {
    const a = await roomFor(h, 2, {track: 0, laps: 3}), b = await roomFor(h, 4, {track: 2, laps: 1});
    for (const [peers, stage] of [[a, 0], [b, 2]]) {
      for (let i = 0; i < peers.length; i++) {
        if (peers === b) await peers[i].request({type: 'choose', model: ['balanced', 'corner', 'speed', 'rally'][i]});
        peers[i].world = P.geometry.createWorld(stage, 'auto'); peers[i].driving = true;
      }
      await immediate(); await immediate(); await start(peers);
    }
    const aId = a[0].snapshot.raceId, bId = b[0].snapshot.raceId;
    assert.notEqual(aId, bId); assert.notEqual(a[0].session.code, b[0].session.code);
    await h.ticks(480);
    assert.equal(a[0].snapshot.phase, 'running'); assert.equal(b[0].snapshot.phase, 'running');
    const oldToken = a[0].session.resumeToken, code = a[0].session.code;
    await a[0].close(); await h.ticks(90); assert.equal(a[1].room.hostPilotId, 1);
    const replacement = await h.peer(); replacement.world = P.geometry.createWorld(0, 'auto'); replacement.driving = true;
    const resumed = await replacement.request({type: 'resume', code, token: oldToken}, 'session');
    assert.equal(resumed.pilotId, 0); assert.notEqual(resumed.resumeToken, oldToken); a[0] = replacement;
    const thief = await h.peer(); const bad = await thief.request({type: 'resume', code, token: oldToken}, 'error'); assert.equal(bad.code, 'bad_token'); await thief.close();
    let bClosed = null;
    for (let n = 0; n < 24000 && (!a.every(p => p.result) || !b.every(p => p.result)); n += 3) {
      await h.ticks(3);
      if (!bClosed && b.every(p => p.result)) bClosed = h.app.service.rooms.get(b[0].session.code).session.snapshot();
    }
    assert.ok(a.every(p => p.result), '2-player race did not finish'); assert.ok(b.every(p => p.result), '4-player race did not finish');
    for (const peers of [a, b]) {
      const result = peers[0].result;
      assert.ok(peers.every(p => JSON.stringify(p.result) === JSON.stringify(result)), 'Participants received different results');
      assert.equal(result.rows.length, peers.length); assert.ok(result.rows.every(r => r.status === 'FINISHED' && r.done && !r.retired));
      assert.ok(result.rows.every(r => r.lapTimes.length === (peers === a ? 3 : 1) && r.lapTimes.every(t => t > 15 && t < 120)));
      assert.ok(result.rows.every(r => Number.isFinite(r.finishTime))); assert.equal(result.winner, result.rows[0].player);
      assert.equal(result.digest.length, 64); assert.equal(result.raceId, peers === a ? aId : bId);
      assert.ok(peers.every(p => !p.messages.some(m => m.type === 'error')), 'Legitimate driving caused protocol errors');
      const publicData = peers.flatMap(p => p.messages.filter(m => ['room', 'snapshot', 'results'].includes(m.type)));
      for (const p of peers) assert.ok(!JSON.stringify(publicData).includes(p.session.resumeToken), 'Resume credential leaked in broadcast');
      console.log(JSON.stringify({participants: peers.length, raceId: result.raceId, models: result.rows.map(r => r.model), times: result.rows.map(r => r.lapTimes), finish: result.rows.map(r => r.finishTime), digest: result.digest}));
    }
    assert.deepEqual(h.app.service.rooms.get(b[0].session.code).session.snapshot(), bClosed, 'Finished room advanced while another room raced');
    const health = await (await fetch(h.url.http + '/health')).json(); assert.equal(health.finishedRaces, 2); assert.equal(health.activeRaces, 0); assert.ok(!JSON.stringify(health).includes(code));
    const manifest = await (await fetch(h.url.http + '/protocol')).json(); assert.equal(manifest.simulation, P.SIMULATION); assert.equal(manifest.tracks.length, 14);
    await a[1].request({type: 'rematch'}); assert.equal(a[1].room.phase, 'lobby'); assert.ok(a[1].room.players.every(p => !p.ready));
  } finally { await h.close(); }
});
test('transport rejects hostile origins, binary/oversized payloads and stale simulation versions', {timeout: 10000}, async () => {
  const h = await harness();
  try {
    const rejected = new WebSocket(h.url.ws, {origin: 'https://unrelated.invalid'}); rejected.on('error', () => {});
    const [, response] = await once(rejected, 'unexpected-response'); assert.equal(response.statusCode, 403); response.resume(); rejected.terminate();
    const binary = await h.peer(); const binaryClosed = once(binary.ws, 'close'); binary.ws.send(Buffer.from('bytes')); assert.equal((await binaryClosed)[0], 1003);
    const huge = await h.peer(); const hugeClosed = once(huge.ws, 'close'); huge.ws.send('x'.repeat(5000)); assert.equal((await hugeClosed)[0], 1009);
    const wrong = new Peer(h.url.ws); await once(wrong.ws, 'open'); await wrong.wait('hello'); const wrongClosed = once(wrong.ws, 'close'); wrong.send({type: 'hello', protocol: 1, simulation: 'obsolete'}); assert.equal((await wrongClosed)[0], 1008); assert.equal(wrong.messages.find(m => m.type === 'error').code, 'version_mismatch');
    const local = await h.peer(); await local.close();
  } finally { await h.close(); }
});
test('real disconnect expiry produces DNF without blocking the survivor or reviving an old token', {timeout: 30000}, async () => {
  const h = await harness();
  try {
    const peers = await roomFor(h, 2, {track: 2, laps: 1}); peers[1].world = P.geometry.createWorld(2, 'auto'); peers[1].driving = true;
    await start(peers); await h.ticks(240);
    const token = peers[0].session.resumeToken, code = peers[0].session.code; await peers[0].close(); await h.ticks(610);
    const room = h.app.service.rooms.get(code), retired = room.session.state.cars.find(c => c.player === 0); assert.equal(retired.retired, true); assert.equal(room.host, 1);
    const late = await h.peer(); const denied = await late.request({type: 'resume', code, token}, 'error'); assert.equal(denied.code, 'bad_token'); await late.close();
    for (let n = 0; n < 12000 && !peers[1].result; n += 3) await h.ticks(3);
    const result = peers[1].result; assert.ok(result); assert.equal(result.winner, 1);
    const dnf = result.rows.find(c => c.player === 0); assert.equal(dnf.status, 'DNF'); assert.equal(dnf.done, false); assert.equal(dnf.finishTime, null); assert.equal(dnf.points, 0); assert.equal(result.rows.find(c => c.player === 1).lapTimes.length, 1);
  } finally { await h.close(); }
});
test('input flood cannot advance time and a production scheduler stall aborts instead of validating a race', {timeout: 10000}, async () => {
  const h = await harness();
  try {
    const p = await roomFor(h, 2); await start(p); await h.ticks(181);
    const room = h.app.service.rooms.get(p[0].session.code), elapsed = room.session.state.elapsed, positions = room.session.snapshot().cars;
    const closed = once(p[0].ws, 'close');
    for (let seq = 0; seq < 70; seq++) p[0].send({type: 'input', raceId: room.session.config.raceId, seq, controls: {throttle: 1, brake: 0, steering: 0, hand: false}});
    assert.equal((await closed)[0], 1008); assert.ok(p[0].messages.some(m => m.code === 'input_rate_limit')); assert.equal(room.session.state.elapsed, elapsed); assert.deepEqual(room.session.snapshot().cars, positions);
    h.jump(300); h.app.pump(); assert.equal(room.phase, 'lobby'); assert.equal(room.result, null); assert.equal(h.app.service.finishedRaces, 0); assert.ok(p[1].messages.some(m => m.type === 'race_started'));
  } finally { await h.close(); }
});
test('production monotonic scheduler advances countdown without client time or manual ticks', {timeout: 10000}, async () => {
  const {createApp} = require('../index.cjs');
  const errors = [], app = createApp({onError: error => errors.push(error)}), peers = [];
  try {
    const url = await app.listen();
    for (let i = 0; i < 2; i++) peers.push(await new Peer(url.ws).open());
    const session = await peers[0].request({type: 'create'}, 'session');
    await peers[1].request({type: 'join', code: session.code}, 'session');
    await peers[0].wait('room', m => m.room.players.length === 2);
    await start(peers);
    const update = await peers[0].wait('snapshot', m => m.tick >= 12);
    assert.equal(update.phase, 'countdown');
    assert.ok(update.state.countdownRemaining > 0 && update.state.countdownRemaining < 3);
    assert.equal(update.state.elapsed, 0);
    assert.ok(update.inputs.every(p => p.seq === -1));
    assert.deepEqual(errors, []);
  } finally {
    await Promise.all(peers.map(p => p.close()));
    await app.close(); await app.close();
  }
});
