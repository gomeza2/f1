import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'script.js'), 'utf8');

function sourceBetween(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1, `Marker not found: ${startMarker}`);
  assert.notEqual(end, -1, `Marker not found: ${endMarker}`);
  assert.ok(end > start, `Markers are in the wrong order: ${startMarker}`);
  return source.slice(start, end);
}

const definitionsSource = sourceBetween('const trackDefs=', 'const clamp=');
const trackDefs = new Function(`${definitionsSource}; return trackDefs;`)();

const helperSource = sourceBetween('const clamp=', 'const tracks=trackDefs.map');
const makeTrack = new Function(`${helperSource}; return makeTrack;`)();

const profilesSource = sourceBetween('const TRACK_SURFACES=', 'tracks.forEach');
const profiles = new Function(`${profilesSource}; return { TRACK_SURFACES, TRACK_BARRIERS };`)();

const tracks = trackDefs.map(makeTrack);
const legalSurfaces = new Set(['asphalt', 'dirt', 'grass', 'ice', 'volcanic', 'mixed', 'coastal']);
const legalBarriers = new Set(['full', 'half', 'corners', 'open']);

function orientation(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function segmentsCross(a, b, c, d) {
  const epsilon = 1e-7;
  return orientation(a, b, c) * orientation(a, b, d) < -epsilon
    && orientation(c, d, a) * orientation(c, d, b) < -epsilon;
}

assert.ok(tracks.length >= 14, `Expected at least 14 tracks, got ${tracks.length}`);
assert.equal(new Set(tracks.map(track => track.name)).size, tracks.length, 'Track names must be unique');
assert.equal(profiles.TRACK_SURFACES.length, tracks.length, 'Every track must have a surface profile');
assert.equal(profiles.TRACK_BARRIERS.length, tracks.length, 'Every track must have a barrier profile');

for (let index = 0; index < tracks.length; index++) {
  const track = tracks[index];
  assert.ok(legalSurfaces.has(profiles.TRACK_SURFACES[index]), `${track.name}: unknown surface profile`);
  assert.ok(legalBarriers.has(profiles.TRACK_BARRIERS[index]), `${track.name}: unknown barrier profile`);
  assert.ok(track.points.length >= 15, `${track.name}: too few control points`);
  assert.ok(track.samples.length >= track.points.length * 8, `${track.name}: sample generation failed`);
  assert.ok(Number.isFinite(track.length) && track.length > 500, `${track.name}: invalid track length`);

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const point of track.samples) {
    assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y), `${track.name}: non-finite sample`);
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  assert.ok(minX >= 0 && minY >= 0 && maxX <= 1000 && maxY <= 640,
    `${track.name}: track exceeds the 1000×640 canvas bounds`);

  const segments = track.samples;
  const count = segments.length;
  for (let i = 0; i < count; i++) {
    const a = segments[i];
    const b = segments[(i + 1) % count];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    assert.ok(length > 1e-5, `${track.name}: zero-length segment at ${i}`);

    // Adjacent path segments share endpoints by design and are excluded.
    for (let j = i + 3; j < count; j++) {
      if (i === 0 && j === count - 1) continue;
      if (segmentsCross(a, b, segments[j], segments[(j + 1) % count])) {
        assert.fail(`${track.name}: unintended centerline crossing between segments ${i} and ${j}`);
      }
    }
  }
}

console.log(`PASS: ${tracks.length} circuits, unique names, valid surface/barrier profiles, finite geometry, canvas bounds and no sampled centerline crossings.`);

