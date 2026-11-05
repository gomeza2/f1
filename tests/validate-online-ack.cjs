'use strict';
const assert=require('node:assert/strict'),{create}=require('../online-client.js'),{SIMULATION}=require('../server/protocol.cjs');
let time=0,ws;
class Socket{constructor(){ws=this;this.readyState=1;this.messages=[];}send(raw){this.messages.push(JSON.parse(raw));}close(){this.readyState=3;}message(m){this.onmessage({data:JSON.stringify(m)});}}
const client=create({simulation:SIMULATION,WebSocketImpl:Socket,now:()=>time});
try{
 client.connect('https://test.example');ws.message({type:'hello',protocol:1,simulation:SIMULATION});ws.message({type:'welcome'});ws.message({type:'session',code:'ABC234',pilotId:2,resumeToken:'test',room:{phase:'running'}});
 const packet=(tick,ack,raceId='race')=>({type:'snapshot',raceId,tick,inputs:[{pilotId:2,seq:ack}],state:{cars:[]}});
 ws.message(packet(0,-1));assert.equal(client.metrics.ackDelayMs,null);
 const controls={throttle:1,brake:0,steering:0,hand:false};client.input(controls);assert.equal(client.metrics.pendingInputs,1);time=90;ws.message(packet(3,0));assert.equal(client.metrics.ackDelayMs,90);assert.equal(client.metrics.pendingInputs,0);
 time=200;ws.message(packet(6,0));assert.equal(client.metrics.ackDelayMs,90,'Duplicate ack inflated delay');
 client.input(controls);time=310;ws.message(packet(9,1));assert.equal(client.metrics.ackDelayMs,94);assert.equal(client.metrics.pendingInputs,0);
 for(let i=0;i<100;i++){time++;client.input(controls);}assert.equal(client.metrics.pendingInputs,64);
 assert.ok(ws.messages.filter(m=>m.type==='input').every(m=>Object.keys(m).sort().join()===['controls','raceId','seq','type'].sort().join()),'Forecast/state data leaked into network controls');
 ws.message(packet(0,-1,'new-race'));assert.deepEqual(client.metrics,{ackDelayMs:null,pendingInputs:0});client.close();assert.deepEqual(client.metrics,{ackDelayMs:null,pendingInputs:0});
}finally{client.close();}
console.log('PASS: bounded 64-input ack history, observed acknowledgement delay/EWMA without duplicate sampling, race/close reset and unchanged command-only wire format. This metric includes snapshot batching, not measured ping.');
