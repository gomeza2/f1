import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {loadGame} from './helpers/game-harness.mjs';import {withoutPedalBlend} from './helpers/without-pedal-blend.mjs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8'),current=loadGame(),before=loadGame({sourceOverride:process.env.RACE_SOURCE_BASELINE?readFileSync(process.env.RACE_SOURCE_BASELINE,'utf8'):withoutPedalBlend(source)});
const state=g=>Array.from(g.cars,c=>({x:c.x,y:c.y,speed:c.speed,heading:c.heading,yaw:c.yawRate,steer:c.steer,drift:c.drift,lap:c.lap,checkpoint:c.nextCheckpoint,passes:c.checkpointPasses,raceProgress:c.raceProgress,lapTimes:Array.from(c.lapTimes),finish:c.finishTime,done:c.done}));
let laps=0;
for(const [stage,difficulty] of [[0,'normal'],[10,'normal'],[4,'hard']]){
 for(const {game:g,element:e} of [before,current]){e('difficulty').value=difficulty;e('opponentCount').value='3';e('barrierMode').value='auto';g.start('solo',stage);g.cars[0].isAI=true;}
 let contacts=0,off=0;
 for(let n=0;n<16000&&!current.game.cars.every(c=>c.done);n++){
  const oldContact=before.game.tick(1/60),contact=current.game.tick(1/60);assert.equal(contact,oldContact);if(contact)contacts++;
  if(n%60===0)assert.deepEqual(state(current.game),state(before.game),'Reference digital race motion changed');
  for(const c of current.game.cars)if(!c.done&&current.game.terrainAt(c.x,c.y).offroad)off++;
 }
 assert.deepEqual(state(current.game),state(before.game));assert.ok(current.game.cars.every(c=>c.done&&c.lap===3&&Number.isFinite(c.finishTime)),'Incomplete reference race');laps+=12;
 console.log(JSON.stringify({stage,difficulty,times:current.game.cars.map(c=>Array.from(c.lapTimes)),contacts,off}));
}
console.log(`PASS: ${laps} valid current laps paired with ${laps} baseline laps (${process.env.RACE_SOURCE_BASELINE?'preserved external source':'pedal correction reversed'}); exact motion/progress/finish/contact preservation for Sunset Normal, coastal mixed Coastline Normal and Frost Hard. This proves preservation, not new CPU balance or human fun.`);
