(()=>{'use strict';
const $=id=>document.getElementById(id);
const menu=$('menu'),game=$('game'),result=$('result'),canvas=$('canvas1'),ctx=canvas.getContext('2d');
const trackDefs=[
{name:'SUNSET CIRCUIT',worldScale:1.4,layoutVersion:2,sky:'#f4a66c',grass:'#36784d',accent:'#f6d27c',points:[[150,110],[300,88],[390,118],[422,185],[520,177],[590,112],[760,110],[850,176],[823,250],[694,258],[645,330],[720,414],[700,500],[582,538],[510,468],[421,492],[350,557],[235,529],[190,445],[105,410],[80,310],[145,260],[115,180]]},
{name:'NEON HARBOR',worldScale:1.4,layoutVersion:2,sky:'#5dbfc8',grass:'#25766b',accent:'#84fff0',points:[[150,95],[330,100],[385,145],[470,120],[535,95],[730,100],[820,148],[855,230],[810,275],[700,270],[650,340],[700,430],[640,490],[510,495],[455,435],[340,450],[295,520],[180,510],[120,445],[95,350],[145,285],[110,200]]},
{name:'DUSTY MESA',worldScale:1.4,layoutVersion:3,sky:'#dfb878',grass:'#b99c61',accent:'#f5dd91',points:[[140,120],[360,90],[600,90],[820,110],[900,170],[910,240],[850,290],[760,280],[690,240],[620,250],[570,310],[580,380],[650,420],[680,480],[640,540],[560,550],[450,500],[340,430],[230,360],[130,300],[90,230],[110,160]]},
{name:'NIGHT RUN',worldScale:1.4,layoutVersion:2,sky:'#5a5b9e',grass:'#263a54',accent:'#ff5fae',points:[[155,100],[315,92],[365,140],[470,135],[495,195],[615,200],[645,135],[770,120],[865,175],[838,248],[760,280],[700,255],[660,325],[740,380],[800,455],[740,520],[610,525],[550,465],[455,475],[420,550],[300,540],[220,480],[140,460],[100,375],[140,310],[95,230]]},
{name:'FROSTBITE GP',worldScale:1.4,layoutVersion:2,sky:'#d9eff4',grass:'#83b3a3',accent:'#ffffff',points:[[155,115],[320,85],[445,120],[490,180],[600,150],[745,120],[830,180],[850,255],[780,305],[670,285],[620,350],[680,410],[650,500],[525,530],[450,470],[355,480],[305,545],[205,510],[150,430],[95,400],[105,300],[150,255],[115,185]]},
{name:'JUNGLE SPRINT',worldScale:1.4,layoutVersion:2,sky:'#72b987',grass:'#205a3d',accent:'#a8e77e',points:[[135,125],[285,90],[385,120],[435,195],[530,210],[575,135],[735,115],[825,180],[800,255],[720,285],[690,360],[750,415],[700,515],[570,525],[500,455],[400,465],[335,540],[220,525],[175,445],[100,420],[80,330],[145,260],[100,190]]},
{name:'VOLCANO RING',worldScale:1.4,layoutVersion:2,sky:'#9e645d',grass:'#4c4349',accent:'#ff704e',points:[[125,130],[280,90],[395,125],[440,200],[510,165],[650,110],[790,135],[860,215],[810,280],[710,270],[665,335],[720,420],[680,500],[550,540],[465,475],[385,495],[320,555],[210,520],[170,435],[100,390],[85,295],[140,250],[105,190]]},
{name:'PIXEL CITY',worldScale:1.4,layoutVersion:2,sky:'#c67bb2',grass:'#356c5d',accent:'#5bf4ec',points:[[160,100],[325,90],[390,140],[465,110],[610,115],[680,170],[790,145],[865,205],[830,270],[735,285],[685,340],[735,405],[700,500],[590,530],[510,470],[420,500],[345,550],[225,520],[175,440],[105,410],[85,315],[145,265],[115,185]]},
{name:'THUNDER VALLEY',worldScale:1.4,layoutVersion:2,sky:'#a4b4d3',grass:'#406d5a',accent:'#e8f6ff',points:[[130,125],[280,85],[405,115],[450,185],[540,160],[680,110],[785,145],[860,215],[810,285],[705,270],[650,345],[720,425],[670,510],[550,535],[470,465],[380,485],[325,550],[215,520],[170,435],[100,405],[80,310],[135,250],[100,185]]},
{name:'CHAMPION ROAD',worldScale:1.4,layoutVersion:2,sky:'#f3dc7e',grass:'#397653',accent:'#ffffff',points:[[140,100],[400,100],[680,100],[850,100],[910,150],[910,260],[850,300],[750,270],[690,290],[690,380],[790,410],[890,400],[920,460],[890,520],[790,550],[650,530],[580,470],[500,460],[430,520],[320,550],[210,540],[120,500],[90,430],[110,365],[190,350],[270,380],[350,350],[360,270],[290,240],[210,270],[130,250],[90,180]]}
,
{name:'COASTLINE RUN',worldScale:1.3,layoutVersion:2,sky:'#76c6db',grass:'#347f68',accent:'#cfff9d',environment:'coast',points:[[105,135],[165,95],[255,82],[340,105],[405,150],[485,138],[545,92],[625,86],[710,108],[800,91],[875,125],[905,180],[890,226],[825,246],[755,220],[700,252],[706,318],[770,338],[840,317],[895,356],[908,411],[875,466],[808,485],[735,456],[685,418],[608,436],[553,493],[485,535],[410,548],[334,520],[270,541],[198,519],[132,480],[95,422],[116,372],[178,349],[237,370],[293,344],[284,277],[221,254],[157,275],[108,237],[84,184]]},
{name:'RALLY CANYON',worldScale:1.3,layoutVersion:2,sky:'#d7b17c',grass:'#a58b5b',accent:'#f5d49a',environment:'rally',points:[[110,120],[158,88],[220,82],[278,104],[328,147],[390,131],[446,88],[515,79],[574,106],[613,150],[673,137],[732,105],[798,111],[855,146],[900,196],[892,244],[850,267],[798,255],[753,274],[745,322],[785,348],[838,338],[887,362],[904,411],[878,456],[831,474],[779,454],[731,433],[687,458],[651,504],[599,533],[536,535],[483,510],[421,525],[361,511],[303,528],[245,513],[189,529],[140,498],[103,455],[84,409],[101,365],[145,349],[191,362],[235,345],[256,309],[240,273],[199,253],[157,270],[119,250],[88,208],[91,160]]},
{name:'MEADOW RUN',worldScale:1.3,layoutVersion:2,sky:'#b5d7ad',grass:'#43864c',accent:'#deff91',environment:'meadow',points:[[88,145],[124,104],[196,85],[270,102],[402,102],[445,145],[506,159],[552,122],[617,91],[697,86],[757,110],[828,98],[887,132],[912,184],[895,224],[842,240],[791,219],[745,246],[752,306],[812,327],[874,313],[911,353],[912,399],[878,442],[824,458],[778,440],[735,461],[698,508],[638,533],[571,520],[518,541],[391,539],[322,521],[258,539],[197,514],[149,482],[113,435],[91,380],[111,348],[163,338],[214,356],[267,333],[277,291],[237,266],[184,272],[141,248],[105,213],[82,177]]},
{name:'INDUSTRIAL MIX',worldScale:1.3,layoutVersion:2,sky:'#9ba9b6',grass:'#4c6956',accent:'#ffcc63',environment:'industrial',points:[[95,110],[175,88],[255,100],[315,132],[385,118],[450,84],[520,85],[565,120],[625,112],[698,85],[780,95],[855,126],[905,180],[892,230],[846,252],[790,246],[744,277],[751,324],[808,344],[875,331],[912,372],[906,423],[865,460],[806,471],[746,449],[698,471],[658,514],[597,538],[532,523],[480,493],[418,510],[360,489],[302,512],[244,498],[182,523],[127,491],[92,445],[90,396],[127,370],[179,381],[221,360],[224,315],[185,283],[136,299],[97,263],[80,213],[95,160]]}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrapAngle=a=>Math.atan2(Math.sin(a),Math.cos(a));
const pointDistance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const LAPS_TO_WIN=3;
const ROAD_EDGE=42, WALL_EDGE=66;
const CAR_MODELS={
 balanced:{name:'BALANCED',maxSpeed:232,acceleration:110,braking:230,steering:1,grip:1,grass:1,description:'Equilibrado para aprender y competir.'},
 corner:{name:'CORNER KING',maxSpeed:218,acceleration:105,braking:255,steering:1.19,grip:1.15,grass:.86,description:'Más agarre y frenado; velocidad punta menor.'},
 speed:{name:'SPEED DEMON',maxSpeed:250,acceleration:123,braking:215,steering:.84,grip:.87,grass:1.12,description:'Rápido en rectas, difícil en curvas cerradas.'},
 rally:{name:'RALLY FOX',maxSpeed:222,acceleration:112,braking:245,steering:1.08,grip:1.04,grass:.57,description:'Pierde menos velocidad si toca el pasto.'}
};
const CAR_PAINTS={
 pink:{name:'HOT PINK',hex:'#ff3d81'},cyan:{name:'NEON CYAN',hex:'#39e8e8'},
 lime:{name:'ARCADE LIME',hex:'#d7ff38'},orange:{name:'TURBO ORANGE',hex:'#ff984d'},
 violet:{name:'PURPLE HAZE',hex:'#b77cff'},white:{name:'ICE WHITE',hex:'#f0f3ff'}
};
function makeTrack(def){
 // World size is independent of the driving viewport; road and car widths stay fixed.
 const worldScale=def.worldScale||1;
 const p=def.points.map(([x,y])=>[(500+(x-500)*1.06)*worldScale,(320+(y-320)*1.05)*worldScale]),n=p.length,samples=[];
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
 return {...def,samples,length,worldWidth:Math.round(1000*worldScale),worldHeight:Math.round(640*worldScale)};
}
const tracks=trackDefs.map(makeTrack);
const TRACK_SURFACES=['asphalt','asphalt','dirt','asphalt','ice','grass','volcanic','asphalt','mixed','asphalt','coastal','dirt','grass','mixed'];
const SURFACE_GRIP={asphalt:1,dirt:.84,grass:.79,ice:.68,volcanic:.87,coastal:1};
const TRACK_BARRIERS=['open','half','open','corners','corners','open','corners','half','open','corners','open','open','open','half'];
tracks.forEach((item,index)=>{item.surface=TRACK_SURFACES[index]||'asphalt';item.defaultBarriers=TRACK_BARRIERS[index]||'full';item.dirtRanges=item.surface==='mixed'?[[item.length*.24,item.length*.33],[item.length*.66,item.length*.75]]:[];});
let cameraMode='near';
let stage=0,mode='solo',track=tracks[0],running=false,paused=false,raf=0,last=0,elapsed=0;
let countdownRemaining=0,goFlashRemaining=0,countdownShown='';
const BEST_LAPS_KEY='pixelGP.bestLaps.v1';
function readBestLapRecords(){try{const value=JSON.parse(localStorage.getItem(BEST_LAPS_KEY)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch(error){return {};}}
let bestLapRecords=readBestLapRecords();
function lapRecordKey(item=track){return item.layoutVersion?item.name+'@'+item.layoutVersion:item.name;}
function saveBestLap(trackName,time){if(!Number.isFinite(time)||time<=0)return false;const previous=bestLapRecords[trackName];if(Number.isFinite(previous)&&previous<=time)return false;bestLapRecords[trackName]=time;try{localStorage.setItem(BEST_LAPS_KEY,JSON.stringify(bestLapRecords));}catch(error){}return true;}
let keys=Object.create(null),cars=[],graphics='high',difficulty='normal',decorations=[],tireBarriers=[],checkpoints=[];
let guardrailPaths=[],physicalBarriers=[],barrierBuckets=new Map();
let barrierMode='auto',guardrailRanges=[],skidMarks=[],terrainParticles=[],trackFeatures={braking:[],passing:[]};
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
function carName(car){return car.isAI?(AI_PERSONALITIES[car.personality]?.name||'CPU'):'P'+(car.player+1);}
function scoreKey(car){return car.isAI?(car.player===1?'rival':'rival'+car.player):'player'+(car.player+1);}
function raceClassification(){
 return [...cars].sort((a,b)=>a.done!==b.done?(a.done?-1:1):a.done?(a.finishTime-b.finishTime||a.player-b.player):(b.raceProgress-a.raceProgress||a.player-b.player));
}
function awardPoints(){
 raceClassification().forEach((car,index)=>{const key=scoreKey(car);championship[key]=(championship[key]||0)+(car.done?([25,18,15,12][index]||0):0);});
 roundsCompleted++;
}
function standingsText(){
 return 'CAMPEONATO · '+[...cars].sort((a,b)=>(championship[scoreKey(b)]||0)-(championship[scoreKey(a)]||0)).map(car=>carName(car)+' '+(championship[scoreKey(car)]||0)+' PTS').join(' · ');
}
const wrapDistance=d=>((d%track.length)+track.length)%track.length;
function surfaceAtProgress(distance){
 const d=wrapDistance(distance);
 if(track.surface==='mixed')return (track.dirtRanges||[]).some(([start,end])=>d>=start&&d<=end)?'dirt':'asphalt';
 if(track.surface==='coastal'&&d>=track.length*.31&&d<=track.length*.37)return 'dirt';
 return track.surface||'asphalt';
}
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
function guardrailRangesForTrack(){
 if(barrierMode==='full')return [[0,track.length]];
 if(barrierMode==='half')return [[0,track.length*.5]];
 if(barrierMode==='open')return [];
 const ranges=[];let start=null,last=null;
 for(let d=0;d<=track.length;d+=8){
  const active=curvatureAt(Math.min(d,track.length-1)).severity>.55;
  if(active){if(start===null)start=Math.max(0,d-24);last=Math.min(track.length,d+24);}
  else if(start!==null){if(last-start>45)ranges.push([start,last]);start=null;last=null;}
 }
 if(start!==null&&last-start>45)ranges.push([start,last]);
 const merged=[];for(const range of ranges){const previous=merged[merged.length-1];if(previous&&range[0]-previous[1]<26)previous[1]=range[1];else merged.push(range.slice());}
 return merged;
}
function guardrailActive(progress){const d=wrapDistance(progress);return guardrailRanges.some(([start,end])=>d>=start&&d<end);}
function barriersForTrack(){
 const list=[];if(barrierMode!=='half')return list;
 // En el perfil mixto, los neumáticos protegen algunas curvas del tramo abierto.
 for(let d=track.length*.5;d<track.length;d+=10){const bend=curvatureAt(d);if(bend.severity<.2)continue;
  const p=sampleAt(d),nx=-Math.sin(p.angle),ny=Math.cos(p.angle),outside=bend.turn>0?-1:1;
  const tire={x:p.x+nx*outside*57,y:p.y+ny*outside*57,angle:p.angle,progress:d,side:outside};
  if(nearestOnTrack(tire.x,tire.y).distance>=52)list.push(tire);
 }return list;
}
// Trace the boundary of the road's 55-unit buffer. Offset normals alone fold
// back on themselves when a corner radius is smaller than the fence offset.
const barrierContourCache=new WeakMap();
function projectToSegment(x,y,a,b){
 const dx=b.x-a.x,dy=b.y-a.y,lengthSq=dx*dx+dy*dy;
 const t=lengthSq?clamp(((x-a.x)*dx+(y-a.y)*dy)/lengthSq,0,1):0;
 const px=a.x+dx*t,py=a.y+dy*t;
 return {x:px,y:py,t,distanceSq:(x-px)**2+(y-py)**2};
}
function barrierContoursForTrack(){
 if(barrierContourCache.has(track))return barrierContourCache.get(track);
 const buckets=new Map(),cell=32,radius=55,step=4;
 for(let i=0;i<track.samples.length;i++){
  const a=track.samples[i],b=track.samples[(i+1)%track.samples.length],segment={a,b};
  for(let y=Math.floor((Math.min(a.y,b.y)-64)/cell);y<=Math.floor((Math.max(a.y,b.y)+64)/cell);y++){
   for(let x=Math.floor((Math.min(a.x,b.x)-64)/cell);x<=Math.floor((Math.max(a.x,b.x)+64)/cell);x++){
    const key=x+','+y;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(segment);
   }
  }
 }
 function nearest(x,y){
  let distanceSq=64*64,progress=0;
  for(const {a,b} of buckets.get(Math.floor(x/cell)+','+Math.floor(y/cell))||[]){
   const p=projectToSegment(x,y,a,b);
   if(p.distanceSq<distanceSq){distanceSq=p.distanceSq;progress=a.d+p.t*pointDistance(a,b);}
  }
  return {distanceSq,progress};
 }
 const width=Math.ceil((track.worldWidth+128)/step)+1,height=Math.ceil((track.worldHeight+128)/step)+1,values=new Float64Array(width*height);
 const vertex=index=>({x:-64+(index%width)*step,y:-64+Math.floor(index/width)*step});
 for(let i=0;i<values.length;i++){
  const p=vertex(i),value=nearest(p.x,p.y).distanceSq-radius*radius;
  values[i]=Math.abs(value)<1e-7?1e-7:value;
 }
 const crossings=new Map(),links=new Map();
 function crossing(a,b){
  const key=a<b?a+':'+b:b+':'+a;
  if(!crossings.has(key)){
   const p=vertex(a),q=vertex(b),t=values[a]/(values[a]-values[b]);
   crossings.set(key,{key,x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t});
  }
  return crossings.get(key);
 }
 function triangle(a,b,c){
  const points=[];
  for(const [u,v] of [[a,b],[b,c],[c,a]])if((values[u]<0)!==(values[v]<0))points.push(crossing(u,v));
  if(points.length!==2)return;
  for(let i=0;i<2;i++){const p=points[i],q=points[1-i];if(!links.has(p.key))links.set(p.key,[]);links.get(p.key).push(q);}
 }
 for(let y=0;y<height-1;y++)for(let x=0;x<width-1;x++){
  const a=y*width+x,b=a+1,c=a+width+1,d=a+width;triangle(a,b,c);triangle(a,c,d);
 }
 const visited=new Set(),contours=[];
 for(const [key] of links){
  if(visited.has(key))continue;
  const points=[];let current=crossings.get(key),previous=null;
  while(current&&!visited.has(current.key)){
   visited.add(current.key);points.push(current);
   const next=links.get(current.key).find(p=>p.key!==previous);
   previous=current.key;current=next;
  }
  if(points.length>2)contours.push({points,closed:current?.key===key});
 }
 // Cache progress with the contour: all profiles use exactly the same boundary.
 for(const contour of contours)for(let i=0;i<contour.points.length;i++){
  const a=contour.points[i],b=contour.points[(i+1)%contour.points.length];
  a.progress=nearest((a.x+b.x)/2,(a.y+b.y)/2).progress;
 }
 barrierContourCache.set(track,contours);return contours;
}
function buildPhysicalBarriers(){
 guardrailPaths=[];physicalBarriers=[];barrierBuckets=new Map();
 for(const contour of barrierContoursForTrack()){
  let chain=[];
  for(let i=0;i<contour.points.length;i++){
   const a=contour.points[i],b=contour.points[(i+1)%contour.points.length];
   if(!contour.closed&&i===contour.points.length-1)break;
   if(guardrailActive(a.progress)){
    if(!chain.length)chain.push(a);chain.push(b);
    physicalBarriers.push({a,b,radius:5.5,kind:'rail'});
   }else if(chain.length){guardrailPaths.push(chain);chain=[];}
  }
  if(chain.length)guardrailPaths.push(chain);
 }
 for(const tire of tireBarriers)for(const offset of [-5,0,5]){
  const p={x:tire.x+Math.cos(tire.angle)*offset,y:tire.y+Math.sin(tire.angle)*offset};
  physicalBarriers.push({a:p,b:p,radius:5.8,kind:'tire'});
 }
 for(const barrier of physicalBarriers){
  for(let y=Math.floor((Math.min(barrier.a.y,barrier.b.y)-24)/32);y<=Math.floor((Math.max(barrier.a.y,barrier.b.y)+24)/32);y++){
   for(let x=Math.floor((Math.min(barrier.a.x,barrier.b.x)-24)/32);x<=Math.floor((Math.max(barrier.a.x,barrier.b.x)+24)/32);x++){
    const key=x+','+y;if(!barrierBuckets.has(key))barrierBuckets.set(key,[]);barrierBuckets.get(key).push(barrier);
   }
  }
 }
}
function closestSegments(a,b,c,d){
 const candidates=[];
 for(const p of [a,b]){const q=projectToSegment(p.x,p.y,c,d);candidates.push({car:p,wall:q,distanceSq:q.distanceSq});}
 for(const q of [c,d]){const p=projectToSegment(q.x,q.y,a,b);candidates.push({car:p,wall:q,distanceSq:p.distanceSq});}
 const rx=b.x-a.x,ry=b.y-a.y,sx=d.x-c.x,sy=d.y-c.y,den=rx*sy-ry*sx;
 if(Math.abs(den)>1e-8){
  const t=((c.x-a.x)*sy-(c.y-a.y)*sx)/den,u=((c.x-a.x)*ry-(c.y-a.y)*rx)/den;
  if(t>=0&&t<=1&&u>=0&&u<=1){const p={x:a.x+rx*t,y:a.y+ry*t};return {car:p,wall:p,distanceSq:0};}
 }
 return candidates.reduce((best,p)=>p.distanceSq<best.distanceSq?p:best);
}
function resolveBarrierContact(car,previousX,previousY){
 let hit=false,impactFactor=1;
 for(let pass=0;pass<4;pass++){
  let deepest=null;
  const hx=Math.cos(car.heading)*5,hy=Math.sin(car.heading)*5;
  for(const barrier of barrierBuckets.get(Math.floor(car.x/32)+','+Math.floor(car.y/32))||[]){
   const contact=closestSegments({x:car.x-hx,y:car.y-hy},{x:car.x+hx,y:car.y+hy},barrier.a,barrier.b);
   const distance=Math.sqrt(contact.distanceSq),depth=10+barrier.radius-distance;
   if(depth>1e-4&&(!deepest||depth>deepest.depth))deepest={...contact,depth,distance};
  }
  if(!deepest)break;
  let nx=deepest.car.x-deepest.wall.x,ny=deepest.car.y-deepest.wall.y;
  if(deepest.distance<1e-6){nx=previousX-deepest.wall.x;ny=previousY-deepest.wall.y;}
  const length=Math.hypot(nx,ny)||1;nx/=length;ny/=length;
  car.x+=nx*(deepest.depth+.05);car.y+=ny*(deepest.depth+.05);hit=true;
  const vx=Math.cos(car.heading),vy=Math.sin(car.heading),inward=vx*nx+vy*ny;
  if(inward<-.02){
   const reflectedX=vx-1.15*inward*nx,reflectedY=vy-1.15*inward*ny;
   car.heading=Math.atan2(reflectedY,reflectedX);
   impactFactor=Math.min(impactFactor,Math.hypot(reflectedX,reflectedY)*.94);
  }
 }
 if(impactFactor<1){car.speed*=clamp(impactFactor,.05,1);car.steer*=.65;car.yawRate=(car.yawRate||0)*.3;}
 if(hit&&car.flash<=0){playTone(125,.09,.04);car.flash=.12;}
 return hit;
}

function checkpointsForTrack(){
 const result=[];
 const count=clamp(Math.ceil(track.length/650)-1,3,9);
 for(let i=1;i<=count;i++){const progress=track.length*i/(count+1),p=sampleAt(progress);result.push({id:i,progress,x:p.x,y:p.y,angle:p.angle});}
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
 for(let y=24;y<track.worldHeight-25;y+=42)for(let x=24;x<track.worldWidth-20;x+=44){
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
 const bounds=$('views').getBoundingClientRect(),availableWidth=Math.max(1,bounds.width-8),availableHeight=Math.max(1,bounds.height-8);
 const cssWidth=Math.min(availableWidth,availableHeight*1000/640);
 canvas.style.width=cssWidth+'px';canvas.style.height=cssWidth*640/1000+'px';
 const dpr=Math.min(window.devicePixelRatio||1,2),quality=graphics==='retro'?.58:graphics==='lite'?.75:1;
 const width=Math.min(2560,Math.max(500,Math.round(cssWidth*dpr*quality))),height=Math.round(width*640/1000);
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
 if(running)drawFrame();
}
function strokeTrackRange(context,startDistance,endDistance,color,width,dash=[]){
 context.save();context.beginPath();let first=true;
 for(let d=startDistance;d<=endDistance;d+=5){const p=sampleAt(d);if(first){context.moveTo(p.x,p.y);first=false;}else context.lineTo(p.x,p.y);}
 const tail=sampleAt(endDistance);context.lineTo(tail.x,tail.y);context.strokeStyle=color;context.lineWidth=width;context.lineCap='round';context.lineJoin='round';context.setLineDash(dash);context.stroke();context.setLineDash([]);context.restore();
}
function drawTrackSurface(context){
 const key=stage+'|'+graphics+'|'+barrierMode+'|'+track.surface;
 if(!trackSurfaceCache||trackSurfaceKey!==key){
  const surface=document.createElement('canvas');surface.width=track.worldWidth;surface.height=track.worldHeight;
  const sc=surface.getContext('2d');
  if(track.surface==='dirt'){
   strokeTrack(sc,'#49372b',122);strokeTrack(sc,'#76543b',112);strokeTrack(sc,'#9a7653',99);strokeTrack(sc,'#b18c64',88,[17,22],0);strokeTrack(sc,'#a27d55',82,[6,20],10);strokeTrack(sc,'#876548',73);strokeTrack(sc,'#c0a078',68);strokeTrack(sc,'#876548',61);
  }else if(track.surface==='grass'){
   strokeTrack(sc,'#1f4b2d',122);strokeTrack(sc,'#397c43',112);strokeTrack(sc,'#74a94e',99,[18,18],0);strokeTrack(sc,'#427e43',88);strokeTrack(sc,'#8fba62',82,[5,15],0);strokeTrack(sc,'#2d6639',73);strokeTrack(sc,'#4d8b47',68);strokeTrack(sc,'#285c34',61);
  }else if(track.surface==='ice'){
   strokeTrack(sc,'#6d8da1',122);strokeTrack(sc,'#d5f2f9',114);strokeTrack(sc,'#8ac7dc',100,[18,18],0);strokeTrack(sc,'#e6fbff',90);strokeTrack(sc,'#8cc4d5',82,[22,22],0);strokeTrack(sc,'#bfe7f1',73);strokeTrack(sc,'#effdff',68);strokeTrack(sc,'#8db9c9',61);
  }else if(track.surface==='volcanic'){
   strokeTrack(sc,'#29282c',122);strokeTrack(sc,'#594b49',112);strokeTrack(sc,'#302e34',99);strokeTrack(sc,'#8f4837',88,[15,24],0);strokeTrack(sc,'#403238',80);strokeTrack(sc,'#cf603c',74,[5,20],0);strokeTrack(sc,'#29262e',68);strokeTrack(sc,'#171920',61);
  }else{
   strokeTrack(sc,'#11171c',122);strokeTrack(sc,'#cdd1d3',114,[18,18],0);strokeTrack(sc,'#d84b59',106,[12,24],0);strokeTrack(sc,'#282d37',94);strokeTrack(sc,'#e74b5d',82,[23,23],0);strokeTrack(sc,'#f5f0dc',82,[23,23],23);strokeTrack(sc,'#3c414c',74);strokeTrack(sc,graphics==='high'?'#707783':'#646873',68);strokeTrack(sc,'#2c313b',61);
  }
  if(track.surface==='mixed'){for(const [start,end] of track.dirtRanges){strokeTrackRange(sc,start,end,'#76563c',76);strokeTrackRange(sc,start,end,'#ad8258',66,[14,11]);}}
  if(track.surface==='coastal'){strokeTrackRange(sc,track.length*.31,track.length*.37,'#846b47',74);strokeTrackRange(sc,track.length*.31,track.length*.37,'#c2a06b',63,[9,12]);}
  trackSurfaceCache=surface;trackSurfaceKey=key;
 }
 context.drawImage(trackSurfaceCache,0,0,track.worldWidth,track.worldHeight);
}
function setupCar(player,isAI=false){
 const model=isAI?'balanced':player===0?($('carModel')?.value||'balanced'):'balanced';
 const paint=CAR_PAINTS[$('carColor')?.value||'pink']||CAR_PAINTS.pink;
 const personality=isAI?['racer','attacker','precise'][player-1]||'racer':null;
 return {player,isAI,model,personality,color:isAI?AI_PERSONALITIES[personality].color:player===0?paint.hex:'#39e8e8',
  x:0,y:0,heading:0,yawRate:0,speed:0,steer:0,drift:0,handbrake:false,done:false,finishTime:null,newBestLap:false,
  progress:0,previousProgress:0,lap:0,lapTimes:[],lapStartTime:0,raceProgress:0,offroad:0,roadOffset:0,particles:[],flash:0};
}
function placeCar(car,progress,lateral){
 const p=sampleAt(progress),nx=-Math.sin(p.angle),ny=Math.cos(p.angle);
 car.x=p.x+nx*lateral;car.y=p.y+ny*lateral;car.heading=p.angle;car.yawRate=0;
 car.progress=wrapDistance(progress);car.previousProgress=car.progress;car.raceProgress=car.progress;
 car.nextCheckpoint=0;car.checkpointPasses=0;car.lastCheckpointTime=0;car.aiManeuver=null;car.aiTrafficStates={};car.aiLane=lateral;
}
function start(m,s=Number($('stageSelect').value),keepSeason=false){
 if(!keepSeason)resetChampionship();
 mode=m;stage=s;track=tracks[stage];graphics=$('graphics').value;difficulty=$('difficulty').value;
 backgroundCache=null;backgroundCacheKey='';trackSurfaceCache=null;trackSurfaceKey='';checkpoints=checkpointsForTrack();aiSpeedPlan=buildAiSpeedPlan();
 cars=[setupCar(0)];
 if(mode==='solo'){const count=clamp(Number($('opponentCount').value)||3,1,3);for(let i=1;i<=count;i++)cars.push(setupCar(i,true));}else cars.push(setupCar(1));
 placeCar(cars[0],4,mode==='duo'?-18:-15);
 cars.slice(1).forEach((car,index)=>placeCar(car,mode==='solo'?78+index*70:4,mode==='solo'?(index%2?-16:16):18));
 const requestedBarrierMode=$('barrierMode')?.value||'auto';barrierMode=requestedBarrierMode==='auto'?track.defaultBarriers:requestedBarrierMode;guardrailRanges=guardrailRangesForTrack();trackFeatures=buildTrackFeatures();
 decorations=decorationsForTrack();tireBarriers=barriersForTrack();buildPhysicalBarriers();skidMarks=[];terrainParticles=[];elapsed=0;countdownRemaining=3;goFlashRemaining=0;countdownShown='';paused=false;running=true;keys=Object.create(null);
 document.body.classList.add('racing');menu.classList.add('hidden');result.classList.add('hidden');game.classList.remove('hidden');
 $('views').classList.toggle('pixelated',graphics==='retro');$('views').classList.toggle('performance',graphics==='lite');
 $('trackName').textContent=track.name;$('stageLabel').textContent=String(stage+1).padStart(2,'0');if($('trackCount'))$('trackCount').textContent=String(tracks.length).padStart(2,'0');
 $('helpText').textContent=mode==='duo'?'P1 WASD + ESPACIO · P2 FLECHAS + ENTER':'W acelerar · S frenar · A/D girar · ESPACIO freno de mano';
 updateCameraButton();$('status').textContent='PREPARADOS...';updateTelemetry();resize();initAudio();updateAudio();cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop);
}
for(let i=0;i<tracks.length;i++){const o=document.createElement('option');o.value=i;o.textContent=String(i+1).padStart(2,'0')+' — '+tracks[i].name+(tracks[i].length>3900?' · GP LARGO':'');$('stageSelect').append(o);}
function keyFor(i){return i===0?{up:'w',down:'s',left:'a',right:'d',hand:' '}:{up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright',hand:'enter'};}
window.addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' ','enter'].includes(k))e.preventDefault();
 keys[k]=true;if(k==='escape'&&!e.repeat&&running)togglePause();if(k==='r'&&!e.repeat&&running)start(mode,stage,true);if(k==='c'&&!e.repeat&&running)toggleCamera();
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
  if(!car.isAI&&saveBestLap(lapRecordKey(),lapTime)){car.newBestLap=true;playTone(1040,.16,.035);}
  car.lapStartTime=elapsed;car.lap++;car.checkpointPasses=0;car.nextCheckpoint=0;
  playTone(car.lap>=LAPS_TO_WIN?880:620,.12,.035);
 }
 car.previousProgress=old;car.progress=newP;car.raceProgress=car.lap*track.length+newP;
 car.offroad=Math.abs(loc.offset);car.roadOffset=loc.offset;car.nearest=loc;
 if(car.lap>=LAPS_TO_WIN&&!car.done){car.done=true;car.finishTime=elapsed;car.speed=0;}
}
// Difficulty changes driving decisions, never the vehicle specifications.
const AI_DRIVERS={
 easy:{pace:.82,brakingMargin:.62,response:5.8,laneSpeed:15,handbrake:false},
 normal:{pace:.97,brakingMargin:.90,response:7.5,laneSpeed:22,handbrake:true},
 hard:{pace:1,brakingMargin:.98,response:9.2,laneSpeed:28,handbrake:true}
};
const AI_PERSONALITIES={
 racer:{name:'CPU 1',color:'#ffc857',pace:0,braking:0,response:0,lane:0,attackGap:135,closing:4},
 attacker:{name:'FURIA',color:'#ff794f',pace:.03,braking:.05,response:1,lane:4,attackGap:150,closing:2},
 precise:{name:'ÁPICE',color:'#ae97ff',pace:.02,braking:.06,response:1.4,lane:2,attackGap:120,closing:6}
};
function driverFor(car){
 const base=AI_DRIVERS[difficulty]||AI_DRIVERS.normal,style=AI_PERSONALITIES[car.personality]||AI_PERSONALITIES.racer;
 return {...base,pace:Math.min(1,base.pace+style.pace),brakingMargin:Math.min(1,base.brakingMargin+style.braking),response:base.response+style.response,laneSpeed:base.laneSpeed+style.lane,attackGap:style.attackGap,closing:style.closing};
}
const WORLD_SPEED_SCALE=.84;
function vehicleHandling(speed,model,surface,safeSpeed,drift=0,hand=false){
 const excess=Math.max(0,speed-safeSpeed);
 const speedLoss=Math.min(.5,excess*.0032);
 const grip=clamp((1-speedLoss-drift*(hand?.05:.12))*model.grip*(SURFACE_GRIP[surface]||1),.38,1.15);
 const turnRate=(.95+speed/235*2.9)*model.steering*grip*(hand?1.18:1);
 return {grip,turnRate};
}
let aiSpeedPlan=[];
function buildAiSpeedPlan(){
 const model=CAR_MODELS.balanced,plan=[];
 for(let d=0;d<track.length;d+=12){
  const curvature=Math.abs(wrapAngle(sampleAt(d+12).angle-sampleAt(d-12).angle))/24;
  const bend=curvatureAt(d),surface=surfaceAtProgress(d);
  // Find a speed the shared steering physics can actually hold at this radius.
  function limit(hand){
   let low=18,high=model.maxSpeed;
   for(let step=0;step<10;step++){
    const speed=(low+high)/2;
    const expectedDrift=hand?clamp(speed/200,0,1):clamp(Math.max(0,speed-bend.safeSpeed)/160,0,1);
    const turnRate=vehicleHandling(speed,model,surface,bend.safeSpeed,expectedDrift,hand).turnRate*.96;
    if(speed*WORLD_SPEED_SCALE*curvature<=turnRate)low=speed;else high=speed;
   }
   return low;
  }
  plan.push({progress:d,speed:limit(false),driftSpeed:limit(true),curvature});
 }
 return plan;
}
function aiTargetSpeed(progress,model,driver,allowHandbrake=false){
 let target=model.maxSpeed*driver.pace;
 // Backward braking envelope: speed is in dashboard units, distance in world units.
 for(const point of aiSpeedPlan){
  const distance=wrapDistance(point.progress-progress);
  if(distance>240)continue;
  const planned=allowHandbrake&&point.curvature>1/180?Math.max(point.speed,point.driftSpeed*.98):point.speed;
  const cornerSpeed=planned*driver.pace;
  const allowed=Math.sqrt(cornerSpeed*cornerSpeed+2*model.braking*driver.brakingMargin*distance/WORLD_SPEED_SCALE);
  target=Math.min(target,allowed);
 }
 return target;
}
// Predict short-term contact from actual world velocities, including lateral cut-ins.
function trafficApproach(car,other){
 // Continue the current yaw for a short horizon, including curved approaches.
 function projected(vehicle,time){
  const yaw=vehicle.yawRate||0,travel=vehicle.speed*WORLD_SPEED_SCALE;
  if(Math.abs(yaw)<.01)return {x:vehicle.x+Math.cos(vehicle.heading)*travel*time,y:vehicle.y+Math.sin(vehicle.heading)*travel*time};
  const heading=vehicle.heading+yaw*time;
  return {x:vehicle.x+travel/yaw*(Math.sin(heading)-Math.sin(vehicle.heading)),y:vehicle.y+travel/yaw*(Math.cos(vehicle.heading)-Math.cos(heading))};
 }
 let time=0,clearance=Math.hypot(other.x-car.x,other.y-car.y);
 for(let step=1;step<=12;step++){
  const candidateTime=step/16,a=projected(car,candidateTime),b=projected(other,candidateTime);
  const distance=Math.hypot(b.x-a.x,b.y-a.y);
  if(distance<clearance){time=candidateTime;clearance=distance;}
 }
 return {time,clearance};
}
// Keep physical proximity separate from race position: a lapped car is still solid.
function aiTrafficAgainst(car,before,driver,dt,other,maneuver){
 maneuver.age+=dt;maneuver.cooldown=Math.max(0,maneuver.cooldown-dt);
 const bend=curvatureAt(before.progress+35);
 const idealLane=clamp(bend.turn*8,-10,10);
 const clear=()=>{maneuver.type='clear';maneuver.side=0;maneuver.age=0;return {lane:idealLane,speedLimit:Infinity};};
 if(!other)return clear();
 const separation=Math.hypot(other.x-car.x,other.y-car.y);
 if(separation>180)return clear();
 const otherLoc=nearestOnTrack(other.x,other.y);
 const gap=wrapDistance(otherLoc.progress-before.progress+track.length/2)-track.length/2;
 // Neighbouring sections of a hairpin must not be treated as traffic in this lane.
 if(Math.abs(gap)>170||Math.cos(otherLoc.angle-before.angle)<.35)return clear();
 const raceGap=other.raceProgress-car.raceProgress;
 const lapDifference=Math.round((raceGap-gap)/track.length);
 const alongside=Math.abs(gap)<36&&separation<78;
 const ahead=gap>0;
 const chooseSide=()=>{
  const physicalSide=before.offset<otherLoc.offset?-1:before.offset>otherLoc.offset?1:otherLoc.offset>=0?-1:1;
  // Pick a lane with room before committing; never cross sides during overlap.
  if(!alongside&&Math.abs(otherLoc.offset+physicalSide*32)>28)return -physicalSide;
  return physicalSide;
 };
 function commit(type,side){
  if(maneuver.type!==type){maneuver.type=type;maneuver.age=0;}
  maneuver.side=side;
 }
 if(alongside){
  // Freeze the side during overlap; never defend across a rival's occupied lane.
  commit('alongside',maneuver.type==='alongside'?maneuver.side:chooseSide());
 }else if(ahead){
  if((maneuver.type==='pass'||maneuver.type==='alongside')&&maneuver.age<8){
   commit('pass',maneuver.side);
  }else if(maneuver.type==='pass'){
   commit('follow',0);maneuver.cooldown=1.5;
  }else if(gap<(driver.attackGap||135)&&bend.severity<.65&&maneuver.cooldown===0&&(car.speed>other.speed+(driver.closing||4)||(other.speed<30&&gap<55))){
   commit('pass',chooseSide());
  }else commit('follow',0);
 }else if(gap>-85&&lapDifference>0&&other.speed>car.speed+4){
  // A faster car with a lap in hand gets room rather than a defensive block.
  commit('yield',maneuver.type==='yield'?maneuver.side:chooseSide());
 }else if(gap>-100&&lapDifference===0&&difficulty!=='easy'&&(maneuver.type==='defend'||other.speed>car.speed+4)){
  // One defensive line per approach; do not mirror repeated rival direction changes.
  if(maneuver.type!=='defend'&&maneuver.type!=='alongside'&&maneuver.type!=='pass'){
   commit('defend',otherLoc.offset>=0?1:-1);
  }
 }else return clear();
 let lane=idealLane;
 const laneRoom=28/(1+bend.severity*.25);
 if(maneuver.type==='pass'||maneuver.type==='yield')lane=maneuver.side*laneRoom;
 if(maneuver.type==='alongside')lane=clamp(otherLoc.offset+maneuver.side*32,-laneRoom,laneRoom);
 if(maneuver.type==='defend')lane=maneuver.side*Math.min(18,laneRoom);
 let speedLimit=Infinity;
 const approach=trafficApproach(car,other);
 const converging=approach.time>0&&approach.clearance<30;
 if(ahead&&(Math.abs(before.offset-otherLoc.offset)<27||converging)){
  // Shared braking distance gives time to open a lane before reaching the rear bumper.
  const otherForwardSpeed=Math.max(0,other.speed*Math.cos(other.heading-car.heading));
  const closing=Math.max(0,car.speed-otherForwardSpeed),buffer=32+closing*.2;
  const available=Math.max(0,gap-buffer);
  speedLimit=Math.sqrt(otherForwardSpeed*otherForwardSpeed+2*CAR_MODELS[car.model].braking*driver.brakingMargin*available/WORLD_SPEED_SCALE);
  // Yield longitudinal room if the other car cuts into the reserved lane.
  if(converging&&approach.time<.55)speedLimit=Math.min(speedLimit,otherForwardSpeed*.9);
  // A stopped obstacle must not deadlock steering: creep only along a clear ray.
  const dx=other.x-car.x,dy=other.y-car.y;
  const forward=dx*Math.cos(car.heading)+dy*Math.sin(car.heading);
  const clearance=forward>0?Math.sqrt(Math.max(0,separation*separation-forward*forward)):separation;
  if(other.speed<30&&clearance>24.5&&separation>25&&(maneuver.type==='pass'||maneuver.type==='alongside'))speedLimit=Math.max(speedLimit,18);
 }
 // If the edge leaves no safe side-by-side lane, fall behind rather than squeeze.
 if(ahead&&maneuver.type==='alongside'&&Math.abs(lane-otherLoc.offset)<25){
  speedLimit=Math.min(speedLimit,Math.max(0,other.speed-25));
 }
 return {lane,speedLimit};
}
function aiTraffic(car,before,driver,dt){
 const fresh=()=>({type:'clear',side:0,age:0,cooldown:0});
 // Retain the two-car controller state for existing single-opponent races.
 if(cars.length===2){
  car.aiManeuver=car.aiManeuver||fresh();
  return aiTrafficAgainst(car,before,driver,dt,cars.find(other=>other!==car&&!other.done),car.aiManeuver);
 }
 const states=car.aiTrafficStates||(car.aiTrafficStates={});
 const neighbours=cars.filter(other=>other!==car&&!other.done&&Math.hypot(other.x-car.x,other.y-car.y)<180)
  .sort((a,b)=>Math.hypot(a.x-car.x,a.y-car.y)-Math.hypot(b.x-car.x,b.y-car.y));
 for(const key of Object.keys(states))if(!neighbours.some(other=>String(other.player)===key))delete states[key];
 let traffic=null,speedLimit=Infinity;
 for(const other of neighbours){
  const state=states[other.player]||(states[other.player]=fresh());
  const decision=aiTrafficAgainst(car,before,driver,dt,other,state);
  speedLimit=Math.min(speedLimit,decision.speedLimit);
  if(!traffic&&state.type!=='clear'){traffic=decision;car.aiManeuver=state;}
 }
 if(!traffic){car.aiManeuver=fresh();traffic={lane:clamp(curvatureAt(before.progress+35).turn*8,-10,10)};}
 return {lane:traffic.lane,speedLimit};
}
function driveAI(car,before,model,dt){
 const driver=driverFor(car);
 const traffic=aiTraffic(car,before,driver,dt);
 let lookAhead=clamp(28+car.speed*.27,32,94);
 if(car.speed<40&&car.aiManeuver.type!=='clear')lookAhead=Math.min(lookAhead,8+car.speed*.15);
 const laneOffset=traffic.lane;
 const allowHandbrake=driver.handbrake&&car.aiManeuver.type==='clear'&&Math.abs(before.offset)<ROAD_EDGE-8;
 let targetSpeed=Math.min(aiTargetSpeed(before.progress,model,driver,allowHandbrake),traffic.speedLimit);
 car.aiLane=(car.aiLane||0)+clamp(laneOffset-(car.aiLane||0),-driver.laneSpeed*dt,driver.laneSpeed*dt);
 const targetBase=sampleAt(before.progress+lookAhead);
 const target={x:targetBase.x-Math.sin(targetBase.angle)*car.aiLane,y:targetBase.y+Math.cos(targetBase.angle)*car.aiLane};
 const error=wrapAngle(Math.atan2(target.y-car.y,target.x-car.x)-car.heading);
 const handling=vehicleHandling(car.speed,model,surfaceAtProgress(before.progress),curvatureAt(before.progress).safeSpeed,car.drift);
 const targetDistance=Math.max(10,Math.hypot(target.x-car.x,target.y-car.y));
 const requiredYaw=2*car.speed*WORLD_SPEED_SCALE*Math.sin(error)/targetDistance;
 const hand=allowHandbrake&&car.speed>90&&Math.abs(car.steer)>.3&&Math.abs(requiredYaw)>handling.turnRate*(car.handbrake?.72:.9);
 const turnRate=hand?vehicleHandling(car.speed,model,surfaceAtProgress(before.progress),curvatureAt(before.progress).safeSpeed,clamp(Math.abs(car.steer)*car.speed/200,0,1),true).turnRate:handling.turnRate;
 const steerTarget=car.speed<60?error*2.6:requiredYaw/turnRate+error*.2;
 car.steer+=(clamp(steerTarget,-1,1)-car.steer)*Math.min(1,dt*driver.response);
 if(Math.abs(before.offset)>ROAD_EDGE)targetSpeed=Math.min(targetSpeed,65);
 if(Math.abs(error)>1.1)targetSpeed=Math.min(targetSpeed,45);
 car.aiTargetSpeed=targetSpeed;
 return {throttle:car.speed<targetSpeed-2?1:0,brake:car.speed>targetSpeed+2?1:0,hand};
}
// Rotational inertia: build and release yaw smoothly, retaining full steady turn rate.
// Integrate the first-order response exactly for this step, independent of FPS.
function updateSteeringInertia(car,turnRate,maxSpeed,dt){
 const target=car.steer*turnRate,response=car.handbrake?18:16-5*clamp(car.speed/maxSpeed,0,1);
 const previous=car.yawRate||0,decay=Math.exp(-response*dt);
 car.yawRate=target+(previous-target)*decay;
 car.heading=wrapAngle(car.heading+target*dt+(previous-target)*(1-decay)/response);
}
function physics(car,i,dt){
 const before=nearestOnTrack(car.x,car.y),k=keyFor(i),localBend=curvatureAt(before.progress),upcoming=upcomingCorner(before.progress);
 const model=CAR_MODELS[car.model]||CAR_MODELS.balanced;
 let controls;
 if(car.isAI){
  controls=driveAI(car,before,model,dt);
 }else{
  const hand=!!keys[k.hand],steering=(keys[k.right]?1:0)-(keys[k.left]?1:0);
  car.steer+=(steering-car.steer)*Math.min(1,dt*(hand?13:10));
  controls={throttle:keys[k.up]?1:0,brake:keys[k.down]?1:0,hand};
 }
 const {throttle,brake,hand}=controls;car.handbrake=hand;
 car.speed+=throttle*model.acceleration*dt;
 car.speed-=brake*(hand?model.braking*1.27:model.braking)*dt;
 car.speed-=(throttle?2.6:20)*dt;
 if(hand)car.speed-=model.braking*.55*dt;
 if(hand)car.drift=Math.min(1,Math.abs(car.steer)*car.speed/200);
 car.speed=clamp(car.speed,0,model.maxSpeed);
 const tooFast=Math.max(0,car.speed-localBend.safeSpeed);
 const drivingSurface=surfaceAtProgress(before.progress);
 const handling=vehicleHandling(car.speed,model,drivingSurface,localBend.safeSpeed,car.drift,car.handbrake);
 updateSteeringInertia(car,handling.turnRate,model.maxSpeed,dt);
 car.drift=clamp(Math.max(car.drift*Math.exp(-4.5*dt),tooFast/160),0,1);
 const oldProgress=car.progress,previousX=car.x,previousY=car.y;
 const move=car.speed*WORLD_SPEED_SCALE*dt;
 car.x+=Math.cos(car.heading)*move;car.y+=Math.sin(car.heading)*move;
 let after=nearestOnTrack(car.x,car.y);
 // El pasto tiene mucha resistencia: penaliza fuerte, pero permite recuperar el auto.
 let roadEdge=Math.max(0,Math.abs(after.offset)-ROAD_EDGE);
 if(roadEdge>0){
  const runoffMaterial=track.surface==='dirt'?'dirt':track.surface==='volcanic'?'volcanic':track.surface==='ice'?'ice':track.surface==='coastal'?'coastal':'grass';
  const baseDrag=runoffMaterial==='grass'?34:runoffMaterial==='ice'?58:(runoffMaterial==='dirt'||runoffMaterial==='volcanic'||runoffMaterial==='coastal')?54:82;
  const edgeDrag=runoffMaterial==='grass'?2.2:(runoffMaterial==='dirt'||runoffMaterial==='volcanic'||runoffMaterial==='coastal')?2.8:4.6;
  car.speed=Math.max(Math.min(14,car.speed),car.speed-(baseDrag+roadEdge*edgeDrag)*model.grass*dt);
  car.drift=Math.max(car.drift,.28);
 }
 // The rendered rails and tires are also the physical collision geometry.
 const hitBarrier=resolveBarrierContact(car,previousX,previousY);
 if(hitBarrier)after=nearestOnTrack(car.x,car.y);
 const side=Math.sign(after.offset)||1,nx=-Math.sin(after.angle),ny=Math.cos(after.angle);
 if(!hitBarrier&&Math.abs(after.offset)>92){
  car.speed=Math.max(Math.min(12,car.speed),car.speed-(100+(Math.abs(after.offset)-92)*2.2)*dt);
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
  const rearX=car.x-Math.cos(car.heading)*13,rearY=car.y-Math.sin(car.heading)*13,spread=(Math.random()-.5)*14;
  const runoffMaterial=track.surface==='dirt'?'dirt':track.surface==='volcanic'?'volcanic':track.surface==='ice'?'snow':track.surface==='coastal'?'sand':'grass';
  const particleMaterial=roadEdge>3?runoffMaterial:surfaceAtProgress(after.progress);
  const particleStyle={dirt:{color:'#ad8053',life:.62,size:3},volcanic:{color:'#cf603c',life:.58,size:3},snow:{color:'#d9f1f6',life:.46,size:2},sand:{color:'#c9ad7a',life:.58,size:3},grass:{color:'#6e9958',life:.46,size:2},asphalt:{color:'#aeb6c5',life:.46,size:2}}[particleMaterial]||{color:'#aeb6c5',life:.46,size:2};
  const life=particleStyle.life;
  terrainParticles.push({x:rearX-Math.sin(car.heading)*spread,y:rearY+Math.cos(car.heading)*spread,vx:(Math.random()-.5)*34-Math.cos(car.heading)*(roadEdge>3?12:5),vy:(Math.random()-.5)*34-Math.sin(car.heading)*(roadEdge>3?12:5),life,max:life,size:particleStyle.size+Math.random()*2,color:particleStyle.color});
 }
 car.particles=car.particles.filter(p=>(p.life-=dt)>0);if(car.flash>0)car.flash-=dt;
}
function resolveCollisions(dt){
 const active=cars.filter(car=>!car.done),origins=new Map(active.map(car=>[car,{x:car.x,y:car.y}]));
 const impacted=new Set(),moved=new Set();
 // Iterate the small grid: resolving one pair can overlap another or a wall.
 for(let pass=0;pass<16;pass++){
  let depth=0;
  for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
   const a=active[i],b=active[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
   if(d>=23)continue;
   depth=Math.max(depth,23-d);
   const nx=d>.001?dx/d:Math.cos(a.heading),ny=d>.001?dy/d:Math.sin(a.heading);
   const key=i+','+j;
   if(!impacted.has(key)){
    const av=Math.cos(a.heading)*nx+Math.sin(a.heading)*ny,bv=Math.cos(b.heading)*nx+Math.sin(b.heading)*ny;
    const closing=Math.max(0,a.speed*av-b.speed*bv);
    // Dissipate closing motion only; no artificial acceleration or rebound.
    a.speed=Math.max(0,a.speed-closing*.65*Math.max(0,av));
    b.speed=Math.max(0,b.speed-closing*.65*Math.max(0,-bv));
    if(closing>8){a.flash=.06;b.flash=.06;const now=performance.now();if(now-lastCrashSoundAt>420){playTone(105,.12,.05);lastCrashSoundAt=now;}}
    impacted.add(key);
   }
   const push=(23-d+.01)*.5,ax=a.x,ay=a.y,bx=b.x,by=b.y;
   a.x-=nx*push;a.y-=ny*push;b.x+=nx*push;b.y+=ny*push;
   // Reuse exactly the same visible rail/tire geometry after a car pushes us.
   resolveBarrierContact(a,ax,ay);resolveBarrierContact(b,bx,by);moved.add(a);moved.add(b);
  }
  if(depth<.01)break;
 }
 // Contact movement may cross a real gate; keep checkpoints and telemetry coherent.
 for(const car of moved){const from=origins.get(car);updateProgress(car,nearestOnTrack(car.x,car.y),from.x,from.y);}
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
 const desert=track.surface==='dirt',volcanic=track.surface==='volcanic';
 for(let y=8;y<track.worldHeight;y+=17)for(let x=8;x<track.worldWidth;x+=19){
  const seed=Math.abs(Math.sin(x*12.9898+y*78.233+stage*37.17)*43758.5453)%1;
  if(volcanic){if(seed>.69){context.fillStyle=seed>.94?'#d65d3e':seed>.82?'#211e25':'#5a4645';context.globalAlpha=seed>.94?.38:.24;context.beginPath();context.ellipse(x+(seed-.5)*9,y+(seed-.5)*6,2+seed*4,1+seed*2,seed*3,0,Math.PI*2);context.fill();}if(seed>.985){context.fillStyle='#ff7547';context.globalAlpha=.42;context.fillRect(x,y,2,2);}}
  else if(desert){if(seed>.71){context.fillStyle=seed>.91?'#694c32':'#d1b47d';context.globalAlpha=seed>.91?.32:.18;context.beginPath();context.ellipse(x+(seed-.5)*9,y+(seed-.5)*6,2+seed*4,1+seed*2,seed*3,0,Math.PI*2);context.fill();}if(seed>.965){context.fillStyle='#665542';context.globalAlpha=.45;context.fillRect(x,y,2,2);}}
  else if(seed>.55){context.globalAlpha=stage===4?.14:.23;context.strokeStyle=seed>.82?'#d8e6bd':'#0b3a28';context.lineWidth=1;context.beginPath();context.moveTo(x,y+2);context.lineTo(x+(seed-.5)*5,y-2-seed*3);context.stroke();}context.globalAlpha=1;
 }
}
function drawGuardrails(context){
 for(const points of guardrailPaths){
  const trace=()=>{context.beginPath();context.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)context.lineTo(points[i].x,points[i].y);};
  context.save();context.lineCap='round';context.lineJoin='round';context.setLineDash([]);
  for(const [color,width] of [['#202732',11],['#9ba7b7',6],['#e7eef6',2]]){context.strokeStyle=color;context.lineWidth=width;trace();context.stroke();}
  context.setLineDash([7,13]);context.strokeStyle='#e0b84f';context.lineWidth=2;trace();context.stroke();context.setLineDash([]);
  let untilPost=0;
  for(let i=1;i<points.length;i++){
   const a=points[i-1],b=points[i],length=pointDistance(a,b),angle=Math.atan2(b.y-a.y,b.x-a.x);
   while(untilPost<length){
    const t=untilPost/(length||1);context.save();context.translate(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t);context.rotate(angle);
    context.fillStyle='#171c25';context.fillRect(-2,-5.5,4,11);context.fillStyle='#c8d0dc';context.fillRect(-1,-5,2,10);context.restore();untilPost+=24;
   }
   untilPost-=length;
  }
  context.restore();
 }
}
function renderStaticBackground(context){
 context.fillStyle=track.grass;context.fillRect(0,0,track.worldWidth,track.worldHeight);
 for(let y=0;y<track.worldHeight;y+=36){context.fillStyle=(Math.floor(y/36)%2)?'#ffffff05':'#0b2b1a0a';context.fillRect(0,y,track.worldWidth,18);}
 renderGroundTexture(context);
 for(const d of decorations){
  if(track.environment==='coast'||stage===10){
   // Vegetación de costa: palmeras angulares y rocas claras, identidad propia del circuito.
   context.fillStyle='#6b5039';context.fillRect(d.x-2,d.y-8,4,15);
   context.strokeStyle='#1b5b49';context.lineWidth=3;context.lineCap='round';
   for(const a of [-2.7,-1.8,-.9,0,.9]){context.beginPath();context.moveTo(d.x,d.y-7);context.lineTo(d.x+Math.cos(a)*d.size,d.y-7+Math.sin(a)*d.size*.62);context.stroke();}
   context.fillStyle='#dfd2a2';context.beginPath();context.ellipse(d.x+d.size*.8,d.y+4,d.size*.7,d.size*.35,.35,0,Math.PI*2);context.fill();
  }else if(track.environment==='rally'||stage===11){
   // Rocas angulares en el cañón, con pequeños arbustos resistentes.
   context.fillStyle=d.type%2?'#6e533b':'#886845';context.beginPath();context.moveTo(d.x-d.size,d.y+4);context.lineTo(d.x-d.size*.55,d.y-d.size*.55);context.lineTo(d.x+d.size*.2,d.y-d.size);context.lineTo(d.x+d.size,d.y+3);context.closePath();context.fill();
   context.fillStyle='#667044';context.fillRect(d.x+d.size*.3,d.y-5,3,9);
  }else if(track.environment==='meadow'||stage===12){
   context.strokeStyle='#b3da72';context.lineWidth=2;context.beginPath();context.moveTo(d.x-d.size,d.y+3);context.lineTo(d.x+d.size,d.y-4);context.stroke();context.fillStyle='#2c6a39';context.beginPath();context.arc(d.x,d.y-7,d.size*.55,0,Math.PI*2);context.fill();
  }else if(track.environment==='industrial'||stage===13){
   context.fillStyle='#3b4449';context.fillRect(d.x-d.size,d.y-d.size*.65,d.size*2,d.size*1.3);context.fillStyle='#ffcc63';context.fillRect(d.x-d.size*.5,d.y-d.size*.25,d.size,3);context.fillStyle='#bbc5ca';context.fillRect(d.x-2,d.y-d.size,4,d.size*.4);
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
  cache.width=track.worldWidth;cache.height=track.worldHeight;
  const cacheContext=cache.getContext('2d');
  renderStaticBackground(cacheContext);
  backgroundCache=cache;backgroundCacheKey=key;
 }
 context.drawImage(backgroundCache,0,0,track.worldWidth,track.worldHeight);
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
 context.fillStyle=car.color;context.font='bold 9px monospace';context.textAlign='center';context.fillText(carName(car),car.x,car.y-19);
 for(const smoke of car.particles){
  context.globalAlpha=clamp(smoke.life/smoke.max,0,1)*.42;context.fillStyle='#e1e2df';context.beginPath();context.arc(car.x-smoke.dx,car.y+smoke.dy,smoke.size,0,Math.PI*2);context.fill();
 }
 context.globalAlpha=1;
}
function drawMiniMap(){
 const mini=$('miniMap');if(!mini)return;const m=mini.getContext('2d'),w=mini.width,h=mini.height;
 m.clearRect(0,0,w,h);m.fillStyle='#0c1322';m.fillRect(0,0,w,h);
 const scale=Math.min((w-12)/track.worldWidth,(h-12)/track.worldHeight),ox=(w-track.worldWidth*scale)/2,oy=(h-track.worldHeight*scale)/2;
 m.save();m.setTransform(scale,0,0,scale,ox,oy);
 strokeTrack(m,'#02060c',116);strokeTrack(m,track.surface==='dirt'?'#b28b61':track.surface==='grass'?'#74a94e':track.surface==='ice'?'#dffaff':'#5e6875',82);
 if(track.surface==='mixed')for(const [start,end] of track.dirtRanges)strokeTrackRange(m,start,end,'#ad8258',68);
 if(track.surface==='coastal')strokeTrackRange(m,track.length*.31,track.length*.37,'#c2a06b',68);
 for(let player=0;player<(usesSplitScreen()?2:1);player++){const width=usesSplitScreen()?500:1000,view=raceCamera(player,width);if(view.zoom>overviewZoom()){m.strokeStyle=cars[player]?.color||'#39e8e8';m.lineWidth=1.2/scale;m.strokeRect(view.x-width/2/view.zoom,view.y-320/view.zoom,width/view.zoom,640/view.zoom);}}
 cars.forEach(car=>{m.fillStyle=car.color;m.beginPath();m.arc(car.x,car.y,Math.max(17,2.6/scale),0,Math.PI*2);m.fill();});
 m.restore();m.strokeStyle='#5d6b8a';m.lineWidth=2;m.strokeRect(1,1,w-2,h-2);
}
function currentLapTime(car){
 if(car.done)return car.lapTimes[car.lapTimes.length-1]||0;
 return Math.max(0,elapsed-car.lapStartTime);
}
function updateTelemetry(){
 const player=cars[0];if(!player)return;
 $('speedValue').textContent=Math.round(player.speed)+' km/h';
 $('cpValue').textContent=Math.min(player.checkpointPasses||0,checkpoints.length)+' / '+checkpoints.length;
 const best=bestLapRecords[lapRecordKey()];$('bestLapValue').textContent=best?format(best):'--:--.-';
 $('position').textContent=(raceClassification().indexOf(player)+1)+'/'+cars.length;
 $('timer').textContent=format(currentLapTime(player));$('lap').textContent=Math.min(LAPS_TO_WIN,player.lap+1)+'/'+LAPS_TO_WIN;
 drawMiniMap();
}
function overviewZoom(){return Math.min(1000/track.worldWidth,640/track.worldHeight);}
function usesSplitScreen(){return mode==='duo'&&track.worldWidth>1000;}
function raceCamera(player=0,viewportWidth=usesSplitScreen()?500:1000){
 if((mode==='duo'&&!usesSplitScreen())||(mode!=='duo'&&cameraMode==='overview')||!cars[player])return {zoom:overviewZoom(),x:track.worldWidth/2,y:track.worldHeight/2};
 const car=cars[player],zoom=usesSplitScreen()?1.1:1.35,halfW=viewportWidth/2/zoom,halfH=320/zoom;
 return {zoom,x:clamp(car.x+Math.cos(car.heading)*28,halfW,track.worldWidth-halfW),y:clamp(car.y+Math.sin(car.heading)*28,halfH,track.worldHeight-halfH)};
}
function updateCameraButton(){
 $('cameraBtn').disabled=mode==='duo';
 $('cameraBtn').textContent=mode==='duo'?(usesSplitScreen()?'VISTA: DIVIDIDA':'VISTA: DOS JUGADORES'):cameraMode==='near'?'VISTA: CERCA':'VISTA: CIRCUITO';
}
function toggleCamera(){
 if(mode==='duo')return;
 cameraMode=cameraMode==='near'?'overview':'near';updateCameraButton();if(running)resize();
}
function drawDrivingView(left,width,player){
 const view=raceCamera(player,width);ctx.save();ctx.beginPath();ctx.rect(left,0,width,640);ctx.clip();
 ctx.translate(left+width/2,320);ctx.scale(view.zoom,view.zoom);ctx.translate(-view.x,-view.y);drawBackground(ctx);
 const centerLineColor=track.surface==='dirt'?'#ead0a3':track.surface==='grass'?'#cce88d':track.surface==='ice'?'#f4ffff':track.surface==='volcanic'?'#df8060':'#eef0d85c';
 strokeTrack(ctx,centerLineColor,2.5,[18,22],-elapsed*13);
 drawGroundEffects(ctx);cars.slice().sort((a,b)=>a.speed-b.speed).forEach(car=>drawCar(ctx,car));ctx.restore();
}
function drawFrame(){
 const w=canvas.width,h=canvas.height;ctx.setTransform(w/1000,0,0,h/640,0,0);
 if(usesSplitScreen()){
  drawDrivingView(0,500,0);drawDrivingView(500,500,1);ctx.fillStyle='#090b19';ctx.fillRect(498,0,4,640);
  for(let i=0;i<2;i++){ctx.fillStyle='#090b19dd';ctx.fillRect(i*500+8,8,100,22);ctx.fillStyle=cars[i].color;ctx.font='bold 14px monospace';ctx.textAlign='left';ctx.fillText('P'+(i+1)+' · V'+Math.min(LAPS_TO_WIN,cars[i].lap+1)+'/'+LAPS_TO_WIN,i*500+13,24);}
 }else drawDrivingView(0,1000,0);
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
 updateGroundEffects(dt);updateAudio();drawFrame();updateTelemetry();
 const finishers=cars.filter(car=>car.done);
 if(cars.every(car=>car.done)){finishRace();return;}
 if(finishers.length&&elapsed-Math.min(...finishers.map(car=>car.finishTime))>18){finishRace();return;}
 raf=requestAnimationFrame(loop);
}
function format(t){const m=Math.floor(t/60),s=(t%60).toFixed(1).padStart(4,'0');return String(m).padStart(2,'0')+':'+s;}
function finishRace(){
 running=false;document.body.classList.remove('racing');cancelAnimationFrame(raf);game.classList.add('hidden');result.classList.remove('hidden');
 const classification=raceClassification(),winner=classification[0];
 awardPoints(winner);updateAudio();
 if(stage===tracks.length-1)$('resultTitle').textContent='¡CAMPEONATO TERMINADO!';
 else if(mode==='solo')$('resultTitle').textContent=winner.isAI?'¡TE GANÓ EL RIVAL!':'¡GANASTE LA CARRERA!';
 else $('resultTitle').textContent='¡GANA EL JUGADOR '+(winner.player+1)+'!';
 const champion=[...cars].sort((a,b)=>(championship[scoreKey(b)]||0)-(championship[scoreKey(a)]||0))[0];
 const finalNote=stage===tracks.length-1?' · CAMPEÓN DE TEMPORADA: '+carName(champion)+' ('+(championship[scoreKey(champion)]||0)+' pts)':'';
 const bestLap=bestLapRecords[lapRecordKey()];
 $('resultText').textContent=classification.map((car,index)=>(index+1)+'º '+carName(car)+' '+(car.done?format(car.finishTime):'SIN TERMINAR')).join(' · ')+' · '+track.name+' · '+LAPS_TO_WIN+' vueltas · Tiempo total '+format(winner.finishTime??elapsed)+(winner.lapTimes.length?' · Mejor vuelta '+format(Math.min(...winner.lapTimes)):'')+' · '+standingsText()+finalNote+(bestLap?' · Récord guardado '+format(bestLap):'')+(cars.some(car=>car.newBestLap)?' · ¡NUEVO RÉCORD!':'');
 $('nextBtn').textContent=stage===tracks.length-1?'NUEVA TEMPORADA ↻':'SIGUIENTE CIRCUITO →';
 $('nextBtn').onclick=()=>stage===tracks.length-1?start(mode,0,false):start(mode,(stage+1)%tracks.length,true);
}
$('cameraBtn').onclick=toggleCamera;
$('pauseBtn').onclick=togglePause;
$('restartBtn').onclick=()=>start(mode,stage,true);
$('backBtn').onclick=()=>{running=false;document.body.classList.remove('racing');updateAudio();cancelAnimationFrame(raf);keys=Object.create(null);game.classList.add('hidden');menu.classList.remove('hidden');};
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
if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(()=>{if(running)resize();});observer.observe($('views'));}
})();
