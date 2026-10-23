(()=>{'use strict';
const $=id=>document.getElementById(id);
const menu=$('menu'),game=$('game'),result=$('result'),c1=$('canvas1'),c2=$('canvas2');
const tracks=[
 ['SUNSET CIRCUIT','#f9a14b','#5cdb8b'],['NEON HARBOR','#31cde0','#2aa56e'],
 ['DUSTY MESA','#e4bd70','#d6b66a'],['NIGHT RUN','#7774ed','#459b78'],
 ['FROSTBITE GP','#bdeaff','#a4d9e9'],['JUNGLE SPRINT','#a3ef56','#36a65c'],
 ['VOLCANO RING','#ff694a','#b45b40'],['PIXEL CITY','#f05bc5','#44ae8c'],
 ['THUNDER VALLEY','#b9c6ff','#4a9b68'],['CHAMPION ROAD','#ffe45e','#36bb7b']
];
for(let i=0;i<tracks.length;i++){
 const o=document.createElement('option');
 o.value=i;o.textContent=String(i+1).padStart(2,'0')+' — '+tracks[i][0];
 $('stageSelect').append(o);
}
let mode='solo',stage=0,running=false,paused=false,raf=0,last=0,elapsed=0;
let keys=Object.create(null),cars=[],graphics='high',difficulty='normal',sound=true;
const LAP_DISTANCE=7200,TOTAL_DISTANCE=LAP_DISTANCE*3;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function resize(c){
 const r=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
 const quality=graphics==='retro'?.52:graphics==='lite'?.72:1;
 c.width=Math.max(320,Math.round(r.width*dpr*quality));
 c.height=Math.max(180,Math.round(r.height*dpr*quality));
}
function setupCar(player){
 return {x:player===0?-.22:.22,speed:0,dist:0,lap:1,player,
 color:player===0?'#ff3d81':'#39e8e8',steer:0,lateralVelocity:0,
 drift:0,yaw:0,done:false,finishTime:null,particles:[],smokeClock:0};
}
function start(m,s=Number($('stageSelect').value)){
 mode=m;stage=s;graphics=$('graphics').value;difficulty=$('difficulty').value;
 cars=[setupCar(0)];if(mode==='duo')cars.push(setupCar(1));
 elapsed=0;paused=false;running=true;keys=Object.create(null);
 menu.classList.add('hidden');result.classList.add('hidden');game.classList.remove('hidden');
 $('views').classList.toggle('duo',mode==='duo');
 $('views').classList.toggle('pixelated',graphics==='retro');
 $('views').classList.toggle('performance',graphics==='lite');
 c2.classList.toggle('hidden',mode!=='duo');
 $('trackName').textContent=tracks[stage][0];
 $('stageLabel').textContent=String(stage+1).padStart(2,'0');
 $('helpText').textContent=mode==='duo'?'P1 WASD + ESPACIO · P2 FLECHAS + ENTER':'W acelerar · S frenar · A/D girar · ESPACIO derrapar';
 resize(c1);if(mode==='duo')resize(c2);
 cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop);
}
function keyFor(i){
 return i===0?{up:'w',down:'s',left:'a',right:'d',hand:' '}:
 {up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright',hand:'enter'};
}
window.addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();
 if(['arrowup','arrowdown','arrowleft','arrowright',' ','enter'].includes(k))e.preventDefault();
 keys[k]=true;
 if(k==='escape'&&!e.repeat&&running)togglePause();
});
window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
window.addEventListener('blur',()=>{keys=Object.create(null);});
function togglePause(){
 if(!running)return;
 paused=!paused;
 $('status').textContent=paused?'PAUSA — ESC PARA SEGUIR':'¡A FONDO!';
 if(!paused){last=performance.now();raf=requestAnimationFrame(loop);}
}
function physics(car,i,dt){
 const k=keyFor(i);
 const throttle=keys[k.up]?1:0,brake=keys[k.down]?1:0;
 const turn=(keys[k.right]?1:0)-(keys[k.left]?1:0);
 const handbrake=!!keys[k.hand];
 const maxSpeed=(difficulty==='easy'?1.12:difficulty==='hard'?.91:1.02);
 const grip=handbrake?1.75:5.3;
 const acceleration=0.68,braking=1.45;
 car.speed+=throttle*acceleration*dt;
 car.speed-=brake*braking*dt;
 car.speed-=((throttle||brake)?0.025:0.12)*dt;
 if(Math.abs(car.x)>.86)car.speed-=0.52*dt;
 car.speed=clamp(car.speed,0,maxSpeed);
 const speedFactor=.18+car.speed*.95;
 car.steer+=(turn-car.steer)*Math.min(1,dt*(handbrake?7:5));
 const targetLateral=car.steer*speedFactor*(handbrake?1.2:.57);
 car.lateralVelocity+=(targetLateral-car.lateralVelocity)*Math.min(1,grip*dt);
 car.x+=car.lateralVelocity*dt;
 car.x=clamp(car.x,-1.12,1.12);
 car.drift=clamp(Math.abs(car.lateralVelocity-car.steer*speedFactor*.35)+(handbrake&&Math.abs(turn)>.1?car.speed*.85:0),0,1);
 car.yaw=clamp(car.lateralVelocity*.48+car.steer*car.speed*.17,-.62,.62);
 if(Math.abs(car.x)>.88)car.speed=Math.max(.12,car.speed-.32*dt);
 car.dist=Math.min(TOTAL_DISTANCE,car.dist+car.speed*760*dt);
 car.lap=Math.min(3,Math.floor(car.dist/LAP_DISTANCE)+1);
 if(car.dist>=TOTAL_DISTANCE&&!car.done){car.done=true;car.finishTime=elapsed;car.speed=0;car.lap=3;}
 if(car.drift>.28&&car.speed>.25){
  car.smokeClock+=dt;
  if(car.smokeClock>.045){
   car.smokeClock=0;
   for(let n=0;n<(graphics==='lite'?1:2);n++)car.particles.push({
    x:0,y:0,vx:(Math.random()-.5)*26-car.lateralVelocity*12,
    vy:16+Math.random()*23,life:.35+Math.random()*.3,maxLife:.65,
    size:2+Math.random()*4
   });
  }
 }
}
function trackOffset(distance){
 const phase=stage*.73;
 const frequency=stage%3===0?.00105:stage%3===1?.0013:.0008;
 return 58*Math.sin(distance*frequency+phase)
  +24*Math.sin(distance*.00036+phase*1.7)
  +(stage%2===0?12:-10)*Math.sin(distance*.0018+phase*.8);
}
function roadGeometry(car,H){
 const horizon=H*.39;
 const curve=y=>{
  const t=clamp((y-horizon)/(H-horizon),0,1);
  const lookAhead=(1-t)*2300;
  return 320+trackOffset(car.dist+lookAhead)-trackOffset(car.dist);
 };
 const widths=y=>30+Math.pow(clamp((y-horizon)/(H-horizon),0,1),1.2)*300;
 return {horizon,curve,widths};
}
function drawHorizon(ctx,H,horizon){
 const poly=(points,color)=>{
  ctx.fillStyle=color;ctx.beginPath();
  points.forEach((p,i)=>i===0?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]));
  ctx.closePath();ctx.fill();
 };
 // Distant silhouettes are different for each circuit.
 if(stage===0){
  poly([[0,horizon],[80,horizon*.34],[145,horizon*.62],[235,horizon*.25],[330,horizon*.65],[430,horizon*.31],[535,horizon*.59],[610,horizon*.2],[640,horizon*.35],[640,horizon],[0,horizon]],'#9b6582');
  poly([[0,horizon],[65,horizon*.65],[180,horizon*.43],[275,horizon*.76],[410,horizon*.47],[520,horizon*.72],[640,horizon*.45],[640,horizon],[0,horizon]],'#654b76');
 }else if(stage===1){
  ctx.fillStyle='#7de1e0';ctx.fillRect(0,horizon*.73,640,horizon*.27);
  for(let i=0;i<13;i++){
   const x=i*53-5,bw=24+(i*17%22),bh=16+(i*13%42);
   ctx.fillStyle=i%2?'#236b7d':'#28516e';ctx.fillRect(x,horizon-bh,bw,bh);
   ctx.fillStyle='#d8f3be';
   for(let wx=x+5;wx<x+bw-3;wx+=9)for(let wy=horizon-bh+6;wy<horizon-4;wy+=10)ctx.fillRect(wx,wy,3,4);
  }
 }else if(stage===2){
  poly([[0,horizon],[0,horizon*.52],[76,horizon*.46],[118,horizon*.63],[168,horizon*.6],[200,horizon*.36],[264,horizon*.36],[298,horizon*.72],[367,horizon*.72],[402,horizon*.42],[470,horizon*.42],[506,horizon*.58],[570,horizon*.58],[610,horizon*.3],[640,horizon*.37],[640,horizon]],'#a7784c');
  poly([[0,horizon],[0,horizon*.76],[110,horizon*.68],[193,horizon*.78],[274,horizon*.54],[350,horizon*.82],[453,horizon*.61],[565,horizon*.75],[640,horizon*.64],[640,horizon]],'#c28a55');
 }else if(stage===3||stage===7){
  for(let i=0;i<16;i++){
   const x=i*43-7,bw=24+(i*11%22),bh=18+(i*19%(stage===3?54:68));
   ctx.fillStyle=stage===3?(i%2?'#272b69':'#32346f'):(i%2?'#34486d':'#4b3b75');
   ctx.fillRect(x,horizon-bh,bw,bh);
   if(graphics!=='lite'){
    ctx.fillStyle=stage===3?'#ff4ca2':'#43edec';
    for(let wx=x+5;wx<x+bw-3;wx+=9)for(let wy=horizon-bh+7;wy<horizon-4;wy+=12)ctx.fillRect(wx,wy,3,5);
   }
  }
 }else if(stage===4){
  poly([[0,horizon],[60,horizon*.22],[105,horizon*.5],[175,horizon*.13],[242,horizon*.58],[320,horizon*.26],[395,horizon*.53],[475,horizon*.18],[560,horizon*.49],[610,horizon*.29],[640,horizon*.4],[640,horizon]],'#89b4cf');
  poly([[38,horizon*.32],[60,horizon*.22],[78,horizon*.35],[66,horizon*.3],[60,horizon*.34]],'#f7ffff');
  poly([[148,horizon*.31],[175,horizon*.13],[205,horizon*.35],[184,horizon*.29],[175,horizon*.32]],'#f7ffff');
  poly([[453,horizon*.32],[475,horizon*.18],[497,horizon*.35],[481,horizon*.3]],'#f7ffff');
 }else if(stage===5){
  poly([[0,horizon],[0,horizon*.58],[45,horizon*.44],[78,horizon*.63],[120,horizon*.31],[168,horizon*.55],[210,horizon*.35],[255,horizon*.59],[306,horizon*.32],[356,horizon*.6],[408,horizon*.4],[462,horizon*.61],[520,horizon*.28],[573,horizon*.5],[640,horizon*.34],[640,horizon]],'#28664f');
  poly([[0,horizon],[0,horizon*.82],[70,horizon*.62],[130,horizon*.8],[208,horizon*.66],[286,horizon*.85],[368,horizon*.67],[455,horizon*.83],[535,horizon*.62],[640,horizon*.8],[640,horizon]],'#194b43');
 }else if(stage===6){
  poly([[0,horizon],[0,horizon*.75],[110,horizon*.57],[180,horizon*.63],[260,horizon*.12],[340,horizon*.69],[414,horizon*.51],[490,horizon*.69],[566,horizon*.4],[640,horizon*.62],[640,horizon]],'#514050');
  poly([[231,horizon*.33],[260,horizon*.12],[286,horizon*.34],[267,horizon*.29],[259,horizon*.32]],'#332f3f');
  if(graphics==='high'){
   ctx.fillStyle='#ff724b';ctx.fillRect(245,horizon*.39,7,3);ctx.fillRect(267,horizon*.43,8,3);
  }
 }else if(stage===8){
  poly([[0,horizon],[0,horizon*.64],[95,horizon*.43],[170,horizon*.68],[253,horizon*.31],[325,horizon*.62],[405,horizon*.36],[485,horizon*.66],[570,horizon*.42],[640,horizon*.56],[640,horizon]],'#5c7898');
  poly([[0,horizon],[0,horizon*.81],[95,horizon*.67],[190,horizon*.82],[292,horizon*.69],[382,horizon*.84],[490,horizon*.65],[578,horizon*.8],[640,horizon*.7],[640,horizon]],'#456b64');
 }else{
  poly([[0,horizon],[0,horizon*.58],[65,horizon*.48],[130,horizon*.59],[194,horizon*.42],[258,horizon*.55],[320,horizon*.46],[384,horizon*.57],[448,horizon*.4],[512,horizon*.54],[576,horizon*.43],[640,horizon*.55],[640,horizon]],'#64718e');
  ctx.fillStyle='#353d57';ctx.fillRect(0,horizon*.78,640,horizon*.22);
  for(let x=0;x<640;x+=20){
   ctx.fillStyle=x%40?'#f3e7b1':'#d9516d';
   ctx.fillRect(x,horizon*.79,12,3);
  }
 }
}
function drawTrackside(ctx,stageIndex,x,y,size,side){
 const high=graphics==='high';
 const rect=(color,rx,ry,rw,rh)=>{ctx.fillStyle=color;ctx.fillRect(rx,ry,rw,rh);};
 if(stageIndex===2){
  // Desert cacti and sandstone rocks.
  if(size>11){
   rect('#55764b',x-size*.12,y-size*1.55,size*.24,size*1.6);
   rect('#55764b',x-size*.45,y-size*1.12,size*.3,size*.2);
   rect('#55764b',x-size*.45,y-size*1.3,size*.18,size*.48);
   rect('#55764b',x+size*.15,y-size*1.02,size*.28,size*.2);
   rect('#55764b',x+size*.3,y-size*1.35,size*.16,size*.5);
  }else rect('#b98053',x-size*.5,y-size*.5,size,size*.5);
 }else if(stageIndex===4){
  // Snowy fir trees.
  rect('#694f4d',x-size*.09,y-size*.65,size*.18,size*.65);
  for(let tier=0;tier<3;tier++){
   const top=y-size*(2-tier*.48),half=size*(.48-tier*.07);
   ctx.fillStyle=tier===0?'#e4f8ff':'#3d7a83';
   ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x-half,top+size*.72);ctx.lineTo(x+half,top+size*.72);ctx.closePath();ctx.fill();
  }
  if(high)rect('#ffffff',x-size*.05,y-size*1.55,size*.1,size*.2);
 }else if(stageIndex===1||stageIndex===3||stageIndex===7){
  // Harbor blocks and neon city buildings.
  const bw=size*(.7+(Math.floor(x)%3)*.13),bh=size*(1.5+(Math.floor(x/3)%3)*.45);
  rect(stageIndex===1?'#214d66':stageIndex===3?'#25285b':'#30405e',x-bw/2,y-bh,bw,bh);
  rect(stageIndex===1?'#a8e8d0':stageIndex===3?'#ff4fa5':'#41f0e8',x-bw*.36,y-bh*.78,bw*.18,Math.max(2,size*.13));
  rect('#c8f5d4',x+bw*.08,y-bh*.56,bw*.18,Math.max(2,size*.13));
  if(stageIndex===1)rect('#2b6573',x-bw*.7,y-bh*.12,bw*1.4,bh*.12);
 }else if(stageIndex===5){
  // Jungle canopy.
  rect('#684f3c',x-size*.08,y-size*.8,size*.16,size*.8);
  rect('#205a43',x-size*.53,y-size*1.65,size*1.06,size*.58);
  rect('#2f8156',x-size*.35,y-size*2,size*.7,size*.62);
  rect('#75b95d',x-size*.16,y-size*1.74,size*.32,size*.2);
 }else if(stageIndex===6){
  // Volcanic rocks and glowing lava cracks.
  rect('#4d3540',x-size*.55,y-size*.9,size*1.1,size*.9);
  rect('#a94b42',x-size*.16,y-size*.62,size*.14,size*.4);
  if(high)rect('#ffb04f',x+size*.08,y-size*.32,size*.24,size*.12);
 }else if(stageIndex===9){
  // Grandstands, spectators and team flags.
  rect('#45465c',x-size*.7,y-size*1.25,size*1.4,size*1.25);
  for(let row=0;row<3;row++)for(let col=0;col<4;col++)
   rect((row+col)%2?'#ff5b82':'#f6df89',x-size*.55+col*size*.28,y-size*1.05+row*size*.28,size*.13,size*.14);
  rect('#d9dbea',x-size*.04,y-size*1.8,size*.08,size*.6);
  rect(side<0?'#ff3d81':'#39e8e8',x-size*.04,y-size*1.8,size*.35,size*.22);
 }else{
  // Green courses and hills get chunky pixel trees.
  rect('#75583e',x-size*.1,y-size*.7,size*.2,size*.7);
  rect(stageIndex===0?'#2a7958':'#28684e',x-size*.58,y-size*1.65,size*1.16,size*.8);
  rect(stageIndex===0?'#439c68':'#3d8857',x-size*.39,y-size*2,size*.78,size*.64);
  if(high)rect('#9fd76a',x-size*.13,y-size*1.83,size*.25,size*.13);
 }
}
function draw(c,car,dt){
 const ctx=c.getContext('2d'),w=c.width,h=c.height,scale=w/640;
 ctx.imageSmoothingEnabled=graphics!=='retro';
 ctx.save();ctx.scale(scale,scale);
 const H=h/scale,{horizon,curve,widths}=roadGeometry(car,H);
 if(graphics==='high'){
  const sky=ctx.createLinearGradient(0,0,0,horizon);
  sky.addColorStop(0,tracks[stage][1]);sky.addColorStop(1,'#fae9bd');ctx.fillStyle=sky;
 }else ctx.fillStyle=tracks[stage][1];
 ctx.fillRect(0,0,640,horizon);
 if(graphics==='high'){
  ctx.fillStyle='#ffffff7a';ctx.fillRect(95,horizon*.23,54,5);ctx.fillRect(115,horizon*.18,72,4);
 }
 drawHorizon(ctx,H,horizon);
 ctx.fillStyle=tracks[stage][2];ctx.fillRect(0,horizon,640,H-horizon);
 for(let y=0;y<9;y++){
  const yy=horizon+(H-horizon)*y/9;
  ctx.fillStyle=y%2?'#ffffff0a':'#0000000a';ctx.fillRect(0,yy,640,(H-horizon)/9);
 }
 // Road and red-white curbs follow a changing series of upcoming turns.
 for(let y=horizon;y<H;y+=graphics==='lite'?4:2){
  const t=(y-horizon)/(H-horizon),x=curve(y),ww=widths(y);
  const stripe=Math.floor((t*28+car.dist*.001)%2);
  ctx.fillStyle=stripe?'#f3eee4':'#e84761';
  ctx.fillRect(x-ww-8,y,16,4);ctx.fillRect(x+ww-8,y,16,4);
  ctx.fillStyle=stage===4?'#515c6b':'#373b49';ctx.fillRect(x-ww,y,ww*2,4);
  // Dashed lane markers provide stronger depth and motion cues.
  if(Math.floor(t*42+car.dist*.018)%2===0){
   ctx.fillStyle='#ffffffb8';
   ctx.fillRect(x-ww/3,y,Math.max(1,ww/100),4);
   ctx.fillRect(x+ww/3,y,Math.max(1,ww/100),4);
  }
 }
 // Each location has a different set of roadside landmarks.
 const sceneryCount=graphics==='lite'?4:7;
 for(const side of [-1,1])for(let i=0;i<sceneryCount;i++){
  const yy=horizon+((i/sceneryCount+((car.dist*.00015)%1))%1)*(H-horizon);
  const t=(yy-horizon)/(H-horizon),roadX=curve(yy),size=5+t*25;
  const x=roadX+side*(widths(yy)+35+t*55);
  drawTrackside(ctx,stage,x,yy,size,side);
  // Big pixel signs appear on selected tracks.
  if((stage===1||stage===3||stage===7||stage===9)&&i%3===1&&size>13){
   ctx.fillStyle='#151a30';ctx.fillRect(x-size*.8,yy-size*2.7,size*1.6,size*.75);
   ctx.fillStyle=stage===9?'#d7ff38':stage===3?'#ff4ca2':'#39e8e8';
   ctx.font='bold '+Math.max(5,size*.31)+'px monospace';ctx.fillText(stage===9?'GP':stage===3?'NIGHT':'PIXEL',x-size*.65,yy-size*2.25);
  }
 }
 // Starting-grid checker pattern.
 if(car.dist<900){
  const y=horizon+clamp(car.dist/900,0,1)*(H-horizon)*.5;
  const x=curve(y),ww=widths(y);
  for(let n=0;n<12;n++){
   ctx.fillStyle=n%2?'#fff':'#171a29';
   ctx.fillRect(x-ww+n*(ww*2/12),y,ww*2/12,Math.max(2,(y-horizon)/25));
  }
 }
 const carY=H-51,cx=curve(carY)+car.x*widths(carY);
 // Tire smoke trails during slides.
 for(const p of car.particles){
  p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
  ctx.globalAlpha=clamp(p.life/p.maxLife,0,1)*.48;ctx.fillStyle='#dce4ed';
  ctx.beginPath();ctx.arc(cx-16+p.x,carY+12+p.y,p.size,0,Math.PI*2);ctx.fill();
 }
 ctx.globalAlpha=1;car.particles=car.particles.filter(p=>p.life>0);
 if(car.drift>.28&&car.speed>.25){
  ctx.globalAlpha=.16+car.drift*.23;ctx.fillStyle='#f8ffff';
  ctx.beginPath();ctx.ellipse(cx-14,carY+11,10+car.drift*8,3+car.drift*3,-car.yaw,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 }
 drawCar(ctx,cx,carY,car.color,1,car.yaw,car.speed);
 // Arcade HUD.
 ctx.fillStyle='#0a0c1ddd';ctx.fillRect(12,12,158,62);
 ctx.fillStyle=car.color;ctx.font='bold 12px monospace';
 ctx.fillText('P'+(car.player+1)+'  '+Math.round(car.speed*238)+' KM/H',22,31);
 ctx.fillStyle='#d7ff38';ctx.fillText('LAP '+car.lap+'/3',22,49);
 ctx.fillStyle='#8e98b8';ctx.fillRect(22,57,135,5);
 ctx.fillStyle=car.color;ctx.fillRect(22,57,135*(car.dist/TOTAL_DISTANCE),5);
 if(car.drift>.28){
  ctx.fillStyle='#0a0c1ddd';ctx.fillRect(490,14,137,26);
  ctx.fillStyle='#39e8e8';ctx.fillText('DRIFT  '+Math.round(car.drift*100)+'%',500,31);
 }
 if(paused){
  ctx.fillStyle='#050716bb';ctx.fillRect(0,0,640,H);
  ctx.fillStyle='#d7ff38';ctx.font='28px monospace';ctx.textAlign='center';
  ctx.fillText('PAUSA',320,H/2);ctx.textAlign='left';
 }
 ctx.restore();
}
function drawCar(ctx,x,y,color,s=1,yaw=0,speed=0){
 ctx.save();ctx.translate(x,y);ctx.rotate(yaw);ctx.scale(s,s);
 if(graphics==='high'){ctx.fillStyle='#00000055';ctx.fillRect(-23,-12,48,34);}
 ctx.fillStyle='#141625';ctx.fillRect(-22,-8,10,18);ctx.fillRect(12,-8,10,18);
 ctx.fillStyle=color;ctx.fillRect(-19,-19,38,30);ctx.fillRect(-12,-28,24,16);
 ctx.fillStyle='#baf6ff';ctx.fillRect(-9,-24,18,8);
 ctx.fillStyle='#fff4a1';ctx.fillRect(-16,5,8,4);ctx.fillRect(8,5,8,4);
 ctx.fillStyle='#171a29';ctx.fillRect(-26,0,52,6);
 ctx.fillStyle='#ffffff';ctx.fillRect(-3,-14,6,20);
 if(speed>.82){ctx.fillStyle='#ffca70';ctx.fillRect(-11,13,5,5);ctx.fillRect(6,13,5,5);}
 ctx.restore();
}
function loop(now){
 if(!running||paused)return;
 const dt=Math.min((now-last)/1000,.035);last=now;elapsed+=dt;
 cars.forEach((car,i)=>{if(!car.done)physics(car,i,dt);draw(i===0?c1:c2,car,dt);});
 $('timer').textContent=format(elapsed);$('lap').textContent=cars[0].lap+'/3';
 if(cars.every(c=>c.done)){finishRace();return;}
 raf=requestAnimationFrame(loop);
}
function format(t){
 const m=Math.floor(t/60),s=(t%60).toFixed(1).padStart(4,'0');
 return String(m).padStart(2,'0')+':'+s;
}
function finishRace(){
 running=false;cancelAnimationFrame(raf);game.classList.add('hidden');result.classList.remove('hidden');
 const winner=cars.length===1?'¡LLEGASTE A LA META!':
  (cars[0].finishTime??Infinity)<=(cars[1].finishTime??Infinity)?'¡GANA EL JUGADOR 1!':'¡GANA EL JUGADOR 2!';
 $('resultTitle').textContent=cars.length===1?'¡CARRERA TERMINADA!':winner;
 $('resultText').textContent='Etapa '+(stage+1)+' completada · Tiempo '+format(elapsed)+'. '+(stage===9?'¡CAMPEÓN DEL PIXEL GRAND PRIX!':'¿Listo para el próximo circuito?');
 $('nextBtn').textContent=stage===9?'VOLVER A CORRER ↻':'SIGUIENTE ETAPA →';
 $('nextBtn').onclick=()=>start(mode,(stage+1)%tracks.length);
}
$('pauseBtn').onclick=togglePause;
$('backBtn').onclick=()=>{running=false;cancelAnimationFrame(raf);keys=Object.create(null);game.classList.add('hidden');menu.classList.remove('hidden');};
$('menuBtn').onclick=()=>{result.classList.add('hidden');menu.classList.remove('hidden');};
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>start(b.dataset.mode));
$('soundBtn').onclick=()=>{sound=!sound;$('soundBtn').textContent='♫ SONIDO: '+(sound?'ON':'OFF');};
$('graphics').addEventListener('change',()=>{graphics=$('graphics').value;$('views').classList.toggle('pixelated',graphics==='retro');$('views').classList.toggle('performance',graphics==='lite');if(running){resize(c1);if(mode==='duo')resize(c2);}});
$('difficulty').addEventListener('change',()=>{difficulty=$('difficulty').value;});
window.addEventListener('resize',()=>{if(running){resize(c1);if(mode==='duo')resize(c2);}});
})();