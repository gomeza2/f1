import assert from 'node:assert/strict';
class Param{constructor(value=0){this.value=value}cancelScheduledValues(){}setTargetAtTime(value){assert.ok(Number.isFinite(value));this.value=value}setValueAtTime(value){assert.ok(Number.isFinite(value));this.value=value}linearRampToValueAtTime(value){this.setValueAtTime(value)}exponentialRampToValueAtTime(value){assert.ok(value>0);this.setValueAtTime(value)}}
class Node{constructor(context){this.context=context;this.gain=new Param();this.frequency=new Param(440);this.Q=new Param(1);for(const key of ['threshold','knee','ratio','attack','release'])this[key]=new Param();context.nodes.push(this)}setPeriodicWave(wave){this.wave=wave}connect(node){assert.ok(node);(this.connections||(this.connections=[])).push(node);return node}disconnect(){this.disconnected=true}start(time=0){this.startTime=time}stop(time=0){this.stopTime=time}}
export class AudioContext{
 static instances=0;
 constructor(){AudioContext.instances++;this.currentTime=0;this.sampleRate=48000;this.state='running';this.nodes=[];this.destination={};}
 createPeriodicWave(real,imag){assert.equal(real[0],0);return {real,imag}}
 createGain(){return new Node(this)}createOscillator(){return new Node(this)}createBiquadFilter(){return new Node(this)}createBufferSource(){return new Node(this)}createDynamicsCompressor(){return new Node(this)}
 createBuffer(channels,length){const data=new Float32Array(length);return {getChannelData(){return data}}}
 resume(){this.state='running';return Promise.resolve()}close(){this.state='closed';return Promise.resolve()}
 advance(time){this.currentTime=time;for(const node of [...this.nodes])if(!node.ended&&node.stopTime!==undefined&&node.stopTime<=time){node.ended=true;node.onended?.();}}
}
