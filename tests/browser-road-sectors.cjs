// Optional Playwright/Chromium: inspect actual Canvas pixels, not mocked draw calls.
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'script.js'),'utf8');
const bridge=`window.roadTest={inspect(stageIndex,profile){$('barrierMode').value=profile;start('solo',stageIndex);cancelAnimationFrame(raf);countdownRemaining=0;cameraMode='overview';drawFrame();const sc=trackSurfaceCache.getContext('2d'),image=sc.getImageData(0,0,track.worldWidth,track.worldHeight);let checked=0,kerbs=0,errors=[];const pixel=(x,y)=>{const i=(Math.round(y)*image.width+Math.round(x))*4;return Array.from(image.data.slice(i,i+4))};for(let d=20;d<track.length;d+=25){const p=sampleAt(d),section=roadSectionAt(d),width=roadHalfWidthAt(d);for(const side of [-1,1]){for(const delta of [-3,3]){const offset=(width+delta)*side,x=p.x-Math.sin(p.angle)*offset,y=p.y+Math.cos(p.angle)*offset,loc=nearestOnTrack(x,y),gap=Math.abs(loc.progress-d);if(Math.min(gap,track.length-gap)>5)continue;const material=terrainAt(x,y,loc),rgba=pixel(x,y);if(material.offroad!==(delta>0)||(delta<0?rgba[3]<200:rgba[3]>10))errors.push({d,side,delta,width,rgba,material});checked++;}if(section.kerb>4){const offset=(section.halfWidth+section.kerb/2)*side,x=p.x-Math.sin(p.angle)*offset,y=p.y+Math.cos(p.angle)*offset,loc=nearestOnTrack(x,y),actual=roadSectionAt(loc.progress);if(loc.distance<actual.halfWidth+1.5||loc.distance>actual.halfWidth+actual.kerb-1.5)continue;const rgba=pixel(x,y);if(!(rgba[0]>150&&rgba[0]>rgba[2]*1.25||rgba[0]>200&&rgba[1]>180))errors.push({d,side,kerbPixel:rgba});kerbs++;}}}return {name:track.name,checked,kerbs,errors:errors.slice(0,8),barriers:physicalBarriers.length}},close(phase){cameraMode='near';const car=cars[0];placeCar(car,track.length*phase,0);drawFrame()}};`;
const server=http.createServer((req,res)=>{const file=req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0].slice(1);if(!['index.html','style.css','engine-audio.js','script.js'].includes(file)){res.writeHead(404).end();return}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(path.join(root,file)))});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route(/\/script\.js(?:\?.*)?$/,r=>r.fulfill({contentType:'text/javascript',body:source.replace(/\}\)\(\);\s*$/,bridge+'})();')}));
  await page.goto('http://127.0.0.1:'+server.address().port);
  if(process.env.ROAD_SCREENSHOTS)fs.mkdirSync(process.env.ROAD_SCREENSHOTS,{recursive:true});
  let probes=0;
  for(const stage of [0,1,2])for(const profile of ['open','full','half','corners','auto']){
   const result=await page.evaluate(([stage,profile])=>window.roadTest.inspect(stage,profile),[stage,profile]);
   assert.deepEqual(result.errors,[],JSON.stringify(result));assert.ok(result.checked>150);probes+=result.checked;
   if(stage!==2)assert.ok(result.kerbs>0);if(profile==='open')assert.equal(result.barriers,0);
   if(process.env.ROAD_SCREENSHOTS&&['open','full'].includes(profile))await page.screenshot({path:path.join(process.env.ROAD_SCREENSHOTS,`track-${stage}-${profile}.png`)});
   if(profile==='open'&&process.env.ROAD_SCREENSHOTS){for(const phase of [.12,.70]){await page.evaluate(phase=>window.roadTest.close(phase),phase);await page.screenshot({path:path.join(process.env.ROAD_SCREENSHOTS,`track-${stage}-close-${phase}.png`)});}}
  }
  assert.deepEqual(errors,[]);console.log(`PASS: Chromium actual Canvas pixels at ${probes} edge/material probes across three tracks/five barrier profiles; optional red/white kerbs, transparent off-road, no open-profile walls and no JavaScript errors. Rendering tolerance: three world units; fun and human balance remain unverified.`);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
