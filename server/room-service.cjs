'use strict';
const crypto = require('node:crypto');
const P = require('./protocol.cjs');
const RaceSession = require('../race-session.js');
const rulesModule = require('../race-rules.js');
const NEUTRAL = Object.freeze({throttle: 0, brake: 0, steering: 0, hand: false});
const SAFE = Object.freeze({...NEUTRAL, brake: 1});
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const fail = code => { throw new P.ProtocolError(code); };
class RoomService {
  constructor({now = () => performance.now(), maxRooms = 32, maxConnections = 128, maxActiveRaces = 8, reconnectMs = 10000, staleInputMs = 350, idleMs = 300000, maxRaceSeconds = 1200} = {}) {
    this.now = now;
    this.limits = {maxRooms, maxConnections, maxActiveRaces, reconnectMs, staleInputMs, idleMs, maxRaceSeconds};
    this.rooms = new Map();
    this.connections = new Map();
    this.finishedRaces = 0;
  }
  connect(io) {
    if (this.connections.size >= this.limits.maxConnections) return null;
    const c = {id: crypto.randomUUID(), io, hello: false, room: null, pilot: null, blocked: false, strikes: 0, created: this.now(), rate: {at: this.now(), all: 0, lobby: 0, inputs: 0}};
    this.connections.set(c.id, c);
    this.send(c, {type: 'hello', ...this.manifest()});
    return c;
  }
  send(c, message) { if (c && !c.blocked) c.io.send(message); }
  broadcast(room, message) { for (const p of room.players.values()) this.send(p.connection, message); }
  error(c, code, strike = false) {
    this.send(c, {type: 'error', code});
    if (strike && ++c.strikes >= 3) this.block(c, 'invalid_messages');
  }
  block(c, reason) { if (!c.blocked) { c.blocked = true; c.io.close(1008, reason); this.disconnect(c); } }
  receive(c, raw) {
    if (!this.connections.has(c.id) || c.blocked) return;
    const at = this.now();
    if (at - c.rate.at >= 1000) c.rate = {at, all: 0, lobby: 0, inputs: 0};
    if (++c.rate.all > 90) { this.error(c, 'rate_limit'); this.block(c, 'rate_limit'); return; }
    try {
      if (typeof raw !== 'string' || Buffer.byteLength(raw) > 4096) throw new P.ProtocolError('bad_message', true);
      let m;
      try { m = JSON.parse(raw); } catch { throw new P.ProtocolError('bad_json', true); }
      if (!m || typeof m.type !== 'string') throw new P.ProtocolError('bad_message', true);
      if (m.type === 'hello') {
        P.fields(m, ['type', 'protocol', 'simulation']);
        if (c.hello) fail('already_hello');
        if (m.protocol !== P.PROTOCOL || m.simulation !== P.SIMULATION) { this.error(c, 'version_mismatch'); this.block(c, 'version_mismatch'); return; }
        c.hello = true; this.send(c, {type: 'welcome', protocol: P.PROTOCOL, simulation: P.SIMULATION}); return;
      }
      if (!c.hello) fail('hello_required');
      if (m.type === 'input' && ++c.rate.inputs > 60) { this.error(c, 'input_rate_limit'); this.block(c, 'input_rate_limit'); return; }
      if (m.type !== 'input' && ++c.rate.lobby > 12) { this.error(c, 'rate_limit'); this.block(c, 'rate_limit'); return; }
      switch (m.type) {
        case 'create': return this.create(c, m);
        case 'join': return this.join(c, m);
        case 'resume': return this.resume(c, m);
        case 'leave': P.fields(m, ['type']); return this.leave(c);
        case 'choose': return this.choose(c, m);
        case 'configure': return this.configure(c, m);
        case 'ready': return this.ready(c, m);
        case 'start': P.fields(m, ['type', 'revision']); return this.start(c, m);
        case 'input': return this.input(c, m);
        case 'rematch': P.fields(m, ['type']); return this.rematch(c);
        default: throw new P.ProtocolError('unknown_type', true);
      }
    } catch (error) {
      if (!(error instanceof P.ProtocolError)) throw error;
      this.error(c, error.code, error.fatal);
    }
  }
  current(c) { const room = this.rooms.get(c.room); if (!room || room.players.get(c.pilot)?.connection !== c) fail('not_in_room'); return room; }
  lobby(c, host = false) { const room = this.current(c); if (room.phase !== 'lobby') fail('race_locked'); if (host && room.host !== c.pilot) fail('host_only'); return room; }
  code() {
    for (;;) { const bytes = crypto.randomBytes(6); const code = [...bytes].map(n => CODE_ALPHABET[n % CODE_ALPHABET.length]).join(''); if (!this.rooms.has(code)) return code; }
  }
  publicRoom(room) {
    return {code: room.code, revision: room.revision, phase: room.phase, hostPilotId: room.host, config: {...room.config}, raceId: room.session?.config.raceId || null, players: [...room.players.values()].sort((a, b) => a.id - b.id).map(p => ({pilotId: p.id, name: p.name, model: p.model, paint: p.paint, ready: p.ready, connected: !!p.connection}))};
  }
  changed(room) { room.activeAt = this.now(); this.broadcast(room, {type: 'room', room: this.publicRoom(room)}); }
  unready(room) { for (const p of room.players.values()) p.ready = false; }
  invalidate(room) { room.revision++; this.unready(room); }
  create(c, m) {
    P.fields(m, ['type'], ['name', 'model', 'paint', 'config']);
    if (c.room) fail('already_in_room');
    if (this.rooms.size >= this.limits.maxRooms) fail('server_full');
    const config = P.config(m.config), code = this.code();
    const room = {code, config, host: 0, phase: 'lobby', revision: 1, players: new Map(), tokens: new Map(), session: null, roster: [], pendingEvents: [], tick: 0, result: null, activeAt: this.now()};
    const selection = P.choice(m, {name: 'P1', model: 'balanced', paint: 'pink'});
    this.rooms.set(code, room); this.addPilot(c, room, 0, selection); this.changed(room);
  }
  join(c, m) {
    P.fields(m, ['type', 'code'], ['name', 'model', 'paint']);
    if (c.room) fail('already_in_room');
    const room = this.rooms.get(P.roomCode(m.code)); if (!room) fail('room_not_found');
    if (room.phase !== 'lobby') fail('race_locked');
    if (room.players.size >= room.config.maxPlayers) fail('room_full');
    let id = 0; while (room.players.has(id)) id++;
    const paint = P.PAINTS.find(paint => ![...room.players.values()].some(p => p.paint === paint));
    const selection = P.choice(m, {name: 'P' + (id + 1), model: 'balanced', paint});
    if ([...room.players.values()].some(p => p.paint === selection.paint)) fail('paint_taken');
    this.addPilot(c, room, id, selection); this.invalidate(room); this.changed(room);
  }
  rotate(room, pilot) {
    if (pilot.token) room.tokens.delete(pilot.token);
    pilot.token = crypto.randomBytes(32).toString('base64url'); room.tokens.set(pilot.token, pilot.id);
  }
  addPilot(c, room, id, selection) {
    const pilot = {id, ...selection, connection: c, ready: false, disconnectedAt: null, token: null, input: NEUTRAL, inputAt: -Infinity, seq: -1};
    room.players.set(id, pilot); c.room = room.code; c.pilot = id; this.rotate(room, pilot); this.sessionMessage(c, room, pilot);
  }
  sessionMessage(c, room, pilot) { this.send(c, {type: 'session', code: room.code, pilotId: pilot.id, resumeToken: pilot.token, room: this.publicRoom(room)}); }
  choose(c, m) {
    P.fields(m, ['type'], ['name', 'model', 'paint']); const room = this.lobby(c), pilot = room.players.get(c.pilot);
    const next = P.choice(m, pilot);
    if ([...room.players.values()].some(p => p.id !== pilot.id && p.paint === next.paint)) fail('paint_taken');
    Object.assign(pilot, {name: next.name, model: next.model, paint: next.paint}); this.invalidate(room); this.changed(room);
  }
  configure(c, m) {
    P.fields(m, ['type', 'config']); const room = this.lobby(c, true), next = P.config(m.config, room.config);
    if (next.maxPlayers < room.players.size) fail('capacity_below_players');
    room.config = next; this.invalidate(room); this.changed(room);
  }
  ready(c, m) {
    P.fields(m, ['type', 'ready', 'revision']); if (typeof m.ready !== 'boolean' || !Number.isSafeInteger(m.revision) || m.revision < 1) throw new P.ProtocolError('bad_ready', true);
    const room = this.lobby(c); if (m.revision !== room.revision) fail('stale_room'); room.players.get(c.pilot).ready = m.ready; this.changed(room);
  }
  start(c, m) {
    const room = this.lobby(c, true), pilots = [...room.players.values()].sort((a, b) => a.id - b.id);
    if (!Number.isSafeInteger(m.revision) || m.revision < 1) throw new P.ProtocolError('bad_revision', true);
    if (m.revision !== room.revision) fail('stale_room');
    if (pilots.length < 2 || pilots.some(p => !p.ready || !p.connection)) fail('not_ready');
    if (this.stats().activeRaces >= this.limits.maxActiveRaces) fail('server_busy');
    const world = P.geometry.createWorld(room.config.track, room.config.barriers);
    const raceId = crypto.randomBytes(16).toString('base64url');
    for (const p of pilots) { p.seq = -1; p.input = NEUTRAL; p.inputAt = -Infinity; }
    const session = RaceSession.create({world, geometry: P.geometry, driving: P.driving, rulesModule, laps: room.config.laps, raceId,
      controller: (car, index, dt) => {
        const pilot = room.players.get(car.player), fresh = !!pilot?.connection && this.now() - pilot.inputAt <= this.limits.staleInputMs;
        if (!fresh) car.reverseHeld = 0;
        return P.driving.humanControls(car, fresh ? pilot.input : SAFE, dt, fresh);
      },
      onEvent: event => { room.pendingEvents.push(event); if (room.pendingEvents.length > 128) room.pendingEvents.shift(); }
    });
    const grid = pilots.map((p, index) => {
      const car = session.createVehicle({player: p.id, model: p.model});
      const distance = 4 - Math.floor(index / 2) * 48, at = P.geometry.sampleAt(distance, world.track), lateral = index % 2 ? 18 : -18;
      const progress = ((distance % world.track.length) + world.track.length) % world.track.length;
      Object.assign(car, {x: at.x - Math.sin(at.angle) * lateral, y: at.y + Math.cos(at.angle) * lateral, heading: at.angle, progress, previousProgress: progress, raceProgress: distance, raceOffset: distance < 0 ? -1 : 0});
      return car;
    });
    room.pendingEvents = []; room.tick = 0; room.result = null; room.session = session; room.phase = 'countdown';
    room.roster = pilots.map(p => ({pilotId: p.id, name: p.name, model: p.model, paint: p.paint}));
    session.setVehicles(grid); session.start(3); this.changed(room);
    this.broadcast(room, {type: 'race_started', raceId, config: {...room.config}, roster: room.roster}); this.sendSnapshot(room);
  }
  input(c, m) {
    const controls = P.input(m), room = this.current(c), pilot = room.players.get(c.pilot);
    if (!['countdown', 'running'].includes(room.phase)) fail('not_racing');
    if (m.raceId !== room.session.config.raceId) fail('wrong_race');
    if (m.seq <= pilot.seq) fail('stale_input');
    pilot.seq = m.seq; pilot.input = controls; pilot.inputAt = this.now(); room.activeAt = this.now();
  }
  snapshot(room, events = []) {
    return {type: 'snapshot', raceId: room.session.config.raceId, tick: room.tick, phase: room.phase, state: room.session.snapshot(), inputs: room.roster.map(p => ({pilotId: p.pilotId, seq: room.players.get(p.pilotId)?.seq ?? -1, connected: !!room.players.get(p.pilotId)?.connection})), events};
  }
  sendSnapshot(room) { this.broadcast(room, this.snapshot(room, room.pendingEvents.splice(0))); }
  finish(room) {
    for (const car of room.session.state.cars) if (!car.done) room.session.retire(car.player, 'race_closed');
    room.session.stop('finished'); room.phase = 'results';
    const rows = Object.freeze(room.session.results().map(row => Object.freeze({...row, ...room.roster.find(p => p.pilotId === row.player), status: row.done && !row.retired ? 'FINISHED' : 'DNF'})));
    const winner = rows.find(row => row.done && !row.retired)?.player ?? null;
    const body = {type: 'results', raceId: room.session.config.raceId, tick: room.tick, elapsed: room.session.state.elapsed, winner, rows};
    const digest = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
    room.result = Object.freeze({...body, digest}); room.activeAt = this.now(); this.finishedRaces++;
    this.sendSnapshot(room); this.broadcast(room, room.result); this.changed(room);
  }
  abort(room, reason) {
    if (!room.session || !['countdown', 'running'].includes(room.phase)) return;
    const raceId = room.session.config.raceId; room.session.stop(reason); room.session = null; room.phase = 'lobby'; room.result = null; room.pendingEvents = []; this.invalidate(room);
    this.broadcast(room, {type: 'race_aborted', raceId, reason}); this.changed(room);
  }
  electHost(room) { if (!room.players.get(room.host)?.connection) room.host = [...room.players.values()].filter(p => p.connection).sort((a, b) => a.id - b.id)[0]?.id ?? null; }
  resume(c, m) {
    P.fields(m, ['type', 'code', 'token']); if (c.room) fail('already_in_room');
    const code = P.roomCode(m.code), room = this.rooms.get(code);
    if (typeof m.token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(m.token)) throw new P.ProtocolError('bad_token', true);
    const pilot = room?.players.get(room.tokens.get(m.token));
    if (!pilot || (!pilot.connection && this.now() - pilot.disconnectedAt >= this.limits.reconnectMs)) fail('bad_token');
    const old = pilot.connection;
    if (old) { old.room = null; old.pilot = null; old.io.close(1000, 'resumed_elsewhere'); }
    pilot.connection = c; pilot.disconnectedAt = null; pilot.ready = false; pilot.input = NEUTRAL; pilot.inputAt = -Infinity;
    c.room = code; c.pilot = pilot.id; this.rotate(room, pilot); this.electHost(room);
    if (room.phase === 'countdown') this.abort(room, 'reconnected_during_countdown');
    else if (room.phase === 'lobby') this.invalidate(room);
    this.sessionMessage(c, room, pilot); this.changed(room);
    if (room.session) this.send(c, this.snapshot(room));
    if (room.result) this.send(c, room.result);
  }
  disconnect(c) {
    if (!this.connections.delete(c.id)) return;
    const room = this.rooms.get(c.room), pilot = room?.players.get(c.pilot);
    if (!pilot || pilot.connection !== c) return;
    pilot.connection = null; pilot.ready = false; pilot.disconnectedAt = this.now(); pilot.input = NEUTRAL; pilot.inputAt = -Infinity;
    c.room = null; c.pilot = null;
    if (room.phase === 'countdown') this.abort(room, 'disconnected_during_countdown');
    else if (room.phase === 'lobby') this.invalidate(room);
    this.electHost(room); this.changed(room);
  }
  removePilot(room, pilot, reason) {
    if (room.session && ['countdown', 'running'].includes(room.phase)) room.session.retire(pilot.id, reason);
    room.tokens.delete(pilot.token); room.players.delete(pilot.id); this.electHost(room); if (room.phase === 'lobby') this.invalidate(room);
  }
  leave(c) {
    const room = this.current(c), pilot = room.players.get(c.pilot);
    c.room = null; c.pilot = null; this.removePilot(room, pilot, 'left');
    if (room.phase === 'countdown') this.abort(room, 'left_during_countdown');
    this.send(c, {type: 'left'}); this.changed(room); this.cleanup(room);
  }
  cleanup(room) { if (!room.players.size) { room.session?.stop('empty'); this.rooms.delete(room.code); } }
  rematch(c) {
    const room = this.current(c); if (room.host !== c.pilot) fail('host_only'); if (room.phase !== 'results') fail('not_results');
    room.phase = 'lobby'; room.session = null; room.result = null; room.pendingEvents = []; this.invalidate(room); this.changed(room);
  }
  step() {
    const at = this.now();
    for (const c of this.connections.values()) if (!c.hello && at - c.created > 5000) this.block(c, 'hello_timeout');
    for (const room of [...this.rooms.values()]) {
      let expired = false;
      for (const p of [...room.players.values()]) if (!p.connection && at - p.disconnectedAt >= this.limits.reconnectMs) { this.removePilot(room, p, 'disconnect_timeout'); expired = true; }
      if (expired) this.changed(room);
      this.cleanup(room); if (!this.rooms.has(room.code)) continue;
      if (['countdown', 'running'].includes(room.phase)) {
        room.session.frame(1 / 60); room.tick++;
        if (room.session.state.countdownRemaining === 0) room.phase = 'running';
        if (room.session.state.elapsed >= this.limits.maxRaceSeconds) for (const car of room.session.state.cars) room.session.retire(car.player, 'time_limit');
        if (room.session.finishState().closed) this.finish(room);
        else if (room.tick % 3 === 0) this.sendSnapshot(room);
      } else if (at - room.activeAt >= this.limits.idleMs) {
        for (const p of room.players.values()) if (p.connection) { this.send(p.connection, {type: 'room_closed', reason: 'inactive'}); p.connection.room = null; p.connection.pilot = null; }
        this.rooms.delete(room.code);
      }
    }
  }
  overload() { for (const room of this.rooms.values()) this.abort(room, 'server_overload'); }
  manifest() { const data = P.manifest(); Object.assign(data.limits, {reconnectMs: this.limits.reconnectMs, staleInputMs: this.limits.staleInputMs, rooms: this.limits.maxRooms, activeRaces: this.limits.maxActiveRaces, connections: this.limits.maxConnections, lobbyCommandsPerSecond: 12, raceTimeLimitSeconds: this.limits.maxRaceSeconds}); return data; }
  stats() { return {rooms: this.rooms.size, connections: this.connections.size, activeRaces: [...this.rooms.values()].filter(r => ['countdown', 'running'].includes(r.phase)).length, finishedRaces: this.finishedRaces}; }
  shutdown() { for (const room of this.rooms.values()) this.abort(room, 'server_shutdown'); for (const c of [...this.connections.values()]) { c.io.close(1001, 'server_shutdown'); this.disconnect(c); } this.rooms.clear(); }
}
module.exports = {RoomService};
