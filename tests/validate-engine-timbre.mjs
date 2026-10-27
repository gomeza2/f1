import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import vm from 'node:vm';
import {AudioContext} from './helpers/audio-context.mjs';
const window={};vm.runInNewContext(readFileSync(new URL('../engine-audio.js',import.meta.url),'utf8'),{window});const library=window.PixelEngineAudio,ctx=new AudioContext(),out=ctx.createGain(),voice=library.create(ctx,out),allocated=ctx.nodes.length;
for(const model of Object.keys(library.profiles)){
 voice.reset();for(let n=0;n<360;n++){ctx.currentTime=n/60;voice.update({speed:260,maxSpeed:260,model,throttle:1,audible:true});}
 assert.equal(voice.state.gear,5);assert.ok(voice.state.cruise>.99);assert.ok(voice.engine.frequency.value>60&&voice.engine.frequency.value<220,'Top-end remains in the old high firing range');assert.ok(Math.abs(voice.sub.frequency.value*2-voice.engine.frequency.value)<1e-10,'Body is not a coherent octave');assert.equal(voice.sub.type,'triangle');
 const steadyFilter=voice.filter.frequency.value,frozen=[voice.state.gear,voice.state.rpm,voice.state.load,voice.state.cruise,voice.state.acceleration];
 for(let n=0;n<10;n++){ctx.currentTime+=1/60;voice.update({speed:0,maxSpeed:260,model,throttle:1,audible:false});assert.equal(voice.gain.gain.value,0);assert.equal(voice.subGain.gain.value,0);}
 assert.deepEqual([voice.state.gear,voice.state.rpm,voice.state.load,voice.state.cruise,voice.state.acceleration],frozen,'Pause/OFF changed audible motor state');
 for(let n=0;n<120;n++){ctx.currentTime+=1/60;voice.update({speed:260,maxSpeed:260,model,throttle:0,audible:true});}
 assert.ok(voice.state.load<.001&&voice.state.cruise<.001);assert.ok(voice.filter.frequency.value<steadyFilter,'Lift did not soften the loaded tone');assert.equal(ctx.nodes.length,allocated,'Updates allocated audio nodes');
}
// Hold the 60-Hz speed samples at each display/audio refresh; do not mistake repeated samples for cruise.
const rates=[20,30,60,120,144],values=[];
for(const rate of rates){voice.reset();for(let n=0;n<=rate*4;n++){ctx.currentTime=n/rate;voice.update({speed:260*Math.floor(n/rate*60)/240,maxSpeed:260,throttle:1,audible:true});if(n>rate*3.2)assert.ok(voice.state.cruise<.01,'Accelerating vehicle entered cruise at '+rate+'Hz');}assert.ok(voice.state.acceleration>.15);for(let n=1;n<=rate*2;n++){ctx.currentTime=4+n/rate;voice.update({speed:260,maxSpeed:260,throttle:1,audible:true});}assert.ok(voice.state.cruise>.98);values.push({rate,cruise:voice.state.cruise});}
voice.reset();assert.equal(voice.state.cruise,0);assert.equal(voice.state.acceleration,0);assert.equal(voice.state.lastRatio,null);assert.equal(voice.state.lastTime,null);
const wave=library.pulseCoefficients();assert.equal(wave.real.length,17);assert.equal(wave.real[0],0);assert.equal(wave.imag[0],0);assert.ok([...wave.real,...wave.imag].every(Number.isFinite));
console.log(JSON.stringify(values));console.log('PASS: four model top-end voices/body octave, smooth actual-speed cruise, no false cruise at five refresh rates over 60-Hz physics, lift/pause/reset and allocation-free two-source motor. Perceived sound requires human listening.');
