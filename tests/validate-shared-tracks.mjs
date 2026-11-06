import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {loadGame} from './helpers/game-harness.mjs';
import {withoutSharedTracks} from './helpers/without-shared-tracks.mjs';
const require=createRequire(import.meta.url),api=require('../track-core.js'),core=api.create();
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8');
const baseline=process.env.TRACK_SOURCE_BASELINE?readFileSync(process.env.TRACK_SOURCE_BASELINE,'utf8'):withoutSharedTracks(source);
const {game:g,element:e}=loadGame({sourceOverride:baseline});
const flat=value=>Object.fromEntries(Object.entries(value));
const plain=value=>JSON.parse(JSON.stringify(value)),hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
assert.equal(api.apiVersion,1);assert.deepEqual(plain(core.tracks),plain(g.tracks),'Circuit registry changed');
assert.equal(core.tracks.length,14);assert.equal(core.tracks.filter(t=>t.roadProfile).length,12);
let configurations=0,queries=0,materials=0,segments=0;
for(let stage=0;stage<14;stage++){
 const item=core.tracks[stage];
 for(const profile of ['auto','full','half','corners','open']){
  e('barrierMode').value=profile;g.start('solo',stage);const world=core.createWorld(stage,profile);
  assert.equal(world.track,item);assert.deepEqual(plain(core.checkpointsForTrack(item)),plain(g.checkpoints));
  assert.equal(hash(world.contours),hash(g.barrierContoursForTrack()),stage+'/'+profile+': contour');
  assert.equal(hash(world.physicalBarriers),hash(g.physicalBarriers),stage+'/'+profile+': physical geometry');
  assert.equal(hash(world.guardrailPaths),hash(g.guardrailPaths),stage+'/'+profile+': visible geometry');
  segments+=world.physicalBarriers.length;
  const distances=[-item.length-1,-1,0,item.length,item.length+1,...Array.from({length:61},(_,i)=>item.length*i/61)];
  for(const d of distances){
   const p=core.sampleAt(d,item),section=core.roadSectionAt(d,item);
   assert.deepEqual(p,flat(g.sampleAt(d)));assert.deepEqual(section,flat(g.roadSectionAt(d)));
   assert.equal(core.surfaceAtProgress(d,item),g.surfaceAtProgress(d));assert.equal(core.barrierRadiusAt(d,item),g.barrierRadiusAt(d));
   assert.equal(world.guardrailActive(d),g.guardrailActive(d));assert.deepEqual(world.curvatureAt(d),flat(g.curvatureAt(d)));
   for(const offset of [-1,0,1].map(side=>side*(section.halfWidth+section.kerb+15))){
    const x=p.x-Math.sin(p.angle)*offset,y=p.y+Math.cos(p.angle)*offset,loc=core.nearestOnTrack(x,y,null,item);
    assert.deepEqual(loc,flat(g.nearestOnTrack(x,y)));assert.deepEqual(world.terrainAt(x,y,loc),flat(g.terrainAt(x,y)));materials++;
    const indices=core.runoffBuckets(item).get(Math.floor(x/128)+','+Math.floor(y/128));
    if(indices)assert.deepEqual(core.nearestOnTrack(x,y,indices,item),loc,'Spatial road query lost a nearby segment');
    queries++;
   }
   // Verify the private collision index against independent bounds over original capsules.
   const bx=Math.floor(p.x/32),by=Math.floor(p.y/32),expected=Array.from(g.physicalBarriers).filter(b=>bx>=Math.floor((Math.min(b.a.x,b.b.x)-24)/32)&&bx<=Math.floor((Math.max(b.a.x,b.b.x)+24)/32)&&by>=Math.floor((Math.min(b.a.y,b.b.y)-24)/32)&&by<=Math.floor((Math.max(b.a.y,b.b.y)+24)/32));
   assert.equal(hash(world.barriersNear(p.x,p.y)),hash(expected),stage+'/'+profile+': spatial collision index');
  }
  configurations++;
 }
 console.log(JSON.stringify({stage,name:item.name,length:item.length,profiles:5}));
}
// Same core, different tracks/profiles: immutable caches may be shared; mutable indexes cannot leak.
const a=core.createWorld(0,'full'),b=core.createWorld(0,'open'),c=core.createWorld(10,'half');
assert.strictEqual(a.contours,b.contours);assert.ok(a.physicalBarriers.length);assert.equal(b.physicalBarriers.length,0);
const snapshot=hash([a.features,a.physicalBarriers,c.features,c.physicalBarriers]);
for(let i=0;i<500;i++){a.terrainAt(100+i,220);c.terrainAt(100+i,220);b.barriersNear(400,400);}
assert.equal(hash([a.features,a.physicalBarriers,c.features,c.physicalBarriers]),snapshot);
assert.throws(()=>{core.tracks[0].samples[0].x=0},TypeError);assert.throws(()=>a.physicalBarriers.push({}),TypeError);assert.throws(()=>{a.contours[0].points[0].x=0},TypeError);
assert.throws(()=>a.features.braking.push({}),TypeError);assert.throws(()=>core.createWorld(-1),RangeError);assert.throws(()=>core.createWorld('0'),RangeError);assert.throws(()=>core.createWorld(0,'__proto__'),RangeError);
const indices=core.runoffBuckets().get('1,1');if(indices)assert.throws(()=>indices.push(999),TypeError);assert.equal(core.runoffBuckets().set,undefined);
const standalone={module:{exports:{}}};for(const name of ['document','window','localStorage','AudioContext','requestAnimationFrame','Date'])Object.defineProperty(standalone,name,{get(){throw Error('Geometry accessed '+name)}});
vm.createContext(standalone);vm.runInContext(readFileSync(new URL('../track-core.js',import.meta.url),'utf8'),standalone);
const nodeOnly=standalone.module.exports.create(),world=nodeOnly.createWorld(10,'full');assert.ok(world.physicalBarriers.length);assert.deepEqual(plain(nodeOnly.tracks),plain(core.tracks));
console.log(JSON.stringify({configurations,queries,materials,segments}));
console.log('PASS: 14 registries (declared Rally/Champion v3)/70 profiles exactly match the migrated legacy geometry, sections/materials/checkpoints/contours/visible rails/capsules/spatial queries; immutable owned geometry and independent profile contexts run without browser/storage/clock. Not full race isolation or online rooms.');
