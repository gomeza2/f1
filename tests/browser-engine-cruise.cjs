// Optional Playwright/Chromium. Offline Web Audio compares sustained cruise, not just launch.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'../engine-audio.js'),'utf8'),gameSource=fs.readFileSync(path.join(__dirname,'../script.js'),'utf8');
const models=new Function(gameSource.slice(gameSource.indexOf('const CAR_MODELS='),gameSource.indexOf('const CAR_PAINTS='))+'return CAR_MODELS;')();
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage();await page.setContent('<title>Engine cruise verification</title>');
  const versions=process.env.ENGINE_AUDIO_BASELINE?{before:fs.readFileSync(process.env.ENGINE_AUDIO_BASELINE,'utf8'),current:source}:{current:source};
  const measurements={};
  for(const [version,library] of Object.entries(versions)){
   await page.addScriptTag({content:library});measurements[version]={};
   for(const model of ['balanced','corner','speed','rally']){
    const result=await page.evaluate(async ({model,maxSpeed})=>{
     const context=new OfflineAudioContext(2,24000*6,24000),output=context.createGain(),high=context.createBiquadFilter(),merger=context.createChannelMerger(2);
     output.gain.value=.55;high.type='highpass';high.frequency.value=3000;high.Q.value=Math.SQRT1_2;
     output.connect(merger,0,0);output.connect(high);high.connect(merger,0,1);merger.connect(context.destination);
     const voice=window.PixelEngineAudio.create(context,output),gears=[];
     const updates=[];for(let frame=0;frame<180;frame++)updates.push(context.suspend(frame/30).then(()=>{voice.update({speed:maxSpeed,maxSpeed,model,throttle:1,audible:true});if(frame>120)gears.push(voice.state.gear);return context.resume()}));
     const rendered=await context.startRendering();await Promise.all(updates);
     const values=rendered.getChannelData(0),highs=rendered.getChannelData(1);let sum=0,highSum=0,peak=0;
     for(let i=24000*4;i<values.length;i++){sum+=values[i]**2;highSum+=highs[i]**2;peak=Math.max(peak,Math.abs(values[i]));}
     return {rms:Math.sqrt(sum/(24000*2)),highRatio:highSum/sum,peak,gear:voice.state.gear,gearChangesAtCruise:new Set(gears).size-1,rpm:voice.state.rpm};
    },{model,maxSpeed:models[model].maxSpeed});
    assert.ok(result.rms>1e-4&&result.peak<.95);assert.equal(result.gear,5);assert.equal(result.gearChangesAtCruise,0);
    if(version==='current')assert.ok(result.highRatio<.02,'Excessive sustained high-band energy: '+JSON.stringify({model,...result}));
    measurements[version][model]=result;
   }
  }
  if(measurements.before)for(const model of Object.keys(measurements.current))assert.ok(measurements.current[model].highRatio<measurements.before[model].highRatio*.25,model+': top-end band did not soften');
  console.log(JSON.stringify(measurements));console.log('PASS: six-second full-throttle render at actual maximum speeds for four models, steady sixth gear, finite audible unclipped output and reduced high-frequency energy. Filtered-band energy is not perceived sound quality; human listening remains required.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
