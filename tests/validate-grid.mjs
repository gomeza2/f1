import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();
element('opponentCount').value='3';game.start('solo',0);
assert.equal(game.cars.length,4);assert.equal(game.cars.filter(c=>c.isAI).length,3);
assert.equal(new Set(game.cars.map(c=>c.color)).size,4);
assert.equal(new Set(game.cars.filter(c=>c.isAI).map(c=>c.personality)).size,3);
const profiles=game.cars.slice(1).map(c=>game.driverFor(c));
assert.ok(profiles[1].attackGap>profiles[0].attackGap&&profiles[1].closing<profiles[0].closing);
assert.ok(profiles[2].response>profiles[0].response&&profiles[2].brakingMargin>profiles[0].brakingMargin);
assert.ok(profiles.every(p=>p.pace<=1&&p.brakingMargin<=1));
// The physically relevant opponent must not depend on its array position.
const [human,first,second,third]=game.cars;
game.placeCar(human,game.track.length/2,0);game.placeCar(first,150,0);game.placeCar(second,190,0);game.placeCar(third,game.track.length*.7,0);
first.speed=100;second.speed=0;
assert.equal(game.aiTraffic(first,game.nearestOnTrack(first.x,first.y),game.driverFor(first),1/60).speedLimit,0);
// A safe nearest car cannot hide another car blocking the lane farther ahead.
game.placeCar(first,150,0);game.placeCar(human,175,32);game.placeCar(second,190,0);
first.speed=human.speed=100;second.speed=0;
assert.equal(game.aiTraffic(first,game.nearestOnTrack(first.x,first.y),game.driverFor(first),1/60).speedLimit,0);
game.placeCar(human,game.track.length/2,0);
// Personalities must alter an overtaking decision in an identical situation.
game.placeCar(first,150,0);game.placeCar(second,210,0);first.speed=103;second.speed=100;
first.personality='racer';game.aiTraffic(first,game.nearestOnTrack(first.x,first.y),game.driverFor(first),1/60);
assert.equal(first.aiManeuver.type,'follow');
first.personality='attacker';game.aiTraffic(first,game.nearestOnTrack(first.x,first.y),game.driverFor(first),1/60);
assert.equal(first.aiManeuver.type,'pass');first.personality='racer';
// Contacts involve every pair and cannot accelerate a stationary car.
for(const c of game.cars)game.placeCar(c,300+c.player*100,0);
second.x=third.x-10;second.y=third.y;second.speed=third.speed=0;
game.resolveCollisions(1/60);
assert.ok(Math.hypot(second.x-third.x,second.y-third.y)>=23-1e-6);
assert.equal(second.speed,0);assert.equal(third.speed,0);
// Finished cars are ranked by actual finish, then unfinished cars by race progress.
human.done=true;human.finishTime=80;first.done=true;first.finishTime=75;
second.raceProgress=300;third.raceProgress=400;
assert.deepEqual(Array.from(game.raceClassification(),c=>c.player),[1,0,3,2]);
game.awardPoints();assert.equal(game.championship.rival,25);assert.equal(game.championship.player1,18);
assert.equal(game.championship.rival2,0);assert.equal(game.championship.rival3,0);
const seasonPoints=game.championship.player1;
game.start('solo',1,true);assert.equal(game.championship.player1,seasonPoints);
game.start('solo',0);game.cars.forEach((c,index)=>{c.done=true;c.finishTime=60+index;});game.awardPoints();
assert.equal(game.championship.player1,25);assert.equal(game.championship.rival,18);
assert.equal(game.championship.rival2,15);assert.equal(game.championship.rival3,12);
for(const count of [1,2,3]){element('opponentCount').value=String(count);game.start('solo',0);assert.equal(game.cars.length,count+1);}
game.start('duo',0);assert.equal(game.cars.length,2);assert.ok(game.cars.every(c=>!c.isAI));
console.log('PASS: grid sizes, distinct driving decisions, physical limits, all-opponent traffic, pair contacts, classification, DNF points, championship continuity and local two-player.');
const focused=process.argv.includes('--focused');
for(const difficulty of ['normal',...(focused?[]:['easy','hard'])]){
 const stages=focused?[0,2]:difficulty==='normal'?game.tracks.map((_,i)=>i):[0,2,4];
 element('difficulty').value=difficulty;element('opponentCount').value='3';
 for(const stage of stages){
  game.start('solo',stage);game.cars[0].isAI=true;
  let contacts=0,maxOffset=0;
  for(let frame=0;frame<10800&&!game.cars.every(c=>c.done);frame++){
   if(game.tick(1/30))contacts++;
   for(const c of game.cars){
    assert.ok(Number.isFinite(c.x)&&Number.isFinite(c.speed));
    assert.ok(c.speed<=232+1e-6,'Grid car exceeded Balanced top speed');
    maxOffset=Math.max(maxOffset,c.offroad);assert.ok(c.offroad<80,`${game.track.name}/${difficulty}: car ${c.player} escaped the track`);
   }
  }
  assert.ok(game.cars.every(c=>c.lap===3&&c.lapTimes.length===3),`${game.track.name}/${difficulty}: incomplete grid race`);
  if(difficulty==='normal'&&[0,2].includes(stage))assert.equal(contacts,0,`${game.track.name}: close-curve overlap contacts returned`);
  console.log(`PASS: ${game.track.name}/${difficulty}, four finishers, 12 valid laps, offset ${maxOffset.toFixed(1)}, contact frames ${contacts}, laps ${game.cars.map(c=>(c.finishTime/3).toFixed(2)).join('/')}.`);
 }
}
