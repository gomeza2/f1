import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const rates=[20,30,60,120,144],fixture=loadGame();
function scenario(rate,stage=0,model='balanced'){
 const {game:g,element:e}=fixture;e('barrierMode').value='open';e('carModel').value=model;g.start('solo',stage);g.setCountdown(0);g.cars[1].done=true;g.placeCar(g.cars[0],600,0);
 const inputs=[{w:true},{w:true,d:true},{s:true,d:true},{w:true,a:true},{w:true,' ':true,a:true},{}];
 let steps=0;
 for(const keys of inputs){g.setKeys(keys);if(rate==='jitter'){for(let n=0;n<5;n++)for(const dt of [.007,.043,.011,.039])steps+=g.advanceRaceFrame(dt);}else for(let n=0;n<rate/2;n++)steps+=g.advanceRaceFrame(1/rate);}
 const c=g.cars[0];return {g,steps,state:[c.x,c.y,c.speed,c.heading,c.yawRate,c.steer,c.drift,c.wheelTravel,c.progress,c.lap,c.checkpointPasses,g.elapsed]};
}
for(const stage of [0,2,4])for(const model of ['balanced','corner','speed','rally']){
 const ref=scenario(60,stage,model);
 for(const rate of [...rates,'jitter']){const actual=scenario(rate,stage,model);assert.equal(actual.steps,180);actual.state.forEach((v,i)=>assert.ok(Math.abs(v-ref.state[i])<1e-9,`${stage}/${model}/${rate}/${i}: frame rate changed simulation`));}
}
const {g}=scenario(60);const car=g.cars[0];g.resetSimulationClock();g.placeCar(car,600,0);car.speed=100;g.setKeys({w:true});const x=car.x,y=car.y;
assert.equal(g.advanceRaceFrame(1/120),0);assert.equal(car.x,x);assert.equal(car.y,y);
assert.equal(g.advanceRaceFrame(1/120),1);let view=g.renderedCar(car);assert.ok(Math.hypot(view.x-x,view.y-y)<1e-9,'Whole-step render must start at previous snapshot');
const original=JSON.stringify(car);assert.equal(g.advanceRaceFrame(1/120),0);view=g.renderedCar(car);assert.ok(Math.abs(view.x-(x+car.x)/2)<1e-9&&Math.abs(view.y-(y+car.y)/2)<1e-9);assert.equal(JSON.stringify(car),original,'Interpolation mutated physics');
// Wrap heading along the short arc, never spin through zero at +/-pi.
g.renderPrevious.set(car,{x:car.x,y:car.y,heading:Math.PI-.02});car.heading=-Math.PI+.02;assert.ok(Math.abs(Math.abs(g.renderedCar(car).heading)-Math.PI)<1e-9);
g.placeCar(car,900,0);assert.equal(g.renderedCar(car),car,'Placement retained stale render pose');
g.resetSimulationClock();const before=g.elapsed;assert.equal(g.advanceRaceFrame(10),6);assert.ok(Math.abs(g.elapsed-before-.1)<1e-9,'Stall exceeded catch-up budget');assert.ok(g.simulationAccumulator<g.SIMULATION_STEP);for(const dt of [NaN,Infinity,-1,0])assert.equal(g.advanceRaceFrame(dt),0);
g.bestLapRecords['SUNSET CIRCUIT@3:p5:r1']=30;assert.equal(g.lapRecordKey(),'SUNSET CIRCUIT@3:p5:r1:s1');g.saveBestLap(g.lapRecordKey(),32);assert.equal(g.bestLapRecords['SUNSET CIRCUIT@3:p5:r1'],30);
// Exercise the actual RAF lifecycle with a clock that advances while paused.
let now=0,serial=0;const pending=new Map(),frameScheduler={request(fn){pending.set(++serial,fn);return serial},cancel(id){pending.delete(id)}};
const {game:p,element:e}=loadGame({frameScheduler,clock:()=>now});e('barrierMode').value='open';p.start('solo',0);p.setCountdown(0);p.cars[1].done=true;p.setKeys({w:true});
function frame(dt){now+=dt*1000;const callbacks=[...pending.values()];pending.clear();callbacks.forEach(fn=>fn(now));}
for(let i=0;i<20;i++)frame(.05);assert.ok(Math.abs(p.elapsed-1)<1e-9,'20 FPS lost race time');
frame(1/120);assert.ok(p.simulationAccumulator>0);p.togglePause();const frozen=JSON.stringify(p.cars),time=p.elapsed;now+=10000;p.togglePause();assert.equal(p.simulationAccumulator,0);frame(1/60);assert.ok(Math.abs(p.elapsed-time-1/60)<1e-9);assert.equal(pending.size,1);assert.notEqual(JSON.stringify(p.cars),frozen);
frame(1/120);assert.ok(p.simulationAccumulator>0);e('backBtn').onclick();assert.equal(pending.size,0);assert.equal(p.simulationAccumulator,0);p.start('solo',2);assert.equal(p.elapsed,0);assert.equal(p.simulationAccumulator,0);
console.log('PASS: 12 model/material scenarios at 20/30/60/120/144 FPS + jitter, identical 180 physical steps/state each; interpolated short-arc render without mutation, placement, bounded stalls, old records retained, actual RAF 20-FPS clock and pause/resume/menu/restart cleanup.');
