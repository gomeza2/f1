// Optional: requires Playwright and Chromium in the development environment.
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'script.js'),'utf8');
const bridge=`window.testGame={checkLapClock(){cancelAnimationFrame(raf);elapsed=42;cars[0].lapStartTime=30;updateTelemetry();const current=$('timer').textContent;cars[0].lapStartTime=elapsed;updateTelemetry();const reset=$('timer').textContent;cars[0].lapTimes.push(29.3);cars[0].done=true;elapsed+=5;updateTelemetry();return {current,reset,finished:$('timer').textContent}},get cars(){return cars},get elapsed(){return elapsed},get paused(){return paused},get countdown(){return countdownRemaining},get running(){return running},get camera(){return raceCamera()},get overview(){return overviewZoom()},get split(){return usesSplitScreen()},get world(){return {width:track.worldWidth,height:track.worldHeight}},separateViews(){placeCar(cars[1],track.length/2,0);drawFrame();updateTelemetry();return Math.hypot(raceCamera(0).x-raceCamera(1).x,raceCamera(0).y-raceCamera(1).y)},get buffers(){return {backgroundWidth:backgroundCache?.width,surfaceWidth:trackSurfaceCache?.width}},skipCountdown(){countdownRemaining=0},simulateRace(){cancelAnimationFrame(raf);cars[0].done=true;for(let i=0;i<9000&&!cars[1].done;i++){elapsed+=1/30;physics(cars[1],1,1/30)}drawFrame();updateTelemetry();return {lap:cars[1].lap,time:cars[1].finishTime}},trafficScenario(){cancelAnimationFrame(raf);placeCar(cars[0],170,0);placeCar(cars[1],110,0);cars[1].speed=90;let minDistance=Infinity;for(let i=0;i<900&&cars[1].progress<210;i++){elapsed+=1/60;physics(cars[1],1,1/60);minDistance=Math.min(minDistance,Math.hypot(cars[0].x-cars[1].x,cars[0].y-cars[1].y))}drawFrame();return {passed:cars[1].progress>=210,minDistance}},finishRace};`;
const server=http.createServer((req,res)=>{
 const name=req.url==='/'?'index.html':req.url.slice(1);
 if(!['index.html','style.css','script.js'].includes(name)){res.writeHead(404).end();return}
 res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');
 res.end(fs.readFileSync(path.join(root,name)));
});
(async()=>{
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('https://fonts.googleapis.com/**',route=>route.abort());
  await page.route('**/script.js',route=>route.fulfill({contentType:'text/javascript',body:source.replace(/\}\)\(\);\s*$/,bridge+'})();')}));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  // Disable decorative hover motion so click stability does not depend on frame timing.
  await page.addStyleTag({content:'button{transition:none!important}button:hover{transform:none!important}'});
  assert.equal(await page.locator('#stageSelect option').count(),14);
  await page.click('[data-mode="solo"]');
  async function checkRaceLayout(){
   const layout=await page.evaluate(()=>{
    const a=$('#canvas1'),b=$('.telemetry-strip');
    function $(selector){return document.querySelector(selector).getBoundingClientRect()}
    return {width:a.width,height:a.height,top:a.top,bottom:a.bottom,telemetryTop:b.top,
     scrollHeight:document.documentElement.scrollHeight,viewport:innerHeight,scrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth};
   });
   assert.ok(Math.abs(layout.width/layout.height-1000/640)<.02,'Canvas aspect ratio changed');
   assert.ok(layout.telemetryTop>=layout.bottom,'Telemetry covers driving canvas');
   assert.ok(layout.scrollHeight<=layout.viewport+1,'Race requires vertical scrolling');
   assert.ok(layout.scrollWidth<=layout.viewportWidth+1,'Race requires horizontal scrolling');
   assert.ok(layout.height>0 && layout.top>=0 && layout.bottom<=layout.viewport,'Canvas leaves viewport');
   return layout;
  }
  await checkRaceLayout();
  assert.equal(await page.locator('.telemetry-chip').count(),3);
  assert.equal(await page.locator('#targetSpeedChip,#sectorChip,#surfaceValue,#driftValue').count(),0);
  assert.match(await page.locator('.raceinfo').textContent(),/TIEMPO DE VUELTA/);
  const clock=await page.evaluate(()=>window.testGame.checkLapClock());
  assert.deepEqual(clock,{current:'00:12.0',reset:'00:00.0',finished:'00:29.3'});
  await page.keyboard.press('r');
  assert.ok(await page.evaluate(()=>window.testGame.countdown>0));
  assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),1.35);
  await page.click('#cameraBtn');assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),await page.evaluate(()=>window.testGame.overview));
  await page.keyboard.press('c');assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),1.35);
  await page.evaluate(()=>window.testGame.skipCountdown());
  await page.keyboard.down('w');await page.waitForTimeout(500);await page.keyboard.up('w');
  assert.ok(await page.evaluate(()=>window.testGame.cars[0].speed>0));
  await page.keyboard.down('d');await page.waitForTimeout(180);await page.keyboard.up('d');
  const turn=await page.evaluate(()=>({yaw:window.testGame.cars[0].yawRate,heading:window.testGame.cars[0].heading}));assert.ok(turn.yaw>0);
  await page.waitForTimeout(400);
  const release=await page.evaluate(()=>({yaw:window.testGame.cars[0].yawRate,heading:window.testGame.cars[0].heading}));
  assert.ok(Math.abs(release.yaw)<Math.abs(turn.yaw),'Keyboard release did not damp rotation');
  assert.ok(Math.atan2(Math.sin(release.heading-turn.heading),Math.cos(release.heading-turn.heading))>0,'Yaw stopped instantaneously');
  await page.keyboard.down('a');await page.waitForTimeout(180);await page.keyboard.up('a');
  assert.ok(await page.evaluate(()=>window.testGame.cars[0].yawRate<0),'Keyboard countersteer failed');
  await page.click('#pauseBtn');assert.ok(await page.evaluate(()=>window.testGame.paused));
  const pausedTime=await page.evaluate(()=>window.testGame.elapsed);
  await page.setViewportSize({width:1920,height:1080});await page.waitForTimeout(100);
  await checkRaceLayout();
  const wide=await page.locator('.shell').boundingBox();assert.ok(wide.width>1300 && wide.width<=1600,'Race width did not expand');
  await page.setViewportSize({width:1440,height:1000});await page.waitForTimeout(100);
  await checkRaceLayout();
  assert.equal(await page.evaluate(()=>window.testGame.elapsed),pausedTime);
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.testGame.paused),false);
  await page.keyboard.press('r');assert.ok(await page.evaluate(()=>window.testGame.countdown>0));
  await page.click('#fullscreenBtn');await page.waitForTimeout(100);
  assert.ok(await page.evaluate(()=>!!document.fullscreenElement));
  await checkRaceLayout();
  const layout=await page.evaluate(()=>{
   const a=document.querySelector('#canvas1').getBoundingClientRect(),b=document.querySelector('.telemetry-strip').getBoundingClientRect();
   return {width:a.width,height:a.height,telemetryTop:b.top,canvasBottom:a.bottom};
  });
  assert.ok(Math.abs(layout.width/layout.height-1000/640)<.02,'Canvas aspect ratio changed');
  assert.ok(layout.telemetryTop>=layout.canvasBottom,'Telemetry covers the driving canvas');
  await page.click('#fullscreenBtn');
  await page.click('#backBtn');
  assert.equal(await page.evaluate(()=>document.body.classList.contains('racing')),false);
  for(let stage=0;stage<14;stage++){
   await page.selectOption('#stageSelect',String(stage));await page.click('[data-mode="solo"]');
   assert.ok((await page.locator('#trackName').textContent()).length>0);
   const buffers=await page.evaluate(()=>({world:window.testGame.world,buffers:window.testGame.buffers}));
   assert.equal(buffers.world.width,buffers.buffers.backgroundWidth);assert.equal(buffers.world.width,buffers.buffers.surfaceWidth);
   await page.click('#backBtn');
  }
  await page.selectOption('#stageSelect','0');await page.click('[data-mode="solo"]');
  const traffic=await page.evaluate(()=>window.testGame.trafficScenario());assert.ok(traffic.passed);assert.ok(traffic.minDistance>=23);
  await page.click('#backBtn');
  await page.selectOption('#stageSelect','2');await page.click('[data-mode="solo"]');
  const dustyRace=await page.evaluate(()=>window.testGame.simulateRace());assert.equal(dustyRace.lap,3);
  assert.ok(dustyRace.time/3<28.91*.8,'Dusty Mesa CPU did not improve over 0.24');
  await page.click('#backBtn');
  await page.selectOption('#stageSelect','4');await page.click('[data-mode="solo"]');
  const race=await page.evaluate(()=>window.testGame.simulateRace());assert.equal(race.lap,3);
  await page.evaluate(()=>window.testGame.finishRace());assert.ok(await page.locator('#result').isVisible());
  assert.equal(await page.evaluate(()=>document.body.classList.contains('racing')),false);
  await page.click('#nextBtn');assert.equal(await page.locator('#trackName').textContent(),'JUNGLE SPRINT');
  await page.click('#backBtn');await page.click('[data-mode="duo"]');
  assert.equal(await page.evaluate(()=>window.testGame.cars.some(c=>c.isAI)),false);
  assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),1.1);assert.equal(await page.evaluate(()=>window.testGame.split),true);
  assert.ok(await page.locator('#cameraBtn').isDisabled());
  await page.evaluate(()=>window.testGame.skipCountdown());
  await page.keyboard.down('ArrowUp');await page.waitForTimeout(300);await page.keyboard.up('ArrowUp');
  assert.ok(await page.evaluate(()=>window.testGame.cars[1].speed>0));
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(100);
  await checkRaceLayout();
  assert.ok(await page.locator('#canvas1').isVisible());
  assert.ok(await page.locator('#miniMap').isVisible());
  await page.setViewportSize({width:844,height:390});await page.waitForTimeout(100);
  await checkRaceLayout();
  assert.ok(await page.locator('#canvas1').isVisible());
  assert.ok(await page.locator('#miniMap').isVisible());
  await page.click('#fullscreenBtn');await page.waitForTimeout(100);
  await checkRaceLayout();
  const mobile=await page.locator('#canvas1').boundingBox();assert.ok(mobile.height>=150,'Landscape fullscreen leaves too little driving space');
  await page.click('#fullscreenBtn');
  await page.setViewportSize({width:1440,height:1000});
  await page.click('#backBtn');await page.selectOption('#stageSelect','2');await page.click('[data-mode="solo"]');await page.evaluate(()=>window.testGame.skipCountdown());
  await page.click('#cameraBtn');assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),await page.evaluate(()=>window.testGame.overview));
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH,fullPage:true});
  await page.click('#backBtn');await page.click('[data-mode="duo"]');await page.evaluate(()=>window.testGame.skipCountdown());
  assert.equal(await page.evaluate(()=>window.testGame.split),true);
  assert.ok(await page.evaluate(()=>window.testGame.separateViews()>50));
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-duo.png'),fullPage:true});
  for(const graphics of ['retro','lite']){await page.click('#backBtn');await page.selectOption('#graphics',graphics);await page.click('[data-mode="solo"]');assert.ok(await page.locator('#canvas1').isVisible());}
  assert.deepEqual(errors,[]);
  console.log('PASS: Chromium, input/yaw/release/countersteer, countdown, pause/resume, restart, menu, 14 tracks, fullscreen/aspect/compact HUD/lap clock/no scrolling, world-sized caches, split/close/overview cameras, mobile map and landscape space, traffic overtake, Dusty Mesa pace/race, ice CPU race/results/next stage, local two-player and viewport resizing.');
  console.log('Mobile checks cover visibility only; human handling, touch controls, audio and performance remain unverified.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>server.close());
