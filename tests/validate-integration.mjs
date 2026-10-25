import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadGame } from './helpers/game-harness.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=readFileSync(resolve(root,'index.html'),'utf8');
const source=readFileSync(resolve(root,'script.js'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'HTML IDs must be unique');
for(const [,id] of source.matchAll(/\$\('([^']+)'\)/g))assert.ok(ids.includes(id),`Missing HTML ID ${id}`);
const build=html.match(/name="application-version" content="([^"]+)"/)?.[1];
assert.ok(build,'Release must identify its version');assert.ok(html.includes('BUILD '+build+' //'),'Footer and release version disagree');
for(const [,path] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 const asset=path.split(/[?#]/)[0];assert.ok(existsSync(resolve(root,asset)),`Missing asset ${path}`);
 assert.equal(new URL(path,'https://example.test/f1/').searchParams.get('v'),build,`Asset version disagrees with release: ${path}`);
}
const {game,element}=loadGame();
const originals=['SUNSET CIRCUIT','NEON HARBOR','DUSTY MESA','NIGHT RUN','FROSTBITE GP','JUNGLE SPRINT','VOLCANO RING','PIXEL CITY','THUNDER VALLEY','CHAMPION ROAD'];
assert.deepEqual(Array.from(game.tracks.slice(0,10),t=>t.name),originals);
assert.equal(game.tracks[0].defaultBarriers,'open','The introductory track must allow open recovery');
assert.equal(game.tracks.filter(t=>t.defaultBarriers==='open').length,7);
assert.ok(game.tracks.every(t=>t.defaultBarriers!=='full'),'Full walls should be an explicit player choice');
for(let stage=0;stage<game.tracks.length;stage++){
 for(const profile of ['auto','full','half','corners','open']){
  element('barrierMode').value=profile;game.start('solo',stage);
  for(let d=0;d<game.track.length;d+=20){
   if(profile==='full')assert.equal(game.guardrailActive(d),true);
   if(profile==='open')assert.equal(game.guardrailActive(d),false);
   if(profile==='half')assert.equal(game.guardrailActive(d),d<game.track.length*.5);
  }
  assert.ok(game.checkpoints.length>=5,'Long races need enough ordered checkpoints');
  for(const gate of game.checkpoints){
   const p=game.sampleAt(gate.progress);
   assert.ok(game.nearestOnTrack(p.x,p.y).distance<1e-5,'Checkpoint must lie on the road');
  }
 }
}
console.log('PASS: HTML IDs/assets, ten original tracks, 70 track/barrier configurations and checkpoint center positions. Collision alignment still requires visual review.');
