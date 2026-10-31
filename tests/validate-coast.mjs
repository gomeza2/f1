import {withoutSharedDriving} from './helpers/without-shared-driving.mjs';
import {withoutReverseRecovery} from './helpers/without-reverse-recovery.mjs';
import {withoutPedalBlend} from './helpers/without-pedal-blend.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {loadGame} from './helpers/game-harness.mjs';
import {analyzeTrackWidth} from './helpers/track-geometry.mjs';
import {sampleTrackShape,normalizedShapeDistance} from './helpers/track-shape.mjs';
const old=JSON.parse(readFileSync(new URL('./fixtures/coast-0.66.json',import.meta.url),'utf8'));
const {game:g,element:e}=loadGame(),track=g.tracks[10],shape=sampleTrackShape(track);
assert.equal(track.name,'COASTLINE RUN');assert.equal(track.layoutVersion,3);assert.equal(track.roadVersion,1);assert.equal(track.surface,'coastal');assert.equal(track.defaultBarriers,'open');
assert.ok(track.length>6800&&track.length<7400);const change=normalizedShapeDistance(shape,old.oldShape);assert.ok(change>.25,'Coast was only enlarged');
for(const [actual,expected] of [[g.CAR_MODELS,old.models],[g.AI_DRIVERS,old.drivers],[g.AI_PERSONALITIES,old.personalities],[g.TERRAIN_MATERIALS,old.materials]])assert.deepEqual(JSON.parse(JSON.stringify(actual)),expected);
assert.equal(g.PHYSICS_VERSION,old.physics);
// Normalize only the declared 0.68 pedal correction before the historical hash.
const source=withoutPedalBlend(withoutReverseRecovery(withoutSharedDriving(readFileSync(new URL('../script.js',import.meta.url),'utf8'))));assert.equal(createHash('sha256').update(source.slice(source.indexOf('const AI_DRIVERS='),source.indexOf('function getTrackPath'))).digest('hex'),old.drivingCoreSha256,'Track update changed driving/AI/collision functions');assert.equal(source.split('\n').find(line=>line.startsWith('const DRIVING_TUNING=')),old.tuningLine);
let nearest=Infinity;
for(const t of g.tracks.filter(t=>t!==track)){const hash=createHash('sha256').update(JSON.stringify({points:t.points,samples:t.samples,worldScale:t.worldScale,layoutVersion:t.layoutVersion,roadProfile:t.roadProfile,roadVersion:t.roadVersion,surface:t.surface,defaultBarriers:t.defaultBarriers,dirtRanges:t.dirtRanges})).digest('hex');assert.equal(hash,old.otherTracks[t.name],t.name+': another track changed');nearest=Math.min(nearest,normalizedShapeDistance(shape,sampleTrackShape(t)));}assert.ok(nearest>.28,'Coast shares another route silhouette');
const geometry=analyzeTrackWidth(track,d=>g.roadHalfWidthAt(d,track));assert.ok(geometry.roadMargin>25&&geometry.clearance>20,JSON.stringify(geometry));
e('barrierMode').value='open';g.start('solo',10);assert.equal(g.checkpoints.length,10);const gaps=[0,...g.checkpoints.map(c=>c.progress),track.length];assert.ok(gaps.slice(1).every((d,i)=>d-gaps[i]<=650));
for(const d of [track.length*.31,track.length*.37]){
 assert.ok(Math.abs(g.roadHalfWidthAt(d-.001)-g.roadHalfWidthAt(d+.001))<.01,'Mixed transition abruptly narrows');assert.ok(Math.abs(g.barrierRadiusAt(d-.001)-g.barrierRadiusAt(d+.001))<.01,'Mixed transition jumps a barrier');assert.equal(g.roadSectionAt(d).kerb,0,'Kerb painted on dirt');
}
let asphalt=0,dirt=0,bare=0,kerbs=0;
for(let d=0;d<track.length;d+=8){const p=g.sampleAt(d),material=g.terrainAt(p.x,p.y).material,section=g.roadSectionAt(d);assert.equal(material,g.surfaceAtProgress(d));if(material==='dirt'){dirt++;assert.equal(section.kerb,0);}else asphalt++;if(section.kerb>3)kerbs++;else if(section.kerb<.1)bare++;}
assert.ok(asphalt>700&&dirt>40&&bare>100&&kerbs>100);
const cells=g.mixedRoadRaster();assert.ok(cells.length>5000&&cells.length<80000,'Mixed raster density unbounded');const keys=new Set(cells.map(c=>c.x+','+c.y));assert.equal(keys.size,cells.length);
for(const cell of cells){const ground=g.terrainAt(cell.x+1,cell.y+1);assert.equal(ground.material,'dirt');assert.equal(ground.offroad,false,'Dirt painted outside legal road');}
for(const [a,b] of [[track.length*.31,track.length*.37]])for(let d=a+8;d<b-8;d+=8){const p=g.sampleAt(d),width=g.roadSectionAt(d).halfWidth;for(const offset of [-width+5,0,width-5]){const x=p.x-Math.sin(p.angle)*offset,y=p.y+Math.cos(p.angle)*offset;assert.ok(keys.has(Math.floor(x/2)*2+','+Math.floor(y/2)*2),'Wide dirt has an asphalt strip');}}
e('graphics').value='lite';e('barrierMode').value='full';g.start('solo',10);assert.equal(g.mixedRoadRaster(),cells,'Changing quality/barriers rebuilt immutable material geometry');
g.bestLapRecords['COASTLINE RUN@2:p6:s1:b1']=24;assert.equal(g.lapRecordKey(),'COASTLINE RUN@3:p6:r1:s1:b1');g.saveBestLap(g.lapRecordKey(),45);assert.equal(g.bestLapRecords['COASTLINE RUN@2:p6:s1:b1'],24);
const c=g.cars[0];g.placeCar(c,track.length-1,0);c.speed=120;g.setKeys({w:true});g.physics(c,0,1/60);assert.equal(c.lap,0,'Meta accepted skipped gates');
console.log(JSON.stringify({length:track.length,change,nearest,geometry,cells:cells.length,asphalt,dirt,kerbs,bare}));
console.log('PASS: own Coast silhouette, 72–116 corridor, 10 ordered gates, continuous mixed widths/barriers, dirt coverage/physics/cache, retained records and thirteen unchanged tracks/models/material rules.');
if(process.argv.includes('--geometry'))process.exit(0);
let laps=0;
for(const profile of ['auto','open','full','half','corners']){
 e('barrierMode').value=profile;e('difficulty').value='normal';e('opponentCount').value='1';g.start('solo',10);g.cars[0].done=true;const car=g.cars[1];let off=0;const materials=new Set();
 for(let n=0;n<14000&&car.lap<2;n++){g.tick(1/60);const ground=g.terrainAt(car.x,car.y);if(ground.offroad)off++;materials.add(ground.material);}
 assert.equal(car.lap,2,profile+': cannot complete two laps');assert.equal(off,0,profile+': outside road');assert.deepEqual([...materials].sort(),['coastal','dirt']);assert.ok(car.lapTimes.every(t=>t>25&&t<65));laps+=2;console.log(`COAST ${profile}: ${car.lapTimes.map(t=>t.toFixed(2))}, off ${off}`);
}
for(const model of Object.keys(g.CAR_MODELS)){
 e('barrierMode').value='open';e('carModel').value=model;g.start('solo',10);g.cars[1].done=true;const car=g.cars[0];car.isAI=true;
 for(let n=0;n<14000&&car.lap<2;n++){const x=car.x,y=car.y;g.tick(1/60);assert.ok(car.speed<=g.CAR_MODELS[model].maxSpeed);assert.ok(Math.hypot(car.x-x,car.y-y)<=g.CAR_MODELS[model].maxSpeed*g.WORLD_SPEED_SCALE/60+1e-5,'Recovery teleported');}assert.equal(car.lap,2,model+': failed gates');laps+=2;console.log(`COAST MODEL ${model}: ${car.lapTimes.map(t=>t.toFixed(2))}`);
}
for(const level of ['easy','hard']){
 e('difficulty').value=level;e('barrierMode').value='auto';g.start('solo',10);g.cars[0].done=true;const car=g.cars[1];for(let n=0;n<14000&&car.lap<2;n++)g.tick(1/60);assert.equal(car.lap,2);laps+=2;console.log(`COAST ${level}: ${car.lapTimes.map(t=>t.toFixed(2))}`);
}
e('carModel').value='balanced';e('opponentCount').value='3';e('difficulty').value='normal';g.start('solo',10);g.cars[0].isAI=true;let contacts=0,offroad=0;for(let n=0;n<16000&&!g.cars.every(c=>c.done);n++){if(g.tick(1/60))contacts++;for(const car of g.cars)if(!car.done&&g.terrainAt(car.x,car.y).offroad)offroad++;}assert.ok(g.cars.every(c=>c.lap===3&&Number.isFinite(c.finishTime)),'Grid failed normal finish');assert.ok(contacts<=15,'Sustained traffic contacts');assert.ok(Math.max(...g.cars.map(c=>c.finishTime))-Math.min(...g.cars.map(c=>c.finishTime))<18,'Grid exceeds normal finish deadline');assert.equal(offroad,0);laps+=12;console.log(`COAST GRID: ${g.cars.map(c=>(c.finishTime/3).toFixed(2))}, contacts ${contacts}`);
console.log(`PASS: ${laps} valid Coast laps, five barriers/four models/three levels/one four-car grid. Human fun and handling remain open.`);
