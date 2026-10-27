import {assertOriginalModels} from './helpers/model-balance.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadGame} from './helpers/game-harness.mjs';
import {analyzeTrackWidth} from './helpers/track-geometry.mjs';
import {sampleTrackShape,normalizedShapeDistance} from './helpers/track-shape.mjs';
const old=JSON.parse(readFileSync(new URL('./fixtures/volcano-0.46.json',import.meta.url),'utf8'));
const {game,element}=loadGame(),track=game.tracks[6],shape=sampleTrackShape(track);
assert.equal(track.name,'VOLCANO RING');assert.equal(track.layoutVersion,3);assert.equal(track.roadVersion,1);assert.equal(track.surface,'volcanic');assert.equal(track.defaultBarriers,'corners');
assert.ok(track.length>4800&&track.length<5200);assert.ok(normalizedShapeDistance(shape,old.shape)>.25,'Route was only scaled');
assertOriginalModels(game.CAR_MODELS,old.models);assert.equal(game.PHYSICS_VERSION,6); /* Controller migration; validate-countersteer freezes the remaining p5 driving core. */assert.equal(game.WORLD_SPEED_SCALE,.84);
let nearest=Infinity;
for(const item of game.tracks.filter(t=>t!==track)){
 const hash=createHash('sha256').update(JSON.stringify({points:item.points,samples:item.samples,worldScale:item.worldScale,layoutVersion:item.layoutVersion,roadProfile:item.roadProfile,roadVersion:item.roadVersion})).digest('hex');if(!(['FROSTBITE GP','PIXEL CITY','JUNGLE SPRINT'].includes(item.name)&&item.layoutVersion===3))assert.equal(hash,old.otherTracks[item.name],item.name+' changed');
 const distance=normalizedShapeDistance(shape,sampleTrackShape(item));nearest=Math.min(nearest,distance);assert.ok(distance>.2,item.name+' resembles Volcano');
}
const geometry=analyzeTrackWidth(track,d=>game.roadHalfWidthAt(d,track));assert.ok(geometry.roadMargin>40&&geometry.clearance>50);
game.start('solo',6);assert.equal(game.checkpoints.length,7);for(let d=0;d<track.length;d+=20){assert.equal(game.roadSectionAt(d).kerb,0);const p=game.sampleAt(d);assert.equal(game.terrainAt(p.x,p.y).material,'volcanic');}
game.bestLapRecords['VOLCANO RING@2:p5']=25;assert.equal(game.lapRecordKey(),'VOLCANO RING@3:p6:r1:s1:b1');game.saveBestLap(game.lapRecordKey(),29);assert.equal(game.bestLapRecords['VOLCANO RING@2:p5'],25);
const human=game.cars[0];game.placeCar(human,track.length-3,0);human.speed=120;game.setKeys({w:true});game.physics(human,0,.1);assert.equal(human.lap,0,'Finish accepted skipped checkpoints');
element('stageSelect').value='6';game.updateMenuPreview();assert.match(element('previewRouteInfo').textContent,/7 CHECKPOINTS/);
console.log(`PASS: Volcano ${track.length.toFixed(1)} units, nearest shape ${nearest.toFixed(3)}, legal width margin ${geometry.roadMargin.toFixed(1)}/branch gap ${geometry.clearance.toFixed(1)}, native volcanic corridor, seven gates, preserved records/models and remaining unchanged historical routes; Frost, Pixel and Jungle have newer dedicated fixtures.`);
// Race the actual controller/physics, independently of render/asset checks.
if(process.argv.includes('--geometry'))process.exit(0);
let races=0,validLaps=0;
for(const profile of ['auto','open','full','half','corners']){
 element('barrierMode').value=profile;element('difficulty').value='normal';element('opponentCount').value='1';game.start('solo',6);game.cars[0].done=true;const ai=game.cars[1];
 for(let i=0;i<9000&&ai.lap<2;i++)game.tick(1/60);
 assert.equal(ai.lap,2,profile+': missed ordered gates or stuck');assert.ok(ai.lapTimes.every(t=>t>20&&t<45));races++;validLaps+=2;console.log(`VOLCANO PROFILE ${profile}: ${ai.lapTimes.map(t=>t.toFixed(2))}`);
}
for(const model of Object.keys(game.CAR_MODELS)){
 element('barrierMode').value='open';element('carModel').value=model;game.start('solo',6);const car=game.cars[0];car.isAI=true;game.cars[1].done=true;
 for(let i=0;i<9000&&car.lap<2;i++){const x=car.x,y=car.y;game.tick(1/60);assert.ok(car.speed<=game.CAR_MODELS[model].maxSpeed);assert.ok(Math.hypot(car.x-x,car.y-y)<=game.CAR_MODELS[model].maxSpeed*game.WORLD_SPEED_SCALE/60+1e-5,'Recovery teleported');}
 assert.equal(car.lap,2,model+': failed to complete two laps');races++;validLaps+=2;console.log(`VOLCANO MODEL ${model}: ${car.lapTimes.map(t=>t.toFixed(2))}`);
}
const difficultyTimes=[];
for(const difficulty of ['easy','normal','hard']){
 element('difficulty').value=difficulty;element('barrierMode').value='auto';element('opponentCount').value='3';game.start('solo',6);game.cars[0].isAI=true;game.cars[0].model='balanced';let contacts=0;
 for(let i=0;i<9000&&!game.cars.every(c=>c.done);i++)if(game.tick(1/30))contacts++;
 assert.ok(game.cars.every(c=>c.lap===3&&Number.isFinite(c.finishTime)));assert.ok(contacts<=30,difficulty+': prolonged overlapping contacts');difficultyTimes.push(game.cars[0].finishTime);races++;validLaps+=12;console.log(`VOLCANO GRID ${difficulty}: ${game.cars.map(c=>(c.finishTime/3).toFixed(2))}, contact frames ${contacts}`);
}
assert.ok(difficultyTimes[0]>difficultyTimes[1]&&difficultyTimes[1]>difficultyTimes[2],'Difficulty order reversed');
console.log(`PASS: ${races} Volcano races/${validLaps} valid laps, five barrier profiles, four models, four-car grids at three difficulties, shared physical limits. This is automated balance; human handling is unverified.`);
