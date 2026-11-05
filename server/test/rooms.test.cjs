'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {RoomService} = require('../room-service.cjs');
const Race = require('../../race-session.js');
const rules = require('../../race-rules.js');
const {P} = require('./helpers.cjs');
function fixture(options = {}) {
  let time = 0; const service = new RoomService({now: () => time, ...options});
  function peer() { const out = [], closes = []; const c = service.connect({send: m => out.push(m), close: (...v) => closes.push(v)}); const send = m => service.receive(c, JSON.stringify(m)); send({type: 'hello', protocol: P.PROTOCOL, simulation: P.SIMULATION}); return {c, out, closes, send, last: type => out.filter(m => m.type === type).at(-1)}; }
  function ticks(n) { for (let i = 0; i < n; i++) { time += 1000 / 60; service.step(); } }
  return {service, peer, ticks, jump(ms) { time += ms; }};
}
function setup(f, count = 2) { const p = Array.from({length: count}, () => f.peer()); p[0].send({type: 'create'}); const code = p[0].last('session').code; p.slice(1).forEach(x => x.send({type: 'join', code})); return {p, room: f.service.rooms.get(code)}; }
function begin({p, room}) { p.forEach(x => x.send({type: 'ready', ready: true, revision: room.revision})); p[0].send({type: 'start', revision: room.revision}); assert.equal(room.phase, 'countdown'); }
test('revision-bound readiness, owner permissions, locked grid, schema and input authority', () => {
  const f = fixture(), scene = setup(f), {p, room} = scene;
  p[1].send({type: 'configure', config: {track: 2}}); assert.equal(p[1].last('error').code, 'host_only'); assert.equal(room.config.track, 0);
  const oldRevision = room.revision; p.forEach(x => x.send({type: 'ready', ready: true, revision: oldRevision}));
  p[0].send({type: 'configure', config: {track: 2, laps: 1}}); assert.ok([...room.players.values()].every(x => !x.ready));
  p[1].send({type: 'ready', ready: true, revision: oldRevision}); assert.equal(p[1].last('error').code, 'stale_room');
  p[0].send({type: 'start', revision: room.revision}); assert.equal(p[0].last('error').code, 'not_ready'); begin(scene);
  p[0].send({type: 'configure', config: {track: 0}}); assert.equal(p[0].last('error').code, 'race_locked');
  p[1].send({type: 'choose', model: 'speed'}); assert.equal(p[1].last('error').code, 'race_locked');
  const raceId = room.session.config.raceId, neutral = {throttle: 1, brake: 0, steering: 0, hand: false};
  const before = room.session.snapshot(); p[0].send({type: 'input', raceId, seq: 10, controls: neutral, x: 9000}); assert.equal(p[0].last('error').code, 'unexpected_field'); assert.deepEqual(room.session.snapshot(), before);
  p[0].send({type: 'input', raceId, seq: 10, controls: neutral}); assert.equal(room.players.get(0).seq, 10); assert.deepEqual(room.session.snapshot(), before, 'Packet count advanced simulation');
  p[0].send({type: 'input', raceId, seq: 9, controls: {...neutral, throttle: 0}}); assert.equal(p[0].last('error').code, 'stale_input'); assert.equal(room.players.get(0).input.throttle, 1);
  p[0].send({type: 'input', raceId: 'another-race', seq: 11, controls: neutral}); assert.equal(p[0].last('error').code, 'wrong_race');
  p[0].send({type: 'results', rows: [{finishTime: 1}]}); assert.equal(p[0].last('error').code, 'unknown_type'); assert.equal(room.result, null);
  p[0].send({type: 'input', raceId, seq: 12, controls: {...neutral, throttle: 99}}); assert.equal(p[0].closes.at(-1)[0], 1008);
  assert.ok(!JSON.stringify(p[1].out).includes(p[0].last('session').resumeToken), 'Private token leaked to another pilot');
});
test('input watchdog brakes without reverse and socket loss cancels countdown', () => {
  const f = fixture(), scene = setup(f), {p, room} = scene; begin(scene); f.ticks(181); assert.equal(room.phase, 'running');
  const car = room.session.state.cars[0]; car.speed = 120; p[0].send({type: 'input', raceId: room.session.config.raceId, seq: 0, controls: {throttle: 1, brake: 0, steering: 0, hand: false}});
  f.ticks(180); assert.equal(car.speed, 0); assert.equal(car.reverseHeld, 0); assert.ok(room.session.state.cars.every(c => c.speed >= 0));
  const g = fixture(), countdown = setup(g); begin(countdown); g.service.disconnect(countdown.p[0].c); assert.equal(countdown.room.phase, 'lobby'); assert.equal(countdown.room.host, 1); assert.equal(countdown.room.session, null); assert.equal(countdown.p[1].last('race_aborted').reason, 'disconnected_during_countdown');
});
test('resume rotates credentials, retains vehicle, transfers host, expires to DNF and frees collision', () => {
  const f = fixture(), scene = setup(f), {p, room} = scene; begin(scene); f.ticks(190);
  const token = p[0].last('session').resumeToken, car = room.session.state.cars[0], position = {x: car.x, y: car.y};
  f.service.disconnect(p[0].c); assert.equal(room.host, 1); const replacement = f.peer(); replacement.send({type: 'resume', code: room.code, token});
  assert.equal(replacement.last('session').pilotId, 0); assert.notEqual(replacement.last('session').resumeToken, token); assert.equal(room.session.state.cars[0], car); assert.deepEqual({x: car.x, y: car.y}, position); assert.equal(room.host, 1);
  const thief = f.peer(); thief.send({type: 'resume', code: room.code, token}); assert.equal(thief.last('error').code, 'bad_token');
  f.service.disconnect(replacement.c); f.ticks(601); assert.equal(car.retired, true); assert.equal(car.done, false); assert.equal(car.retireReason, 'disconnect_timeout'); assert.equal(room.session.points(car, 0), 0);
  assert.equal(room.session.finishState().closed, false, 'Disconnected host stopped other racers');
  const survivor = room.session.state.cars[1]; Object.assign(survivor, {x: car.x, y: car.y, speed: 0}); const before = {x: survivor.x, y: survivor.y}; room.session.rules.resolveCollisions(room.session.state.cars, 1 / 60, room.session.state.elapsed); assert.deepEqual({x: survivor.x, y: survivor.y}, before, 'Retired car remained a wall');
});
test('empty/inactive room cleanup, version gates, overload cancellation and limits', () => {
  const f = fixture({maxRooms: 1, idleMs: 1000}), one = setup(f); const outsider = f.peer(); outsider.send({type: 'create'}); assert.equal(outsider.last('error').code, 'server_full');
  f.jump(1001); f.ticks(1); assert.equal(f.service.rooms.size, 0); assert.equal(one.p[0].last('room_closed').reason, 'inactive');
  const s = setup(f); begin(s); f.service.overload(); assert.equal(s.room.phase, 'lobby'); assert.equal(s.room.result, null); assert.equal(s.p[1].last('race_aborted').reason, 'server_overload');
  const raw = [], closed = []; const c = f.service.connect({send: m => raw.push(m), close: (...a) => closed.push(a)}); f.service.receive(c, JSON.stringify({type: 'hello', protocol: 1, simulation: 'old'})); assert.equal(raw.at(-1).code, 'version_mismatch'); assert.equal(closed[0][0], 1008);
  const flood = f.peer(); for (let i = 0; i < 100; i++) flood.send({type: 'leave'}); assert.ok(flood.closes.length); assert.equal(flood.last('error').code, 'rate_limit');
  const invalid = f.peer(); for (let i = 0; i < 3; i++) f.service.receive(invalid.c, '{'); assert.equal(invalid.last('error').code, 'bad_json'); assert.equal(invalid.closes.at(-1)[0], 1008);
});
test('retirement cannot manufacture finishes or points and all DNFs close the race', () => {
  const world = P.geometry.createWorld(0, 'open'), r = Race.create({world, geometry: P.geometry, driving: P.driving, rulesModule: rules, raceId: 'dnf'});
  r.setVehicles([r.createVehicle({player: 0}), r.createVehicle({player: 1})]); r.start(0); assert.equal(r.retire(0, 'left'), true); assert.equal(r.retire(0, 'left'), false); assert.equal(r.finishState().closed, false); r.retire(1, 'left'); assert.equal(r.finishState().closed, true); assert.ok(r.results().every(row => !row.done && row.retired && row.finishTime === null && row.points === 0));
});
