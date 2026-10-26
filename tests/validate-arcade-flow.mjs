import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadGame} from './helpers/game-harness.mjs';
const old=JSON.parse(readFileSync(new URL('./fixtures/driving-0.41.json',import.meta.url),'utf8'));
const {game}=loadGame();
for(const [id,model] of Object.entries(game.CAR_MODELS)){let speed=0,to100=null,to95=null;for(let i=1;i<=1200;i++){speed=Math.min(model.maxSpeed,speed+(game.accelerationAtSpeed(speed,model)-2.6)/120);if(to100===null&&speed>=100)to100=i/120;if(speed>=model.maxSpeed*.95){to95=i/120;break}}
 assert.ok(to100<old.models[id].to100*.9&&to100>=1,'Acceleration did not improve or became instantaneous');assert.ok(to95<old.models[id].to95*.85&&to95>=2.9,'Top speed response lost its progressive ramp');}
function turn(speed,brake=false){game.start('solo',0);game.cars[1].done=true;const car=game.cars[0];game.placeCar(car,600,0);car.speed=speed;const heading=car.heading,x=car.x,y=car.y;game.setKeys(brake?{s:true,d:true}:{w:true,d:true});for(let i=0;i<36;i++)game.physics(car,0,1/120);const angle=Math.abs(Math.atan2(Math.sin(car.heading-heading),Math.cos(car.heading-heading)));return{angle,radius:Math.hypot(car.x-x,car.y-y)/angle};}
const fast=turn(232),braked=turn(232,true);assert.ok(fast.angle>old.fast.turn*1.5,'Steering remains as reluctant as 0.41');assert.ok(fast.radius<old.fast.radius*.7);assert.ok(braked.radius<fast.radius*.85,'Braking no longer helps close a tight corner');
const model=game.CAR_MODELS.balanced,maxHandling=game.vehicleHandling(model.maxSpeed,model,'asphalt',80);assert.ok(model.maxSpeed*game.WORLD_SPEED_SCALE/maxHandling.turnRate>110,'At maximum speed tight hairpins no longer require slowing');
function steer(fps){game.start('solo',0);game.cars[1].done=true;game.setKeys({d:true});for(let i=0;i<fps/2;i++)game.physics(game.cars[0],0,1/fps);return game.cars[0].steer;}
assert.ok(Math.abs(steer(30)-steer(120))<1e-10,'Human steering response depends on the frame rate');
game.bestLapRecords['SUNSET CIRCUIT@3:p3']=40;assert.equal(game.lapRecordKey(),'SUNSET CIRCUIT@3:p4:r1');assert.ok(game.saveBestLap(game.lapRecordKey(),37));assert.equal(game.bestLapRecords['SUNSET CIRCUIT@3:p3'],40);
console.log('PASS: measured response improves against frozen 0.41, acceleration stays progressive, braking tightens corners, fast hairpins retain a limit, steering input agrees at 30/120 Hz and previous-physics records survive. Acceptance of driving feel still requires the user.');
