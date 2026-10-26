import {readFileSync} from 'node:fs';
import {loadGame} from '../helpers/game-harness.mjs';
// git show 1862342:script.js > /tmp/script-047.js
if(!process.argv[2])throw new Error('Usage: node tests/experiments/compare-ai-curvature.mjs /path/to/script-047.js');
const source=readFileSync(process.argv[2],'utf8');
const original='const curvature=Math.abs(wrapAngle(sampleAt(d+12).angle-sampleAt(d-12).angle))/24;';
for(const window of [0,24,36,48]){
 const replacement=`const a=sampleAt(d-${window}),b=sampleAt(d),c=sampleAt(d+${window});const ab=pointDistance(a,b),bc=pointDistance(b,c),ac=pointDistance(a,c);const curvature=2*Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))/Math.max(1,ab*bc*ac);`;
 const {game}=loadGame({sourceOverride:window?source.replace(original,replacement):source});
 for(const stage of [0,1,2,4,6,13]){
  game.start('solo',stage);game.cars[0].done=true;const ai=game.cars[1];let frames=0,off=0,braking=0,hand=0;
  for(;frames<12000&&ai.lap<2;frames++){game.tick(1/60);if(game.terrainAt(ai.x,ai.y).offroad)off++;if(ai.braking)braking++;if(ai.handbrake)hand++;}
  console.log(JSON.stringify({window,stage,name:game.track.name,laps:ai.lap,times:ai.lapTimes.map(t=>+t.toFixed(3)),offroad:off/60,brake:braking/60,hand:hand/60}));
 }
}
