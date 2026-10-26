import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();
let objects=0,high=0,lite=0;const kinds=new Set(),fingerprints=[];
function recordedPoints(d){
 const points=[];let tx=0,ty=0;const stack=[];
 const point=(x,y)=>points.push({x:x+tx,y:y+ty});
 const context={save(){stack.push([tx,ty])},restore(){[tx,ty]=stack.pop()},translate(x,y){tx+=x;ty+=y},
 beginPath(){},closePath(){},fill(){},moveTo:point,lineTo:point,
 fillRect(x,y,w,h){point(x,y);point(x+w,y);point(x,y+h);point(x+w,y+h)},
 ellipse(x,y,rx,ry){for(let i=0;i<64;i++)point(x+Math.cos(i*Math.PI/32)*rx,y+Math.sin(i*Math.PI/32)*ry)}};
 game.drawSceneryObject(context,d);return points;
}
const stages=process.env.TEST_TRACKS?process.env.TEST_TRACKS.split(',').map(Number):game.tracks.map((_,i)=>i);
assert.ok(stages.every(i=>Number.isInteger(i)&&i>=0&&i<game.tracks.length),'Invalid TEST_TRACKS');
for(const graphics of ['high','retro','lite']){
 element('graphics').value=graphics;
 for(const stage of stages){
  game.start('solo',stage);const list=game.decorations;
  assert.ok(list.length>0,`${game.track.name}/${graphics}: no scenery`);
  assert.strictEqual(game.decorationsForTrack(),list,'Scenery should be reused from cache');
  assert.ok(list.length<160,'Unbounded decoration density');
  if(game.track.worldWidth>=2200){
   assert.ok(list.length<=({high:150,retro:110,lite:80})[graphics],'Long-world scenery exceeds quality budget');
   const quadrants=[0,0,0,0];for(const d of list)quadrants[Number(d.x>game.track.worldWidth/2)+2*Number(d.y>game.track.worldHeight/2)]++;assert.ok(quadrants.every(n=>n>=3),'Budget cropped scenery to one corner of the long world');
  }
  if(graphics==='high'){high+=list.length;fingerprints[stage]=JSON.stringify(list);}
  if(graphics==='lite')lite+=list.length;
  for(const [i,d] of list.entries()){
   objects++;kinds.add(d.kind);
   assert.ok(game.SCENERY_THEMES[d.theme].kinds.includes(d.kind));
   assert.ok(d.x>=d.radius&&d.y>=d.radius&&d.x+d.radius<=game.track.worldWidth&&d.y+d.radius<=game.track.worldHeight);
   assert.ok(game.nearestOnTrack(d.x,d.y).distance-d.radius>=124-1e-6,'Scenery footprint occupies recovery corridor');
   for(const p of recordedPoints(d))assert.ok(Math.hypot(p.x-d.x,p.y-d.y)<=d.radius+1e-6,`${d.kind}: visible geometry exceeds reserved footprint`);
   for(const other of list.slice(i+1))assert.ok(Math.hypot(d.x-other.x,d.y-other.y)>=d.radius+other.radius+5-1e-6,'Scenery overlaps another object');
  }
  if(graphics==='high')console.log(`SCENERY: ${game.track.name}, ${list.length} objects, ${[...new Set(list.map(d=>d.kind))].join('/')}.`);
 }
}
assert.ok(high>lite,'Performance mode did not reduce overall object count');
const fresh=loadGame();fresh.element('graphics').value='high';
for(const stage of stages){fresh.game.start('solo',stage);assert.equal(JSON.stringify(fresh.game.decorations),fingerprints[stage],'Seeded scenery changed after a fresh load');}
if(stages.length===game.tracks.length)assert.ok(kinds.size>=14,'Theme variety regressed');
console.log(`PASS: ${objects} scenery placements in ${stages.length} tracks/three quality settings, visible bounds, exact road clearance, world edges, object spacing, deterministic generation and cached reuse (${high} high vs ${lite} lite objects).`);
