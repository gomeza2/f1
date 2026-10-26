import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();
const colors=['#ff3d81','#39e8e8','#d7ff38','#ff984d','#b77cff','#f0f3ff'];
function recorder(){
 const operations=[],stack=[];let matrix=[1,0,0,1,0,0],style={};
 function point(x,y){assert.ok(Number.isFinite(x)&&Number.isFinite(y));return [matrix[0]*x+matrix[2]*y+matrix[4],matrix[1]*x+matrix[3]*y+matrix[5]];}
 const context={save(){stack.push({matrix:[...matrix],style:{...style}})},restore(){assert.ok(stack.length);({matrix,style}=stack.pop());},
 translate(x,y){[matrix[4],matrix[5]]=point(x,y)},rotate(a){assert.ok(Number.isFinite(a));const [m0,m1,m2,m3]=matrix,c=Math.cos(a),s=Math.sin(a);matrix[0]=m0*c+m2*s;matrix[1]=m1*c+m3*s;matrix[2]=-m0*s+m2*c;matrix[3]=-m1*s+m3*c;},
 beginPath(){},closePath(){},fill(){operations.push(['fill',style.fillStyle])},stroke(){operations.push(['stroke',style.strokeStyle])},clip(){},rect(x,y,w,h){point(x,y);point(x+w,y+h)},moveTo(x,y){operations.push(['point',...point(x,y)])},lineTo(x,y){operations.push(['point',...point(x,y)])},
 fillRect(x,y,w,h){operations.push(['rect',...point(x,y),...point(x+w,y+h),style.fillStyle])},fillText(){},arc(x,y,r){point(x,y);assert.ok(r>=0)}};
 for(const key of ['fillStyle','strokeStyle','lineWidth','font','textAlign','globalAlpha'])Object.defineProperty(context,key,{set(value){style[key]=value},get(){return style[key]},configurable:true});
 return {context,operations,get stackDepth(){return stack.length},get matrix(){return matrix}};
}
const signatures=new Set();let detailedOps=0,liteOps=0;
for(const quality of ['high','retro','lite'])for(const model of Object.keys(game.CAR_MODELS))for(const color of colors){
 element('graphics').value=quality;element('carModel').value=model;game.start('solo',0);
 const car=game.cars[0];Object.assign(car,{color,steer:.7,speed:110,wheelTravel:2,braking:true,offroad:48,flash:.1});
 const before=JSON.stringify(car),r=recorder();game.drawCar(r.context,car);
 assert.equal(JSON.stringify(car),before,'Rendering mutated simulation state');assert.equal(r.stackDepth,0,'Renderer leaked saved state');assert.deepEqual(r.matrix,[1,0,0,1,0,0]);
 assert.ok(r.operations.some(op=>op.at(-1)==='#ff685c'),'Brake lights are missing');
 assert.ok(r.operations.some(op=>op[0]==='fill'&&op[1]===color),'Impact flash hid the chosen paint');
 const body=recorder();game.drawCarBody(body.context,car);
 for(const op of body.operations){const pts=op[0]==='point'?[op.slice(1)]:op[0]==='rect'?[op.slice(1,3),op.slice(3,5)]:[];for(const [x,y] of pts)assert.ok(x>=-18&&x<=18&&y>=-11&&y<=11,'Car body exceeds the established sprite envelope');}
 if(quality==='high')detailedOps+=r.operations.length;if(quality==='lite')liteOps+=r.operations.length;
 if(quality==='high'&&color===colors[0])signatures.add(JSON.stringify(r.operations));
}
assert.equal(signatures.size,4,'Models render identically');assert.ok(detailedOps>liteOps,'Lite did not simplify drawing');
for(const model of Object.keys(game.CAR_MODELS)){
 element('graphics').value='high';element('carModel').value=model;game.start('solo',0);const car=game.cars[0];
 game.placeCar(car,150,0);car.speed=120;game.setKeys({w:true,d:true,' ':true});const x=car.x,y=car.y;game.physics(car,0,1/60);
 assert.equal(car.braking,true);assert.ok(game.carVisualState(car).wheelAngle>0);
 assert.ok(Math.abs(car.wheelTravel-Math.hypot(car.x-x,car.y-y))<1e-6,'Rolling did not follow travel distance');
 const marks=game.skidMarks.slice(-2),v=game.CAR_VISUALS[model];assert.equal(marks.length,2);
 for(const [i,side] of [-1,1].entries()){
  const wx=car.x+Math.cos(car.heading)*v.rearAxle-Math.sin(car.heading)*side*v.halfTrack;
  const wy=car.y+Math.sin(car.heading)*v.rearAxle+Math.cos(car.heading)*side*v.halfTrack;
  assert.ok(Math.hypot(marks[i].x-wx,marks[i].y-wy)<1e-6,'Skid mark misses the drawn rear wheel');
 }
 game.setKeys({a:true});for(let i=0;i<18;i++)game.physics(car,0,1/60);assert.ok(game.carVisualState(car).wheelAngle<0);assert.equal(car.braking,false);
 car.speed=0;game.setKeys({});const travel=car.wheelTravel;game.physics(car,0,1/60);assert.equal(car.wheelTravel,travel,'Stationary wheels moved');
 game.motionPreference.matches=true;assert.equal(game.carVisualState(car).rolling,false);game.motionPreference.matches=false;
 game.placeCar(car,150,0);assert.equal(car.wheelTravel,0);assert.equal(car.braking,false);
}
console.log('PASS: four distinct models/six paints/three qualities, brake and handbrake lights, steering/countersteer, distance-based rolling, static wheels, rear-axle skid marks, reduced motion, reset and pure bounded drawing state.');

// The same world-facing facet receives the same light at every car heading.
for(const heading of [0,.4,Math.PI/2,Math.PI,5.5]){
 const dx=-Math.sin(heading),dy=-Math.cos(heading);
 assert.ok(Math.abs(game.carEdgeLight(heading,dx,dy)-.6)<1e-12);
 assert.equal(game.carEdgeLight(heading,0,0),0);
}
for(const quality of ['high','retro','lite'])for(const heading of [0,.8,Math.PI/2,Math.PI]){
 element('graphics').value=quality;game.start('solo',0);const car=game.cars[0];Object.assign(car,{x:200,y:300,heading,steer:.5});
 const before=JSON.stringify(car),r=recorder();game.drawCarShadow(r.context,car);
 assert.equal(JSON.stringify(car),before);assert.equal(r.stackDepth,0);
 if(quality==='lite'){assert.equal(r.operations.length,0);continue;}
 const a=game.CAR_VISUALS[car.model].body[0],first=r.operations.find(op=>op[0]==='point');
 assert.ok(Math.abs(first[1]-(car.x+3+a[0]*Math.cos(heading)-a[1]*Math.sin(heading)))<1e-10);
 assert.ok(Math.abs(first[2]-(car.y+4+a[0]*Math.sin(heading)+a[1]*Math.cos(heading)))<1e-10);
 assert.equal(r.operations.filter(op=>op[0]==='fill').length,quality==='high'?2:1);
}
console.log('PASS: heading-independent world light and fixed shadow displacement; contact layer in high, single cast layer in retro, no shadow work in lite; render is pure.');
