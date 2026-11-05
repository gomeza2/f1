import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {readFileSync} from 'node:fs';import {loadGame} from './helpers/game-harness.mjs';import {withoutRaceSession} from './helpers/without-race-session.mjs';
const require=createRequire(import.meta.url),api=require('../race-session.js'),geometry=require('../track-core.js').create(),driving=require('../driving-core.js').create(),rulesModule=require('../race-rules.js');
const deps={geometry,driving,rulesModule},plain=x=>JSON.parse(JSON.stringify(x)),make=(stage=0,extra={})=>api.create({...deps,world:geometry.createWorld(stage,'open'),...extra});
assert.equal(api.apiVersion,1);const source=readFileSync(new URL('../script.js',import.meta.url),'utf8'),baseline=process.env.SESSION_SOURCE_BASELINE?readFileSync(process.env.SESSION_SOURCE_BASELINE,'utf8'):withoutRaceSession(source);assert.equal(withoutRaceSession(source),baseline,'Unrelated source edit outside declared migration');
assert.doesNotMatch(readFileSync(new URL('../race-session.js',import.meta.url),'utf8'),/\b(document|window|localStorage|navigator|performance|Date)\b|Math\.random/);
const empty=make();assert.throws(()=>empty.start(),/empty/);assert.throws(()=>make(0,{laps:0}));assert.throws(()=>make(0,{raceId:''}));assert.throws(()=>empty.createVehicle({model:'unknown'}));assert.throws(()=>empty.createVehicle({player:-1}));const v=empty.createVehicle();assert.throws(()=>empty.setVehicles([v,v]),/Duplicate/);assert.throws(()=>empty.setVehicles([{...v,model:undefined}]),/Invalid/);assert.throws(()=>empty.setVehicles([{...v,x:NaN}]),/finite/);empty.setVehicles([v]);v.x=900;assert.equal(empty.state.cars[0].x,0,'Grid data shared caller state');empty.start(3);assert.throws(()=>empty.setVehicles([v]),/locked/);const zero=empty.snapshot();empty.frame(1,[{throttle:1}]);assert.equal(empty.state.elapsed,0);assert.equal(empty.state.countdownRemaining,2);empty.setPaused(true);const pause=empty.snapshot();empty.frame(60);assert.deepEqual(empty.snapshot(),pause);empty.setPaused(false);empty.frame(2);assert.equal(empty.state.countdownRemaining,0);assert.equal(empty.state.elapsed,0);assert.equal(empty.state.goFlashRemaining,.55);assert.equal(empty.advanceFrame(5),6);assert.ok(Math.abs(empty.state.elapsed-.1)<1e-12);for(const dt of [NaN,Infinity,-1,0])assert.equal(empty.advanceFrame(dt),0);empty.restart(0);assert.equal(empty.state.elapsed,0);assert.equal(empty.state.cars[0].x,zero.cars[0].x);assert.equal(empty.state.cars[0].lap,0);const detached=empty.snapshot();detached.cars[0].x=999;assert.notEqual(empty.state.cars[0].x,999);empty.stop('menu');assert.equal(empty.advanceFrame(1),0);
// CJS/default human commands versus authentic prior browser orchestration, at every action boundary.
const {game:g,element:e}=loadGame({sourceOverride:baseline});const compareFields=['x','y','heading','speed','yawRate','steer','drift','reverseHeld','wheelTravel','braking','handbrake','progress','raceProgress','raceOffset','lap','lapTimes','nextCheckpoint','checkpointPasses','done','finishTime','flash'];
let cases=0,steps=0;
for(const stage of [0,2,4,10])for(const model of Object.keys(driving.rules.models)){
 e('eventType').value='trial';e('carModel').value=model;e('barrierMode').value='open';g.start('solo',stage);g.setCountdown(0);g.placeCar(g.cars[0],400,0);g.cars[0].speed=150;
 const session=make(stage);session.setVehicles([plain(g.cars[0])]);session.start(0);
 for(const [keys,frames] of [[['w'],30],[['w','d',' '],12],[['w'],20],[['s'],90],[['s','a'],25],[['w'],45]]){
  g.setKeys(Object.fromEntries(keys.map(k=>[k,true])));const input={throttle:keys.includes('w')?1:0,brake:keys.includes('s')?1:0,steering:keys.includes('d')?1:keys.includes('a')?-1:0,hand:keys.includes(' ')};
  for(let n=0;n<frames;n++){g.tick(1/60);session.advanceFrame(1/60,[input]);steps++;}
  for(const key of compareFields)assert.deepEqual(plain(session.state.cars[0][key]),plain(g.cars[0][key]),stage+'/'+model+'/'+key);
 }
 cases++;
}
// Contact cooldown/order is physical state: compare every step against the prior orchestration.
let contactCases=0;const impactSources=new Set();
for(const stage of [0,4])for(const profile of ['open','full','half'])for(const speed of [-28,0,160]){
 e('eventType').value='quick';e('barrierMode').value=profile;e('carModel').value='balanced';e('localPlayerCount').value='2';g.start('duo',stage);g.setCountdown(0);g.setKeys({});g.placeCar(g.cars[0],400,0);g.placeCar(g.cars[1],410,0);g.cars[0].speed=speed;g.cars[1].speed=0;
 const r=api.create({...deps,world:geometry.createWorld(stage,profile),onEvent:event=>{if(event.type==='impact')impactSources.add(event.source);}});r.setVehicles(plain(g.cars));r.start(0);
 for(let n=0;n<60;n++){g.tick(1/60);r.advanceFrame(1/60);for(let k=0;k<2;k++)for(const field of compareFields)assert.deepEqual(plain(r.state.cars[k][field]),plain(g.cars[k][field]),'car contact '+stage+'/'+profile+'/'+speed+'/'+field);}
 contactCases++;
}
for(const stage of [0,4])for(const profile of ['full','half']){
 e('barrierMode').value=profile;g.start('duo',stage);g.setCountdown(0);g.setKeys({w:true});g.cars[1].done=true;
 const wall=g.physicalBarriers.find(b=>b.kind==='rail')||g.physicalBarriers[0],x=(wall.a.x+wall.b.x)/2,y=(wall.a.y+wall.b.y)/2,near=g.nearestOnTrack(x,y),length=Math.hypot(x-near.x,y-near.y),nx=(x-near.x)/length,ny=(y-near.y)/length;
 Object.assign(g.cars[0],{x:x-nx*30,y:y-ny*30,heading:Math.atan2(ny,nx),speed:160});
 const r=api.create({...deps,world:geometry.createWorld(stage,profile),onEvent:event=>{if(event.type==='impact')impactSources.add(event.source);}});r.setVehicles(plain(g.cars));r.start(0);
 for(let n=0;n<60;n++){g.tick(1/60);r.advanceFrame(1/60,[{throttle:1,brake:0,steering:0,hand:false}]);for(const field of compareFields)assert.deepEqual(plain(r.state.cars[0][field]),plain(g.cars[0][field]),'barrier contact '+stage+'/'+profile+'/'+field);}
 contactCases++;
}
assert.deepEqual([...impactSources].sort(),['barrier','car']);
// Test-only navigation supplies commands; physics, contacts and gates are always the production modules.
function navigation(world){return (car,i,dt,before,bend)=>{
 const look=45+Math.abs(car.speed)*.2,p=geometry.sampleAt(before.progress+look,world.track),angle=Math.atan2(p.y-car.y,p.x-car.x)-car.heading,error=Math.atan2(Math.sin(angle),Math.cos(angle));
 const material=world.terrainAt(car.x,car.y).material,handling=driving.vehicleHandling(Math.abs(car.speed),driving.rules.models[car.model],material,bend.safeSpeed,0,false),yaw=error/Math.max(.3,look/Math.max(35,Math.abs(car.speed)*driving.rules.worldSpeedScale));
 car.steer+=(Math.max(-1,Math.min(1,yaw/handling.turnRate+error*.2))-car.steer)*Math.min(1,dt*14);
 let target=Math.min(180,bend.safeSpeed*.9,world.curvatureAt(before.progress+90).safeSpeed*.9);if(Math.abs(error)>1)target=65;
 return {throttle:car.speed<target-2?1:0,brake:car.speed>target+2?1:0,hand:false};
 };}
