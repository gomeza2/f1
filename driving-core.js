/* PIXEL GRAND PRIX — shared vehicle dynamics. No DOM, clock, audio or network I/O. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.PixelDrivingCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
const DRIVING_TUNING={accelerationScale:.82,accelerationTaper:.45,lateralAcceleration:280,maxSpeedGripLoss:.24,speedGripLoss:.0014,inputResponse:14,handInputResponse:16,yawResponse:18,yawSpeedWeight:4,topSpeedLateralLoss:.16,liftDrag:30};
const DRIVE_RECOVERY={reverseDelay:.35,reverseMax:28,reverseAcceleration:.65};
const CAR_MODELS={
 balanced:{name:'BALANCED',maxSpeed:232,acceleration:110,braking:230,steering:1,grip:1,grass:1,description:'Equilibrado para aprender y competir.'},
 corner:{name:'CORNER KING',maxSpeed:218,acceleration:105,braking:255,steering:1.19,grip:1.15,grass:.86,description:'Más agarre y frenado; velocidad punta menor.'},
 speed:{name:'SPEED DEMON',maxSpeed:260,accelerationTaper:.58,acceleration:123,braking:215,steering:.84,grip:.87,grass:1.12,description:'Rápido en rectas, difícil en curvas cerradas.'},
 rally:{name:'RALLY FOX',maxSpeed:222,acceleration:112,braking:245,steering:1.08,grip:1.04,grass:.57,description:'Pierde menos velocidad si toca el pasto.'}
};
const TERRAIN_MATERIALS={
 asphalt:{road:{edge:'#141b22',kerb:'#f5f0dc',border:'#3c414c',body:'#646c78',lite:'#59616c',center:'#303640'},grip:1,drag:0,edgeDrag:0,particle:'#aeb6c5',life:.46,size:2},
 dirt:{road:{edge:'#49372b',kerb:'#b18c64',border:'#a27d55',body:'#b8996d',center:'#987449'},grip:.84,drag:54,edgeDrag:2.8,particle:'#ad8053',life:.62,size:3},
 grass:{road:{edge:'#193d2b',kerb:'#69994b',border:'#91b767',body:'#53874a',lite:'#4b7c44',center:'#497541',grain:['#7b9a52','#92aa62','#356139']},grip:.79,drag:34,edgeDrag:2.2,particle:'#6e9958',life:.46,size:2},
 ice:{road:{edge:'#5b8194',kerb:'#e9f8fc',border:'#94bed2',body:'#c7e6ef',lite:'#b5dbe8',center:'#b1d3e3',grain:['#f5feff','#d9f0fa','#8cbacf'],grainKind:'ice'},mark:'#6e9caf',grip:.68,drag:58,edgeDrag:4.6,particle:'#d9f1f6',life:.46,size:2},
 volcanic:{road:{edge:'#211d25',kerb:'#ad704d',border:'#986447',body:'#715047',center:'#42343b',grain:['#5b4745','#b37751','#cf8b57']},grip:.87,drag:54,edgeDrag:2.8,particle:'#cf603c',life:.58,size:3},
 coastal:{grip:1,drag:54,edgeDrag:2.8,particle:'#c9ad7a',life:.58,size:3},
 gravel:{mark:'#816c50',grip:.60,drag:130,edgeDrag:0,speedDrag:.35,particle:'#c4a47b',life:.62,size:3,palette:['#a48c6d','#b59b77','#c3ab86','#d1bb96']}
};
const WORLD_SPEED_SCALE=.84;
 const defaults={tuning:DRIVING_TUNING,recovery:DRIVE_RECOVERY,models:CAR_MODELS,materials:TERRAIN_MATERIALS,worldSpeedScale:WORLD_SPEED_SCALE};
 function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
 freeze(defaults);
 function create(){
  // Owned immutable rules and caller-owned vehicle states isolate concurrent users.
  const rules=freeze(JSON.parse(JSON.stringify(defaults)));
  const DRIVING_TUNING=rules.tuning,DRIVE_RECOVERY=rules.recovery,CAR_MODELS=rules.models,TERRAIN_MATERIALS=rules.materials,WORLD_SPEED_SCALE=rules.worldSpeedScale;
  const SURFACE_GRIP=freeze(Object.fromEntries(Object.entries(TERRAIN_MATERIALS).map(([name,material])=>[name,material.grip])));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),wrapAngle=a=>Math.atan2(Math.sin(a),Math.cos(a));
function accelerationAtSpeed(speed,model){return model.acceleration*DRIVING_TUNING.accelerationScale*(1-(model.accelerationTaper??DRIVING_TUNING.accelerationTaper)*clamp(speed/model.maxSpeed,0,1));}
function vehicleHandling(speed,model,surface,safeSpeed,drift=0,hand=false){
 const excess=Math.max(0,speed-safeSpeed);
 const speedLoss=Math.min(DRIVING_TUNING.maxSpeedGripLoss,excess*DRIVING_TUNING.speedGripLoss);
 const grip=clamp((1-speedLoss-drift*(hand?.05:.12))*model.grip*(SURFACE_GRIP[surface]||1),.38,1.15);
 const mechanicalTurn=(.95+speed/235*2.9)*model.steering*grip*(hand?1.18:1);
 // Finite tire force: at high speed the minimum corner radius grows with speed squared.
 const lateralAcceleration=DRIVING_TUNING.lateralAcceleration*(1-DRIVING_TUNING.topSpeedLateralLoss*clamp((speed/model.maxSpeed-.58)/.42,0,1))*model.grip*(SURFACE_GRIP[surface]||1)*(hand?1.12:1);
 const turnRate=Math.min(mechanicalTurn,lateralAcceleration/Math.max(30,speed*WORLD_SPEED_SCALE));
 return {grip,turnRate,lateralAcceleration};
}
function updateSteeringInertia(car,turnRate,maxSpeed,dt){
 if(car.speed===0){car.yawRate=0;return;} // Wheels can steer at rest; the chassis needs motion to turn.
 const target=car.steer*turnRate*(car.speed<0?-1:1),response=car.handbrake?20:DRIVING_TUNING.yawResponse-DRIVING_TUNING.yawSpeedWeight*clamp(Math.abs(car.speed)/maxSpeed,0,1);
 const previous=car.yawRate||0,decay=Math.exp(-response*dt);
 car.yawRate=target+(previous-target)*decay;
 car.heading=wrapAngle(car.heading+target*dt+(previous-target)*(1-decay)/response);
}
function humanSteeringInput(current,target,hand,dt){
 const response=hand?DRIVING_TUNING.handInputResponse:DRIVING_TUNING.inputResponse;
 // Unwind opposed lock sooner, then build the new turn with normal weight.
 if(current*target<0&&Math.abs(target)>.15){
  const unwind=response*1.5,crossing=Math.log1p(-current/target)/unwind;
  if(dt<=crossing)return target+(current-target)*Math.exp(-unwind*dt);
  return target*(1-Math.exp(-response*(dt-crossing)));
 }
 return target+(current-target)*Math.exp(-response*dt);
}
function updateDriveSpeed(car,controls,model,dt){
 const {throttle,brake,hand,reverse=false}=controls;
 if(reverse){
  car.speed=Math.max(-DRIVE_RECOVERY.reverseMax,car.speed-brake*model.acceleration*DRIVE_RECOVERY.reverseAcceleration*dt);
 }else if(car.speed<0){
  car.speed=Math.min(0,car.speed+(DRIVING_TUNING.liftDrag+throttle*model.braking+(hand?model.braking*.55:0))*dt);
 }else{
  // Brake pressure releases drive torque; partial throttle blends engine drag continuously.
  const driveThrottle=throttle*(1-brake);
  car.speed+=driveThrottle*accelerationAtSpeed(car.speed,model)*dt;
  car.speed-=brake*(hand?model.braking*1.27:model.braking)*dt;
  car.speed-=(2.6*driveThrottle+DRIVING_TUNING.liftDrag*(1-driveThrottle))*dt;
  if(hand)car.speed-=model.braking*.55*dt;
  car.speed=clamp(car.speed,0,model.maxSpeed);
 }
}
function applyGroundDrag(speed,drag,dt,crawl){
 const sign=speed<0?-1:1,magnitude=Math.abs(speed);
 return sign*Math.max(Math.min(crawl,magnitude),magnitude-drag*dt);
}
function createState(model='balanced'){
 if(!Object.hasOwn(CAR_MODELS,model))throw new RangeError('Unknown vehicle model');
 return {model,x:0,y:0,heading:0,yawRate:0,reverseHeld:0,speed:0,steer:0,drift:0,handbrake:false,braking:false,wheelTravel:0};
}
function humanControls(car,input,dt,allowReverse=true){
 const {hand,steering}=input;
 car.steer=humanSteeringInput(car.steer,steering,hand,dt);
 const reverseIntent=allowReverse&&input.brake>.5&&input.throttle<.05&&!hand&&car.speed<=.001;
 car.reverseHeld=reverseIntent?(car.reverseHeld||0)+dt:0;
 return {throttle:input.throttle,brake:input.brake,hand,reverse:reverseIntent&&car.reverseHeld>=DRIVE_RECOVERY.reverseDelay};
}
function stepVehicle(car,controls,model,surface,safeSpeed,dt){
 const {brake,hand}=controls;car.handbrake=hand;car.braking=brake>0||hand;
 updateDriveSpeed(car,controls,model,dt);
 if(hand)car.drift=Math.min(1,Math.abs(car.steer)*Math.abs(car.speed)/200);
 const tooFast=Math.max(0,car.speed-safeSpeed);
 const handling=vehicleHandling(Math.abs(car.speed),model,surface,safeSpeed,car.drift,car.handbrake);
 updateSteeringInertia(car,handling.turnRate,model.maxSpeed,dt);
 car.drift=clamp(Math.max(car.drift*Math.exp(-4.5*dt),tooFast/160),0,1);
 const move=car.speed*WORLD_SPEED_SCALE*dt;
 car.wheelTravel=(car.wheelTravel+move)%12;
 car.x+=Math.cos(car.heading)*move;car.y+=Math.sin(car.heading)*move;
}
  return Object.freeze({rules,surfaceGrip:SURFACE_GRIP,createState,humanControls,stepVehicle,accelerationAtSpeed,vehicleHandling,updateSteeringInertia,humanSteeringInput,updateDriveSpeed,applyGroundDrag});
 }
 return Object.freeze({apiVersion:1,create});
});
