import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadGame} from './helpers/game-harness.mjs';
const baseline=JSON.parse(readFileSync(new URL('./fixtures/traffic-0.50.json',import.meta.url),'utf8'));
const specifications=JSON.parse(readFileSync(new URL('./fixtures/traffic-0.49.json',import.meta.url),'utf8'));
const {game:g,element:e}=loadGame();
assert.equal(g.PHYSICS_VERSION,specifications.physics);assert.equal(g.WORLD_SPEED_SCALE,specifications.worldSpeed);
for(const [actual,expected] of [[g.CAR_MODELS,specifications.models],[g.AI_DRIVERS,specifications.drivers],[g.AI_PERSONALITIES,specifications.personalities]])assert.deepEqual(JSON.parse(JSON.stringify(actual)),expected);
e('opponentCount').value=String(baseline.opponents);
for(const previous of baseline.cases){
 e('difficulty').value=previous.level;g.start('solo',previous.stageIndex);g.cars[0].isAI=true;assert.equal(g.track.name,previous.stage);
 let contactSteps=0,offroadSteps=0,maxOffset=0;
 for(let step=0;step<10800&&!g.cars.every(c=>c.done);step++){
  if(g.tick(baseline.dt))contactSteps++;
  for(const c of g.cars){assert.ok(Number.isFinite(c.speed)&&c.speed<=g.CAR_MODELS[c.model].maxSpeed);maxOffset=Math.max(maxOffset,c.offroad);if(!c.done&&g.terrainAt(c.x,c.y).offroad)offroadSteps++;}
 }
 assert.ok(g.cars.every(c=>c.lap===baseline.laps&&c.lapTimes.length===baseline.laps&&Number.isFinite(c.finishTime)),'Boundary forecast prevented ordered checkpoint/lap completion');
 assert.equal(contactSteps,0,previous.stage+': dispute contact regression');assert.equal(offroadSteps,0,previous.stage+': predicted exit was not contained');
 const oldMean=previous.meanLaps.reduce((a,b)=>a+b,0)/4,newMean=g.cars.reduce((sum,c)=>sum+c.finishTime/baseline.laps,0)/4;
 assert.ok(newMean<=oldMean*1.03,previous.stage+': safer forecast slowed the grid more than 3%');
 console.log(`PASS: ${previous.stage}, four finishers/12 valid laps, contact ${previous.contactSteps} → ${contactSteps}, off-road car-steps ${previous.offroadSteps} → ${offroadSteps}, offset ${maxOffset.toFixed(1)}, mean laps ${g.cars.map(c=>(c.finishTime/baseline.laps).toFixed(2)).join('/')}.`);
}
console.log('PASS: 3 fixed traffic races/36 valid laps, main physical/driver specifications preserved; comparative lap time bound. Does not establish human balance or zero contact in other scenarios.');
