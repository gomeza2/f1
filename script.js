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
,
{name:'COASTLINE RUN',sky:'#76c6db',grass:'#347f68',accent:'#cfff9d',environment:'coast',points:[[105,135],[165,95],[255,82],[340,105],[405,150],[485,138],[545,92],[625,86],[710,108],[800,91],[875,125],[905,180],[890,232],[825,252],[755,226],[700,258],[706,312],[770,332],[840,311],[895,350],[908,411],[875,466],[808,485],[735,456],[685,418],[608,436],[553,493],[485,535],[410,548],[334,520],[270,541],[198,519],[132,480],[95,422],[116,366],[178,343],[237,364],[293,338],[284,281],[221,258],[157,279],[108,237],[84,184]]},
{name:'RALLY CANYON',sky:'#d7b17c',grass:'#a58b5b',accent:'#f5d49a',environment:'rally',points:[[112,112],[178,86],[250,105],[287,155],[350,172],[404,132],[458,91],[533,95],[585,137],[575,195],[520,225],[455,215],[410,252],[430,303],[490,321],[547,301],[600,262],[663,276],[704,324],[684,371],[634,385],[585,366],[540,396],[554,450],[615,485],[690,480],[755,515],[829,529],[895,495],[910,437],[870,400],[810,415],[766,450],[720,431],[700,391],[739,352],[785,320],[791,272],[746,236],[676,225],[625,190],[640,145],[600,105],[520,78],[431,77],[365,95],[309,82],[249,100],[195,128],[154,160],[111,163],[87,132]]}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrapAngle=a=>Math.atan2(Math.sin(a),Math.cos(a));
const pointDistance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const LAPS_TO_WIN=3;
const ROAD_EDGE=42, WALL_EDGE=66;
const CAR_MODELS={
 balanced:{name:'BALANCED',maxSpeed:232,acceleration:76,braking:192,steering:1,grip:1,grass:1,description:'Equilibrado para aprender y competir.'},
 corner:{name:'CORNER KING',maxSpeed:218,acceleration:73,braking:215,steering:1.19,grip:1.15,grass:.86,description:'Más agarre y frenado; velocidad punta menor.'},
 speed:{name:'SPEED DEMON',maxSpeed:250,acceleration:86,braking:178,steering:.84,grip:.87,grass:1.12,description:'Rápido en rectas, difícil en curvas cerradas.'},
 rally:{name:'RALLY FOX',maxSpeed:222,acceleration:77,braking:207,steering:1.08,grip:1.04,grass:.57,description:'Pierde menos velocidad si toca el pasto.'}
};
const CAR_PAINTS={
 pink:{name:'HOT PINK',hex:'#ff3d81'},cyan:{name:'NEON CYAN',hex:'#39e8e8'},
 lime:{name:'ARCADE LIME',hex:'#d7ff38'},orange:{name:'TURBO ORANGE',hex:'#ff984d'},
 violet:{name:'PURPLE HAZE',hex:'#b77cff'},white:{name:'ICE WHITE',hex:'#f0f3ff'}
};
function makeTrack(def){
 // Ampliamos las trazadas sobre el lienzo para aprovechar mejor la pantalla.
 const p=def.points.map(([x,y])=>[500+(x-500)*1.06,320+(y-320)*1.05]),n=p.length,samples=[];
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
let countdownRemaining=0,goFlashRemaining=0,countdownShown='';
const BEST_LAPS_KEY='pixelGP.bestLaps.v1';
function readBestLapRecords(){try{const value=JSON.parse(localStorage.getItem(BEST_LAPS_KEY)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch(error){return {};}}
let bestLapRecords=readBestLapRecords();
function saveBestLap(trackName,time){if(!Number.isFinite(time)||time<=0)return false;const previous=bestLapRecords[trackName];if(Number.isFinite(previous)&&previous<=time)return false;bestLapRecords[trackName]=time;try{localStorage.setItem(BEST_LAPS_KEY,JSON.stringify(bestLapRecords));}catch(error){}return true;}
let keys=Object.create(null),cars=[],graphics='high',difficulty='normal',decorations=[],tireBarriers=[],checkpoints=[];
let barrierMode='full',guardrailRanges=[],skidMarks=[],terrainParticles=[],trackFeatures={braking:[],passing:[]};
let backgroundCache=null,backgroundCacheKey='',trackSurfaceCache=null,trackSurfaceKey='';
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
 const speed=cars[0]?.speed||0,volume=(soundEnabled&&running&&!paused&&countdownRemaining<=0)?(.004+(speed/245)*.018):0;
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
 const loser=cars.find(car=>car!==winner);
 championship[winningKey]+=25;
 championship[losingKey]+=loser?.done?18:0;
 roundsCompleted++;
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
function buildTrackFeatures(){
 // Detectamos los vértices más duros y después escogemos un conjunto pequeño y bien espaciado.
 const candidates=[];
 for(let d=45;d<track.length;d+=28){const bend=curvatureAt(d);if(bend.severity>.30)candidates.push({progress:d,turn:bend.turn,severity:bend.severity});}
 candidates.sort((a,b)=>b.severity-a.severity);
 const corners=[];
 for(const candidate of candidates){
  const separated=corners.every(c=>{const delta=Math.abs(c.progress-candidate.progress);return Math.min(delta,track.length-delta)>225;});
  if(separated)corners.push(candidate);
  if(corners.length>=6)break;
 }
 corners.sort((a,b)=>a.progress-b.progress);
 const braking=[];
 for(const corner of corners){
  braking.push({cornerProgress:corner.progress,progress:wrapDistance(corner.progress-108),turn:corner.turn,severity:corner.severity,label:'100'});
  braking.push({cornerProgress:corner.progress,progress:wrapDistance(corner.progress-54),turn:corner.turn,severity:corner.severity,label:'50'});
 }
 // Escoger tres sectores de ataque por circuito según la menor curvatura local y separarlos bastante.
 const straightCandidates=[];
 for(let d=80;d<track.length;d+=24){
  const before=curvatureAt(d-55),here=curvatureAt(d),after=curvatureAt(d+55);
  const score=(before.severity+here.severity+after.severity)/3;
  const nearestCorner=corners.reduce((best,c)=>{const delta=Math.abs(c.progress-d);return Math.min(best,Math.min(delta,track.length-delta));},Infinity);
  if(score<.42&&nearestCorner>75)straightCandidates.push({progress:d,score});
 }
 straightCandidates.sort((a,b)=>a.score-b.score);
 const passing=[];
 for(const candidate of straightCandidates){
  const separated=passing.every(zone=>{const delta=Math.abs(zone.progress-candidate.progress);return Math.min(delta,track.length-delta)>track.length*.10;});
  if(separated)passing.push({progress:candidate.progress,score:candidate.score});
  if(passing.length>=3)break;
 }
 return {braking,passing};
}
function drawTrackFeatures(context){
 // Carteles de frenado en el exterior de las curvas: 100 y 50 antes del vértice.
 for(const sign of trackFeatures.braking){
  const p=sampleAt(sign.progress),nx=-Math.sin(p.angle),ny=Math.cos(p.angle),side=sign.turn>0?-1:1;
  const x=p.x+nx*side*77,y=p.y+ny*side*77;
  context.save();context.translate(x,y);context.rotate(p.angle);
  context.fillStyle='#141821';context.fillRect(-13,-12,26,24);
  context.fillStyle=track.accent;context.fillRect(-11,-10,22,20);
  context.fillStyle='#151923';context.fillRect(-9,-8,18,16);
  context.fillStyle='#f9f3d6';context.font='bold 9px monospace';context.textAlign='center';context.textBaseline='middle';context.fillText(sign.label,0,0);
  context.restore();
 }
 // Las rectas largas tienen marcas verdes que sugieren zonas para buscar el adelantamiento.
 for(const zone of trackFeatures.passing){
  const p=sampleAt(zone.progress),tx=Math.cos(p.angle),ty=Math.sin(p.angle),nx=-ty,ny=tx;
  context.save();context.strokeStyle='#c8ff54';context.lineWidth=2;context.globalAlpha=.8;
  for(const lateral of [-1,0,1]){
   const along=lateral*9,cx=p.x+tx*along,cy=p.y+ty*along;
   context.beginPath();context.moveTo(cx-nx*32,cy-ny*32);context.lineTo(cx+nx*32,cy+ny*32);context.stroke();
  }
  const side=-1,x=p.x+nx*side*77,y=p.y+ny*side*77;
  context.translate(x,y);context.rotate(p.angle);context.fillStyle='#10291e';context.fillRect(-17,-11,34,22);context.strokeStyle='#c8ff54';context.lineWidth=2;context.strokeRect(-17,-11,34,22);context.fillStyle='#d7ff38';context.font='bold 7px monospace';context.textAlign='center';context.textBaseline='middle';context.fillText('PASS',0,0);context.restore();
 }
}
function guardrailRangesForTrack(){return barrierMode==='full'?[[0,track.length]]:[[0,track.length*.5]];}
function guardrailActive(progress){const d=wrapDistance(progress);return guardrailRanges.some(([start,end])=>d>=start&&d<end);}
function barriersForTrack(){
 const list=[];if(barrierMode!=='half')return list;
 // En el perfil mixto, los neumáticos protegen algunas curvas del tramo abierto.
 for(let d=track.length*.5;d<track.length;d+=10){const bend=curvatureAt(d);if(bend.severity<.2)continue;
  const p=sampleAt(d),nx=-Math.sin(p.angle),ny=Math.cos(p.angle),outside=bend.turn>0?-1:1;
  list.push({x:p.x+nx*outside*57,y:p.y+ny*outside*57,angle:p.angle,progress:d,side:outside});
 }return list;
}
function tireBarrierContact(loc){
 if(!tireBarriers.length||Math.abs(loc.offset)<47)return false;const side=Math.sign(loc.offset)||1;
 return tireBarriers.some(t=>{const diff=Math.abs(t.progress-loc.progress),around=Math.min(diff,track.length-diff);return t.side===side&&around<15;});
}
function checkpointsForTrack(){
 const result=[];
 for(let i=1;i<=3;i++){const progress=track.length*i/4,p=sampleAt(progress);result.push({id:i,progress,x:p.x,y:p.y,angle:p.angle});}
 return result;
}
function drawCheckpoints(context){
 for(const gate of checkpoints){
  const p=sampleAt(gate.progress);
  context.save();context.translate(p.x,p.y);context.rotate(p.angle);
  context.fillStyle='#0b1226d9';context.fillRect(-4,-ROAD_EDGE,8,ROAD_EDGE*2);
  for(let j=0;j<10;j++){context.fillStyle=j%2?'#d7ff38':'#f6f7ff';context.fillRect(-4,j*(ROAD_EDGE*2/10)-ROAD_EDGE,8,ROAD_EDGE*2/10);}
  context.restore();
  context.fillStyle='#111725e8';context.fillRect(p.x-13,p.y-ROAD_EDGE-19,26,15);
  context.fillStyle='#d7ff38';context.font='bold 10px monospace';context.textAlign='center';context.fillText('CP'+gate.id,p.x,p.y-ROAD_EDGE-8);
 }
}
function updateGaragePreview(){
 const id=$('carModel')?.value||'balanced',paint=CAR_PAINTS[$('carColor')?.value||'pink']||CAR_PAINTS.pink;
 const car=CAR_MODELS[id]||CAR_MODELS.balanced,preview=$('garageSummary');
 if(!preview)return;
 preview.innerHTML='<span class="paint-dot" style="background:'+paint.hex+'"></span><strong>'+car.name+'</strong><span>'+Math.round(car.maxSpeed)+' KM/H MAX</span><span>AGARRE '+Math.round(car.grip*100)+'%</span><small>'+car.description+'</small>';
 preview.style.setProperty('--car-paint',paint.hex);
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
 const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),quality=graphics==='retro'?.58:graphics==='lite'?.75:1;
 const width=Math.max(500,Math.round(r.width*dpr*quality)),height=Math.max(320,Math.round(width*640/1000));
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;backgroundCache=null;backgroundCacheKey='';trackSurfaceCache=null;trackSurfaceKey='';}
}
function drawTrackSurface(context){
 const key=stage+'|'+graphics+'|'+barrierMode;
 if(!trackSurfaceCache||trackSurfaceKey!==key){
  const surface=document.createElement('canvas');surface.width=1000;surface.height=640;
  const sc=surface.getContext('2d');
  if(stage===11){
   // Tierra compactada de rally: hombros oscuros, grava tostada y surcos visibles.
   strokeTrack(sc,'#49372b',122);strokeTrack(sc,'#76543b',112);strokeTrack(sc,'#9a7653',99);
   strokeTrack(sc,'#b18c64',88,[17,22],0);strokeTrack(sc,'#a27d55',82,[6,20],10);
   strokeTrack(sc,'#876548',73);strokeTrack(sc,'#c0a078',68);strokeTrack(sc,'#876548',61);
  }else{
   strokeTrack(sc,'#11171c',122);strokeTrack(sc,'#cdd1d3',114,[18,18],0);
   strokeTrack(sc,'#d84b59',106,[12,24],0);strokeTrack(sc,'#282d37',94);
   strokeTrack(sc,'#e74b5d',82,[23,23],0);strokeTrack(sc,'#f5f0dc',82,[23,23],23);
   strokeTrack(sc,'#3c414c',74);strokeTrack(sc,graphics==='high'?'#707783':'#646873',68);strokeTrack(sc,'#2c313b',61);
  }
  trackSurfaceCache=surface;trackSurfaceKey=key;
 }
 context.drawImage(trackSurfaceCache,0,0,1000,640);
}
function setupCar(player,isAI=false){
 const model=isAI?'balanced':player===0?($('carModel')?.value||'balanced'):'balanced';
 const paint=CAR_PAINTS[$('carColor')?.value||'pink']||CAR_PAINTS.pink;
 return {player,isAI,model,color:isAI?'#ffc857':player===0?paint.hex:'#39e8e8',
  x:0,y:0,heading:0,speed:0,steer:0,drift:0,handbrake:false,done:false,finishTime:null,newBestLap:false,
  progress:0,previousProgress:0,lap:0,lapTimes:[],lapStartTime:0,raceProgress:0,offroad:0,roadOffset:0,particles:[],flash:0};
}
function placeCar(car,progress,lateral){
 const p=sampleAt(progress),nx=-Math.sin(p.angle),ny=Math.cos(p.angle);
 car.x=p.x+nx*lateral;car.y=p.y+ny*lateral;car.heading=p.angle;
 car.progress=wrapDistance(progress);car.previousProgress=car.progress;car.raceProgress=car.progress;
 car.nextCheckpoint=0;car.checkpointPasses=0;car.lastCheckpointTime=0;
}
function start(m,s=Number($('stageSelect').value),keepSeason=false){
 if(!keepSeason)resetChampionship();
 mode=m;stage=s;track=tracks[stage];graphics=$('graphics').value;difficulty=$('difficulty').value;
 backgroundCache=null;backgroundCacheKey='';trackSurfaceCache=null;trackSurfaceKey='';checkpoints=checkpointsForTrack();
 cars=[setupCar(0)];
 if(mode==='solo')cars.push(setupCar(1,true));else cars.push(setupCar(1));
 placeCar(cars[0],4,mode==='duo'?-18:-15);
 placeCar(cars[1],mode==='solo'?78:4,mode==='solo'?16:18);
 barrierMode=$('barrierMode')?.value||'full';guardrailRanges=guardrailRangesForTrack();trackFeatures=buildTrackFeatures();
 decorations=decorationsForTrack();tireBarriers=barriersForTrack();skidMarks=[];terrainParticles=[];elapsed=0;countdownRemaining=3;goFlashRemaining=0;countdownShown='';paused=false;running=true;keys=Object.create(null);
 menu.classList.add('hidden');result.classList.add('hidden');game.classList.remove('hidden');
 $('views').classList.toggle('pixelated',graphics==='retro');$('views').classList.toggle('performance',graphics==='lite');
 $('trackName').textContent=track.name;$('stageLabel').textContent=String(stage+1).padStart(2,'0');if($('trackCount'))$('trackCount').textContent=String(tracks.length).padStart(2,'0');
 $('helpText').textContent=mode==='duo'?'P1 WASD + ESPACIO · P2 FLECHAS + ENTER':'W acelerar · S frenar · A/D girar · ESPACIO freno de mano';
 $('status').textContent='PREPARADOS...';resize();initAudio();updateAudio();cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop);
}
for(let i=0;i<tracks.length;i++){const o=document.createElement('option');o.value=i;o.textContent=String(i+1).padStart(2,'0')+' — '+tracks[i].name;$('stageSelect').append(o);}
function keyFor(i){return i===0?{up:'w',down:'s',left:'a',right:'d',hand:' '}:{up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright',hand:'enter'};}
window.addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' ','enter'].includes(k))e.preventDefault();
 keys[k]=true;if(k==='escape'&&!e.repeat&&running)togglePause();if(k==='r'&&!e.repeat&&running)start(mode,stage,true);
});
window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
window.addEventListener('blur',()=>{keys=Object.create(null);});
function togglePause(){
 if(!running)return;paused=!paused;$('status').textContent=paused?'PAUSA — ESC PARA SEGUIR':'¡A FONDO!';updateAudio();
 if(!paused){last=performance.now();raf=requestAnimationFrame(loop);}
}
function gateCrossed(gate,fromX,fromY,toX,toY,heading){
 const tx=Math.cos(gate.angle),ty=Math.sin(gate.angle),nx=-ty,ny=tx;
 const before=(fromX-gate.x)*tx+(fromY-gate.y)*ty;
 const after=(toX-gate.x)*tx+(toY-gate.y)*ty;
 const lateral=(toX-gate.x)*nx+(toY-gate.y)*ny;
 const forward=Math.cos(wrapAngle(heading-gate.angle))>.12;
 return before<0&&after>=0&&Math.abs(lateral)<=ROAD_EDGE&&forward;
}
function updateProgress(car,loc,fromX,fromY){
 const old=car.progress,newP=loc.progress,delta=newP-old;
 const finishGate=sampleAt(0);
 const finish={x:finishGate.x,y:finishGate.y,angle:finishGate.angle};
 for(let tries=0;tries<checkpoints.length;tries++){
  const gate=checkpoints[car.nextCheckpoint];
  if(gate&&gateCrossed(gate,fromX,fromY,car.x,car.y,car.heading)){
   car.checkpointPasses++;car.nextCheckpoint=(car.nextCheckpoint+1)%checkpoints.length;
   car.lastCheckpointTime=elapsed;playTone(520+gate.id*80,.07,.022);
  }else break;
 }
 if(gateCrossed(finish,fromX,fromY,car.x,car.y,car.heading)&&car.checkpointPasses===checkpoints.length){
  const lapTime=elapsed-car.lapStartTime;
  car.lapTimes.push(lapTime);
  if(!car.isAI&&saveBestLap(track.name,lapTime)){car.newBestLap=true;playTone(1040,.16,.035);}
  car.lapStartTime=elapsed;car.lap++;car.checkpointPasses=0;car.nextCheckpoint=0;
  playTone(car.lap>=LAPS_TO_WIN?880:620,.12,.035);
 }
 car.previousProgress=old;car.progress=newP;car.raceProgress=car.lap*track.length+newP;
 car.offroad=Math.abs(loc.offset);car.roadOffset=loc.offset;car.nearest=loc;
 if(car.lap>=LAPS_TO_WIN&&!car.done){car.done=true;car.finishTime=elapsed;car.speed=0;}
}
function physics(car,i,dt){
 const before=nearestOnTrack(car.x,car.y),k=keyFor(i),localBend=curvatureAt(before.progress),upcoming=upcomingCorner(before.progress);
 const baseModel=CAR_MODELS[car.model]||CAR_MODELS.balanced;
 const model=car.isAI?{...baseModel,maxSpeed:difficulty==='hard'?246:difficulty==='normal'?238:220,steering:difficulty==='hard'?1.08:difficulty==='normal'?1.02:.98,grip:difficulty==='hard'?1.04:difficulty==='normal'?1:.97}:baseModel;
 if(car.isAI){
  const player=cars[0],lookAhead=clamp(48+car.speed*.4,58,118),bendAhead=curvatureAt(before.progress+lookAhead);
  let laneOffset=clamp(bendAhead.turn*43,-20,20);
  const rivalDistance=player?Math.hypot(player.x-car.x,player.y-car.y):Infinity;
  if(player&&rivalDistance<150){const playerLoc=nearestOnTrack(player.x,player.y);laneOffset=Math.abs(playerLoc.offset)<13?(playerLoc.offset>=0?-27:27):clamp(-Math.sign(playerLoc.offset)*29,-29,29);}
  const targetBase=sampleAt(before.progress+lookAhead),nx=-Math.sin(targetBase.angle),ny=Math.cos(targetBase.angle);
  const target={x:targetBase.x+nx*laneOffset,y:targetBase.y+ny*laneOffset};
  const desired=Math.atan2(target.y-car.y,target.x-car.x),error=wrapAngle(desired-car.heading),steerTarget=clamp(error*1.78,-1,1);
  car.steer+=(steerTarget-car.steer)*Math.min(1,dt*8.5);
  const aiSkill=difficulty==='easy'?.86:difficulty==='hard'?1.12:1.035;
  const attackBoost=difficulty==='easy'?0:(rivalDistance<175&&upcoming.severity<.23?(difficulty==='hard'?26:15):0);
  const straightBonus=upcoming.distance>150?48:upcoming.distance>90?25:7;
  const maxAiSpeed=difficulty==='hard'?246:difficulty==='normal'?236:211;
  const targetSpeed=clamp((upcoming.safeSpeed+straightBonus)*aiSkill+attackBoost,82,maxAiSpeed);
  car.speed+=clamp(targetSpeed-car.speed,-255,104)*dt;car.handbrake=false;
 }else{
  const throttle=keys[k.up]?1:0,brake=keys[k.down]?1:0,hand=!!keys[k.hand];car.handbrake=hand;
  const steering=(keys[k.right]?1:0)-(keys[k.left]?1:0);
  car.steer+=(steering-car.steer)*Math.min(1,dt*(hand?10:7));
  car.speed+=throttle*model.acceleration*dt;
  car.speed-=brake*(hand?model.braking*1.27:model.braking)*dt;
  // Levantar el acelerador ayuda, pero las curvas cerradas igual exigen frenar temprano.
  car.speed-=(throttle?2.6:20)*dt;
  car.speed=clamp(car.speed,0,model.maxSpeed);
  if(hand)car.drift=Math.min(1,Math.abs(car.steer)*car.speed/200);
 }
 car.speed=clamp(car.speed,0,model.maxSpeed);
 const tooFast=Math.max(0,car.speed-localBend.safeSpeed);
 const grip=clamp((1-tooFast*.006-(car.drift*(car.handbrake ? 0.07 : 0.2)))*model.grip,.18,1.08);
 const turnRate=(.6+car.speed/235*1.7)*model.steering*(car.handbrake?1.2:1);
 car.heading=wrapAngle(car.heading+car.steer*turnRate*grip*dt);
 car.drift=clamp(Math.max(car.drift*.92,tooFast/128),0,1);
 const oldProgress=car.progress,previousX=car.x,previousY=car.y;
 const move=car.speed*(car.isAI?.66:.62)*dt;
 car.x+=Math.cos(car.heading)*move;car.y+=Math.sin(car.heading)*move;
 let after=nearestOnTrack(car.x,car.y);
 // El pasto tiene mucha resistencia: penaliza fuerte, pero permite recuperar el auto.
 let roadEdge=Math.max(0,Math.abs(after.offset)-ROAD_EDGE);
 if(roadEdge>0){
  car.speed=Math.max(18,car.speed-(82+roadEdge*4.6)*model.grass*dt);
  car.drift=Math.max(car.drift,.28);
 }
 // Las colisiones físicas coinciden con las vallas visibles; los tramos abiertos dejan más margen.
 const side=Math.sign(after.offset)||1,nx=-Math.sin(after.angle),ny=Math.cos(after.angle);
 const railContact=guardrailActive(after.progress),tyreContact=!railContact&&tireBarrierContact(after);
 const collisionLimit=railContact?54:(tyreContact?51:Infinity);
 if(Math.abs(after.offset)>collisionLimit){
  car.x=after.x+nx*side*(collisionLimit-1);car.y=after.y+ny*side*(collisionLimit-1);
  const outward=Math.cos(car.heading)*nx*side+Math.sin(car.heading)*ny*side;
  if(outward>0){const vx=Math.cos(car.heading)-2*outward*nx*side,vy=Math.sin(car.heading)-2*outward*ny*side;car.heading=Math.atan2(vy,vx);}
  car.speed=Math.max(22,car.speed*(railContact?.52:.58));car.steer*=.42;if(car.flash<=0)playTone(125,.09,.04);car.flash=.16;after=nearestOnTrack(car.x,car.y);
 }else if(!railContact&&!tyreContact&&Math.abs(after.offset)>92){
  car.speed=Math.max(12,car.speed-(100+(Math.abs(after.offset)-92)*2.2)*dt);
  if(Math.abs(after.offset)>112){car.x=after.x+nx*side*108;car.y=after.y+ny*side*108;car.speed*=.76;after=nearestOnTrack(car.x,car.y);}
 }
 updateProgress(car,after,previousX,previousY);
 if(tooFast>12&&upcoming.distance<130)car.speed=Math.max(30,car.speed-tooFast*dt*.045);
 car.skidTimer=Math.max(0,(car.skidTimer||0)-dt);
 const skidding=car.speed>58&&(car.handbrake||car.drift>.43);
 if(skidding&&car.skidTimer<=0){const rearX=car.x-Math.cos(car.heading)*12,rearY=car.y-Math.sin(car.heading)*12;
  for(const wheelSide of [-1,1]){const wx=rearX-Math.sin(car.heading)*wheelSide*5,wy=rearY+Math.cos(car.heading)*wheelSide*5;skidMarks.push({x:wx,y:wy,angle:car.heading,life:10,maxLife:10});}
  car.skidTimer=.045;if(skidMarks.length>1400)skidMarks.splice(0,skidMarks.length-1400);
 }
 if((skidding||roadEdge>3)&&car.speed>38&&Math.random()<dt*(roadEdge>3?34:20)&&terrainParticles.length<360){
  const rearX=car.x-Math.cos(car.heading)*13,rearY=car.y-Math.sin(car.heading)*13,spread=(Math.random()-.5)*14,dirt=roadEdge>3;
  terrainParticles.push({x:rearX-Math.sin(car.heading)*spread,y:rearY+Math.cos(car.heading)*spread,vx:(Math.random()-.5)*34-Math.cos(car.heading)*(dirt?12:5),vy:(Math.random()-.5)*34-Math.sin(car.heading)*(dirt?12:5),life:dirt?.62:.46,max:dirt?.62:.46,size:dirt?2+Math.random()*4:2+Math.random()*3,color:dirt?(stage===5?'#65a34e':'#ad8053'):(roadEdge>3?'#6e9958':'#aeb6c5')});
 }
 car.particles=car.particles.filter(p=>(p.life-=dt)>0);if(car.flash>0)car.flash-=dt;
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
const trackPathCache=new WeakMap();
function getTrackPath(){
 let path=trackPathCache.get(track);
 if(path||typeof Path2D==='undefined')return path||null;
 path=new Path2D();const s=track.samples;path.moveTo(s[0].x,s[0].y);
 for(let i=1;i<s.length;i++)path.lineTo(s[i].x,s[i].y);
 path.closePath();trackPathCache.set(track,path);return path;
}
function strokeTrack(context,color,width,dash=[],offset=0){
 context.lineJoin='round';context.lineCap='round';context.lineWidth=width;
 context.strokeStyle=color;context.setLineDash(dash);context.lineDashOffset=offset;
 const path=getTrackPath();
 if(path)context.stroke(path);
 else{
  context.beginPath();const s=track.samples;context.moveTo(s[0].x,s[0].y);
  for(let i=1;i<s.length;i++)context.lineTo(s[i].x,s[i].y);
  context.closePath();context.stroke();
 }
 context.setLineDash([]);
}
function renderGroundTexture(context){
 const desert=stage===2||stage===6||stage===11;
 for(let y=8;y<640;y+=17)for(let x=8;x<1000;x+=19){
  const seed=Math.abs(Math.sin(x*12.9898+y*78.233+stage*37.17)*43758.5453)%1;
  if(desert){if(seed>.71){context.fillStyle=seed>.91?'#694c32':'#d1b47d';context.globalAlpha=seed>.91?.32:.18;context.beginPath();context.ellipse(x+(seed-.5)*9,y+(seed-.5)*6,2+seed*4,1+seed*2,seed*3,0,Math.PI*2);context.fill();}if(seed>.965){context.fillStyle='#665542';context.globalAlpha=.45;context.fillRect(x,y,2,2);}}
  else if(seed>.55){context.globalAlpha=stage===4?.14:.23;context.strokeStyle=seed>.82?'#d8e6bd':'#0b3a28';context.lineWidth=1;context.beginPath();context.moveTo(x,y+2);context.lineTo(x+(seed-.5)*5,y-2-seed*3);context.stroke();}context.globalAlpha=1;
 }
}
function drawOffsetGuardrail(context,startD,endD,side){
 const points=[];for(let d=startD;d<endD;d+=6){const p=sampleAt(d),nx=-Math.sin(p.angle),ny=Math.cos(p.angle);points.push({x:p.x+nx*side*55,y:p.y+ny*side*55,angle:p.angle,d});}
 const tail=sampleAt(endD),tnx=-Math.sin(tail.angle),tny=Math.cos(tail.angle);points.push({x:tail.x+tnx*side*55,y:tail.y+tny*side*55,angle:tail.angle,d:endD});if(points.length<2)return;
 const trace=()=>{context.beginPath();context.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)context.lineTo(points[i].x,points[i].y);};
 context.save();context.lineCap='round';context.lineJoin='round';context.setLineDash([]);context.strokeStyle='#202732';context.lineWidth=11;trace();context.stroke();context.strokeStyle='#9ba7b7';context.lineWidth=6;trace();context.stroke();context.strokeStyle='#e7eef6';context.lineWidth=2;trace();context.stroke();context.setLineDash([7,13]);context.strokeStyle='#e0b84f';context.lineWidth=2;trace();context.stroke();context.setLineDash([]);
 for(let d=startD;d<endD;d+=24){const p=sampleAt(d),nx=-Math.sin(p.angle),ny=Math.cos(p.angle),x=p.x+nx*side*55,y=p.y+ny*side*55;context.save();context.translate(x,y);context.rotate(p.angle);context.fillStyle='#171c25';context.fillRect(-2,-6,4,12);context.fillStyle='#c8d0dc';context.fillRect(-1,-5,2,10);context.restore();}context.restore();
}
function drawGuardrails(context){for(const [startD,endD] of guardrailRanges){drawOffsetGuardrail(context,startD,endD,-1);drawOffsetGuardrail(context,startD,endD,1);}}
function renderStaticBackground(context){
 context.fillStyle=track.grass;context.fillRect(0,0,1000,640);
 for(let y=0;y<640;y+=36){context.fillStyle=(Math.floor(y/36)%2)?'#ffffff05':'#0b2b1a0a';context.fillRect(0,y,1000,18);}
 renderGroundTexture(context);
 for(const d of decorations){
  if(stage===10){
   // Vegetación de costa: palmeras angulares y rocas claras, identidad propia del circuito.
   context.fillStyle='#6b5039';context.fillRect(d.x-2,d.y-8,4,15);
   context.strokeStyle='#1b5b49';context.lineWidth=3;context.lineCap='round';
   for(const a of [-2.7,-1.8,-.9,0,.9]){context.beginPath();context.moveTo(d.x,d.y-7);context.lineTo(d.x+Math.cos(a)*d.size,d.y-7+Math.sin(a)*d.size*.62);context.stroke();}
   context.fillStyle='#dfd2a2';context.beginPath();context.ellipse(d.x+d.size*.8,d.y+4,d.size*.7,d.size*.35,.35,0,Math.PI*2);context.fill();
  }else if(stage===11){
   // Rocas angulares en el cañón, con pequeños arbustos resistentes.
   context.fillStyle=d.type%2?'#6e533b':'#886845';context.beginPath();context.moveTo(d.x-d.size,d.y+4);context.lineTo(d.x-d.size*.55,d.y-d.size*.55);context.lineTo(d.x+d.size*.2,d.y-d.size);context.lineTo(d.x+d.size,d.y+3);context.closePath();context.fill();
   context.fillStyle='#667044';context.fillRect(d.x+d.size*.3,d.y-5,3,9);
  }else if(stage===1||stage===3||stage===7){
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
 // Capas de asfalto y vallas metálicas con postes.
 drawTrackSurface(context);drawGuardrails(context);
 // Animated center-line dashes stay separate from the cached asphalt.
 // Pilas de neumáticos en el exterior de las curvas más cerradas.
 for(const tire of tireBarriers){
  context.save();context.translate(tire.x,tire.y);context.rotate(tire.angle);
  for(let j=-1;j<=1;j++){
   context.fillStyle='#15171d';context.beginPath();context.arc(j*5,0,5.3,0,Math.PI*2);context.fill();
   context.strokeStyle='#626975';context.lineWidth=1;context.stroke();
   context.fillStyle='#343943';context.beginPath();context.arc(j*5,0,2.1,0,Math.PI*2);context.fill();
  }
  context.restore();
 }
 const start=sampleAt(0);context.save();context.translate(start.x,start.y);context.rotate(start.angle);
 for(let j=0;j<10;j++){context.fillStyle=j%2?'#f5f5e9':'#181b22';context.fillRect(-5,-43+j*8.6,10,8.6);}
 context.restore();
 drawCheckpoints(context);drawTrackFeatures(context);
 const sign=sampleAt(135),nx=-Math.sin(sign.angle),ny=Math.cos(sign.angle);
 context.save();context.translate(sign.x+nx*72,sign.y+ny*72);context.rotate(sign.angle);
 context.fillStyle='#111725';context.fillRect(-48,-12,96,24);context.fillStyle=track.accent;context.font='bold 10px monospace';context.textAlign='center';context.fillText(track.name,0,4);context.restore();
}
function drawBackground(context){
 const key=stage+'|'+graphics+'|'+barrierMode;
 if(!backgroundCache||backgroundCacheKey!==key){
  const cache=document.createElement('canvas');
  cache.width=1000;cache.height=640;
  const cacheContext=cache.getContext('2d');
  renderStaticBackground(cacheContext);
  backgroundCache=cache;backgroundCacheKey=key;
 }
 context.drawImage(backgroundCache,0,0,1000,640);
}
function updateGroundEffects(dt){
 for(const mark of skidMarks)mark.life-=dt;skidMarks=skidMarks.filter(mark=>mark.life>0);
 for(const p of terrainParticles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.max(0,1-dt*1.8);p.vy*=Math.max(0,1-dt*1.8);p.life-=dt;}terrainParticles=terrainParticles.filter(p=>p.life>0);
}
function drawGroundEffects(context){
 for(const mark of skidMarks){context.save();context.globalAlpha=Math.min(.46,mark.life/mark.maxLife*.46);context.translate(mark.x,mark.y);context.rotate(mark.angle);context.fillStyle='#101419';context.fillRect(-5,-1.35,10,2.7);context.restore();}
 for(const p of terrainParticles){context.globalAlpha=Math.max(0,p.life/p.max)*.64;context.fillStyle=p.color;context.beginPath();context.arc(p.x,p.y,p.size*(.6+.4*p.life/p.max),0,Math.PI*2);context.fill();}context.globalAlpha=1;
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
 strokeTrack(ctx,'#eef0d85c',2.5,[18,22],-elapsed*13);
 const player=cars[0];
 drawGroundEffects(ctx);cars.slice().sort((a,b)=>a.speed-b.speed).forEach(car=>drawCar(ctx,car));
 ctx.fillStyle='#101725ed';ctx.fillRect(14,14,290,88);ctx.textAlign='left';ctx.font='bold 13px monospace';
 ctx.fillStyle=player.color;ctx.fillText('SPEED  '+Math.round(player.speed)+' KM/H',26,35);
 const safe=curvatureAt(player.progress+28).safeSpeed;
 ctx.fillStyle=player.speed>safe+15?'#ff706d':'#d7ff38';ctx.fillText('TARGET SPEED  '+Math.round(safe),26,56);
 ctx.fillStyle='#e9edf9';ctx.font='bold 11px monospace';ctx.fillText('LAP '+Math.min(LAPS_TO_WIN,player.lap+1)+'/'+LAPS_TO_WIN,26,73);
 const bestLap=bestLapRecords[track.name];ctx.fillStyle='#b9c4df';ctx.font='bold 10px monospace';ctx.fillText('BEST '+(bestLap?format(bestLap):'--:--.-')+'   CP '+Math.min(player.checkpointPasses||0,checkpoints.length)+'/'+checkpoints.length,26,92);
 const cornerAhead=upcomingCorner(player.progress);
 ctx.fillStyle='#101725ed';ctx.fillRect(632,14,166,58);ctx.strokeStyle=cornerAhead.severity>.24?'#ffba63':'#c8ff54';ctx.lineWidth=2;ctx.strokeRect(632,14,166,58);
 ctx.fillStyle='#aab6d4';ctx.font='bold 9px monospace';ctx.textAlign='left';ctx.fillText('SIGUIENTE SECTOR',642,28);
 const cornerName=cornerAhead.severity<.12?'RECTA':cornerAhead.turn>0?'CURVA DERECHA':'CURVA IZQUIERDA';
 ctx.fillStyle=cornerAhead.severity>.24?'#ffba63':'#d7ff38';ctx.font='bold 10px monospace';ctx.fillText(cornerName,642,43);
 ctx.fillStyle='#f4f5f9';ctx.font='bold 9px monospace';ctx.fillText(cornerAhead.severity<.12?'ZONA DE ATAQUE':(player.speed>cornerAhead.safeSpeed+12?'FRENA AHORA':'FRENA A '+Math.round(cornerAhead.safeSpeed)),642,60);
 if(cornerAhead.distance<155&&cornerAhead.severity>.22){ctx.fillStyle='#ffba63';ctx.font='bold 9px monospace';ctx.fillText('A '+Math.round(cornerAhead.distance),748,28);}
 if(player.offroad>ROAD_EDGE){ctx.fillStyle='#ffca70';ctx.font='bold 14px monospace';ctx.fillText('GRASS — LOW GRIP',285,32);}
 if(player.drift>.35){ctx.fillStyle='#0d1420e8';ctx.fillRect(820,14,165,27);ctx.fillStyle='#39e8e8';ctx.font='bold 12px monospace';ctx.fillText('SLIDE '+Math.round(player.drift*100)+'%',830,33);}
 drawMiniMap(ctx);
 if(countdownRemaining>0||goFlashRemaining>0){ctx.fillStyle='#050716b8';ctx.fillRect(0,0,1000,640);ctx.textAlign='center';ctx.fillStyle='#d7ff38';ctx.font='bold 88px monospace';ctx.fillText(countdownRemaining>0?String(Math.ceil(countdownRemaining)):'¡YA!',500,315);ctx.fillStyle='#f5f6ff';ctx.font='bold 17px monospace';ctx.fillText(countdownRemaining>0?'PREPARADOS...':'¡ACELERÁ!',500,360);}
 if(paused){ctx.fillStyle='#050716bb';ctx.fillRect(0,0,1000,640);ctx.fillStyle='#d7ff38';ctx.font='bold 40px monospace';ctx.textAlign='center';ctx.fillText('PAUSED',500,310);ctx.font='16px monospace';ctx.fillText('PRESS ESC TO RESUME',500,342);}
}
function loop(now){
 if(!running||paused)return;
 const dt=Math.min((now-last)/1000,.03);last=now;
 if(countdownRemaining>0){
  countdownRemaining=Math.max(0,countdownRemaining-dt);
  const label=countdownRemaining>0?String(Math.ceil(countdownRemaining)):'GO!';
  if(label!==countdownShown){countdownShown=label;if(label==='GO!'){goFlashRemaining=.55;$('status').textContent='¡A FONDO!';playTone(880,.18,.045);}else playTone(420,.07,.025);}
 }else{
  elapsed+=dt;
  cars.forEach((car,i)=>{if(!car.done)physics(car,i,dt);});
  resolveCollisions(dt);
 }
 if(goFlashRemaining>0&&countdownRemaining<=0)goFlashRemaining=Math.max(0,goFlashRemaining-dt);
 $('timer').textContent=format(elapsed);$('lap').textContent=Math.min(LAPS_TO_WIN,cars[0].lap+1)+'/'+LAPS_TO_WIN;
 updateGroundEffects(dt);updateAudio();drawFrame();
 const finishers=cars.filter(car=>car.done);
 if(cars.every(car=>car.done)){finishRace();return;}
 if(finishers.length&&elapsed-Math.min(...finishers.map(car=>car.finishTime))>18){finishRace();return;}
 raf=requestAnimationFrame(loop);
}
function format(t){const m=Math.floor(t/60),s=(t%60).toFixed(1).padStart(4,'0');return String(m).padStart(2,'0')+':'+s;}
function finishRace(){
 running=false;cancelAnimationFrame(raf);game.classList.add('hidden');result.classList.remove('hidden');
 const winner=[...cars].sort((a,b)=>(a.finishTime??Infinity)-(b.finishTime??Infinity))[0];
 awardPoints(winner);updateAudio();
 if(stage===tracks.length-1)$('resultTitle').textContent='¡CAMPEONATO TERMINADO!';
 else if(mode==='solo')$('resultTitle').textContent=winner.isAI?'¡TE GANÓ EL RIVAL!':'¡GANASTE LA CARRERA!';
 else $('resultTitle').textContent='¡GANA EL JUGADOR '+(winner.player+1)+'!';
 const champion=Object.entries(championship).sort((a,b)=>b[1]-a[1])[0];
 const finalNote=stage===tracks.length-1?' · CAMPEÓN DE TEMPORADA: '+(champion[0]==='player1'?'JUGADOR 1':champion[0]==='player2'?'JUGADOR 2':'CPU')+' ('+champion[1]+' pts)':'';
 const bestLap=bestLapRecords[track.name];
 $('resultText').textContent=track.name+' · '+LAPS_TO_WIN+' vueltas · Tiempo total '+format(winner.finishTime??elapsed)+(winner.lapTimes.length?' · Mejor vuelta '+format(Math.min(...winner.lapTimes)):'')+' · '+standingsText()+finalNote+(bestLap?' · Récord guardado '+format(bestLap):'')+(cars.some(car=>car.newBestLap)?' · ¡NUEVO RÉCORD!':'');
 $('nextBtn').textContent=stage===tracks.length-1?'NUEVA TEMPORADA ↻':'SIGUIENTE CIRCUITO →';
 $('nextBtn').onclick=()=>stage===tracks.length-1?start(mode,0,false):start(mode,(stage+1)%tracks.length,true);
}
$('pauseBtn').onclick=togglePause;
$('restartBtn').onclick=()=>start(mode,stage,true);
$('backBtn').onclick=()=>{running=false;updateAudio();cancelAnimationFrame(raf);keys=Object.create(null);game.classList.add('hidden');menu.classList.remove('hidden');};
$('menuBtn').onclick=()=>{result.classList.add('hidden');menu.classList.remove('hidden');};
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>start(b.dataset.mode));
$('soundBtn').onclick=()=>{soundEnabled=!soundEnabled;$('soundBtn').textContent='♫ SONIDO: '+(soundEnabled?'ON':'OFF');if(soundEnabled){initAudio();if(audioContext&&audioContext.state==='suspended')audioContext.resume().catch(()=>{});}updateAudio();};
$('fullscreenBtn').onclick=async()=>{
 const target=document.querySelector('.shell');
 try{
  if(!document.fullscreenElement){if(target.requestFullscreen)await target.requestFullscreen();}
  else if(document.exitFullscreen)await document.exitFullscreen();
 }catch(err){$('status').textContent='PANTALLA COMPLETA NO DISPONIBLE EN ESTE NAVEGADOR';}
 drawFullScreenButton();
};
function drawFullScreenButton(){
 const button=$('fullscreenBtn');
 if(button)button.textContent=document.fullscreenElement?'⛶ SALIR DE PANTALLA COMPLETA':'⛶ PANTALLA COMPLETA';
}
document.addEventListener('fullscreenchange',()=>{drawFullScreenButton();if(running)resize();});
window.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&document.fullscreenElement&&document.exitFullscreen){document.exitFullscreen().catch(()=>{});}
});
$('graphics').addEventListener('change',()=>{graphics=$('graphics').value;$('views').classList.toggle('pixelated',graphics==='retro');$('views').classList.toggle('performance',graphics==='lite');if(running)resize();});
$('carModel').addEventListener('change',updateGaragePreview);
$('carColor').addEventListener('change',updateGaragePreview);
updateGaragePreview();
$('difficulty').addEventListener('change',()=>{difficulty=$('difficulty').value;});
window.addEventListener('resize',()=>{if(running)resize();});
})();