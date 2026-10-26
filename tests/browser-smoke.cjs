// Optional: requires Playwright and Chromium in the development environment.
const { chromium } = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'script.js'),'utf8');
const bridge=`let restartSnapshot=null;window.testGame={armRestartProbe(){restartSnapshot=null;window.addEventListener('keydown',function record(e){if(e.key.toLowerCase()!=='r')return;window.removeEventListener('keydown',record);restartSnapshot={countdown:countdownRemaining,elapsed,done:cars[0].done};});},get restartSnapshot(){return restartSnapshot},runoffScenario(){cancelAnimationFrame(raf);countdownRemaining=0;goFlashRemaining=0;const zone=runoffZones[0],car=cars[0];placeCar(car,zone.center,zone.side*66);car.speed=160;const material=terrainAt(car.x,car.y).material;for(let i=0;i<15;i++)physics(car,0,1/60);updateTelemetry();drawFrame();return {material,speed:car.speed,cells:runoffRaster().length}},runoffCount(){return runoffRaster().length},checkLapClock(){cancelAnimationFrame(raf);elapsed=42;cars[0].lapStartTime=30;updateTelemetry();const current=$('timer').textContent;cars[0].lapStartTime=elapsed;updateTelemetry();const reset=$('timer').textContent;cars[0].lapTimes.push(29.3);cars[0].done=true;elapsed+=5;updateTelemetry();return {current,reset,finished:$('timer').textContent}},vehicleVisual(){const car=cars[0],v=carVisualState(car);return {wheelAngle:v.wheelAngle,rolling:v.rolling,braking:v.braking,travel:car.wheelTravel}},spriteAtlas(quality){const previous=graphics;graphics=quality;const atlas=document.createElement('canvas');atlas.id='spriteAtlas';atlas.width=1100;atlas.height=625;atlas.style.cssText='position:fixed;left:0;top:0;width:1100px;height:625px;z-index:9999';document.body.append(atlas);const c=atlas.getContext('2d');c.fillStyle='#101827';c.fillRect(0,0,1100,625);c.fillStyle='#d7ff38';c.font='bold 22px monospace';c.fillText('PIXEL GRAND PRIX · '+quality.toUpperCase(),20,32);Object.values(CAR_PAINTS).forEach((paint,i)=>{c.fillStyle=paint.hex;c.font='12px monospace';c.fillText(paint.name,180+i*145,70)});Object.keys(CAR_MODELS).forEach((model,row)=>{const y=140+row*130;c.fillStyle='#c4d4df';c.font='bold 15px monospace';c.fillText(CAR_MODELS[model].name,16,y);Object.values(CAR_PAINTS).forEach((paint,col)=>{c.save();c.translate(230+col*145,y);c.scale(3.5,3.5);drawCarBody(c,{...cars[0],model,color:paint.hex,steer:.65,speed:120,wheelTravel:2,braking:row%2===0,done:false,flash:0,offroad:0});c.restore()})});graphics=previous},freezeFrame(){cancelAnimationFrame(raf);drawFrame()},get points(){return {...championship}},noticeScenario(){cancelAnimationFrame(raf);countdownRemaining=0;elapsed=2;cars[1].done=true;cars[1].finishTime=1;cars[1].lap=3;cars[1].lapTimes=[.3,.3,.4];updateTelemetry();drawFrame()},previewScenery(){cancelAnimationFrame(raf);countdownRemaining=0;goFlashRemaining=0;cameraMode='overview';updateCameraButton();drawFrame();updateTelemetry();return decorations.length},resetPreview(){cameraMode='near'},contactScenario(){cancelAnimationFrame(raf);countdownRemaining=0;cars.forEach((car,index)=>{placeCar(car,150+index*8,0);car.speed=0});resolveCollisions(1/30);drawFrame();updateTelemetry();let separation=Infinity;cars.forEach((a,i)=>cars.slice(i+1).forEach(b=>separation=Math.min(separation,Math.hypot(a.x-b.x,a.y-b.y))));return {separation,speeds:cars.map(c=>c.speed),passes:cars.map(c=>c.checkpointPasses)}},simulateGrid(){cancelAnimationFrame(raf);cars[0].isAI=true;for(let i=0;i<10800&&!cars.every(c=>c.done);i++){elapsed+=1/30;cars.forEach((car,index)=>{if(!car.done)physics(car,index,1/30)});resolveCollisions(1/30)}cars[0].isAI=false;drawFrame();updateTelemetry();return cars.map(c=>({lap:c.lap,time:c.finishTime}))},get cars(){return cars},get elapsed(){return elapsed},get paused(){return paused},get countdown(){return countdownRemaining},get running(){return running},get camera(){return raceCamera()},get overview(){return overviewZoom()},get logicalWidth(){return localViewWidth},get split(){return usesSplitScreen()},get world(){return {width:track.worldWidth,height:track.worldHeight}},separateViews(){placeCar(cars[1],track.length/2,0);drawFrame();updateTelemetry();return Math.hypot(raceCamera(0).x-raceCamera(1).x,raceCamera(0).y-raceCamera(1).y)},get buffers(){return {backgroundWidth:backgroundCache?.width,surfaceWidth:trackSurfaceCache?.width}},skipCountdown(){countdownRemaining=0},simulateRace(){cancelAnimationFrame(raf);cars[0].done=true;for(let i=0;i<9000&&!cars[1].done;i++){elapsed+=1/30;physics(cars[1],1,1/30)}drawFrame();updateTelemetry();return {lap:cars[1].lap,time:cars[1].finishTime}},trafficScenario(){cancelAnimationFrame(raf);placeCar(cars[0],170,0);placeCar(cars[1],110,0);cars[1].speed=90;let minDistance=Infinity;for(let i=0;i<900&&cars[1].progress<210;i++){elapsed+=1/60;physics(cars[1],1,1/60);minDistance=Math.min(minDistance,Math.hypot(cars[0].x-cars[1].x,cars[0].y-cars[1].y))}drawFrame();return {passed:cars[1].progress>=210,minDistance}},finishRace};`;
const server=http.createServer((req,res)=>{
 const name=req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0].slice(1);
 if(!['index.html','style.css','engine-audio.js','script.js'].includes(name)){res.writeHead(404).end();return}
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
  await page.route(/\/script\.js(?:\?.*)?$/,route=>route.fulfill({contentType:'text/javascript',body:source.replace(/\}\)\(\);\s*$/,bridge+'})();')}));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  // Disable decorative hover motion so click stability does not depend on frame timing.
  await page.addStyleTag({content:'button{transition:none!important}button:hover{transform:none!important}'});
  assert.equal(await page.locator('#stageSelect option').count(),14);
  assert.ok(await page.locator('#trackPreview').isVisible());assert.ok(await page.locator('#carPreview').isVisible());
  await page.locator('#stageSelect').focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
  assert.equal(await page.inputValue('#stageSelect'),'1','Menu arrows were intercepted by game controls');
  assert.match(await page.locator('#previewTrackName').textContent(),/NEON HARBOR/);
  await page.selectOption('#stageSelect','0');
  await page.selectOption('#carModel','corner');await page.selectOption('#carColor','cyan');
  assert.match(await page.getAttribute('#carPreview','aria-label'),/CORNER KING.*NEON CYAN/);
  await page.selectOption('#carModel','balanced');await page.selectOption('#carColor','pink');
  await page.setViewportSize({width:1366,height:768});
  const startBounds=await page.locator('#soloStart').boundingBox();assert.ok(startBounds.y+startBounds.height<=768,'Desktop start button requires scrolling');
  await page.setViewportSize({width:1440,height:1000});
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-menu.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  const menuWidth=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));assert.ok(menuWidth.width<=menuWidth.viewport,'Mobile paddock overflows horizontally');
  await page.locator('.controls-help summary').click();assert.ok(await page.locator('.controls-help .keys').isVisible());
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-menu-mobile.png'),fullPage:true});
  await page.locator('.controls-help summary').click();await page.setViewportSize({width:1440,height:1000});
  await page.locator('#soundBtn').focus();await page.keyboard.press('Enter');assert.equal(await page.getAttribute('#soundBtn','aria-pressed'),'false');await page.keyboard.press('Enter');assert.equal(await page.getAttribute('#soundBtn','aria-pressed'),'true');

  assert.equal(await page.inputValue('#opponentCount'),'3');await page.selectOption('#opponentCount','1');
  await page.locator('#soloStart').focus();await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'canvas1');
  async function checkRaceLayout(){
   const layout=await page.evaluate(()=>{
    const a=$('#canvas1'),b=$('.telemetry-strip');
    function $(selector){return document.querySelector(selector).getBoundingClientRect()}
    return {width:a.width,height:a.height,top:a.top,bottom:a.bottom,telemetryTop:b.top,
     scrollHeight:document.documentElement.scrollHeight,viewport:innerHeight,scrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth};
   });
   assert.ok(Math.abs(layout.width/layout.height-await page.evaluate(()=>window.testGame.logicalWidth/640))<.02,'Canvas geometry is stretched instead of following its logical viewport');
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
  // Capture the restart in its keyboard task; a loaded runner may observe it after 3 wall seconds.
  await page.evaluate(()=>window.testGame.armRestartProbe());await page.keyboard.press('r');
  assert.deepEqual(await page.evaluate(()=>window.testGame.restartSnapshot),{countdown:3,elapsed:0,done:false});
  assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),1.35);
  await page.click('#cameraBtn');assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),await page.evaluate(()=>window.testGame.overview));
  await page.keyboard.press('c');assert.equal(await page.evaluate(()=>window.testGame.camera.zoom),1.35);
  await page.evaluate(()=>window.testGame.skipCountdown());
  // Exercise countersteering while rolling; parked pivoting is no longer valid behaviour.
  await page.keyboard.down('w');await page.waitForFunction(()=>window.testGame.cars[0].speed>=60);
  assert.ok(await page.evaluate(()=>window.testGame.cars[0].speed>0));
  await page.keyboard.down('d');await page.waitForTimeout(180);await page.keyboard.up('d');
  const turn=await page.evaluate(()=>({yaw:window.testGame.cars[0].yawRate,heading:window.testGame.cars[0].heading}));assert.ok(turn.yaw>0);assert.ok((await page.evaluate(()=>window.testGame.vehicleVisual())).wheelAngle>0);
  await page.waitForTimeout(400);
  const release=await page.evaluate(()=>({yaw:window.testGame.cars[0].yawRate,heading:window.testGame.cars[0].heading}));
  assert.ok(Math.abs(release.yaw)<Math.abs(turn.yaw),'Keyboard release did not damp rotation');
  assert.ok(Math.atan2(Math.sin(release.heading-turn.heading),Math.cos(release.heading-turn.heading))>0,'Yaw stopped instantaneously');
  await page.keyboard.down('a');await page.waitForTimeout(180);await page.keyboard.up('a');
  assert.ok(await page.evaluate(()=>window.testGame.cars[0].yawRate<0),'Keyboard countersteer failed');await page.keyboard.up('w');
  await page.keyboard.down('s');await page.waitForTimeout(100);assert.ok((await page.evaluate(()=>window.testGame.vehicleVisual())).braking);await page.keyboard.up('s');await page.waitForTimeout(60);assert.equal((await page.evaluate(()=>window.testGame.vehicleVisual())).braking,false);
  // Dispatch the real visibility handler with a synthetic hidden state.
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  assert.ok(await page.evaluate(()=>window.testGame.paused));assert.equal(await page.getAttribute('#pauseBtn','aria-pressed'),'true');
  const hiddenTime=await page.evaluate(()=>window.testGame.elapsed);await page.waitForTimeout(120);assert.equal(await page.evaluate(()=>window.testGame.elapsed),hiddenTime);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
  assert.ok(await page.evaluate(()=>window.testGame.paused),'Visibility return resumed automatically');
  await page.click('#pauseBtn');assert.equal(await page.getAttribute('#pauseBtn','aria-pressed'),'false');
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
  assert.ok(Math.abs(layout.width/layout.height-await page.evaluate(()=>window.testGame.logicalWidth/640))<.02,'Canvas geometry is stretched instead of following its logical viewport');
  assert.ok(layout.telemetryTop>=layout.canvasBottom,'Telemetry covers the driving canvas');
  await page.click('#fullscreenBtn');
  await page.click('#backBtn');
  assert.equal(await page.evaluate(()=>document.body.classList.contains('racing')),false);
  for(let stage=0;stage<14;stage++){
   await page.selectOption('#stageSelect',String(stage));await page.click('[data-mode="solo"]');
   assert.ok((await page.locator('#trackName').textContent()).length>0);
   const buffers=await page.evaluate(()=>({world:window.testGame.world,buffers:window.testGame.buffers}));
   assert.equal(buffers.world.width,buffers.buffers.backgroundWidth);assert.equal(buffers.world.width,buffers.buffers.surfaceWidth);
   if(process.env.SCENERY_SCREENSHOT_DIR){
    const count=await page.evaluate(()=>window.testGame.previewScenery());assert.ok(count>0);
    await page.screenshot({path:path.join(process.env.SCENERY_SCREENSHOT_DIR,`track-${stage}.png`),fullPage:true});
   }
   await page.click('#backBtn');
  }
  await page.evaluate(()=>window.testGame.resetPreview());
  await page.selectOption('#stageSelect','0');await page.click('[data-mode="solo"]');
  const runoff=await page.evaluate(()=>window.testGame.runoffScenario());assert.equal(runoff.material,'gravel');assert.ok(runoff.speed<130&&runoff.cells>0,'Visible runoff did not brake the actual car');
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-gravel.png'),fullPage:true});
  await page.click('#backBtn');await page.selectOption('#barrierMode','full');await page.click('[data-mode="solo"]');
  assert.equal(await page.evaluate(()=>window.testGame.runoffCount()),0,'Full barriers left inaccessible gravel');
  if(process.env.SCREENSHOT_PATH){await page.evaluate(()=>window.testGame.previewScenery());await page.screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-full-barriers.png'),fullPage:true});await page.evaluate(()=>window.testGame.resetPreview());}
  await page.click('#backBtn');await page.selectOption('#barrierMode','auto');await page.click('[data-mode="solo"]');
  const traffic=await page.evaluate(()=>window.testGame.trafficScenario());assert.ok(traffic.passed);assert.ok(traffic.minDistance>=23);
  await page.click('#backBtn');
  await page.selectOption('#stageSelect','2');await page.click('[data-mode="solo"]');
  const dustyRace=await page.evaluate(()=>window.testGame.simulateRace());assert.equal(dustyRace.lap,3);
  assert.ok(dustyRace.time>0&&dustyRace.time<240,'Dusty Mesa CPU did not complete a valid race in time');
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
  await page.click('#backBtn');await page.selectOption('#graphics','high');
  for(const count of ['2','3']){
   await page.selectOption('#opponentCount',count);await page.click('[data-mode="solo"]');
   assert.equal(await page.evaluate(()=>window.testGame.cars.length),Number(count)+1);
   await checkRaceLayout();
   await page.keyboard.press('r');assert.equal(await page.evaluate(()=>window.testGame.cars.length),Number(count)+1);
   await page.click('#backBtn');
  }
  await page.click('[data-mode="solo"]');
  const beforeNotice=await page.locator('#canvas1').boundingBox();
  await page.evaluate(()=>window.testGame.noticeScenario());
  assert.ok(await page.locator('#status').evaluate(node=>node.classList.contains('checkered-status')));
  assert.match(await page.locator('#status').textContent(),/TRAZO TERMINÓ.*SEGUÍ CORRIENDO/);
  assert.equal(await page.locator('#finishClock').textContent(),'CIERRE 17 s');
  assert.ok(await page.evaluate(()=>window.testGame.running&&!window.testGame.cars[0].done));
  const afterNotice=await page.locator('#canvas1').boundingBox();assert.equal(afterNotice.height,beforeNotice.height,'Finish notice reduced driving area');
  await checkRaceLayout();
  await page.click('#pauseBtn');const clockPaused=await page.locator('#finishClock').textContent();await page.waitForTimeout(100);
  assert.equal(await page.locator('#finishClock').textContent(),clockPaused);
  await page.keyboard.press('Escape');assert.match(await page.locator('#status').textContent(),/TRAZO TERMINÓ.*SEGUÍ CORRIENDO/);await page.keyboard.down('w');await page.waitForTimeout(250);await page.keyboard.up('w');
  assert.ok(await page.evaluate(()=>window.testGame.cars[0].speed>0),'Human could not continue after CPU finish');
  await page.evaluate(()=>window.testGame.freezeFrame());
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-notice.png'),fullPage:true});
  for(const viewport of [{width:390,height:844},{width:844,height:390}]){await page.setViewportSize(viewport);await page.waitForTimeout(100);await checkRaceLayout();assert.ok(await page.locator('#finishClock').isVisible());}
  await page.setViewportSize({width:1440,height:1000});await page.keyboard.press('r');
  assert.equal(await page.locator('#finishClock').isVisible(),false);assert.equal(await page.locator('#status').evaluate(node=>node.classList.contains('checkered-status')),false);
  const pile=await page.evaluate(()=>window.testGame.contactScenario());
  assert.ok(pile.separation>22.95);assert.ok(pile.speeds.every(speed=>speed===0));assert.ok(pile.passes.every(count=>count===0));
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-contact.png'),fullPage:true});
  await page.keyboard.press('r');
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-grid.png'),fullPage:true});
  const gridRace=await page.evaluate(()=>window.testGame.simulateGrid());assert.ok(gridRace.every(car=>car.lap===3&&car.time>0));
  await page.evaluate(()=>window.testGame.finishRace());
  assert.equal(await page.evaluate(()=>document.activeElement.id),'resultTitle');
  assert.match(await page.locator('#finishSummary').textContent(),/TU PUESTO/);
  const pointsBefore=await page.evaluate(()=>JSON.stringify(window.testGame.points));await page.evaluate(()=>window.testGame.finishRace());assert.equal(await page.evaluate(()=>JSON.stringify(window.testGame.points)),pointsBefore);
  assert.equal(await page.locator('.flag-cloth').evaluate(node=>getComputedStyle(node).animationIterationCount),'3');
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.flag-cloth').evaluate(node=>getComputedStyle(node).animationName),'none');
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-finish.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.locator('#finishSummary').isVisible());
  assert.ok(await page.locator('#raceResults').isVisible());assert.ok(await page.locator('#seasonResults').isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile results overflow horizontally');
  if(process.env.SCREENSHOT_PATH)await page.screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-finish-mobile.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});
  const gridResult=await page.locator('#raceRows').textContent();
  assert.equal(await page.locator('#raceRows tr').count(),4);assert.equal(await page.locator('#seasonRows tr').count(),4);
  assert.equal(await page.locator('#seasonRows .total-points').first().textContent(),'25');
  for(const name of ['P1','TRAZO','FURIA','ÁPICE'])assert.ok(gridResult.includes(name));
  await page.click('#nextBtn');assert.equal(await page.evaluate(()=>window.testGame.cars.length),4);
  await page.click('#backBtn');await page.click('[data-mode="duo"]');assert.equal(await page.evaluate(()=>window.testGame.cars.length),2);
  for(const quality of ['high','retro','lite']){
   await page.evaluate(q=>window.testGame.spriteAtlas(q),quality);
   if(process.env.SCREENSHOT_PATH)await page.locator('#spriteAtlas').screenshot({path:process.env.SCREENSHOT_PATH.replace('.png','-cars-'+quality+'.png')});
   await page.locator('#spriteAtlas').evaluate(node=>node.remove());
  }
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal((await page.evaluate(()=>window.testGame.vehicleVisual())).rolling,false);
  await page.emulateMedia({reducedMotion:'no-preference'});
  assert.deepEqual(errors,[]);
  console.log('PASS: Chromium, input/yaw/release/countersteer, countdown, pause/resume, restart, menu, 14 tracks, fullscreen/aspect/compact HUD/lap clock/no scrolling, world-sized caches, split/close/overview cameras, mobile map and landscape space, traffic overtake, Dusty Mesa pace/race, ice CPU race/results/next stage, local two-player, viewport resizing, two/three CPUs, grid restart/results/next stage and four-car contact separation without generated speed and themed scenery in all 14 tracks, compact checkered notice, continuing human, pause/deadline, result focus/summary, four models/six paints/three qualities, wheel/brake input feedback, paddock route/car previews, native menu keyboard controls, mobile paddock and reduced motion.');
  console.log('Mobile checks cover visibility only; human handling, touch controls, audio and performance remain unverified.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>server.close());
