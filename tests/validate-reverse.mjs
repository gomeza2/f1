import {withoutSharedDriving} from './helpers/without-shared-driving.mjs';
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {loadGame} from './helpers/game-harness.mjs';import {withoutReverseRecovery} from './helpers/without-reverse-recovery.mjs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8'),current=loadGame(),before=loadGame({sourceOverride:withoutReverseRecovery(withoutSharedDriving(source))}),{game:g,element:e}=current;
function setup(model='balanced',stage=9,progress=400,barriers='open'){e('barrierMode').value=barriers;e('carModel').value=model;g.start('solo',stage);g.cars[1].done=true;g.setCountdown(0);const c=g.cars[0];g.placeCar(c,progress,0);return c;}
function steps(c,keys,count){g.setKeys(keys);for(let n=0;n<count;n++){const x=c.x,y=c.y;g.advanceRaceFrame(1/60);assert.ok(c.speed>=-28&&c.speed<=g.CAR_MODELS[c.model].maxSpeed);assert.ok(Math.hypot(c.x-x,c.y-y)<=Math.max(28,g.CAR_MODELS[c.model].maxSpeed)*g.WORLD_SPEED_SCALE/60+1e-5,'Recovery teleported');}}
const results=[];
for(const model of Object.keys(g.CAR_MODELS)){
 const c=setup(model),x=c.x;steps(c,{s:true},20);assert.equal(c.speed,0,'Reverse starts before the deliberate hold');steps(c,{s:true},100);assert.equal(c.speed,-28);assert.ok(c.x<x-25);g.updateTelemetry();assert.equal(e('speedValue').textContent,'R 28 km/h');const reverseX=c.x;
 steps(c,{w:true},60);assert.ok(c.speed>20,'Forward throttle failed to stop/re-engage');assert.ok(c.x>reverseX);
 const atRest=setup(model);steps(atRest,{w:true,s:true},100);assert.equal(atRest.speed,0,'Holding both pedals unexpectedly selected reverse');assert.equal(atRest.reverseHeld,0);
 const release=setup(model);steps(release,{s:true},90);steps(release,{},90);assert.equal(release.speed,0,'Releasing reverse adds motion');
 const directions=[];for(const key of ['a','d']){const turn=setup(model);steps(turn,{s:true,[key]:true},80);directions.push(turn.heading);assert.ok(Math.abs(turn.heading)>.1);}assert.ok(directions[0]>0&&directions[1]<0,'Reverse steering rotates the wrong way');
 results.push({model,reverseDistance:x-reverseX,directions});
}
// Every terrain shares signed resistance and supports controlled recovery.
for(const stage of [0,2,4,5,8,10]){const c=setup('balanced',stage),p=g.sampleAt(c.progress),x=c.x,y=c.y;steps(c,{s:true},55);assert.ok(c.speed<0);assert.ok((c.x-x)*Math.cos(p.angle)+(c.y-y)*Math.sin(p.angle)<-3,'Terrain prevents backing up');}
// Reversing past the start cannot award gates/laps or jump to the front of the classification.
const seam=setup('balanced',9,1);seam.speed=-20;seam.reverseHeld=1;steps(seam,{s:true},10);assert.equal(seam.lap,0);assert.equal(seam.checkpointPasses,0);assert.ok(seam.progress>g.track.length-10);assert.ok(seam.raceProgress<0,'Backward seam grants nearly a lap of rank');assert.equal(seam.raceOffset,-1);
steps(seam,{w:true},70);assert.equal(seam.lap,0);assert.equal(seam.raceOffset,0);assert.ok(seam.raceProgress>=0&&seam.raceProgress<80);
for(const gate of [...g.checkpoints,g.sampleAt(0)]){const tx=Math.cos(gate.angle),ty=Math.sin(gate.angle);assert.equal(g.gateCrossed(gate,gate.x+tx*2,gate.y+ty*2,gate.x-tx*2,gate.y-ty*2,gate.angle),false);}
// Signed collision closing speed must dissipate energy for a reversing car too.
g.start('duo',9);const [a,b]=g.cars;g.placeCar(a,400,0);g.placeCar(b,380,0);a.speed=-28;b.speed=0;g.resolveCollisions(1/60);assert.ok(a.speed<=0&&Math.abs(a.speed)<28);assert.equal(b.speed,0);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=23-1e-6);
// A rival backing toward the CPU remains a real approaching obstacle.
g.start('solo',9);const [human,ai]=g.cars;g.placeCar(human,480,0);g.placeCar(ai,450,0);human.speed=-28;ai.speed=100;const decision=g.aiTraffic(ai,g.nearestOnTrack(ai.x,ai.y),g.driverFor(ai),1/60);assert.equal(decision.speedLimit,0);g.physics(ai,1,1/60);assert.ok(ai.speed<100&&ai.speed>=100-(g.CAR_MODELS.balanced.braking+30)/60-1e-9);
// Contact with visible full barriers uses backward velocity without crossing the rail.
const wall=setup('balanced',9,400,'full');g.placeCar(wall,400,-30);wall.heading=Math.PI/2;wall.speed=-28;wall.reverseHeld=1;let hit=false;
for(let n=0;n<60;n++){steps(wall,{s:true},1);if(wall.flash>0)hit=true;assert.ok(Math.abs(g.nearestOnTrack(wall.x,wall.y).offset)<60);assert.ok(Number.isFinite(wall.heading));}assert.ok(hit,'Reverse wall contact was not exercised');
const pause=setup();steps(pause,{s:true},15);assert.ok(pause.reverseHeld>0);g.togglePause();assert.equal(pause.reverseHeld,0);const frozenX=pause.x;assert.equal(g.advanceRaceFrame(1),0);assert.equal(pause.x,frozenX);g.togglePause();assert.equal(pause.reverseHeld,0);assert.ok(g.cars.every(c=>c.reverseHeld===0));
g.start('solo',9);const countdownCar=g.cars[0],countdownX=countdownCar.x;assert.equal(g.advanceRaceFrame(1),0);assert.equal(countdownCar.x,countdownX);
const stopped={speed:0};for(let n=0;n<100;n++)g.updateDriveSpeed(stopped,{throttle:0,brake:1,hand:false},g.CAR_MODELS.balanced,1/60);assert.equal(stopped.speed,0,'Brake without a reverse command rolls a CPU backward');
// Existing forward keyboard/hand/terrain trajectories retain exact numeric state.
let paths=0;for(const stage of [0,2,4,5,8,10])for(const keys of [{},{w:true},{w:true,d:true,' ':true}]){
 const values=[];for(const f of [before,current]){f.element('barrierMode').value='open';f.game.start('solo',stage);f.game.cars[1].done=true;f.game.setCountdown(0);const c=f.game.cars[0];f.game.placeCar(c,400,0);c.speed=140;f.game.setKeys(keys);for(let n=0;n<12;n++)f.game.physics(c,0,1/60);values.push({x:c.x,y:c.y,speed:c.speed,heading:c.heading,yaw:c.yawRate,steer:c.steer,drift:c.drift});}assert.deepEqual(values[0],values[1]);paths++;
}
console.log(JSON.stringify({results,paths}));console.log('PASS: four models, deliberate reverse hold/interlock/forward return, inverse steering, six terrains, signed contact/full rail, backward gates/seam/rank, pause reset, CPU brake safety and 18 exact forward paths. Human recovery feel and physical controllers remain open.');
