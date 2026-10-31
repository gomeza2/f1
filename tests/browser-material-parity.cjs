// Optional: compare actual road pixels across a material-renderer refactor.
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
assert.ok(process.env.ROAD_SOURCE_BASELINE,'Set ROAD_SOURCE_BASELINE to the preserved script.js from before the material change');
const sources={before:fs.readFileSync(process.env.ROAD_SOURCE_BASELINE,'utf8'),current:fs.readFileSync(path.join(root,'script.js'),'utf8')};
const bridge=`window.roadParity=async function(stageIndex,quality){$('graphics').value=quality;start('solo',stageIndex);cancelAnimationFrame(raf);const data=trackSurfaceCache.getContext('2d').getImageData(0,0,trackSurfaceCache.width,trackSurfaceCache.height).data;const hash=await crypto.subtle.digest('SHA-256',data);return Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,'0')).join('')};`;
const server=http.createServer((req,res)=>{const name=req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0].slice(1);if(!['index.html','style.css','driving-core.js','engine-audio.js','script.js'].includes(name)){res.writeHead(404).end();return}res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(path.join(root,name)))});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const results={},stages=process.env.PARITY_STAGES?process.env.PARITY_STAGES.split(',').map(Number):[0,1,2,3,4,6];assert.ok(stages.length>0&&new Set(stages).size===stages.length&&stages.every(s=>Number.isInteger(s)&&s>=0&&s<14),'Invalid PARITY_STAGES');
  for(const [version,source] of Object.entries(sources)){
   const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.route(/\/script\.js(?:\?.*)?$/,r=>r.fulfill({contentType:'text/javascript',body:source.replace(/\}\)\(\);\s*$/,bridge+'})();')}));await page.goto('http://127.0.0.1:'+server.address().port);results[version]={};
   for(const stage of stages)for(const quality of ['high','retro','lite'])results[version][stage+quality]=await page.evaluate(([stage,quality])=>window.roadParity(stage,quality),[stage,quality]);
   assert.deepEqual(errors,[]);await page.close();
  }
  assert.deepEqual(results.current,results.before,'Material extraction changed an existing road image');console.log(`PASS: ${stages.length*3} actual Canvas road images are byte-identical on ${stages.length} selected roads/three qualities, no JavaScript errors. Changed routes must be tested separately.`);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
