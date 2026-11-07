/* Original procedural engine synthesis. No samples or external assets. */
(function(root){
 'use strict';
 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 const ratios=[3.2,2.3,1.75,1.4,1.15,.95];
 const TIMBRE_PITCH=.5;
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
   const amplitude=Math.exp(-n*.38)/Math.pow(n,.75),phase=-Math.atan(n*.65);
   real[n]=amplitude*Math.cos(phase);imag[n]=amplitude*Math.sin(phase);
  }
  return {real,imag};
 }
 // Distinct road textures, driven only by real ground and motion. Reuse one noise loop.
 const surfaces={asphalt:{hz:260,q:.5,roll:.004,skid:1550,squeal:1},dirt:{hz:520,q:.65,roll:.014,skid:700,squeal:.55},grass:{hz:340,q:.45,roll:.019,skid:480,squeal:.35},ice:{hz:1600,q:1.8,roll:.003,skid:950,squeal:.6},gravel:{hz:850,q:.8,roll:.025,skid:1100,squeal:.65},volcanic:{hz:440,q:.7,roll:.016,skid:600,squeal:.5}};
 function surfaceState(material,speed,slip,maxSpeed=232){
  const p=surfaces[material]||surfaces.asphalt,r=clamp(Math.abs(speed)/maxSpeed,0,1);
  return {frequency:p.hz*(.7+r*.6),q:p.q,roll:p.roll*r,rate:.65+r*.7,skidFrequency:p.skid,skid:Math.abs(speed)>35?Math.min(.025,clamp(slip,0,1)*r*.035)*p.squeal:0};
 }
 const ambiences={park:[650,.45,.0035,.22],harbor:[240,.7,.006,.18],desert:[430,.45,.004,.13],night:[150,.8,.003,.3],snow:[1100,.45,.004,.16],jungle:[1900,2,.003,.42],volcano:[95,.7,.006,.17],city:[210,.9,.004,.26],valley:[780,.5,.004,.21],stadium:[950,.6,.004,.36],coast:[350,.6,.006,.19],canyon:[500,.8,.004,.14],meadow:[1250,.6,.003,.32],industrial:[120,2,.004,.28]};
 function createNoise(context,output,buffer,type='bandpass'){
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
  source.buffer=buffer;source.loop=true;filter.type=type;gain.gain.value=0;source.connect(filter);filter.connect(gain);gain.connect(output);source.start();
  return {source,filter,gain};
 }
 function create(context,output){
  const engine=context.createOscillator(),sub=context.createOscillator(),filter=context.createBiquadFilter(),gain=context.createGain(),subGain=context.createGain();
  const coefficients=pulseCoefficients();engine.setPeriodicWave(context.createPeriodicWave(coefficients.real,coefficients.imag));
  sub.type='triangle';filter.type='lowpass';filter.Q.value=.55;gain.gain.value=0;subGain.gain.value=0;
  engine.connect(filter);filter.connect(gain);gain.connect(output);sub.connect(subGain);subGain.connect(output);engine.start();sub.start();
  const state={gear:0,rpm:1500,load:0,lastTime:null,shiftAt:-Infinity,model:null,lastRatio:null,cruise:0,acceleration:0};
  function reset(){state.gear=0;state.rpm=1500;state.load=0;state.lastTime=null;state.shiftAt=-Infinity;state.model=null;state.lastRatio=null;state.cruise=0;state.acceleration=0;}
  function update({speed=0,maxSpeed=232,model='balanced',throttle=0,braking=false,audible=false,mix=1}){
   const now=context.currentTime,p=profiles[model]||profiles.balanced;
   if(state.model!==model){reset();state.model=model;state.rpm=p.idle;}
   const dt=state.lastTime===null?0:clamp(now-state.lastTime,0,.1);state.lastTime=now;
   const ratio=clamp(Math.abs(speed)/Math.max(1,maxSpeed),0,1.15);
   // No revving/gear advance while paused, counting down or in the menu.
   if(!audible){state.lastRatio=null;gain.gain.setTargetAtTime(0,now,.02);subGain.gain.setTargetAtTime(0,now,.02);return;}
   // A sustained cap is a different load from still accelerating; ease its upper harmonics.
   const acceleration=dt>0&&state.lastRatio!==null?(ratio-state.lastRatio)/dt:0;
   // Audio may update more often than 60 Hz physics: smooth held/interleaved samples.
   state.acceleration+=(acceleration-state.acceleration)*(1-Math.exp(-dt*8));
   const cruising=ratio>.78&&throttle>.2&&!braking&&Math.abs(state.acceleration)<.025;
   state.cruise+=((cruising?1:0)-state.cruise)*(1-Math.exp(-dt*(cruising?2.5:7)));
   state.lastRatio=ratio;
   const targetLoad=clamp(throttle,0,1)*(braking?.15:1);state.load+=(targetLoad-state.load)*(1-Math.exp(-dt*12));
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
   const overrun=(1-state.load)*ratio;
   const level=(.035+state.load*.033+ratio*.012+overrun*.006)*(1-topEnd*.12)*(1-state.cruise*.12)*clamp(mix,0,1)*cut;
   // A coherent pair of octaves gives body without the old high, separate shaft tone.
   const firingFrequency=state.rpm/60*p.cylinders/4*TIMBRE_PITCH;
   engine.frequency.setTargetAtTime(firingFrequency,now,.025);
   sub.frequency.setTargetAtTime(firingFrequency*.5,now,.035);
   filter.frequency.setTargetAtTime((380+state.rpm*.055+state.load*650+overrun*120)*(1-topEnd*.25)*(1-state.cruise*.25)*p.brightness,now,.045);
   gain.gain.setTargetAtTime(level,now,.025);subGain.gain.setTargetAtTime(level*p.body*1.25,now,.035);
  }
  return {engine,sub,filter,gain,subGain,state,update,reset};
 }
 root.PixelEngineAudio=Object.freeze({create,profiles,pulseCoefficients,surfaceState,ambiences,createNoise});
})(window);
