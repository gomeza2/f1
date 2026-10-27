import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadGame} from './helpers/game-harness.mjs';
import {analyzeTrackWidth} from './helpers/track-geometry.mjs';
import {sampleTrackShape,normalizedShapeDistance} from './helpers/track-shape.mjs';
const old=JSON.parse(readFileSync(new URL('./fixtures/pixel-0.52.json',import.meta.url),'utf8'));
const {game:g,element:e}=loadGame(),track=g.tracks[7],shape=sampleTrackShape(track);
assert.equal(track.name,old.name);assert.equal(track.layoutVersion,3);assert.equal(track.roadVersion,1);assert.equal(track.surface,'asphalt');assert.equal(track.defaultBarriers,'half');
assert.ok(track.length>4300&&track.length<4500);assert.ok(normalizedShapeDistance(shape,old.shape)>.25,'Pixel was only enlarged');
for(const [a,b] of [[g.CAR_MODELS,old.models],[g.AI_DRIVERS,old.drivers],[g.AI_PERSONALITIES,old.personalities]])assert.deepEqual(JSON.parse(JSON.stringify(a)),b);
assert.equal(g.PHYSICS_VERSION,old.physics+1); // p6 human countersteer only; core source frozen by validate-countersteer.
assert.equal(g.WORLD_SPEED_SCALE,old.worldSpeed);
const materials=JSON.parse(JSON.stringify(g.TERRAIN_MATERIALS));delete materials.grass.road;assert.deepEqual(materials,old.materials,'Changed terrain physics/other art'); // Jungle 0.60 adds native grass art.
let nearest=Infinity;
for(const t of g.tracks.filter(t=>t!==track)){
 const hash=createHash('sha256').update(JSON.stringify({points:t.points,samples:t.samples,worldScale:t.worldScale,layoutVersion:t.layoutVersion,roadProfile:t.roadProfile,roadVersion:t.roadVersion})).digest('hex');if(!(t.name==='JUNGLE SPRINT'&&t.layoutVersion===3))assert.equal(hash,old.otherTracks[t.name],t.name+' changed');
 const distance=normalizedShapeDistance(shape,sampleTrackShape(t));nearest=Math.min(nearest,distance);assert.ok(distance>.23,'Pixel resembles '+t.name);
}
const geometry=analyzeTrackWidth(track,d=>g.roadHalfWidthAt(d,track));assert.ok(geometry.roadMargin>45&&geometry.clearance>50);
g.start('solo',7);assert.equal(g.checkpoints.length,6);const gaps=[0,...g.checkpoints.map(cp=>cp.progress),track.length];assert.ok(gaps.slice(1).every((d,i)=>d-gaps[i]<=650));
assert.equal(Math.min(...track.roadProfile.map(p=>p[1]+p[2])),38);assert.equal(Math.max(...track.roadProfile.map(p=>p[1]+p[2])),56);
let bare=0,kerbed=0;for(let d=0;d<track.length;d+=20){const section=g.roadSectionAt(d);if(section.kerb<.1)bare++;if(section.kerb>5)kerbed++;const p=g.sampleAt(d);assert.equal(g.terrainAt(p.x,p.y).material,'asphalt');}assert.ok(bare>30&&kerbed>15,'Missing bare/kerbed sectors');

g.bestLapRecords['PIXEL CITY@2:p5']=26;assert.equal(g.lapRecordKey(),'PIXEL CITY@3:p6:r1:s1');g.saveBestLap(g.lapRecordKey(),36);assert.equal(g.bestLapRecords['PIXEL CITY@2:p5'],26);
const human=g.cars[0];g.placeCar(human,track.length-3,0);human.speed=120;g.setKeys({w:true});g.physics(human,0,.1);assert.equal(human.lap,0,'Meta accepted skipped gates');
e('stageSelect').value='7';g.updateMenuPreview();assert.match(e('previewRouteInfo').textContent,/6 CHECKPOINTS/);
console.log(`PASS: Pixel ${track.length.toFixed(1)} units (+${((track.length/old.oldLength-1)*100).toFixed(1)}%), nearest shape ${nearest.toFixed(3)}, width margin ${geometry.roadMargin.toFixed(1)}/branch clearance ${geometry.clearance.toFixed(1)}, asphalt with optional kerbs, 6 ordered gates, preserved models/physics/old records and remaining unchanged routes (Jungle has a newer snapshot).`);
if(process.argv.includes('--geometry'))process.exit(0);
let races=0,laps=0;
for(const profile of ['auto','open','full','half','corners']){
 e('barrierMode').value=profile;e('difficulty').value='normal';e('opponentCount').value='1';g.start('solo',7);g.cars[0].done=true;const ai=g.cars[1];let off=0;
 for(let i=0;i<12000&&ai.lap<2;i++){g.tick(1/60);if(g.terrainAt(ai.x,ai.y).offroad)off++;}
 assert.equal(ai.lap,2,profile+': unreachable gates or stuck');assert.equal(off,0,profile+': free CPU left legal road');assert.ok(ai.lapTimes.every(t=>t>20&&t<38));races++;laps+=2;console.log(`PIXEL PROFILE ${profile}: ${ai.lapTimes.map(t=>t.toFixed(2))}, off-road steps ${off}`);
}
for(const model of Object.keys(g.CAR_MODELS)){
 e('barrierMode').value='open';e('carModel').value=model;g.start('solo',7);const car=g.cars[0];car.isAI=true;g.cars[1].done=true;
 for(let i=0;i<12000&&car.lap<2;i++){const x=car.x,y=car.y;g.tick(1/60);assert.ok(car.speed<=g.CAR_MODELS[model].maxSpeed);assert.ok(Math.hypot(car.x-x,car.y-y)<=g.CAR_MODELS[model].maxSpeed*g.WORLD_SPEED_SCALE/60+1e-5,'Recovery teleported');}
 assert.equal(car.lap,2,model+': failed two laps');races++;laps+=2;console.log(`PIXEL MODEL ${model}: ${car.lapTimes.map(t=>t.toFixed(2))}`);
}
const times=[];
for(const level of ['easy','normal','hard']){
 e('difficulty').value=level;e('barrierMode').value='auto';e('opponentCount').value='3';g.start('solo',7);g.cars[0].isAI=true;g.cars[0].model='balanced';let contacts=0;
 for(let i=0;i<12000&&!g.cars.every(c=>c.done);i++)if(g.tick(1/30))contacts++;
 assert.ok(g.cars.every(c=>c.lap===3&&Number.isFinite(c.finishTime)));assert.ok(contacts<=30,level+': sustained overlap');times.push(g.cars[0].finishTime);races++;laps+=12;console.log(`PIXEL GRID ${level}: ${g.cars.map(c=>(c.finishTime/3).toFixed(2))}, contact steps ${contacts}`);
}
assert.ok(times[0]>times[1]&&times[1]>times[2],'Difficulty order reversed');
console.log(`PASS: ${races} Pixel races/${laps} valid laps, five barriers/four models/three four-car difficulty grids, shared physical limits. Human handling and balance remain unverified.`);
