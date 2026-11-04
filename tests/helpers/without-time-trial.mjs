import {withoutRallyDelivery} from './without-rally-delivery.mjs';
const edits=[
 [
  "||typeof PixelRaceRules==='undefined'||typeof PixelGhostLap==='undefined')",
  "||typeof PixelRaceRules==='undefined')"
 ],
 [
  "['PixelRaceRules','race-rules.js','raceRules'],['PixelGhostLap','ghost-lap.js','ghostLap']]",
  "['PixelRaceRules','race-rules.js','raceRules']]"
 ],
 [
  "onLap:onCompletedLap,",
  "onLap:(car,time)=>saveBestLap(lapRecordKey(),time),"
 ],
 [
  "let backgroundCache=null,backgroundCacheKey='',trackSurfaceCache=null,trackSurfaceKey='';\n// Time trial owns presentation/recording only; checkpoint authority stays in race-rules.\nconst ghostCore=PixelGhostLap.create(),TRIAL_KEY='pixelGP.timeTrials.v1';\nfunction trialRecordKey(item=track,model=cars[0]?.model||'balanced',profile=barrierMode){return lapRecordKey(item)+'|'+model+'|'+(profile==='auto'?item.defaultBarriers:profile);}\nconst trialIdentities=new Map();\nfor(const item of tracks)for(const model of Object.keys(CAR_MODELS))for(const profile of ['open','full','half','corners'])trialIdentities.set(trialRecordKey(item,model,profile),{key:trialRecordKey(item,model,profile),model,worldWidth:item.worldWidth,worldHeight:item.worldHeight});\nfunction readTrialStore(){\n const store={version:1,times:Object.create(null),ghosts:Object.create(null),order:[]};\n try{\n  const raw=localStorage.getItem(TRIAL_KEY);if(!raw||raw.length>2000000)return store;\n  const saved=JSON.parse(raw);if(saved?.version!==1)return store;\n  for(const [key,identity] of trialIdentities){const time=saved.times?.[key];if(typeof time==='number'&&Number.isFinite(time)&&time>=1&&time<3600)store.times[key]=time;}\n  for(const key of Array.isArray(saved.order)?saved.order.slice(-8):[]){\n   const identity=trialIdentities.get(key),ghost=saved.ghosts?.[key];\n   if(identity&&!store.order.includes(key)&&ghostCore.valid(ghost,identity)&&ghost.duration===store.times[key]){store.order.push(key);store.ghosts[key]=ghost;}\n  }\n }catch(error){}return store;\n}\nlet trialStore=readTrialStore(),trialRecorder=null,trialGhost=null,trialKey='',ghostVisible=true,trialSaved=true;\nfunction beginTrial(){\n trialKey=raceFormat==='trial'?trialRecordKey():'';trialGhost=trialStore.ghosts[trialKey]||null;\n trialRecorder=trialKey?ghostCore.recorder(trialKey,cars[0].model,cars[0]):null;\n if($('ghostBtn')){$('ghostBtn').classList.toggle('hidden',!trialKey);$('ghostBtn').setAttribute('aria-pressed',String(ghostVisible));}\n}\nfunction onCompletedLap(car,time){\n const globalImproved=saveBestLap(lapRecordKey(),time);\n if(raceFormat!=='trial'||car!==cars[0]||!trialRecorder)return globalImproved;\n const recording=trialRecorder.finish(time,car),previous=trialStore.times[trialKey];let improved=false;\n if(Number.isFinite(time)&&time>=1&&time<3600&&(!previous||time<previous)){\n  improved=true;trialStore.times[trialKey]=time;delete trialStore.ghosts[trialKey];trialStore.order=trialStore.order.filter(key=>key!==trialKey);\n  if(ghostCore.valid(recording,trialIdentities.get(trialKey))){trialStore.ghosts[trialKey]=recording;trialStore.order.push(trialKey);}\n  while(trialStore.order.length>8)delete trialStore.ghosts[trialStore.order.shift()];\n  try{localStorage.setItem(TRIAL_KEY,JSON.stringify(trialStore));trialSaved=true;}catch(error){trialSaved=false;}\n  trialGhost=trialStore.ghosts[trialKey]||null;\n }\n trialRecorder=car.lap+1<LAPS_TO_WIN?ghostCore.recorder(trialKey,car.model,car):null;\n return globalImproved||improved;\n}\nfunction recordTrialFrame(){if(trialRecorder&&!cars[0].done)trialRecorder.capture(currentLapTime(cars[0]),cars[0]);}\nfunction trialGhostPose(){\n if(raceFormat!=='trial'||!trialGhost||!ghostVisible)return null;\n const car=cars[0],lag=!paused&&!car.done&&renderPrevious.has(car)?SIMULATION_STEP-simulationAccumulator:0;\n return ghostCore.sample(trialGhost,Math.max(0,currentLapTime(car)-lag));\n}\nfunction drawTrialGhost(context){\n const pose=trialGhostPose();if(!pose)return;\n context.save();context.globalAlpha=.34;context.translate(pose.x,pose.y);context.rotate(pose.heading);\n drawCarBody(context,{...cars[0],...pose,color:'#39e8e8',braking:false,flash:0,offroad:0});context.restore();\n}\nfunction updateTrialFeedback(){\n if(raceFormat!=='trial')return;\n if($('ghostBtn')){$('ghostBtn').textContent=trialGhost?'FANTASMA: '+(ghostVisible?'ON':'OFF'):'FANTASMA: SIN VUELTA';$('ghostBtn').disabled=!trialGhost;}\n if(!cars[0].done&&countdownRemaining===0)$('status').textContent=trialGhost?'CONTRARRELOJ · FANTASMA '+format(trialGhost.duration):'CONTRARRELOJ · MARCÁ TU PRIMERA VUELTA';\n}\n",
  "let backgroundCache=null,backgroundCacheKey='',trackSurfaceCache=null,trackSurfaceKey='';\n"
 ],
 [
  "const selectedTrial=$('eventType')?.value==='trial';\n $('difficulty').disabled=selectedTrial;$('opponentCount').disabled=selectedTrial;\n const record=selectedTrial?trialStore.times[trialRecordKey(item,$('carModel').value,profile)]:bestLapRecords[lapRecordKey(item)];",
  "const record=bestLapRecords[lapRecordKey(item)];"
 ],
 [
  "if(selectedTrial){$('raceSummary').textContent='CONTRARRELOJ · 3 VUELTAS · SIN CPU · FANTASMA PERSONAL';$('opponentSummary').textContent='Récord propio por pista, coche y barreras. El fantasma no tiene colisión.';}\n $('soloStartLabel').textContent=selectedTrial?'CORRER CONTRARRELOJ':'CORRER VS '+count+' CPU';",
  "$('soloStartLabel').textContent='CORRER VS '+count+' CPU';"
 ],
 [
  "image.setAttribute('aria-label',car.name+', pintura '+paint.name);updateReadySelection();if($('eventType')?.value==='trial')updateMenuPreview();",
  "image.setAttribute('aria-label',car.name+', pintura '+paint.name);updateReadySelection();"
 ],
 [
  "raceFormat=['quick','trial'].includes($('eventType')?.value)?$('eventType').value:'championship';if(m!=='solo'&&raceFormat==='trial'){raceFormat='quick';selectEvent('quick');}",
  "raceFormat=$('eventType')?.value==='quick'?'quick':'championship';"
 ],
 [
  "if(mode==='solo'){const count=raceFormat==='trial'?0:clamp",
  "if(mode==='solo'){const count=clamp"
 ],
 [
  "countdownShown='';paused=false;running=true;keys=Object.create(null);beginTrial();",
  "countdownShown='';paused=false;running=true;keys=Object.create(null);"
 ],
 [
  "resolveCollisions(SIMULATION_STEP);updateGroundEffects(SIMULATION_STEP);recordTrialFrame();",
  "resolveCollisions(SIMULATION_STEP);updateGroundEffects(SIMULATION_STEP);"
 ],
 [
  "drawGroundEffects(ctx);drawTrialGhost(ctx);cars.map(renderedCar)",
  "drawGroundEffects(ctx);cars.map(renderedCar)"
 ],
 [
  "updateTrialFeedback();const best=raceFormat==='trial'?trialStore.times[trialKey]:bestLapRecords[lapRecordKey()];$('bestLapValue')",
  "const best=bestLapRecords[lapRecordKey()];$('bestLapValue')"
 ],
 [
  "result.classList.toggle('quick-event',raceFormat!=='championship');$('seasonCard')?.classList.toggle('hidden',raceFormat!=='championship');",
  "result.classList.toggle('quick-event',raceFormat==='quick');$('seasonCard')?.classList.toggle('hidden',raceFormat==='quick');"
 ],
 [
  "else if(raceFormat==='trial')$('resultTitle').textContent='CONTRARRELOJ COMPLETADO';\n else if(mode==='solo')$('resultTitle')",
  "else if(mode==='solo')$('resultTitle')"
 ],
 [
  "const bestLap=raceFormat==='trial'?trialStore.times[trialKey]:bestLapRecords[lapRecordKey()];",
  "const bestLap=bestLapRecords[lapRecordKey()];"
 ],
 [
  "(raceFormat==='trial'?'CONTRARRELOJ · '+CAR_MODELS[human.model].name+' · '+barrierMode.toUpperCase()+(trialSaved?' · GUARDADO LOCAL':' · SOLO ESTA SESIÓN: NO SE PUDO GUARDAR')+(trialGhost?' · FANTASMA DISPONIBLE':' · SIN FANTASMA (MÁX. 180 s)'):raceFormat==='quick'?'PARTIDA RÁPIDA · RESULTADO INDEPENDIENTE':",
  "(raceFormat==='quick'?'PARTIDA RÁPIDA · RESULTADO INDEPENDIENTE':"
 ],
 [
  "$('nextBtn').textContent=raceFormat==='trial'?'OTRO INTENTO ↻':raceFormat==='quick'?",
  "$('nextBtn').textContent=raceFormat==='quick'?"
 ],
 [
  "$('nextBtn').onclick=()=>raceFormat!=='championship'?",
  "$('nextBtn').onclick=()=>raceFormat==='quick'?"
 ],
 [
  "const quick=$('eventType')?.value==='quick',trial=$('eventType')?.value==='trial';",
  "const quick=$('eventType')?.value==='quick';"
 ],
 [
  "String(!quick&&!trial));$('timeTrialModeBtn')?.setAttribute('aria-pressed',String(trial));",
  "String(!quick));"
 ],
 [
  "$('quickModeBtn')?.addEventListener('click',()=>selectEvent('quick'));\n$('timeTrialModeBtn')?.addEventListener('click',()=>selectEvent('trial'));\n$('ghostBtn')?.addEventListener('click',()=>{ghostVisible=!ghostVisible;$('ghostBtn').setAttribute('aria-pressed',String(ghostVisible));updateTrialFeedback();});",
  "$('quickModeBtn')?.addEventListener('click',()=>selectEvent('quick'));"
 ],
 [
  "function showLocalSetup(open){if(open&&$('eventType')?.value==='trial')selectEvent('quick');$('localLobby')",
  "function showLocalSetup(open){$('localLobby')"
 ],
 [
  "$('resultTitle').focus({preventScroll:true});\n if($('trialLapList')){$('trialLapList').classList.toggle('hidden',raceFormat!=='trial');$('trialLapList').innerHTML=raceFormat==='trial'?human.lapTimes.map((time,i)=>'<li><span>VUELTA '+(i+1)+'</span><strong>'+format(time)+'</strong><small>'+(time===Math.min(...human.lapTimes)?'MEJOR DE LA TANDA':'VUELTA VÁLIDA')+'</small></li>').join(''):'';}",
  "$('resultTitle').focus({preventScroll:true});"
 ],
 [
  "$('finishSummary').textContent=raceFormat==='trial'?'MEJOR DE ESTA TANDA '+format(Math.min(...human.lapTimes))+' · '+human.lapTimes.length+' VUELTAS VÁLIDAS':mode==='solo'?",
  "$('finishSummary').textContent=mode==='solo'?"
 ],
 [
  "(bestLap?' · '+(raceFormat==='trial'?'RÉCORD PERSONAL ':'RÉCORD DE PISTA ')+format(bestLap):'')",
  "(bestLap?' · RÉCORD DE PISTA '+format(bestLap):'')"
 ]
];
export function withoutTimeTrial(source){
 source=withoutRallyDelivery(source);
 if(!source.includes("const ghostCore=PixelGhostLap.create()"))return source;
 for(const [current,previous] of [...edits].reverse()){if(!source.includes(current))throw Error("Time trial migration anchor changed: "+current.slice(0,70));source=source.replace(current,previous);}
 return source;
}
