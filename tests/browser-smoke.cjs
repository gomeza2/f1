// Optional: requires Playwright and Chromium in the development environment.
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'script.js'),'utf8');
const bridge=`window.testGame={get cars(){return cars},get elapsed(){return elapsed},get paused(){return paused},get countdown(){return countdownRemaining},get running(){return running},get camera(){return raceCamera()},skipCountdown(){countdownRemaining=0},simulateRace(){cancelAnimationFrame(raf);cars[0].done=true;for(let i=0;i<9000&&!cars[1].done;i++){elapsed+=1/30;physics(cars[1],1,1/30)}drawFrame();updateTelemetry();return {lap:cars[1].lap,time:cars[1].finishTime}},trafficScenario(){cancelAnimationFrame(raf);placeCar(cars[0],170,0);placeCar(cars[1],110,0);cars[1].speed=90;let minDistance=Infinity;for(let i=0;i<900&&cars[1].progress<210;i++){elapsed+=1/60;physics(cars[1],1,1/60);minDistance=Math.min(minDistance,Math.hypot(cars[0].x-cars[1].x,cars[0].y-cars[1].y))}drawFrame();return {passed:cars[1].progress>=210,minDistance}},finishRace};`;
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
  assert.ok(await page.evaluate(()=>window.testGame.countdown>0));
  assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),1.35);
  await page.click('#cameraBtn');assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),1);
  await page.keyboard.press('c');assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),1.35);
  await page.evaluate(()=>window.testGame.skipCountdown());
  await page.keyboard.down('w');await page.waitForTimeout(500);await page.keyboard.up('w');
  assert.ok(await page.evaluate(()=>window.testGame.cars[0].speed>0));
  await page.click('#pauseBtn');assert.ok(await page.evaluate(()=>window.testGame.paused));
  const pausedTime=await page.evaluate(()=>window.testGame.elapsed);await page.waitForTimeout(100);
  assert.equal(await page.evaluate(()=>window.testGame.elapsed),pausedTime);
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.testGame.paused),false);
  await page.keyboard.press('r');assert.ok(await page.evaluate(()=>window.testGame.countdown>0));
  await page.click('#fullscreenBtn');await page.waitForTimeout(100);
  assert.ok(await page.evaluate(()=>!!document.fullscreenElement));
  const layout=await page.evaluate(()=>{
   const a=document.querySelector('#canvas1').getBoundingClientRect(),b=document.querySelector('.telemetry-strip').getBoundingClientRect();
   return {width:a.width,height:a.height,telemetryTop:b.top,canvasBottom:a.bottom};
  });
  assert.ok(Math.abs(layout.width/layout.height-1000/640)<.02,'Canvas aspect ratio changed');
  assert.ok(layout.telemetryTop>=layout.canvasBottom,'Telemetry covers the driving canvas');
  await page.click('#fullscreenBtn');
  await page.click('#backBtn');
  for(let stage=0;stage<14;stage++){
   await page.selectOption('#stageSelect',String(stage));await page.click('[data-mode="solo"]');
   assert.ok((await page.locator('#trackName').textContent()).length>0);
   await page.click('#backBtn');
  }
  await page.selectOption('#stageSelect','0');await page.click('[data-mode="solo"]');
  const traffic=await page.evaluate(()=>window.testGame.trafficScenario());assert.ok(traffic.passed);assert.ok(traffic.minDistance>=23);
  await page.click('#backBtn');
  await page.selectOption('#stageSelect','4');await page.click('[data-mode="solo"]');
  const race=await page.evaluate(()=>window.testGame.simulateRace());assert.equal(race.lap,3);
  await page.evaluate(()=>window.testGame.finishRace());assert.ok(await page.locator('#result').isVisible());
  await page.click('#nextBtn');assert.equal(await page.locator('#trackName').textContent(),'JUNGLE SPRINT');
  await page.click('#backBtn');await page.click('[data-mode="duo"]');
  assert.equal(await page.evaluate(()=>window.testGame.cars.some(c=>c.isAI)),false);
  assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),1);
  assert.ok(await page.locator('#cameraBtn').isDisabled());
  await page.evaluate(()=>window.testGame.skipCountdown());
  await page.keyboard.down('ArrowUp');await page.waitForTimeout(300);await page.keyboard.up('ArrowUp');
  assert.ok(await page.evaluate(()=>window.testGame.cars[1].speed>0));
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(100);
  assert.ok(await page.locator('#canvas1').isVisible());
  assert.ok(await page.locator('#miniMap').isVisible());
  await page.setViewportSize({width:844,height:390});await page.waitForTimeout(100);
  assert.ok(await page.locator('#canvas1').isVisible());
  assert.ok(await page.locator('#miniMap').isVisible());
  await page.click('#fullscreenBtn');await page.waitForTimeout(100);
  const mobile=await page.locator('#canvas1').boundingBox();assert.ok(mobile.height>=150,'Landscape fullscreen leaves too little driving space');
  await page.click('#fullscreenBtn');
  await page.setViewportSize({width:1440,height:1000});
  await page.click('#backBtn');await page.selectOption('#stageSelect','0');await page.click('[data-mode="solo"]');await page.evaluate(()=>window.testGame.skipCountdown());
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH,fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('PASS: Chromium, input, countdown, pause/resume, restart, menu, 14 tracks, fullscreen/aspect/HUD, close/overview cameras, mobile map and landscape space, traffic overtake, ice CPU race/results/next stage, local two-player and viewport resizing.');
  console.log('Mobile checks cover visibility only; human handling, touch controls, audio and performance remain unverified.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>server.close());
