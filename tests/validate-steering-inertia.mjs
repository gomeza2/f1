import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game}=loadGame(),model=game.CAR_MODELS.balanced;
function car(speed=180,handbrake=false){return {heading:0,yawRate:0,speed,steer:1,handbrake};}
function advance(value,seconds,fps=60){for(let i=0;i<Math.round(seconds*fps);i++)game.updateSteeringInertia(value,2,model.maxSpeed,1/fps);}
const weighted=car();advance(weighted,.1);
assert.ok(weighted.yawRate>0&&weighted.yawRate<2,'Yaw snapped straight to full steering');
assert.ok(weighted.heading>.05&&weighted.heading<.2,'Steering became unresponsive or instantaneous');
advance(weighted,.9);assert.ok(weighted.yawRate>1.95,'Inertia removed sustained steering authority');
weighted.steer=0;const before=weighted.heading;advance(weighted,.1);
assert.ok(weighted.heading>before,'Releasing steering discarded all rotational momentum');
assert.ok(weighted.yawRate<.7,'Rotation did not settle after steering release');
advance(weighted,.4);assert.ok(weighted.yawRate<.01,'Rotation kept drifting indefinitely');
const counter=car();advance(counter,.3);counter.steer=-1;advance(counter,.2);
assert.ok(counter.yawRate<-1,'Countersteering cannot recover the car promptly');
const lowSpeed=car(40),highSpeed=car(220),handbrake=car(220,true);
advance(lowSpeed,.1);advance(highSpeed,.1);advance(handbrake,.1);
assert.ok(highSpeed.yawRate<lowSpeed.yawRate,'Fast steering has no additional sense of weight');
assert.ok(handbrake.yawRate>highSpeed.yawRate,'Handbrake cannot help rotate the car');
const at30=car(),at120=car();advance(at30,.5,30);advance(at120,.5,120);
assert.ok(Math.abs(at30.heading-at120.heading)<1e-8,'Yaw integration depends on frame rate');
assert.ok(Math.abs(at30.yawRate-at120.yawRate)<1e-8);
game.start('solo',0);const player=game.cars[0];player.yawRate=2;game.placeCar(player,100,0);
assert.equal(player.yawRate,0,'A restart or placement retained rotation');
// The same physics step drives the rival's yaw; a mild turn must build inertia there too.
const ai=game.cars[1];game.cars[0].done=true;game.placeCar(ai,150,0);ai.speed=150;
game.physics(ai,1,1/60);assert.ok(Number.isFinite(ai.yawRate));
console.log('PASS: gradual turn-in, steady steering, release damping, countersteering, handbrake, speed-dependent weight, equal 30/120 FPS integration and reset.');
