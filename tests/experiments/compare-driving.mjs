// Optional research benchmark: same steering policy, brake-aware vs always-throttle inputs.
// It is not a human driving test. Reads the preserved 0.41 commit from local Git history.
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {loadGame} from '../helpers/game-harness.mjs';
const root=new URL('../../',import.meta.url),current=readFileSync(new URL('../../script.js',import.meta.url),'utf8');
let previous;
try{previous=execFileSync('git',['show','1df936dcaacd5b406a4966eba1a84399fc7bf7d6:script.js'],{cwd:root,encoding:'utf8'});}catch(error){throw new Error('Cannot read preserved baseline from Git ('+error.code+'). Run this optional experiment in an environment permitting local Git subprocesses.');}
const aggressive='const DRIVING_TUNING={accelerationScale:.90,accelerationTaper:.38,lateralAcceleration:330,maxSpeedGripLoss:.18,speedGripLoss:.0010,inputResponse:16,handInputResponse:18,yawResponse:18,yawSpeedWeight:3};';
const profiles={previous,current,permissive:current.replace(/const DRIVING_TUNING=\{[^\n]+\};/,aggressive)};
const policy='return {throttle:car.speed<targetSpeed-2?1:0,brake:car.speed>targetSpeed+2?1:0,hand};';
for(const [profile,original] of Object.entries(profiles))for(const fullGas of [false,true]){
 if(!original.includes(policy))throw new Error('Driving policy changed: update the experiment explicitly');
 const source=fullGas?original.replace(policy,'return {throttle:1,brake:0,hand:false};'):original;
 const {game}=loadGame({sourceOverride:source});
 for(const stage of [0,2]){game.start('solo',stage);game.cars[0].done=true;const car=game.cars[1];let time=0,offroadTime=0,maxOffset=0;
  for(let i=0;i<5400&&car.lap<1;i++){game.tick(1/60);time+=1/60;if(car.offroad>48)offroadTime+=1/60;maxOffset=Math.max(maxOffset,car.offroad)}
  console.log(JSON.stringify({profile,fullGas,track:game.track.name,lap:car.lap,time:+time.toFixed(2),offroadTime:+offroadTime.toFixed(2),maxOffset:+maxOffset.toFixed(1)}));
 }
}
