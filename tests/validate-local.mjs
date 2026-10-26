import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const pads=Array(4).fill(null),{game,element}=loadGame({gamepads:pads});
const models=['balanced','corner','speed','rally'],paints=['pink','cyan','lime','orange'];
for(let i=1;i<4;i++){element('playerModel'+(i+1)).value=models[i];element('playerColor'+(i+1)).value=paints[i];}
const uniqueKeys=Array.from({length:4},(_,i)=>Object.values(game.keyFor(i))).flat();
assert.equal(new Set(uniqueKeys).size,20,'Players share a driving key');
assert.ok(uniqueKeys.every(key=>!['r','c','escape'].includes(key)));
for(const count of [2,3,4]){
 element('localPlayerCount').value=String(count);game.updateLocalLobby();
 assert.match(element('localStart').textContent,new RegExp(count+' JUGADORES'));
 for(const stage of [0,2,3,6,13]){
  game.start('duo',stage);assert.equal(game.cars.length,count);assert.ok(game.cars.every(car=>!car.isAI));
  assert.deepEqual(Array.from(game.cars,c=>c.model),models.slice(0,count));
  assert.equal(new Set(game.cars.map(c=>c.color)).size,count);
  for(const a of game.cars)for(const b of game.cars)if(a!==b)assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=23);
  const panoramic=game.raceCamera(0,game.track.worldWidth*3,game.track.worldHeight*3);assert.equal(panoramic.x,game.track.worldWidth/2);assert.equal(panoramic.y,game.track.worldHeight/2);
  const views=game.drivingViewports();assert.equal(views.length,count);
  for(const a of views){assert.equal(a.height,count>2?320:640);assert.ok(a.left>=0&&a.top>=0&&a.left+a.width<=views[0].width*2&&a.top+a.height<=640);for(const b of views)if(a!==b)assert.ok(a.left+a.width<=b.left||b.left+b.width<=a.left||a.top+a.height<=b.top||b.top+b.height<=a.top);}
  for(let active=0;active<count;active++){
   game.cars.forEach((car,i)=>{game.placeCar(car,500+i*180,0);car.speed=0;car.steer=0;});
   const k=game.keyFor(active);game.setKeys({[k.up]:true,[k.right]:true});
   const [x,y]=[game.cars[active].x,game.cars[active].y];game.tick(1/60);
   assert.ok(game.cars[active].speed>0&&game.cars[active].steer>0);assert.ok(Math.hypot(game.cars[active].x-x,game.cars[active].y-y)>0);
   game.cars.forEach((car,i)=>{if(i!==active){assert.equal(car.speed,0);assert.equal(car.steer,0);}});
  }
  game.setElapsed(25);game.cars.forEach((car,i)=>{car.lapStartTime=10+i;car.lapTimes=[20+i];car.speed=80+i*15;car.checkpointPasses=i;car.lap=1;});game.updateTelemetry();game.drawFrame();
  for(let i=1;i<=count;i++){
   assert.equal(element('playerSpeed'+i).textContent,(80+(i-1)*15)+' km/h');assert.match(element('playerHudName'+i).textContent,new RegExp('P'+i));
   assert.match(element('playerProgress'+i).textContent,new RegExp('CP '+(i-1)+'/'));assert.equal(element('playerTime'+i).textContent,'VUELTA '+game.format(16-i));assert.equal(element('playerBest'+i).textContent,'MEJOR '+game.format(19+i));
  }
 }
 // Four distinct result/season identities, including DNF, restart and next round.
 game.start('duo',0);
 game.cars.forEach((car,i)=>{car.done=i!==0;car.finishTime=i===0?null:60+count-i;car.lap=i===0?1:3;car.raceProgress=100;});game.setElapsed(90);game.finishRace();
 assert.equal(game.running,false);assert.match(element('finishSummary').textContent,new RegExp('P'+count));
 assert.equal(game.championship['player'+count],25);assert.equal(game.championship.player1,0);
 const points=JSON.stringify(game.championship);game.finishRace();assert.equal(JSON.stringify(game.championship),points);
 element('nextBtn').onclick();assert.equal(game.cars.length,count);assert.equal(game.championship['player'+count],25);
 element('restartBtn').onclick();assert.equal(game.cars.length,count);assert.equal(game.countdown,3);assert.ok(game.cars.every(car=>car.speed===0&&!car.done));assert.equal(game.championship['player'+count],25);
}
// Standard gamepads: exclusive slots, analog deadzone/triggers, no keyboard cross-talk.
function pad(){return {connected:true,mapping:'standard',axes:[0],buttons:Array.from({length:8},()=>({value:0}))};}
element('localPlayerCount').value='4';
for(let i=0;i<4;i++){pads[i]=pad();element('playerInput'+(i+1)).value='pad'+i;}
assert.equal(game.validateLocalSetup(),true);game.start('duo',0);game.setKeys({w:true,arrowup:true,i:true,t:true});
for(let i=0;i<4;i++){assert.equal(game.controlsFor(i).throttle,0);pads[i].axes[0]=.1;assert.equal(game.controlsFor(i).steering,0);}
pads[2].axes[0]=.575;pads[2].buttons[7].value=.7;pads[2].buttons[6].value=.4;pads[2].buttons[2].value=1;
const input=game.controlsFor(2);assert.ok(Math.abs(input.steering-.5)<1e-12);assert.equal(input.throttle,.7);assert.equal(input.brake,.4);assert.equal(input.hand,true);assert.equal(game.controlsFor(1).throttle,0);
pads[2].buttons[6].value=0;pads[2].buttons[2].value=0;game.cars.forEach((car,i)=>game.placeCar(car,500+i*180,0));game.tick(1/60);assert.ok(game.cars[2].speed>0&&game.cars[2].steer>0);assert.ok(game.cars.filter((_,i)=>i!==2).every(car=>car.speed===0));
pads[2]=null;assert.equal(game.checkLocalControllers(),false);assert.equal(game.paused,true);assert.match(element('status').textContent,/P3.*DESCONECTADO/);game.togglePause();assert.equal(game.paused,true);
pads[2]=pad();game.togglePause();assert.equal(game.paused,false);
element('playerInput4').value='pad2';assert.equal(game.validateLocalSetup(),false);assert.match(element('localSetupStatus').textContent,/distinto/);
element('backBtn').onclick();game.start('duo',0);assert.equal(game.running,false,'Invalid lobby launched a race');
element('playerInput4').value='pad3';pads[3].mapping='';assert.equal(game.validateLocalSetup(),false);
for(let i=1;i<=4;i++)element('playerInput'+i).value='keyboard';
// Individual mode ignores local controller configuration and retains the CPU grid.
element('opponentCount').value='3';game.start('solo',0);assert.equal(game.cars.length,4);assert.equal(game.cars.filter(c=>c.isAI).length,3);game.setKeys({w:true});assert.equal(game.controlsFor(0).throttle,1);
console.log('PASS: 15 local grids, 2/3/4 humans, individual models/paint/controls/HUD/cameras, non-overlapping starts, results/DNF/points/restart/next, four analog gamepads, deadzone, exclusive assignment, missing/unsupported controller and pause/reconnection. Hardware comfort remains to test.');
