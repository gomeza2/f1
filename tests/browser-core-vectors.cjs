// Same standalone production module and serialized states in Node and Chromium.
const {chromium}=require('playwright'),path=require('node:path'),assert=require('node:assert/strict'),api=require('../driving-core.js');
function vectors(library){
 const engine=library.create(),out={};
 for(const model of Object.keys(engine.rules.models))for(const material of Object.keys(engine.rules.materials)){
  const s=engine.createState(model),states=[];
  for(let n=0;n<260;n++){
   const input=n<50?{throttle:0,brake:1,steering:0,hand:false}:n<110?{throttle:1,brake:0,steering:0,hand:false}:n<170?{throttle:1,brake:0,steering:.7,hand:true}:n<200?{throttle:.3,brake:.2,steering:-.4,hand:false}:{throttle:0,brake:0,steering:0,hand:false};
   const command=engine.humanControls(s,input,1/60);engine.stepVehicle(s,command,engine.rules.models[model],material,100,1/60);
   if([49,109,169,199,259].includes(n))states.push({...s});
  }
  out[model+':'+material]=states;
 }
 return JSON.parse(JSON.stringify(out));
}
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent('<title>Shared driving vectors</title>');await page.addScriptTag({path:path.resolve(__dirname,'../driving-core.js')});const actual=await page.evaluate('('+vectors.toString()+')(PixelDrivingCore)'),expected=vectors(api);let maxError=0;const transcendental=new Set(['x','y','heading','yawRate','steer','drift']);assert.deepEqual(Object.keys(actual),Object.keys(expected));for(const key of Object.keys(expected))for(let i=0;i<5;i++)for(const field of Object.keys(expected[key][i])){const a=actual[key][i][field],b=expected[key][i][field];if(transcendental.has(field)){assert.ok(Number.isFinite(a)&&Number.isFinite(b));maxError=Math.max(maxError,Math.abs(a-b));assert.ok(Math.abs(a-b)<=1e-10,key+'/'+i+'/'+field+': cross-runtime numeric drift');}else assert.equal(a,b,key+'/'+i+'/'+field);}assert.equal(Object.keys(actual).length,28);console.log(JSON.stringify({maxCrossRuntimeError:maxError,tolerance:1e-10}));assert.deepEqual(errors,[]);console.log('PASS: 28 standalone Node/Chromium model/material vectors, 140 motion snapshots, exact speed/timers/flags and angular/position roundoff <=1e-10 through reverse, forward, handbrake, countersteer, partial pedals and release. No DOM adapter or server simulation is used.');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
