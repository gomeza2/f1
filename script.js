(()=>{'use strict';
const $=id=>document.getElementById(id);
const menu=$('menu'),game=$('game'),result=$('result'),canvas=$('canvas1'),ctx=canvas.getContext('2d');
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
const pointDistance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const LAPS_TO_WIN=3;
function makeTrack(def){
 const p=def.points,n=p.length,samples=[];
 for(let i=0;i<n;i++){
  const p0=p[(i-1+n)%n],p1=p[i],p2=p[(i+1)%n],p3=p[(i+2)%n];
  for(let j=0;j<9;j++){
   const t=j/9,t2=t*t,t3=t2*t;
   samples.push({
    x:.5*(2*p1[0]+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
    y:.5*(2*p1[1]+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)
   });
  }
 }
 let length=0;
 for(let i=0;i<samples.length;i++){samples[i].d=length;length+=pointDistance(samples[i],samples[(i+1)%samples.length]);}
 return {...def,samples,length};
}
const tracks=trackDefs.map(makeTrack);
let stage=0,mode='solo',track=tracks[0],running=false,paused=false,raf=0,last=0,elapsed=0;
let keys=Object.create(null),cars=[],graphics='high',difficulty='normal',decorations=[];
let soundEnabled=true,audioContext=null,engineOsc=null,engineFilter=null,engineGain=null,lastCrashSoundAt=0;
let championship={player1:0,player2:0,rival:0},roundsCompleted=0;
function initAudio(){
 if(audioContext)return;
 const AudioCtor=window.AudioContext||window.webkitAudioContext;
 if(!AudioCtor)return;
 try{
  audioContext=new AudioCtor();
  engineOsc=audioContext.createOscillator();engineFilter=audioContext.createBiquadFilter();engineGain=audioContext.createGain();
  engineOsc.type='sawtooth';engineOsc.frequency.value=48;
  engineFilter.type='lowpass';engineFilter.frequency.value=280;
  engineGain.gain.value=0;
  engineOsc.connect(engineFilter);engineFilter.connect(engineGain);engineGain.connect(audioContext.destination);engineOsc.start();
 }catch(e){audioContext=null;engineOsc=null;engineFilter=null;engineGain=null;}
}
function updateAudio(){
 if(!audioContext||!engineGain||!engineOsc)return;
 const speed=cars[0]?.speed||0,volume=soundEnabled&&running&&!paused?.004+(speed/245)*.018:0;
 const now=audioContext.currentTime;
 engineOsc.frequency.setTargetAtTime(42+speed*.83,now,.07);
 engineGain.gain.setTargetAtTime(volume,now,.09);
}
function playTone(freq,duration=.1,volume=.035){
 if(!soundEnabled||!audioContext)return;
 try{
  const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();
  osc.type='sine';osc.frequency.setValueAtTime(freq,now);
  gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+duration);
 }catch(e){}
}
function resetChampionship(){
 championship={player1:0,player2:0,rival:0};roundsCompleted=0;
}
function awardPoints(winner){
 const winningKey=mode==='solo'?(winner.isAI?'rival':'player1'):(winner.player===0?'player1':'player2');
 const losingKey=mode==='solo'?(winner.isAI?'player1':'rival'):(winner.player===0?'player2':'player1');
 championship[winningKey]+=25;championship[losingKey]+=18;roundsCompleted++;
}
function standingsText(){
 if(mode==='solo')return 'CAMPEONATO · VOS '+championship.player1+' PTS · CPU '+championship.rival+' PTS';
 return 'CAMPEONATO · P1 '+championship.player1+' PTS · P2 '+championship.player2+' PTS';
}
const wrapDistance=d=>((d%track.length)+track.length)%track.length;
function sampleAt(distance){
 const d=wrapDistance(distance),s=track.samples;let lo=0,hi=s.length-1;
 while(lo<hi){const mid=(lo+hi+1)>>1;if(s[mid].d<=d)lo=mid;else hi=mid-1;}
 const a=s[lo],b=s[(lo+1)%s.length],seg=pointDistance(a,b)||1;
 const t=clamp((d-a.d)/seg,0,1);
 return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,angle:Math.atan2(b.y-a.y,b.x-a.x)};
}
function nearestOnTrack(x,y){
 const s=track.samples;let best=Infinity,found=null;
 for(let i=0;i<s.length;i++){
  const a=s[i],b=s[(i+1)%s.length],vx=b.x-a.x,vy=b.y-a.y,len2=vx*vx+vy*vy||1;
  const t=clamp(((x-a.x)*vx+(y-a.y)*vy)/len2,0,1),px=a.x+vx*t,py=a.y+vy*t;
  const dx=x-px,dy=y-py,d2=dx*dx+dy*dy;
  if(d2<best){
   best=d2;const len=Math.sqrt(len2)||1;
   found={x:px,y:py,progress:a.d+t*len,angle:Math.atan2(vy,vx),offset:(vx*dy-vy*dx)/len,distance:Math.sqrt(d2)};
  }
 }
 return found;
}
function curvatureAt(distance){
 const a=sampleAt(distance-38).angle,b=sampleAt(distance+38).angle;
 const turn=wrapAngle(b-a),severity=Math.abs(turn);
 return {turn,severity,safeSpeed:clamp(224/(1+severity*1.65),78,220)};
}
function upcomingCorner(progress){
 let best={safeSpeed:220,severity:0,turn:0,distance:210};
 for(let d=25;d<=220;d+=15){
  const bend=curvatureAt(progress+d);
  const score=bend.severity*(1.14-d/380);
  if(score>best.score||best.score===undefined){
   best={...bend,distance:d,score};
  }
 }
 return best;
}
function decorationsForTrack(){
 const list=[];
 for(let y=24;y<615;y+=42)for(let x=24;x<980;x+=44){
  let nearest=Infinity;
  for(let i=0;i<track.samples.length;i+=2)nearest=Math.min(nearest,Math.hypot(x-track.samples[i].x,y-track.samples[i].y));
  if(nearest>82){
   const type=Math.abs(Math.floor(x*3+y*7+stage*13))%11;
   if(type<7)list.push({x,y,type,size:9+(type%4)*2});
  }
 }
 return list;
}
function resize(){
 const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
 const quality=graphics==='retro'?.58:graphics==='lite'?.75:1;
 canvas.width=Math.max(500,Math.round(r.width*dpr*quality));canvas.height=Math.round(canvas.width*640/1000);
}
function setupCar(player,isAI=false){
 return {player,isAI,color:isAI?'#ffc857':player===0?'#ff3d81':'#39e8e8',
  x:0,y:0,heading:0,speed:0,steer:0,drift:0,done:false,finishTime:null,
  progress:0,previousProgress:0,lap:0,lapTimes:[],lapStartTime:0,raceProgress:0,offroad:0,particles:[],flash:0};
}
function placeCar(car,progress,lateral){
 const p=sampleAt(progress),nx=-Math.sin(p.angle),ny=Math.cos(p.angle);
 car.x=p.x+nx*lateral;car.y=p.y+ny*lateral;car.heading=p.angle;
 car.progress=wrapDistance(progress);car.previousProgress=car.progress;car.raceProgress=car.progress;
}
function start(m,s=Number($('stageSelect').value),keepSeason=false){
 if(!keepSeason)resetChampionship();
 mode=m;stage=s;track=tracks[stage];graphics=$('graphics').value;difficulty=$('difficulty').value;
 cars=[setupCar(0)];
 if(mode==='solo')cars.push(setupCar(1,true));else cars.push(setupCar(1));
 placeCar(cars[0],4,mode==='duo'?-18:-15);
 placeCar(cars[1],mode==='solo'?78:4,mode==='solo'?16:18);
 decorations=decorationsForTrack();elapsed=0;paused=false;running=true;keys=Object.create(null);
 menu.classList.add('hidden');result.classList.add('hidden');game.classList.remove('hidden');
 $('views').classList.toggle('pixelated',graphics==='retro');$('views').classList.toggle('performance',graphics==='lite');
 $('trackName').textContent=track.name;$('stageLabel').textContent=String(stage+1).padStart(2,'0');
 $('helpText').textContent=mode==='duo'?'P1 WASD + ESPACIO · P2 FLECHAS + ENTER':'W acelerar · S frenar · A/D girar · ESPACIO freno de mano';
 $('status').textContent='¡LUZ VERDE!';resize();initAudio();updateAudio();cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop);
}
for(let i=0;i<tracks.length;i++){const o=document.createElement('option');o.value=i;o.textContent=String(i+1).padStart(2,'0')+' — '+tracks[i].name;$('stageSelect').append(o);}
function keyFor(i){return i===0?{up:'w',down:'s',left:'a',right:'d',hand:' '}:{up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright',hand:'enter'};}
window.addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' ','enter'].includes(k))e.preventDefault();
 keys[k]=true;if(k==='escape'&&!e.repeat&&running)togglePause();if(k==='r'&&!e.repeat&&running)start(mode,stage);
});
window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
window.addEventListener('blur',()=>{keys=Object.create(null);});
function togglePause(){
 if(!running)return;paused=!paused;$('status').textContent=paused?'PAUSA — ESC PARA SEGUIR':'¡A FONDO!';updateAudio();
 if(!paused){last=performance.now();raf=requestAnimationFrame(loop);}
}
function updateProgress(car,loc){
 const old=car.progress,newP=loc.progress,delta=newP-old;
 if(delta < -track.length*.5){
  const forward=Math.cos(wrapAngle(car.heading-loc.angle))>.12;
  if(forward){const lapTime=elapsed-car.lapStartTime;car.lapTimes.push(lapTime);car.lapStartTime=elapsed;car.lap++;playTone(car.lap>=LAPS_TO_WIN?880:620,.12,.035);}
 }
 car.previousProgress=old;car.progress=newP;car.raceProgress=car.lap*track.length+newP;
 car.offroad=loc.distance;car.roadOffset=loc.offset;car.nearest=loc;
 if(car.lap>=LAPS_TO_WIN&&!car.done){car.done=true;car.finishTime=elapsed;car.speed=0;}
}
function physics(car,i,dt){
 const before=nearestOnTrack(car.x,car.y),k=keyFor(i),localBend=curvatureAt(before.progress),upcoming=upcomingCorner(before.progress);
 if(car.isAI){
  const target=sampleAt(before.progress+clamp(35+car.speed*.3,42,96));
  const desired=Math.atan2(target.y-car.y,target.x-car.x);
  const error=wrapAngle(desired-car.heading);
  const steerTarget=clamp(error*1.42,-1,1);
  car.steer+=(steerTarget-car.steer)*Math.min(1,dt*6);
  const targetSpeed=clamp(upcoming.safeSpeed+(upcoming.distance>150?35:upcoming.distance>90?17:4),95,difficulty==='easy'?220:215);
  car.speed+=clamp(targetSpeed-car.speed,-220,78)*dt;
 }else{
  const throttle=keys[k.up]?1:0,brake=keys[k.down]?1:0,hand=!!keys[k.hand];
  const steering=(keys[k.right]?1:0)-(keys[k.left]?1:0);
  car.steer+=(steering-car.steer)*Math.min(1,dt*(hand?10:7));
  car.speed+=throttle*(difficulty==='easy'?86:76)*dt;
  car.speed-=brake*(hand?260:192)*dt;
  car.speed-=(throttle?2.4:12)*dt;
  car.speed=clamp(car.speed,0,difficulty==='hard'?240:232);
  if(hand)car.drift=Math.min(1,Math.abs(car.steer)*car.speed/210);
 }
 car.speed=clamp(car.speed,0,245);
 const tooFast=Math.max(0,car.speed-localBend.safeSpeed);
 const grip=clamp(1-tooFast*.0042-(car.drift*.18),.24,1);
 const turnRate=.6+car.speed/235*1.7;
 car.heading=wrapAngle(car.heading+car.steer*turnRate*grip*dt);
 car.drift=clamp(Math.max(car.drift*.92,tooFast/128),0,1);
 const oldProgress=car.progress;
 const move=car.speed*(car.isAI?.63:.62)*dt;
 car.x+=Math.cos(car.heading)*move;car.y+=Math.sin(car.heading)*move;
 const after=nearestOnTrack(car.x,car.y);
 updateProgress(car,after);
 const roadEdge=Math.max(0,Math.abs(after.offset)-38);
 if(roadEdge>0){
  car.speed=Math.max(25,car.speed-(34+roadEdge*1.7)*dt);
  car.drift=Math.max(car.drift,.25);
  if(roadEdge>18){
   // A forgiving recovery keeps cars playable without making corner cutting free.
   const angleToRoad=wrapAngle(after.angle-car.heading);
   car.heading=wrapAngle(car.heading+clamp(angleToRoad,-1,1)*dt*.55);
   car.speed=Math.max(24,car.speed-28*dt);
  }
 }
 if(tooFast>12&&upcoming.distance<130)car.speed=Math.max(30,car.speed-tooFast*dt*.045);
 if(car.drift>.28&&car.speed>55&&Math.random()<dt*15){
  car.particles.push({life:.42,max:.42,dx:(Math.random()-.5)*13,dy:6+Math.random()*10,size:2+Math.random()*3});
 }
 car.particles=car.particles.filter(p=>(p.life-=dt)>0);
 if(car.flash>0)car.flash-=dt;
}
function resolveCollisions(dt){
 const [a,b]=cars;if(!a||!b||a.done||b.done)return;
 const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
 if(d<23){
  const nx=d>.01?dx/d:Math.cos(a.heading),ny=d>.01?dy/d:Math.sin(a.heading),push=(23-d)*.5;
  a.x-=nx*push;b.x+=nx*push;a.y-=ny*push;b.y+=ny*push;
  a.speed=Math.max(30,a.speed-54*dt);b.speed=Math.max(30,b.speed-54*dt);a.flash=.06;b.flash=.06;
  const now=performance.now();if(now-lastCrashSoundAt>420){playTone(105,.12,.05);lastCrashSoundAt=now;}
 }
}
function strokeTrack(context,color,width,dash=[],offset=0){
 context.beginPath();const s=track.samples;context.moveTo(s[0].x,s[0].y);
 for(let i=1;i<s.length;i++)context.lineTo(s[i].x,s[i].y);
 context.closePath();context.lineJoin='round';context.lineCap='round';context.lineWidth=width;
 context.strokeStyle=color;context.setLineDash(dash);context.lineDashOffset=offset;context.stroke();context.setLineDash([]);
}
function drawBackground(context){
 context.fillStyle=track.grass;context.fillRect(0,0,1000,640);
 for(let y=0;y<640;y+=36){context.fillStyle=(Math.floor(y/36)%2)?'#ffffff05':'#0b2b1a0a';context.fillRect(0,y,1000,18);}
 for(const d of decorations){
  if(stage===1||stage===3||stage===7){
   context.fillStyle='#233348';context.fillRect(d.x-d.size*.75,d.y-d.size*1.5,d.size*1.5,d.size*1.5);
   context.fillStyle=track.accent;context.fillRect(d.x-d.size*.43,d.y-d.size*1.15,3,4);context.fillRect(d.x+d.size*.05,d.y-d.size*.8,3,4);
  }else if(stage===2){
   context.fillStyle='#9b7750';context.fillRect(d.x-4,d.y-4,8,8);context.fillStyle='#557047';context.fillRect(d.x-2,d.y-12,4,12);context.fillRect(d.x-8,d.y-8,6,3);
  }else if(stage===4){
   context.fillStyle='#e2f5f6';context.beginPath();context.moveTo(d.x,d.y-d.size*1.7);context.lineTo(d.x-d.size,d.y+d.size*.5);context.lineTo(d.x+d.size,d.y+d.size*.5);context.fill();
   context.fillStyle='#337967';context.fillRect(d.x-2,d.y,4,7);
  }else if(stage===5){
   context.fillStyle='#4f3d2a';context.fillRect(d.x-2,d.y-8,4,15);context.fillStyle=d.type%2?'#164831':'#2e7145';context.beginPath();context.arc(d.x,d.y-10,d.size,0,Math.PI*2);context.fill();
  }else if(stage===6){
   context.fillStyle='#3c333b';context.beginPath();context.arc(d.x,d.y,d.size,0,Math.PI*2);context.fill();context.fillStyle='#d65d3e';context.fillRect(d.x-2,d.y-2,4,Math.max(3,d.size*.5));
  }else{
   context.fillStyle='#604d3d';context.fillRect(d.x-2,d.y-7,4,10);context.fillStyle=d.type%2?'#1e5a3d':'#2f7950';context.beginPath();context.arc(d.x,d.y-10,d.size,0,Math.PI*2);context.fill();context.fillStyle='#8bbf65';context.fillRect(d.x-2,d.y-14,4,3);
  }
 }
 strokeTrack(context,'#18251f',124);
 strokeTrack(context,'#e74b5d',109,[24,24],0);
 strokeTrack(context,'#f5f0dc',109,[24,24],24);
 strokeTrack(context,'#4b505b',89);
 strokeTrack(context,graphics==='high'?'#777d87':'#646873',83);
 strokeTrack(context,'#eef0d8ad',2.5,[18,22],-elapsed*9);
 const start=sampleAt(0);context.save();context.translate(start.x,start.y);context.rotate(start.angle);
 for(let j=0;j<10;j++){context.fillStyle=j%2?'#f5f5e9':'#181b22';context.fillRect(-5,-43+j*8.6,10,8.6);}
 context.restore();
 const sign=sampleAt(135),nx=-Math.sin(sign.angle),ny=Math.cos(sign.angle);
 context.save();context.translate(sign.x+nx*72,sign.y+ny*72);context.rotate(sign.angle);
 context.fillStyle='#111725';context.fillRect(-48,-12,96,24);context.fillStyle=track.accent;context.font='bold 10px monospace';context.textAlign='center';context.fillText(track.name,0,4);context.restore();
}
function drawCar(context,car){
 context.save();context.translate(car.x,car.y);context.rotate(car.heading);
 if(car.offroad>39){context.fillStyle='#d6bf94';context.globalAlpha=.4;context.fillRect(-16,-9,32,18);context.globalAlpha=1;}
 if(graphics==='high'){context.fillStyle='#00000055';context.fillRect(-17,-9,36,20);}
 context.fillStyle='#151923';context.fillRect(-9,-10,7,5);context.fillRect(5,-10,7,5);context.fillRect(-9,5,7,5);context.fillRect(5,5,7,5);
 context.fillStyle=car.flash>0?'#ffffff':car.color;context.fillRect(-15,-7,30,14);
 context.fillStyle='#242b3a';context.fillRect(-5,-5,12,10);context.fillStyle='#baf4ff';context.fillRect(2,-4,6,8);
 context.fillStyle='#fff4ad';context.fillRect(11,-5,3,3);context.fillRect(11,2,3,3);
 context.fillStyle='#a9344e';context.fillRect(-15,-5,3,3);context.fillRect(-15,2,3,3);context.fillStyle='#111725';context.fillRect(-12,-11,24,2);
 context.restore();
 context.fillStyle='#10151ddd';context.fillRect(car.x-19,car.y-27,38,11);
 context.fillStyle=car.color;context.font='bold 9px monospace';context.textAlign='center';context.fillText(car.isAI?'CPU':'P'+(car.player+1),car.x,car.y-19);
 for(const smoke of car.particles){
  context.globalAlpha=clamp(smoke.life/smoke.max,0,1)*.42;context.fillStyle='#e1e2df';context.beginPath();context.arc(car.x-smoke.dx,car.y+smoke.dy,smoke.size,0,Math.PI*2);context.fill();
 }
 context.globalAlpha=1;
}
function drawMiniMap(context){
 context.save();context.translate(800,500);context.scale(.18,.18);
 context.fillStyle='#111725dd';context.fillRect(-12,-12,1024,664);
 strokeTrack(context,'#05070c',142);strokeTrack(context,'#5d6574',88);
 cars.forEach(car=>{context.fillStyle=car.color;context.beginPath();context.arc(car.x,car.y,19,0,Math.PI*2);context.fill();});
 context.restore();
 context.fillStyle='#111725e8';context.fillRect(795,480,190,18);context.fillStyle='#d7ff38';context.font='bold 10px monospace';context.textAlign='left';context.fillText('CIRCUIT MAP',806,493);
}
function drawFrame(){
 const w=canvas.width,h=canvas.height;ctx.setTransform(w/1000,0,0,h/640,0,0);drawBackground(ctx);
 const player=cars[0],bend=upcomingCorner(player.progress);
 if(player.speed>bend.safeSpeed+8&&bend.distance<175){
  const m=sampleAt(player.progress+bend.distance);
  ctx.save();ctx.translate(m.x,m.y-28);ctx.fillStyle='#161725e8';ctx.fillRect(-37,-12,74,24);
  ctx.fillStyle='#ffed68';ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.fillText('BRAKE!',0,5);ctx.restore();
 }
 cars.slice().sort((a,b)=>a.speed-b.speed).forEach(car=>drawCar(ctx,car));
 ctx.fillStyle='#101725ed';ctx.fillRect(14,14,245,68);ctx.textAlign='left';ctx.font='bold 13px monospace';
 ctx.fillStyle=player.color;ctx.fillText('SPEED  '+Math.round(player.speed)+' KM/H',26,35);
 const safe=curvatureAt(player.progress+28).safeSpeed;
 ctx.fillStyle=player.speed>safe+15?'#ff706d':'#d7ff38';ctx.fillText('CURVE LIMIT  '+Math.round(safe),26,56);
 ctx.fillStyle='#e9edf9';ctx.font='bold 11px monospace';ctx.fillText('LAP '+Math.min(LAPS_TO_WIN,player.lap+1)+'/'+LAPS_TO_WIN,26,73);
 if(player.offroad>37){ctx.fillStyle='#ffca70';ctx.font='bold 14px monospace';ctx.fillText('OFF TRACK! SLOW DOWN',285,32);}
 if(player.drift>.35){ctx.fillStyle='#0d1420e8';ctx.fillRect(820,14,165,27);ctx.fillStyle='#39e8e8';ctx.font='bold 12px monospace';ctx.fillText('SLIDE '+Math.round(player.drift*100)+'%',830,33);}
 drawMiniMap(ctx);
 if(paused){ctx.fillStyle='#050716bb';ctx.fillRect(0,0,1000,640);ctx.fillStyle='#d7ff38';ctx.font='bold 40px monospace';ctx.textAlign='center';ctx.fillText('PAUSED',500,310);ctx.font='16px monospace';ctx.fillText('PRESS ESC TO RESUME',500,342);}
}
function loop(now){
 if(!running||paused)return;
 const dt=Math.min((now-last)/1000,.03);last=now;elapsed+=dt;
 cars.forEach((car,i)=>{if(!car.done)physics(car,i,dt);});
 resolveCollisions(dt);
 $('timer').textContent=format(elapsed);$('lap').textContent=Math.min(LAPS_TO_WIN,cars[0].lap+1)+'/'+LAPS_TO_WIN;
 updateAudio();drawFrame();
 if(cars.some(car=>car.done)){finishRace();return;}
 raf=requestAnimationFrame(loop);
}
function format(t){const m=Math.floor(t/60),s=(t%60).toFixed(1).padStart(4,'0');return String(m).padStart(2,'0')+':'+s;}
function finishRace(){
 running=false;cancelAnimationFrame(raf);game.classList.add('hidden');result.classList.remove('hidden');
 const winner=[...cars].sort((a,b)=>(a.finishTime??Infinity)-(b.finishTime??Infinity))[0];
 awardPoints(winner);updateAudio();
 if(stage===9)$('resultTitle').textContent='¡CAMPEONATO TERMINADO!';
 else if(mode==='solo')$('resultTitle').textContent=winner.isAI?'¡TE GANÓ EL RIVAL!':'¡GANASTE LA CARRERA!';
 else $('resultTitle').textContent='¡GANA EL JUGADOR '+(winner.player+1)+'!';
 const champion=Object.entries(championship).sort((a,b)=>b[1]-a[1])[0];
 const finalNote=stage===9?' · CAMPEÓN DE TEMPORADA: '+(champion[0]==='player1'?'JUGADOR 1':champion[0]==='player2'?'JUGADOR 2':'CPU')+' ('+champion[1]+' pts)':'';
 $('resultText').textContent=track.name+' · '+LAPS_TO_WIN+' vueltas · Tiempo total '+format(winner.finishTime??elapsed)+(winner.lapTimes.length?' · Mejor vuelta '+format(Math.min(...winner.lapTimes)):'')+' · '+standingsText()+finalNote;
 $('nextBtn').textContent=stage===9?'NUEVA TEMPORADA ↻':'SIGUIENTE CIRCUITO →';
 $('nextBtn').onclick=()=>stage===9?start(mode,0,false):start(mode,(stage+1)%tracks.length,true);
}
$('pauseBtn').onclick=togglePause;
$('restartBtn').onclick=()=>start(mode,stage,true);
$('backBtn').onclick=()=>{running=false;updateAudio();cancelAnimationFrame(raf);keys=Object.create(null);game.classList.add('hidden');menu.classList.remove('hidden');};
$('menuBtn').onclick=()=>{result.classList.add('hidden');menu.classList.remove('hidden');};
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>start(b.dataset.mode));
$('soundBtn').onclick=()=>{soundEnabled=!soundEnabled;$('soundBtn').textContent='♫ SONIDO: '+(soundEnabled?'ON':'OFF');if(soundEnabled){initAudio();if(audioContext&&audioContext.state==='suspended')audioContext.resume().catch(()=>{});}updateAudio();};
$('graphics').addEventListener('change',()=>{graphics=$('graphics').value;$('views').classList.toggle('pixelated',graphics==='retro');$('views').classList.toggle('performance',graphics==='lite');if(running)resize();});
$('difficulty').addEventListener('change',()=>{difficulty=$('difficulty').value;});
window.addEventListener('resize',()=>{if(running)resize();});
})();