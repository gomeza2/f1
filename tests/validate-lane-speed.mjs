import {assertOriginalModels} from './helpers/model-balance.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadGame} from './helpers/game-harness.mjs';
const old=JSON.parse(readFileSync(new URL('./fixtures/traffic-0.49.json',import.meta.url),'utf8'));
const {game:g,element:e}=loadGame();g.start('solo',2);
assert.equal(g.PHYSICS_VERSION,old.physics+1); // p6 human countersteer only; core source frozen by validate-countersteer.
assert.equal(g.WORLD_SPEED_SCALE,old.worldSpeed);
assertOriginalModels(g.CAR_MODELS,old.models);
for(const [current,previous] of [[g.AI_DRIVERS,old.drivers],[g.AI_PERSONALITIES,old.personalities]])assert.deepEqual(JSON.parse(JSON.stringify(current)),previous,'Traffic change altered power or driver settings');
assert.ok(g.aiSpeedPlan.some(p=>p.signedCurvature>0)&&g.aiSpeedPlan.some(p=>p.signedCurvature<0));
for(const point of g.aiSpeedPlan)assert.equal(Math.abs(point.signedCurvature),point.curvature);
// Analytical constant-radius arc: same lateral acceleration at r=100 or an inside r=75.
const original=Array.from(g.aiSpeedPlan),driver={...g.AI_DRIVERS.hard,pace:1},model=g.CAR_MODELS.balanced;
function arc(sign=1,progress=0){g.aiSpeedPlan.splice(0,g.aiSpeedPlan.length,{progress,speed:100,driftSpeed:110,curvature:.01,signedCurvature:sign*.01});}
arc();assert.equal(g.aiTargetSpeed(0,model,driver),100);
const inner=g.aiTargetSpeed(0,model,driver,false,25);
assert.ok(Math.abs(inner**2/75-100**2/100)<1e-10,'Inside lane exceeded the same lateral acceleration');
assert.equal(g.aiTargetSpeed(0,model,driver,false,-25),100,'Outside lane received a speed bonus');
arc(-1);assert.equal(g.aiTargetSpeed(0,model,driver,false,-25),inner,'Mirrored curve has asymmetric pace');
g.aiSpeedPlan[0].curvature=0;g.aiSpeedPlan[0].signedCurvature=0;assert.equal(g.aiTargetSpeed(0,model,driver,false,25),100,'Straight traffic was slowed');
arc();assert.ok(g.aiTargetSpeed(0,model,driver,false,200)>0,'Tight offset produced zero/invalid recovery speed');
const current=g.track.length-20,forecast=g.aiTargetSpeed(current,model,driver,false,25);
assert.ok(Math.abs(forecast**2-(inner**2+2*model.braking*driver.brakingMargin*20/g.WORLD_SPEED_SCALE))<1e-8,'Finish seam did not preserve the braking envelope');
g.aiSpeedPlan.splice(0,g.aiSpeedPlan.length,...original);
// Reproduce the recorded four-car dispute with actual shared physics and solid collisions.
for(const scenario of [old,...old.additionalRuns]){
 e('difficulty').value=scenario.difficulty;e('opponentCount').value=String(old.opponents);g.start('solo',scenario.stage);g.cars[0].isAI=true;
 let contacts=0,maxOffset=0,offroadSteps=0;
 for(let step=0;step<10800&&!g.cars.every(c=>c.done);step++){
  if(g.tick(old.dt))contacts++;
  for(const car of g.cars){assert.ok(car.speed<=model.maxSpeed&&Number.isFinite(car.speed));maxOffset=Math.max(maxOffset,car.offroad);assert.ok(car.offroad<80);if(!car.done&&g.terrainAt(car.x,car.y).offroad)offroadSteps++;}
 }
 assert.ok(g.cars.every(c=>c.lap===old.laps&&c.lapTimes.length===old.laps&&Number.isFinite(c.finishTime)),'Traffic prevented valid finishes');
 assert.ok(contacts<=4,`${g.track.name}: sustained dispute, ${contacts} steps vs ${scenario.contactSteps}`);
 assert.ok(Math.max(...g.cars.map(c=>c.finishTime/old.laps))<=Math.max(...scenario.meanLaps)+.5,'Lower contact came from broadly slowing the grid');
 if(scenario.offroadSteps!==undefined)assert.ok(offroadSteps<=scenario.offroadSteps,'Lower contact came with more runoff driving');
 if(scenario.stage===old.stage){assert.equal(offroadSteps,0,'Dusty gain came from leaving the legal road');assert.ok(g.cars[3].finishTime/old.laps<old.meanLaps[3]-1,'Trapped driver failed to gain at least a second per lap');}
 console.log(`PASS: ${g.track.name}/${scenario.difficulty}, four solid cars/12 valid laps, ${scenario.contactSteps} → ${contacts} contact steps, ${offroadSteps} car-steps outside road, offset ${maxOffset.toFixed(1)}, mean laps ${g.cars.map(c=>(c.finishTime/old.laps).toFixed(2)).join('/')}.`);
}
console.log('PASS: signed curves, constant-radius lateral force, mirrored/straight/outside lanes, recovery crawl and seam braking. Shared handling rules and driver specifications preserved; Speed b1 checked separately, human play pending.');
