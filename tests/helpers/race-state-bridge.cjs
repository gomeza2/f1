// Test-only compatibility for probes written before state ownership moved into a session.
// Production HTML never installs these aliases; every probe still reads/writes the real session.
module.exports=`if(typeof raceState!=='undefined'){
 for(const [name,key] of Object.entries({cars:'cars',elapsed:'elapsed',running:'running',paused:'paused',countdownRemaining:'countdownRemaining',goFlashRemaining:'goFlashRemaining',simulationAccumulator:'accumulator'}))Object.defineProperty(globalThis,name,{configurable:true,get(){return raceState[key]},set(value){raceState[key]=value;}});
}\n`;
