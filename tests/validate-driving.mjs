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
 assert.ok(car.speed>=50&&car.speed<85,`${name}: initial acceleration is too abrupt or unresponsive`);
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
  assert.ok(camera.x-500/camera.zoom>=-1e-6&&camera.x+500/camera.zoom<=game.track.worldWidth+1e-6);
  assert.ok(camera.y-320/camera.zoom>=-1e-6&&camera.y+320/camera.zoom<=game.track.worldHeight+1e-6);
  assert.ok(Math.abs(car.x-camera.x)*camera.zoom<500&&Math.abs(car.y-camera.y)*camera.zoom<320,'Camera lost the player');
 }
}
game.toggleCamera();assert.equal(game.raceCamera().zoom,game.overviewZoom());
game.start('duo',0);assert.equal(game.raceCamera().zoom,1.1,'Two-player mode must keep cars readable in separate views');
console.log(`PASS: responsive high-speed steering, normal-speed radius ${radius.toFixed(1)}, surface grip, real speed, handbrake and camera bounds on all tracks.`);

game.start('duo',13);assert.equal(game.usesSplitScreen(),true);assert.equal(game.raceCamera(0).zoom,1.1);assert.equal(game.raceCamera(1).zoom,1.1);

// Previous layouts remain stored but cannot compete with a longer redesigned layout.
game.start('solo',9);const key=game.lapRecordKey();
game.bestLapRecords['CHAMPION ROAD']=12;
assert.equal(game.bestLapRecords[key],undefined);
assert.ok(game.saveBestLap(key,35));assert.equal(game.bestLapRecords['CHAMPION ROAD'],12);
assert.equal(game.bestLapRecords[key],35);assert.equal(game.saveBestLap(key,40),false);
console.log('PASS: independent split cameras and versioned records without deleting old layouts.');

game.start('duo',13);game.placeCar(game.cars[1],game.track.length/2,0);
const firstView=game.raceCamera(0),secondView=game.raceCamera(1);
assert.ok(Math.hypot(firstView.x-secondView.x,firstView.y-secondView.y)>50,'Split cameras are still locked to the same car');
