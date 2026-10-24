import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();
const model=game.CAR_MODELS.balanced;
const fast=game.vehicleHandling(232,model,'asphalt',80,1);
assert.ok(fast.turnRate>=1,'Excess speed removed practical steering control');
const normal=game.vehicleHandling(100,model,'asphalt',100);
const radius=100*game.WORLD_SPEED_SCALE/normal.turnRate;
assert.ok(radius<45,'Normal-speed cornering radius is too wide for these tracks');
assert.ok(fast.turnRate<normal.turnRate,'Excess speed must still penalize cornering');
const asphalt=game.vehicleHandling(100,model,'asphalt',100).grip;
const dirt=game.vehicleHandling(100,model,'dirt',100).grip;
const ice=game.vehicleHandling(100,model,'ice',100).grip;
assert.ok(asphalt>dirt&&dirt>ice,'Surfaces lost their different grip');
assert.ok(232*game.WORLD_SPEED_SCALE>=190,'Real movement remains too slow');
for(const name of Object.keys(game.CAR_MODELS)){
 element('carModel').value=name;game.start('solo',0);game.cars[1].done=true;
 const car=game.cars[0];game.placeCar(car,100,0);game.setKeys({w:true});
 for(let frame=0;frame<60;frame++)game.physics(car,0,1/60);
 assert.ok(car.speed>=100,`${name}: takes more than one second to reach 100`);
 assert.ok(car.speed<=game.CAR_MODELS[name].maxSpeed);
 console.log(`PASS: ${name}, speed after 1s ${car.speed.toFixed(1)}.`);
}
element('carModel').value='balanced';game.start('solo',0);game.cars[1].done=true;
const player=game.cars[0];game.placeCar(player,100,0);player.speed=160;game.setKeys({w:true,' ':true,d:true});
const heading=player.heading;
for(let frame=0;frame<15;frame++)game.physics(player,0,1/60);
assert.ok(player.speed<160,'Handbrake did not reduce speed under throttle');
assert.ok(Math.abs(player.heading-heading)>.15,'Handbrake did not help rotate the car');
assert.ok(Math.abs(player.heading-heading)<1.2,'Steering snapped around instantly');
for(let stage=0;stage<game.tracks.length;stage++){
 game.start('solo',stage);
 for(let d=0;d<game.track.length;d+=100){
  game.placeCar(game.cars[0],d,0);const camera=game.raceCamera(),car=game.cars[0];
  assert.equal(camera.zoom,1.35);
  assert.ok(camera.x-500/camera.zoom>=-1e-6&&camera.x+500/camera.zoom<=1000+1e-6);
  assert.ok(camera.y-320/camera.zoom>=-1e-6&&camera.y+320/camera.zoom<=640+1e-6);
  assert.ok(Math.abs(car.x-camera.x)*camera.zoom<500&&Math.abs(car.y-camera.y)*camera.zoom<320,'Camera lost the player');
 }
}
game.toggleCamera();assert.equal(game.raceCamera().zoom,1);
game.start('duo',0);assert.equal(game.raceCamera().zoom,1,'Two-player mode must show both cars');
console.log(`PASS: responsive high-speed steering, normal-speed radius ${radius.toFixed(1)}, surface grip, real speed, handbrake and camera bounds on all tracks.`);
