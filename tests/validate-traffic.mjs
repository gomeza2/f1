import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame(),dt=1/60;
const driver=game.AI_DRIVERS.normal;
function at(car,progress,lane,lap=0){
 const p=game.sampleAt(progress);
 car.x=p.x-Math.sin(p.angle)*lane;car.y=p.y+Math.cos(p.angle)*lane;
 car.heading=p.angle;car.progress=((progress%game.track.length)+game.track.length)%game.track.length;
 car.lap=lap;car.raceProgress=lap*game.track.length+car.progress;
}
function decision(car){return game.aiTraffic(car,game.nearestOnTrack(car.x,car.y),driver,dt)}
function setup(){game.start('solo',0);return game.cars}
let [other,ai]=setup();at(ai,150,0);at(other,210,0);ai.speed=120;other.speed=50;
const first=decision(ai);assert.equal(ai.aiManeuver.type,'pass');const side=ai.aiManeuver.side;
for(let frame=0;frame<90;frame++){
 at(other,210,frame%2?-.5:.5);decision(ai);
 assert.equal(ai.aiManeuver.side,side,'CPU changed passing side when rival jittered');
}
assert.ok(first.speedLimit<ai.speed,'Closing traffic did not limit speed');
// An unsuccessful attack has a bounded commitment and cannot immediately restart.
ai.aiManeuver.age=8.1;decision(ai);assert.equal(ai.aiManeuver.type,'follow');
assert.ok(ai.aiManeuver.cooldown>0);decision(ai);assert.equal(ai.aiManeuver.type,'follow');
// Restore the original attack before testing overlap.
ai.aiManeuver={type:'pass',side,age:1,cooldown:0};
// Once the cars overlap, a rival moving sideways cannot trigger a crossing defence.
at(ai,200,side*23);at(other,210,-side*4);decision(ai);
assert.equal(ai.aiManeuver.type,'alongside');assert.equal(ai.aiManeuver.side,side);
assert.equal(Math.sign(decision(ai).lane),side);
// Defending commits one side rather than copying an approaching rival's movements.
[other,ai]=setup();at(ai,230,0);at(other,160,15);ai.speed=80;other.speed=120;decision(ai);
assert.equal(ai.aiManeuver.type,'defend');const defenseSide=ai.aiManeuver.side;
at(other,160,-15);decision(ai);assert.equal(ai.aiManeuver.side,defenseSide);
// The defensive track side is not permission to squeeze a car on the outside.
at(ai,200,18);at(other,210,28);const overlapDefense=decision(ai);
assert.equal(ai.aiManeuver.type,'alongside');assert.ok(overlapDefense.lane<5,'Defender squeezed occupied outside lane');
// Identical physical spacing, different lap counts: still brake for a lapped car.
[other,ai]=setup();at(ai,150,0,1);at(other,190,0,0);ai.speed=100;other.speed=0;
assert.equal(decision(ai).speedLimit,0);assert.equal(ai.aiManeuver.type,'pass');
// Do not defend against a faster car one lap ahead coming from behind.
[other,ai]=setup();at(ai,230,0,0);at(other,160,15,1);ai.speed=80;other.speed=120;
decision(ai);assert.equal(ai.aiManeuver.type,'yield');
// Traffic across the start/finish seam must be recognized by physical distance.
[other,ai]=setup();at(ai,game.track.length-25,0,0);at(other,15,0,1);ai.speed=100;other.speed=0;
assert.ok(decision(ai).speedLimit<100);assert.notEqual(ai.aiManeuver.type,'defend');
// A car on a nearby but distant section of the track must not cause braking.
[other,ai]=setup();at(ai,150,0);at(other,game.track.length*.5,0);assert.equal(decision(ai).speedLimit,Infinity);
// Equal pace is not an overtaking opportunity or a defensive threat.
[other,ai]=setup();at(ai,150,0);at(other,210,0);ai.speed=100;other.speed=100;
decision(ai);assert.equal(ai.aiManeuver.type,'follow');
[other,ai]=setup();at(ai,230,0);at(other,160,0);ai.speed=100;other.speed=100;
decision(ai);assert.equal(ai.aiManeuver.type,'clear');
// Starting stationary on the grid must not trigger an unnecessary attack.
[other,ai]=setup();decision(other);assert.equal(other.aiManeuver.type,'follow');
// Clear stale intent on a restart or position reset.
game.placeCar(ai,150,0);assert.equal(ai.aiManeuver,null);
// A passing side must have enough road width before the cars overlap.
[other,ai]=setup();at(ai,150,27);at(other,210,20);ai.speed=120;other.speed=50;
assert.equal(decision(ai).lane<0,true,'CPU committed to a passing lane blocked by the road edge');
// Reserve space from the occupied lane while side by side, retaining physical side.
at(ai,200,-24);at(other,210,0);const reserved=decision(ai);
assert.ok(reserved.lane<=-25,'CPU left insufficient lateral room during overlap');
// A trailing car trapped against the outside edge must leave longitudinal space.
[other,ai]=setup();at(ai,200,27);at(other,208,12);ai.speed=100;other.speed=90;
assert.ok(decision(ai).speedLimit<other.speed,'CPU squeezed a rival when the edge left no passing room');
// A parallel rival one lane over is safe; the same car cutting in needs braking.
[other,ai]=setup();at(ai,150,0);at(other,180,32);ai.speed=120;other.speed=80;
assert.equal(decision(ai).speedLimit,Infinity,'Parallel occupied lane caused unnecessary braking');
other.heading-=.65;
const approach=game.trafficApproach(ai,other);
assert.ok(approach.time>0&&approach.time<=.75&&approach.clearance<30);
assert.ok(decision(ai).speedLimit<other.speed,'CPU ignored a predicted cut-in from another lane');
// Follow the actual steering arc rather than treating a turning car as a straight ray.
for(const direction of [-1,1]){
 const radius=100*game.WORLD_SPEED_SCALE/Math.PI;
 const curve=game.trafficApproach({x:0,y:0,heading:0,speed:100,yawRate:direction*Math.PI},
  {x:radius,y:direction*radius,heading:0,speed:0});
 assert.ok(curve.clearance<1e-6 && curve.time===.5,'Predicted approach ignored the current turning arc');
}
// Diverging velocities must not be interpreted as an imminent contact.
other.heading+=1.3;
assert.equal(decision(ai).speedLimit,Infinity,'CPU braked for a diverging car');
// Stationary/identical velocity prediction remains finite, with no division by zero.
assert.equal(game.trafficApproach({x:0,y:0,heading:0,speed:0},{x:30,y:0,heading:0,speed:0}).clearance,30);
console.log('PASS: predictive cut-in braking, free passing lane, persistent passing, overlap space, committed defence, lapping, yielding, finish seam, unrelated sections and reset.');

