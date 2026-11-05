'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const geometry = require('../track-core.js').create();
const driving = require('../driving-core.js').create();
const PROTOCOL = 1;
const PAINTS = Object.freeze(['pink', 'cyan', 'lime', 'orange', 'violet', 'white']);
const BARRIERS = Object.freeze(['auto', 'open', 'full', 'half', 'corners']);
const DEFAULT_CONFIG = Object.freeze({track: 0, barriers: 'auto', laps: 3, maxPlayers: 4});
const hash = crypto.createHash('sha256');
for (const file of ['driving-core.js', 'track-core.js', 'race-rules.js', 'race-session.js']) {
  hash.update(file + '\0');
  hash.update(fs.readFileSync(path.join(__dirname, '..', file)));
}
const SIMULATION = hash.digest('hex');
class ProtocolError extends Error {
  constructor(code, fatal = false) { super(code); this.code = code; this.fatal = fatal; }
}
function fail(code) { throw new ProtocolError(code, true); }
function fields(value, required, optional = []) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('bad_message');
  if (required.some(key => !Object.hasOwn(value, key))) fail('missing_field');
  const allowed = new Set([...required, ...optional]);
  if (Object.keys(value).some(key => !allowed.has(key))) fail('unexpected_field');
}
function config(patch = {}, base = DEFAULT_CONFIG) {
  fields(patch, [], ['track', 'barriers', 'laps', 'maxPlayers']);
  const next = {...base, ...patch};
  if (!Number.isInteger(next.track) || !geometry.tracks[next.track]) fail('bad_track');
  if (!BARRIERS.includes(next.barriers)) fail('bad_barriers');
  if (!Number.isInteger(next.laps) || next.laps < 1 || next.laps > 9) fail('bad_laps');
  if (!Number.isInteger(next.maxPlayers) || next.maxPlayers < 2 || next.maxPlayers > 4) fail('bad_capacity');
  return Object.freeze(next);
}
function choice(message, defaults) {
  const next = {...defaults};
  if (Object.hasOwn(message, 'name')) {
    if (typeof message.name !== 'string') fail('bad_name');
    next.name = message.name.trim();
    if (!next.name.length || [...next.name].length > 20 || /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(next.name)) fail('bad_name');
  }
  if (Object.hasOwn(message, 'model')) {
    if (typeof message.model !== 'string' || !Object.hasOwn(driving.rules.models, message.model)) fail('bad_model');
    next.model = message.model;
  }
  if (Object.hasOwn(message, 'paint')) {
    if (!PAINTS.includes(message.paint)) fail('bad_paint');
    next.paint = message.paint;
  }
  return next;
}
function input(message) {
  fields(message, ['type', 'raceId', 'seq', 'controls']);
  if (typeof message.raceId !== 'string' || message.raceId.length > 80) fail('bad_race');
  if (!Number.isSafeInteger(message.seq) || message.seq < 0 || message.seq > 2147483647) fail('bad_sequence');
  fields(message.controls, ['throttle', 'brake', 'steering', 'hand']);
  const c = message.controls;
  if (!Number.isFinite(c.throttle) || c.throttle < 0 || c.throttle > 1 || !Number.isFinite(c.brake) || c.brake < 0 || c.brake > 1 || !Number.isFinite(c.steering) || c.steering < -1 || c.steering > 1 || typeof c.hand !== 'boolean') fail('bad_controls');
  return Object.freeze({...c});
}
function roomCode(value) {
  if (typeof value !== 'string' || !/^[A-Z2-9]{6}$/.test(value.trim().toUpperCase())) fail('bad_code');
  return value.trim().toUpperCase();
}
function manifest() {
  return {protocol: PROTOCOL, simulation: SIMULATION, models: Object.keys(driving.rules.models), paints: [...PAINTS], barriers: [...BARRIERS], tracks: geometry.tracks.map((t, id) => ({id, name: t.name, layoutVersion: t.layoutVersion, roadVersion: t.roadVersion || 0})), limits: {players: 4, payloadBytes: 4096, inputsPerSecond: 60, snapshotHz: 20, reconnectMs: 10000, staleInputMs: 350}};
}
module.exports = {PROTOCOL, SIMULATION, PAINTS, DEFAULT_CONFIG, ProtocolError, fields, config, choice, input, roomCode, manifest, geometry, driving};
