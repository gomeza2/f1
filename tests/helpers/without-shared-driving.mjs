// Restore only the declared module extraction for immutable historical source checks.
// Actual module rules/motion are independently compared against the legacy engine.
const edits=[
 [
  "(async()=>{\n// Recover when an older cached HTML loads the new main script without its dependency.\nif(typeof PixelDrivingCore==='undefined'){\n const startButtons=['soloStart','localStart','catalogueBtn'].map(id=>document.getElementById(id)).filter(Boolean);startButtons.forEach(button=>{button.disabled=true;});\n const summary=document.getElementById('raceSummary');if(summary)summary.textContent='Cargando motor de conducción…';\n try{\n  const dependency=new URL('driving-core.js',document.currentScript?.src||document.baseURI);dependency.searchParams.set('v','0.71');\n  await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=dependency.href;script.dataset.drivingCore='fallback';script.onload=resolve;script.onerror=reject;document.head.append(script);});\n  if(typeof PixelDrivingCore==='undefined')throw new Error('Driving core unavailable');\n  startButtons.forEach(button=>{button.disabled=false;});\n }catch(error){if(summary)summary.textContent='No se pudo cargar el motor. Recargá la página.';for(const id of ['soloStart','localStart','catalogueBtn']){const button=document.getElementById(id);if(button)button.disabled=true;}return;}\n}\n'use strict';\n",
  "(()=>{'use strict';\n"
 ],
 [
  "const drivingCore=PixelDrivingCore.create();\n",
  ""
 ],
 [
  "const DRIVE_RECOVERY=drivingCore.rules.recovery;\nconst DRIVING_TUNING=drivingCore.rules.tuning;\nconst CAR_MODELS=drivingCore.rules.models;\n",
  "const DRIVE_RECOVERY={reverseDelay:.35,reverseMax:28,reverseAcceleration:.65};\nconst DRIVING_TUNING={accelerationScale:.82,accelerationTaper:.45,lateralAcceleration:280,maxSpeedGripLoss:.24,speedGripLoss:.0014,inputResponse:14,handInputResponse:16,yawResponse:18,yawSpeedWeight:4,topSpeedLateralLoss:.16,liftDrag:30};\nconst CAR_MODELS={\n balanced:{name:'BALANCED',maxSpeed:232,acceleration:110,braking:230,steering:1,grip:1,grass:1,description:'Equilibrado para aprender y competir.'},\n corner:{name:'CORNER KING',maxSpeed:218,acceleration:105,braking:255,steering:1.19,grip:1.15,grass:.86,description:'Más agarre y frenado; velocidad punta menor.'},\n speed:{name:'SPEED DEMON',maxSpeed:260,accelerationTaper:.58,acceleration:123,braking:215,steering:.84,grip:.87,grass:1.12,description:'Rápido en rectas, difícil en curvas cerradas.'},\n rally:{name:'RALLY FOX',maxSpeed:222,acceleration:112,braking:245,steering:1.08,grip:1.04,grass:.57,description:'Pierde menos velocidad si toca el pasto.'}\n};\n"
 ],
 [
  "const TERRAIN_MATERIALS=drivingCore.rules.materials;\nconst SURFACE_GRIP=drivingCore.surfaceGrip;\n",
  "const TERRAIN_MATERIALS={\n asphalt:{road:{edge:'#141b22',kerb:'#f5f0dc',border:'#3c414c',body:'#646c78',lite:'#59616c',center:'#303640'},grip:1,drag:0,edgeDrag:0,particle:'#aeb6c5',life:.46,size:2},\n dirt:{road:{edge:'#49372b',kerb:'#b18c64',border:'#a27d55',body:'#b8996d',center:'#987449'},grip:.84,drag:54,edgeDrag:2.8,particle:'#ad8053',life:.62,size:3},\n grass:{road:{edge:'#193d2b',kerb:'#69994b',border:'#91b767',body:'#53874a',lite:'#4b7c44',center:'#497541',grain:['#7b9a52','#92aa62','#356139']},grip:.79,drag:34,edgeDrag:2.2,particle:'#6e9958',life:.46,size:2},\n ice:{road:{edge:'#5b8194',kerb:'#e9f8fc',border:'#94bed2',body:'#c7e6ef',lite:'#b5dbe8',center:'#b1d3e3',grain:['#f5feff','#d9f0fa','#8cbacf'],grainKind:'ice'},mark:'#6e9caf',grip:.68,drag:58,edgeDrag:4.6,particle:'#d9f1f6',life:.46,size:2},\n volcanic:{road:{edge:'#211d25',kerb:'#ad704d',border:'#986447',body:'#715047',center:'#42343b',grain:['#5b4745','#b37751','#cf8b57']},grip:.87,drag:54,edgeDrag:2.8,particle:'#cf603c',life:.58,size:3},\n coastal:{grip:1,drag:54,edgeDrag:2.8,particle:'#c9ad7a',life:.58,size:3},\n gravel:{mark:'#816c50',grip:.60,drag:130,edgeDrag:0,speedDrag:.35,particle:'#c4a47b',life:.62,size:3,palette:['#a48c6d','#b59b77','#c3ab86','#d1bb96']}\n};\nconst SURFACE_GRIP=Object.fromEntries(Object.entries(TERRAIN_MATERIALS).map(([name,material])=>[name,material.grip]));\n"
 ],
 [
  "  ...drivingCore.createState(model),done:false,finishTime:null,newBestLap:false,\n",
  "  x:0,y:0,heading:0,yawRate:0,reverseHeld:0,speed:0,steer:0,drift:0,handbrake:false,braking:false,wheelTravel:0,done:false,finishTime:null,newBestLap:false,\n"
 ],
 [
  "const WORLD_SPEED_SCALE=drivingCore.rules.worldSpeedScale;\nconst accelerationAtSpeed=drivingCore.accelerationAtSpeed;\nconst vehicleHandling=drivingCore.vehicleHandling;\n",
  "const WORLD_SPEED_SCALE=.84;\nfunction accelerationAtSpeed(speed,model){return model.acceleration*DRIVING_TUNING.accelerationScale*(1-(model.accelerationTaper??DRIVING_TUNING.accelerationTaper)*clamp(speed/model.maxSpeed,0,1));}\nfunction vehicleHandling(speed,model,surface,safeSpeed,drift=0,hand=false){\n const excess=Math.max(0,speed-safeSpeed);\n const speedLoss=Math.min(DRIVING_TUNING.maxSpeedGripLoss,excess*DRIVING_TUNING.speedGripLoss);\n const grip=clamp((1-speedLoss-drift*(hand?.05:.12))*model.grip*(SURFACE_GRIP[surface]||1),.38,1.15);\n const mechanicalTurn=(.95+speed/235*2.9)*model.steering*grip*(hand?1.18:1);\n // Finite tire force: at high speed the minimum corner radius grows with speed squared.\n const lateralAcceleration=DRIVING_TUNING.lateralAcceleration*(1-DRIVING_TUNING.topSpeedLateralLoss*clamp((speed/model.maxSpeed-.58)/.42,0,1))*model.grip*(SURFACE_GRIP[surface]||1)*(hand?1.12:1);\n const turnRate=Math.min(mechanicalTurn,lateralAcceleration/Math.max(30,speed*WORLD_SPEED_SCALE));\n return {grip,turnRate,lateralAcceleration};\n}\n"
 ],
 [
  "const updateSteeringInertia=drivingCore.updateSteeringInertia;\nconst humanSteeringInput=drivingCore.humanSteeringInput;\n",
  "function updateSteeringInertia(car,turnRate,maxSpeed,dt){\n if(car.speed===0){car.yawRate=0;return;} // Wheels can steer at rest; the chassis needs motion to turn.\n const target=car.steer*turnRate*(car.speed<0?-1:1),response=car.handbrake?20:DRIVING_TUNING.yawResponse-DRIVING_TUNING.yawSpeedWeight*clamp(Math.abs(car.speed)/maxSpeed,0,1);\n const previous=car.yawRate||0,decay=Math.exp(-response*dt);\n car.yawRate=target+(previous-target)*decay;\n car.heading=wrapAngle(car.heading+target*dt+(previous-target)*(1-decay)/response);\n}\nfunction humanSteeringInput(current,target,hand,dt){\n const response=hand?DRIVING_TUNING.handInputResponse:DRIVING_TUNING.inputResponse;\n // Unwind opposed lock sooner, then build the new turn with normal weight.\n if(current*target<0&&Math.abs(target)>.15){\n  const unwind=response*1.5,crossing=Math.log1p(-current/target)/unwind;\n  if(dt<=crossing)return target+(current-target)*Math.exp(-unwind*dt);\n  return target*(1-Math.exp(-response*(dt-crossing)));\n }\n return target+(current-target)*Math.exp(-response*dt);\n}\n"
 ],
 [
  "const updateDriveSpeed=drivingCore.updateDriveSpeed;\nconst applyGroundDrag=drivingCore.applyGroundDrag;\n",
  "function updateDriveSpeed(car,controls,model,dt){\n const {throttle,brake,hand,reverse=false}=controls;\n if(reverse){\n  car.speed=Math.max(-DRIVE_RECOVERY.reverseMax,car.speed-brake*model.acceleration*DRIVE_RECOVERY.reverseAcceleration*dt);\n }else if(car.speed<0){\n  car.speed=Math.min(0,car.speed+(DRIVING_TUNING.liftDrag+throttle*model.braking+(hand?model.braking*.55:0))*dt);\n }else{\n  // Brake pressure releases drive torque; partial throttle blends engine drag continuously.\n  const driveThrottle=throttle*(1-brake);\n  car.speed+=driveThrottle*accelerationAtSpeed(car.speed,model)*dt;\n  car.speed-=brake*(hand?model.braking*1.27:model.braking)*dt;\n  car.speed-=(2.6*driveThrottle+DRIVING_TUNING.liftDrag*(1-driveThrottle))*dt;\n  if(hand)car.speed-=model.braking*.55*dt;\n  car.speed=clamp(car.speed,0,model.maxSpeed);\n }\n}\nfunction applyGroundDrag(speed,drag,dt,crawl){\n const sign=speed<0?-1:1,magnitude=Math.abs(speed);\n return sign*Math.max(Math.min(crawl,magnitude),magnitude-drag*dt);\n}\n"
 ],
 [
  "  controls=drivingCore.humanControls(car,controlsFor(i),dt);\n",
  "  const input=controlsFor(i),{hand,steering}=input;\n  car.steer=humanSteeringInput(car.steer,steering,hand,dt);\n  const reverseIntent=input.brake>.5&&input.throttle<.05&&!hand&&car.speed<=.001;\n  car.reverseHeld=reverseIntent?(car.reverseHeld||0)+dt:0;\n  controls={throttle:input.throttle,brake:input.brake,hand,reverse:reverseIntent&&car.reverseHeld>=DRIVE_RECOVERY.reverseDelay};\n"
 ],
 [
  " const oldProgress=car.progress,previousX=car.x,previousY=car.y;\n",
  " const {brake,hand}=controls;car.handbrake=hand;car.braking=brake>0||hand;\n updateDriveSpeed(car,controls,model,dt);\n if(hand)car.drift=Math.min(1,Math.abs(car.steer)*Math.abs(car.speed)/200);\n const tooFast=Math.max(0,car.speed-localBend.safeSpeed);\n"
 ],
 [
  " drivingCore.stepVehicle(car,controls,model,drivingSurface,localBend.safeSpeed,dt);\n",
  " const handling=vehicleHandling(Math.abs(car.speed),model,drivingSurface,localBend.safeSpeed,car.drift,car.handbrake);\n updateSteeringInertia(car,handling.turnRate,model.maxSpeed,dt);\n car.drift=clamp(Math.max(car.drift*Math.exp(-4.5*dt),tooFast/160),0,1);\n const oldProgress=car.progress,previousX=car.x,previousY=car.y;\n const move=car.speed*WORLD_SPEED_SCALE*dt;\n car.wheelTravel=(car.wheelTravel+move)%12;\n car.x+=Math.cos(car.heading)*move;car.y+=Math.sin(car.heading)*move;\n"
 ]
];
export function withoutSharedDriving(source){
 if(!source.includes('const drivingCore=PixelDrivingCore.create();'))return source;
 // Cache-busting revisions do not change the historical physics being checked.
 source=source.replace(/dependency\.searchParams\.set\('v','[0-9.]+'\)/,"dependency.searchParams.set('v','0.71')");
 for(const [current,previous] of edits){if(!source.includes(current))throw new Error('Shared-driving extraction anchor changed');source=source.replace(current,previous);}
 return source;
}
