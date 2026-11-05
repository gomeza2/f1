'use strict';
const assert=require('node:assert/strict');
const api=require('../online-client.js');
const {SIMULATION}=require('../server/protocol.cjs');
const config=require('../online-config.json');
assert.equal(config.build,require('node:fs').readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8').match(/name="application-version" content="([^"]+)"/)[1]);
assert.equal(config.simulation,SIMULATION);assert.equal(config.protocol,1);
assert.equal(api.endpoint('https://race.example'),'wss://race.example/ws');
assert.equal(api.endpoint('http://localhost:8787/ws'),'ws://localhost:8787/ws');
for(const value of ['ftp://race.example','https://user:secret@race.example','https://race.example/ws?token=secret','https://race.example/other','https://race.example/#secret'])assert.throws(()=>api.endpoint(value));
assert.throws(()=>api.endpoint('http://race.example',true));
class Socket{
 static all=[];
 constructor(url){this.url=url;this.readyState=1;this.out=[];Socket.all.push(this);}
 send(s){this.out.push(JSON.parse(s));}
 close(){this.readyState=3;this.onclose?.();}
 message(m){this.onmessage?.({data:JSON.stringify(m)});}
}
(async()=>{
let at=0;const received=[],statuses=[];
const client=api.create({simulation:SIMULATION,WebSocketImpl:Socket,now:()=>at,onMessage:m=>received.push(m),onStatus:(s,d)=>statuses.push([s,d])});
try{
 client.connect('http://localhost:8787',{type:'create',name:'Pilot'});const ws=Socket.all.at(-1);
 ws.message({type:'hello',protocol:1,simulation:SIMULATION});assert.equal(ws.out.at(-1).type,'hello');assert.equal(ws.out.length,1);
 ws.message({type:'welcome'});assert.deepEqual(ws.out.at(-1),{type:'create',name:'Pilot'});
 ws.message({type:'session',code:'ABC234',pilotId:2,resumeToken:'private',room:{phase:'running'}});
 const controls={throttle:1,brake:0,steering:.3,hand:false};
 for(let tick=0;tick<=9;tick+=3){at=tick*1000/60;ws.message({type:'snapshot',raceId:'r1',tick,inputs:[{pilotId:2,seq:40}],state:{cars:[{player:2,x:tick,y:0,heading:tick===0?3.1:-3.1}]}});}
 const canonical={player:2,x:9,y:0,heading:-3.1};const original=JSON.stringify(canonical);
 assert.equal(client.pose(canonical).x,3);at+=1000;assert.equal(client.pose(canonical).x,9,'Presentation extrapolated beyond authority');assert.equal(JSON.stringify(canonical),original);
 assert.ok(client.stale);client.input(controls);assert.deepEqual(ws.out.at(-1),{type:'input',raceId:'r1',seq:41,controls});
 ws.message({type:'snapshot',raceId:'r1',tick:3,inputs:[],state:{cars:[]}});assert.equal(client.tick,9,'Old snapshot replaced current frame');
 ws.close();assert.equal(client.input(controls),false);
 await new Promise(resolve=>setTimeout(resolve,520));const reconnect=Socket.all.at(-1);assert.notEqual(reconnect,ws);assert.equal(client.input(controls),false);
 reconnect.message({type:'hello',protocol:1,simulation:SIMULATION});reconnect.message({type:'welcome'});
 assert.deepEqual(reconnect.out.at(-1),{type:'resume',code:'ABC234',token:'private'});assert.equal(client.input(controls),false,'Input sent before resume acknowledgement');
 reconnect.message({type:'session',code:'ABC234',pilotId:2,resumeToken:'rotated',room:{phase:'running'}});assert.equal(client.input(controls),true);assert.equal(client.session.resumeToken,'rotated');
 client.close();ws.message({type:'session',code:'ATTACK',pilotId:0,resumeToken:'bad'});assert.equal(client.session,null);assert.ok(!ws.url.includes('private'));
 client.connect('https://race.example');const wrong=Socket.all.at(-1);wrong.message({type:'hello',protocol:1,simulation:'wrong'});assert.equal(client.session,null);assert.equal(statuses.at(-1)[0],'lost');assert.equal(wrong.out.length,0,'Client echoed incompatible server fingerprint');
}finally{client.close();}
console.log('PASS: simulation fingerprint, endpoint/TLS/credential rules, handshake, command-only inputs/ack, stale tick rejection, bounded interpolation, canonical state immutability and closed-socket isolation.');

})().catch(error=>{console.error(error);process.exitCode=1;});