function fullRace(id,stage){const events=[],world=geometry.createWorld(stage,'open'),race=api.create({...deps,world,raceId:id,controller:navigation(world),onEvent:event=>events.push(event)});const grid=[0,1].map(player=>{const car=race.createVehicle({player}),d=4+55*player,p=geometry.sampleAt(d,world.track),lane=player?15:-15;Object.assign(car,{x:p.x-Math.sin(p.angle)*lane,y:p.y+Math.cos(p.angle)*lane,heading:p.angle,progress:d,previousProgress:d,raceProgress:d});return car;});race.setVehicles(grid);race.start(0);return {race,events};}
function runSingle(id,stage){const scene=fullRace(id,stage);for(let n=0;n<18000&&!scene.race.finishState().closed;n++)scene.race.advanceFrame(1/60);assert.ok(scene.race.state.cars.every(c=>c.done&&c.lap===3),'Serial race incomplete');return scene;}
const serialA=runSingle('A',0),serialB=runSingle('B',2),a=fullRace('A',0),b=fullRace('B',2);
for(let n=0;n<18000&&(!a.race.finishState().closed||!b.race.finishState().closed);n++){
 if(n===80){const before=b.race.snapshot();a.race.setPaused(true);for(let k=0;k<30;k++)a.race.advanceFrame(1/60);assert.deepEqual(b.race.snapshot(),before,'A pause affected B');a.race.setPaused(false);}
 if(!a.race.finishState().closed)a.race.advanceFrame(1/60);if(!b.race.finishState().closed)b.race.advanceFrame(1/60);
}
for(const [interleaved,serial] of [[a,serialA],[b,serialB]]){
 assert.ok(interleaved.race.state.cars.every(c=>c.done&&c.lapTimes.length===3),'Interleaved race incomplete');
 const actual=interleaved.race.snapshot(),expected=serial.race.snapshot();delete actual.sequence;delete expected.sequence;assert.deepEqual(actual,expected,'Interleaving altered physical state or race timing');assert.deepEqual(interleaved.race.results(),serial.race.results());
 const results=interleaved.race.results();assert.ok(Object.isFrozen(results)&&results.every(row=>Object.isFrozen(row)&&Object.isFrozen(row.lapTimes)));assert.deepEqual(results.map(row=>row.points),[25,18]);
 assert.ok(interleaved.events.every((event,index)=>Object.isFrozen(event)&&event.sequence===index+1&&event.raceId===interleaved.race.config.raceId));
 assert.equal(interleaved.events.filter(event=>event.type==='lap').length,6);assert.ok(interleaved.events.filter(event=>event.type==='checkpoint').length>=30);
 const done=interleaved.race.snapshot();assert.equal(interleaved.race.advanceFrame(1),0);assert.deepEqual(interleaved.race.snapshot(),done,'Closed race kept accumulating time');
 console.log(JSON.stringify({race:interleaved.race.config.raceId,finish:results.map(row=>row.finishTime),laps:results.map(row=>row.lapTimes),events:interleaved.events.length}));
}
assert.notEqual(a.race.state.cars,b.race.state.cars);assert.notEqual(a.race.state.cars[0].lapTimes,b.race.state.cars[0].lapTimes);const beforeB=b.race.snapshot();a.race.restart(0);assert.deepEqual(b.race.snapshot(),beforeB,'A restart affected B');assert.equal(a.race.state.elapsed,0);
console.log(`PASS: ${cases} model/material cases, ${steps} steps and 96 action snapshots plus ${contactCases} contact/cooldown cases match pre-extraction orchestration; 24 valid laps across serial/interleaved two-car races, independent clocks/gates/events/results/pause/restart, detached snapshots, frozen results, grid/clock bounds and countdown. Navigation is a test driver, not new production AI or online transport.`);
