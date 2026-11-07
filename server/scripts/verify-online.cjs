'use strict';
// Public deployment smoke test. Creates two temporary clients, then removes their room.
const assert=require('node:assert/strict'),WebSocket=require('ws');
const {inspect,endpoint}=require('../../online-client.js'),{Peer}=require('../test/helpers.cjs');
const config=require('../../online-config.json');
const address=process.argv[2]||config.serverUrl,url=new URL(address),expectedCommit=process.argv[3]||'';
if(expectedCommit&&!/^[a-f0-9]{40,64}$/.test(expectedCommit))throw Error('Expected commit must be a Git SHA.');
if((process.env.HTTPS_PROXY||process.env.HTTP_PROXY)&&!['localhost','127.0.0.1','[::1]'].includes(url.hostname))throw Error('A network proxy is configured. This checker has no WebSocket proxy agent; run it in GitHub Actions or a browser with supported routing. Do not bypass the proxy.');
class BrowserSocket extends WebSocket{constructor(value){super(value,{origin:'https://gomeza2.github.io'});this.on('error',()=>{});}}
(async()=>{
 const end=Date.now()+360000;let result;
 while(Date.now()<end){
  result=await inspect(address,{simulation:config.simulation,WebSocketImpl:BrowserSocket,timeoutMs:12000});
  const revisionOK=!expectedCommit||result.health?.revision===expectedCommit;
  if(result.health?.ok&&revisionOK&&result.websocket.ok)break;
  console.log(JSON.stringify({waiting:true,http:result.error||result.health?.serverVersion,websocket:result.websocket.detail,revision:result.health?.revision||null}));
  await new Promise(r=>setTimeout(r,3000));
 }
 assert.equal(result?.health?.ok,true,'GET /health unavailable');assert.equal(result.websocket.ok,true,result.websocket.detail);assert.equal(result.health.protocol,config.protocol);assert.equal(result.health.simulation,config.simulation);
 if(expectedCommit)assert.equal(result.health.revision,expectedCommit,'Render is not running the pushed commit: enable auto-deploy or deploy latest commit.');
 const protocol=await(await fetch(new URL('/protocol',url),{signal:AbortSignal.timeout(15000)})).json();assert.equal(protocol.simulation,config.simulation);assert.equal(protocol.tracks.length,14);
 const peers=[];try{
  for(let i=0;i<2;i++)peers.push(await new Peer(endpoint(address),{origin:'https://gomeza2.github.io'}).open());
  const session=await peers[0].request({type:'create',name:'Deployment check'},'session'),joined=await peers[1].request({type:'join',code:session.code,name:'Check second client'},'session');assert.equal(joined.room.players.length,2);
  for(const peer of peers)await peer.request({type:'leave'},'left');
 }finally{for(const peer of peers)await peer.close();}
 console.log(JSON.stringify({passed:true,address:url.origin,serverVersion:result.health.serverVersion,clientBuild:result.health.clientBuild,revision:result.health.revision,checks:['health','protocol','WSS handshake','create/join','leave']}));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
