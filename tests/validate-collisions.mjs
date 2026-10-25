import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();
element('opponentCount').value='3';element('barrierMode').value='open';game.start('solo',0);
function minimumSeparation(){let result=Infinity;for(let i=0;i<game.cars.length;i++)for(let j=i+1;j<game.cars.length;j++)result=Math.min(result,Math.hypot(game.cars[i].x-game.cars[j].x,game.cars[i].y-game.cars[j].y));return result;}
// Resolving one pair must not leave a previously resolved pair interpenetrating.
for(const [i,c] of game.cars.entries()){game.placeCar(c,150+i*8,0);c.speed=0;}
game.resolveCollisions(1/60);
assert.ok(minimumSeparation()>22.95,'A four-car pile still interpenetrates after one collision step');
assert.ok(game.cars.every(c=>c.speed===0),'Depenetration generated speed');
// Same heading and speed: positional correction does not imply an impact.
for(const [i,c] of game.cars.entries()){game.placeCar(c,150+i*8,0);c.heading=0;c.speed=100;}
game.resolveCollisions(1/60);assert.ok(game.cars.every(c=>c.speed===100),'Parallel contact applied unrelated braking');
// A rear-end collision slows the closing car without accelerating the victim.
for(const c of game.cars)c.done=true;
const [a,b]=game.cars;a.done=b.done=false;a.x=400;a.y=300;b.x=420;b.y=300;a.heading=b.heading=0;a.speed=160;b.speed=60;
game.resolveCollisions(1/60);assert.ok(a.speed<160);assert.equal(b.speed,60);
// One physical impact has the same response at 30 and 120 FPS.
const speeds=[];
for(const dt of [1/30,1/120]){a.x=400;a.y=300;b.x=420;b.y=300;a.heading=0;b.heading=Math.PI;a.speed=b.speed=100;game.resolveCollisions(dt);speeds.push([a.speed,b.speed]);}
assert.deepEqual(speeds[0],speeds[1]);assert.ok(speeds[0].every(v=>v>=0&&v<30),'Head-on contact kept excessive speed');
// A pile-up at a rail must resolve both car and visible barrier contacts.
element('barrierMode').value='full';game.start('solo',0);
const rail=game.physicalBarriers.find(b=>b.kind==='rail'&&game.nearestOnTrack((b.a.x+b.b.x)/2,(b.a.y+b.b.y)/2).progress<200);
const x=(rail.a.x+rail.b.x)/2,y=(rail.a.y+rail.b.y)/2,loc=game.nearestOnTrack(x,y);
const len=Math.hypot(loc.x-x,loc.y-y),nx=(loc.x-x)/len,ny=(loc.y-y)/len;
for(const [i,c] of game.cars.entries()){c.x=x+nx*(14+i*9);c.y=y+ny*(14+i*9);c.heading=Math.atan2(rail.b.y-rail.a.y,rail.b.x-rail.a.x);c.speed=0;}
game.resolveCollisions(1/60);
for(const c of game.cars){assert.ok((c.x-x)*nx+(c.y-y)*ny>=12.95,'Another car pushed a car through the visible rail');assert.equal(c.speed,0);assert.ok(Number.isFinite(c.roadOffset));}
assert.ok(minimumSeparation()>22.95,'Cars remained trapped together against a rail');
console.log('PASS: four-car pile, no generated speed, parallel brush, rear-end/head-on impact, frame-independent response and rail pile-up.');

// A valid finish crossed by contact is counted once, with synchronized track position.
element('barrierMode').value='open';game.start('solo',0);game.cars.forEach(c=>c.done=true);game.tick(10);
const pushed=game.cars[0],pusher=game.cars[1];pushed.done=pusher.done=false;
game.placeCar(pushed,game.track.length-4,0);game.placeCar(pusher,game.track.length-12,0);
pushed.heading=pusher.heading=game.sampleAt(0).angle;pushed.speed=0;pusher.speed=120;
pushed.checkpointPasses=game.checkpoints.length;
game.resolveCollisions(1/60);assert.equal(pushed.lap,1,'Contact pushed a valid finisher over the line without recording it');
assert.ok(Math.abs(pushed.progress-game.nearestOnTrack(pushed.x,pushed.y).progress)<1e-6);
game.resolveCollisions(1/60);assert.equal(pushed.lap,1,'Stationary contact awarded a second lap');
console.log('PASS: contact movement keeps gate crossings, lap count and track position coherent.');
// Grass/runoff cannot start a stationary human car without input.
element('barrierMode').value='open';game.start('solo',0);game.setKeys({});
for(const offset of [60,100]){game.placeCar(game.cars[0],150,offset);game.cars[0].speed=0;game.physics(game.cars[0],0,1/30);assert.equal(game.cars[0].speed,0,'Runoff created speed without throttle');}
// All models can recover under ordinary steering/throttle after a stopped off-road incident.
for(const stage of [0,2,4])for(const model of Object.keys(game.CAR_MODELS)){
 game.start('solo',stage);game.cars.forEach(c=>c.done=true);const car=game.cars[1];car.done=false;car.model=model;
 game.placeCar(car,150,78);car.speed=0;let recovered=false;
 for(let frame=0;frame<1800;frame++){
  const x=car.x,y=car.y;game.physics(car,1,1/60);
  assert.ok(Math.hypot(car.x-x,car.y-y)<=game.CAR_MODELS[model].maxSpeed*game.WORLD_SPEED_SCALE/60+1e-6,'Recovery teleported the car');
  if(car.offroad<20){recovered=true;break;}
 }
 assert.ok(recovered,`${game.track.name}/${model}: failed to recover from stationary runoff`);
}
console.log('PASS: stationary runoff without added speed; physical recovery from rest with four models on asphalt, dirt and ice.');