// Real physics: move past a stationary obstacle on a straight without contact.
for(const lap of [0,1]){
 [other,ai]=setup();at(ai,110,0,lap);at(other,170,0,0);ai.speed=90;
 let passed=false,minDistance=Infinity;
 for(let frame=0;frame<15/dt;frame++){
  game.physics(ai,1,dt);
  const distance=Math.hypot(other.x-ai.x,other.y-ai.y);minDistance=Math.min(minDistance,distance);
  assert.ok(distance>=23,'CPU contacted stationary rival');
  assert.ok(ai.offroad<42,'CPU left the road while passing');
  if(ai.progress>other.progress+40){passed=true;break}
 }
 assert.ok(passed,`CPU failed to pass stationary ${lap?'lapped car':'rival'}`);
 console.log(`PASS: physical overtake (${lap?'lapped':'same lap'}), minimum separation ${minDistance.toFixed(1)}.`);
}

// Two cars use the real controller and shared physics for complete traffic races.
const stages=process.argv.includes('--focused')?[]:game.tracks.map((_,index)=>index);
const baseline=JSON.parse(readFileSync(new URL('./fixtures/traffic-0.26.json',import.meta.url),'utf8'));
let totalContacts=0;
for(const stage of stages){
 game.start('solo',stage);game.cars[0].isAI=true;
 let contacts=0,maxOffset=0;
 for(let frame=0;frame<300*30&&!game.cars.every(car=>car.done);frame++){
  if(game.tick(1/30))contacts++;
  for(const car of game.cars){assert.ok(Number.isFinite(car.x)&&Number.isFinite(car.speed));maxOffset=Math.max(maxOffset,car.offroad);assert.ok(car.offroad<42,`${game.track.name}: traffic pushed a car off the road`)}
 }
 assert.ok(game.cars.every(car=>car.lap===3),`${game.track.name}: traffic prevented a complete race`);
 if([0,1,2].includes(stage))assert.equal(contacts,0,`${game.track.name}: reference two-car overlap contacts returned`);
 totalContacts+=contacts;
 console.log(`PASS: ${game.track.name}, two finishers, max offset ${maxOffset.toFixed(1)}, contact frames ${contacts}.`);
}

if(stages.length){
 const previous=Object.values(baseline.contactFrames).reduce((a,b)=>a+b,0);
 assert.ok(totalContacts<=previous*.5,`Traffic benchmark did not halve contact frames: ${totalContacts} vs ${previous}`);
 console.log(`PASS: contact frames reduced from ${previous} to ${totalContacts} across 14 races (84 valid laps); this is a fixed AI benchmark, not proof of collision-free human play.`);
}
