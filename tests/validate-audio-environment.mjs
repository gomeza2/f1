import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadGame} from './helpers/game-harness.mjs';
import {AudioContext} from './helpers/audio-context.mjs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8').replace('function updateAudio(){','function updateAudio(){globalThis.testGame.audioLayers={ambient:audioAmbient,rival:audioRival,module:window.PixelEngineAudio};');
const {game:g,element:e}=loadGame({audioContextClass:AudioContext,sourceOverride:source});
g.start('solo',0);g.setCountdown(0);g.updateAudio();const ctx=g.audioContext;
const layers=g.audioLayers;
assert.ok(layers.ambient.gain.gain.value>0);
const human=g.cars[0],cpu=g.cars.find(c=>c.isAI);Object.assign(cpu,{x:human.x+10,y:human.y,speed:120});ctx.currentTime+=.1;g.updateAudio();assert.ok(layers.rival.gain.gain.value>0);
cpu.x=human.x+1000;g.updateAudio();assert.equal(layers.rival.gain.gain.value,0);
const signatures=new Set();for(const material of ['asphalt','dirt','grass','ice','gravel','volcanic']){
 const texture=layers.module.surfaceState(material,150,.8);signatures.add(texture.frequency);assert.ok(texture.roll>0&&texture.skid>0);
 assert.equal(layers.module.surfaceState(material,0,1).roll,0);assert.equal(layers.module.surfaceState(material,150,0).skid,0);
}
assert.equal(signatures.size,6);assert.equal(Object.keys(layers.module.ambiences).length,14);
const nodes=ctx.nodes.length;for(let n=0;n<1000;n++){ctx.currentTime+=1/60;g.updateAudio();}assert.equal(ctx.nodes.length,nodes,'Audio updates allocate new nodes');
g.playRaceCue('record',human);const before=layers.ambient.gain.gain.value;g.updateAudio();assert.ok(layers.ambient.gain.gain.value<before);
ctx.advance(ctx.currentTime+1);g.updateAudio();assert.equal(g.audioVoices.size,0);
g.togglePause();assert.equal(layers.ambient.gain.gain.value,0);assert.equal(layers.rival.gain.gain.value,0);g.togglePause();
g.playRaceCue('impact',human,.2);assert.equal(g.audioVoices.size,1,'Low energy scrape uses only noise');ctx.advance(ctx.currentTime+1);g.playRaceCue('impact',human,1);assert.equal(g.audioVoices.size,2,'Hard contact uses noise and body');
e('backBtn').onclick();assert.equal(g.audioMaster.gain.value,0);
console.log('PASS: six physical material signatures/no static rolling or straight skid, 14 theme profiles, pooled near/far CPU, 1000 allocation-free updates, cue ducking, pause, weak scrape vs strong impact and menu silence.');
