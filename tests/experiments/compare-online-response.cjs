// Repeatable delayed-input/snapshot experiment; not a human/WAN latency measurement.
'use strict';
const assert=require('node:assert/strict');
const geometry=require('../../track-core.js').create(),driving=require('../../driving-core.js').create(),rulesModule=require('../../race-rules.js'),Race=require('../../race-session.js');
const Transport=require('../../online-client.js'),Prediction=require('../../online-prediction.js');
const {SIMULATION}=require('../../server/protocol.cjs');
function run(rttMs,jitter=false,upMs=rttMs/2,downMs=rttMs/2,maxLeadMs=Prediction.limits.defaultLeadLimitMs){
 const world=geometry.createWorld(0,'open');let clock=0,ws,held={throttle:1,brake:0,steering:0,hand:false},ack=-1,lastInput=0;const upstream=[],downstream=[];let lastDelivery=0;
 const session=Race.create({world,geometry,driving,rulesModule,raceId:'experiment',controller:(car,i,dt)=>driving.humanControls(car,held,dt)});
 const car=session.createVehicle({player:2}),p=geometry.sampleAt(300,world.track);Object.assign(car,{x:p.x,y:p.y,heading:p.angle,speed:100,progress:300,previousProgress:300,raceProgress:300});session.setVehicles([car]);session.start(0);
 const predictor=Prediction.create({world,geometry,driving,rulesModule,selfId:2,maxLeadMs});
 class Socket{constructor(){ws=this;this.readyState=1;}send(raw){const m=JSON.parse(raw);if(m.type==='input')upstream.push({at:clock+upMs,m});}close(){this.readyState=3;}message(m){this.onmessage({data:JSON.stringify(m)});}}
 const transport=Transport.create({simulation:SIMULATION,WebSocketImpl:Socket,now:()=>clock,onMessage:m=>{if(m.type==='snapshot')predictor.receive(m,clock);}});
 transport.connect('https://test.example');ws.message({type:'hello',protocol:1,simulation:SIMULATION});ws.message({type:'welcome'});ws.message({type:'session',code:'ABC234',pilotId:2,resumeToken:'test',room:{phase:'running'}});
 const packet=tick=>({type:'snapshot',raceId:'experiment',tick,phase:'running',state:session.snapshot(),inputs:[{pilotId:2,seq:ack}]});
 let latest=packet(0);ws.message(latest);let classic=0,direct=0,agile=0,samples=0,classicResponse=null,directResponse=null,agileResponse=null,maxSteps=0;
 try{
  for(let tick=0;tick<240;tick++){
   clock=tick*1000/60;const input={throttle:tick<210?1:0,brake:tick<210?0:1,steering:tick>=30&&tick<60?.55:tick>=120&&tick<150?-.35:0,hand:false};
   if(tick%3===0)transport.input(input);
   for(let i=upstream.length-1;i>=0;i--)if(upstream[i].at<=clock+1e-8){held=upstream[i].m.controls;ack=upstream[i].m.seq;lastInput=clock;upstream.splice(i,1);}
   assert.ok(clock-lastInput<=350);session.frame(1/60);
   if(tick%3===0){const delivery=Math.max(lastDelivery,clock+downMs+(jitter?[0,35,75,0,15][tick/3%5]:0));lastDelivery=delivery;downstream.push({at:delivery,m:packet(tick+1)});}
   downstream.sort((a,b)=>a.at-b.at);
   while(downstream[0]?.at<=clock+1e-8){const m=downstream.shift().m;if(m.tick<latest.tick)continue;latest=m;ws.message(m);}
   const authority=latest.state.cars[0],old=transport.pose(authority),now=predictor.present(old,input,clock,{ackDelayMs:transport.metrics.ackDelayMs});
   const truth=session.state.cars[0];classic+=Math.hypot(old.x-truth.x,old.y-truth.y);direct+=Math.hypot(authority.x-truth.x,authority.y-truth.y);agile+=Math.hypot(now.x-truth.x,now.y-truth.y);samples++;
   maxSteps=Math.max(maxSteps,predictor.stats.steps);assert.ok(predictor.stats.steps<=9);
   const turn=pose=>Math.abs(Math.atan2(Math.sin(pose.heading-p.angle),Math.cos(pose.heading-p.angle)))>.002;
   if(tick>=30&&classicResponse===null&&turn(old))classicResponse=clock-500;
   if(tick>=30&&directResponse===null&&turn(authority))directResponse=clock-500;
   if(tick>=30&&agileResponse===null&&turn(now))agileResponse=clock-500;
  }
  return {rttMs,jitter,upMs,downMs,classicResponseMs:classicResponse,directResponseMs:directResponse,agileResponseMs:agileResponse,classicMeanError:classic/samples,directMeanError:direct/samples,agileMeanError:agile/samples,maxSteps};
 }finally{transport.close();}
}
const rows=[0,100,200,300].map(rtt=>run(rtt));rows.push(run(200,true),run(200,false,30,170),run(200,false,170,30));
for(const row of rows){assert.ok(row.agileResponseMs<row.classicResponseMs,JSON.stringify(row));assert.ok(row.agileMeanError<row.classicMeanError,JSON.stringify(row));assert.ok(row.agileMeanError<=row.directMeanError+1e-8,JSON.stringify(row));}
console.log(JSON.stringify(rows,null,2));
console.log('PASS: bounded own-car forecast reduces first turn response delay and mean error to the current server pose in seven controlled streams; no human/WAN/competitive balance claim.');
if(process.argv.includes('--policies')){
 const policies=[50,75,100].map(maxLeadMs=>{
  const variants=[0,100,200,300].map(rtt=>run(rtt,false,rtt/2,rtt/2,maxLeadMs));variants.push(run(200,true,100,100,maxLeadMs),run(200,false,30,170,maxLeadMs),run(200,false,170,30,maxLeadMs));
  return {maxLeadMs,meanError:variants.reduce((sum,row)=>sum+row.agileMeanError,0)/variants.length,regressionsAgainstDirect:variants.filter(row=>row.agileMeanError>row.directMeanError+1e-8).length};
 });
 const selected=policies.filter(p=>p.regressionsAgainstDirect===0).sort((a,b)=>a.meanError-b.meanError)[0];assert.equal(selected.maxLeadMs,Prediction.limits.defaultLeadLimitMs);console.log(JSON.stringify({policies,selectedLeadLimitMs:selected.maxLeadMs},null,2));
}
module.exports={run};
