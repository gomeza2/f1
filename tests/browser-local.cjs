// Real Chromium keyboard/layout checks. Game state and standard-pad hardware are test-only probes.
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),localStage=Number(process.env.LOCAL_STAGE??3);assert.ok(Number.isInteger(localStage)&&localStage>=0&&localStage<14,'Invalid LOCAL_STAGE');
const bridge=`window.localTest={get cars(){return cars.map(c=>({player:c.player,model:c.model,color:c.color,speed:c.speed,lap:c.lap}))},get paused(){return paused},get running(){return running},get audio(){return audioChannels.map(c=>c.gain.gain.value)},get views(){return drivingViewports()},get cameras(){return cars.map((c,i)=>raceCamera(i))},skipCountdown(){countdownRemaining=0},freeze(){cancelAnimationFrame(raf)},separate(){cancelAnimationFrame(raf);countdownRemaining=0;cars.forEach((car,i)=>{placeCar(car,track.length*(i+.1)/cars.length,0);car.speed=100+i*20;car.lapTimes=[30+i];car.lap=1;car.lapStartTime=i+3});elapsed=25;drawFrame();updateTelemetry()},finish(){cancelAnimationFrame(raf);cars.forEach((car,i)=>{car.done=true;car.finishTime=60+i;car.lap=3;car.lapTimes=[20,20,20+i]});elapsed=64;finishRace()}};`;
const server=http.createServer((req,res)=>{
 const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
 if(name==='favicon.ico'){res.writeHead(204).end();return}
 if(!['index.html','style.css','engine-audio.js','script.js'].includes(name)){res.writeHead(404).end();return}
 res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');
 let body=fs.readFileSync(path.join(root,name),'utf8');if(name==='script.js')body=body.replace(/\}\)\(\);\s*$/,bridge+'})();');res.end(body);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://fonts.googleapis.com/**',route=>route.abort());
  await page.addInitScript(()=>{window.testPads=Array(4).fill(null);Object.defineProperty(navigator,'getGamepads',{value:()=>window.testPads});});
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.click('#localSetupBtn');assert.equal(await page.evaluate(()=>document.activeElement.id),'localPlayerCount');
  await page.selectOption('#stageSelect',String(localStage));await page.selectOption('#localPlayerCount','4');
  await page.selectOption('#playerModel2','corner');await page.selectOption('#playerModel3','speed');await page.selectOption('#playerModel4','rally');
  assert.match(await page.getAttribute('#playerPreview2','aria-label'),/CORNER KING.*NEON CYAN/);
  for(const count of [2,3,4]){
   await page.selectOption('#localPlayerCount',String(count));assert.equal(await page.locator('.local-seat:visible').count(),count-1);
   if(count===4&&process.env.LOCAL_SCREENSHOTS)await page.screenshot({path:path.join(process.env.LOCAL_SCREENSHOTS,'lobby-four.png'),fullPage:true});
   await page.click('#localStart');await page.evaluate(()=>window.localTest.skipCountdown());
   assert.equal((await page.evaluate(()=>window.localTest.cars)).length,count);assert.equal(await page.locator('.player-hud:visible').count(),count);
   assert.equal(await page.locator('.telemetry-chip:visible').count(),0);
   const keys=['w','ArrowUp','i','t'].slice(0,count);for(const key of keys)await page.keyboard.down(key);
   await page.waitForFunction(()=>window.localTest.cars.every(c=>c.speed>20));for(const key of keys)await page.keyboard.up(key);
   const cars=await page.evaluate(()=>window.localTest.cars);assert.deepEqual(cars.map(c=>c.model),['balanced','corner','speed','rally'].slice(0,count));
   await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.localTest.paused),true);
   const speedBefore=await page.evaluate(()=>window.localTest.cars.map(c=>c.speed));await page.waitForTimeout(100);assert.deepEqual(await page.evaluate(()=>window.localTest.cars.map(c=>c.speed)),speedBefore);
   await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.localTest.paused),false);
   await page.evaluate(()=>window.localTest.separate());const cameras=await page.evaluate(()=>window.localTest.cameras);assert.equal(new Set(cameras.map(c=>c.x+','+c.y)).size,count);
   for(let i=1;i<=count;i++){assert.equal(await page.locator('#playerSpeed'+i).textContent(),(80+i*20)+' km/h');assert.match(await page.locator('#playerTime'+i).textContent(),/VUELTA/);assert.match(await page.locator('#playerBest'+i).textContent(),/MEJOR 00:/);}
   for(const viewport of [{width:1440,height:1000},{width:1366,height:768},{width:2560,height:720},{width:390,height:844},{width:844,height:390}]){
    await page.setViewportSize(viewport);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const layout=await page.evaluate(()=>{const canvas=document.querySelector('#canvas1').getBoundingClientRect(),hud=document.querySelector('.telemetry-strip').getBoundingClientRect();return {bottom:canvas.bottom,top:canvas.top,width:canvas.width,height:canvas.height,hudTop:hud.top,scrollW:document.documentElement.scrollWidth,scrollH:document.documentElement.scrollHeight,w:innerWidth,h:innerHeight};});
    assert.ok(layout.width>100&&layout.height>100,JSON.stringify(layout));if(viewport.width>900)assert.ok(layout.width>viewport.width*.9,'Local driving area wastes horizontal space: '+JSON.stringify(layout));assert.ok(layout.bottom<=layout.hudTop+1);assert.ok(layout.scrollW<=layout.w&&layout.scrollH<=layout.h+1,JSON.stringify(layout));assert.ok(await page.locator('.player-hud:visible').evaluateAll(cards=>cards.every(card=>[...card.children].every(child=>child.scrollWidth<=child.clientWidth+1))),'Player telemetry text overflows its cell');
    if(process.env.LOCAL_SCREENSHOTS&&count===4)await page.screenshot({path:path.join(process.env.LOCAL_SCREENSHOTS,'race-four-'+viewport.width+'.png')});
   }
   await page.setViewportSize({width:1440,height:1000});await page.click('#fullscreenBtn');await page.waitForFunction(()=>!!document.fullscreenElement);await page.click('#fullscreenBtn');await page.waitForFunction(()=>!document.fullscreenElement);
   await page.click('#restartBtn');assert.equal((await page.evaluate(()=>window.localTest.cars)).length,count);assert.ok((await page.evaluate(()=>window.localTest.cars)).every(c=>c.lap===0));
   await page.evaluate(()=>window.localTest.finish());assert.equal(await page.locator('#raceRows tr').count(),count);assert.equal(await page.locator('#seasonRows tr').count(),count);assert.match(await page.locator('#finishSummary').textContent(),new RegExp('P'+count));
   await page.click('#nextBtn');assert.equal((await page.evaluate(()=>window.localTest.cars)).length,count);await page.click('#backBtn');
  }
  // Four physical controller slots through the Gamepad API; disconnected player pauses everyone.
  await page.evaluate(()=>{window.testPads=Array.from({length:4},()=>({connected:true,mapping:'standard',axes:[0],buttons:Array.from({length:8},()=>({value:0}))}));});
  for(let i=1;i<=4;i++)await page.selectOption('#playerInput'+i,'pad'+(i-1));
  await page.click('#localStart');await page.evaluate(()=>window.localTest.skipCountdown());
  await page.evaluate(()=>{for(const pad of window.testPads)pad.buttons[7].value=.8;});
  await page.waitForFunction(()=>window.localTest.cars.every(c=>c.speed>20));assert.equal((await page.evaluate(()=>window.localTest.audio)).length,4);
  await page.evaluate(()=>{window.testPads[2]=null;});await page.waitForFunction(()=>window.localTest.paused);assert.match(await page.locator('#status').textContent(),/P3.*DESCONECTADO/);
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.localTest.paused),true);
  await page.evaluate(()=>{window.testPads[2]={connected:true,mapping:'standard',axes:[0],buttons:Array.from({length:8},()=>({value:0}))};});
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.localTest.paused),false);
  await page.click('#backBtn');await page.selectOption('#playerInput4','pad2');await page.click('#localStart');assert.equal(await page.locator('#menu').isVisible(),true);assert.match(await page.locator('#localSetupStatus').textContent(),/distinto/);
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);console.log('PASS: Chromium lobby, 2/3/4 real simultaneous keyboard inputs, selected cars, independent cameras/HUD, pause/restart/results/next, fullscreen, five resolutions, four standard gamepads and disconnect/reconnect/duplicate prevention. Gamepads emulated; physical hardware pending.');
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
