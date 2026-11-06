'use strict';
// Repeatable physical maneuvers for practice. No browser, teleports or tuning overrides during a run.
const assert=require('node:assert/strict'),g=require('../../track-core.js').create(),d=require('../../driving-core.js').create(),sessions=require('../../race-session.js'),rulesModule=require('../../race-rules.js');
const policies={gas:{throttle:1,brake:0,steering:1,hand:false},lift:{throttle:0,brake:0,steering:1,hand:false},brake:{throttle:0,brake:1,steering:1,hand:false},hand:{throttle:1,brake:0,steering:1,hand:true}};
let maneuvers=0;
for(const stage of [9,2,4])for(const model of Object.keys(d.rules.models)){
 const world=g.createWorld(stage,'open'),results={};
 for(const [name,input] of Object.entries(policies)){
  const session=sessions.create({world,geometry:g,driving:d,rulesModule}),car=session.createVehicle({model}),p=g.sampleAt(600,world.track);
  Object.assign(car,{x:p.x,y:p.y,heading:p.angle,progress:600,previousProgress:600,speed:180});session.setVehicles([car]);session.start(0);
  for(let i=0;i<18;i++)assert.equal(session.advanceFrame(1/60,[input]),1);
  const final=session.state.cars[0],turn=Math.abs(Math.atan2(Math.sin(final.heading-p.angle),Math.cos(final.heading-p.angle))),distance=Math.hypot(final.x-p.x,final.y-p.y);
  assert.ok(turn>0&&turn<1.5);results[name]={speed:final.speed,turn,radius:distance/turn};maneuvers++;
 }
 assert.ok(results.brake.speed<results.lift.speed&&results.lift.speed<results.gas.speed,'Brake/lift/drive lost distinct response');
 assert.ok(results.brake.radius<results.gas.radius,'Braking did not tighten the actual maneuver');
 assert.ok(results.hand.speed<results.gas.speed,'Handbrake became free speed');
 console.log(JSON.stringify({track:world.track.name,model,results}));
}
console.log('PASS: '+maneuvers+' shared-session maneuvers, four models × asphalt/dirt/ice × gas/lift/brake/hand, distinct speed cost and tighter braking trajectory; no tuning changes. Not human feel or full lateral tire simulation.');
