// Feed identical authoritative snapshots to an archived and current presentation module.
'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const current=require('../../online-client.js'),{SIMULATION}=require('../../server/protocol.cjs');
if(!process.argv[2])throw new Error('Usage: node tests/experiments/compare-online-jitter.cjs /path/to/archived-online-client.cjs');
function run(api){
 let at=0,ws;class Socket{constructor(){ws=this;this.readyState=1;}send(){}close(){this.readyState=3;}message(m){this.onmessage({data:JSON.stringify(m)});}}
 const client=api.create({simulation:SIMULATION,WebSocketImpl:Socket,now:()=>at});
 try{
  client.connect('https://race.example');ws.message({type:'hello',protocol:1,simulation:SIMULATION});ws.message({type:'welcome'});ws.message({type:'session',code:'ABC234',pilotId:0,resumeToken:'test',room:{phase:'running'}});
  let backwards=0,previous=-Infinity,canonical={player:0,x:0,y:0,heading:0};
  function sample(){const x=client.pose(canonical).x;if(x<previous-1e-9)backwards++;previous=x;}
  function snapshot(tick){canonical={player:0,x:tick*3,y:0,heading:0};ws.message({type:'snapshot',raceId:'r',tick,inputs:[],state:{cars:[canonical]}});sample();}
  snapshot(0);for(let tick=3;tick<=90;tick+=3){const gap=[20,80,150,10,40][tick/3%5];for(let elapsed=0;elapsed<gap;elapsed+=10){at+=10;sample();}snapshot(tick);}
  return backwards;
 }finally{client.close();}
}
const before=run(require(path.resolve(process.argv[2]))),after=run(current);
assert.ok(before>0,'Archived module does not demonstrate the target defect');assert.equal(after,0);
console.log(JSON.stringify({fixture:'31 snapshots, 10-ms presentation sampling, variable 10–150-ms delivery gaps',backwardsBefore:before,backwardsAfter:after}));
