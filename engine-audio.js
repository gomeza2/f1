/* Original procedural engine synthesis. No samples or external assets. */
(function(root){
 'use strict';
 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 const ratios=[3.2,2.3,1.75,1.4,1.15,.95];
 const profiles={
  balanced:{idle:1500,redline:10500,cylinders:6,body:.3,brightness:1},
  corner:{idle:1700,redline:11200,cylinders:4,body:.22,brightness:1.12},
  speed:{idle:1800,redline:12500,cylinders:8,body:.24,brightness:1.2},
  rally:{idle:1200,redline:8500,cylinders:4,body:.48,brightness:.8}
 };
 // A decaying combustion pulse, with limited upper harmonics instead of a raw saw/square.
 function pulseCoefficients(){
  const real=new Float32Array(17),imag=new Float32Array(17);
  for(let n=1;n<real.length;n++){
   const amplitude=Math.exp(-n*.32)/Math.pow(n,.9),phase=-Math.atan(n*.45);
   real[n]=amplitude*Math.cos(phase);imag[n]=amplitude*Math.sin(phase);
  }
  return {real,imag};
 }
 function create(context,output){
  const engine=context.createOscillator(),sub=context.createOscillator(),filter=context.createBiquadFilter(),gain=context.createGain(),subGain=context.createGain();
  const coefficients=pulseCoefficients();engine.setPeriodicWave(context.createPeriodicWave(coefficients.real,coefficients.imag));
  sub.type='sine';filter.type='lowpass';filter.Q.value=.55;gain.gain.value=0;subGain.gain.value=0;
  engine.connect(filter);filter.connect(gain);gain.connect(output);sub.connect(subGain);subGain.connect(output);engine.start();sub.start();
  const state={gear:0,rpm:1500,load:0,lastTime:null,shiftAt:-Infinity,model:null};
  function reset(){state.gear=0;state.rpm=1500;state.load=0;state.lastTime=null;state.shiftAt=-Infinity;state.model=null;}
  function update({speed=0,maxSpeed=232,model='balanced',throttle=0,braking=false,audible=false,mix=1}){
   const now=context.currentTime,p=profiles[model]||profiles.balanced;
   if(state.model!==model){reset();state.model=model;state.rpm=p.idle;}
   const dt=state.lastTime===null?0:clamp(now-state.lastTime,0,.1);state.lastTime=now;
   const ratio=clamp(Math.abs(speed)/Math.max(1,maxSpeed),0,1.15);
   // No revving/gear advance while paused, counting down or in the menu.
   if(!audible){gain.gain.setTargetAtTime(0,now,.02);subGain.gain.setTargetAtTime(0,now,.02);return;}
   const targetLoad=braking?0:clamp(throttle,0,1);state.load+=(targetLoad-state.load)*(1-Math.exp(-dt*12));
   const wheelRPM=ratio*(p.redline-p.idle)/ratios[ratios.length-1];
   let coupled=p.idle+wheelRPM*ratios[state.gear];
   if(now-state.shiftAt>.24){
    if(coupled>p.redline*.94&&state.gear<ratios.length-1){state.gear++;state.shiftAt=now;}
    else if(coupled<p.redline*.46&&state.gear>0){state.gear--;state.shiftAt=now;}
    coupled=p.idle+wheelRPM*ratios[state.gear];
   }
   // Clutch slip at launch; gear changes affect pitch only, never vehicle performance.
   const launch=state.load*1100*Math.max(0,1-ratio/.2);
   const targetRPM=clamp(coupled+launch,p.idle,p.redline*1.025);
   state.rpm+=(targetRPM-state.rpm)*(1-Math.exp(-dt*18));
   const cut=now-state.shiftAt<.075?.58:1;
   // Roll off the sustained top-end instead of adding a rev-limiter crackle.
   const topEnd=clamp((ratio-.78)/.22,0,1);
   const level=(.035+state.load*.033+ratio*.012)*(1-topEnd*.12)*clamp(mix,0,1)*cut;
   engine.frequency.setTargetAtTime(state.rpm/60*p.cylinders/4,now,.025);
   sub.frequency.setTargetAtTime(state.rpm/60,now,.035);
   filter.frequency.setTargetAtTime((380+state.rpm*.055+state.load*650)*(1-topEnd*.25)*p.brightness,now,.045);
   gain.gain.setTargetAtTime(level,now,.025);subGain.gain.setTargetAtTime(level*p.body,now,.035);
  }
  return {engine,sub,filter,gain,subGain,state,update,reset};
 }
 root.PixelEngineAudio=Object.freeze({create,profiles,pulseCoefficients});
})(window);
