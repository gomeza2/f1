import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();game.start('solo',0);
const runningTrack=game.track,simulation=JSON.stringify(game.cars);
for(let stage=0;stage<14;stage++){
 const item=game.tracks[stage];element('stageSelect').value=String(stage);game.saveBestLap(game.lapRecordKey(item),30+stage);game.updateMenuPreview();
 assert.ok(element('previewTrackName').textContent.includes(item.name));
 const gates=game.checkpointsForTrack(item);assert.equal(gates.length,Math.max(3,Math.ceil(item.length/650)-1));
 assert.ok(element('previewRouteInfo').textContent.includes(gates.length+' CHECKPOINTS'));
 assert.match(element('previewRecord').textContent,/00:/);
 assert.equal(game.track,runningTrack,'Menu preview changed the active race track');assert.equal(JSON.stringify(game.cars),simulation,'Menu preview changed the active cars');
 const p=game.sampleAt(0,item);assert.ok(Math.hypot(p.x-item.samples[0].x,p.y-item.samples[0].y)<1e-6);
}
element('stageSelect').value='0';element('barrierMode').value='auto';game.updateMenuPreview();assert.match(element('previewBarriers').textContent,/ABIERTO/);
element('barrierMode').value='full';game.updateMenuPreview();assert.equal(element('previewBarriers').textContent,'VALLAS COMPLETAS');
for(const count of [1,2,3]){element('opponentCount').value=String(count);element('difficulty').value='hard';game.updateMenuPreview();assert.ok(element('soloStartLabel').textContent.includes(String(count)));assert.match(element('raceSummary').textContent,/DIFÍCIL/);}
for(const model of Object.keys(game.CAR_MODELS))for(const color of ['pink','cyan','lime','orange','violet','white']){element('carModel').value=model;element('carColor').value=color;game.updateGaragePreview();assert.ok(element('carPreview')['aria-label'].includes(game.CAR_MODELS[model].name));assert.equal(JSON.stringify(game.cars),simulation);}
element('stageSelect').value='2';element('carModel').value='rally';element('carColor').value='cyan';game.start('solo');assert.equal(game.track.name,'DUSTY MESA');assert.equal(game.cars[0].model,'rally');assert.equal(game.cars[0].color,'#39e8e8');
game.start('solo',5,true);assert.equal(element('stageSelect').value,'5','Menu selection did not follow championship progress');
console.log('PASS: 14 real route previews, correct checkpoints/records/barriers, CPU/difficulty summary, 24 model/paint previews, pure preview state and chosen settings/season stage. Native keyboard/menu focus are checked in Chromium.');
