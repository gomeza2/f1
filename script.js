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
 drift:0,yaw:0,done:false,particles:[],smokeClock:0};
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
 if(car.dist>=TOTAL_DISTANCE){car.done=true;car.speed=0;car.lap=3;}
 if(car.drift>.28&&car.speed>.25){
  car.smokeClock+=dt;
  if(car.smokeClock>.045){
   car.smokeClock=0;
   for(let n=0;n<(graphics==='lite'?1:2);n++)car.particles.push({
    x:320,y:0,vx:(Math.random()-.5)*26-car.lateralVelocity*12,
    vy:16+Math.random()*23,life:.35+Math.random()*.3,maxLife:.65,
    size:2+Math.random()*4
   });
  }
 }
}
function roadGeometry(car,H){
 const horizon=H*.39;
 const bend=Math.sin(car.dist*.0009+stage)*.8+Math.sin(car.dist*.00033)*.6;
 const curve=y=>320+bend*100*Math.pow(clamp((y-horizon)/(H-horizon),0,1),2);
 const widths=y=>30+Math.pow(clamp((y-horizon)/(H-horizon),0,1),1.2)*300;
 return {horizon,curve,widths};
}
function draw(c,car,dt){
 const ctx=c.getContext('2d'),w=c.width,h=c.height,scale=w/640;
 ctx.imageSmoothingEnabled=graphics!=='retro';
 ctx.save();ctx.scale(scale,scale);
 const H=h/scale,{horizon,curve,widths}=roadGeometry(car,H);
 if(graphics==='high'){
  const sky=ctx.createLinearGradient(0,0,0,horizon);
  sky.addColorStop(0,tracks[stage][1]);sky.addColorStop(1,'#fae9bd');
  ctx.fillStyle=sky;
 }else ctx.fillStyle=tracks[stage][1];
 ctx.fillRect(0,0,640,horizon);
 if(graphics==='high'){
  ctx.fillStyle='#fff4c9';ctx.shadowColor='#fff4c9';ctx.shadowBlur=20;
  ctx.beginPath();ctx.arc(500,horizon*.38,24,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#ffffff7a';ctx.fillRect(95,horizon*.23,54,5);ctx.fillRect(115,horizon*.18,72,4);
 }
 ctx.fillStyle=tracks[stage][2];ctx.fillRect(0,horizon,640,H-horizon);
 for(let y=0;y<9;y++){
  const yy=horizon+(H-horizon)*y/9;
  ctx.fillStyle=y%2?'#ffffff0a':'#0000000a';ctx.fillRect(0,yy,640,(H-horizon)/9);
 }
 for(let y=horizon;y<H;y+=graphics==='lite'?4:2){
  const t=(y-horizon)/(H-horizon),x=curve(y),ww=widths(y);
  const stripe=Math.floor((t*28+car.dist*.001)%2);
  ctx.fillStyle=stripe?'#f3eee4':'#e84761';
  ctx.fillRect(x-ww-8,y,16,4);ctx.fillRect(x+ww-8,y,16,4);
  ctx.fillStyle=stage===4?'#667b91':'#454957';ctx.fillRect(x-ww,y,ww*2,4);
  ctx.fillStyle='#ffffffbb';
  ctx.fillRect(x-ww/3,y,Math.max(1,ww/100),4);
  ctx.fillRect(x+ww/3,y,Math.max(1,ww/100),4);
 }
 // Escenografía al costado de la pista.
 const sceneryCount=graphics==='lite'?4:6;
 for(let side of [-1,1])for(let i=0;i<sceneryCount;i++){
  const yy=horizon+((i/sceneryCount+((car.dist*.00015)%1))%1)*(H-horizon);
  const t=(yy-horizon)/(H-horizon),x=curve(yy)+side*(widths(yy)+35+t*55),sz=5+t*25;
  ctx.fillStyle=stage%3===0?'#216b54':'#34385c';
  ctx.fillRect(x-sz/2,yy-sz*1.7,sz,sz*1.7);
  ctx.fillStyle='#b3e66c';ctx.fillRect(x-sz*.7,yy-sz*2.4,sz*1.4,sz);
  if(graphics==='high'){
   ctx.fillStyle='#15243a';ctx.fillRect(x-sz*.8,yy-sz*1.9,sz*1.6,sz*.25);
  }
 }
 // Marcas de la línea de largada, visibles cerca del horizonte.
 if(car.dist<900){
  const y=horizon+clamp(car.dist/900,0,1)*(H-horizon)*.5;
  const x=curve(y),ww=widths(y);
  for(let n=0;n<12;n++){
   ctx.fillStyle=n%2?'#fff':'#171a29';
   ctx.fillRect(x-ww+n*(ww*2/12),y,ww*2/12,Math.max(2,(y-horizon)/25));
  }
 }
 const carY=H-51,cx=curve(carY)+car.x*widths(carY);
 // Humo de neumáticos, solo si se está deslizando.
 for(const p of car.particles){
  p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
  ctx.globalAlpha=clamp(p.life/p.maxLife,0,1)*.48;
  ctx.fillStyle='#dce4ed';ctx.beginPath();ctx.arc(cx-16+p.x*.035,p.y||carY+12,p.size,0,Math.PI*2);ctx.fill();
 }
 ctx.globalAlpha=1;car.particles=car.particles.filter(p=>p.life>0);
 if(car.drift>.28&&car.speed>.25){
  ctx.globalAlpha=.16+car.drift*.23;ctx.fillStyle='#f8ffff';
  ctx.beginPath();ctx.ellipse(cx-14,carY+11,10+car.drift*8,3+car.drift*3,-car.yaw,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 }
 drawCar(ctx,cx,carY,car.color,1,car.yaw,car.speed);
 // HUD arcade.
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
  cars[0].dist>=cars[1].dist?'¡GANA EL JUGADOR 1!':'¡GANA EL JUGADOR 2!';
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