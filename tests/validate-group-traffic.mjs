import {assertOriginalModels} from './helpers/model-balance.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadGame} from './helpers/game-harness.mjs';
const baseline=JSON.parse(readFileSync(new URL('./fixtures/groups-0.53.json',import.meta.url),'utf8'));
const {game:g,element:e}=loadGame();e('opponentCount').value='3';
assert.equal(g.PHYSICS_VERSION,baseline.physics+1); // p6 human countersteer only; core source frozen by validate-countersteer.
assert.equal(g.WORLD_SPEED_SCALE,baseline.worldSpeed);
assertOriginalModels(g.CAR_MODELS,baseline.models);
for(const [current,previous] of [[g.AI_DRIVERS,baseline.drivers],[g.AI_PERSONALITIES,baseline.personalities]])assert.deepEqual(JSON.parse(JSON.stringify(current)),previous);
const materials=JSON.parse(JSON.stringify(g.TERRAIN_MATERIALS));delete materials.grass.road;assert.deepEqual(materials,baseline.materials); // Jungle 0.60 adds grass art only.
for(const t of g.tracks){if(['JUNGLE SPRINT','THUNDER VALLEY'].includes(t.name)&&t.layoutVersion===3)continue;const signature=createHash('sha256').update(JSON.stringify({points:t.points,samples:t.samples,worldScale:t.worldScale,layoutVersion:t.layoutVersion,roadProfile:t.roadProfile,roadVersion:t.roadVersion,surface:t.surface,defaultBarriers:t.defaultBarriers})).digest('hex');assert.equal(signature,baseline.tracks[t.name],t.name+': CPU work changed a course');}
function decision(c){return g.aiTraffic(c,g.nearestOnTrack(c.x,c.y),g.driverFor(c),1/30);}
function set(c,p,l){g.placeCar(c,p,l);c.speed=100;}
// The nearer leader must not cancel a side reservation, including small distance-order changes.
for(const sign of [-1,1]){
 g.start('solo',0);const [leader,car,side,distant]=g.cars;set(car,150,0);set(side,180,sign*26);set(distant,g.track.length/2,0);
 for(const p of [188,191,187,190]){set(leader,p,0);const d=decision(car);assert.equal(car.aiManeuver,car.aiTrafficStates[side.player]);assert.equal(car.aiManeuver.type,'alongside');assert.ok(d.lane*sign<=-5,'Leader erased overlap space');}
 leader.speed=0;assert.equal(decision(car).speedLimit,0,'Primary rival hid another blocked lane');
 const departed=car.aiManeuver;side.done=true;decision(car);assert.notEqual(car.aiManeuver,departed);assert.ok(!Object.hasOwn(car.aiTrafficStates,String(side.player)),'Finished rival kept a reservation');
 g.placeCar(car,150,0);assert.equal(car.aiManeuver,null);assert.deepEqual(Object.keys(car.aiTrafficStates),[]);
}
// Shared room for both flanks: fit between them or hold the occupied line and yield longitudinal room.
for(const width of [34,26]){
 g.start('solo',0);const [left,car,right,leader]=g.cars;for(const [c,p,l] of [[car,150,0],[left,180,-width],[right,180,width],[leader,188,0]])set(c,p,l);
 const original=g.cars.map(c=>[c.x,c.y,c.speed,c.heading]),d=decision(car);
 assert.deepEqual(g.cars.map(c=>[c.x,c.y,c.speed,c.heading]),original,'Planning moved a car or applied braking force');
 if(width===34){assert.ok(d.lane>=-6.01&&d.lane<=6.01);assert.ok(d.speedLimit>=100,'Available three-wide space triggered a brake');}
 else{assert.ok(Math.abs(d.lane)<1e-7,'Boxed car squeezed a rival');assert.ok(d.speedLimit<80);const speed=car.speed;g.physics(car,1,1/30);assert.ok(car.speed<speed);assert.ok(speed-car.speed<=(g.CAR_MODELS[car.model].braking+30)/30+1e-7,'Group yielded with extra braking force');}
}
console.log('PASS: mirrored overlap priority despite leader-distance jitter, braking for every rival, finished/reset cleanup, feasible opposing lanes and boxed-in hold/yield using shared physical braking; twelve historical routes/material physics/other model fields/driver settings preserved (Speed b1 checked); Jungle/Thunder have newer snapshots.');
if(!process.argv.includes('--focused')){
 let laps=0;const regressions=[];const cases=process.argv.includes('--high-rate')?baseline.cases.filter(c=>c.dt):baseline.cases;
 for(const old of cases){
  const dt=old.dt||baseline.dt;
  e('difficulty').value=old.level;g.start('solo',old.stage);g.cars[0].isAI=true;let contacts=0,off=0;
  for(let i=0;i<10800&&!g.cars.every(c=>c.done);i++){
   if(g.tick(dt))contacts++;for(const c of g.cars){assert.ok(Number.isFinite(c.speed)&&c.speed<=g.CAR_MODELS[c.model].maxSpeed);if(!c.done&&g.terrainAt(c.x,c.y).offroad)off++;}
  }
  assert.ok(g.cars.every(c=>c.lap===3&&c.lapTimes.length===3&&Number.isFinite(c.finishTime)),old.name+': invalid finish');
  assert.ok(Math.max(...g.cars.map(c=>c.finishTime))-Math.min(...g.cars.map(c=>c.finishTime))<18,'Grid misses normal finish deadline');
  const budget=old.stage===0&&dt===baseline.dt?Math.floor(old.contacts/2):old.contacts;if(contacts>budget)regressions.push(`${old.name}/${1/dt}Hz: contacts ${contacts} > ${budget}`);if(off>old.off)regressions.push(`${old.name}: off-road ${off} > ${old.off}`);
  const times=g.cars.map(c=>c.finishTime/3),mean=a=>a.reduce((x,y)=>x+y,0)/a.length;if(mean(times)>mean(old.times)*1.02)regressions.push(`${old.name}: mean ${mean(times).toFixed(3)} > ${(mean(old.times)*1.02).toFixed(3)} pace limit`);laps+=12;
  console.log(`GROUP ${old.name}/${old.level}/${Math.round(1/dt)}Hz: contact ${old.contacts} → ${contacts}, off-road ${old.off} → ${off}, mean laps ${times.map(t=>t.toFixed(2)).join('/')}.`);
 }
 assert.deepEqual(regressions,[],'Traffic regressions; original contact/off-road/pace budgets preserved');
 console.log(`PASS: ${cases.length} fixed four-car scenarios/${laps} valid laps, frozen contact bounds including Sunset reduction at 30 Hz and unchanged 60 Hz reference, shared speed caps and <=2% aggregate pace loss per grid. Human competition remains unverified.`);
}
