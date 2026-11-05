const edits=[
 [
  "||typeof PixelGhostLap==='undefined'||typeof PixelRaceSession==='undefined')",
  "||typeof PixelGhostLap==='undefined')"
 ],
 [
  "['PixelGhostLap','ghost-lap.js','ghostLap'],['PixelRaceSession','race-session.js','raceSession']]",
  "['PixelGhostLap','ghost-lap.js','ghostLap']]"
 ],
 [
  "let raceSerial=0;\nlet raceSession=createRaceSession(),raceState=raceSession.state,raceRules=raceSession.rules;\nfunction createRaceSession(){return PixelRaceSession.create({world:trackWorld,geometry:trackCore,driving:drivingCore,rulesModule:PixelRaceRules,laps:LAPS_TO_WIN,raceId:'local-'+(++raceSerial),\n controller:raceControls,onLap:onCompletedLap,\n beforeStep:()=>{for(const car of cars)renderPrevious.set(car,{x:car.x,y:car.y,heading:car.heading});},\n afterVehicle:raceVehicleFeedback,\n afterStep:dt=>{updateGroundEffects(dt);recordTrialFrame();},\n onEvent:(event,car)=>{if(['checkpoint','lap','impact'].includes(event.type))playRaceCue(event.type==='lap'?(event.finished?'finish':event.personalBest?'record':'lap'):event.type,car,event.strength??1);}});}",
  "let raceRules=createRaceRules();\nfunction createRaceRules(){return PixelRaceRules.create({world:trackWorld,geometry:trackCore,driving:drivingCore,laps:LAPS_TO_WIN,\n onLap:onCompletedLap,\n onEvent:(event,car)=>playRaceCue(event.type==='lap'?(event.finished?'finish':event.personalBest?'record':'lap'):event.type,car,event.strength??1)});}"
 ],
 [
  "let stage=0,mode='solo',track=tracks[0],raf=0,last=0;",
  "let stage=0,mode='solo',track=tracks[0],running=false,paused=false,raf=0,last=0,elapsed=0;"
 ],
 [
  "const SIMULATION_VERSION=1,SIMULATION_STEP=PixelRaceSession.timing.step,MAX_SIMULATION_STEPS=PixelRaceSession.timing.maxSteps;",
  "const SIMULATION_VERSION=1,SIMULATION_STEP=1/60,MAX_SIMULATION_STEPS=6;"
 ],
 [
  "let renderPrevious=new WeakMap();",
  "let simulationAccumulator=0,renderPrevious=new WeakMap();"
 ],
 [
  "function resetSimulationClock(){raceSession.resetClock();renderPrevious=new WeakMap();}",
  "function resetSimulationClock(){simulationAccumulator=0;renderPrevious=new WeakMap();}"
 ],
 [
  "let countdownShown='',finishNoticeKey='';",
  "let countdownRemaining=0,goFlashRemaining=0,countdownShown='',finishNoticeKey='';"
 ],
 [
  "let keys=Object.create(null),graphics='high'",
  "let keys=Object.create(null),cars=[],graphics='high'"
 ],
 [
  "function raceClassification(){return raceSession.classification();}",
  "function raceClassification(){\n return [...cars].sort((a,b)=>a.done!==b.done?(a.done?-1:1):a.done?(a.finishTime-b.finishTime||a.player-b.player):(b.raceProgress-a.raceProgress||a.player-b.player));\n}"
 ],
 [
  "function racePoints(car,index){return raceSession.points(car,index);}",
  "function racePoints(car,index){return car.done?([25,18,15,12][index]||0):0;}"
 ],
 [
  "  ...raceSession.createVehicle({player,model,isAI}),particles:[]};",
  "  ...drivingCore.createState(model),done:false,finishTime:null,newBestLap:false,\n  progress:0,previousProgress:0,raceOffset:0,lap:0,lapTimes:[],lapStartTime:0,raceProgress:0,offroad:0,roadOffset:0,particles:[],flash:0};"
 ],
 [
  " resetSimulationClock();raceSession.stop('replaced');\n if(!keepSeason)",
  " resetSimulationClock();\n if(!keepSeason)"
 ],
 [
  "trackWorld=trackCore.createWorld(stage,$('barrierMode')?.value||'auto');raceSession=createRaceSession();raceState=raceSession.state;raceRules=raceSession.rules;",
  "trackWorld=trackCore.createWorld(stage,$('barrierMode')?.value||'auto');raceRules=createRaceRules();"
 ],
 [
  " const grid=[setupCar(0)];\n if(mode==='solo'){const count=raceFormat==='trial'?0:clamp(Number($('opponentCount').value)||3,1,3);for(let i=1;i<=count;i++)grid.push(setupCar(i,true));}else for(let i=1;i<localPlayerCount;i++)grid.push(setupCar(i));\n raceSession.setVehicles(grid);",
  " cars=[setupCar(0)];\n if(mode==='solo'){const count=raceFormat==='trial'?0:clamp(Number($('opponentCount').value)||3,1,3);for(let i=1;i<=count;i++)cars.push(setupCar(i,true));}else for(let i=1;i<localPlayerCount;i++)cars.push(setupCar(i));"
 ],
 [
  "raceSession.start(3);finishNoticeKey='';countdownShown='';keys=Object.create(null);beginTrial();",
  "elapsed=0;finishNoticeKey='';countdownRemaining=3;goFlashRemaining=0;countdownShown='';paused=false;running=true;keys=Object.create(null);beginTrial();"
 ],
 [
  "if(!running)return;if(paused&&!checkLocalControllers())return;raceSession.setPaused(!paused);keys=Object.create(null);",
  "if(!running)return;if(paused&&!checkLocalControllers())return;paused=!paused;keys=Object.create(null);"
 ],
 [
  "function raceControls(car,i,dt,before,localBend){\n const model=CAR_MODELS[car.model]||CAR_MODELS.balanced;\n let controls;\n if(car.isAI){\n  controls=driveAI(car,before,model,dt);\n }else{\n  controls=drivingCore.humanControls(car,controlsFor(i),dt);\n }\n return controls;\n}\nfunction physics(car,i,dt){return raceSession.advanceVehicle(car,i,dt);}\nfunction raceVehicleFeedback(car,i,dt,{ground,roadEdge}){\n car.skidTimer=Math.max(0,(car.skidTimer||0)-dt);\n const skidding=car.speed>58&&drivingSlip(car)>.43;\n if(skidding&&car.skidTimer<=0){const wheels=(CAR_VISUALS[car.model]||CAR_VISUALS.balanced),rearX=car.x+Math.cos(car.heading)*wheels.rearAxle,rearY=car.y+Math.sin(car.heading)*wheels.rearAxle;\n  for(const wheelSide of [-1,1]){const wx=rearX-Math.sin(car.heading)*wheelSide*wheels.halfTrack,wy=rearY+Math.cos(car.heading)*wheelSide*wheels.halfTrack;skidMarks.push({x:wx,y:wy,angle:car.heading,life:10,maxLife:10,color:TERRAIN_MATERIALS[terrainAt(wx,wy).material].mark||'#101419'});}\n  car.skidTimer=.045;if(skidMarks.length>1400)skidMarks.splice(0,skidMarks.length-1400);\n }\n if((skidding||roadEdge>3)&&car.speed>38&&Math.random()<dt*(roadEdge>3?34:20)&&terrainParticles.length<360){\n  const rearX=car.x-Math.cos(car.heading)*13,rearY=car.y-Math.sin(car.heading)*13,spread=(Math.random()-.5)*14;\n  const rearGround=terrainAt(rearX,rearY),particleStyle=TERRAIN_MATERIALS[rearGround.material]||TERRAIN_MATERIALS.asphalt;\n  const life=particleStyle.life;\n  terrainParticles.push({x:rearX-Math.sin(car.heading)*spread,y:rearY+Math.cos(car.heading)*spread,vx:(Math.random()-.5)*34-Math.cos(car.heading)*(roadEdge>3?12:5),vy:(Math.random()-.5)*34-Math.sin(car.heading)*(roadEdge>3?12:5),life,max:life,size:particleStyle.size+Math.random()*2,color:particleStyle.particle});\n }\n car.particles=car.particles.filter(p=>(p.life-=dt)>0);\n}\n",
  "function physics(car,i,dt){\n const before=nearestOnTrack(car.x,car.y),localBend=curvatureAt(before.progress);\n const model=CAR_MODELS[car.model]||CAR_MODELS.balanced;\n let controls;\n if(car.isAI){\n  controls=driveAI(car,before,model,dt);\n }else{\n  controls=drivingCore.humanControls(car,controlsFor(i),dt);\n }\n const {ground,roadEdge}=raceRules.advanceVehicle(car,controls,dt,elapsed,before,localBend);\n car.skidTimer=Math.max(0,(car.skidTimer||0)-dt);\n const skidding=car.speed>58&&drivingSlip(car)>.43;\n if(skidding&&car.skidTimer<=0){const wheels=(CAR_VISUALS[car.model]||CAR_VISUALS.balanced),rearX=car.x+Math.cos(car.heading)*wheels.rearAxle,rearY=car.y+Math.sin(car.heading)*wheels.rearAxle;\n  for(const wheelSide of [-1,1]){const wx=rearX-Math.sin(car.heading)*wheelSide*wheels.halfTrack,wy=rearY+Math.cos(car.heading)*wheelSide*wheels.halfTrack;skidMarks.push({x:wx,y:wy,angle:car.heading,life:10,maxLife:10,color:TERRAIN_MATERIALS[terrainAt(wx,wy).material].mark||'#101419'});}\n  car.skidTimer=.045;if(skidMarks.length>1400)skidMarks.splice(0,skidMarks.length-1400);\n }\n if((skidding||roadEdge>3)&&car.speed>38&&Math.random()<dt*(roadEdge>3?34:20)&&terrainParticles.length<360){\n  const rearX=car.x-Math.cos(car.heading)*13,rearY=car.y-Math.sin(car.heading)*13,spread=(Math.random()-.5)*14;\n  const rearGround=terrainAt(rearX,rearY),particleStyle=TERRAIN_MATERIALS[rearGround.material]||TERRAIN_MATERIALS.asphalt;\n  const life=particleStyle.life;\n  terrainParticles.push({x:rearX-Math.sin(car.heading)*spread,y:rearY+Math.cos(car.heading)*spread,vx:(Math.random()-.5)*34-Math.cos(car.heading)*(roadEdge>3?12:5),vy:(Math.random()-.5)*34-Math.sin(car.heading)*(roadEdge>3?12:5),life,max:life,size:particleStyle.size+Math.random()*2,color:particleStyle.particle});\n }\n car.particles=car.particles.filter(p=>(p.life-=dt)>0);if(car.flash>0)car.flash-=dt;\n}\n"
 ],
 [
  "function raceFinishState(){return raceSession.finishState();}",
  "function raceFinishState(){return raceRules.finishState(cars,elapsed);}"
 ],
 [
  "function advanceRaceFrame(frameTime){return raceSession.advanceFrame(frameTime);}\n",
  "function advanceRaceFrame(frameTime){\n if(!running||paused||countdownRemaining>0)return 0;\n if(!Number.isFinite(frameTime)||frameTime<=0)return 0;\n // Drop excess after a stall instead of accumulating unlimited catch-up work.\n simulationAccumulator=Math.min(simulationAccumulator+frameTime,SIMULATION_STEP*MAX_SIMULATION_STEPS);\n let steps=0;\n while(simulationAccumulator+1e-9>=SIMULATION_STEP&&steps<MAX_SIMULATION_STEPS){\n  for(const car of cars)renderPrevious.set(car,{x:car.x,y:car.y,heading:car.heading});\n  elapsed+=SIMULATION_STEP;\n  cars.forEach((car,i)=>{if(!car.done)physics(car,i,SIMULATION_STEP);});\n  resolveCollisions(SIMULATION_STEP);updateGroundEffects(SIMULATION_STEP);recordTrialFrame();\n  goFlashRemaining=Math.max(0,goFlashRemaining-SIMULATION_STEP);\n  simulationAccumulator=Math.max(0,simulationAccumulator-SIMULATION_STEP);steps++;\n  if(raceFinishState().closed)break;\n }\n return steps;\n}\n"
 ],
 [
  "  raceSession.advanceCountdown(frameTime);",
  "  countdownRemaining=Math.max(0,countdownRemaining-frameTime);"
 ],
 [
  "if(label==='GO!'){",
  "if(label==='GO!'){goFlashRemaining=.55;"
 ],
 [
  " raceSession.stop('finished');audioResultActive=true;",
  " running=false;audioResultActive=true;"
 ],
 [
  "resetTouch();raceSession.stop('menu');resetSimulationClock();",
  "resetTouch();running=false;resetSimulationClock();"
 ],
 [
  "console.error('Race preparation failed',error);raceSession.stop('preparation-error');",
  "console.error('Race preparation failed',error);running=false;"
 ]
];
const names={"cars": "cars", "elapsed": "elapsed", "running": "running", "paused": "paused", "countdownRemaining": "countdownRemaining", "goFlashRemaining": "goFlashRemaining", "accumulator": "simulationAccumulator"};
export function withoutRaceSession(source){
 if(!source.includes('let raceSession=createRaceSession()'))return source;
 source=source.replace(/\braceState\.(cars|elapsed|running|paused|countdownRemaining|goFlashRemaining|accumulator)\b/g,(_,name)=>names[name]);
 for(const [current,previous] of [...edits].reverse()){if(!source.includes(current))throw Error('Race session migration anchor changed: '+current.slice(0,80));source=source.replace(current,previous);}
 return source.replace("set('v','0.78')","set('v','0.77')");
}
