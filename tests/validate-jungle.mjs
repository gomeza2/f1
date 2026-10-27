import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {loadGame} from './helpers/game-harness.mjs';
import {analyzeTrackWidth} from './helpers/track-geometry.mjs';
import {sampleTrackShape,normalizedShapeDistance} from './helpers/track-shape.mjs';
const old=JSON.parse(readFileSync(new URL('./fixtures/jungle-0.59.json',import.meta.url),'utf8'));
const {game:g,element:e}=loadGame(),track=g.tracks[5],shape=sampleTrackShape(track);
assert.equal(track.name,old.name);assert.equal(track.layoutVersion,3);assert.equal(track.roadVersion,1);assert.equal(track.surface,'grass');assert.equal(track.defaultBarriers,'open');
assert.ok(track.length>6150&&track.length<6250);assert.ok(normalizedShapeDistance(shape,old.shape)>.5,'Jungle was only enlarged');
for(const [a,b] of [[g.CAR_MODELS,old.models],[g.AI_DRIVERS,old.drivers],[g.AI_PERSONALITIES,old.personalities]])assert.deepEqual(JSON.parse(JSON.stringify(a)),b);
assert.equal(g.PHYSICS_VERSION,old.physics);assert.equal(g.WORLD_SPEED_SCALE,old.worldSpeed);
const materials=JSON.parse(JSON.stringify(g.TERRAIN_MATERIALS));assert.ok(materials.grass.road);delete materials.grass.road;assert.deepEqual(materials,old.materials,'Art changed material physics');
let nearest=Infinity;
for(const t of g.tracks.filter(t=>t!==track)){const hash=createHash('sha256').update(JSON.stringify({points:t.points,samples:t.samples,worldScale:t.worldScale,layoutVersion:t.layoutVersion,roadProfile:t.roadProfile,roadVersion:t.roadVersion})).digest('hex');assert.equal(hash,old.otherTracks[t.name],t.name+' changed');const d=normalizedShapeDistance(shape,sampleTrackShape(t));nearest=Math.min(nearest,d);assert.ok(d>.35,'Jungle resembles '+t.name);}
const geometry=analyzeTrackWidth(track,d=>g.roadHalfWidthAt(d,track));assert.ok(geometry.roadMargin>70&&geometry.clearance>45);
e('barrierMode').value='open';g.start('solo',5);assert.equal(g.checkpoints.length,9);const gaps=[0,...g.checkpoints.map(c=>c.progress),track.length];assert.ok(gaps.slice(1).every((d,i)=>d-gaps[i]<=650));
assert.equal(Math.min(...track.roadProfile.map(p=>p[1])),36);assert.equal(Math.max(...track.roadProfile.map(p=>p[1])),58);
for(let d=0;d<track.length;d+=20){assert.equal(g.roadSectionAt(d).kerb,0);const p=g.sampleAt(d);assert.equal(g.terrainAt(p.x,p.y).material,'grass');}
assert.notEqual(g.TERRAIN_MATERIALS.grass.road.body,g.TERRAIN_MATERIALS.asphalt.road.body);
g.bestLapRecords['JUNGLE SPRINT@2:p6:s1']=26;assert.equal(g.lapRecordKey(),'JUNGLE SPRINT@3:p6:r1:s1');g.saveBestLap(g.lapRecordKey(),40);assert.equal(g.bestLapRecords['JUNGLE SPRINT@2:p6:s1'],26);
const human=g.cars[0];g.placeCar(human,track.length-1,0);human.speed=120;g.setKeys({w:true});g.physics(human,0,1/60);assert.equal(human.lap,0,'Meta accepted skipped gates');
e('stageSelect').value='5';g.updateMenuPreview();assert.match(e('previewRouteInfo').textContent,/9 CHECKPOINTS/);
console.log(`PASS: Jungle ${track.length.toFixed(1)} units (+${((track.length/old.oldLength-1)*100).toFixed(1)}%), nearest ${nearest.toFixed(3)}, world margin ${geometry.roadMargin.toFixed(1)}/branch gap ${geometry.clearance.toFixed(1)}, native grass/72–116 width/9 gates, thirteen unchanged routes and retained records/physics.`);
if(process.argv.includes('--geometry'))process.exit(0);
let races=0,laps=0;
for(const profile of ['auto','open','full','half','corners']){
 e('barrierMode').value=profile;e('difficulty').value='normal';e('opponentCount').value='1';g.start('solo',5);g.cars[0].done=true;const ai=g.cars[1];let off=0;
 for(let n=0;n<12000&&ai.lap<2;n++){g.tick(1/60);if(g.terrainAt(ai.x,ai.y).offroad)off++;}
 assert.equal(ai.lap,2,profile+': stuck/missed gates');assert.equal(off,0,profile+': CPU left road');assert.ok(ai.lapTimes.every(t=>t>25&&t<48));races++;laps+=2;console.log(`JUNGLE PROFILE ${profile}: ${ai.lapTimes.map(t=>t.toFixed(2))}, off-road ${off}`);
}
for(const model of Object.keys(g.CAR_MODELS)){
 e('barrierMode').value='open';e('carModel').value=model;g.start('solo',5);const c=g.cars[0];c.isAI=true;g.cars[1].done=true;
 for(let n=0;n<12000&&c.lap<2;n++){const x=c.x,y=c.y;g.tick(1/60);assert.ok(c.speed<=g.CAR_MODELS[model].maxSpeed);assert.ok(Math.hypot(c.x-x,c.y-y)<=g.CAR_MODELS[model].maxSpeed*g.WORLD_SPEED_SCALE/60+1e-5,'Recovery teleported');}
 assert.equal(c.lap,2,model+': failed');races++;laps+=2;console.log(`JUNGLE MODEL ${model}: ${c.lapTimes.map(t=>t.toFixed(2))}`);
}
const times=[];
for(const level of ['easy','normal','hard']){
 e('difficulty').value=level;e('barrierMode').value='auto';e('opponentCount').value='3';g.start('solo',5);g.cars[0].isAI=true;g.cars[0].model='balanced';let contacts=0;
 for(let n=0;n<15000&&!g.cars.every(c=>c.done);n++)if(g.tick(1/60))contacts++;
 assert.ok(g.cars.every(c=>c.lap===3&&Number.isFinite(c.finishTime)));assert.ok(contacts<=30,level+': sustained overlap');times.push(g.cars[0].finishTime);races++;laps+=12;console.log(`JUNGLE GRID ${level}: ${g.cars.map(c=>(c.finishTime/3).toFixed(2))}, contacts ${contacts}`);
}
assert.ok(times[0]>times[1]&&times[1]>times[2],'Difficulty order reversed');
console.log(`PASS: ${races} Jungle races/${laps} valid laps, five barriers/four models/three four-car grids at production 60 Hz. Human fun and balance remain unverified.`);
