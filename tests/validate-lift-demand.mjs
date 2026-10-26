import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadGame} from './helpers/game-harness.mjs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8');
const {game}=loadGame(),model=game.CAR_MODELS.balanced;
// Maximum-speed cornering needs a wider radius; low-speed response remains responsive.
const slow=game.vehicleHandling(100,model,'asphalt',220),fast=game.vehicleHandling(232,model,'asphalt',220);
assert.ok(fast.lateralAcceleration<slow.lateralAcceleration*.9);
assert.ok(232*game.WORLD_SPEED_SCALE/fast.turnRate>155);
function coast(keys){game.start('solo',0);game.cars[1].done=true;const car=game.cars[0];game.placeCar(car,600,0);car.speed=160;game.setKeys(keys);for(let i=0;i<60;i++)game.physics(car,0,1/120);return car.speed;}
const gas=coast({w:true}),lift=coast({}),brake=coast({s:true});
assert.ok(gas>175);assert.ok(lift>140&&lift<148,'Lift must scrub useful speed without becoming a hard brake');assert.ok(brake<lift-80&&brake>0);
const policy='return {throttle:car.speed<targetSpeed-2?1:0,brake:car.speed>targetSpeed+2?1:0,hand};';assert.ok(source.includes(policy));
function lap(full){const {game}=loadGame({sourceOverride:full?source.replace(policy,'return {throttle:1,brake:0,hand:false};'):source});game.start('solo',0);game.cars[0].done=true;const car=game.cars[1];let time=0,offroad=0;for(let i=0;i<4500&&car.lap<1;i++){game.tick(1/60);time+=1/60;if(game.terrainAt(car.x,car.y).offroad)offroad+=1/60;}assert.equal(car.lap,1);return {time,offroad};}
const planned=lap(false),full=lap(true);assert.equal(planned.offroad,0);assert.ok(full.offroad>3&&full.time>planned.time+4,'Holding throttle through every Sunset corner retained its advantage');
game.bestLapRecords['SUNSET CIRCUIT@3:p4:r1']=36;assert.equal(game.lapRecordKey(),'SUNSET CIRCUIT@3:p5:r1');game.saveBestLap(game.lapRecordKey(),40);assert.equal(game.bestLapRecords['SUNSET CIRCUIT@3:p4:r1'],36);
console.log(`PASS: gas/lift/brake ${gas.toFixed(1)}/${lift.toFixed(1)}/${brake.toFixed(1)}, shared high-speed force, preserved p4 records; Sunset planned ${planned.time.toFixed(2)}s vs always-throttle ${full.time.toFixed(2)}s, off-road ${full.offroad.toFixed(2)}s. Same automated steering policy; not a human handling test.`);
