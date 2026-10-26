import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
import {AudioContext} from './helpers/audio-context.mjs';
const {game,element,document}=loadGame({audioContextClass:AudioContext});game.start('solo',0);
const context=game.audioContext;assert.ok(context);assert.equal(game.audioChannels.length,2);assert.equal(game.audioChannels[0].gain.gain.value,0,'Engine played during countdown');
game.setCountdown(0);game.setKeys({w:true});game.cars[0].speed=100;game.updateAudio();
assert.ok(game.audioChannels[0].gain.gain.value>0);assert.equal(game.audioChannels[1].gain.gain.value,0,'CPU engine was mixed as a local player');
const signatures=new Set();
for(const model of Object.keys(game.CAR_MODELS)){game.cars[0].model=model;context.currentTime+=.1;game.updateAudio();const channel=game.audioChannels[0];signatures.add(channel.engine.frequency.value);}
assert.equal(signatures.size,4,'Engine timbre/regime did not distinguish models');
// Continuous revs, six gears with hysteresis, coast/load and reset are audio-only.
const motor=game.audioChannels[0];motor.reset();let shifts=0,previousGear=0,previousRPM=0,drops=0;
for(let frame=0;frame<720;frame++){
 context.currentTime=4+frame/60;
 motor.update({speed:232*Math.min(1,frame/600),maxSpeed:232,model:'balanced',throttle:1,audible:true});
 assert.ok(Number.isFinite(motor.state.rpm)&&motor.state.rpm>=1500&&motor.state.rpm<=10500*1.025);
 if(motor.state.gear>previousGear)shifts++;
 if(motor.state.rpm<previousRPM-1)drops++;
 previousGear=motor.state.gear;previousRPM=motor.state.rpm;
}
assert.equal(shifts,5);assert.equal(motor.state.gear,5);assert.ok(drops>5,'Upshifts never lowered RPM');
const shiftAt=motor.state.shiftAt;
for(let frame=0;frame<60;frame++){context.currentTime+=1/60;motor.update({speed:220+(frame%2)*3,throttle:1,audible:true});}
assert.equal(motor.state.shiftAt,shiftAt,'Gear chatter at steady speed');
for(let frame=0;frame<120;frame++){context.currentTime+=1/60;motor.update({speed:0,throttle:0,braking:true,audible:true});}
assert.equal(motor.state.gear,0);assert.ok(motor.state.load<.001);
const rpm=motor.state.rpm;context.currentTime+=1;motor.update({speed:232,throttle:1,audible:false});assert.equal(motor.state.rpm,rpm);assert.equal(motor.gain.gain.value,0);
motor.reset();assert.equal(motor.state.gear,0);assert.equal(motor.state.lastTime,null);
context.currentTime=0;
const straight=game.cars[0];straight.speed=232;straight.steer=0;straight.yawRate=0;straight.drift=1;straight.handbrake=false;straight.braking=false;game.updateAudio();
assert.equal(game.audioChannels[0].skid.gain.gain.value,0,'Steady straight-line cruise produced fake skid hiss');
const car=game.cars[0];game.placeCar(car,150,65);car.speed=100;car.handbrake=true;car.braking=true;car.drift=.8;car.roadOffset=65;game.updateAudio();
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
// Expand an existing context for four humans, then silence unused slots on return to two.
element('localPlayerCount').value='4';game.start('duo',0);game.setCountdown(0);game.updateAudio();
assert.equal(game.audioContext,context);assert.equal(game.audioChannels.length,4);assert.ok(game.audioChannels.every(c=>c.gain.gain.value>0));
game.togglePause();assert.ok(game.audioChannels.every(c=>c.gain.gain.value===0));game.togglePause();
element('backBtn').onclick();assert.equal(game.audioMaster.gain.value,0);
element('localPlayerCount').value='2';game.start('duo',0);game.setCountdown(0);game.updateAudio();
assert.equal(game.audioChannels.length,4,'Changing modes allocated another motor graph');assert.ok(game.audioChannels.slice(0,2).every(c=>c.gain.gain.value>0));assert.ok(game.audioChannels.slice(2).every(c=>c.gain.gain.value===0));
element('backBtn').onclick();
const broken=loadGame({audioContextClass:class{constructor(){throw new Error('Audio unavailable')}}});broken.game.start('solo',0);assert.equal(broken.game.audioContext,null);assert.equal(broken.game.running,true);
const fallback=loadGame();fallback.game.start('solo',0);fallback.game.updateAudio();fallback.game.playRaceCue('record',fallback.game.cars[0]);assert.equal(fallback.game.running,true);
console.log('PASS: model engines, human-only mix, skid/terrain response, CPU checkpoint silence, eight-voice budget, cleanup, pause/mute/hidden/menu, one reused context, two/four-player audio and bounded reused graphs, result cue and no-Web-Audio fallback. Graph tests do not establish perceived sound quality.');
