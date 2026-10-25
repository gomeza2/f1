// Optional: Playwright + Chromium. Load the actual release files without a game-state bridge.
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const version=html.match(/name="application-version" content="([^"]+)"/)[1],requests=[];
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');requests.push(url.pathname+url.search);
 if(url.pathname==='/seed'){res.setHeader('Content-Type','text/html');res.end('<link rel="stylesheet" href="/f1/style.css?v=old"><script src="/f1/script.js?v=old"></script>');return}
 if(url.pathname==='/favicon.ico'){res.writeHead(204).end();return}
 const name=url.pathname.replace(/^\/f1\//,'')||'index.html';
 if(!['index.html','style.css','script.js'].includes(name)){res.writeHead(404).end();return}
 res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');
 res.setHeader('Cache-Control',name==='index.html'?'no-store':'public, max-age=31536000, immutable');
 if(url.searchParams.get('v')==='old'){res.end(name==='script.js'?'window.staleBuild=true;':'body{background:red}');return}
 res.end(fs.readFileSync(path.join(root,name)));
});
(async()=>{
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--host-resolver-rules=MAP fonts.googleapis.com ~NOTFOUND, MAP fonts.gstatic.com ~NOTFOUND']});
 try{
  const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:'+server.address().port;
  await page.goto(base+'/seed');assert.equal(await page.evaluate(()=>window.staleBuild),true);
  const oldFetches=requests.filter(url=>url.includes('?v=old')).length;
  // Routing is deliberately unused: Playwright routes disable the browser HTTP cache.
  await page.goto(base+'/f1/');assert.equal(await page.evaluate(()=>window.staleBuild),undefined);
  assert.equal(requests.filter(url=>url.includes('?v=old')).length,oldFetches);
  for(const name of ['script.js','style.css'])assert.ok(requests.includes('/f1/'+name+'?v='+version));
  assert.match(await page.locator('footer').textContent(),new RegExp('BUILD '+version.replaceAll('.','\\.')));
  assert.equal(await page.locator('#stageSelect option').count(),14);assert.ok(await page.locator('#trackPreview').isVisible());
  assert.ok((await page.locator('#stageSelect').boundingBox()).height>=44,'Release CSS did not load');
  await page.selectOption('#stageSelect','2');await page.selectOption('#opponentCount','2');await page.click('#soloStart');
  try{await page.waitForFunction(()=>document.getElementById('status').textContent==='¡A FONDO!',{},{timeout:10000});}
  catch(error){const state=await page.evaluate(()=>({status:document.getElementById('status').textContent,paused:document.getElementById('pauseBtn').getAttribute('aria-pressed'),hidden:document.hidden}));throw new Error('Release countdown did not finish: '+JSON.stringify(state));}
  await page.keyboard.down('w');await page.waitForTimeout(600);await page.keyboard.up('w');
  assert.ok(parseInt(await page.locator('#speedValue').textContent())>0,'Actual release did not drive');
  await page.keyboard.press('Escape');assert.equal(await page.getAttribute('#pauseBtn','aria-pressed'),'true');
  await page.keyboard.press('Escape');assert.equal(await page.getAttribute('#pauseBtn','aria-pressed'),'false');
  await page.click('#restartBtn');assert.equal(await page.locator('#timer').textContent(),'00:00.0');
  await page.click('#backBtn');assert.ok(await page.locator('#menu').isVisible());assert.equal(await page.evaluate(()=>document.activeElement.id),'menuTitle');
  assert.deepEqual(errors,[]);
  console.log('PASS: unmodified release at /f1/, old asset cache primed, versioned CSS/JS fetched together, 14 tracks, selection, countdown, real input, pause/resume/restart/menu and no JavaScript errors. This is a local release check, not proof of GitHub Pages deployment.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>server.close());
