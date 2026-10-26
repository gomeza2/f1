import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();let paintedCells=0,gridProbes=0,profileCases=0;
const keys=cells=>new Set(cells.map(cell=>cell.y*game.track.worldWidth+cell.x));
for(let stage=0;stage<14;stage++){
 element('barrierMode').value='open';game.start('solo',stage);
 const open=game.runoffRaster(),openKeys=keys(open),eligible=['asphalt','mixed','coastal'].includes(game.track.surface);
 assert.equal(open.length>0,eligible,`${game.track.name}: missing traps or imported gravel into native terrain`);
 assert.equal(game.runoffRaster(),open,'Raster cache was rebuilt without a change');paintedCells+=open.length;
 // Independent full-world sampling checks coverage and clipping, using the exact pixel centres.
 for(let y=1;y<game.track.worldHeight;y+=22)for(let x=1;x<game.track.worldWidth;x+=22){
  const material=game.terrainAt(x,y).material;assert.equal(openKeys.has((y-1)*game.track.worldWidth+x-1),material==='gravel',`${game.track.name}: raster and world material disagree at ${x},${y}`);gridProbes++;
 }
 for(const profile of ['auto','open','full','half','corners']){
  element('barrierMode').value=profile;game.start('solo',stage);const cells=game.runoffRaster();profileCases++;
  if(profile==='full')assert.equal(cells.length,0,'Full rails left hidden/inaccessible traps');
  for(const cell of cells)assert.ok(openKeys.has(cell.y*game.track.worldWidth+cell.x),'Barrier profile created gravel outside the open profile');
  for(let i=0;i<cells.length;i+=Math.max(1,Math.floor(cells.length/60))){const cell=cells[i],x=cell.x+1,y=cell.y+1,loc=game.nearestOnTrack(x,y);
   assert.equal(game.terrainAt(x,y,loc).material,'gravel');assert.ok(loc.distance>game.roadHalfWidthAt(loc.progress));assert.equal(game.guardrailActive(loc.progress),false,'Gravel crosses an active steel barrier');assert.ok(x>=0&&y>=0&&x<game.track.worldWidth&&y<game.track.worldHeight);
  }
 }
 console.log(`RUNOFF: ${game.track.name}, ${open.length} open-profile cells.`);
}
element('barrierMode').value='open';game.start('solo',0);const cells=game.runoffRaster(),expected=new Map(cells.map(c=>[c.y*game.track.worldWidth+c.x,c]));
let fills=0,fillStyle;game.drawRunoff({set fillStyle(value){fillStyle=value},fillRect(x,y,w,h){const cell=expected.get(y*game.track.worldWidth+x);assert.ok(cell,'Renderer painted an undefined trap');assert.equal(w,game.RUNOFF_CELL);assert.equal(h,game.RUNOFF_CELL);assert.equal(fillStyle,game.TERRAIN_MATERIALS.gravel.palette[cell.tone]);fills++;}});assert.equal(fills,cells.length);
const zone=game.runoffZones[0];for(const [offset,material] of [[35,'asphalt'],[45,'asphalt'],[60,'gravel'],[75,'gravel'],[95,'grass']]){const p=game.sampleAt(zone.center);assert.equal(game.terrainAt(p.x-Math.sin(p.angle)*zone.side*offset,p.y+Math.cos(p.angle)*zone.side*offset).material,material,'Pavement/curb/gravel/grass sequence failed');}
function coast(offset,model='balanced',throttle=false,speed=160,progress=zone.center){element('carModel').value=model;game.start('solo',0);game.cars[1].done=true;const car=game.cars[0];game.placeCar(car,progress,zone.side*offset);car.speed=speed;game.setKeys(throttle?{w:true}:{});for(let i=0;i<15;i++)game.physics(car,0,1/60);return car.speed;}
// Compare materials at equal offset, before the distant-world recovery penalty.
const paved=coast(20),gravel=coast(66),grass=coast(66,'balanced',false,160,600);assert.equal(game.terrainAt(game.cars[0].x,game.cars[0].y).material,'grass');assert.ok(gravel<paved-25&&gravel<grass-8,`Gravel did not brake distinctly: ${paved}/${gravel}/${grass}`);
for(const model of Object.keys(game.CAR_MODELS)){assert.equal(coast(66,model,false,0),0,'Gravel generated speed from rest');assert.ok(coast(66,model,true,0)>0,'Throttle cannot recover a parked car from gravel');}
game.start('solo',0);const sliding=game.cars[0];game.placeCar(sliding,zone.center,zone.side*66);sliding.speed=100;game.setKeys({' ':true,d:true});game.physics(sliding,0,1/60);assert.equal(game.skidMarks.length,2);assert.ok(game.skidMarks.every(mark=>mark.color===game.TERRAIN_MATERIALS.gravel.mark),'Gravel kept asphalt-black tire marks');
// Both local players use the same material and per-step vehicle equations.
element('carModel').value='balanced';game.start('duo',0);const [human,other]=game.cars;game.placeCar(human,zone.center,zone.side*66);game.placeCar(other,zone.center,zone.side*66);human.speed=other.speed=100;game.setKeys({w:true,arrowup:true});game.physics(human,0,1/60);game.physics(other,1,1/60);assert.equal(human.speed,other.speed);assert.equal(human.x,other.x);assert.equal(human.y,other.y);
// A real CPU must drive out through the shared gravel resistance, never jump back to asphalt.
game.start('solo',0);game.cars[0].done=true;const ai=game.cars[1];game.placeCar(ai,zone.center,zone.side*66);ai.speed=25;let recovered=false;
for(let i=0;i<1800;i++){const x=ai.x,y=ai.y;game.physics(ai,1,1/60);assert.ok(Math.hypot(ai.x-x,ai.y-y)<=232*game.WORLD_SPEED_SCALE/60+1e-6,'CPU recovery teleported');if(!game.terrainAt(ai.x,ai.y).offroad){recovered=true;break}}
assert.ok(recovered,'CPU could not recover from the gravel trap');
game.bestLapRecords['SUNSET CIRCUIT@3:p2']=39;assert.equal(game.lapRecordKey(),'SUNSET CIRCUIT@3:p5:r1');assert.ok(game.saveBestLap(game.lapRecordKey(),42));assert.equal(game.bestLapRecords['SUNSET CIRCUIT@3:p2'],39);
console.log(`PASS: ${profileCases} profiles, ${gridProbes} independent world probes, ${paintedCells} open cells, renderer/material agreement, paved/curb/gravel/grass transition, distinct braking (${paved.toFixed(1)}/${gravel.toFixed(1)}/${grass.toFixed(1)}), recovery without generated speed, equal local physics and preserved records. Browser edge raster tolerance is one 2-unit cell; human feel remains unverified.`);
