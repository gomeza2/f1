// Chromium integration of the real controller/physics. The bridge is injected only by this test server.
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const bridge=`let boundaryStep=0,boundaryContacts=0,boundaryOffroad=0;window.boundaryTest={boxed(){start('solo',0);cancelAnimationFrame(raf);countdownRemaining=0;const [left,car,right,leader]=cars;for(const [c,p,l] of [[car,150,0],[left,180,-26],[right,180,26],[leader,188,0]]){placeCar(c,p,l);c.speed=100;}const d=aiTraffic(car,nearestOnTrack(car.x,car.y),driverFor(car),1/30),speed=car.speed;physics(car,1,1/30);drawFrame();return {lane:d.lane,limit:d.speedLimit,speed:car.speed,braking:speed-car.speed}},begin(){start('solo',stage);cancelAnimationFrame(raf);cars[0].isAI=true;countdownRemaining=0;goFlashRemaining=0;boundaryStep=boundaryContacts=boundaryOffroad=0;},advance(until){for(;boundaryStep<until&&!cars.every(car=>car.done);boundaryStep++){elapsed+=1/30;cars.forEach((car,i)=>{if(!car.done)physics(car,i,1/30)});if(cars.some((a,i)=>!a.done&&cars.slice(i+1).some(b=>!b.done&&Math.hypot(a.x-b.x,a.y-b.y)<23-1e-6)))boundaryContacts++;resolveCollisions(1/30);for(const car of cars)if(!car.done&&terrainAt(car.x,car.y).offroad)boundaryOffroad++;updateGroundEffects(1/30);}drawFrame();updateTelemetry();return {steps:boundaryStep,contacts:boundaryContacts,offroad:boundaryOffroad,laps:cars.map(c=>c.lap),meanLaps:cars.map(c=>c.finishTime/3),times:cars.map(c=>c.finishTime)}}};`;
const server=http.createServer((req,res)=>{
 const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';if(name==='favicon.ico'){res.writeHead(204).end();return}
 if(!['index.html','style.css','engine-audio.js','script.js'].includes(name)){res.writeHead(404).end();return}
 res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');let body=fs.readFileSync(path.join(root,name),'utf8');if(name==='script.js')body=body.replace(/\}\)\(\);\s*$/,bridge+'})();');res.end(body);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://fonts.googleapis.com/**',r=>r.abort());
  await page.goto('http://127.0.0.1:'+server.address().port);await page.click('#soundBtn');
  await page.selectOption('#opponentCount','3');const boxed=await page.evaluate(()=>window.boundaryTest.boxed());assert.ok(Math.abs(boxed.lane)<1e-7&&boxed.limit<80&&boxed.braking>0&&boxed.braking<=260/30+1e-7);await page.click('#backBtn');
  for(const stage of ['0','3','12','13','7']){
   await page.selectOption('#stageSelect',stage);await page.selectOption('#opponentCount','3');await page.selectOption('#difficulty','normal');await page.click('#soloStart');await page.evaluate(()=>window.boundaryTest.begin());
   if(stage==='0'&&process.env.GROUP_SCREENSHOT){await page.evaluate(()=>window.boundaryTest.advance(660));await page.screenshot({path:process.env.GROUP_SCREENSHOT});}
   if(stage==='3'){await page.evaluate(()=>window.boundaryTest.advance(630));if(process.env.BOUNDARY_SCREENSHOT)await page.screenshot({path:process.env.BOUNDARY_SCREENSHOT});}
   const result=await page.evaluate(()=>window.boundaryTest.advance(10800));assert.deepEqual(result.laps,[3,3,3,3]);assert.ok(result.contacts<=(stage==='0'?1:0),'Group contact regression');assert.equal(result.offroad,0);assert.ok(Math.max(...result.times)-Math.min(...result.times)<18,'Grid would miss the real race deadline');
   console.log('BROWSER RACE:',stage,JSON.stringify(result));await page.click('#backBtn');
  }
  assert.deepEqual(errors,[]);console.log('PASS: Chromium Sunset/Night/Meadow/Industrial/Pixel, four real controllers/three valid laps each, Sunset at most one contact step, other references zero, no runoff, normal finish deadline and no JavaScript errors. Controller automation is not human gameplay acceptance.');
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
