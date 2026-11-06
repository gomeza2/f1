// The actual game DOM/Canvas/controls against the real authoritative room server.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {createApp}=require('../server/index.cjs');
const {navigate,P,immediate}=require('../server/test/helpers.cjs');
const root=path.resolve(__dirname,'..'),captures=process.env.ONLINE_SCREENSHOTS,onlineStage=Number(process.env.ONLINE_STAGE??2);assert.ok(Number.isInteger(onlineStage)&&onlineStage>=0&&onlineStage<14);if(captures)fs.mkdirSync(captures,{recursive:true});
const bridge=`window.onlineUiTest={state(){return {active:online?.active,room:online?.room,session:online?.transport?.session?{pilotId:online.transport.session.pilotId}:null,tick:online?.transport?.tick,own:onlineSelfIndex(),camera:raceCamera(onlineSelfIndex()),cars:raceState.cars,elapsed:raceState.elapsed,focus:document.hasFocus(),prediction:online?.prediction?.stats,visual:online?.visual,rendered:raceState.cars[onlineSelfIndex()]?renderedCar(raceState.cars[onlineSelfIndex()]):null};},pulse(c){window.testPad.axes[0]=Math.abs(c.steering)<.001?0:Math.sign(c.steering)*(.15+Math.abs(c.steering)*.85);window.testPad.buttons[7].value=c.throttle;window.testPad.buttons[6].value=c.brake;window.testPad.buttons[2].value=c.hand?1:0;sendOnlineControls();}};`;
(async()=>{
 const errors=[],serverErrors=[],pages=[],contexts=[];const wallStart=performance.now();let now=0,app,browser;
 const staticServer=http.createServer((req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname.replace(/^\/f1\//,'')||'index.html';
  if(name==='favicon.ico'){res.writeHead(204).end();return;}
  if(!['index.html','style.css','script.js','driving-core.js','track-core.js','race-rules.js','race-session.js','engine-audio.js','ghost-lap.js','online-client.js','online-prediction.js','online-config.json'].includes(name)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.json')?'application/json':name.endsWith('.css')?'text/css':'text/html');
  let text=fs.readFileSync(path.join(root,name),'utf8');if(name==='script.js')text=text.replace(/\}\)\(\);\s*$/,bridge+'})();');res.end(text);
 });
 try{
  await new Promise(r=>staticServer.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+staticServer.address().port;
  app=createApp({autoTick:false,clock:()=>now+performance.now()-wallStart,allowedOrigins:[base],onError:e=>serverErrors.push(e)});const url=await app.listen();
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  for(let i=0;i<4;i++){
   const context=await browser.newContext({viewport:{width:1366,height:900}});contexts.push(context);
   await context.addInitScript(()=>{window.testPad={id:'Standard emulated controller',index:0,connected:true,mapping:'standard',axes:[0,0],buttons:Array.from({length:18},()=>({value:0,pressed:false,touched:false}))};navigator.getGamepads=()=>[window.testPad];});
   await context.route('https://fonts.googleapis.com/**',route=>route.abort());const page=await context.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/f1/');await page.selectOption('#graphics','lite');await page.click('#onlineSetupBtn');await page.waitForFunction(()=>!document.getElementById('onlineCreate').disabled);assert.equal(await page.locator('#onlineServer').inputValue(),require('../online-config.json').serverUrl);await page.fill('#onlineServer',url.http);await page.fill('#onlineName',i===2?'<img src=x onerror=alert(1)>'.slice(0,20):'Piloto '+(i+1));
   if(i===0){await page.selectOption('#stageSelect',String(onlineStage));await page.click('#onlineCreate');}
   else{const code=await pages[0].locator('#onlineRoomCode').textContent();await page.fill('#onlineCode',code);await page.click('#onlineJoin');}
   await page.waitForSelector('#onlineRoom:not(.hidden)');await page.selectOption('#onlineInput',i===2?'keyboard':'pad0');
  }
  const code=await pages[0].locator('#onlineRoomCode').textContent();const room=app.service.rooms.get(code);
  await pages[0].waitForFunction(()=>document.querySelectorAll('#onlinePilots li').length===4);
  assert.equal(await pages[1].locator('#onlineConfigure').isDisabled(),true);assert.equal(await pages[0].locator('#onlineStart').isDisabled(),true);
  await pages[0].selectOption('#onlineTrack',String(onlineStage));await pages[0].selectOption('#onlineLaps','1');await pages[0].click('#onlineConfigure');
  await pages[0].waitForFunction(()=>document.getElementById('onlineRoomHint').textContent.includes('Elegí'));
  for(let i=0;i<4;i++){
   await pages[i].selectOption('#onlineModel',['balanced','corner','speed','rally'][i]);await pages[i].click('#onlineChoose');await pages[i].waitForFunction(model=>window.onlineUiTest.state().room.players.find(p=>p.pilotId===window.onlineUiTest.state().session.pilotId)?.model===model,['balanced','corner','speed','rally'][i]);
  }
  for(const page of pages){await page.click('#onlineReady');await page.waitForFunction(()=>document.getElementById('onlineReady').getAttribute('aria-pressed')==='true');}
  await pages[0].waitForFunction(()=>!document.getElementById('onlineStart').disabled);await pages[0].click('#onlineStart');
  await Promise.all(pages.map(page=>page.waitForSelector('#game:not(.hidden)')));
  for(let i=0;i<4;i++){const state=await pages[i].evaluate(()=>window.onlineUiTest.state());assert.equal(state.own,i);assert.equal(state.cars[state.own].player,i);assert.ok(state.focus);assert.equal(await pages[i].locator('#restartBtn').isDisabled(),true);}
  async function ticks(n){for(let i=0;i<n;i++){now+=1000/60;app.tick();}await immediate();await immediate();}
  // Native P3 keyboard controls its server pilot, not seat zero. No position injection.
  await pages[2].locator('#canvas1').focus();app.service.sendSnapshot(room);await new Promise(r=>setTimeout(r,30));await pages[2].keyboard.down('w');await pages[2].keyboard.down(' ');
  await pages[2].evaluate(()=>window.onlineUiTest.pulse({throttle:0,brake:0,steering:0,hand:false}));await new Promise(r=>setTimeout(r,30));
  assert.equal(room.players.get(2).input.throttle,1);assert.equal(room.players.get(2).input.hand,true);assert.equal(room.players.get(0).input.throttle,0);
  await pages[2].keyboard.down('d');await pages[2].keyboard.down('ShiftLeft');await pages[2].evaluate(()=>window.onlineUiTest.pulse({throttle:0,brake:0,steering:0,hand:false}));await new Promise(r=>setTimeout(r,30));assert.equal(room.players.get(2).input.steering,.5);assert.equal(room.players.get(2).input.throttle,1);await pages[2].keyboard.up('ShiftLeft');await pages[2].evaluate(()=>window.onlineUiTest.pulse({throttle:0,brake:0,steering:0,hand:false}));await new Promise(r=>setTimeout(r,30));assert.equal(room.players.get(2).input.steering,1);await pages[2].keyboard.up('d');
  await pages[2].keyboard.up('w');await pages[2].keyboard.up(' ');await pages[2].keyboard.press('Escape');
  assert.equal(await pages[2].locator('#pauseBtn').getAttribute('aria-pressed'),'true');assert.equal(room.session.state.paused,false);
  await pages[2].keyboard.press('Escape');
  // Switch only the automated test driver to an emulated analog pad after the native keyboard check.
  await pages[2].evaluate(()=>document.getElementById('onlineInput').value='pad0');
  const world=P.geometry.createWorld(onlineStage,'auto');let reconnected=false,captured=false;
  for(let n=0;n<6000&&room.phase!=='results';n+=3){
   await Promise.all(pages.map(async(page,i)=>{
    const car=room.session.state.cars.find(c=>c.player===i);if(car.done||car.retired)return;
    await page.evaluate(c=>window.onlineUiTest.pulse(c),navigate(car,world));
   }));
   await immediate();await immediate();await ticks(3);
   await Promise.all(pages.map(page=>page.waitForFunction(tick=>window.onlineUiTest.state().tick>=tick,room.tick,{polling:5})));
   if(!captured&&room.tick>600){captured=true;if(captures)await pages[2].screenshot({path:path.join(captures,'online-race-p3.png')});}
   if(room.tick%600===0)console.log('Authoritative UI race tick '+room.tick);
   if(!reconnected&&room.tick>360){
    reconnected=true;const prior=room.players.get(1).token;const connection=room.players.get(1).connection;
    const ws=[...app.service.connections.values()].find(c=>c===connection);assert.ok(ws);
    // Force an actual transport loss, not a synthetic frontend status.
    room.players.get(1).connection.io.close(1012,'test_restart');
    await pages[1].waitForFunction(()=>document.getElementById('onlineStatus').textContent.includes('RECONECTANDO'));
    await pages[1].waitForFunction(()=>document.getElementById('onlineStatus').textContent.startsWith('CONECTADO'));
    assert.notEqual(room.players.get(1).token,prior);assert.equal(room.session.state.cars[1].player,1);
   }
  }
  assert.equal(room.phase,'results');assert.ok(reconnected);
  await Promise.all(pages.map(page=>page.waitForSelector('#result:not(.hidden)')));
  const tables=await Promise.all(pages.map(page=>page.locator('#raceRows').textContent()));
  // The only per-client difference is the VOS marker.
  assert.ok(tables.every(table=>table.replace(/ · VOS/g,'')===tables[0].replace(/ · VOS/g,'')));
  assert.equal(await pages[2].locator('#raceRows img').count(),0);assert.ok(room.result.rows.every(r=>r.done&&!r.retired&&r.lapTimes.length===1));
  assert.deepEqual(errors,[]);assert.deepEqual(serverErrors,[]);
  console.log(JSON.stringify({players:4,laps:room.result.rows.map(r=>r.lapTimes),finish:room.result.rows.map(r=>r.finishTime),reconnected,selfIndexes:[0,1,2,3],nativeKeyboard:true}));
  for(const page of pages){assert.equal(await page.evaluate(()=>localStorage.getItem('pixelGP.bestLaps.v1')),null);await page.click('#nextBtn');await page.waitForSelector('#onlineLobby[open]');}
  // Reconnect elected P2 host? P1 remained connected and remains host.
  await pages[0].click('#onlineRematch');await pages[0].waitForFunction(()=>window.onlineUiTest.state().room.phase==='lobby');
  if(captures){await pages[1].setViewportSize({width:390,height:844});await pages[1].locator('#onlineResponse').scrollIntoViewIfNeeded();await pages[1].screenshot({path:path.join(captures,'response-lobby-mobile.png')});await pages[1].setViewportSize({width:1366,height:900});}
  // Second grid: isolate front-row P2 without editing positions; exercise the rendered forecast and parking safety.
  await pages[0].selectOption('#onlineTrack','0');await pages[0].click('#onlineConfigure');
  await pages[0].waitForFunction(()=>window.onlineUiTest.state().room.config.track===0);
  for(const page of pages){await page.click('#onlineReady');await page.waitForFunction(()=>document.getElementById('onlineReady').getAttribute('aria-pressed')==='true');}
  await pages[0].waitForFunction(()=>!document.getElementById('onlineStart').disabled);await pages[0].click('#onlineStart');
  await Promise.all(pages.map(page=>page.waitForSelector('#game:not(.hidden)')));
  let predictedFrames=0;const isolationWorld=P.geometry.createWorld(0,'auto');
  for(let n=0;n<600;n+=3){
   await Promise.all(pages.map((page,i)=>page.evaluate(c=>window.onlineUiTest.pulse(c),i===1?navigate(room.session.state.cars.find(car=>car.player===1),isolationWorld):{throttle:0,brake:1,steering:0,hand:true})));
   await immediate();await immediate();await ticks(3);
   await Promise.all(pages.map(page=>page.waitForFunction(tick=>window.onlineUiTest.state().tick>=tick,room.tick,{polling:5})));
   const current=await pages[1].evaluate(()=>window.onlineUiTest.state());if(current.prediction?.reason==='predicting'){predictedFrames++;assert.ok(current.prediction.steps<=9);assert.equal(current.own,1);}
  }
  if(!predictedFrames)console.log(JSON.stringify({predictionDiagnostic:await pages[1].evaluate(()=>window.onlineUiTest.state().prediction),cars:room.session.state.cars.map(car=>({player:car.player,x:car.x,y:car.y,speed:car.speed,progress:car.progress}))}));
  assert.ok(predictedFrames>0,'Own-car presentation forecast never ran after separation');
  await pages[1].waitForFunction(()=>{const state=window.onlineUiTest.state();return state.prediction?.reason==='predicting'&&Math.hypot(state.rendered.x-state.cars[state.own].x,state.rendered.y-state.cars[state.own].y)>.01;});
  const view=await pages[1].evaluate(()=>window.onlineUiTest.state());assert.equal(view.prediction.reason,'predicting');assert.equal(view.rendered.x,view.visual.x);assert.ok(Math.hypot(view.rendered.x-view.cars[view.own].x,view.rendered.y-view.cars[view.own].y)>.01,'Predicted pose never reached the renderer');assert.equal(view.cars[view.own].x,room.session.state.cars.find(car=>car.player===1).x,'Presentation changed the authoritative car');
  if(captures)await pages[1].screenshot({path:path.join(captures,'agile-own-car.png')});
  // Preserve the classic setting, then return to agile without manufacturing a result.
  await pages[1].evaluate(()=>document.getElementById('onlineResponse').value='classic');
  await pages[1].waitForFunction(()=>window.onlineUiTest.state().prediction?.reason==='classic');
  await pages[1].evaluate(()=>document.getElementById('onlineResponse').value='agile');
  await pages[1].locator('#canvas1').focus();await pages[1].keyboard.press('Escape');
  for(let n=0;n<180;n+=3){await pages[1].evaluate(()=>window.onlineUiTest.pulse({throttle:1,brake:0,steering:0,hand:false}));await immediate();await immediate();await ticks(3);}
  assert.equal(room.session.state.cars.find(c=>c.player===2).speed,0);assert.equal(room.session.state.cars.find(c=>c.player===2).reverseHeld,0);
  await pages[1].keyboard.press('Escape');await pages[1].evaluate(()=>window.testPad.connected=false);
  for(let n=0;n<90;n+=3){await pages[1].evaluate(()=>window.onlineUiTest.pulse({throttle:1,brake:0,steering:0,hand:false}));await immediate();await immediate();await ticks(3);}
  assert.equal(room.session.state.cars.find(c=>c.player===2).speed,0);assert.equal(room.players.get(1).input.hand,true);
  console.log(JSON.stringify({isolatedPilot:1,predictedFrames,classicFallback:true,parkedWithoutReverse:true,missingPadStopped:true}));
  // Leaving the running grid is explicit DNF; it is not counted as another complete race.
  for(const page of pages){await page.click('#backBtn');await page.waitForSelector('#menu:not(.hidden)');}
  for(const page of pages){await page.click('#onlineSetupBtn');await page.waitForSelector('#onlineLobby[open]');}
  await pages[0].setViewportSize({width:390,height:844});if(captures)await pages[0].screenshot({path:path.join(captures,'online-mobile.png')});
  for(const page of pages){await page.click('#onlineClose');await page.waitForSelector('#menu:not(.hidden)');}
  console.log('PASS: actual game UI, four independent browsers, selected models, native P3 keyboard/escape and normalized gamepad input, authoritative gated laps, own camera/HUD identity, real reconnect/token rotation, safe text names, identical results, rematch, mobile lobby and offline exit; clock/navigation/gamepads instrumented, human WAN feel not validated.');
 }finally{await browser?.close();await app?.close();await new Promise(r=>staticServer.close(r));}
})().catch(error=>{console.error(error);process.exitCode=1;});
