/* Bounded own-car presentation forecast using the canonical driving/track/contact rules. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PixelOnlinePrediction=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const STEP=1/60,MAX_STEPS=9,MAX_AGE=250,DEFAULT_LEAD=75;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),angle=v=>Math.atan2(Math.sin(v),Math.cos(v));
 const copy=car=>({...car,lapTimes:[...(car.lapTimes||[])]});
 function create({world,geometry,driving,rulesModule,selfId,maxLeadMs=DEFAULT_LEAD}){
  if(!world?.track||!geometry?.nearestOnTrack||!driving?.humanControls||!rulesModule?.create||!Number.isInteger(selfId))throw new TypeError('Missing prediction dependencies');
  const leadLimit=clamp(Number.isFinite(maxLeadMs)?maxLeadMs:DEFAULT_LEAD,0,100);
  // Provisional progress stays in this disposable clone. It never awards a lap or result.
  const rules=rulesModule.create({world,geometry,driving,laps:99});
  let source=null,cars=[],race=null,received=-Infinity,elapsed=0,ready=false,visual=null,lastFrame=null,reconcile=false;
  let offset={x:0,y:0,heading:0},stats={reason:'waiting',steps:0,horizonMs:0};
  function reset(){source=null;cars=[];received=-Infinity;ready=false;visual=null;lastFrame=null;reconcile=false;offset={x:0,y:0,heading:0};stats={reason:'waiting',steps:0,horizonMs:0};}
  function receive(message,at){
   if(!message?.state||!Number.isFinite(at))return;
   if(message.raceId!==race){reset();race=message.raceId;}
   const car=message.state.cars.find(car=>car.player===selfId);
   if(!car||!Object.hasOwn(driving.rules.models,car.model)){reset();return;}
   const jumped=source&&Math.hypot(car.x-source.x,car.y-source.y)>64;
   if(jumped||car.flash>0||car.done||car.retired){visual=null;offset={x:0,y:0,heading:0};}
   source=copy(car);cars=message.state.cars.map(copy);received=at;elapsed=message.state.elapsed;
   ready=message.phase==='running'&&message.state.running&&message.state.countdownRemaining<=0;reconcile=true;
  }
  function trafficNear(car){
   const scale=driving.rules.worldSpeedScale;
   return cars.some(other=>{
    if(other.player===selfId||other.done||other.retired)return false;
    const rx=other.x-car.x,ry=other.y-car.y;
    const vx=(Math.cos(other.heading)*other.speed-Math.cos(car.heading)*car.speed)*scale,vy=(Math.sin(other.heading)*other.speed-Math.sin(car.heading)*car.speed)*scale;
    const time=clamp(-(rx*vx+ry*vy)/(vx*vx+vy*vy||1),0,.15);
    return Math.hypot(rx,ry)<84||Math.hypot(rx+vx*time,ry+vy*time)<70;
   });
  }
  function fallback(car,reason){visual=null;offset={x:0,y:0,heading:0};stats={reason,steps:0,horizonMs:0};return car;}
  function present(car,input,at,{enabled=true,blocked=false,connected=true,ackDelayMs=null}={}){
   if(!source||car.player!==selfId)return car;
   if(!enabled)return fallback(car,'classic');
   if(!ready||source.done||source.retired)return fallback(car,'inactive');
   if(!connected||blocked)return fallback(car,'controls');
   if(at-received>MAX_AGE){stats={reason:'stale',steps:0,horizonMs:0};return visual?{...car,...visual}:car;}
   if(source.flash>0||trafficNear(source))return fallback(car,source.flash>0?'contact':'traffic');
   const lead=clamp(Number.isFinite(ackDelayMs)?ackDelayMs/2:50,0,leadLimit),horizon=clamp((at-received+lead)/1000,0,.15);
   const steps=Math.min(MAX_STEPS,Math.floor(horizon/STEP+1e-9)),predicted=copy(source);
   const value=(key,a,b)=>clamp(Number.isFinite(input?.[key])?input[key]:0,a,b);
   const controls={throttle:value('throttle',0,1),brake:value('brake',0,1),steering:value('steering',-1,1),hand:input?.hand===true};
   for(let i=0;i<steps;i++){
    const commands=driving.humanControls(predicted,controls,STEP);
    rules.advanceVehicle(predicted,commands,STEP,elapsed+(i+1)*STEP);
    // Forecasting a barrier contact must not paint a car on the far side of a wall.
    if(predicted.flash>source.flash)return fallback(car,'barrier');
   }
   if(trafficNear(predicted))return fallback(car,'traffic');
   const dt=lastFrame===null?STEP:clamp((at-lastFrame)/1000,0,.05);lastFrame=at;
   if(reconcile){
    offset={x:0,y:0,heading:0};
    if(visual){const dx=visual.x-predicted.x,dy=visual.y-predicted.y,dh=angle(visual.heading-predicted.heading);
     if(Math.hypot(dx,dy)<=48&&dx*Math.cos(predicted.heading)+dy*Math.sin(predicted.heading)>0){offset={x:dx,y:dy,heading:Math.abs(dh)<.4?dh:0};}}
    reconcile=false;
   }
   const decay=Math.exp(-dt/.06);offset.x*=decay;offset.y*=decay;offset.heading*=decay;
   visual={x:predicted.x+offset.x,y:predicted.y+offset.y,heading:angle(predicted.heading+offset.heading),steer:predicted.steer,yawRate:predicted.yawRate,wheelTravel:predicted.wheelTravel,braking:predicted.braking,handbrake:predicted.handbrake,drift:predicted.drift};
   if(trafficNear({...predicted,...visual}))return fallback(car,'traffic');
   if(rules.resolveBarrierContact({...predicted,...visual},predicted.x,predicted.y,elapsed))return fallback(car,'barrier');
   stats={reason:'predicting',steps,horizonMs:steps*STEP*1000,correction:Math.hypot(offset.x,offset.y)};
   return {...car,...visual};
  }
  return {receive,present,reset,get stats(){return {...stats};}};
 }
 return {create,stopControls:Object.freeze({throttle:0,brake:1,steering:0,hand:true}),limits:Object.freeze({step:STEP,maxSteps:MAX_STEPS,maxAgeMs:MAX_AGE,defaultLeadLimitMs:DEFAULT_LEAD})};
});
