import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createRequire} from 'node:module';import vm from 'node:vm';
import {loadGame} from './helpers/game-harness.mjs';import {withoutSharedDriving} from './helpers/without-shared-driving.mjs';
const require=createRequire(import.meta.url),api=require('../driving-core.js'),engine=api.create();assert.equal(api.apiVersion,1);
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8'),pad={id:'Shared-core test',mapping:'standard',connected:true,index:0,axes:[0,0],buttons:Array.from({length:17},()=>({value:0,pressed:false}))};
const {game:g,element:e}=loadGame({sourceOverride:withoutSharedDriving(source),gamepads:[pad]});e('barrierMode').value='open';e('playerInput1').value='pad0';
const plain=x=>JSON.parse(JSON.stringify(x));assert.deepEqual(plain(engine.rules.models),plain(g.CAR_MODELS));assert.deepEqual(plain(engine.rules.materials),plain(g.TERRAIN_MATERIALS));assert.equal(engine.rules.worldSpeedScale,g.WORLD_SPEED_SCALE);assert.deepEqual(plain(engine.rules.tuning),plain(g.DRIVING_TUNING));assert.deepEqual(plain(engine.rules.recovery),plain(g.DRIVE_RECOVERY));
for(const name of ['accelerationAtSpeed','vehicleHandling','updateSteeringInertia','humanSteeringInput','updateDriveSpeed','applyGroundDrag'])assert.equal(engine[name].toString(),g[name].toString(),name+': extracted rule body changed');
const fields=['model','x','y','heading','yawRate','reverseHeld','speed','steer','drift','handbrake','braking','wheelTravel'];const motion=c=>Object.fromEntries(fields.map(k=>[k,c[k]]));
let cases=0,ticks=0;
for(const model of Object.keys(engine.rules.models))for(const stage of [9,2,4,5,6,8,10])for(const kind of ['corner','feather','brake','hand','reverse']){
 e('carModel').value=model;g.start('duo',stage);g.cars[1].done=true;const legacy=g.cars[0];g.placeCar(legacy,400,0);legacy.speed=kind==='reverse'?0:150;
 const state=Object.assign(engine.createState(model),motion(legacy)),count=kind==='reverse'?65:12;
 for(let n=0;n<count;n++){
  const controls={throttle:kind==='feather'?.25:kind==='reverse'||kind==='brake'?0:1,brake:kind==='reverse'?1:kind==='brake'?.5:0,steering:kind==='corner'||kind==='hand'?.4:0,hand:kind==='hand'};
  for(const b of pad.buttons){b.value=0;b.pressed=false;}pad.buttons[7].value=controls.throttle;pad.buttons[6].value=controls.brake;pad.buttons[2].value=controls.hand?1:0;pad.axes[0]=controls.steering?.15+.85*controls.steering:0;
  const input=g.controlsFor(0),before=g.nearestOnTrack(legacy.x,legacy.y),surface=g.terrainAt(legacy.x,legacy.y,before).material,safe=g.curvatureAt(before.progress).safeSpeed;
  const command=engine.humanControls(state,input,1/60);engine.stepVehicle(state,command,engine.rules.models[model],surface,safe,1/60);g.physics(legacy,0,1/60);
  assert.equal(g.terrainAt(legacy.x,legacy.y).offroad,false,'Parity scene left road; needs a terrain/collision adapter');assert.equal(legacy.flash,0,'Parity scene touched a wall');assert.deepEqual(motion(state),motion(legacy),`${model}/${stage}/${kind}/${n}: headless step differs from real legacy physics`);ticks++;
 }
 cases++;
}
// Grip and signed resistance for every material, including off-road gravel.
for(const model of Object.keys(engine.rules.models))for(const [material,definition] of Object.entries(engine.rules.materials))for(const speed of [-28,-12,0,14,100,260]){
 assert.deepEqual(plain(engine.vehicleHandling(Math.abs(speed),engine.rules.models[model],material,80,.4,true)),plain(g.vehicleHandling(Math.abs(speed),g.CAR_MODELS[model],material,80,.4,true)));
 const drag=(definition.drag+5*definition.edgeDrag+Math.abs(speed)*(definition.speedDrag||0))*engine.rules.models[model].grass;assert.equal(engine.applyGroundDrag(speed,drag,1/60,14),g.applyGroundDrag(speed,drag,1/60,14));
}
// Node can load/use the production module with browser/storage/clock access forbidden.
const sandbox={module:{exports:{}}};for(const name of ['window','document','localStorage','AudioContext','requestAnimationFrame','Date'])Object.defineProperty(sandbox,name,{get(){throw Error('Core accessed '+name)}});vm.createContext(sandbox);vm.runInContext(readFileSync(new URL('../driving-core.js',import.meta.url),'utf8'),sandbox);const isolated=sandbox.module.exports.create(),probe=isolated.createState('speed');for(let n=0;n<300;n++){const c=isolated.humanControls(probe,{throttle:1,brake:0,steering:0,hand:false},1/60);isolated.stepVehicle(probe,c,isolated.rules.models.speed,'asphalt',220,1/60);}assert.equal(probe.speed,260);
// Interleaving independent engines/vehicles must produce exactly their solo trajectories.
const a=api.create(),b=api.create();assert.notStrictEqual(a.rules,b.rules);assert.notStrictEqual(a.rules.models,b.rules.models);assert.throws(()=>{a.rules.models.balanced.maxSpeed=999},TypeError);assert.equal(b.rules.models.balanced.maxSpeed,232);assert.throws(()=>a.createState('__proto__'),RangeError);
function input(n,second){return second?{throttle:.6,brake:n%70<20?.3:0,steering:n%60<30?.2:-.2,hand:false}:{throttle:n<80?0:1,brake:n<80?1:0,steering:n>150?.3:0,hand:n>180&&n<200};}
function advance(e,s,n,second){const c=e.humanControls(s,input(n,second),1/60);e.stepVehicle(s,c,e.rules.models[s.model],'asphalt',100,1/60);}
const sa=a.createState(),sb=b.createState('rally'),ra=a.createState(),rb=b.createState('rally');for(let n=0;n<300;n++){advance(a,sa,n,false);advance(b,sb,n,true);}for(let n=0;n<300;n++)advance(b,rb,n,true);for(let n=0;n<300;n++)advance(a,ra,n,false);assert.deepEqual(sa,ra);assert.deepEqual(sb,rb);
const failsafe=engine.createState();for(let n=0;n<100;n++){const command=engine.humanControls(failsafe,{throttle:0,brake:1,steering:0,hand:false},1/60,false);assert.equal(command.reverse,false);engine.stepVehicle(failsafe,command,engine.rules.models.balanced,'asphalt',100,1/60);}assert.equal(failsafe.speed,0);assert.equal(failsafe.reverseHeld,0);
console.log(JSON.stringify({cases,ticks,headlessCap:probe.speed,isolatedVehicles:2}));console.log('PASS: standalone production Node module, four models/seven routes/five control sequences plus all material forces match legacy full physics exactly, immutable owned rules, isolated vehicle states, reverse-safe fail-safe intent and no browser/storage/clock dependency. This is not full race/server isolation yet.');
