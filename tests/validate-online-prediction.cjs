'use strict';
const assert=require('node:assert/strict'),Prediction=require('../online-prediction.js');
const geometry=require('../track-core.js').create(),driving=require('../driving-core.js').create(),rulesModule=require('../race-rules.js'),Race=require('../race-session.js');
function scene(stage=0,model='balanced',barriers='open'){
 const world=geometry.createWorld(stage,barriers),session=Race.create({world,geometry,driving,rulesModule,laps:3,raceId:'prediction-test'}),car=session.createVehicle({player:2,model});
 const p=geometry.sampleAt(500,world.track);Object.assign(car,{x:p.x,y:p.y,heading:p.angle,speed:120,progress:500,previousProgress:500,raceProgress:500});session.setVehicles([car]);session.start(0);
 const message={type:'snapshot',raceId:'prediction-test',tick:0,phase:'running',state:session.snapshot()};
 const predictor=Prediction.create({world,geometry,driving,rulesModule,selfId:2});return {world,session,message,predictor};
}
const input={throttle:1,brake:0,steering:.35,hand:false};let comparisons=0;
for(const stage of [0,2,4,6,10,12,13])for(const model of ['balanced','corner','speed','rally']){
 const s=scene(stage,model);const before=JSON.stringify(s.message),car=s.message.state.cars[0];s.predictor.receive(s.message,0);
 const result=s.predictor.present({...car,x:car.x-10},input,50,{ackDelayMs:100});
 for(let i=0;i<6;i++)s.session.frame(1/60,[input]);const expected=s.session.state.cars[0];
 assert.equal(s.predictor.stats.reason,'predicting');assert.equal(s.predictor.stats.steps,6);
 for(const key of ['x','y','heading','steer','yawRate','wheelTravel'])assert.ok(Math.abs(result[key]-expected[key])<1e-9,`${stage}/${model}/${key}: forecast differs from canonical session`);
 for(const key of ['lap','lapTimes','nextCheckpoint','checkpointPasses','finishTime','done','retired','speed'])assert.deepEqual(result[key],car[key],`${key} became predicted authority`);
 assert.equal(JSON.stringify(s.message),before,'Snapshot mutated');comparisons++;
 const held=s.predictor.present(car,input,400,{ackDelayMs:100});assert.equal(s.predictor.stats.reason,'stale');assert.equal(held.x,result.x,'Stale forecast kept moving');
 assert.equal(s.predictor.present(car,input,50,{enabled:false}),car);assert.equal(s.predictor.stats.reason,'classic');
}
for(const model of ['balanced','corner','speed','rally']){
 const s=scene(0,model),zone=s.world.runoffZones[0],p=geometry.sampleAt(zone.center,s.world.track),offset=zone.side*(geometry.roadHalfWidthAt(zone.center,s.world.track)+8),car=s.message.state.cars[0];
 Object.assign(car,{x:p.x-Math.sin(p.angle)*offset,y:p.y+Math.cos(p.angle)*offset,heading:p.angle,progress:zone.center,previousProgress:zone.center});assert.equal(s.world.terrainAt(car.x,car.y).material,'gravel');Object.assign(s.session.state.cars[0],car);
 const before=JSON.stringify(s.message);s.predictor.receive(s.message,0);const result=s.predictor.present(car,input,50,{ackDelayMs:100});for(let i=0;i<6;i++)s.session.frame(1/60,[input]);
 assert.equal(s.predictor.stats.reason,'predicting');for(const key of ['x','y','heading'])assert.ok(Math.abs(result[key]-s.session.state.cars[0][key])<1e-9,model+'/gravel/'+key);assert.equal(JSON.stringify(s.message),before);comparisons++;
}
for(const change of [state=>{state.countdownRemaining=2;},state=>{state.cars[0].done=true;},state=>{state.cars[0].retired=true;}]){
 const s=scene();change(s.message.state);s.predictor.receive(s.message,0);const car=s.message.state.cars[0];assert.equal(s.predictor.present(car,input,50),car);assert.equal(s.predictor.stats.reason,'inactive');
}
{
 const s=scene(),car=s.message.state.cars[0];s.predictor.receive(s.message,0);for(const options of [{blocked:true},{connected:false}]){assert.equal(s.predictor.present(car,input,50,options),car);assert.equal(s.predictor.stats.reason,'controls');}
 assert.equal(s.predictor.present({...car,player:3},input,50).x,car.x,'Another pilot was predicted');
 car.flash=.12;s.predictor.receive(s.message,0);assert.equal(s.predictor.present(car,input,50),car);assert.equal(s.predictor.stats.reason,'contact');
}
{
 const s=scene(),car=s.message.state.cars[0],other={...car,player:1,x:car.x+Math.cos(car.heading)*50,y:car.y+Math.sin(car.heading)*50};s.message.state.cars.push(other);s.predictor.receive(s.message,0);
 assert.equal(s.predictor.present(car,input,50),car);assert.equal(s.predictor.stats.reason,'traffic');other.retired=true;s.predictor.receive(s.message,0);s.predictor.present(car,input,50);assert.equal(s.predictor.stats.reason,'predicting');
}
{
 const s=scene(0,'balanced','full'),wall=s.world.physicalBarriers.find(b=>b.kind==='rail'),middle={x:(wall.a.x+wall.b.x)/2,y:(wall.a.y+wall.b.y)/2},inside=geometry.nearestOnTrack(middle.x,middle.y,null,s.world.track),heading=Math.atan2(middle.y-inside.y,middle.x-inside.x),car=s.message.state.cars[0];
 Object.assign(car,{x:middle.x-Math.cos(heading)*24,y:middle.y-Math.sin(heading)*24,heading,speed:200});s.predictor.receive(s.message,0);assert.equal(s.predictor.present(car,{throttle:1,brake:0,steering:0,hand:false},50,{ackDelayMs:200}),car);assert.equal(s.predictor.stats.reason,'barrier');
}
{
 const s=scene(),car=s.message.state.cars[0];s.predictor.receive(s.message,0);s.predictor.present(car,input,50);const p=geometry.sampleAt(3000,s.world.track);Object.assign(car,{x:p.x,y:p.y,heading:p.angle,progress:3000,previousProgress:3000});s.message.tick=3;s.predictor.receive(s.message,60);s.predictor.present(car,input,70);assert.equal(s.predictor.stats.correction,0,'Recovery inherited a stale visual offset');s.predictor.reset();assert.equal(s.predictor.present(car,input,100),car);
}
let oldReverse=0;
for(const model of ['balanced','corner','speed','rally']){
 const old=driving.createState(model),safe=driving.createState(model);
 for(let i=0;i<120;i++){for(const [car,command] of [[old,{throttle:0,brake:1,steering:0,hand:false}],[safe,Prediction.stopControls]]){const controls=driving.humanControls(car,command,1/60);driving.stepVehicle(car,controls,driving.rules.models[model],'asphalt',260,1/60);}}
 assert.ok(old.speed<0);oldReverse++;assert.equal(safe.speed,0);assert.equal(safe.reverseHeld,0,'Released controls enabled reverse');
}
console.log(`PASS: ${comparisons} model/material forecasts match six canonical 60-Hz steps without changing authoritative HUD/progress; classic, stale, blocked, other-pilot, contact/traffic/barrier, recovery/reset guards and ${oldReverse} emergency-stop reverse regressions.`);
