'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {createApp}=require('../index.cjs');
test('trusted Pages can read health/protocol diagnostics; unknown origins cannot use CORS',async()=>{
 const app=createApp({allowedOrigins:['https://gomeza2.github.io']});try{const {http}=await app.listen();
 for(const route of ['/health?check=1','/protocol']){const response=await fetch(http+route,{headers:{Origin:'https://gomeza2.github.io'}});assert.equal(response.status,200);assert.equal(response.headers.get('access-control-allow-origin'),'https://gomeza2.github.io');const body=await response.json();assert.equal(body.protocol,1);}
 const health=await(await fetch(http+'/health')).json();assert.deepEqual(health.allowedBrowserOrigins,['https://gomeza2.github.io']);
 const denied=await fetch(http+'/health',{headers:{Origin:'https://untrusted.invalid'}});assert.equal(denied.headers.get('access-control-allow-origin'),null);
 assert.equal((await fetch(http+'/health',{method:'OPTIONS',headers:{Origin:'https://gomeza2.github.io'}})).status,204);assert.equal((await fetch(http+'/health',{method:'OPTIONS',headers:{Origin:'https://untrusted.invalid'}})).status,403);
 }finally{await app.close();}
});
test('client diagnostic confirms real hello/welcome without creating rooms and tolerates unreadable HTTP',async()=>{
 const {inspect}=require('../../online-client.js'),WebSocket=require('ws');
 class BrowserSocket extends WebSocket{constructor(url){super(url,{origin:'https://gomeza2.github.io'});this.on('error',()=>{});}}
 const app=createApp({allowedOrigins:['https://gomeza2.github.io']});try{const {http}=await app.listen();
 const result=await inspect(http,{simulation:require('../protocol.cjs').SIMULATION,WebSocketImpl:BrowserSocket});assert.equal(result.health.ok,true);assert.equal(result.websocket.ok,true);assert.equal(app.service.rooms.size,0);
 const old=await inspect(http,{WebSocketImpl:BrowserSocket,fetchImpl:async()=>{throw Error('CORS')}});assert.equal(old.websocket.ok,true);assert.ok(old.error);
 const mismatch=await inspect(http,{simulation:'wrong',WebSocketImpl:BrowserSocket});assert.equal(mismatch.websocket.ok,false);assert.match(mismatch.websocket.detail,/incompatibles/);
 const abort=new AbortController();abort.abort();const cancelled=await inspect(http,{WebSocketImpl:BrowserSocket,signal:abort.signal});assert.equal(cancelled.websocket.ok,false);assert.equal(app.service.rooms.size,0);
 }finally{await app.close();}
});
