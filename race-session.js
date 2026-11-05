/* Owned race lifecycle, shared fixed-step simulation and results. No DOM, clock, RNG or I/O. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PixelRaceSession=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const timing=Object.freeze({step:1/60,maxSteps:6});
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function copy(value){if(Array.isArray(value))return value.map(copy);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,copy(v)]));return value;}
 function create({world,geometry,driving,rulesModule,laps=3,raceId='local',vehicles=[],controller=null,onEvent=()=>{},onLap=()=>false,beforeStep=()=>{},afterVehicle=()=>{},afterStep=()=>{}}){
  if(!world?.track||!geometry?.nearestOnTrack||!driving?.createState||!rulesModule?.create)throw new TypeError('Missing shared race dependencies');
  if(typeof raceId!=='string'||!raceId.length||raceId.length>80)throw new TypeError('Invalid race identity');
  if(controller!==null&&typeof controller!=='function')throw new TypeError('Invalid controller');
  for(const hook of [onEvent,onLap,beforeStep,afterVehicle,afterStep])if(typeof hook!=='function')throw new TypeError('Invalid race hook');
  const config=Object.freeze({raceId,laps,track:world.track.name,layoutVersion:world.track.layoutVersion||0,roadVersion:world.track.roadVersion||0,barriers:world.barrierMode,step:timing.step,maxSteps:timing.maxSteps});
  const state={cars:[],elapsed:0,accumulator:0,countdownRemaining:0,goFlashRemaining:0,running:false,paused:false,sequence:0};
  let started=false,initialGrid=null,countdownLabel='';
  function emit(type,detail={},car=null){const event=Object.freeze({...detail,type,raceId,sequence:++state.sequence,time:state.elapsed});onEvent(event,car);return event;}
  const rules=rulesModule.create({world,geometry,driving,laps,onLap,onEvent:(event,car)=>emit(event.type,{...event,ruleSequence:event.sequence},car)});
  function createVehicle({player=0,model='balanced',isAI=false}={}){
   if(!Number.isInteger(player)||player<0||player>=32||typeof isAI!=='boolean')throw new TypeError('Invalid pilot');
   return {player,isAI,...driving.createState(model),done:false,finishTime:null,newBestLap:false,progress:0,previousProgress:0,raceOffset:0,lap:0,lapTimes:[],lapStartTime:0,raceProgress:0,offroad:0,roadOffset:0,flash:0,nextCheckpoint:0,checkpointPasses:0,lastCheckpointTime:0};
  }
  function setVehicles(grid){
   if(state.running||started)throw new Error('Grid is locked after race start');
   if(!Array.isArray(grid)||grid.length>32)throw new RangeError('Invalid grid');
   const ids=new Set();
   for(const car of grid){
    if(!car||!Number.isInteger(car.player)||typeof car.isAI!=='boolean'||!Object.hasOwn(driving.rules.models,car.model)||!Array.isArray(car.lapTimes))throw new TypeError('Invalid grid vehicle');
    createVehicle(car);if(ids.has(car.player))throw new TypeError('Duplicate pilot');ids.add(car.player);
    for(const key of ['x','y','heading','speed','steer','yawRate','drift'])if(!Number.isFinite(car[key]))throw new TypeError('Non-finite vehicle state');
   }
   state.cars=copy(grid);return state.cars;
  }
  function resetClock(){state.accumulator=0;}
  function start(countdown=3){
   if(started)throw new Error('Use restart for a started race');
   if(!state.cars.length)throw new Error('Cannot start an empty grid');
   if(!Number.isFinite(countdown)||countdown<0||countdown>30)throw new RangeError('Invalid countdown');
   initialGrid=copy(state.cars);started=true;state.elapsed=0;state.countdownRemaining=countdown;state.goFlashRemaining=0;state.paused=false;state.running=true;countdownLabel='';resetClock();emit('started');
  }
  function restart(countdown=3){
   if(!initialGrid)throw new Error('No initial grid');
   state.cars=copy(initialGrid);started=false;state.running=false;start(countdown);
  }
  function stop(reason='stopped'){if(typeof reason!=='string'||reason.length>80)throw new TypeError('Invalid stop reason');const wasRunning=state.running;state.running=false;resetClock();if(wasRunning)emit('stopped',{reason});}
  function setPaused(value){
   if(!state.running)return false;const paused=value===true;if(paused===state.paused)return false;
   state.paused=paused;resetClock();state.cars.forEach(car=>{car.reverseHeld=0;});emit(paused?'paused':'resumed');return true;
  }
  function advanceCountdown(dt){
   if(!state.running||state.paused||state.countdownRemaining<=0||!Number.isFinite(dt)||dt<=0)return null;
   state.countdownRemaining=Math.max(0,state.countdownRemaining-dt);
   const label=state.countdownRemaining>0?String(Math.ceil(state.countdownRemaining)):'GO!';
   if(label!==countdownLabel){countdownLabel=label;if(label==='GO!')state.goFlashRemaining=.55;emit(label==='GO!'?'go':'countdown',{label});}
   return label;
  }
  function normalInput(input){
   const value=(key,min,max)=>clamp(Number.isFinite(input?.[key])?input[key]:0,min,max);
   return {throttle:value('throttle',0,1),brake:value('brake',0,1),steering:value('steering',-1,1),hand:input?.hand===true};
  }
  function advanceVehicle(car,index,dt,inputs=[]){
   if(!Number.isFinite(dt)||dt<=0||dt>.1)throw new RangeError('Invalid vehicle step');
   const before=geometry.nearestOnTrack(car.x,car.y,null,world.track),bend=world.curvatureAt(before.progress);
   const commands=controller?controller(car,index,dt,before,bend):driving.humanControls(car,normalInput(inputs[index]),dt);
   const ground=rules.advanceVehicle(car,commands,dt,state.elapsed,before,bend);
   afterVehicle(car,index,dt,ground);
   // Preserve impact cooldown ordering: vehicle feedback, decay, then group contacts.
   if(car.flash>0)car.flash-=dt;
   return ground;
  }
  function finishState(){return rules.finishState(state.cars,state.elapsed);}
  function advanceFrame(frameTime,inputs=[]){
   if(!state.running||state.paused||state.countdownRemaining>0||!Number.isFinite(frameTime)||frameTime<=0||finishState().closed)return 0;
   state.accumulator=Math.min(state.accumulator+frameTime,timing.step*timing.maxSteps);let steps=0;
   while(state.accumulator+1e-9>=timing.step&&steps<timing.maxSteps){
    beforeStep(timing.step);state.elapsed+=timing.step;
    state.cars.forEach((car,index)=>{if(!car.done)advanceVehicle(car,index,timing.step,inputs);});
    rules.resolveCollisions(state.cars,timing.step,state.elapsed);afterStep(timing.step);
    state.goFlashRemaining=Math.max(0,state.goFlashRemaining-timing.step);
    state.accumulator=Math.max(0,state.accumulator-timing.step);steps++;
    if(finishState().closed)break;
   }
   return steps;
  }
  // Countdown consumes its display frame, matching the local game's original GO transition.
  function frame(dt,inputs=[]){if(state.countdownRemaining>0){advanceCountdown(dt);return 0;}return advanceFrame(dt,inputs);}
  function classification(){return [...state.cars].sort((a,b)=>a.done!==b.done?(a.done?-1:1):a.done?(a.finishTime-b.finishTime||a.player-b.player):(b.raceProgress-a.raceProgress||a.player-b.player));}
  function points(car,index){return car.done?([25,18,15,12][index]||0):0;}
  function results(){return Object.freeze(classification().map((car,index)=>Object.freeze({player:car.player,isAI:car.isAI,model:car.model,position:index+1,done:car.done,finishTime:car.finishTime,lap:car.lap,lapTimes:Object.freeze([...car.lapTimes]),bestLap:car.lapTimes.length?Math.min(...car.lapTimes):null,points:points(car,index)})));}
  const snapshotFields=[...new Set([...Object.keys(driving.createState()),'player','isAI','done','finishTime','lap','lapTimes','lapStartTime','progress','previousProgress','raceProgress','raceOffset','offroad','roadOffset','flash','nextCheckpoint','checkpointPasses','lastCheckpointTime'])];
  function snapshot(){return {config:{...config},elapsed:state.elapsed,accumulator:state.accumulator,countdownRemaining:state.countdownRemaining,goFlashRemaining:state.goFlashRemaining,running:state.running,paused:state.paused,sequence:state.sequence,cars:state.cars.map(car=>Object.fromEntries(snapshotFields.map(key=>[key,copy(car[key])])))};}
  setVehicles(vehicles);
  return Object.freeze({config,state,rules,createVehicle,setVehicles,start,restart,stop,setPaused,resetClock,advanceCountdown,advanceVehicle,advanceFrame,frame,finishState,classification,points,results,snapshot});
 }
 return Object.freeze({apiVersion:1,timing,create});
});
