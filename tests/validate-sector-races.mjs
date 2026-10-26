import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();let races=0;
element('difficulty').value='normal';
for(const stage of [0,1,2,3])for(const profile of ['auto','open','full','half','corners']){
 element('barrierMode').value=profile;game.start('solo',stage);game.cars[0].done=true;
 const ai=game.cars[1];let steps=0,hits=0,offroad=0;
 while(ai.lap<2&&steps<15000){game.tick(1/60);steps++;if(ai.flash>0)hits++;if(game.terrainAt(ai.x,ai.y).offroad)offroad++;assert.ok(Number.isFinite(ai.speed)&&ai.speed<=232);}
 assert.ok(ai.lap>=2,`${game.track.name}/${profile}: no two valid laps in 250s`);
 assert.ok(ai.lapTimes.slice(0,2).every(time=>time>10&&time<90),`${game.track.name}/${profile}: a gate or recovery forced an extra physical lap`);
 races++;console.log(`SECTOR RACE: ${game.track.name}/${profile}, laps ${ai.lapTimes.slice(0,2).map(x=>x.toFixed(2))}, impact-flash ${hits} frames, offroad ${offroad} frames.`);
}
console.log(`PASS: ${races} races/two valid laps with five barrier profiles on the four revised roads; shared speed limits and reachable ordered checkpoints. Flash frames include the decay after impact, not a count of collisions. Human balance is unverified.`);
