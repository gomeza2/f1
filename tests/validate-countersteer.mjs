import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {withoutAngledTraffic} from './helpers/without-angled-traffic.mjs';
import {loadGame} from './helpers/game-harness.mjs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8'),frozen=JSON.parse(readFileSync(new URL('./fixtures/controls-0.58.json',import.meta.url),'utf8'));
// Reverse the declared traffic correction and controller migration; retain the historical core hash.
const previous=withoutAngledTraffic(source).replace('const PHYSICS_VERSION=6;','const PHYSICS_VERSION=5;').replace(/function humanSteeringInput[\s\S]*?\n}\n(?=function physics)/,'').replace('car.steer=humanSteeringInput(car.steer,steering,hand,dt);','car.steer+=(steering-car.steer)*(1-Math.exp(-dt*(hand?DRIVING_TUNING.handInputResponse:DRIVING_TUNING.inputResponse)));');
const core=previous.slice(previous.indexOf('const AI_DRIVERS='),previous.indexOf('function getTrackPath')).replace('(model.accelerationTaper??DRIVING_TUNING.accelerationTaper)*','DRIVING_TUNING.accelerationTaper*'); // b1 adds a model-specific taper; other shared rules remain frozen.
assert.equal(createHash('sha256').update(core).digest('hex'),frozen.coreSha256,'The shared driving/AI/collision core changed during a human-controller adjustment');
assert.equal(createHash('sha256').update(source.split('\n').find(line=>line.startsWith('const DRIVING_TUNING='))).digest('hex'),frozen.tuningSha256,'Shared handling tuning changed');
const current=loadGame(),before=loadGame({sourceOverride:previous});
for(const {element:e} of [current,before])e('barrierMode').value='open';
function probe(fixture,stage,model){const {game:g,element:e}=fixture;e('carModel').value=model;g.start('solo',stage);g.cars[1].done=true;const c=g.cars[0];g.placeCar(c,600,0);c.speed=150;g.setKeys({w:true,d:true});for(let i=0;i<15;i++)g.physics(c,0,1/60);const heading=c.heading;g.setKeys({w:true,a:true});let reversal=null,overshoot=0;for(let i=1;i<=24;i++){g.physics(c,0,1/60);if(reversal===null&&c.yawRate<0)reversal=i/60;overshoot=Math.max(overshoot,Math.atan2(Math.sin(c.heading-heading),Math.cos(c.heading-heading)));assert.ok(Math.abs(c.steer)<=1);}return {reversal,overshoot,speed:c.speed};}
for(const stage of [0,2,4])for(const model of Object.keys(current.game.CAR_MODELS)){const old=probe(before,stage,model),now=probe(current,stage,model);assert.ok(now.reversal<old.reversal);assert.ok(now.overshoot<old.overshoot*.89);if(stage===0)assert.ok(Math.abs(now.speed-old.speed)<1e-9,'Countersteer added speed');console.log(JSON.stringify({stage,model,before:old,current:now}));}
const g=current.game;
for(const hand of [false,true])for(const sign of [-1,1])for(const duration of [.025,.05,.1,.2]){
 const integrate=rate=>{let s=sign;for(let t=0;t<duration-1e-12;){const dt=Math.min(1/rate,duration-t);s=g.humanSteeringInput(s,-sign,hand,dt);t+=dt;}return s;};
 assert.ok(Math.abs(integrate(30)-integrate(120))<1e-12,'Sign crossing depends on step subdivision');
}
for(const target of [0,1,.1,-.1]){const expected=target+(1-target)*Math.exp(-14*.05);assert.ok(Math.abs(g.humanSteeringInput(1,target,false,.05)-expected)<1e-12,'Neutral/build-up/fine analog input was changed');}
assert.equal(g.humanSteeringInput(1,-1,false,0),1);
g.bestLapRecords['SUNSET CIRCUIT@3:p5:r1:s1']=30;g.start('solo',0);assert.equal(g.lapRecordKey(),'SUNSET CIRCUIT@3:p6:r1:s1:b1');g.saveBestLap(g.lapRecordKey(),31);assert.equal(g.bestLapRecords['SUNSET CIRCUIT@3:p5:r1:s1'],30);
console.log('PASS: 12 actual-physics countersteer cases improve reversal/overshoot, no added straight speed; exact sign crossing at 30/120 Hz, unchanged neutral/build/fine analog, p5 records retained, historical core hash preserved after declared AI/controller/b1 migration reversal. Human comfort remains unverified.');
