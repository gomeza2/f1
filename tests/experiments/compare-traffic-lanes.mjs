// Optional reproducible comparison; supply a preserved 0.49 script, not a modified working tree.
// git show 6b86503:script.js > /tmp/script-049.js
// node tests/experiments/compare-traffic-lanes.mjs /tmp/script-049.js
// Add --current-only to reuse a recorded baseline after changing a candidate.
import {readFileSync} from 'node:fs';
import {loadGame} from '../helpers/game-harness.mjs';
if(!process.argv[2])throw new Error('Pass the preserved 0.49 script path');
const variants=process.argv.includes('--current-only')?[['current',undefined]]:[['0.49',readFileSync(process.argv[2],'utf8')],['current',undefined]];
for(const [version,sourceOverride] of variants){
 const {game:g,element:e}=loadGame({sourceOverride});e('opponentCount').value='3';
 for(const [stage,level] of [[2,'easy'],[0,'normal'],[3,'normal'],[6,'normal'],[0,'hard']]){
  e('difficulty').value=level;g.start('solo',stage);g.cars[0].isAI=true;
  let contactSteps=0,offroadSteps=0,maxOffset=0;
  for(let step=0;step<10800&&!g.cars.every(c=>c.done);step++){
   if(g.tick(1/30))contactSteps++;
   for(const car of g.cars){if(!car.done&&g.terrainAt(car.x,car.y).offroad)offroadSteps++;maxOffset=Math.max(maxOffset,car.offroad);}
  }
  console.log(JSON.stringify({version,stage:g.track.name,level,dt:1/30,contactSteps,offroadSteps,maxOffset,laps:g.cars.map(c=>c.lap),meanLaps:g.cars.map(c=>c.finishTime/3)}));
 }
}
