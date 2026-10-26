import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadGame} from './helpers/game-harness.mjs';
const old=JSON.parse(readFileSync(new URL('./fixtures/cpu-0.47.json',import.meta.url),'utf8')),{game}=loadGame();
assert.equal(game.PHYSICS_VERSION,old.physics);assert.equal(game.WORLD_SPEED_SCALE,old.worldSpeed);assert.deepEqual(JSON.parse(JSON.stringify(game.CAR_MODELS)),old.models);
for(const t of game.tracks){const hash=createHash('sha256').update(JSON.stringify({points:t.points,samples:t.samples,worldScale:t.worldScale,layoutVersion:t.layoutVersion,roadProfile:t.roadProfile,roadVersion:t.roadVersion})).digest('hex');assert.equal(hash,old.tracks[t.name],t.name+': route changed during CPU work');}
for(const previous of old.runs){
 game.start('solo',previous.stage);game.cars[0].done=true;const car=game.cars[1];let offroad=0,hand=0;
 for(let i=0;i<12000&&car.lap<old.laps;i++){const x=car.x,y=car.y,speed=car.speed;game.tick(old.dt);assert.ok(car.speed<=232&&car.speed-speed<=game.CAR_MODELS.balanced.acceleration*old.dt+1e-6);assert.ok(Math.hypot(car.x-x,car.y-y)<=232*game.WORLD_SPEED_SCALE*old.dt+1e-6,'Free racing teleported');if(game.terrainAt(car.x,car.y).offroad)offroad++;if(car.handbrake)hand++;}
 assert.equal(car.lap,2);assert.equal(offroad,0,'Gain came from driving outside the legal road');
 const before=previous.times.reduce((a,b)=>a+b,0)/2,after=car.lapTimes.reduce((a,b)=>a+b,0)/2;
 assert.ok(after<before*.98,`${previous.name}: did not improve measured pace by 2%`);
 console.log(`AI PACE: ${previous.name}, ${before.toFixed(3)} → ${after.toFixed(3)}s (${((1-after/before)*100).toFixed(1)}%), handbrake ${(hand*old.dt).toFixed(2)}s over two laps, legal road throughout.`);
}
console.log('PASS: twelve valid laps/six frozen 0.47 comparisons, same tracks/models/player physics, improved Normal pace on asphalt/dirt/ice/volcanic/mixed, no off-road shortcuts or extra physical power. Not a human race benchmark.');
