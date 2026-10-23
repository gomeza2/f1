(()=>{'use strict';
const $=id=>document.getElementById(id);
const menu=$('menu'),game=$('game'),result=$('result'),canvas=$('canvas1');
const ctx=canvas.getContext('2d');
const trackDefs=[
 {name:'SUNSET CIRCUIT',sky:'#f4a66c',grass:'#36784d',accent:'#f6d27c',points:[[150,110],[300,88],[390,118],[422,185],[520,177],[590,112],[760,110],[850,176],[823,250],[694,258],[645,330],[720,414],[700,500],[582,538],[510,468],[421,492],[350,557],[235,529],[190,445],[105,410],[80,310],[145,260],[115,180]]},
 {name:'NEON HARBOR',sky:'#5dbfc8',grass:'#25766b',accent:'#84fff0',points:[[150,95],[330,100],[385,145],[470,120],[535,95],[730,100],[820,148],[855,230],[810,275],[700,270],[650,340],[700,430],[640,490],[510,495],[455,435],[340,450],[295,520],[180,510],[120,445],[95,350],[145,285],[110,200]]},
 {name:'DUSTY MESA',sky:'#dfb878',grass:'#b99c61',accent:'#f5dd91',points:[[120,130],[255,95],[390,120],[455,175],[520,135],[680,120],[760,165],[785,225],[725,260],[650,245],[620,310],[690,360],[760,420],[730,500],[625,535],[530,495],[470,435],[390,450],[340,535],[220,540],[160,475],[200,410],[120,360],[85,270],[125,215]]},
 {name:'NIGHT RUN',sky:'#5a5b9e',grass:'#263a54',accent:'#ff5fae',points:[[155,100],[315,92],[365,140],[470,135],[495,195],[615,200],[645,135],[770,120],[865,175],[838,248],[760,280],[700,255],[660,325],[740,380],[800,455],[740,520],[610,525],[550,465],[455,475],[420,550],[300,540],[220,480],[140,460],[100,375],[140,310],[95,230]]},
 {name:'FROSTBITE GP',sky:'#d9eff4',grass:'#83b3a3',accent:'#ffffff',points:[[155,115],[320,85],[445,120],[490,180],[600,150],[745,120],[830,180],[850,255],[780,305],[670,285],[620,350],[680,410],[650,500],[525,530],[450,470],[355,480],[305,545],[205,510],[150,430],[95,400],[105,300],[150,255],[115,185]]},
 {name:'JUNGLE SPRINT',sky:'#72b987',grass:'#205a3d',accent:'#a8e77e',points:[[135,125],[285,90],[385,120],[435,195],[530,210],[575,135],[735,115],[825,180],[800,255],[720,285],[690,360],[750,415],[700,515],[570,525],[500,455],[400,465],[335,540],[220,525],[175,445],[100,420],[80,330],[145,260],[100,190]]},
 {name:'VOLCANO RING',sky:'#9e645d',grass:'#4c4349',accent:'#ff704e',points:[[125,130],[280,90],[395,125],[440,200],[510,165],[650,110],[790,135],[860,215],[810,280],[710,270],[665,335],[720,420],[680,500],[550,540],[465,475],[385,495],[320,555],[210,520],[170,435],[100,390],[85,295],[140,250],[105,190]]},
 {name:'PIXEL CITY',sky:'#c67bb2',grass:'#356c5d',accent:'#5bf4ec',points:[[160,100],[325,90],[390,140],[465,110],[610,115],[680,170],[790,145],[865,205],[830,270],[735,285],[685,340],[735,405],[700,500],[590,530],[510,470],[420,500],[345,550],[225,520],[175,440],[105,410],[85,315],[145,265],[115,185]]},
 {name:'THUNDER VALLEY',sky:'#a4b4d3',grass:'#406d5a',accent:'#e8f6ff',points:[[130,125],[280,85],[405,115],[450,185],[540,160],[680,110],[785,145],[860,215],[810,285],[705,270],[650,345],[720,425],[670,510],[550,535],[470,465],[380,485],[325,550],[215,520],[170,435],[100,405],[80,310],[135,250],[100,185]]},
 {name:'CHAMPION ROAD',sky:'#f3dc7e',grass:'#397653',accent:'#ffffff',points:[[145,105],[310,82],[425,112],[460,175],[570,145],[700,105],[810,150],[870,225],[820,280],[725,260],[670,330],[740,405],[710,500],[590,535],[510,470],[415,488],[350,550],[230,525],[180,440],[105,405],[80,310],[145,255],[112,185]]}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrapAngle=a=>Math.atan2(Math.sin(a),Math.cos(a));
const dist2=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function makeTrack(def){
 const p=def.points,n=p.length,samples=[];
 for(let i=0;i<n;i++){
  const p0=p[(i-1+n)%n],p1=p[i],p2=p[(i+1)%n],p3=p[(i+2)%n];
  for(let j=0;j<10;j++){
   const t=j/10,t2=t*t,t3=t2*t;
   samples.push({
    x:.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
    y:.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)
   });
  }
 }
 let length=0;
 for(let i=0;i<samples.length;i++){samples[i].d=length;length+=dist2(samples[i],samples[(i+1)%samples.length]);}
 return {...def,samples,length};
}
const tracks=trackDefs.map(makeTrack);
let stage=0,mode='solo',track=tracks[0],running=false,paused=false,raf=0,last=0,elapsed=0;
let keys=Object.create(null),cars=[],graphics='high',difficulty='normal',decorations=[];
const LAPS=3;
function sampleAt(distance){
 const d=((distance%track.length)+track.length)%track.length,s=track.samples;
 let lo=0,hi=s.length-1;
 while(lo<hi){const mid=(lo+hi+1)>>1;if(s[mid].d<=d)lo=mid;else hi=mid-1;}
 const a=s[lo],b=s[(lo+1)%s.length],seg=dist2(a,b)||1;
 const t=clamp((d-a.d)/seg,0,1);
 const x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
 const angle=Math.atan2(b.y-a.y,b.x-a.x);
 return {x,y,angle};
}
function cornerInfo(distance){
 const before=sampleAt(distance-44).angle,here=sampleAt(distance).angle,after=sampleAt(distance+44).angle;
 const turn=wrapAngle(after-before);
 const severity=Math.abs(turn);
 // A tight bend demands a lower entry speed. The sign identifies the outside of the turn.
 return {turn,severity,safeSpeed:clamp(232/(1+severity*1.14),76,225)};
}
function getDecorations(){
 const result=[];
 for(let y=28;y<612;y+=42)for(let x=28;x<972;x+=43){
  let min=Infinity;
  for(let i=0;i<track.samples.length;i+=2)min=Math.min(min,Math.hypot(x-track.samples[i].x,y-track.samples[i].y));
  if(min>83){
   const seed=(Math.floor(x*3+y*7+stage*13)%11);
   if(seed<7)result.push({x,y,type:seed,size:9+(seed%4)*2});
  }
 }
 return result;
}
function resize(){
 const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
 const q=graphics==='retro'?.58:graphics==='lite'?.75:1;
 canvas.width=Math.max(500,Math.round(r.width*dpr*q));
 canvas.height=Math.round(canvas.width*640/1000);
}
function setupCar(player,isAI=false){
 return {player,isAI,color:isAI?'#ffc857':player===0?'#ff3d81':'#39e8e8',
  distance:isAI?72:0,speed:0,lane:isAI?-.34:player===0?.24:.35,
  steer:0,drift:0,done:false,finishTime:null,offroad:0,particles:[],
  flash:0,place:player+1};
}
function start(m,s=Number($('stageSelect').value)){
 mode=m;stage=s;track=tracks[stage];graphics=$('graphics').value;difficulty=$('difficulty').value;
 cars=[setupCar(0)];if(mode==='solo')cars.push(setupCar(1,true));else cars.push(setupCar(1));
 decorations=getDecorations();elapsed=0;paused=false;running=true;keys=Object.create(null);
 menu.classList.add('hidden');result.classList.add('hidden');game.classList.remove('hidden');
 $('views').classList.toggle('pixelated',graphics==='retro');$('views').classList.toggle('performance',graphics==='lite');
 $('trackName').textContent=track.name;$('stageLabel').textContent=String(stage+1).padStart(2,'0');
 $('helpText').textContent=mode==='duo'?'P1 WASD + ESPACIO · P2 FLECHAS + ENTER':'W acelerar · S frenar · A/D línea · ESPACIO freno de mano';
 $('status').textContent='¡LUZ VERDE!';resize();
 cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop);
}
for(let i=0;i<tracks.length;i++){
 const o=document.createElement('option');o.value=i;o.textContent=String(i+1).padStart(2,'0')+' — '+tracks[i].name;$('stageSelect').append(o);
}
function keyFor(i){return i===0?{up:'w',down:'s',left:'a',right:'d',hand:' '}:{up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright',hand:'enter'};}
window.addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();
 if(['arrowup','arrowdown','arrowleft','arrowright',' ','enter'].includes(k))e.preventDefault();
 keys[k]=true;if(k==='escape'&&!e.repeat&&running)togglePause();
});
window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
window.addEventListener('blur',()=>{keys=Object.create(null);});
function togglePause(){
 if(!running)return;paused=!paused;$('status').textContent=paused?'PAUSA — ESC PARA SEGUIR':'¡A FONDO!';
 if(!paused){last=performance.now();raf=requestAnimationFrame(loop);}
}
function physics(car,i,dt){
 const corner=cornerInfo(car.distance+car.speed*.2),k=keyFor(i);
 if(car.isAI){
  const targetCorner=cornerInfo(car.distance+120).safeSpeed;
  const target=clamp(targetCorner*(difficulty==='easy'?.83:difficulty==='hard'?1.02:.94),92,238);
  car.speed+=clamp(target-car.speed,-190,63)*dt;
  car.speed=clamp(car.speed,0,245);
  const aim=cornerInfo(car.distance+70).turn*.18;
  car.lane+=(aim-car.lane)*Math.min(1,dt*1.6);
  car.drift=clamp(Math.max(0,car.speed-corner.safeSpeed)/120,0,1)*.42;
 }else{
  const throttle=keys[k.up]?1:0,brake=keys[k.down]?1:0,hand=!!keys[k.hand];
  const turn=(keys[k.right]?1:0)-(keys[k.left]?1:0);
  const maxSpeed=difficulty==='easy'?240:difficulty==='hard'?248:245;
  // Brakes are deliberately stronger than engine braking; lifting alone is not enough for hairpins.
  car.speed+=throttle*58*dt;
  car.speed-=brake*(hand?218:168)*dt;
  car.speed-=(throttle?2.8:19)*dt;
  car.speed=clamp(car.speed,0,maxSpeed);
  car.steer+=(turn-car.steer)*Math.min(1,dt*(hand?10:7));
  car.lane+=car.steer*dt*(.42+car.speed/220*.8);
  const excess=Math.max(0,car.speed-corner.safeSpeed);
  const cornerForce=corner.turn===0?0:Math.sign(corner.turn)*excess/152*(hand?1.05:1.85);
  car.lane+=cornerForce*dt;
  car.drift=clamp(excess/115+(hand&&Math.abs(turn)>.1?car.speed/300:.0),0,1);
  if(excess>5)car.speed-=excess*dt*(hand?1.65:.42);
 }
 car.lane=clamp(car.lane,-1.55,1.55);
 const off=Math.max(0,Math.abs(car.lane)-.82);
 car.offroad=off;
 if(off>0){
  car.speed=Math.max(42,car.speed-(45+off*100)*dt);
  if(Math.abs(car.lane)>1.31){
   car.speed=Math.max(38,car.speed-54*dt);car.flash=.08;
  }
  // Recover gradually when steering back toward the asphalt.
  const steer=(car.isAI?0:(keys[k.right]?1:0)-(keys[k.left]?1:0));
  if(Math.sign(steer)===-Math.sign(car.lane))car.lane*=Math.max(0,1-dt*.16);
 }
 if(car.flash>0)car.flash-=dt;
 if(car.drift>.32&&car.speed>60&&Math.random()<dt*13){
  car.particles.push({life:.42,max:.42,size:2+Math.random()*3,
   dx:(Math.random()-.5)*9,dy:(Math.random()-.5)*9});
 }
 car.distance+=car.speed*dt*.73;
 if(car.distance>=track.length*LAPS&&!car.done){
  car.distance=track.length*LAPS;car.done=true;car.finishTime=elapsed;car.speed=0;
 }
 car.particles=car.particles.filter(p=>(p.life-=dt)>0);
}
function resolveCollisions(dt){
 if(cars.length<2)return;
 const a=cars[0],b=cars[1];
 if(a.done||b.done)return;
 const p=sampleAt(a.distance),q=sampleAt(b.distance);
 const da=Math.abs(a.distance-b.distance)%track.length;
 const along=Math.min(da,track.length-da);
 if(along<31&&Math.abs(a.lane-b.lane)<.62){
  a.speed=Math.max(50,a.speed-45*dt);b.speed=Math.max(50,b.speed-45*dt);
  const push=(.62-Math.abs(a.lane-b.lane))*dt*1.2;
  if(a.lane<=b.lane){a.lane-=push;b.lane+=push;}else{a.lane+=push;b.lane-=push;}
  a.lane=clamp(a.lane,-1.5,1.5);b.lane=clamp(b.lane,-1.5,1.5);
  a.flash=.05;b.flash=.05;
 }
}
function strokeTrack(ctx,color,width,dash=[],offset=0){
 ctx.beginPath();const s=track.samples;
 ctx.moveTo(s[0].x,s[0].y);for(let i=1;i<s.length;i++)ctx.lineTo(s[i].x,s[i].y);ctx.closePath();
 ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=width;ctx.strokeStyle=color;
 ctx.setLineDash(dash);ctx.lineDashOffset=offset;ctx.stroke();ctx.setLineDash([]);
}
function drawBackground(ctx){
 ctx.fillStyle=track.grass;ctx.fillRect(0,0,1000,640);
 for(let y=0;y<640;y+=36){
  ctx.fillStyle=(Math.floor(y/36)%2)?'#ffffff05':'#0b2b1a0a';
  ctx.fillRect(0,y,1000,18);
 }
 for(const d of decorations){
  if(stage===1||stage===3||stage===7){
   ctx.fillStyle='#233348';ctx.fillRect(d.x-d.size*.75,d.y-d.size*1.5,d.size*1.5,d.size*1.5);
   ctx.fillStyle=track.accent;ctx.fillRect(d.x-d.size*.43,d.y-d.size*1.15,3,4);
   ctx.fillRect(d.x+d.size*.05,d.y-d.size*.8,3,4);
  }else if(stage===2){
   ctx.fillStyle='#9b7750';ctx.fillRect(d.x-4,d.y-4,8,8);
   ctx.fillStyle='#557047';ctx.fillRect(d.x-2,d.y-12,4,12);ctx.fillRect(d.x-8,d.y-8,6,3);
  }else if(stage===4){
   ctx.fillStyle='#e2f5f6';ctx.beginPath();ctx.moveTo(d.x,d.y-d.size*1.7);ctx.lineTo(d.x-d.size,d.y+d.size*.5);ctx.lineTo(d.x+d.size,d.y+d.size*.5);ctx.fill();
   ctx.fillStyle='#337967';ctx.fillRect(d.x-2,d.y,4,7);
  }else if(stage===5){
   ctx.fillStyle='#4f3d2a';ctx.fillRect(d.x-2,d.y-8,4,15);
   ctx.fillStyle=d.type%2?'#164831':'#2e7145';ctx.beginPath();ctx.arc(d.x,d.y-10,d.size,0,Math.PI*2);ctx.fill();
  }else if(stage===6){
   ctx.fillStyle='#3c333b';ctx.beginPath();ctx.arc(d.x,d.y,d.size,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#d65d3e';ctx.fillRect(d.x-2,d.y-2,4,Math.max(3,d.size*.5));
  }else{
   ctx.fillStyle='#604d3d';ctx.fillRect(d.x-2,d.y-7,4,10);
   ctx.fillStyle=d.type%2?'#1e5a3d':'#2f7950';ctx.beginPath();ctx.arc(d.x,d.y-10,d.size,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#8bbf65';ctx.fillRect(d.x-2,d.y-14,4,3);
  }
 }
 // Track shoulder, alternating curb paint, asphalt and racing line.
 strokeTrack(ctx,'#18251f',124);
 strokeTrack(ctx,'#e74b5d',109,[24,24],0);
 strokeTrack(ctx,'#f5f0dc',109,[24,24],24);
 strokeTrack(ctx,'#4b505b',89);
 strokeTrack(ctx,graphics==='high'?'#777d87':'#646873',83);
 strokeTrack(ctx,'#eef0d8ad',2.5,[18,22],-elapsed*9);
 // Starting line, checkered across the asphalt.
 const s=sampleAt(0),cx=Math.cos(s.angle),cy=Math.sin(s.angle);
 ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.angle);
 for(let j=0;j<10;j++){
  ctx.fillStyle=j%2?'#f5f5e9':'#181b22';
  ctx.fillRect(-5,-43+j*8.6,10,8.6);
 }
 ctx.restore();
 // Circuit name board beside the starting area.
 const n=sampleAt(130),nx=-Math.sin(n.angle),ny=Math.cos(n.angle);
 ctx.save();ctx.translate(n.x+nx*72,n.y+ny*72);ctx.rotate(n.angle);
 ctx.fillStyle='#111725';ctx.fillRect(-45,-12,90,24);
 ctx.fillStyle=track.accent;ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(track.name,0,4);
 ctx.restore();
}
function drawCar(ctx,car){
 const p=sampleAt(car.distance),t=p.angle;
 const nx=-Math.sin(t),ny=Math.cos(t);
 const x=p.x+nx*car.lane*35,y=p.y+ny*car.lane*35;
 // Small positional skid for oversteer; the car still points down the circuit.
 const rotation=t+car.steer*.18*car.drift;
 ctx.save();ctx.translate(x,y);ctx.rotate(rotation);
 if(car.offroad>.12){
  ctx.fillStyle='#ddc9a6';ctx.globalAlpha=.4;ctx.fillRect(-16,-9,32,18);ctx.globalAlpha=1;
 }
 if(graphics==='high'){ctx.fillStyle='#00000055';ctx.fillRect(-16,-8,34,19);}
 ctx.fillStyle='#151923';ctx.fillRect(-9,-10,7,5);ctx.fillRect(5,-10,7,5);ctx.fillRect(-9,5,7,5);ctx.fillRect(5,5,7,5);
 ctx.fillStyle=car.flash>0?'#ffffff':car.color;ctx.fillRect(-15,-7,30,14);
 ctx.fillStyle='#242b3a';ctx.fillRect(-5,-5,12,10);
 ctx.fillStyle='#baf4ff';ctx.fillRect(2,-4,6,8);
 ctx.fillStyle='#fff4ad';ctx.fillRect(11,-5,3,3);ctx.fillRect(11,2,3,3);
 ctx.fillStyle='#a9344e';ctx.fillRect(-15,-5,3,3);ctx.fillRect(-15,2,3,3);
 ctx.fillStyle='#111725';ctx.fillRect(-12,-11,24,2);
 ctx.restore();
 ctx.fillStyle='#10151dd9';ctx.fillRect(x-19,y-26,38,11);
 ctx.fillStyle=car.color;ctx.font='bold 9px monospace';ctx.textAlign='center';
 ctx.fillText(car.isAI?'CPU':'P'+(car.player+1),x,y-18);
 // Exhaust / tyre smoke crumbs during a high-speed slide.
 for(const smoke of car.particles){
  ctx.globalAlpha=clamp(smoke.life/smoke.max,0,1)*.45;
  ctx.fillStyle='#e1e2df';ctx.beginPath();ctx.arc(x-smoke.dx,y-smoke.dy,smoke.size,0,Math.PI*2);ctx.fill();
 }
 ctx.globalAlpha=1;
}
function drawFrame(){
 const w=canvas.width,h=canvas.height;
 ctx.setTransform(w/1000,0,0,h/640,0,0);
 drawBackground(ctx);
 // Show the racing line and a braking marker before the next heavy corner.
 const player=cars[0],ci=cornerInfo(player.distance+75);
 if(ci.severity>.5){
  const ahead=sampleAt(player.distance+95),x=ahead.x,y=ahead.y;
  ctx.fillStyle='#ffed68';ctx.font='bold 14px monospace';ctx.textAlign='center';
  ctx.fillText('BRAKE!',x,y-30);
  ctx.strokeStyle='#ffed68';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,14,0,Math.PI*2);ctx.stroke();
 }
 cars.slice().sort((a,b)=>a.lane-b.lane).forEach(drawCar);
 // Large in-world info ribbon, legible but compact.
 ctx.fillStyle='#101725e8';ctx.fillRect(14,14,216,58);
 ctx.textAlign='left';ctx.font='bold 12px monospace';
 ctx.fillStyle=player.color;ctx.fillText('SPEED  '+Math.round(player.speed)+' KM/H',25,34);
 const next=cornerInfo(player.distance+90).safeSpeed;
 ctx.fillStyle=player.speed>next+10?'#ff706d':'#d7ff38';
 ctx.fillText('CURVE LIMIT  '+Math.round(next),25,53);
 if(player.offroad>.12){
  ctx.fillStyle='#ffca70';ctx.font='bold 13px monospace';ctx.fillText('OFF TRACK!',250,32);
 }
 if(player.drift>.35){
  ctx.fillStyle='#0d1420e8';ctx.fillRect(815,14,170,28);
  ctx.fillStyle='#39e8e8';ctx.font='bold 12px monospace';ctx.fillText('DRIFT '+Math.round(player.drift*100)+'%',828,33);
 }
 ctx.fillStyle='#101725e8';ctx.fillRect(790,50,196,28);
 ctx.fillStyle='#ffffff';ctx.font='bold 11px monospace';
 const pos=mode==='solo'?(player.distance>=cars[1].distance?'POSITION 1/2':'POSITION 2/2'):(player.distance>=cars[1].distance?'P1 AHEAD':'P2 AHEAD');
 ctx.fillText(pos,802,68);
 if(paused){
  ctx.fillStyle='#050716bb';ctx.fillRect(0,0,1000,640);
  ctx.fillStyle='#d7ff38';ctx.font='bold 40px monospace';ctx.textAlign='center';ctx.fillText('PAUSED',500,310);
  ctx.font='16px monospace';ctx.fillText('PRESS ESC TO RESUME',500,342);
 }
}
function loop(now){
 if(!running||paused)return;
 const dt=Math.min((now-last)/1000,.035);last=now;elapsed+=dt;
 cars.forEach((car,i)=>{if(!car.done)physics(car,i,dt);});
 resolveCollisions(dt);
 $('timer').textContent=format(elapsed);$('lap').textContent=Math.min(LAPS,Math.floor(cars[0].distance/track.length)+1)+'/'+LAPS;
 drawFrame();
 if(cars.some(c=>c.done)){finishRace();return;}
 raf=requestAnimationFrame(loop);
}
function format(t){
 const m=Math.floor(t/60),s=(t%60).toFixed(1).padStart(4,'0');
 return String(m).padStart(2,'0')+':'+s;
}
function finishRace(){
 running=false;cancelAnimationFrame(raf);game.classList.add('hidden');result.classList.remove('hidden');
 const winner=[...cars].sort((a,b)=>(a.finishTime??Infinity)-(b.finishTime??Infinity))[0];
 if(mode==='solo'){
  $('resultTitle').textContent=winner.isAI?'¡TE GANÓ EL RIVAL!':'¡GANASTE LA CARRERA!';
 }else $('resultTitle').textContent='¡GANA EL JUGADOR '+(winner.player+1)+'!';
 $('resultText').textContent=track.name+' · '+LAPS+' vueltas · Tiempo '+format(winner.finishTime??elapsed)+'. '+(stage===9&&!winner.isAI?'¡CAMPEÓN DEL PIXEL GRAND PRIX!':'¿Vamos a la siguiente pista?');
 $('nextBtn').textContent=stage===9?'REPETIR CAMPEONATO ↻':'SIGUIENTE CIRCUITO →';
 $('nextBtn').onclick=()=>start(mode,(stage+1)%tracks.length);
}
$('pauseBtn').onclick=togglePause;
$('backBtn').onclick=()=>{running=false;cancelAnimationFrame(raf);keys=Object.create(null);game.classList.add('hidden');menu.classList.remove('hidden');};
$('menuBtn').onclick=()=>{result.classList.add('hidden');menu.classList.remove('hidden');};
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>start(b.dataset.mode));
$('soundBtn').onclick=()=>{$('soundBtn').textContent='♫ SONIDO: EN DESARROLLO';};
$('graphics').addEventListener('change',()=>{graphics=$('graphics').value;$('views').classList.toggle('pixelated',graphics==='retro');$('views').classList.toggle('performance',graphics==='lite');if(running)resize();});
$('difficulty').addEventListener('change',()=>{difficulty=$('difficulty').value;});
window.addEventListener('resize',()=>{if(running)resize();});
})();