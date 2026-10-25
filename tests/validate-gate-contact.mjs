import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game}=loadGame();
const gate={x:0,y:0,angle:0,halfWidth:42};
assert.equal(game.gateCrossed(gate,-10,46,10,46,0),true,'A car straddling the gate lost its checkpoint');
assert.equal(game.gateCrossed(gate,-10,53,10,53,0),false,'A car entirely beyond the gate gained a checkpoint');
assert.equal(game.gateCrossed(gate,-10,48,10,54,0),true,'Endpoint replaced the true plane intersection');
assert.equal(game.gateCrossed(gate,-10,53,10,53,Math.PI),false);assert.equal(game.gateCrossed(gate,0,0,10,0,0),false,'Resting on the plane counted twice');
function cross(offset){game.start('solo',2);const car=game.cars[0],g=game.checkpoints[2],tx=Math.cos(g.angle),ty=Math.sin(g.angle);game.placeCar(car,g.progress-3,offset);car.x=g.x-tx*3-ty*offset;car.y=g.y-ty*3+tx*offset;car.heading=g.angle;car.nextCheckpoint=2;car.checkpointPasses=2;car.speed=120;game.setKeys({});game.physics(car,0,.06);return car;}
const brush=cross(46.37);assert.equal(brush.checkpointPasses,3,'The observed Dusty rub still causes an extra lap');game.physics(brush,0,.03);assert.equal(brush.checkpointPasses,3,'Gate was awarded twice');
assert.equal(cross(60).checkpointPasses,2,'A gravel/grass shortcut was accepted beyond the car footprint');
for(let stage=0;stage<14;stage++){game.start('solo',stage);for(const g of game.checkpoints){const material=game.surfaceAtProgress(g.progress);assert.equal(g.halfWidth,['asphalt','coastal'].includes(material)?48:42,'Drawn gate width disagrees with legal road/kerb');}}
game.start('solo',0);const car=game.cars[0],start=game.sampleAt(0),tx=Math.cos(start.angle),ty=Math.sin(start.angle);game.placeCar(car,game.track.length-3,50);car.x=start.x-tx*3-ty*50;car.y=start.y-ty*3+tx*50;car.heading=start.angle;car.checkpointPasses=game.checkpoints.length;car.nextCheckpoint=0;car.speed=120;game.setElapsed(40);game.physics(car,0,.06);assert.equal(car.lap,1,'Legal car contact with the finish strip did not finish the lap');game.physics(car,0,.03);assert.equal(car.lap,1);
console.log('PASS: real Dusty checkpoint contact, whole-car exclusion, exact intersection, one award per crossing, legal gate widths in 14 tracks and finish consistency. A body/tyre touching the strip counts; full off-track cuts do not.');
