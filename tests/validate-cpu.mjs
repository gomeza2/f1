import assert from 'node:assert/strict';
import { loadGame } from './helpers/game-harness.mjs';
const {game,element}=loadGame();
const dt=1/30;
const results=new Map();
for(const difficulty of (process.argv.includes('--focused')?[]:['easy','normal','hard'])){
 element('difficulty').value=difficulty;
 const times=[];
 for(let stage=0;stage<game.tracks.length;stage++){
  game.start('solo',stage);game.cars[0].done=true;
  const ai=game.cars[1];
  for(let frame=0;frame<300/dt&&!ai.done;frame++){
   const speed=ai.speed;
   game.tick(dt);
   assert.ok(Number.isFinite(ai.x)&&Number.isFinite(ai.y)&&Number.isFinite(ai.speed));
   assert.ok(ai.speed<=232,'CPU exceeded Balanced top speed');
   assert.ok(ai.speed-speed<=game.CAR_MODELS.balanced.acceleration*dt+1e-6,'CPU exceeded Balanced acceleration');
   assert.ok(ai.offroad<42,`${game.track.name}/${difficulty}: CPU left the racing surface`);
  }
  assert.equal(ai.lap,3,`${game.track.name}/${difficulty}: did not finish three valid laps in 300s`);
  assert.equal(ai.lapTimes.length,3);
  times.push(ai.finishTime);
  if(difficulty==='normal'){
   const lap=ai.finishTime/3;assert.ok(lap>=25&&lap<=45,`${game.track.name}: reference lap ${lap.toFixed(2)}s outside the 25–45s goal`);
   console.log(`PACE: ${game.track.name}, mean lap ${lap.toFixed(2)}s.`);
  }
 }
 results.set(difficulty,times);
 console.log(`PASS: ${difficulty}, ${times.length} circuits, three laps each, shared speed/acceleration limits.`);
}
for(let stage=0;results.size&&stage<game.tracks.length;stage++){
 assert.ok(results.get('hard')[stage]<results.get('normal')[stage]);
 assert.ok(results.get('normal')[stage]<results.get('easy')[stage]);
}
// Check equal physical movement and acceleration from an identical starting state.
element('difficulty').value='normal';game.start('solo',0);
const [player,ai]=game.cars;
game.placeCar(player,100,0);game.placeCar(ai,100,0);
const from={x:player.x,y:player.y};
player.done=true;game.physics(ai,1,dt);ai.done=true;player.done=false;
game.setKeys({w:true});game.physics(player,0,dt);
assert.ok(Math.abs(ai.speed-player.speed)<1e-6);
assert.ok(Math.abs(Math.hypot(ai.x-from.x,ai.y-from.y)-Math.hypot(player.x-from.x,player.y-from.y))<1e-6);
// A stationary rival in the same lane must cause braking before contact.
game.start('solo',0);const [obstacle,follower]=game.cars;
game.placeCar(follower,150,0);game.placeCar(obstacle,190,0);follower.speed=100;
game.physics(follower,1,dt);assert.ok(follower.speed<100,'CPU failed to brake for blocked lane');
assert.ok(Math.abs(follower.speed-(100-(game.CAR_MODELS.balanced.braking+20)*dt))<1e-6,'CPU braking differs from Balanced plus coasting drag');
// Recovery uses steering and normal movement, with no teleport to the centerline.
element('barrierMode').value='open';game.start('solo',0);game.cars[0].done=true;const recovering=game.cars[1];
game.placeCar(recovering,150,78);recovering.speed=40;
let recovered=false;
for(let frame=0;frame<60/dt;frame++){
 const x=recovering.x,y=recovering.y;game.tick(dt);
 assert.ok(Math.hypot(recovering.x-x,recovering.y-y)<=232*game.WORLD_SPEED_SCALE*dt+1e-6,'Recovery teleported');
 if(recovering.offroad<20){recovered=true;break}
}
assert.ok(recovered,'CPU did not recover from runoff');
if(results.size)console.log('PASS: difficulty ordering on all 14 circuits.');
console.log('PASS: equal motion, traffic braking and physical runoff recovery. These simulations do not establish human gameplay balance.');
