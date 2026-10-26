import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game:g,element:e}=loadGame();
for(const fps of [30,60,120]){
 g.start('solo',0);g.cars[1].done=true;const car=g.cars[0];g.placeCar(car,150,0);car.speed=0;car.yawRate=2;const initial=[car.x,car.y,car.heading];g.setKeys({d:true});for(let i=0;i<fps;i++)g.physics(car,0,1/fps);
 assert.deepEqual([car.x,car.y,car.heading],initial,'Parked chassis rotated without motion');assert.equal(car.yawRate,0);assert.ok(car.steer>.99,'Wheels could not steer at rest');
 g.setKeys({w:true,d:true});for(let i=0;i<fps/3;i++)g.physics(car,0,1/fps);assert.ok(car.speed>0);assert.notEqual(car.heading,initial[2]);
}
const feedback={steer:0,yawRate:0,handbrake:false,braking:false,drift:1},before=JSON.stringify(feedback);
assert.equal(g.drivingSlip(feedback),0);assert.equal(JSON.stringify(feedback),before);assert.equal(g.drivingSlip({...feedback,steer:.6}),1);assert.equal(g.drivingSlip({...feedback,yawRate:.6}),1);assert.equal(g.drivingSlip({...feedback,handbrake:true,drift:0}),1);assert.equal(g.drivingSlip({...feedback,steer:.6,drift:0,braking:true}),.4);
for(const mode of ['straight','turn','hand']){
 g.start('solo',0);g.cars[1].done=true;const car=g.cars[0];g.placeCar(car,150,0);Object.assign(car,{speed:180,drift:1,steer:mode==='turn'?.8:0,yawRate:mode==='turn'?1:0});g.setKeys(mode==='straight'?{w:true}:mode==='turn'?{w:true,d:true}:{w:true,' ':true});g.physics(car,0,1/60);assert.equal(g.skidMarks.length,mode==='straight'?0:2);
}
const tiles=new Set(),context={createPattern(tile,repeat){assert.equal(repeat,'repeat');tiles.add(tile);return tile;}};
for(const [quality,size] of [['high',48],['retro',24]]){e('graphics').value=quality;g.start('solo',0);const a=g.asphaltTexture(context),b=g.asphaltTexture(context);assert.equal(a,b);assert.equal(a.width,size);assert.equal(a.height,size);}
e('graphics').value='lite';g.start('solo',0);assert.equal(g.asphaltTexture(context),null);assert.equal(tiles.size,2);
for(const stage of [2,4,5,6,11,12]){g.start('solo',stage);g.drawAsphaltTexture({createPattern(){throw Error('Asphalt was painted over native terrain')}});}
// A rival must recover with rolling motion rather than a parked pivot or teleport.
for(const fps of [30,60,120])for(const gap of [25,30,40]){
 e('graphics').value='lite';g.start('solo',0);const [obstacle,car]=g.cars;g.placeCar(car,150,0);g.placeCar(obstacle,150+gap,0);car.speed=obstacle.speed=0;let contacts=0,time=0,maxSpeed=0;
 for(let i=0;i<20*fps&&car.progress<obstacle.progress+40;i++){if(g.tick(1/fps))contacts++;time+=1/fps;maxSpeed=Math.max(maxSpeed,car.speed);}
 assert.ok(car.progress>obstacle.progress+40,'Stopped obstacle deadlocked CPU');assert.ok(contacts<=4,'Creep became sustained contact');assert.ok(maxSpeed<=g.CAR_MODELS.balanced.maxSpeed);console.log(`RECOVERY: ${fps}Hz gap ${gap}, ${time.toFixed(2)}s, ${contacts} contact steps.`);
}
console.log('PASS: stopped steering at three rates, rolling turn-in, shared visual/audio slip, no straight phantom skid, paired wheel marks, two cached texture tiles, lite/native preservation and physical standstill recovery.');
