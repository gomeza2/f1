import {readFileSync} from 'node:fs';
import {loadGame} from '../helpers/game-harness.mjs';
// Pass a preserved 0.44 script (git show 2409e5c:script.js > /tmp/script-044.js).
if(!process.argv[2])throw new Error('Usage: node tests/experiments/compare-lift.mjs /path/to/script-044.js');
const baseline=readFileSync(process.argv[2],'utf8');
const policy='return {throttle:car.speed<targetSpeed-2?1:0,brake:car.speed>targetSpeed+2?1:0,hand};';
for(const loss of [0,.16,.24]){
 let source=baseline;
 if(loss)source=source.replace('DRIVING_TUNING.lateralAcceleration*model.grip','DRIVING_TUNING.lateralAcceleration*(1-'+loss+'*clamp((speed/model.maxSpeed-.58)/.42,0,1))*model.grip').replace('(throttle?2.6:20)','(throttle?2.6:30)').replace(' if(tooFast>12&&upcoming.distance<130)car.speed=Math.max(30,car.speed-tooFast*dt*.045);','');
 for(const full of [false,true]){
  const {game}=loadGame({sourceOverride:full?source.replace(policy,'return {throttle:1,brake:0,hand:false};'):source});
  for(const stage of [0,1,2]){game.start('solo',stage);game.cars[0].done=true;const car=game.cars[1];let time=0,off=0;
   for(let i=0;i<4500&&car.lap<1;i++){game.tick(1/60);time+=1/60;if(game.terrainAt(car.x,car.y).offroad)off+=1/60;}
   console.log(JSON.stringify({loss,full,track:stage,lap:car.lap,time:+time.toFixed(2),off:+off.toFixed(2)}));
  }
 }
}
