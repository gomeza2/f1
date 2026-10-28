import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {loadGame} from './helpers/game-harness.mjs';import {withoutPedalBlend} from './helpers/without-pedal-blend.mjs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8'),old=withoutPedalBlend(source),frozen=JSON.parse(readFileSync(new URL('./fixtures/coast-0.66.json',import.meta.url),'utf8'));
assert.notEqual(source,old,'Missing pedal correction');assert.equal(createHash('sha256').update(old.slice(old.indexOf('const AI_DRIVERS='),old.indexOf('function getTrackPath'))).digest('hex'),frozen.drivingCoreSha256,'Changes beyond the declared pedal correction');
const pad=()=>({id:'Pedal test',mapping:'standard',connected:true,index:0,axes:[0,0],buttons:Array.from({length:17},()=>({value:0,pressed:false}))});
const p=pad(),bp=pad(),now=loadGame({gamepads:[p]}),before=loadGame({sourceOverride:old,gamepads:[bp]});
function probe(fixture,controller,{throttle=0,brake=0,model='balanced',hand=false,frames=30,keyboard=null,stage=9,progress=400,initial=200,rate=60}={}){
 const {game:g,element:e}=fixture;e('carModel').value=model;e('barrierMode').value='open';e('playerInput1').value=keyboard?'keyboard':'pad0';g.start('duo',stage);g.setCountdown(0);g.cars[1].done=true;
 const c=g.cars[0];g.placeCar(c,progress,0);c.speed=initial;g.setKeys(keyboard||{});for(const b of controller.buttons){b.value=0;b.pressed=false;}controller.buttons[7].value=throttle;controller.buttons[6].value=brake;controller.buttons[2].value=hand?1:0;
 const start={x:c.x,y:c.y};for(let n=0;n<frames;n++)g.advanceRaceFrame(1/rate);
 return {speed:c.speed,distance:Math.hypot(c.x-start.x,c.y-start.y),x:c.x,y:c.y,heading:c.heading,steer:c.steer,drift:c.drift,yaw:c.yawRate,lap:c.lap,progress:c.progress};
}
const rows=[];
for(const model of Object.keys(now.game.CAR_MODELS)){
 const zero=probe(now,p,{model}),tiny=probe(now,p,{model,throttle:.001}),oldZero=probe(before,bp,{model}),oldTiny=probe(before,bp,{model,throttle:.001});
 assert.ok(oldTiny.speed-oldZero.speed>13,'Before-control no longer reproduces drag discontinuity');assert.ok(tiny.speed-zero.speed<.07,'Analog throttle still jumps at zero');
 let last=-Infinity;for(const throttle of [0,.001,.01,.05,.25,.5,.75,1]){const result=probe(now,p,{model,throttle});assert.ok(result.speed>=last);last=result.speed;assert.ok(result.speed<=now.game.CAR_MODELS[model].maxSpeed);}
 const stop=probe(now,p,{model,brake:1,frames:120}),held=probe(now,p,{model,throttle:1,brake:1,frames:120}),oldHeld=probe(before,bp,{model,throttle:1,brake:1,frames:120});assert.deepEqual(held,stop,'Full brake is weakened by held throttle');assert.equal(stop.speed,0);assert.ok(oldHeld.distance>held.distance*1.4,'Before-control does not reproduce pedal conflict');
 for(const hand of [false,true])for(const throttle of [.001,.25,.5,1])assert.deepEqual(probe(now,p,{model,hand,throttle,brake:1,frames:60}),probe(now,p,{model,hand,brake:1,frames:60}));
 let prior=Infinity;for(const brake of [0,.1,.25,.5,.75,1]){const result=probe(now,p,{model,throttle:1,brake,frames:20});assert.ok(result.speed<=prior,'More brake adds speed');prior=result.speed;}
 const keyBrake=probe(now,p,{model,keyboard:{s:true},frames:120}),both=probe(now,p,{model,keyboard:{w:true,s:true},frames:120});assert.deepEqual(keyBrake,both,'Keyboard does not share brake priority');
 rows.push({model,feather:{before0:oldZero.speed,beforeTiny:oldTiny.speed,now0:zero.speed,nowTiny:tiny.speed},stopping:{beforeHeld:oldHeld.distance,nowHeld:held.distance,released:stop.distance}});
}
// Preserve existing digital throttle, lift, handbrake rotation, steering and terrain paths.
let endpoints=0;
for(const stage of [0,2,4,5,8,10])for(const keyboard of [{},{w:true},{w:true,d:true,' ':true}]){
 const options={stage,keyboard,frames:12,initial:140};assert.deepEqual(probe(now,p,options),probe(before,bp,options),'Existing non-overlap digital handling changed');endpoints++;
}
for(const rate of [20,30,60,120,144]){
 const a=probe(now,p,{initial:100,throttle:.4,brake:.2,frames:rate,rate}),b=probe(now,p,{initial:100,throttle:.4,brake:.2,frames:60,rate:60});assert.deepEqual(a,b,'Pedals bypass the fixed simulation clock');
}
assert.equal(now.game.PHYSICS_VERSION,6);assert.deepEqual(JSON.parse(JSON.stringify(now.game.CAR_MODELS)),frozen.models);assert.deepEqual(JSON.parse(JSON.stringify(now.game.TERRAIN_MATERIALS)),frozen.materials);
now.game.bestLapRecords['CHAMPION ROAD@2:p6:s1:b1']=25;now.game.start('solo',9);assert.equal(now.game.lapRecordKey(),'CHAMPION ROAD@2:p6:s1:b1');assert.equal(now.game.bestLapRecords[now.game.lapRecordKey()],25);
console.log(JSON.stringify({rows,endpoints}));console.log('PASS: four-model actual control/physics probes, continuous feathering, proportional brake priority including held handbrake, keyboard parity, 18 unchanged digital terrain/steering paths, identical fixed-step motion at 20–144 Hz, unchanged limits/models/materials/records. No lateral-velocity drift is claimed.');
