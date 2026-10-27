import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {loadGame} from './helpers/game-harness.mjs';import {assertOriginalModels} from './helpers/model-balance.mjs';
const {game:g,element:e}=loadGame(),old=JSON.parse(readFileSync(new URL('./fixtures/jungle-0.59.json',import.meta.url),'utf8'));
assertOriginalModels(g.CAR_MODELS,old.models);
for(const name of ['balanced','corner','rally'])for(let speed=0;speed<=260;speed+=10){const m=old.models[name],expected=m.acceleration*.82*(1-.45*Math.min(1,Math.max(0,speed/m.maxSpeed)));assert.ok(Math.abs(g.accelerationAtSpeed(speed,g.CAR_MODELS[name])-expected)<1e-12,'Other model acceleration changed');}
function straight(model='speed',speed=0){e('carModel').value=model;g.updateGaragePreview();e('barrierMode').value='open';g.start('solo',9);g.setCountdown(0);g.cars[1].done=true;const c=g.cars[0];g.placeCar(c,400,0);c.speed=speed;assert.ok(Math.abs(c.heading)<1e-9,'Champion test section is not straight');return c;}
const c=straight(),startX=c.x;g.setKeys({w:true});let time=0,at100=null,at200=null;
for(let i=0;i<360&&c.speed<260;i++){g.advanceRaceFrame(1/60);time+=1/60;if(c.speed>=100&&at100===null)at100=time;if(c.speed>=200&&at200===null)at200=time;assert.equal(g.terrainAt(c.x,c.y).offroad,false,'Acceleration reference left actual road');assert.ok(c.speed<=260);}
assert.equal(c.speed,260,'Actual physics never reached 260');assert.ok(at100>1.1&&at100<1.25);assert.ok(time>3.9&&time<4.15);assert.ok(at200>2.6&&at200<2.9);assert.ok(c.x-startX>480&&c.x-startX<530,'Real travel disagrees with the speed claim');
const accelerationDistance=c.x-startX;
for(let i=0;i<6;i++)g.advanceRaceFrame(1/60);assert.equal(c.speed,260,'Terminal speed is unstable');
g.updateTelemetry();assert.equal(e('speedValue').textContent,'260 km/h');assert.match(e('garageSummary').innerHTML,/260 KM\/H MAX/);
function stop(initial){const car=straight('speed',initial),x=car.x,y=car.y;g.setKeys({s:true});let t=0;for(let n=0;n<180&&car.speed>0;n++){g.advanceRaceFrame(1/60);t+=1/60;assert.equal(g.terrainAt(car.x,car.y).offroad,false);}assert.equal(car.speed,0);return {time:t,distance:Math.hypot(car.x-x,car.y-y)};}
const oldStop=stop(250),newStop=stop(260);assert.ok(newStop.distance>oldStop.distance*1.075,'Higher entry speed did not cost more braking distance');assert.ok(newStop.time>oldStop.time);
const model=g.CAR_MODELS.speed,slow=g.vehicleHandling(100,model,'asphalt',80),fast=g.vehicleHandling(260,model,'asphalt',80);
assert.ok(260*g.WORLD_SPEED_SCALE/fast.turnRate>230);assert.ok(fast.turnRate*260*g.WORLD_SPEED_SCALE<=fast.lateralAcceleration+1e-9);assert.ok(260*g.WORLD_SPEED_SCALE/fast.turnRate>100*g.WORLD_SPEED_SCALE/slow.turnRate*3);
// A short handbrake input rotates more, pays speed, then recovers rather than locking slip forever.
function handProbe(hand){const car=straight('speed',180),h=car.heading;g.setKeys(hand?{w:true,d:true,' ':true}:{w:true,d:true});for(let n=0;n<12;n++)g.advanceRaceFrame(1/60);const result={speed:car.speed,angle:Math.abs(car.heading-h),drift:car.drift};if(hand){g.setKeys({w:true});for(let n=0;n<30;n++)g.advanceRaceFrame(1/60);assert.ok(car.drift<result.drift*.25,'Handbrake slip did not recover');assert.equal(car.handbrake,false);}return result;}
const normal=handProbe(false),hand=handProbe(true);assert.ok(hand.speed<normal.speed-15);assert.ok(hand.angle>normal.angle*1.05);
g.bestLapRecords['CHAMPION ROAD@2:p6:s1']=25;g.start('solo',9);assert.equal(g.lapRecordKey(),'CHAMPION ROAD@2:p6:s1:b1');g.saveBestLap(g.lapRecordKey(),30);assert.equal(g.bestLapRecords['CHAMPION ROAD@2:p6:s1'],25);
console.log(JSON.stringify({actual:{at100,at200,at260:time,distance:accelerationDistance},braking:{from250:oldStop,from260:newStop},handbrake:{normal,hand}}));
console.log('PASS: actual Speed Demon physics reaches/stabilizes/displays 260 on Champion straight, progressive launch/top end, longer braking, finite tire-force turn radius, handbrake rotation/speed cost/recovery and prior records without a balance suffix retained. Human feel remains to review.');
