'use strict';
const assert=require('node:assert/strict'),{create}=require('../online-client.js'),{SIMULATION}=require('../server/protocol.cjs');
function scene(){
 let clock=0,id=0;const queue=new Map(),sockets=[],status=[],messages=[];
 const timers={setTimeout(fn,delay){const key=++id;queue.set(key,{at:clock+delay,fn});return key;},clearTimeout(key){queue.delete(key);}};
 class WS{
  constructor(){this.readyState=1;this.out=[];sockets.push(this);}
  send(raw){this.out.push(JSON.parse(raw));}
  close(){this.readyState=3;this.onclose?.();}
  message(m){this.onmessage?.({data:JSON.stringify(m)});}
 }
 const client=create({simulation:SIMULATION,WebSocketImpl:WS,now:()=>clock,timers,onStatus:(state,detail)=>status.push({state,detail}),onMessage:m=>messages.push(m)});
 function advance(ms){const end=clock+ms;for(;;){const next=[...queue].sort((a,b)=>a[1].at-b[1].at)[0];if(!next||next[1].at>end)break;queue.delete(next[0]);clock=next[1].at;next[1].fn();}clock=end;}
 function welcome(ws=sockets.at(-1)){ws.message({type:'hello',protocol:1,simulation:SIMULATION});ws.message({type:'welcome'});}
 return {client,sockets,status,messages,advance,welcome,queue,get now(){return clock;}};
}
// Cold service: several failures/stalled handshakes can occur before the server wakes.
{
 const s=scene();try{
  s.client.connect('https://race.example',{type:'create',name:'Driver'});s.sockets[0].close();assert.equal(s.status.at(-1).state,'warming');s.advance(1000);
  s.advance(10000);assert.equal(s.status.at(-1).state,'warming');s.advance(1000);
  assert.equal(s.sockets.length,3);assert.equal(s.now,12000);s.welcome();
  const commands=s.sockets.flatMap(ws=>ws.out).filter(m=>m.type==='create');assert.equal(commands.length,1);
  s.sockets.at(-1).message({type:'session',code:'ABC234',pilotId:0,resumeToken:'private',room:{phase:'lobby'}});assert.equal(s.client.session.pilotId,0);assert.equal(s.queue.size,0);
 }finally{s.client.close();}
}
{
 const s=scene();s.client.connect('https://race.example',{type:'join',code:'ABC234'});s.advance(90000);assert.equal(s.status.at(-1).state,'lost');assert.equal(s.queue.size,0);const count=s.sockets.length;s.advance(90000);assert.equal(s.sockets.length,count);s.client.close();
}
{
 const s=scene();s.client.connect('https://race.example',{type:'create'});s.sockets[0].close();s.client.close();s.advance(100000);assert.equal(s.sockets.length,1);assert.equal(s.queue.size,0);assert.equal(s.client.session,null);
}
{
 const s=scene();s.client.connect('https://race.example',{type:'create'});s.welcome();s.sockets[0].close();s.advance(5000);assert.equal(s.status.at(-1).state,'lost');assert.equal(s.sockets.length,1,'Ambiguous create was replayed');s.client.close();
}
{
 const s=scene();try{
  s.client.connect('https://race.example');s.welcome();s.sockets[0].message({type:'session',code:'ABC234',pilotId:0,resumeToken:'old',room:{phase:'running'}});s.sockets[0].close();s.advance(8500);assert.equal(s.status.at(-1).state,'lost');assert.equal(s.queue.size,0,'Reconnect inherited initial 90s budget');
 }finally{s.client.close();}
}
{
 const s=scene();try{
  s.client.connect('https://race.example');s.welcome();s.sockets[0].message({type:'session',code:'ABC234',pilotId:0,resumeToken:'old',room:{phase:'running'}});s.sockets[0].close();s.advance(500);s.welcome();s.advance(8000);assert.equal(s.status.at(-1).state,'lost');assert.equal(s.queue.size,0,'Welcome removed the resume confirmation deadline');
 }finally{s.client.close();}
}
// A delayed burst must not rewind the presentation timeline or extrapolate authority.
{
 const s=scene();try{
  s.client.connect('https://race.example');s.welcome();const ws=s.sockets[0];ws.message({type:'session',code:'ABC234',pilotId:0,resumeToken:'private',room:{phase:'running'}});
  const snapshot=(tick,raceId='jitter',reverse=false)=>ws.message({type:'snapshot',raceId,tick,inputs:[],state:{cars:[{player:0,x:(reverse?-1:1)*tick*3,y:10,heading:tick%2?3.1:-3.1}]}});
  let last=-Infinity,canonical={player:0,x:0,y:10,heading:0};snapshot(0);
  function sample(){const pose=s.client.pose(canonical);assert.ok(pose.x>=last-1e-9,'Jitter rewound the car');assert.ok(pose.x<=canonical.x);last=pose.x;}
  for(let tick=3;tick<=90;tick+=3){
   const gap=[20,80,150,10,40][(tick/3)%5];
   for(let elapsed=0;elapsed<gap;elapsed+=10){s.advance(10);sample();}
   snapshot(tick);canonical={player:0,x:tick*3,y:10,heading:0};sample();
  }
  s.advance(2000);assert.equal(s.client.pose(canonical).x,270);assert.ok(s.client.stale);snapshot(93);const next={...canonical,x:279};assert.equal(s.client.pose(next).x,270,'Late state pulled presentation back');
  snapshot(0,'next-race',true);snapshot(3,'next-race',true);s.advance(1000);assert.equal(s.client.pose({player:0,x:-9,y:10,heading:0}).x,-9,'New race/reverse retained previous playhead');
 }finally{s.client.close();}
}
console.log('PASS: 12-second cold start, single create after retries, 90-second budget, cancel without ghosts, ambiguous-command protection, 8.5-second resume deadline and monotonic bounded jitter presentation; clocks/sockets simulated.');
