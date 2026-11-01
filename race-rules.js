// Shared contacts, terrain recovery and ordered race progress. No browser/clock/RNG.
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PixelRaceRules=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrapAngle=a=>Math.atan2(Math.sin(a),Math.cos(a));
function create({world,geometry,driving,laps=3,onEvent=()=>{},onLap=()=>false}){
 if(!Number.isInteger(laps)||laps<1||laps>99)throw new RangeError('Invalid lap count');
 if(typeof onEvent!=='function'||typeof onLap!=='function')throw new TypeError('Invalid race hooks');
 const track=world.track,trackWorld=world,LAPS_TO_WIN=laps,ROAD_EDGE=geometry.rules.roadEdge,CAR_HALF_WIDTH=10,ROAD_SHOULDER=geometry.rules.roadShoulder;
 const CAR_MODELS=driving.rules.models,TERRAIN_MATERIALS=driving.rules.materials,drivingCore=driving,applyGroundDrag=driving.applyGroundDrag;
 const checkpoints=Object.freeze(geometry.checkpointsForTrack(track).map(gate=>Object.freeze(gate)));
 const sampleAt=distance=>geometry.sampleAt(distance,track),nearestOnTrack=(x,y)=>geometry.nearestOnTrack(x,y,null,track),roadHalfWidthAt=distance=>geometry.roadHalfWidthAt(distance,track),terrainAt=world.terrainAt,projectToSegment=geometry.projectToSegment;
 let sequence=0;
 function emit(type,car,time,detail={}){const event=Object.freeze({sequence:++sequence,type,pilot:car.player,time,...detail});onEvent(event,car);}
function closestSegments(a,b,c,d){
 const candidates=[];
 for(const p of [a,b]){const q=projectToSegment(p.x,p.y,c,d);candidates.push({car:p,wall:q,distanceSq:q.distanceSq});}
 for(const q of [c,d]){const p=projectToSegment(q.x,q.y,a,b);candidates.push({car:p,wall:q,distanceSq:p.distanceSq});}
 const rx=b.x-a.x,ry=b.y-a.y,sx=d.x-c.x,sy=d.y-c.y,den=rx*sy-ry*sx;
 if(Math.abs(den)>1e-8){
  const t=((c.x-a.x)*sy-(c.y-a.y)*sx)/den,u=((c.x-a.x)*ry-(c.y-a.y)*rx)/den;
  if(t>=0&&t<=1&&u>=0&&u<=1){const p={x:a.x+rx*t,y:a.y+ry*t};return {car:p,wall:p,distanceSq:0};}
 }
 return candidates.reduce((best,p)=>p.distanceSq<best.distanceSq?p:best);
}
function gateCrossed(gate,fromX,fromY,toX,toY,heading){
 const tx=Math.cos(gate.angle),ty=Math.sin(gate.angle),nx=-ty,ny=tx;
 const before=(fromX-gate.x)*tx+(fromY-gate.y)*ty;
 const after=(toX-gate.x)*tx+(toY-gate.y)*ty;
 const crosses=before<0&&after>=0,t=crosses?-before/(after-before):0;
 const crossX=fromX+(toX-fromX)*t,crossY=fromY+(toY-fromY)*t;
 const lateral=(crossX-gate.x)*nx+(crossY-gate.y)*ny;
 const forward=Math.cos(wrapAngle(heading-gate.angle))>.12;
 return crosses&&Math.abs(lateral)<=(gate.halfWidth??ROAD_EDGE)+CAR_HALF_WIDTH&&forward;
}
function resolveBarrierContact(car,previousX,previousY,elapsed){
 const incomingSpeed=Math.abs(car.speed),direction=car.speed<0?-1:1;let hit=false,impactFactor=1;
 for(let pass=0;pass<4;pass++){
  let deepest=null;
  const hx=Math.cos(car.heading)*5,hy=Math.sin(car.heading)*5;
  for(const barrier of trackWorld.barriersNear(car.x,car.y)){
   const contact=closestSegments({x:car.x-hx,y:car.y-hy},{x:car.x+hx,y:car.y+hy},barrier.a,barrier.b);
   const distance=Math.sqrt(contact.distanceSq),depth=CAR_HALF_WIDTH+barrier.radius-distance;
   if(depth>1e-4&&(!deepest||depth>deepest.depth))deepest={...contact,depth,distance};
  }
  if(!deepest)break;
  let nx=deepest.car.x-deepest.wall.x,ny=deepest.car.y-deepest.wall.y;
  if(deepest.distance<1e-6){nx=previousX-deepest.wall.x;ny=previousY-deepest.wall.y;}
  const length=Math.hypot(nx,ny)||1;nx/=length;ny/=length;
  car.x+=nx*(deepest.depth+.05);car.y+=ny*(deepest.depth+.05);hit=true;
  const vx=Math.cos(car.heading)*direction,vy=Math.sin(car.heading)*direction,inward=vx*nx+vy*ny;
  if(inward<-.02){
   const reflectedX=vx-1.15*inward*nx,reflectedY=vy-1.15*inward*ny;
   const angle=Math.atan2(reflectedY,reflectedX);car.heading=direction<0?wrapAngle(angle-Math.PI):angle;
   impactFactor=Math.min(impactFactor,Math.hypot(reflectedX,reflectedY)*.94);
  }
 }
 if(impactFactor<1){car.speed*=clamp(impactFactor,.05,1);car.steer*=.65;car.yawRate=(car.yawRate||0)*.3;}
 if(hit&&car.flash<=0){if(incomingSpeed>8&&impactFactor<.99)emit('impact',car,elapsed,{source:'barrier',strength:clamp(incomingSpeed*(1-impactFactor)/150,.15,1)});car.flash=.12;}
 return hit;
}
function updateProgress(car,loc,fromX,fromY,elapsed){
 const old=car.progress,newP=loc.progress,delta=newP-old,oldLap=car.lap;
 const finishGate=sampleAt(0);
 const finish={x:finishGate.x,y:finishGate.y,angle:finishGate.angle,halfWidth:roadHalfWidthAt(0)};
 for(let tries=0;tries<checkpoints.length;tries++){
  const gate=checkpoints[car.nextCheckpoint];
  if(gate&&gateCrossed(gate,fromX,fromY,car.x,car.y,car.heading)){
   car.checkpointPasses++;car.nextCheckpoint=(car.nextCheckpoint+1)%checkpoints.length;
   car.lastCheckpointTime=elapsed;emit('checkpoint',car,elapsed,{checkpoint:gate.id,passes:car.checkpointPasses});
  }else break;
 }
 if(gateCrossed(finish,fromX,fromY,car.x,car.y,car.heading)&&car.checkpointPasses===checkpoints.length){
  const lapTime=elapsed-car.lapStartTime;
  car.lapTimes.push(lapTime);
  const improved=!car.isAI&&onLap(car,lapTime);if(improved)car.newBestLap=true;
  car.lapStartTime=elapsed;car.lap++;car.checkpointPasses=0;car.nextCheckpoint=0;
  emit('lap',car,elapsed,{lap:car.lap,lapTime,finished:car.lap>=LAPS_TO_WIN,personalBest:!!improved});
 }
 if(car.lap>oldLap)car.raceOffset=0;
 else if(delta>track.length/2)car.raceOffset=(car.raceOffset||0)-1;
 else if(delta<-track.length/2&&car.raceOffset<0)car.raceOffset++;
 car.previousProgress=old;car.progress=newP;car.raceProgress=(car.lap+(car.raceOffset||0))*track.length+newP;
 car.offroad=Math.abs(loc.offset);car.roadOffset=loc.offset;car.nearest=loc;
 if(car.lap>=LAPS_TO_WIN&&!car.done){car.done=true;car.finishTime=elapsed;car.speed=0;car.braking=false;}
}
function resolveCollisions(cars,dt,elapsed){
 const active=cars.filter(car=>!car.done),origins=new Map(active.map(car=>[car,{x:car.x,y:car.y}]));
 const impacted=new Set(),moved=new Set();
 // Iterate the small grid: resolving one pair can overlap another or a wall.
 for(let pass=0;pass<16;pass++){
  let depth=0;
  for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
   const a=active[i],b=active[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
   if(d>=23)continue;
   depth=Math.max(depth,23-d);
   const nx=d>.001?dx/d:Math.cos(a.heading),ny=d>.001?dy/d:Math.sin(a.heading);
   const key=i+','+j;
   if(!impacted.has(key)){
    const av=Math.cos(a.heading)*nx+Math.sin(a.heading)*ny,bv=Math.cos(b.heading)*nx+Math.sin(b.heading)*ny;
    const closing=Math.max(0,a.speed*av-b.speed*bv);
    // Dissipate closing motion only; no artificial acceleration or rebound.
    a.speed=(a.speed<0?-1:1)*Math.max(0,Math.abs(a.speed)-closing*.65*Math.max(0,(a.speed<0?-1:1)*av));
    b.speed=(b.speed<0?-1:1)*Math.max(0,Math.abs(b.speed)-closing*.65*Math.max(0,(b.speed<0?-1:1)*-bv));
    if(closing>8){a.flash=.06;b.flash=.06;emit('impact',!a.isAI?a:b,elapsed,{source:'car',strength:closing/160});}
    impacted.add(key);
   }
   const push=(23-d+.01)*.5,ax=a.x,ay=a.y,bx=b.x,by=b.y;
   a.x-=nx*push;a.y-=ny*push;b.x+=nx*push;b.y+=ny*push;
   // Reuse exactly the same visible rail/tire geometry after a car pushes us.
   resolveBarrierContact(a,ax,ay,elapsed);resolveBarrierContact(b,bx,by,elapsed);moved.add(a);moved.add(b);
  }
  if(depth<.01)break;
 }
 // Contact movement may cross a real gate; keep checkpoints and telemetry coherent.
 for(const car of moved){const from=origins.get(car);updateProgress(car,nearestOnTrack(car.x,car.y),from.x,from.y,elapsed);}
}
function finishState(cars,elapsed){
 const finishers=cars.filter(car=>car.done&&Number.isFinite(car.finishTime)).sort((a,b)=>a.finishTime-b.finishTime||a.player-b.player);
 const remaining=finishers.length?Math.max(0,18-(elapsed-finishers[0].finishTime)):null;
 return {finishers,remaining,closed:cars.length>0&&(cars.every(car=>car.done)||remaining===0)};
}
function advanceVehicle(car,controls,dt,elapsed,before=nearestOnTrack(car.x,car.y),localBend=world.curvatureAt(before.progress)){
 const model=CAR_MODELS[car.model]||CAR_MODELS.balanced;
 const oldProgress=car.progress,previousX=car.x,previousY=car.y;
 const drivingSurface=terrainAt(car.x,car.y,before).material;
 drivingCore.stepVehicle(car,controls,model,drivingSurface,localBend.safeSpeed,dt);
 let after=nearestOnTrack(car.x,car.y);
 // Resistance uses the same material sampled by the visible runoff layer.
 let ground=terrainAt(car.x,car.y,after),roadEdge=ground.offroad?ground.depth:0;
 if(ground.offroad){
  const material=TERRAIN_MATERIALS[ground.material],drag=material.drag+ground.depth*material.edgeDrag+Math.abs(car.speed)*(material.speedDrag||0);
  // Preserve a recovery crawl without creating speed from rest or released throttle.
  car.speed=applyGroundDrag(car.speed,drag*model.grass,dt,14);
  car.drift=Math.max(car.drift,ground.material==='gravel'?.42:.28);
 }
 // The rendered rails and tires are also the physical collision geometry.
 const hitBarrier=resolveBarrierContact(car,previousX,previousY,elapsed);
 if(hitBarrier)after=nearestOnTrack(car.x,car.y);
 const side=Math.sign(after.offset)||1,nx=-Math.sin(after.angle),ny=Math.cos(after.angle);
 const recoveryExtra=track.roadProfile?roadHalfWidthAt(after.progress)-ROAD_SHOULDER:0;
 if(!hitBarrier&&Math.abs(after.offset)>92+recoveryExtra){
  car.speed=applyGroundDrag(car.speed,100+(Math.abs(after.offset)-92-recoveryExtra)*2.2,dt,12);
  if(Math.abs(after.offset)>112+recoveryExtra){car.x=after.x+nx*side*(108+recoveryExtra);car.y=after.y+ny*side*(108+recoveryExtra);car.speed*=.76;after=nearestOnTrack(car.x,car.y);}
 }
 ground=terrainAt(car.x,car.y,after);roadEdge=ground.offroad?ground.depth:0;
 updateProgress(car,after,previousX,previousY,elapsed);
 return {ground,roadEdge};
}
return Object.freeze({advanceVehicle,resolveCollisions,resolveBarrierContact,updateProgress,gateCrossed,closestSegments,finishState,checkpoints,get lastSequence(){return sequence;}});
}
return Object.freeze({apiVersion:1,create});
});
