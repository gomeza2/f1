import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game}=loadGame();
for(const model of Object.values(game.CAR_MODELS)){
 let speed=0,to100=null,to95=null;const dt=1/120;
 for(let i=1;i<1200;i++){speed=Math.min(model.maxSpeed,speed+(game.accelerationAtSpeed(speed,model)-2.6)*dt);if(to100===null&&speed>=100)to100=i*dt;if(speed>=model.maxSpeed*.95){to95=i*dt;break;}}
 assert.ok(to100>=1&&to100<=1.65,`${model.name}: wrong 0–100 response ${to100}`);assert.ok(to95>=2.9&&to95<=4,`${model.name}: wrong approach to top speed ${to95}`);
 assert.ok(game.accelerationAtSpeed(model.maxSpeed*.9,model)<game.accelerationAtSpeed(model.maxSpeed*.2,model)*.75,'Acceleration does not taper with speed');
 console.log(`PACE: ${model.name}, 0–100 ${to100.toFixed(2)}s, 95% top speed ${to95.toFixed(2)}s.`);
}
function probe(speed,brake=false){game.start('solo',0);game.cars[1].done=true;const car=game.cars[0];game.placeCar(car,600,0);car.speed=speed;const heading=car.heading,x=car.x,y=car.y;game.setKeys(brake?{s:true,d:true}:{w:true,d:true});for(let i=0;i<36;i++)game.physics(car,0,1/120);const turn=Math.abs(Math.atan2(Math.sin(car.heading-heading),Math.cos(car.heading-heading)));return {turn,speed:car.speed,radius:Math.hypot(car.x-x,car.y-y)/turn};}
const slow=probe(100),fast=probe(232),braking=probe(232,true);assert.ok(braking.speed<fast.speed-60,'Braking does not meaningfully reduce entry speed');assert.ok(braking.radius<fast.radius*.85,'Braking does not restore a tighter trajectory');assert.ok(fast.radius>slow.radius*3,'Full speed still turns as tightly as controlled speed');assert.ok(fast.turn>0,'High speed removed all direction control');
const model=game.CAR_MODELS.balanced;
for(const surface of ['asphalt','dirt','grass','ice'])for(const speed of [100,180,232]){const handling=game.vehicleHandling(speed,model,surface,80,0);assert.ok(handling.turnRate*speed*game.WORLD_SPEED_SCALE<=handling.lateralAcceleration+1e-6,'Turn exceeds the shared tire-force limit');}
const grip=surface=>game.vehicleHandling(232,model,surface,80).turnRate;assert.ok(grip('asphalt')>grip('dirt')&&grip('dirt')>grip('ice'));
const before=game.bestLapRecords;before['SUNSET CIRCUIT@3']=18;game.start('solo',0);assert.equal(game.lapRecordKey(),'SUNSET CIRCUIT@3:p5:r1:s1');assert.equal(before['SUNSET CIRCUIT@3'],18);assert.ok(game.saveBestLap(game.lapRecordKey(),42));assert.equal(before['SUNSET CIRCUIT@3'],18);
console.log(`PASS: full physics has a wider fast turning radius (${fast.radius.toFixed(1)} vs ${slow.radius.toFixed(1)}), finite shared tire force on four surfaces, controlled steering, progressive acceleration and preserved old-physics records. Human feel remains unverified.`);
