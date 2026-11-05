// Real DOM/native WebSocket retries against a local cold-start gate, not Render itself.
const {chromium}=require('playwright'),{WebSocketServer}=require('../server/node_modules/ws');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const {RoomService}=require('../server/room-service.cjs');
const root=path.resolve(__dirname,'..');
(async()=>{
 let deny=true,attempts=0;const errors=[],service=new RoomService(),wss=new WebSocketServer({noServer:true});
 const server=http.createServer((req,res)=>{
  const file=new URL(req.url,'http://local').pathname.slice(1)||'index.html';
  if(file==='favicon.ico'){res.writeHead(204).end();return;}
  if(!['index.html','style.css','script.js','driving-core.js','track-core.js','race-rules.js','race-session.js','ghost-lap.js','engine-audio.js','online-client.js','online-config.json'].includes(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.json')?'application/json':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(path.join(root,file)));
 });
 server.on('upgrade',(req,socket,head)=>{attempts++;if(deny){socket.end('HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');return;}wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws));});
 wss.on('connection',ws=>{const c=service.connect({send:m=>ws.send(JSON.stringify(m)),close:(code,reason)=>ws.close(code,reason)});ws.on('message',data=>service.receive(c,data.toString()));ws.on('close',()=>service.disconnect(c));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1100,height:800}});page.on('pageerror',e=>errors.push(e.message));await page.route('https://fonts.googleapis.com/**',route=>route.abort());
  const url='http://127.0.0.1:'+server.address().port;await page.goto(url);await page.click('#onlineSetupBtn');await page.waitForFunction(()=>!document.getElementById('onlineCreate').disabled);
  assert.equal(await page.locator('#onlineServer').inputValue(),'https://pixel-grand-prix-rooms.onrender.com');await page.fill('#onlineServer',url);await page.click('#onlineCreate');
  await page.waitForFunction(()=>document.getElementById('onlineStatus').textContent.includes('INICIANDO SERVIDOR'));
  assert.equal(await page.locator('#onlineCreate').isDisabled(),true);assert.equal(await page.locator('#onlineJoin').isDisabled(),true);await page.click('#onlineCancel');const cancelled=attempts;
  await page.waitForTimeout(1200);assert.equal(attempts,cancelled);assert.equal(service.rooms.size,0);assert.equal(await page.locator('#onlineCreate').isDisabled(),false);
  await page.click('#onlineCreate');await page.waitForFunction(()=>document.getElementById('onlineStatus').textContent.includes('INICIANDO SERVIDOR'));await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.getElementById('onlineLobby').open);const escaped=attempts;await page.waitForTimeout(1200);assert.equal(attempts,escaped);assert.equal(service.rooms.size,0);
  deny=false;await page.click('#onlineSetupBtn');await page.click('#onlineCreate');await page.waitForSelector('#onlineRoom:not(.hidden)');assert.equal(service.rooms.size,1);assert.equal([...service.rooms.values()][0].players.size,1);
  await page.click('#onlineLeave');await page.waitForFunction(()=>document.getElementById('onlineRoom').classList.contains('hidden'));await page.click('#onlineClose');assert.deepEqual(errors,[]);
  console.log('PASS: configured public default, native WebSocket 503/warming status, disabled duplicate actions, explicit cancellation and Escape stop retries with no rooms; fresh retry creates exactly one real room. Local gate/RoomService, not a public Render check.');
 }finally{await browser?.close();service.shutdown();for(const ws of wss.clients)ws.terminate();await new Promise(r=>wss.close(r));await new Promise(r=>server.close(r));}
})().catch(error=>{console.error(error);process.exitCode=1;});
