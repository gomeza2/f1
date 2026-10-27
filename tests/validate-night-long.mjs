import {assertOriginalModels} from './helpers/model-balance.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadGame} from './helpers/game-harness.mjs';
import {analyzeTrackWidth} from './helpers/track-geometry.mjs';
import {sampleTrackShape,normalizedShapeDistance} from './helpers/track-shape.mjs';
const old=JSON.parse(readFileSync(new URL('./fixtures/night-0.45.json',import.meta.url),'utf8'));
const {game,element}=loadGame(),night=game.tracks[3],shape=sampleTrackShape(night);
assert.equal(night.name,'NIGHT RUN');assert.equal(night.layoutVersion,3);assert.equal(night.roadVersion,1);assert.equal(night.defaultBarriers,'corners');
assert.ok(night.length>10000&&night.length<11500);assert.ok(normalizedShapeDistance(shape,old.shape)>.2,'Night was only enlarged');
assertOriginalModels(game.CAR_MODELS,old.models);assert.equal(game.PHYSICS_VERSION,6); /* Controller migration; validate-countersteer freezes the remaining p5 driving core. */assert.equal(game.WORLD_SPEED_SCALE,.84);
let nearest=Infinity;
for(const t of game.tracks.filter(t=>t!==night)){
 const signature=createHash('sha256').update(JSON.stringify({points:t.points,samples:t.samples,worldScale:t.worldScale,layoutVersion:t.layoutVersion,roadProfile:t.roadProfile,roadVersion:t.roadVersion})).digest('hex');if(!(['VOLCANO RING','FROSTBITE GP','PIXEL CITY','JUNGLE SPRINT','THUNDER VALLEY'].includes(t.name)&&t.layoutVersion===3))assert.equal(signature,old.otherTracks[t.name],`${t.name} changed`);
 const distance=normalizedShapeDistance(shape,sampleTrackShape(t));nearest=Math.min(nearest,distance);assert.ok(distance>.2,`Night resembles ${t.name}: ${distance}`);
}
const geometry=analyzeTrackWidth(night,d=>game.roadHalfWidthAt(d,night));assert.ok(geometry.roadMargin>50&&geometry.clearance>25);
game.start('solo',3);assert.equal(game.checkpoints.length,16);assert.ok(game.checkpoints.every((g,i,all)=>i===0||g.progress>all[i-1].progress));
const gates=[0,...game.checkpoints.map(g=>g.progress),night.length];assert.ok(gates.slice(1).every((d,i)=>d-gates[i]<=650),'Long track checkpoint gaps grew past 650');
game.bestLapRecords['NIGHT RUN@2:p5']=28;assert.equal(game.lapRecordKey(),'NIGHT RUN@3:p6:r1:s1:b1');game.saveBestLap(game.lapRecordKey(),60);assert.equal(game.bestLapRecords['NIGHT RUN@2:p5'],28);
const player=game.cars[0];game.placeCar(player,night.length-3,0);player.speed=120;game.setKeys({w:true});game.physics(player,0,.1);assert.equal(player.lap,0,'Meta accepted a lap without ordered gates');
element('stageSelect').value='3';game.updateMenuPreview();assert.match(element('previewRouteInfo').textContent,/16 CHECKPOINTS/);
console.log(`PASS: Night ${night.length.toFixed(1)} units, distinct shape (nearest ${nearest.toFixed(3)}), real-width margin ${geometry.roadMargin.toFixed(1)}/clearance ${geometry.clearance.toFixed(1)}, sixteen ordered gates, preserved records/physics and remaining historical tracks; Volcano, Frost, Pixel, Jungle and Thunder have dedicated later snapshots. Lap duration is tested through actual simulation.`);
