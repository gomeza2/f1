import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
import {sampleTrackShape,normalizedShapeDistance} from './helpers/track-shape.mjs';
const {game}=loadGame();
const dusty=game.tracks.find(t=>t.name==='DUSTY MESA'),shape=sampleTrackShape(dusty);
// A renamed/rescaled/rotated/mirrored route must still be detected as the same shape.
const angle=.73,copy=shape.map(p=>({x:900+3*(-p.x*Math.cos(angle)-p.y*Math.sin(angle)),y:-200+3*(-p.x*Math.sin(angle)+p.y*Math.cos(angle))}));
const reversed=copy.map((_,i)=>copy[(15-i+copy.length)%copy.length]);
assert.ok(normalizedShapeDistance(shape,reversed)<1e-6,'Copy detection failed after geometric transforms');
let closest=Infinity,neighbor='';
for(const other of game.tracks){
 if(other===dusty)continue;
 const distance=normalizedShapeDistance(shape,sampleTrackShape(other));
 assert.ok(distance>.15,`Dusty Mesa resembles ${other.name}: ${distance}`);
 if(distance<closest){closest=distance;neighbor=other.name;}
}
// Records for the preceding route must survive without limiting new records.
game.bestLapRecords['DUSTY MESA@2']=17;game.start('solo',2);
assert.equal(game.lapRecordKey(),'DUSTY MESA@3:p4');assert.ok(game.saveBestLap(game.lapRecordKey(),29));
assert.equal(game.bestLapRecords['DUSTY MESA@2'],17);
assert.equal(game.bestLapRecords['DUSTY MESA@3:p4'],29);
console.log(`PASS: Dusty Mesa differs from all 13 other routes (nearest ${neighbor}, distance ${closest.toFixed(3)}); transformed copies detected; preceding records preserved.`);
