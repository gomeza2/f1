import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createRequire} from 'node:module';import vm from 'node:vm';
import {loadGame} from './helpers/game-harness.mjs';import {withoutSharedRules} from './helpers/without-shared-rules.mjs';
const require=createRequire(import.meta.url),api=require('../race-rules.js'),geometry=require('../track-core.js').create(),drive=require('../driving-core.js').create();
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8'),baseline=process.env.RULES_SOURCE_BASELINE?readFileSync(process.env.RULES_SOURCE_BASELINE,'utf8'):withoutSharedRules(source);
const traced="document.ruleCues=[];\n"+baseline.replace("function playRaceCue(type,car=null,strength=1){","function playRaceCue(type,car=null,strength=1){document.ruleCues.push({type,player:car?.player,strength});");
const pad={connected:true,mapping:'standard',axes:[0],buttons:Array.from({length:17},()=>({value:0}))},{game:g,element:e,document}=loadGame({sourceOverride:traced,gamepads:[pad]});
const plain=x=>JSON.parse(JSON.stringify(x));
const fields=['x','y','speed','heading','yawRate','steer','drift','wheelTravel','progress','previousProgress','raceProgress','raceOffset','lap','lapTimes','lapStartTime','nextCheckpoint','checkpointPasses','lastCheckpointTime','done','finishTime','braking','offroad','roadOffset','flash','newBestLap','reverseHeld'];
const state=c=>Object.fromEntries(fields.map(k=>[k,Array.isArray(c[k])?Array.from(c[k]):c[k]]));
let cases=0,steps=0,eventsTotal=0;
for(const stage of [0,2,4,5,6,8,10])for(const model of Object.keys(drive.rules.models))for(const profile of ['open','full']){
 e('barrierMode').value=profile;e('carModel').value=model;e('playerInput1').value='pad0';g.start('solo',stage);g.cars[1].done=true;const car=g.cars[0];g.placeCar(car,400,0);car.speed=150;const node=plain(car),events=[],rules=api.create({world:geometry.createWorld(stage,profile),geometry,driving:drive,onEvent:event=>events.push(event)});document.ruleCues.length=0;
 for(let n=0;n<100;n++){
  pad.buttons[7].value=n<50?1:0;pad.buttons[6].value=n>=70?1:0;pad.buttons[2].value=n>=25&&n<40?1:0;pad.axes[0]=n<60?.5:-.4;
  const input=g.controlsFor(0),command=drive.humanControls(node,input,1/60);g.setElapsed((n+1)/60);g.physics(car,0,1/60);rules.advanceVehicle(node,command,1/60,(n+1)/60);if(node.flash>0)node.flash-=1/60;
  assert.deepEqual(state(node),state(car),`${stage}/${model}/${profile}/${n}`);steps++;
 }
 const cues=events.map(event=>({type:event.type==='lap'?(event.finished?'finish':event.personalBest?'record':'lap'):event.type,player:event.pilot,strength:event.strength??1}));assert.deepEqual(cues,plain(document.ruleCues));assert.ok(events.every((event,i)=>event.sequence===i+1&&Object.isFrozen(event)));eventsTotal+=events.length;cases++;
}
// Ordered gates, three real finish-plane crossings, record annotation and deadline.
e('barrierMode').value='open';g.start('solo',0);const old=g.cars[0],node=plain(old),events=[];delete g.bestLapRecords[g.lapRecordKey()];let best=Infinity;
const world=geometry.createWorld(0,'open'),rules=api.create({world,geometry,driving:drive,onLap:(_,time)=>{if(time>=best)return false;best=time;return true;},onEvent:event=>events.push(event)});document.ruleCues.length=0;let elapsed=0;
for(let lap=0;lap<3;lap++)for(const gate of [...rules.checkpoints,{...geometry.sampleAt(0,world.track),halfWidth:geometry.roadHalfWidthAt(0,world.track)}]){
 const tx=Math.cos(gate.angle),ty=Math.sin(gate.angle),fromX=gate.x-tx*3,fromY=gate.y-ty*3;
 for(const car of [old,node]){car.x=gate.x+tx*3;car.y=gate.y+ty*3;car.heading=gate.angle;}
 elapsed+=10;g.setElapsed(elapsed);const loc=geometry.nearestOnTrack(node.x,node.y,null,world.track);g.updateProgress(old,loc,fromX,fromY);rules.updateProgress(node,loc,fromX,fromY,elapsed);assert.deepEqual(state(node),state(old));
}
assert.equal(node.lap,3);assert.equal(node.done,true);assert.equal(events.filter(e=>e.type==='lap').length,3);assert.equal(events.at(-1).finished,true);assert.deepEqual(events.map(e=>({type:e.type==='lap'?(e.finished?'finish':e.personalBest?'record':'lap'):e.type,player:e.pilot,strength:e.strength??1})),plain(document.ruleCues));
const waiting={...node,player:1,done:false,finishTime:null};assert.equal(rules.finishState([node,waiting],elapsed+17).closed,false);assert.equal(rules.finishState([node,waiting],elapsed+18).closed,true);
// Stationary and signed contacts, walls/tires and contact-triggered progress use the same rules.
let contacts=0;
for(const stage of [0,4,10])for(const profile of ['open','full','half'])for(const speed of [-28,0,160]){
 e('barrierMode').value=profile;g.start('duo',stage);g.cars.forEach((car,i)=>{g.placeCar(car,150+i*8,0);car.speed=i===0?speed:0;});const copies=plain(g.cars),events=[],context=api.create({world:geometry.createWorld(stage,profile),geometry,driving:drive,onEvent:e=>events.push(e)});document.ruleCues.length=0;g.setElapsed(1);g.resolveCollisions(1/60);context.resolveCollisions(copies,1/60,1);assert.deepEqual(copies.map(state),Array.from(g.cars,state));assert.ok(copies.every(c=>Math.abs(c.speed)<=Math.abs(speed)));assert.deepEqual(events.map(e=>({type:e.type,player:e.pilot,strength:e.strength??1})),plain(document.ruleCues));contacts++;
}
let walls=0;
for(const stage of [0,4,10])for(const profile of ['full','half']){
 e('barrierMode').value=profile;g.start('solo',stage);const kind=profile==='half'?'tire':'rail',barrier=g.physicalBarriers.find(b=>b.kind===kind);assert.ok(barrier);const x=(barrier.a.x+barrier.b.x)/2,y=(barrier.a.y+barrier.b.y)/2,loc=g.nearestOnTrack(x,y),length=Math.hypot(loc.x-x,loc.y-y),nx=(loc.x-x)/length,ny=(loc.y-y)/length;
 const old=g.cars[0];old.x=x+nx*10;old.y=y+ny*10;old.heading=Math.atan2(-ny,-nx);old.speed=160;old.flash=0;const node=plain(old),events=[],context=api.create({world:geometry.createWorld(stage,profile),geometry,driving:drive,onEvent:e=>events.push(e)});document.ruleCues.length=0;g.setElapsed(1);const hit=g.resolveBarrierContact(old,old.x+nx*4,old.y+ny*4);assert.equal(context.resolveBarrierContact(node,node.x+nx*4,node.y+ny*4,1),hit);assert.equal(hit,true);assert.deepEqual(state(node),state(old));assert.ok(events.length>0,'No head-on impact event');assert.deepEqual(events.map(e=>({type:e.type,player:e.pilot,strength:e.strength??1})),plain(document.ruleCues));walls++;
}
// No DOM, random or wall clock; separate event sequences without retaining an event backlog.
const sandbox={module:{exports:{}},Math:Object.create(Math)};Object.defineProperty(sandbox.Math,'random',{get(){throw Error('Random accessed')}});for(const name of ['document','window','localStorage','AudioContext','Date','performance','requestAnimationFrame'])Object.defineProperty(sandbox,name,{get(){throw Error('Rules accessed '+name)}});vm.createContext(sandbox);vm.runInContext(readFileSync(new URL('../race-rules.js',import.meta.url),'utf8'),sandbox);
const isolated=sandbox.module.exports.create({world,geometry,driving:drive});assert.equal(isolated.lastSequence,0);assert.equal(isolated.finishState([],0).closed,false);assert.equal(isolated.gateCrossed({x:0,y:0,angle:0,halfWidth:42},-3,46.37,3,46.37,0),true);assert.equal(isolated.lastSequence,0);assert.ok(rules.lastSequence>0);assert.throws(()=>api.create({world,geometry,driving:drive,laps:0}),RangeError);
console.log(JSON.stringify({cases,steps,contacts,walls,eventsTotal,gateEvents:events.length}));console.log('PASS: production Node movement/terrain/recovery/progress/contact rules match actual legacy states and cue order; ordered lap crossings, deadline, immutable numbered events and forbidden browser/clock/random dependencies. Not a complete RaceState, server or online room.');
