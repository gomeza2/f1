import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
class Param{constructor(value=0){this.value=value}cancelScheduledValues(){}setTargetAtTime(value){assert.ok(Number.isFinite(value));this.value=value}setValueAtTime(value){assert.ok(Number.isFinite(value));this.value=value}linearRampToValueAtTime(value){this.setValueAtTime(value)}exponentialRampToValueAtTime(value){assert.ok(value>0);this.setValueAtTime(value)}}
class Node{constructor(context){this.context=context;this.gain=new Param();this.frequency=new Param(440);this.Q=new Param(1);for(const key of ['threshold','knee','ratio','attack','release'])this[key]=new Param();context.nodes.push(this)}connect(node){assert.ok(node);return node}disconnect(){this.disconnected=true}start(time=0){this.startTime=time}stop(time=0){this.stopTime=time}}
class AudioContext{
 static instances=0;
 constructor(){AudioContext.instances++;this.currentTime=0;this.sampleRate=48000;this.state='running';this.nodes=[];this.destination={};}
 createGain(){return new Node(this)}createOscillator(){return new Node(this)}createBiquadFilter(){return new Node(this)}createBufferSource(){return new Node(this)}createDynamicsCompressor(){return new Node(this)}
 createBuffer(channels,length){const data=new Float32Array(length);return {getChannelData(){return data}}}
 resume(){this.state='running';return Promise.resolve()}close(){this.state='closed';return Promise.resolve()}
 advance(time){this.currentTime=time;for(const node of [...this.nodes])if(!node.ended&&node.stopTime!==undefined&&node.stopTime<=time){node.ended=true;node.onended?.();}}
}
const {game,element,document}=loadGame({audioContextClass:AudioContext});game.start('solo',0);
const context=game.audioContext;assert.ok(context);assert.equal(game.audioChannels.length,2);assert.equal(game.audioChannels[0].gain.gain.value,0,'Engine played during countdown');
game.setCountdown(0);game.setKeys({w:true});game.cars[0].speed=100;game.updateAudio();
assert.ok(game.audioChannels[0].gain.gain.value>0);assert.equal(game.audioChannels[1].gain.gain.value,0,'CPU engine was mixed as a local player');
const signatures=new Set();
for(const model of Object.keys(game.CAR_MODELS)){game.cars[0].model=model;game.updateAudio();const channel=game.audioChannels[0];signatures.add(channel.engine.type+channel.engine.frequency.value);}
assert.equal(signatures.size,4,'Engine timbre/regime did not distinguish models');
const car=game.cars[0];car.handbrake=true;car.braking=true;car.drift=.8;car.roadOffset=65;game.updateAudio();
assert.ok(game.audioChannels[0].skid.gain.gain.value>0);assert.ok(game.audioChannels[0].terrain.gain.gain.value>0);
game.playRaceCue('checkpoint',game.cars[1]);assert.equal(game.audioVoices.size,0,'Distant CPU checkpoint was audible');
game.playRaceCue('checkpoint',car);assert.equal(game.audioVoices.size,1);context.advance(1);assert.equal(game.audioVoices.size,0);
for(let i=0;i<50;i++)game.playRaceCue('record',car);assert.equal(game.audioVoices.size,8,'Event voice budget is not bounded');context.advance(3);assert.equal(game.audioVoices.size,0);
assert.ok(context.nodes.filter(node=>node.ended).every(node=>node.disconnected),'Transient source was not disconnected');
game.playRaceCue('lap',car);game.togglePause();assert.equal(game.audioMaster.gain.value,0);assert.ok(game.audioChannels.every(c=>c.gain.gain.value===0&&c.skid.gain.gain.value===0&&c.terrain.gain.gain.value===0));context.currentTime=3.01;game.updateAudio();context.advance(3.026);assert.equal(game.audioVoices.size,0,'Repeated mute updates postponed voice cleanup');game.togglePause();assert.ok(game.audioMaster.gain.value>0);
element('soundBtn').onclick();assert.equal(element('soundBtn')['aria-pressed'],'false');assert.equal(game.audioMaster.gain.value,0);game.playRaceCue('record',car);assert.equal(game.audioVoices.size,0);element('soundBtn').onclick();assert.equal(element('soundBtn')['aria-pressed'],'true');
document.hidden=true;game.updateAudio();assert.equal(game.audioMaster.gain.value,0);document.hidden=false;game.updateAudio();assert.ok(game.audioMaster.gain.value>0);
element('backBtn').onclick();assert.equal(game.audioMaster.gain.value,0);
game.start('duo',0);game.setCountdown(0);game.updateAudio();assert.equal(game.audioContext,context);assert.equal(AudioContext.instances,1);assert.ok(game.audioChannels.every(c=>c.gain.gain.value>0));
game.cars.forEach((c,i)=>{c.done=true;c.finishTime=60+i;c.lap=3;});game.playRaceCue('lap',game.cars[0]);game.finishRace();context.advance(3.2);assert.ok(game.audioVoices.size>0,'Results cue was lost when clearing race voices');assert.ok(game.audioChannels.every(c=>c.gain.gain.value===0));element('menuBtn').onclick();context.advance(3.3);assert.equal(game.audioVoices.size,0);assert.equal(game.audioMaster.gain.value,0);
// Static depenetration at a barrier is not an audible crash.
element('barrierMode').value='full';game.start('solo',0);context.advance(4);
const rail=game.physicalBarriers.find(b=>b.kind==='rail'),x=(rail.a.x+rail.b.x)/2,y=(rail.a.y+rail.b.y)/2,loc=game.nearestOnTrack(x,y),length=Math.hypot(loc.x-x,loc.y-y),nx=(loc.x-x)/length,ny=(loc.y-y)/length;
const parked=game.cars[0];parked.x=x+nx*12;parked.y=y+ny*12;parked.heading=Math.atan2(rail.b.y-rail.a.y,rail.b.x-rail.a.x);parked.speed=0;
game.resolveBarrierContact(parked,parked.x+nx*4,parked.y+ny*4);assert.equal(game.audioVoices.size,0,'Static barrier correction produced an impact sound');
const broken=loadGame({audioContextClass:class{constructor(){throw new Error('Audio unavailable')}}});broken.game.start('solo',0);assert.equal(broken.game.audioContext,null);assert.equal(broken.game.running,true);
const fallback=loadGame();fallback.game.start('solo',0);fallback.game.updateAudio();fallback.game.playRaceCue('record',fallback.game.cars[0]);assert.equal(fallback.game.running,true);
console.log('PASS: model engines, human-only mix, skid/terrain response, CPU checkpoint silence, eight-voice budget, cleanup, pause/mute/hidden/menu, one reused context, two-player audio, result cue and no-Web-Audio fallback. Graph tests do not establish perceived sound quality.');
