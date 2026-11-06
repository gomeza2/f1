import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {analyzeTrackWidth} from './helpers/track-geometry.mjs';
import {sampleTrackShape,normalizedShapeDistance} from './helpers/track-shape.mjs';
import {assertKnownTrackRevision} from './helpers/track-revisions.mjs';
const require=createRequire(import.meta.url),g=require('../track-core.js').create(),t=g.tracks[9],old=JSON.parse(readFileSync(new URL('./fixtures/champion-0.85.json',import.meta.url),'utf8'));
const source=readFileSync(new URL('../track-core.js',import.meta.url),'utf8'),pattern=/\{name:'CHAMPION ROAD'.*?\}(?=\n)/,priorSource=source.replace(pattern,old.definition),module={exports:{}};
new Function('module',priorSource)(module);const prior=module.exports.create();
if(process.env.CHAMPION_TRACK_BASELINE)assert.equal(priorSource,readFileSync(process.env.CHAMPION_TRACK_BASELINE,'utf8'),'Changed geometry/other definitions outside Champion');
assertKnownTrackRevision(t);assert.equal(t.name,'CHAMPION ROAD');assert.equal(t.layoutVersion,3);assert.equal(t.roadVersion,1);assert.equal(t.surface,'asphalt');assert.equal(t.defaultBarriers,'corners');assert.equal(t.worldWidth,2100);assert.equal(t.worldHeight,1344);assert.ok(t.length>8000&&t.length<8400);assert.equal(prior.tracks[9].length,old.oldLength);
const signature=t=>JSON.stringify({points:t.points,samples:t.samples,worldScale:t.worldScale,layoutVersion:t.layoutVersion,roadProfile:t.roadProfile,roadVersion:t.roadVersion,surface:t.surface,defaultBarriers:t.defaultBarriers,dirtRanges:t.dirtRanges});
for(const other of g.tracks.filter((_,i)=>i!==9))assert.equal(createHash('sha256').update(signature(other)).digest('hex'),old.otherTracks[other.name],other.name+': unrelated route changed');
const shape=sampleTrackShape(t),change=normalizedShapeDistance(shape,sampleTrackShape(prior.tracks[9])),nearest=Math.min(...g.tracks.filter((_,i)=>i!==9).map(o=>normalizedShapeDistance(shape,sampleTrackShape(o))));assert.ok(change>.15,'Only enlarged the same centerline');assert.ok(nearest>.25,'New shape too close to another track');
const geometry=analyzeTrackWidth(t,d=>g.roadHalfWidthAt(d,t));assert.ok(geometry.roadMargin>40&&geometry.clearance>40,JSON.stringify(geometry));
const gates=g.checkpointsForTrack(t);assert.equal(gates.length,12);const distances=[0,...gates.map(c=>c.progress),t.length];assert.ok(distances.slice(1).every((d,i)=>d>distances[i]&&d-distances[i]<=650));
let narrow=0,wide=0,piano=0,plain=0;
for(let d=0;d<t.length;d+=5){const a=g.roadSectionAt(d,t),b=g.roadSectionAt(d+5,t);assert.ok(a.halfWidth>=36&&a.halfWidth<=60);assert.ok(a.kerb>=0&&a.kerb<=6);assert.ok(Math.abs(a.halfWidth-b.halfWidth)<1&&Math.abs(a.kerb-b.kerb)<1);assert.equal(g.surfaceAtProgress(d,t),'asphalt');if(a.halfWidth<40)narrow++;if(a.halfWidth>54)wide++;if(a.kerb>5.5)piano++;if(a.kerb<.5)plain++;}
assert.ok(narrow>80&&wide>200&&piano>100&&plain>400,'Sections differ only at isolated knots');
let minimumBarrierClearance=Infinity;
for(const profile of ['auto','open','full','half','corners']){
 const world=g.createWorld(9,profile);if(profile==='open')assert.equal(world.physicalBarriers.length,0);
 for(const barrier of world.physicalBarriers)for(const point of [barrier.a,barrier.b,{x:(barrier.a.x+barrier.b.x)/2,y:(barrier.a.y+barrier.b.y)/2}]){const p=g.nearestOnTrack(point.x,point.y,null,t),clearance=p.distance-g.roadHalfWidthAt(p.progress,t);minimumBarrierClearance=Math.min(minimumBarrierClearance,clearance);assert.ok(clearance>6,'Barrier crosses legal road: '+clearance);}
 for(const gate of gates){const p=g.nearestOnTrack(gate.x,gate.y,null,t);assert.ok(p.distance<1e-6);assert.equal(gate.halfWidth,g.roadHalfWidthAt(gate.progress,t));assert.equal(world.terrainAt(gate.x,gate.y).offroad,false);}
}
console.log(JSON.stringify({length:t.length,oldLength:old.oldLength,change,nearest,geometry,gates:gates.length,narrowSamples:narrow,wideSamples:wide,pianoSamples:piano,plainSamples:plain,minimumBarrierClearance}));
console.log('PASS: Champion 72–120 variable road width, distributed kerb/plain sectors, 12 reachable ordered gates, five barrier profiles, independent full-width clearance; thirteen routes and geometry engine unchanged. No claim of human balance.');
