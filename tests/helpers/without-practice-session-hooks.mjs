// Normalize declared practice UI/session hooks and the online retired-car draw filter
// only when reconstructing historic offline adapters. Never loaded by the game.
const wrapper=`function advanceRaceFrame(frameTime){
 if(raceFormat!=='practice')return raceSession.advanceFrame(frameTime);
 // Yield between canonical steps when a sector gate closes the attempt.
 if(!Number.isFinite(frameTime)||frameTime<=0)return 0;
 let left=Math.min(frameTime,SIMULATION_STEP*MAX_SIMULATION_STEPS),steps=0;
 for(let i=0;i<MAX_SIMULATION_STEPS&&left>1e-9&&!practice?.complete;i++){const dt=Math.min(left,SIMULATION_STEP);steps+=raceSession.advanceFrame(dt);left-=dt;}return steps;
}`;
export function withoutPracticeSessionHooks(source){
 if(!source.includes('function setupPractice()'))return source;
 if(!source.includes(wrapper))throw Error('Practice frame wrapper changed beyond its declared migration');
 return source.replace(wrapper,'function advanceRaceFrame(frameTime){return raceSession.advanceFrame(frameTime);}')
 .replace('updateGroundEffects(dt);recordTrialFrame();updatePractice(dt);','updateGroundEffects(dt);recordTrialFrame();')
 .replace('onEvent:(event,car)=>{practiceEvent(event,car);','onEvent:(event,car)=>{')
 .replace('if(!raceState.running||practice?.complete)return;','if(!raceState.running)return;')
 .replace("['trial','practice'].includes(raceFormat)?0:","raceFormat==='trial'?0:")
 .replace("['quick','trial','practice'].includes($('eventType')?.value)","['quick','trial'].includes($('eventType')?.value)")
 .replace("m!=='solo'&&['trial','practice'].includes(raceFormat)","m!=='solo'&&raceFormat==='trial'")
 .replace("open&&['trial','practice'].includes($('eventType')?.value)","open&&$('eventType')?.value==='trial'")
 .replace(",selectedPractice=$('eventType')?.value==='practice'",'')
 .replaceAll('selectedTrial||selectedPractice','selectedTrial')
 .replace(/^ if\(selectedPractice\).*?\n/m,'')
 .replace("selectedPractice?'PRACTICAR CURVAS':",'')
 .replace(",training=$('eventType')?.value==='practice'",'')
 .replace(/^ \$\('practiceModeBtn'\)\?\.setAttribute.*?\n/m,'')
 .replace('!quick&&!trial&&!training','!quick&&!trial')
 .replace(/^\$\('practiceModeBtn'\)\?\.addEventListener.*?\n/m,'')
 .replace(" if(raceFormat==='practice')return false;\n",'')
 .replace('raceState.cars.filter(car=>!car.retired).map(renderedCar)','raceState.cars.map(renderedCar)');
}
