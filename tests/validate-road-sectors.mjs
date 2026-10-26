import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
import {analyzeTrackWidth} from './helpers/track-geometry.mjs';
const {game,element}=loadGame();
let checks=0;
for(const stage of [0,1,2,3,6]){
 element('barrierMode').value='open';game.start('solo',stage);const track=game.track;
 const geometry=analyzeTrackWidth(track,d=>game.roadHalfWidthAt(d));
 assert.ok(geometry.roadMargin>12,`${track.name}: road/world margin ${geometry.roadMargin}`);
 assert.ok(geometry.clearance>8,`${track.name}: distant road overlap ${geometry.clearance}`);
 const profile=track.roadProfile;assert.equal(profile[0][0],0);assert.equal(profile.at(-1)[0],1);assert.deepEqual(Array.from(profile[0].slice(1)),Array.from(profile.at(-1).slice(1)));
 for(const [phase,width,kerb] of profile.slice(0,-1)){
  const section=game.roadSectionAt(phase*track.length);assert.ok(Math.abs(section.halfWidth-width)<1e-10);assert.ok(Math.abs(section.kerb-kerb)<1e-10);
 }
 assert.deepEqual(game.roadSectionAt(-1),game.roadSectionAt(track.length-1));
 let narrow=Infinity,wide=0,kerbs=0,bare=0;
 for(let d=0;d<track.length;d+=5){
  const a=game.roadSectionAt(d),b=game.roadSectionAt(d+5),width=game.roadHalfWidthAt(d);
  assert.ok(a.halfWidth>=34&&a.halfWidth<=56);assert.ok(a.kerb>=0&&a.kerb<=6);
  assert.ok(Math.abs(width-game.roadHalfWidthAt(d+5))<1,'Abrupt narrowing');
  narrow=Math.min(narrow,width);wide=Math.max(wide,width);if(a.kerb>3)kerbs++;if(a.kerb<.1)bare++;
  assert.deepEqual(game.roadSectionAt(d+track.length),a,'Cross-section is not periodic');
  // Probe real world positions, including both sides of bare asphalt and usable kerbs.
  const p=game.sampleAt(d);
  for(const side of [-1,1])for(const delta of [-3,3]){
   const offset=(width+delta)*side,x=p.x-Math.sin(p.angle)*offset,y=p.y+Math.cos(p.angle)*offset,loc=game.nearestOnTrack(x,y);
   const gap=Math.abs(loc.progress-d);
   if(Math.min(gap,track.length-gap)>6)continue;
   if(Math.abs(loc.distance-game.roadHalfWidthAt(loc.progress))<1)continue;
   assert.equal(game.terrainAt(x,y,loc).offroad,delta>0,`${track.name}: visual/legal edge at ${d}/${offset}`);checks++;
  }
 }
 assert.ok(wide-narrow>15,'Profile does not change usable width');assert.ok(bare>0);if([0,1,3].includes(stage))assert.ok(kerbs>0);
 for(const gate of game.checkpoints)assert.equal(gate.halfWidth,game.roadHalfWidthAt(gate.progress));
 const legacy=track.name+'@'+track.layoutVersion+':p4';game.bestLapRecords[legacy]=18;
 assert.equal(game.lapRecordKey(),legacy.replace(':p4',':p5')+':r1');assert.ok(game.saveBestLap(game.lapRecordKey(),30));assert.equal(game.bestLapRecords[legacy],18);
 console.log(`SECTORS: ${track.name}, full width ${(2*narrow).toFixed(1)}–${(2*wide).toFixed(1)}, margin ${geometry.roadMargin.toFixed(1)}, clearance ${geometry.clearance.toFixed(1)}.`);
}
for(const item of game.tracks.filter(t=>!t.roadProfile))for(let d=0;d<item.length;d+=100){const paved=['asphalt','coastal'].includes(game.surfaceAtProgress(d,item));assert.equal(game.roadHalfWidthAt(d,item),paved?48:42);}
console.log(`PASS: five distinct width profiles, smooth loop transitions, legal materials at ${checks} real edge probes, kerb/bare sectors, variable road geometry, ordered gate widths, separate records and nine unchanged cross-sections. Render agreement is checked in Chromium.`);

// A localized widening can overlap while the old constant-width corridor still passes.
const points=[[60,60],[240,60],[240,180],[60,180]],samples=[];let length=0;
for(let i=0;i<points.length;i++){const [x,y]=points[i],next=points[(i+1)%points.length];samples.push({x,y,d:length});length+=Math.hypot(next[0]-x,next[1]-y);}
const fixture={samples,length,worldWidth:300,worldHeight:300};
assert.ok(analyzeTrackWidth(fixture,42).clearance>0);
assert.ok(analyzeTrackWidth(fixture,d=>d<180||d>300&&d<480?65:42).clearance<0,'Variable width overlap was missed');
