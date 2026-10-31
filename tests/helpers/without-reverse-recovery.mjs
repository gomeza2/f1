// Undo only the declared 0.69 recovery migration; keep historical fixtures immutable.
const edits=[
 [
  "const DRIVE_RECOVERY={reverseDelay:.35,reverseMax:28,reverseAcceleration:.65};\n",
  ""
 ],
 [
  "  const car=cars.find(candidate=>candidate.player===player&&!candidate.isAI&&!candidate.done),speed=Math.abs(car?.speed||0),model=CAR_MODELS[car?.model]||CAR_MODELS.balanced;\n",
  "  const car=cars.find(candidate=>candidate.player===player&&!candidate.isAI&&!candidate.done),speed=car?.speed||0,model=CAR_MODELS[car?.model]||CAR_MODELS.balanced;\n"
 ],
 [
  "  const input=controlsFor(player),reversing=car?.speed<0;\n  channel.update({speed,maxSpeed:model.maxSpeed,model:car?.model,throttle:reversing?input.brake:input.throttle,braking:!!car?.braking&&!reversing,audible,mix});\n",
  "  channel.update({speed,maxSpeed:model.maxSpeed,model:car?.model,throttle:controlsFor(player).throttle,braking:!!car?.braking,audible,mix});\n"
 ],
 [
  " const incomingSpeed=Math.abs(car.speed),direction=car.speed<0?-1:1;let hit=false,impactFactor=1;\n",
  " const incomingSpeed=car.speed;let hit=false,impactFactor=1;\n"
 ],
 [
  "  const vx=Math.cos(car.heading)*direction,vy=Math.sin(car.heading)*direction,inward=vx*nx+vy*ny;\n",
  "  const vx=Math.cos(car.heading),vy=Math.sin(car.heading),inward=vx*nx+vy*ny;\n"
 ],
 [
  "   const angle=Math.atan2(reflectedY,reflectedX);car.heading=direction<0?wrapAngle(angle-Math.PI):angle;\n",
  "   car.heading=Math.atan2(reflectedY,reflectedX);\n"
 ],
 [
  "  x:0,y:0,heading:0,yawRate:0,reverseHeld:0,speed:0,steer:0,drift:0,handbrake:false,braking:false,wheelTravel:0,done:false,finishTime:null,newBestLap:false,\n  progress:0,previousProgress:0,raceOffset:0,lap:0,lapTimes:[],lapStartTime:0,raceProgress:0,offroad:0,roadOffset:0,particles:[],flash:0};\n",
  "  x:0,y:0,heading:0,yawRate:0,speed:0,steer:0,drift:0,handbrake:false,braking:false,wheelTravel:0,done:false,finishTime:null,newBestLap:false,\n  progress:0,previousProgress:0,lap:0,lapTimes:[],lapStartTime:0,raceProgress:0,offroad:0,roadOffset:0,particles:[],flash:0};\n"
 ],
 [
  " car.x=p.x+nx*lateral;car.y=p.y+ny*lateral;car.heading=p.angle;car.yawRate=0;car.reverseHeld=0;car.braking=false;car.wheelTravel=0;\n car.progress=wrapDistance(progress);car.previousProgress=car.progress;car.raceProgress=car.progress;car.raceOffset=0;\n",
  " car.x=p.x+nx*lateral;car.y=p.y+ny*lateral;car.heading=p.angle;car.yawRate=0;car.braking=false;car.wheelTravel=0;\n car.progress=wrapDistance(progress);car.previousProgress=car.progress;car.raceProgress=car.progress;\n"
 ],
 [
  "window.addEventListener('blur',()=>{keys=Object.create(null);cars.forEach(car=>{car.reverseHeld=0;});});\n",
  "window.addEventListener('blur',()=>{keys=Object.create(null);});\n"
 ],
 [
  " if(!running)return;if(paused&&!checkLocalControllers())return;paused=!paused;keys=Object.create(null);cars.forEach(car=>{car.reverseHeld=0;});cancelAnimationFrame(raf);\n",
  " if(!running)return;if(paused&&!checkLocalControllers())return;paused=!paused;keys=Object.create(null);cancelAnimationFrame(raf);\n"
 ],
 [
  " const old=car.progress,newP=loc.progress,delta=newP-old,oldLap=car.lap;\n",
  " const old=car.progress,newP=loc.progress,delta=newP-old;\n"
 ],
 [
  " if(car.lap>oldLap)car.raceOffset=0;\n else if(delta>track.length/2)car.raceOffset=(car.raceOffset||0)-1;\n else if(delta<-track.length/2&&car.raceOffset<0)car.raceOffset++;\n car.previousProgress=old;car.progress=newP;car.raceProgress=(car.lap+(car.raceOffset||0))*track.length+newP;\n",
  " car.previousProgress=old;car.progress=newP;car.raceProgress=car.lap*track.length+newP;\n"
 ],
 [
  " const target=car.steer*turnRate*(car.speed<0?-1:1),response=car.handbrake?20:DRIVING_TUNING.yawResponse-DRIVING_TUNING.yawSpeedWeight*clamp(Math.abs(car.speed)/maxSpeed,0,1);\n",
  " const target=car.steer*turnRate,response=car.handbrake?20:DRIVING_TUNING.yawResponse-DRIVING_TUNING.yawSpeedWeight*clamp(car.speed/maxSpeed,0,1);\n"
 ],
 [
  "// Signed longitudinal speed keeps reverse in the same motion/contact pipeline.\n// Reverse is an explicit driver command; holding a normal CPU brake never requests it.\nfunction updateDriveSpeed(car,controls,model,dt){\n const {throttle,brake,hand,reverse=false}=controls;\n if(reverse){\n  car.speed=Math.max(-DRIVE_RECOVERY.reverseMax,car.speed-brake*model.acceleration*DRIVE_RECOVERY.reverseAcceleration*dt);\n }else if(car.speed<0){\n  car.speed=Math.min(0,car.speed+(DRIVING_TUNING.liftDrag+throttle*model.braking+(hand?model.braking*.55:0))*dt);\n }else{\n  // Brake pressure releases drive torque; partial throttle blends engine drag continuously.\n  const driveThrottle=throttle*(1-brake);\n  car.speed+=driveThrottle*accelerationAtSpeed(car.speed,model)*dt;\n  car.speed-=brake*(hand?model.braking*1.27:model.braking)*dt;\n  car.speed-=(2.6*driveThrottle+DRIVING_TUNING.liftDrag*(1-driveThrottle))*dt;\n  if(hand)car.speed-=model.braking*.55*dt;\n  car.speed=clamp(car.speed,0,model.maxSpeed);\n }\n}\nfunction applyGroundDrag(speed,drag,dt,crawl){\n const sign=speed<0?-1:1,magnitude=Math.abs(speed);\n return sign*Math.max(Math.min(crawl,magnitude),magnitude-drag*dt);\n}\n",
  ""
 ],
 [
  "  const reverseIntent=input.brake>.5&&input.throttle<.05&&!hand&&car.speed<=.001;\n  car.reverseHeld=reverseIntent?(car.reverseHeld||0)+dt:0;\n  controls={throttle:input.throttle,brake:input.brake,hand,reverse:reverseIntent&&car.reverseHeld>=DRIVE_RECOVERY.reverseDelay};\n",
  "  controls={throttle:input.throttle,brake:input.brake,hand};\n"
 ],
 [
  " const {brake,hand}=controls;car.handbrake=hand;car.braking=brake>0||hand;\n updateDriveSpeed(car,controls,model,dt);\n if(hand)car.drift=Math.min(1,Math.abs(car.steer)*Math.abs(car.speed)/200);\n",
  " const {throttle,brake,hand}=controls;car.handbrake=hand;car.braking=brake>0||hand;\n // Brake pressure releases drive torque; partial throttle blends engine drag continuously.\n const driveThrottle=throttle*(1-brake);\n car.speed+=driveThrottle*accelerationAtSpeed(car.speed,model)*dt;\n car.speed-=brake*(hand?model.braking*1.27:model.braking)*dt;\n car.speed-=(2.6*driveThrottle+DRIVING_TUNING.liftDrag*(1-driveThrottle))*dt;\n if(hand)car.speed-=model.braking*.55*dt;\n if(hand)car.drift=Math.min(1,Math.abs(car.steer)*car.speed/200);\n car.speed=clamp(car.speed,0,model.maxSpeed);\n"
 ],
 [
  " const handling=vehicleHandling(Math.abs(car.speed),model,drivingSurface,localBend.safeSpeed,car.drift,car.handbrake);\n",
  " const handling=vehicleHandling(car.speed,model,drivingSurface,localBend.safeSpeed,car.drift,car.handbrake);\n"
 ],
 [
  "  const material=TERRAIN_MATERIALS[ground.material],drag=material.drag+ground.depth*material.edgeDrag+Math.abs(car.speed)*(material.speedDrag||0);\n",
  "  const material=TERRAIN_MATERIALS[ground.material],drag=material.drag+ground.depth*material.edgeDrag+car.speed*(material.speedDrag||0);\n"
 ],
 [
  "  car.speed=applyGroundDrag(car.speed,drag*model.grass,dt,14);\n",
  "  car.speed=Math.max(Math.min(14,car.speed),car.speed-drag*model.grass*dt);\n"
 ],
 [
  "  car.speed=applyGroundDrag(car.speed,100+(Math.abs(after.offset)-92-recoveryExtra)*2.2,dt,12);\n",
  "  car.speed=Math.max(Math.min(12,car.speed),car.speed-(100+(Math.abs(after.offset)-92-recoveryExtra)*2.2)*dt);\n"
 ],
 [
  "    a.speed=(a.speed<0?-1:1)*Math.max(0,Math.abs(a.speed)-closing*.65*Math.max(0,(a.speed<0?-1:1)*av));\n    b.speed=(b.speed<0?-1:1)*Math.max(0,Math.abs(b.speed)-closing*.65*Math.max(0,(b.speed<0?-1:1)*-bv));\n",
  "    a.speed=Math.max(0,a.speed-closing*.65*Math.max(0,av));\n    b.speed=Math.max(0,b.speed-closing*.65*Math.max(0,-bv));\n"
 ],
 [
  " if(car.speed<0){rect(-14,-1.8,2,1.2,'#d9fbff');rect(-14,.6,2,1.2,'#d9fbff');}\n",
  ""
 ],
 [
  "function speedLabel(car){return (car.speed<0?'R ':'')+Math.round(Math.abs(car.speed))+' km/h';}\n",
  ""
 ],
 [
  " $('speedValue').textContent=speedLabel(player);\n",
  " $('speedValue').textContent=Math.round(player.speed)+' km/h';\n"
 ],
 [
  "  $('playerSpeed'+n).textContent=speedLabel(car);$('playerProgress'+n).textContent='V '+Math.min(LAPS_TO_WIN,car.lap+1)+'/'+LAPS_TO_WIN+' · CP '+Math.min(car.checkpointPasses||0,checkpoints.length)+'/'+checkpoints.length;\n",
  "  $('playerSpeed'+n).textContent=Math.round(car.speed)+' km/h';$('playerProgress'+n).textContent='V '+Math.min(LAPS_TO_WIN,car.lap+1)+'/'+LAPS_TO_WIN+' · CP '+Math.min(car.checkpointPasses||0,checkpoints.length)+'/'+checkpoints.length;\n"
 ],
 [
  " if(!running||paused||countdownRemaining>0)return 0;\n",
  ""
 ]
];
export function withoutReverseRecovery(source){
 if(!source.includes('function updateDriveSpeed('))return source;
 for(const [current,previous] of edits){if(!source.includes(current))throw new Error('Recovery migration anchor changed');source=source.replace(current,previous);}
 return source;
}
