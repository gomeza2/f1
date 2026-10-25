(()=>{'use strict';
const $=id=>document.getElementById(id);
const menu=$('menu'),game=$('game'),result=$('result'),canvas=$('canvas1'),ctx=canvas.getContext('2d');
const trackDefs=[
{name:'SUNSET CIRCUIT',worldScale:1.8,layoutVersion:3,sky:'#f4a66c',grass:'#36784d',accent:'#f6d27c',points:[[140,100],[350,90],[620,90],[850,120],[920,220],[900,370],[820,450],[700,470],[620,420],[650,340],[600,270],[500,260],[430,320],[450,410],[530,490],[520,560],[400,580],[250,540],[130,480],[80,380],[110,280],[210,280],[300,290],[350,235],[300,170],[220,165],[150,205],[90,180]]},
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
const ROAD_EDGE=42, WALL_EDGE=66,CAR_HALF_WIDTH=10;
const PHYSICS_VERSION=4;
const DRIVING_TUNING={accelerationScale:.82,accelerationTaper:.45,lateralAcceleration:280,maxSpeedGripLoss:.24,speedGripLoss:.0014,inputResponse:14,handInputResponse:16,yawResponse:18,yawSpeedWeight:4};
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
const TERRAIN_MATERIALS={
 asphalt:{grip:1,drag:0,edgeDrag:0,particle:'#aeb6c5',life:.46,size:2},
 dirt:{grip:.84,drag:54,edgeDrag:2.8,particle:'#ad8053',life:.62,size:3},
 grass:{grip:.79,drag:34,edgeDrag:2.2,particle:'#6e9958',life:.46,size:2},
 ice:{grip:.68,drag:58,edgeDrag:4.6,particle:'#d9f1f6',life:.46,size:2},
 volcanic:{grip:.87,drag:54,edgeDrag:2.8,particle:'#cf603c',life:.58,size:3},
 coastal:{grip:1,drag:54,edgeDrag:2.8,particle:'#c9ad7a',life:.58,size:3},
 gravel:{mark:'#816c50',grip:.60,drag:130,edgeDrag:0,speedDrag:.35,particle:'#c4a47b',life:.62,size:3,palette:['#a48c6d','#b59b77','#c3ab86','#d1bb96']}
};
const SURFACE_GRIP=Object.fromEntries(Object.entries(TERRAIN_MATERIALS).map(([name,material])=>[name,material.grip]));
const ROAD_SHOULDER=48,GRAVEL_WIDTH=38,RUNOFF_CELL=2;

const TRACK_BARRIERS=['open','half','open','corners','corners','open','corners','half','open','corners','open','open','open','half'];
tracks.forEach((item,index)=>{item.surface=TRACK_SURFACES[index]||'asphalt';item.defaultBarriers=TRACK_BARRIERS[index]||'full';item.dirtRanges=item.surface==='mixed'?[[item.length*.24,item.length*.33],[item.length*.66,item.length*.75]]:[];});
let cameraMode='near';
let stage=0,mode='solo',track=tracks[0],running=false,paused=false,raf=0,last=0,elapsed=0;
let countdownRemaining=0,goFlashRemaining=0,countdownShown='',finishNoticeKey='';
const BEST_LAPS_KEY='pixelGP.bestLaps.v1';
function readBestLapRecords(){try{const value=JSON.parse(localStorage.getItem(BEST_LAPS_KEY)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch(error){return {};}}
let bestLapRecords=readBestLapRecords();
function lapRecordKey(item=track){return (item.layoutVersion?item.name+'@'+item.layoutVersion:item.name)+':p'+PHYSICS_VERSION;}
function saveBestLap(trackName,time){if(!Number.isFinite(time)||time<=0)return false;const previous=bestLapRecords[trackName];if(Number.isFinite(previous)&&previous<=time)return false;bestLapRecords[trackName]=time;try{localStorage.setItem(BEST_LAPS_KEY,JSON.stringify(bestLapRecords));}catch(error){}return true;}
let keys=Object.create(null),cars=[],graphics='high',difficulty='normal',decorations=[],tireBarriers=[],checkpoints=[];
let guardrailPaths=[],physicalBarriers=[],barrierBuckets=new Map();
let barrierMode='auto',guardrailRanges=[],skidMarks=[],terrainParticles=[],trackFeatures={braking:[],passing:[]},runoffZones=[];
const runoffRasterCache=new WeakMap(),runoffBucketsCache=new WeakMap();
let backgroundCache=null,backgroundCacheKey='',trackSurfaceCache=null,trackSurfaceKey='';
let soundEnabled=true,audioContext=null,audioMaster=null,audioCompressor=null,audioNoise=null,audioResultActive=false,audioResultCue=null,lastAudioImpact=-Infinity;
const audioChannels=[],audioVoices=new Set(),audioReleasing=new WeakSet(),audioVoiceGains=new WeakMap();
function audioOutputAllowed(){return soundEnabled&&!paused&&!document.hidden&&(running||audioResultActive);}
function releaseAudioVoices(){for(const voice of audioVoices){if(audioReleasing.has(voice))continue;audioReleasing.add(voice);try{const now=audioContext.currentTime,gain=audioVoiceGains.get(voice);gain.gain.cancelScheduledValues(now);gain.gain.setTargetAtTime(.0001,now,.004);voice.stop(now+.025);}catch(e){}}}
function initAudio(){
 if(!soundEnabled)return;
 if(audioContext){if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});return;}
 const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return;
 try{
  audioContext=new AudioCtor();audioMaster=audioContext.createGain();audioCompressor=audioContext.createDynamicsCompressor();
  audioMaster.gain.value=0;audioCompressor.threshold.value=-18;audioCompressor.knee.value=12;audioCompressor.ratio.value=4;audioCompressor.attack.value=.003;audioCompressor.release.value=.15;
  audioMaster.connect(audioCompressor);audioCompressor.connect(audioContext.destination);
  audioNoise=audioContext.createBuffer(1,audioContext.sampleRate,audioContext.sampleRate);const data=audioNoise.getChannelData(0);let seed=0x51f015;
  for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/2147483648-1)*.7;}
  for(let player=0;player<2;player++){
   const engine=audioContext.createOscillator(),sub=audioContext.createOscillator(),filter=audioContext.createBiquadFilter(),gain=audioContext.createGain(),subGain=audioContext.createGain();
   engine.type='sawtooth';sub.type='triangle';filter.type='lowpass';gain.gain.value=0;subGain.gain.value=0;
   engine.connect(filter);filter.connect(gain);gain.connect(audioMaster);sub.connect(subGain);subGain.connect(audioMaster);engine.start();sub.start();
   function noiseChannel(type){const source=audioContext.createBufferSource(),band=audioContext.createBiquadFilter(),level=audioContext.createGain();source.buffer=audioNoise;source.loop=true;band.type=type;level.gain.value=0;source.connect(band);band.connect(level);level.connect(audioMaster);source.start();return {source,filter:band,gain:level};}
   audioChannels.push({engine,sub,filter,gain,subGain,skid:noiseChannel('bandpass'),terrain:noiseChannel('lowpass')});
  }
  if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
 }catch(e){try{audioContext?.close().catch(()=>{});}catch(ignored){}audioContext=null;audioMaster=null;audioCompressor=null;audioNoise=null;audioChannels.length=0;audioVoices.clear();}
}
function updateAudio(){
 if(!audioContext||!audioMaster)return;
 const now=audioContext.currentTime,allowed=audioOutputAllowed(),active=allowed&&running&&countdownRemaining<=0;
 audioMaster.gain.setTargetAtTime(allowed?.55:0,now,.015);
 if(!allowed)releaseAudioVoices();
 const humans=cars.filter(car=>!car.isAI&&!car.done),mix=1/Math.sqrt(Math.max(1,humans.length));
 audioChannels.forEach((channel,player)=>{
  const car=cars.find(candidate=>candidate.player===player&&!candidate.isAI&&!candidate.done),speed=car?.speed||0,model=CAR_MODELS[car?.model]||CAR_MODELS.balanced;
  const ratio=clamp(speed/model.maxSpeed,0,1),load=car?.braking ? .08:keys[keyFor(player).up]?1:speed>3?.38:.18;
  const band=Math.min(3,Math.floor(ratio*4)),rpm=ratio*4-band,signature=car?.model==='speed'?16:car?.model==='corner'?8:car?.model==='rally'?-6:0;
  const frequency=38+band*8+rpm*54+load*12+signature;
  const wave=car?.model==='corner'?'square':car?.model==='rally'?'triangle':'sawtooth';if(channel.engine.type!==wave)channel.engine.type=wave;
  channel.engine.frequency.setTargetAtTime(frequency,now,.065);channel.sub.frequency.setTargetAtTime(frequency/2,now,.065);
  channel.filter.frequency.setTargetAtTime(250+load*900+ratio*900,now,.08);
  const audible=active&&!!car,volume=audible?(.016+load*.018+ratio*.018)*mix:0;
  channel.gain.gain.setTargetAtTime(volume,now,.045);channel.subGain.gain.setTargetAtTime(volume*.25,now,.045);
  const ground=car?terrainAt(car.x,car.y):{material:'asphalt',offroad:false},surface=ground.material,offroad=ground.offroad;
  const sliding=car?Math.max(car.handbrake?1:0,car.drift>.4?car.drift:0,car.braking&&Math.abs(car.steer)>.3?.4:0):0;
  channel.skid.filter.frequency.setTargetAtTime(surface==='ice'?850:1450,now,.08);channel.skid.filter.Q.value=1.2;
  channel.skid.gain.gain.setTargetAtTime(audible&&speed>35?Math.min(.025,sliding*ratio*.035)*mix:0,now,.035);
  const roughness=surface==='gravel'?.025:offroad ? .018:surface==='dirt'||surface==='volcanic'?.009:surface==='grass'?.007:surface==='ice'?.002:0;
  channel.terrain.filter.frequency.setTargetAtTime(surface==='ice'?1200:offroad?650:450,now,.08);
  channel.terrain.gain.gain.setTargetAtTime(audible?roughness*ratio*mix:0,now,.06);
 });
}
function playTone(freq,duration=.1,volume=.035,delay=0,noise=false){
 if(!audioContext||!audioOutputAllowed()||audioVoices.size>=8)return;
 try{
  const now=audioContext.currentTime+delay,source=noise?audioContext.createBufferSource():audioContext.createOscillator(),gain=audioContext.createGain(),filter=noise?audioContext.createBiquadFilter():null;
  if(noise){source.buffer=audioNoise;filter.type='bandpass';filter.frequency.value=freq;source.connect(filter);filter.connect(gain);}else{source.type='sine';source.frequency.setValueAtTime(freq,now);source.connect(gain);}
  gain.gain.setValueAtTime(.0001,now);gain.gain.linearRampToValueAtTime(Math.min(volume,.08),now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);gain.connect(audioMaster);
  source.onended=()=>{source.disconnect();gain.disconnect();filter?.disconnect();audioVoices.delete(source);flushResultCue();};audioVoices.add(source);audioVoiceGains.set(source,gain);source.start(now);source.stop(now+duration+.01);
 }catch(e){}
}
function flushResultCue(){if(audioResultCue&&audioVoices.size===0){const winner=audioResultCue;audioResultCue=null;if(audioResultActive)playRaceCue('result',winner);}}
function playRaceCue(type,car=null,strength=1){
 if(!audioContext||!audioOutputAllowed())return;
 if(['checkpoint','lap','record'].includes(type)&&car?.isAI)return;
 if(type==='impact'){
  const humans=cars.filter(candidate=>!candidate.isAI),distance=car?Math.min(...humans.map(human=>Math.hypot(human.x-car.x,human.y-car.y))):Infinity;
  if(distance>170||audioContext.currentTime-lastAudioImpact<.14)return;lastAudioImpact=audioContext.currentTime;
  const volume=clamp(strength,.15,1)*(car?.isAI ? .5:1);playTone(700,.11,.055*volume,0,true);playTone(90,.09,.035*volume);return;
 }
 if(type==='finish'&&car?.isAI&&cars.some(other=>other!==car&&other.done))return;
 const pitch=car?.player===1&&!car.isAI?70:0;
 const notes=type==='countdown'?[420]:type==='go'?[660,990]:type==='checkpoint'?[660+pitch]:type==='record'?[784,988,1175]:type==='lap'?[620+pitch,880+pitch]:type==='finish'?[car?.isAI?520:1040]:type==='result'?(car?.isAI?[440,392]:[784,988,1175]):[];
 notes.forEach((freq,index)=>playTone(freq,type==='result' ? .18:.1,type==='checkpoint' ? .025:type==='finish'&&car?.isAI ? .025:.045,index*.1));
}
let championship={player1:0,player2:0,rival:0},roundsCompleted=0;
function resetChampionship(){
 championship={player1:0,player2:0,rival:0};roundsCompleted=0;
}
function carName(car){return car.isAI?(AI_PERSONALITIES[car.personality]?.name||'CPU'):'P'+(car.player+1);}
function scoreKey(car){return car.isAI?(car.player===1?'rival':'rival'+car.player):'player'+(car.player+1);}
function raceClassification(){
 return [...cars].sort((a,b)=>a.done!==b.done?(a.done?-1:1):a.done?(a.finishTime-b.finishTime||a.player-b.player):(b.raceProgress-a.raceProgress||a.player-b.player));
}
function racePoints(car,index){return car.done?([25,18,15,12][index]||0):0;}
function awardPoints(){
 raceClassification().forEach((car,index)=>{const key=scoreKey(car);championship[key]=(championship[key]||0)+racePoints(car,index);});
 roundsCompleted++;
}
function seasonStandings(){
 const sorted=[...cars].sort((a,b)=>(championship[scoreKey(b)]||0)-(championship[scoreKey(a)]||0)||a.player-b.player);
 let rank=0,previous=null;
 return sorted.map((car,index)=>{const points=championship[scoreKey(car)]||0;if(points!==previous)rank=index+1;previous=points;return {car,points,rank};});
}
function standingsText(){
 return 'CAMPEONATO · '+seasonStandings().map(({car,points})=>carName(car)+' '+points+' PTS').join(' · ');
}
function renderResults(classification){
 const raceScores=new Map(classification.map((car,index)=>[scoreKey(car),racePoints(car,index)]));
 const pilot=car=>'<span class="result-pilot"><i style="--pilot-color:'+car.color+'" aria-hidden="true"></i>'+carName(car)+(car.isAI?'':'<small>HUMANO</small>')+'</span>';
 const winner=classification[0];
 $('raceRows').innerHTML=classification.map((car,index)=>{
  const laps=car.lapTimes.filter(time=>Number.isFinite(time)&&time>0),best=laps.length?format(Math.min(...laps)):'—';
  const time=car.done&&Number.isFinite(car.finishTime)?format(car.finishTime):'SIN TERMINAR';
  const gap=car.done&&Number.isFinite(car.finishTime)&&Number.isFinite(winner.finishTime)?(index===0?'GANADOR':'+'+format(Math.max(0,car.finishTime-winner.finishTime))):Math.min(car.lap,LAPS_TO_WIN)+' / '+LAPS_TO_WIN+' VUELTAS';
  return '<tr'+(car.isAI?'':' class="human-result"')+'><td>'+(index+1)+'.º</td><th scope="row">'+pilot(car)+'</th><td class="race-time">'+time+'<small>'+gap+'</small></td><td>'+best+'</td><td class="earned-points">+'+raceScores.get(scoreKey(car))+'</td></tr>';
 }).join('');
 $('seasonRows').innerHTML=seasonStandings().map(({car,points,rank})=>'<tr'+(car.isAI?'':' class="human-result"')+'><td>'+rank+'.º</td><th scope="row">'+pilot(car)+'</th><td class="earned-points">+'+raceScores.get(scoreKey(car))+'</td><td class="total-points">'+points+'</td></tr>').join('');
 $('raceCaption').textContent=track.name+' · '+LAPS_TO_WIN+' VUELTAS';
 $('seasonCaption').textContent='CAMPEONATO · '+roundsCompleted+' '+(roundsCompleted===1?'CARRERA DISPUTADA':'CARRERAS DISPUTADAS');
}
const wrapDistance=d=>((d%track.length)+track.length)%track.length;
function surfaceAtProgress(distance,item=track){
 const d=((distance%item.length)+item.length)%item.length;
 if(item.surface==='mixed')return (item.dirtRanges||[]).some(([start,end])=>d>=start&&d<=end)?'dirt':'asphalt';
 if(item.surface==='coastal'&&d>=item.length*.31&&d<=item.length*.37)return 'dirt';
 return item.surface||'asphalt';
}
function roadHalfWidthAt(progress,item=track){const surface=surfaceAtProgress(progress,item);return surface==='asphalt'||surface==='coastal'?ROAD_SHOULDER:ROAD_EDGE;}
// One world-material query drives handling, resistance, particles, audio and the gravel raster.
function terrainAt(x,y,loc=nearestOnTrack(x,y)){
 const road=surfaceAtProgress(loc.progress),paved=road==='asphalt'||road==='coastal';
 const shoulder=roadHalfWidthAt(loc.progress),depth=Math.max(0,loc.distance-shoulder);
 if(depth===0)return {material:road,offroad:false,depth:0};
 const native=track.surface==='dirt'?'dirt':track.surface==='ice'?'ice':track.surface==='volcanic'?'volcanic':track.surface==='coastal'?'coastal':'grass';
 if(paved&&x>=0&&y>=0&&x<track.worldWidth&&y<track.worldHeight&&!guardrailActive(loc.progress)){
  for(const zone of runoffZones){
   const delta=Math.abs(wrapDistance(loc.progress-zone.center+track.length/2)-track.length/2);
   const width=zone.width*clamp((zone.halfLength-delta)/35,0,1);
   if(Math.sign(loc.offset)===zone.side&&depth<=width)return {material:'gravel',offroad:true,depth};
  }
 }
 return {material:native,offroad:true,depth};
}
function buildRunoffZones(){
 if(!['asphalt','mixed','coastal'].includes(track.surface))return [];
 const corners=[...new Map(trackFeatures.braking.map(corner=>[corner.cornerProgress,corner])).values()];
 return corners.map(corner=>({center:corner.cornerProgress,halfLength:150,side:-Math.sign(corner.turn),width:GRAVEL_WIDTH}));
}
function runoffBuckets(){
 if(runoffBucketsCache.has(track))return runoffBucketsCache.get(track);
 const buckets=new Map(),pad=ROAD_SHOULDER+GRAVEL_WIDTH+12,s=track.samples;
 for(let i=0;i<s.length;i++){
  const a=s[i],b=s[(i+1)%s.length];
  for(let row=Math.floor((Math.min(a.y,b.y)-pad)/128);row<=Math.floor((Math.max(a.y,b.y)+pad)/128);row++)for(let column=Math.floor((Math.min(a.x,b.x)-pad)/128);column<=Math.floor((Math.max(a.x,b.x)+pad)/128);column++){
   const key=column+','+row;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(i);
  }
 }
 runoffBucketsCache.set(track,buckets);return buckets;
}
function runoffRaster(){
 let profiles=runoffRasterCache.get(track);if(!profiles){profiles=new Map();runoffRasterCache.set(track,profiles);}
 if(profiles.has(barrierMode))return profiles.get(barrierMode);
 const cells=[];profiles.set(barrierMode,cells);
 if(!runoffZones.length||barrierMode==='full')return cells;
 const columns=Math.ceil(track.worldWidth/RUNOFF_CELL),rows=Math.ceil(track.worldHeight/RUNOFF_CELL),seen=new Uint8Array(columns*rows);
 const pad=ROAD_SHOULDER+GRAVEL_WIDTH+12,buckets=runoffBuckets();
 for(const zone of runoffZones)for(let d=zone.center-zone.halfLength;d<=zone.center+zone.halfLength;d+=12){
  const p=sampleAt(d),left=Math.max(0,Math.floor((p.x-pad)/RUNOFF_CELL)),right=Math.min(columns-1,Math.ceil((p.x+pad)/RUNOFF_CELL));
  const top=Math.max(0,Math.floor((p.y-pad)/RUNOFF_CELL)),bottom=Math.min(rows-1,Math.ceil((p.y+pad)/RUNOFF_CELL));
  for(let row=top;row<=bottom;row++)for(let column=left;column<=right;column++){
   const key=row*columns+column;if(seen[key])continue;seen[key]=1;
   const x=column*RUNOFF_CELL,y=row*RUNOFF_CELL;
   const cx=x+RUNOFF_CELL/2,cy=y+RUNOFF_CELL/2,indices=buckets.get(Math.floor(cx/128)+','+Math.floor(cy/128))||[];
   const loc=nearestOnTrack(cx,cy,indices);
   if(!loc||loc.distance>ROAD_SHOULDER+GRAVEL_WIDTH||terrainAt(cx,cy,loc).material!=='gravel')continue;
   let seed=Math.imul(column,374761393)+Math.imul(row,668265263);seed=Math.imul(seed^(seed>>>13),1274126177);
   const tone=((seed^(seed>>>16))>>>0)%4;
   cells.push({x,y,tone});
  }
 }
 return cells;
}
function drawRunoff(context){
 const palette=TERRAIN_MATERIALS.gravel.palette,cells=runoffRaster();
 for(let tone=0;tone<palette.length;tone++){context.fillStyle=palette[tone];for(const cell of cells)if(cell.tone===tone)context.fillRect(cell.x,cell.y,RUNOFF_CELL,RUNOFF_CELL);}
}
function sampleAt(distance,item=track){
 const d=((distance%item.length)+item.length)%item.length,s=item.samples;let lo=0,hi=s.length-1;
 while(lo<hi){const mid=(lo+hi+1)>>1;if(s[mid].d<=d)lo=mid;else hi=mid-1;}
 const a=s[lo],b=s[(lo+1)%s.length],seg=pointDistance(a,b)||1;
 const t=clamp((d-a.d)/seg,0,1);
 return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,angle:Math.atan2(b.y-a.y,b.x-a.x)};
}
function nearestOnTrack(x,y,indices=null){
 const s=track.samples;let best=Infinity,found=null;
 for(let step=0;step<(indices?indices.length:s.length);step++){
  const i=indices?indices[step]:step;
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
 const incomingSpeed=car.speed;let hit=false,impactFactor=1;
 for(let pass=0;pass<4;pass++){
  let deepest=null;
  const hx=Math.cos(car.heading)*5,hy=Math.sin(car.heading)*5;
  for(const barrier of barrierBuckets.get(Math.floor(car.x/32)+','+Math.floor(car.y/32))||[]){
   const contact=closestSegments({x:car.x-hx,y:car.y-hy},{x:car.x+hx,y:car.y+hy},barrier.a,barrier.b);
   const distance=Math.sqrt(contact.distanceSq),depth=CAR_HALF_WIDTH+barrier.radius-distance;
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
 if(hit&&car.flash<=0){if(incomingSpeed>8&&impactFactor<.99)playRaceCue('impact',car,clamp(incomingSpeed*(1-impactFactor)/150,.15,1));car.flash=.12;}
 return hit;
}

function checkpointsForTrack(item=track){
 const result=[];
 const count=clamp(Math.ceil(item.length/650)-1,3,9);
 for(let i=1;i<=count;i++){const progress=item.length*i/(count+1),p=sampleAt(progress,item);result.push({id:i,progress,x:p.x,y:p.y,angle:p.angle,halfWidth:roadHalfWidthAt(progress,item)});}
 return result;
}
function drawCheckpoints(context){
 for(const gate of checkpoints){
  const p=sampleAt(gate.progress),halfWidth=gate.halfWidth;
  context.save();context.translate(p.x,p.y);context.rotate(p.angle);
  context.fillStyle='#0b1226d9';context.fillRect(-4,-halfWidth,8,halfWidth*2);
  for(let j=0;j<10;j++){context.fillStyle=j%2?'#d7ff38':'#f6f7ff';context.fillRect(-4,j*(halfWidth*2/10)-halfWidth,8,halfWidth*2/10);}
  context.restore();
  context.fillStyle='#111725e8';context.fillRect(p.x-13,p.y-halfWidth-19,26,15);
  context.fillStyle='#d7ff38';context.font='bold 10px monospace';context.textAlign='center';context.fillText('CP'+gate.id,p.x,p.y-halfWidth-8);
 }
}
function updateGaragePreview(){
 const id=$('carModel')?.value||'balanced',paint=CAR_PAINTS[$('carColor')?.value||'pink']||CAR_PAINTS.pink;
 const car=CAR_MODELS[id]||CAR_MODELS.balanced,preview=$('garageSummary');
 if(!preview)return;
 preview.innerHTML='<span class="paint-dot" style="background:'+paint.hex+'"></span><strong>'+car.name+'</strong><span>'+Math.round(car.maxSpeed)+' KM/H MAX</span><span>AGARRE '+Math.round(car.grip*100)+'%</span><small>'+car.description+'</small>';
 preview.style.setProperty('--car-paint',paint.hex);
 const image=$('carPreview'),context=image.getContext('2d'),width=image.width||480,height=image.height||180;
 context.setTransform(1,0,0,1,0,0);context.clearRect(0,0,width,height);context.fillStyle='#0c1727';context.fillRect(0,0,width,height);
 context.fillStyle=paint.hex+'18';context.beginPath();context.ellipse(width/2,height/2+8,110,48,0,0,Math.PI*2);context.fill();
 context.save();context.translate(width/2,height/2);context.rotate(-.16);context.scale(5,5);drawCarBody(context,{model:id,color:paint.hex,steer:0,braking:false,wheelTravel:0,done:false,flash:0,offroad:0});context.restore();
 image.setAttribute('aria-label',car.name+', pintura '+paint.name);
}
function updateMenuPreview(){
 const index=clamp(Math.trunc(Number($('stageSelect').value)||0),0,tracks.length-1),item=tracks[index],preview=$('trackPreview'),context=preview.getContext('2d');
 const width=preview.width||640,height=preview.height||360,scale=Math.min((width-44)/item.worldWidth,(height-44)/item.worldHeight);
 context.setTransform(1,0,0,1,0,0);context.clearRect(0,0,width,height);context.fillStyle='#0c1727';context.fillRect(0,0,width,height);
 context.save();context.translate((width-item.worldWidth*scale)/2,(height-item.worldHeight*scale)/2);context.scale(scale,scale);context.lineJoin='round';context.lineCap='round';
 context.beginPath();context.moveTo(item.samples[0].x,item.samples[0].y);for(const point of item.samples.slice(1))context.lineTo(point.x,point.y);context.closePath();
 context.strokeStyle='#1d3447';context.lineWidth=ROAD_EDGE*2+10;context.stroke();context.strokeStyle='#667f8e';context.lineWidth=ROAD_EDGE*2-10;context.stroke();
 context.strokeStyle=item.accent;context.lineWidth=3;context.setLineDash([14,20]);context.stroke();context.setLineDash([]);
 const gates=checkpointsForTrack(item);for(const gate of gates){context.fillStyle='#d7ff38';context.beginPath();context.arc(gate.x,gate.y,7/scale,0,Math.PI*2);context.fill();}
 const start=sampleAt(0,item);context.save();context.translate(start.x,start.y);context.rotate(start.angle);
 const previewHalfWidth=roadHalfWidthAt(0,item);
 for(let i=0;i<8;i++){context.fillStyle=i%2?'#f3f6ed':'#111c2c';context.fillRect(-6,-previewHalfWidth+i*previewHalfWidth/4,12,previewHalfWidth/4);}
 context.fillStyle='#39e8e8';context.beginPath();context.moveTo(40,0);context.lineTo(20,-10);context.lineTo(20,10);context.closePath();context.fill();context.restore();context.restore();
 const requested=$('barrierMode').value||'auto',profile=requested==='auto'?item.defaultBarriers:requested;
 const barrierNames={open:'ABIERTO · ESCAPATORIAS',full:'VALLAS COMPLETAS',half:'VALLAS PARCIALES',corners:'PROTECCIÓN EN CURVAS'};
 const count=clamp(Number($('opponentCount').value)||3,1,3),difficultyName={easy:'FÁCIL',normal:'NORMAL',hard:'DIFÍCIL'}[$('difficulty').value]||'NORMAL';
 $('menuTrackCount').textContent=tracks.length;$('previewTrackName').textContent=String(index+1).padStart(2,'0')+' · '+item.name;
 $('previewRouteInfo').textContent=LAPS_TO_WIN+' VUELTAS · '+gates.length+' CHECKPOINTS';$('previewBarriers').textContent=barrierNames[profile];
 const record=bestLapRecords[lapRecordKey(item)];$('previewRecord').textContent=record?format(record):'--:--.-';
 $('raceSummary').textContent=LAPS_TO_WIN+' VUELTAS · '+count+' '+(count===1?'RIVAL CPU':'RIVALES CPU')+' · '+difficultyName;
 $('opponentSummary').textContent=['racer','attacker','precise'].slice(0,count).map(id=>AI_PERSONALITIES[id].name+' · '+AI_PERSONALITIES[id].description).join(' / ');
 $('soloStartLabel').textContent='CORRER VS '+count+' CPU';preview.setAttribute('aria-label',item.name+', '+gates.length+' checkpoints, '+barrierNames[profile]);
}
const SCENERY_CLEARANCE=124;
const SCENERY_THEMES={
 park:{kinds:['tree','tree','tent','stands'],leaf:'#327951',light:'#71a66a',stone:'#88917c',roof:'#3cbab5',ground:'#4c694a'},
 harbor:{kinds:['container','warehouse','crane'],leaf:'#275c59',light:'#6ab6af',stone:'#5e7580',roof:'#3cbab5',ground:'#53766e'},
 desert:{kinds:['cactus','mesa','rock'],leaf:'#49704d',light:'#8b9b62',stone:'#99704c',roof:'#d29b61',ground:'#d0ad71'},
 night:{kinds:['building','building','tent'],leaf:'#25384f',light:'#8194b7',stone:'#34455f',roof:'#b85c8c',ground:'#34465d'},
 snow:{kinds:['pine','pine','cabin','rock'],leaf:'#367f75',light:'#e3f3ef',stone:'#b3cece',roof:'#d4eeee',ground:'#a9c7bd'},
 jungle:{kinds:['canopy','canopy','rock','tent'],leaf:'#196044',light:'#4d925d',stone:'#6d8170',roof:'#aeaa65',ground:'#2a6345'},
 volcano:{kinds:['basalt','basalt','rock'],leaf:'#563d45',light:'#c96545',stone:'#51434e',roof:'#bf6146',ground:'#59444a'},
 city:{kinds:['building','warehouse','tent'],leaf:'#347269',light:'#7fa29a',stone:'#435669',roof:'#43ada8',ground:'#4e786e'},
 valley:{kinds:['pine','rock','tree'],leaf:'#326858',light:'#78a088',stone:'#7c898e',roof:'#749e89',ground:'#4e7462'},
 stadium:{kinds:['stands','stands','tent','tree'],leaf:'#3f7955',light:'#81aa64',stone:'#738484',roof:'#398a97',ground:'#547453'},
 coast:{kinds:['palm','palm','rock','tent'],leaf:'#246b57',light:'#61a778',stone:'#d2c59b',roof:'#4ab6bd',ground:'#baad7a'},
 canyon:{kinds:['mesa','rock','cactus','tent'],leaf:'#69764b',light:'#9ba36c',stone:'#a07b56',roof:'#d3915c',ground:'#b09365'},
 meadow:{kinds:['tree','flowers','flowers','tent'],leaf:'#397b45',light:'#8bb967',stone:'#8c9779',roof:'#cfb76c',ground:'#648751'},
 industrial:{kinds:['container','tank','crane','warehouse'],leaf:'#41685e',light:'#9eb1a8',stone:'#607076',roof:'#bc9860',ground:'#657565'}
};
const TRACK_SCENERY=['park','harbor','desert','night','snow','jungle','volcano','city','valley','stadium','coast','canyon','meadow','industrial'];
const sceneryCache=new WeakMap();
function sceneryRandom(x,y,salt=0){
 let value=Math.imul(x+stage*131+salt*977,374761393)^Math.imul(y+salt*37,668265263);
 value=Math.imul(value^(value>>>13),1274126177);return ((value^(value>>>16))>>>0)/4294967296;
}
function decorationsForTrack(){
 let cached=sceneryCache.get(track);if(!cached){cached=new Map();sceneryCache.set(track,cached);}
 if(cached.has(graphics))return cached.get(graphics);
 const list=[],candidates=[],theme=SCENERY_THEMES[TRACK_SCENERY[stage]],density=graphics==='high'?.86:graphics==='retro'?.63:.4;
 for(let row=0,y=38;y<track.worldHeight-38;row++,y+=48)for(let col=0,x=38;x<track.worldWidth-38;col++,x+=50){
  if(sceneryRandom(col,row)>density)continue;
  const px=x+(sceneryRandom(col,row,1)-.5)*28,py=y+(sceneryRandom(col,row,2)-.5)*28;
  const kind=theme.kinds[Math.floor(sceneryRandom(col,row,3)*theme.kinds.length)];
  const large=['stands','warehouse','crane','tank'].includes(kind);
  const size=(large?14:8)+sceneryRandom(col,row,4)*6,radius=size*2.2+4;
  if(px-radius<0||py-radius<0||px+radius>track.worldWidth||py+radius>track.worldHeight)continue;
  // Exact segment distance, including the full object/shadow footprint and recovery lane.
  if(nearestOnTrack(px,py).distance<SCENERY_CLEARANCE+radius)continue;
  candidates.push({x:px,y:py,kind,size,radius,large,variant:sceneryRandom(col,row,5),theme:TRACK_SCENERY[stage]});
 }
 // Give larger landmarks room before filling gaps with vegetation.
 candidates.sort((a,b)=>Number(b.large)-Number(a.large));
 for(const item of candidates)if(!list.some(other=>Math.hypot(other.x-item.x,other.y-item.y)<other.radius+item.radius+5))list.push(item);
 list.sort((a,b)=>a.y-b.y);cached.set(graphics,list);return list;
}
function drawSceneryObject(context,d){
 const palette=SCENERY_THEMES[d.theme],s=d.size,detail=graphics==='high';
 context.save();context.translate(d.x,d.y);
 const rect=(x,y,w,h,color)=>{context.fillStyle=color;context.fillRect(x*s,y*s,w*s,h*s);};
 const poly=(points,color)=>{context.fillStyle=color;context.beginPath();points.forEach(([x,y],i)=>i?context.lineTo(x*s,y*s):context.moveTo(x*s,y*s));context.closePath();context.fill();};
 const oval=(x,y,rx,ry,color)=>{context.fillStyle=color;context.beginPath();context.ellipse(x*s,y*s,rx*s,ry*s,0,0,Math.PI*2);context.fill();};
 // All scenery is static, cached and beyond the recovery strip; shadows stay bounded.
 if(graphics!=='lite'){
  if(detail)oval(0,0,1.65,.8,palette.ground);
  oval(.3,.35,1.35,.52,'#08132030');
 }
 if(['tree','canopy','palm','pine','cactus'].includes(d.kind)){
  rect(-.12,-.3,.24,1.05,'#5b4936');
  if(d.kind==='palm'){
   poly([[-.1,.6],[.12,.6],[.3,-.85],[.1,-.9]],'#8c7250');
   for(let i=0;i<6;i++){const a=i*Math.PI/3+d.variant;poly([[.2,-.8],[.2+Math.cos(a)*1.65,-.8+Math.sin(a)*.9],[.2+Math.cos(a+.4)*.9,-.8+Math.sin(a+.4)*.6]],i%2?palette.leaf:palette.light);}
  }else if(d.kind==='pine'){
   poly([[0,-1.75],[-1.05,.55],[1.05,.55]],palette.leaf);
   poly([[0,-1.75],[-.8,-.1],[.65,-.2]],palette.light);
   if(detail)poly([[-.6,.1],[-.86,.5],[.8,.5],[.5,.15]],d.theme==='snow'?'#d3e8e5':palette.light);
  }else if(d.kind==='cactus'){
   rect(-.2,-1.4,.4,2,palette.leaf);rect(-.85,-.65,.7,.25,palette.leaf);rect(-.85,-1,.25,.5,palette.leaf);rect(.15,-.2,.6,.25,palette.leaf);rect(.5,-.6,.25,.6,palette.leaf);rect(-.1,-1.3,.1,1.7,palette.light);
   if(detail){oval(-.65,.65,.4,.15,palette.stone);rect(.02,-1.55,.16,.2,'#e6c16d');}
  }else{
   oval(0,-.55,1.1,1,palette.leaf);oval(-.43,-.9,.72,.7,palette.light);oval(.6,-.5,.65,.72,palette.leaf);
   if(d.kind==='canopy'){oval(.1,-1.3,.68,.52,palette.light);rect(-.04,-1.45,.09,.7,'#75a865');}
   if(detail){oval(-.55,-1.1,.22,.15,'#a5c87555');rect(.1,-.15,.1,.25,'#b3c38855');}
  }
 }else if(['rock','mesa','basalt'].includes(d.kind)){
  poly([[-1.15,.4],[-.9,-.6],[-.25,-1.05],[.65,-.9],[1.2,.1],[.8,.6]],palette.stone);
  poly([[-.9,-.6],[-.25,-1.05],[.65,-.9],[.5,-.15],[-.4,-.05]],d.kind==='basalt'?'#70606a':d.theme==='snow'?'#e7f3f1':palette.roof);
  poly([[.5,-.15],[.65,-.9],[1.2,.1],[.8,.6]],'#15252d3a');
  if(d.kind==='mesa'){rect(-.6,-.55,1.05,.16,'#d6af79');rect(-.85,.15,1.8,.12,'#6c513d');}
  if(d.kind==='basalt'){poly([[-.6,-.2],[-.1,-.1],[.05,.2],[.6,.3],[.2,.38],[-.2,.08]],'#e27b4b');if(detail)rect(-.05,-.13,.12,.17,'#ffc06b');}
 }else if(d.kind==='flowers'){
  oval(0,0,1.25,.65,palette.leaf);
  for(let i=0;i<(detail?12:6);i++){const a=i*2.4,r=.3+(i%3)*.32;rect(Math.cos(a)*r,Math.sin(a)*r*.55,.13,.13,i%3===0?'#f1d780':i%3===1?'#dddab9':'#d88ca2');}
 }else if(d.kind==='tent'){
  rect(-1,.1,2,.65,'#273f4c');poly([[-1.25,.1],[0,-1.05],[1.25,.1]],palette.roof);poly([[0,-1.05],[0,.1],[1.25,.1]],'#ffffff35');rect(-.3,.25,.6,.5,'#172c39');
  if(detail){rect(-1.2,.65,2.4,.12,'#c6c7a3');rect(.75,-.9,.07,1.7,'#263b3d');rect(.82,-.9,.5,.25,track.accent);}
 }else if(d.kind==='stands'){
  rect(-1.45,-.8,2.9,1.65,'#334554');rect(-1.5,-1.1,3,.45,palette.roof);
  for(let row=0;row<3;row++){rect(-1.3,-.45+row*.4,2.6,.15,'#7b8d96');if(graphics!=='lite')for(let col=0;col<8;col++)rect(-1.25+col*.34,-.56+row*.4,.12,.13,['#d7dbb6',track.accent,'#de9f86','#76b9b0'][(col+row)%4]);}
  rect(-1.5,.85,3,.14,'#182735');if(detail){rect(-1.35,-.68,.08,1.5,'#a6b6ac');rect(1.25,-.68,.08,1.5,'#a6b6ac');}
 }else if(d.kind==='container'){
  rect(-1.35,-.6,2.7,1.25,'#273844');rect(-1.35,-.85,2.7,1.05,palette.roof);rect(-1.35,.2,2.7,.25,'#142b3a55');
  if(graphics!=='lite')for(let i=0;i<8;i++)rect(-1.2+i*.32,-.75,.05,.8,'#d4dfcf55');rect(.75,-.55,.35,.2,track.accent);
 }else if(d.kind==='crane'){
  rect(-.7,.3,1.4,.65,'#354750');rect(-.15,-1.6,.3,2,'#d5af59');rect(-1.4,-1.7,2.9,.25,'#dabd6e');
  poly([[-1.3,-1.45],[0,-2],[1.4,-1.45],[.9,-1.45],[0,-1.8],[-.8,-1.45]],'#796e4b');rect(1.1,-1.4,.06,1.1,'#263e47');rect(.98,-.35,.3,.25,'#d6b863');
  if(detail)for(let i=0;i<4;i++)rect(-.13,-1.3+i*.4,.26,.08,'#394b4d');
 }else if(d.kind==='tank'){
  rect(-1,-.5,2,1.3,'#3f515a');oval(0,.8,1,.4,'#31434d');oval(0,-.5,1,.48,'#c0c9bf');oval(-.1,-.55,.7,.3,'#91a59f');rect(-.12,-.6,.24,.2,palette.roof);
  if(detail){rect(-.8,.05,1.6,.12,'#ddb363');rect(.65,-.35,.09,1.2,'#b2c0b7');}
 }else{
  const tower=d.kind==='building';
  rect(-1,-.7,2,1.5,palette.stone);rect(-1,-1.1,2,1.2,palette.roof);poly([[-1,-1.1],[-.65,-1.45],[1.3,-1.45],[1,-1.1]],palette.light);poly([[1,-1.1],[1.3,-1.45],[1.3,.4],[1,.8]],'#1b2c3b');
  if(d.kind==='cabin'){poly([[-1.2,-1.1],[0,-1.9],[1.2,-1.1]],palette.roof);rect(-.3,.15,.6,.65,'#496263');}
  const windows=detail?4:2;for(let i=0;i<windows;i++)rect(-.8+i*1.6/windows,-.48,.2,.25,tower?track.accent:'#b3c8ba');
  if(detail&&tower){rect(-.2,-1.5,.12,.4,'#263649');rect(-.6,-.95,1.1,.12,track.accent);}
  if(detail&&d.kind==='warehouse'){rect(-.45,-.05,.9,.75,'#344e56');for(let i=0;i<4;i++)rect(-.4,.05+i*.16,.8,.04,'#799293');}
 }
 context.restore();
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
   strokeTrack(sc,'#11171c',96);strokeTrack(sc,'#cdd1d3',94,[18,18],0);strokeTrack(sc,'#d84b59',90,[12,24],0);strokeTrack(sc,'#282d37',84);strokeTrack(sc,'#e74b5d',82,[23,23],0);strokeTrack(sc,'#f5f0dc',82,[23,23],23);strokeTrack(sc,'#3c414c',74);strokeTrack(sc,graphics==='high'?'#707783':'#646873',68);strokeTrack(sc,'#2c313b',61);
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
  x:0,y:0,heading:0,yawRate:0,speed:0,steer:0,drift:0,handbrake:false,braking:false,wheelTravel:0,done:false,finishTime:null,newBestLap:false,
  progress:0,previousProgress:0,lap:0,lapTimes:[],lapStartTime:0,raceProgress:0,offroad:0,roadOffset:0,particles:[],flash:0};
}
function placeCar(car,progress,lateral){
 const p=sampleAt(progress),nx=-Math.sin(p.angle),ny=Math.cos(p.angle);
 car.x=p.x+nx*lateral;car.y=p.y+ny*lateral;car.heading=p.angle;car.yawRate=0;car.braking=false;car.wheelTravel=0;
 car.progress=wrapDistance(progress);car.previousProgress=car.progress;car.raceProgress=car.progress;
 car.nextCheckpoint=0;car.checkpointPasses=0;car.lastCheckpointTime=0;car.aiManeuver=null;car.aiTrafficStates={};car.aiLane=lateral;
}
function start(m,s=Number($('stageSelect').value),keepSeason=false){
 if(!keepSeason)resetChampionship();
 mode=m;stage=s;track=tracks[stage];$('stageSelect').value=String(stage);audioResultActive=false;audioResultCue=null;lastAudioImpact=-Infinity;releaseAudioVoices();graphics=$('graphics').value;difficulty=$('difficulty').value;
 backgroundCache=null;backgroundCacheKey='';trackSurfaceCache=null;trackSurfaceKey='';checkpoints=checkpointsForTrack();aiSpeedPlan=buildAiSpeedPlan();
 cars=[setupCar(0)];
 if(mode==='solo'){const count=clamp(Number($('opponentCount').value)||3,1,3);for(let i=1;i<=count;i++)cars.push(setupCar(i,true));}else cars.push(setupCar(1));
 placeCar(cars[0],4,mode==='duo'?-18:-15);
 cars.slice(1).forEach((car,index)=>placeCar(car,mode==='solo'?78+index*70:4,mode==='solo'?(index%2?-16:16):18));
 const requestedBarrierMode=$('barrierMode')?.value||'auto';barrierMode=requestedBarrierMode==='auto'?track.defaultBarriers:requestedBarrierMode;guardrailRanges=guardrailRangesForTrack();trackFeatures=buildTrackFeatures();runoffZones=buildRunoffZones();
 decorations=decorationsForTrack();tireBarriers=barriersForTrack();buildPhysicalBarriers();skidMarks=[];terrainParticles=[];elapsed=0;finishNoticeKey='';countdownRemaining=3;goFlashRemaining=0;countdownShown='';paused=false;running=true;keys=Object.create(null);
 document.body.classList.add('racing');menu.classList.add('hidden');result.classList.add('hidden');game.classList.remove('hidden');
 $('pauseBtn').textContent='Ⅱ PAUSA';$('pauseBtn').setAttribute('aria-pressed','false');
 $('views').classList.toggle('pixelated',graphics==='retro');$('views').classList.toggle('performance',graphics==='lite');
 $('trackName').textContent=track.name;$('stageLabel').textContent=String(stage+1).padStart(2,'0');if($('trackCount'))$('trackCount').textContent=String(tracks.length).padStart(2,'0');
 $('helpText').textContent=mode==='duo'?'P1 WASD + ESPACIO · P2 FLECHAS + ENTER':'W acelerar · S frenar · A/D girar · ESPACIO freno de mano';
 updateCameraButton();$('status').textContent='PREPARADOS...';updateTelemetry();resize();canvas.focus({preventScroll:true});initAudio();updateAudio();cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop);
}
for(let i=0;i<tracks.length;i++){const o=document.createElement('option');o.value=i;o.textContent=String(i+1).padStart(2,'0')+' — '+tracks[i].name+(tracks[i].length>3900?' · GP LARGO':'');$('stageSelect').append(o);}
function keyFor(i){return i===0?{up:'w',down:'s',left:'a',right:'d',hand:' '}:{up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright',hand:'enter'};}
window.addEventListener('keydown',e=>{
 if(!running||['SELECT','INPUT','TEXTAREA'].includes(e.target?.tagName))return;
 const k=e.key.toLowerCase();if(paused&&e.target?.tagName==='BUTTON'&&['enter',' '].includes(k))return;
 if(['arrowup','arrowdown','arrowleft','arrowright',' ','enter'].includes(k))e.preventDefault();
 keys[k]=true;if(k==='escape'&&!e.repeat&&running)togglePause();if(k==='r'&&!e.repeat&&running)start(mode,stage,true);if(k==='c'&&!e.repeat&&running)toggleCamera();
});
window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
window.addEventListener('blur',()=>{keys=Object.create(null);});
function togglePause(){
 if(!running)return;paused=!paused;keys=Object.create(null);cancelAnimationFrame(raf);
 $('pauseBtn').textContent=paused?'▶ SEGUIR':'Ⅱ PAUSA';$('pauseBtn').setAttribute('aria-pressed',String(paused));
 if(paused){$('status').textContent='PAUSA — ESC PARA SEGUIR';$('status').classList.remove('checkered-status');}
 else if(raceFinishState().finishers.length)updateFinishFeedback(true);
 else $('status').textContent='¡A FONDO!';
 updateAudio();drawFrame();if(!paused){last=performance.now();raf=requestAnimationFrame(loop);}
}
function gateCrossed(gate,fromX,fromY,toX,toY,heading){
 const tx=Math.cos(gate.angle),ty=Math.sin(gate.angle),nx=-ty,ny=tx;
 const before=(fromX-gate.x)*tx+(fromY-gate.y)*ty;
 const after=(toX-gate.x)*tx+(toY-gate.y)*ty;
 const crosses=before<0&&after>=0,t=crosses?-before/(after-before):0;
 const crossX=fromX+(toX-fromX)*t,crossY=fromY+(toY-fromY)*t;
 const lateral=(crossX-gate.x)*nx+(crossY-gate.y)*ny;
 const forward=Math.cos(wrapAngle(heading-gate.angle))>.12;
 return crosses&&Math.abs(lateral)<=(gate.halfWidth??ROAD_EDGE)+CAR_HALF_WIDTH&&forward;
}
function updateProgress(car,loc,fromX,fromY){
 const old=car.progress,newP=loc.progress,delta=newP-old;
 const finishGate=sampleAt(0);
 const finish={x:finishGate.x,y:finishGate.y,angle:finishGate.angle,halfWidth:roadHalfWidthAt(0)};
 for(let tries=0;tries<checkpoints.length;tries++){
  const gate=checkpoints[car.nextCheckpoint];
  if(gate&&gateCrossed(gate,fromX,fromY,car.x,car.y,car.heading)){
   car.checkpointPasses++;car.nextCheckpoint=(car.nextCheckpoint+1)%checkpoints.length;
   car.lastCheckpointTime=elapsed;playRaceCue('checkpoint',car);
  }else break;
 }
 if(gateCrossed(finish,fromX,fromY,car.x,car.y,car.heading)&&car.checkpointPasses===checkpoints.length){
  const lapTime=elapsed-car.lapStartTime;
  car.lapTimes.push(lapTime);
  const improved=!car.isAI&&saveBestLap(lapRecordKey(),lapTime);if(improved)car.newBestLap=true;
  car.lapStartTime=elapsed;car.lap++;car.checkpointPasses=0;car.nextCheckpoint=0;
  playRaceCue(car.lap>=LAPS_TO_WIN?'finish':improved?'record':'lap',car);
 }
 car.previousProgress=old;car.progress=newP;car.raceProgress=car.lap*track.length+newP;
 car.offroad=Math.abs(loc.offset);car.roadOffset=loc.offset;car.nearest=loc;
 if(car.lap>=LAPS_TO_WIN&&!car.done){car.done=true;car.finishTime=elapsed;car.speed=0;car.braking=false;}
}
// Difficulty changes driving decisions, never the vehicle specifications.
const AI_DRIVERS={
 easy:{pace:.82,brakingMargin:.62,response:5.8,laneSpeed:15,handbrake:false},
 normal:{pace:.97,brakingMargin:.90,response:7.5,laneSpeed:22,handbrake:true},
 hard:{pace:1,brakingMargin:.98,response:9.2,laneSpeed:28,handbrake:true}
};
const AI_PERSONALITIES={
 racer:{name:'TRAZO',description:'equilibrado',color:'#ffc857',pace:0,braking:0,response:0,lane:0,attackGap:135,closing:4},
 attacker:{name:'FURIA',description:'ataca antes',color:'#ff794f',pace:.03,braking:.05,response:1,lane:4,attackGap:150,closing:2},
 precise:{name:'ÁPICE',description:'respuesta precisa',color:'#ae97ff',pace:.02,braking:.06,response:1.4,lane:2,attackGap:120,closing:6}
};
function driverFor(car){
 const base=AI_DRIVERS[difficulty]||AI_DRIVERS.normal,style=AI_PERSONALITIES[car.personality]||AI_PERSONALITIES.racer;
 return {...base,pace:Math.min(1,base.pace+style.pace),brakingMargin:Math.min(1,base.brakingMargin+style.braking),response:base.response+style.response,laneSpeed:base.laneSpeed+style.lane,attackGap:style.attackGap,closing:style.closing};
}
const WORLD_SPEED_SCALE=.84;
function accelerationAtSpeed(speed,model){return model.acceleration*DRIVING_TUNING.accelerationScale*(1-DRIVING_TUNING.accelerationTaper*clamp(speed/model.maxSpeed,0,1));}
function vehicleHandling(speed,model,surface,safeSpeed,drift=0,hand=false){
 const excess=Math.max(0,speed-safeSpeed);
 const speedLoss=Math.min(DRIVING_TUNING.maxSpeedGripLoss,excess*DRIVING_TUNING.speedGripLoss);
 const grip=clamp((1-speedLoss-drift*(hand?.05:.12))*model.grip*(SURFACE_GRIP[surface]||1),.38,1.15);
 const mechanicalTurn=(.95+speed/235*2.9)*model.steering*grip*(hand?1.18:1);
 // Finite tire force: at high speed the minimum corner radius grows with speed squared.
 const lateralAcceleration=DRIVING_TUNING.lateralAcceleration*model.grip*(SURFACE_GRIP[surface]||1)*(hand?1.12:1);
 const turnRate=Math.min(mechanicalTurn,lateralAcceleration/Math.max(30,speed*WORLD_SPEED_SCALE));
 return {grip,turnRate,lateralAcceleration};
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
 const converging=approach.time>0&&approach.clearance<(difficulty==='easy'?28:24);
 const otherForwardSpeed=Math.max(0,other.speed*Math.cos(other.heading-car.heading));
 const closing=Math.max(0,car.speed-otherForwardSpeed);
 // Door-to-door brushes are playable contacts. Brake for a blocked path or a strong cut-in.
 const gentleOverlap=alongside&&Math.abs(before.offset-otherLoc.offset)>=20&&closing<18&&Math.cos(other.heading-car.heading)>.99;
 if(ahead&&!gentleOverlap&&(Math.abs(before.offset-otherLoc.offset)<27||converging)){
  // Shared braking distance gives time to open a lane before reaching the rear bumper.
  const buffer=32+closing*.2;
  const available=Math.max(0,gap-buffer);
  speedLimit=Math.sqrt(otherForwardSpeed*otherForwardSpeed+2*CAR_MODELS[car.model].braking*driver.brakingMargin*available/WORLD_SPEED_SCALE);
  // Yield longitudinal room if the other car cuts into the reserved lane.
  if(converging&&approach.time<.55&&closing>18)speedLimit=Math.min(speedLimit,otherForwardSpeed*.9);
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
function aiLookAhead(car){
 let distance=clamp(28+car.speed*.27,32,94);
 // A distant target cuts the corner across a nearby rival's reserved lane.
 // Shorten it only when the current arcs predict contact during overlap.
 if(car.aiManeuver?.type==='alongside'&&cars.some(other=>other!==car&&!other.done&&Math.hypot(other.x-car.x,other.y-car.y)<50&&trafficApproach(car,other).clearance<29))distance=Math.min(distance,28+car.speed*.06);
 if(car.speed<40&&car.aiManeuver?.type!=='clear')distance=Math.min(distance,8+car.speed*.15);
 return distance;
}
function driveAI(car,before,model,dt){
 const driver=driverFor(car);
 const traffic=aiTraffic(car,before,driver,dt);
 const lookAhead=aiLookAhead(car);
 const laneOffset=traffic.lane;
 const ground=terrainAt(car.x,car.y,before);
 const allowHandbrake=driver.handbrake&&car.aiManeuver.type==='clear'&&Math.abs(before.offset)<ROAD_EDGE-8;
 let targetSpeed=Math.min(aiTargetSpeed(before.progress,model,driver,allowHandbrake),traffic.speedLimit);
 // Establish the reserved target lane sooner; actual turning still uses shared vehicle physics.
 const laneStep=driver.laneSpeed*dt*(car.aiManeuver.type==='alongside'&&lookAhead<clamp(28+car.speed*.27,32,94)?1.5:1);
 car.aiLane=(car.aiLane||0)+clamp(laneOffset-(car.aiLane||0),-laneStep,laneStep);
 const targetBase=sampleAt(before.progress+lookAhead);
 const target={x:targetBase.x-Math.sin(targetBase.angle)*car.aiLane,y:targetBase.y+Math.cos(targetBase.angle)*car.aiLane};
 const error=wrapAngle(Math.atan2(target.y-car.y,target.x-car.x)-car.heading);
 const handling=vehicleHandling(car.speed,model,ground.material,curvatureAt(before.progress).safeSpeed,car.drift);
 const targetDistance=Math.max(10,Math.hypot(target.x-car.x,target.y-car.y));
 const requiredYaw=2*car.speed*WORLD_SPEED_SCALE*Math.sin(error)/targetDistance;
 const hand=allowHandbrake&&car.speed>90&&Math.abs(car.steer)>.3&&Math.abs(requiredYaw)>handling.turnRate*(car.handbrake?.72:.9);
 const turnRate=hand?vehicleHandling(car.speed,model,ground.material,curvatureAt(before.progress).safeSpeed,clamp(Math.abs(car.steer)*car.speed/200,0,1),true).turnRate:handling.turnRate;
 const steerTarget=car.speed<60?error*2.6:requiredYaw/turnRate+error*.2;
 car.steer+=(clamp(steerTarget,-1,1)-car.steer)*Math.min(1,dt*driver.response);
 if(ground.offroad)targetSpeed=Math.min(targetSpeed,65);
 if(Math.abs(error)>1.1)targetSpeed=Math.min(targetSpeed,45);
 car.aiTargetSpeed=targetSpeed;
 return {throttle:car.speed<targetSpeed-2?1:0,brake:car.speed>targetSpeed+2?1:0,hand};
}
// Rotational inertia: build and release yaw smoothly, retaining full steady turn rate.
// Integrate the first-order response exactly for this step, independent of FPS.
function updateSteeringInertia(car,turnRate,maxSpeed,dt){
 const target=car.steer*turnRate,response=car.handbrake?20:DRIVING_TUNING.yawResponse-DRIVING_TUNING.yawSpeedWeight*clamp(car.speed/maxSpeed,0,1);
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
  car.steer+=(steering-car.steer)*(1-Math.exp(-dt*(hand?DRIVING_TUNING.handInputResponse:DRIVING_TUNING.inputResponse)));
  controls={throttle:keys[k.up]?1:0,brake:keys[k.down]?1:0,hand};
 }
 const {throttle,brake,hand}=controls;car.handbrake=hand;car.braking=brake>0||hand;
 car.speed+=throttle*accelerationAtSpeed(car.speed,model)*dt;
 car.speed-=brake*(hand?model.braking*1.27:model.braking)*dt;
 car.speed-=(throttle?2.6:20)*dt;
 if(hand)car.speed-=model.braking*.55*dt;
 if(hand)car.drift=Math.min(1,Math.abs(car.steer)*car.speed/200);
 car.speed=clamp(car.speed,0,model.maxSpeed);
 const tooFast=Math.max(0,car.speed-localBend.safeSpeed);
 const drivingSurface=terrainAt(car.x,car.y,before).material;
 const handling=vehicleHandling(car.speed,model,drivingSurface,localBend.safeSpeed,car.drift,car.handbrake);
 updateSteeringInertia(car,handling.turnRate,model.maxSpeed,dt);
 car.drift=clamp(Math.max(car.drift*Math.exp(-4.5*dt),tooFast/160),0,1);
 const oldProgress=car.progress,previousX=car.x,previousY=car.y;
 const move=car.speed*WORLD_SPEED_SCALE*dt;
 car.wheelTravel=(car.wheelTravel+move)%12;
 car.x+=Math.cos(car.heading)*move;car.y+=Math.sin(car.heading)*move;
 let after=nearestOnTrack(car.x,car.y);
 // Resistance uses the same material sampled by the visible runoff layer.
 let ground=terrainAt(car.x,car.y,after),roadEdge=ground.offroad?ground.depth:0;
 if(ground.offroad){
  const material=TERRAIN_MATERIALS[ground.material],drag=material.drag+ground.depth*material.edgeDrag+car.speed*(material.speedDrag||0);
  // Preserve a recovery crawl without creating speed from rest or released throttle.
  car.speed=Math.max(Math.min(14,car.speed),car.speed-drag*model.grass*dt);
  car.drift=Math.max(car.drift,ground.material==='gravel'?.42:.28);
 }
 // The rendered rails and tires are also the physical collision geometry.
 const hitBarrier=resolveBarrierContact(car,previousX,previousY);
 if(hitBarrier)after=nearestOnTrack(car.x,car.y);
 const side=Math.sign(after.offset)||1,nx=-Math.sin(after.angle),ny=Math.cos(after.angle);
 if(!hitBarrier&&Math.abs(after.offset)>92){
  car.speed=Math.max(Math.min(12,car.speed),car.speed-(100+(Math.abs(after.offset)-92)*2.2)*dt);
  if(Math.abs(after.offset)>112){car.x=after.x+nx*side*108;car.y=after.y+ny*side*108;car.speed*=.76;after=nearestOnTrack(car.x,car.y);}
 }
 ground=terrainAt(car.x,car.y,after);roadEdge=ground.offroad?ground.depth:0;
 updateProgress(car,after,previousX,previousY);
 if(tooFast>12&&upcoming.distance<130)car.speed=Math.max(30,car.speed-tooFast*dt*.045);
 car.skidTimer=Math.max(0,(car.skidTimer||0)-dt);
 const skidding=car.speed>58&&(car.handbrake||car.drift>.43);
 if(skidding&&car.skidTimer<=0){const wheels=(CAR_VISUALS[car.model]||CAR_VISUALS.balanced),rearX=car.x+Math.cos(car.heading)*wheels.rearAxle,rearY=car.y+Math.sin(car.heading)*wheels.rearAxle;
  for(const wheelSide of [-1,1]){const wx=rearX-Math.sin(car.heading)*wheelSide*wheels.halfTrack,wy=rearY+Math.cos(car.heading)*wheelSide*wheels.halfTrack;skidMarks.push({x:wx,y:wy,angle:car.heading,life:10,maxLife:10,color:TERRAIN_MATERIALS[terrainAt(wx,wy).material].mark||'#101419'});}
  car.skidTimer=.045;if(skidMarks.length>1400)skidMarks.splice(0,skidMarks.length-1400);
 }
 if((skidding||roadEdge>3)&&car.speed>38&&Math.random()<dt*(roadEdge>3?34:20)&&terrainParticles.length<360){
  const rearX=car.x-Math.cos(car.heading)*13,rearY=car.y-Math.sin(car.heading)*13,spread=(Math.random()-.5)*14;
  const rearGround=terrainAt(rearX,rearY),particleStyle=TERRAIN_MATERIALS[rearGround.material]||TERRAIN_MATERIALS.asphalt;
  const life=particleStyle.life;
  terrainParticles.push({x:rearX-Math.sin(car.heading)*spread,y:rearY+Math.cos(car.heading)*spread,vx:(Math.random()-.5)*34-Math.cos(car.heading)*(roadEdge>3?12:5),vy:(Math.random()-.5)*34-Math.sin(car.heading)*(roadEdge>3?12:5),life,max:life,size:particleStyle.size+Math.random()*2,color:particleStyle.particle});
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
    if(closing>8){a.flash=.06;b.flash=.06;playRaceCue('impact',!a.isAI?a:b,closing/160);}
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
 for(const d of decorations)drawSceneryObject(context,d);
 // Capas de asfalto y vallas metálicas con postes.
 drawRunoff(context);drawTrackSurface(context);drawGuardrails(context);
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
 const finishHalfWidth=roadHalfWidthAt(0);
 for(let j=0;j<10;j++){context.fillStyle=j%2?'#f5f5e9':'#181b22';context.fillRect(-5,-finishHalfWidth+j*finishHalfWidth/5,10,finishHalfWidth/5);}
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
 for(const mark of skidMarks){context.save();context.globalAlpha=Math.min(.46,mark.life/mark.maxLife*.46);context.translate(mark.x,mark.y);context.rotate(mark.angle);context.fillStyle=mark.color||'#101419';context.fillRect(-5,-1.35,10,2.7);context.restore();}
 for(const p of terrainParticles){context.globalAlpha=Math.max(0,p.life/p.max)*.64;context.fillStyle=p.color;context.beginPath();context.arc(p.x,p.y,p.size*(.6+.4*p.life/p.max),0,Math.PI*2);context.fill();}context.globalAlpha=1;
}
// Visual profiles stay inside the existing 30 x 20 car footprint; no handling changes.
const CAR_VISUALS={
 balanced:{rearAxle:-8,frontAxle:8,halfTrack:7.5,steerAngle:.36,body:[[-15,-5],[-13,-7],[10,-7],[15,-4],[15,4],[10,7],[-13,7],[-15,5]],roof:[[-6,-5],[3,-5],[7,-3],[7,3],[3,5],[-6,5]]},
 corner:{rearAxle:-8.5,frontAxle:8.5,halfTrack:7.5,steerAngle:.4,body:[[-13,-4],[-4,-5],[2,-3],[14,-2],[15,0],[14,2],[2,3],[-4,5],[-13,4]],roof:[[-7,-3],[-1,-3],[2,0],[-1,3],[-7,3]]},
 speed:{rearAxle:-9,frontAxle:9,halfTrack:7.5,steerAngle:.32,body:[[-15,-5],[-11,-7],[6,-6],[15,-3],[15,3],[6,6],[-11,7],[-15,5]],roof:[[-9,-4],[0,-4],[4,-2],[4,2],[0,4],[-9,4]]},
 rally:{rearAxle:-7.5,frontAxle:7,halfTrack:7.5,steerAngle:.38,body:[[-14,-6],[-12,-8],[10,-8],[15,-5],[15,5],[10,8],[-12,8],[-14,6]],roof:[[-7,-5],[4,-5],[7,-3],[7,3],[4,5],[-7,5]]}
};
const motionPreference=typeof window.matchMedia==='function'?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
function carVisualState(car){
 const profile=CAR_VISUALS[car.model]||CAR_VISUALS.balanced;
 return {profile,wheelAngle:clamp(car.steer||0,-1,1)*profile.steerAngle,rolling:graphics!=='lite'&&!motionPreference?.matches,
  tread:(car.wheelTravel||0)%4,braking:!!car.braking&&!car.done};
}
function drawCarBody(context,car){
 const visual=carVisualState(car),v=visual.profile,detail=graphics==='high';
 const poly=(points,color)=>{context.beginPath();points.forEach(([x,y],i)=>i?context.lineTo(x,y):context.moveTo(x,y));context.closePath();context.fillStyle=color;context.fill();};
 const rect=(x,y,w,h,color)=>{context.fillStyle=color;context.fillRect(x,y,w,h);};
 if(detail){rect(-14,-6,30,15,'#050b1740');rect(-12,-4,29,14,'#050b1740');}
 for(const side of [-1,1])for(const front of [false,true]){
  context.save();context.translate(front?v.frontAxle:v.rearAxle,side*v.halfTrack);if(front)context.rotate(visual.wheelAngle);
  rect(-3,-1.4,6,2.8,'#090f19');
  if(graphics!=='lite'){
   rect(-2.4,-.8,4.8,1.6,'#485361');
   if(visual.rolling){context.save();context.beginPath();context.rect(-2.6,-1,5.2,2);context.clip();for(let x=-6+visual.tread;x<3;x+=4)rect(x,-1,.9,2,'#a9b6b9');context.restore();}
  }
  context.restore();
 }
 poly(v.body,car.color);context.strokeStyle=car.flash>0?'#f1ffed':'#111c2c';context.lineWidth=car.flash>0?1.4:1;context.stroke();
 // A lit leading edge and shaded sill give depth without hiding the paint.
 if(graphics!=='lite'){rect(-11,-6,18,.8,'#ffffff52');rect(-12,5,22,1,'#07172966');}
 poly(v.roof,'#172c3e');
 if(car.model==='corner'){
  rect(-13,-8,2,16,'#182b3b');rect(-12.5,-7,1,14,car.color);
  rect(11,-7.5,1.5,15,car.color);rect(-6,-2.1,4,4.2,'#619cac');rect(-3,-1,3,2,'#b2e7de');
  rect(4,-1,6,2,'#ffffffa0');
 }else if(car.model==='speed'){
  poly([[0,-3.3],[3,-1.7],[3,1.7],[0,3.3]],'#a3e5e9');
  rect(-14,-7,2,14,'#172b3c');rect(5,-1.8,8,1,'#ebf4d4');rect(5,.8,8,1,'#ebf4d4');
  if(detail){rect(-8,-3,3,.65,'#56889c');rect(-8,2.3,3,.65,'#56889c');}
 }else{
  poly([[3,-4],[6,-2.7],[6,2.7],[3,4]],'#b0edf0');rect(-5,-3.6,2,7.2,'#6299ad');
  if(car.model==='rally'){
   rect(-1,-3.8,2.6,7.6,car.color);rect(-3,-5.5,.8,11,'#c6d6cd');rect(1,-5.5,.8,11,'#c6d6cd');
   rect(13,-5,1.5,10,'#172b3a');
   if(detail){rect(11,-3.6,2,1.5,'#fff4c4');rect(11,2.1,2,1.5,'#fff4c4');rect(-13,-8,1.3,2,'#1b2934');rect(-13,6,1.3,2,'#1b2934');}
  }else if(detail){rect(-1,-3.3,3,6.6,car.color);rect(-10,-4.5,2,.7,'#deeee47a');}
 }
 // Warm front lamps and red rear lamps keep heading readable in every paint.
 rect(11,-4.7,2.5,1.8,'#fff0b9');rect(11,2.9,2.5,1.8,'#fff0b9');
 const rearLight=visual.braking?'#ff685c':'#993747';
 rect(-14,-4.8,2,2.2,rearLight);rect(-14,2.6,2,2.2,rearLight);
 if(visual.braking&&detail){rect(-15,-5.3,1,3.2,'#ff75634a');rect(-15,2.1,1,3.2,'#ff75634a');}
 if(car.offroad>39){const dirt=track.surface==='ice'?'#d6ecee99':track.surface==='grass'?'#9ca47699':'#bda27b99';rect(-12,-6.5,3,1.2,dirt);rect(-12,5.3,3,1.2,dirt);if(detail)rect(-9,-2,1,2,dirt);}
}
function drawCar(context,car){
 context.save();context.save();context.translate(car.x,car.y);context.rotate(car.heading);drawCarBody(context,car);context.restore();
 const name=carName(car),labelWidth=clamp(name.length*5.5+8,28,72);
 context.fillStyle='#10151ddd';context.fillRect(car.x-labelWidth/2,car.y-27,labelWidth,11);
 context.fillStyle=car.color;context.font='bold 9px monospace';context.textAlign='center';context.fillText(name,car.x,car.y-19);
 for(const smoke of car.particles){context.globalAlpha=clamp(smoke.life/smoke.max,0,1)*.42;context.fillStyle='#e1e2df';context.beginPath();context.arc(car.x-smoke.dx,car.y+smoke.dy,smoke.size,0,Math.PI*2);context.fill();}
 context.restore();
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
// One deadline and one announcement source for all race-ending paths.
function raceFinishState(){
 const finishers=cars.filter(car=>car.done&&Number.isFinite(car.finishTime)).sort((a,b)=>a.finishTime-b.finishTime||a.player-b.player);
 const remaining=finishers.length?Math.max(0,18-(elapsed-finishers[0].finishTime)):null;
 return {finishers,remaining,closed:cars.length>0&&(cars.every(car=>car.done)||remaining===0)};
}
function updateFinishFeedback(force=false){
 const state=raceFinishState(),clock=$('finishClock');
 $('status').classList.toggle('checkered-status',state.finishers.length>0);
 clock.classList.toggle('hidden',!state.finishers.length);
 if(!state.finishers.length){clock.textContent='';return;}
 clock.textContent='CIERRE '+Math.ceil(state.remaining)+' s';
 const key=state.finishers.map(car=>car.player).join(',');
 if(key===finishNoticeKey&&!force)return;
 finishNoticeKey=key;
 const human=cars[0],latest=state.finishers[state.finishers.length-1];
 if(mode==='solo'&&human.done&&Number.isFinite(human.finishTime)){
  $('status').textContent='LLEGASTE '+(raceClassification().indexOf(human)+1)+'.º / '+cars.length+(state.closed?' · CARRERA TERMINADA':' · ESPERANDO RIVALES');
 }else $('status').textContent=carName(latest)+' TERMINÓ · '+(mode==='solo'?'SEGUÍ CORRIENDO':'SIGUEN EN PISTA');
}
function updateTelemetry(){
 const player=cars[0];if(!player)return;
 $('speedValue').textContent=Math.round(player.speed)+' km/h';
 $('cpValue').textContent=Math.min(player.checkpointPasses||0,checkpoints.length)+' / '+checkpoints.length;
 const best=bestLapRecords[lapRecordKey()];$('bestLapValue').textContent=best?format(best):'--:--.-';
 $('position').textContent=(raceClassification().indexOf(player)+1)+'/'+cars.length;
 updateFinishFeedback();
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
 const frameTime=Math.max(0,(now-last)/1000),dt=Math.min(frameTime,.03);last=now;
 if(countdownRemaining>0){
  countdownRemaining=Math.max(0,countdownRemaining-frameTime);
  const label=countdownRemaining>0?String(Math.ceil(countdownRemaining)):'GO!';
  if(label!==countdownShown){countdownShown=label;if(label==='GO!'){goFlashRemaining=.55;$('status').textContent='¡A FONDO!';playRaceCue('go');}else playRaceCue('countdown');}
 }else{
  elapsed+=dt;
  cars.forEach((car,i)=>{if(!car.done)physics(car,i,dt);});
  resolveCollisions(dt);
 }
 if(goFlashRemaining>0&&countdownRemaining<=0)goFlashRemaining=Math.max(0,goFlashRemaining-dt);
 updateGroundEffects(dt);updateAudio();drawFrame();updateTelemetry();
 if(raceFinishState().closed){finishRace();return;}
 raf=requestAnimationFrame(loop);
}
function format(t){
 if(!Number.isFinite(t)||t<0)return '--:--.-';
 const tenths=Math.round(t*10),minutes=Math.floor(tenths/600),seconds=Math.floor(tenths%600/10),decimal=tenths%10;
 return String(minutes).padStart(2,'0')+':'+String(seconds).padStart(2,'0')+'.'+decimal;
}
function finishRace(){
 if(!running)return;
 running=false;audioResultActive=true;releaseAudioVoices();document.body.classList.remove('racing');cancelAnimationFrame(raf);game.classList.add('hidden');result.classList.remove('hidden');
 const classification=raceClassification(),winner=classification[0];
 awardPoints();updateAudio();audioResultCue=winner;flushResultCue();
 if(stage===tracks.length-1)$('resultTitle').textContent='¡CAMPEONATO TERMINADO!';
 else if(mode==='solo')$('resultTitle').textContent=winner.isAI?'¡GANÓ '+carName(winner)+'!':'¡GANASTE LA CARRERA!';
 else $('resultTitle').textContent='¡GANA EL JUGADOR '+(winner.player+1)+'!';
 const leaders=seasonStandings().filter(entry=>entry.rank===1);
 const finalNote=stage===tracks.length-1?' · '+(leaders.length>1?'EMPATE EN EL CAMPEONATO: ':'CAMPEÓN DE TEMPORADA: ')+leaders.map(({car})=>carName(car)).join(' / ')+' ('+leaders[0].points+' pts)':'';
 const human=cars[0];
 $('resultTitle').focus({preventScroll:true});
 $('finishSummary').textContent=mode==='solo'?(human.done&&Number.isFinite(human.finishTime)?'TU PUESTO '+(classification.indexOf(human)+1)+'.º / '+cars.length+' · TU TIEMPO '+format(human.finishTime):'SIN TERMINAR · '+human.lap+' / '+LAPS_TO_WIN+' VUELTAS'):'P1 '+(cars[0].done?format(cars[0].finishTime):'SIN TERMINAR')+' · P2 '+(cars[1].done?format(cars[1].finishTime):'SIN TERMINAR');
 const bestLap=bestLapRecords[lapRecordKey()];
 renderResults(classification);
 $('resultText').textContent='25 / 18 / 15 / 12 PTS POR PUESTO · SIN TERMINAR: 0 PTS'+finalNote+(bestLap?' · RÉCORD DE PISTA '+format(bestLap):'')+(cars.some(car=>car.newBestLap)?' · ¡NUEVO RÉCORD!':'');
 $('nextBtn').textContent=stage===tracks.length-1?'NUEVA TEMPORADA ↻':'SIGUIENTE CIRCUITO →';
 $('nextBtn').onclick=()=>stage===tracks.length-1?start(mode,0,false):start(mode,(stage+1)%tracks.length,true);
}
$('cameraBtn').onclick=toggleCamera;
$('pauseBtn').onclick=togglePause;
$('restartBtn').onclick=()=>start(mode,stage,true);
$('backBtn').onclick=()=>{running=false;audioResultActive=false;audioResultCue=null;document.body.classList.remove('racing');updateAudio();cancelAnimationFrame(raf);keys=Object.create(null);game.classList.add('hidden');menu.classList.remove('hidden');updateMenuPreview();$('menuTitle').focus({preventScroll:true});};
$('menuBtn').onclick=()=>{audioResultActive=false;audioResultCue=null;updateAudio();result.classList.add('hidden');menu.classList.remove('hidden');updateMenuPreview();$('menuTitle').focus({preventScroll:true});};
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>start(b.dataset.mode));
$('soundBtn').onclick=()=>{soundEnabled=!soundEnabled;$('soundBtn').textContent='♫ SONIDO: '+(soundEnabled?'ON':'OFF');$('soundBtn').setAttribute('aria-pressed',String(soundEnabled));if(soundEnabled){initAudio();if(audioContext&&audioContext.state==='suspended')audioContext.resume().catch(()=>{});}updateAudio();};
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
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)togglePause();updateAudio();});
document.addEventListener('fullscreenchange',()=>{drawFullScreenButton();if(running)resize();});
window.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&document.fullscreenElement&&document.exitFullscreen){document.exitFullscreen().catch(()=>{});}
});
$('graphics').addEventListener('change',()=>{graphics=$('graphics').value;$('views').classList.toggle('pixelated',graphics==='retro');$('views').classList.toggle('performance',graphics==='lite');if(running)resize();else{updateGaragePreview();updateMenuPreview();}});
$('carModel').addEventListener('change',updateGaragePreview);
$('carColor').addEventListener('change',updateGaragePreview);
updateGaragePreview();updateMenuPreview();
$('difficulty').addEventListener('change',()=>{difficulty=$('difficulty').value;updateMenuPreview();});
for(const id of ['stageSelect','opponentCount','barrierMode'])$(id).addEventListener('change',updateMenuPreview);
window.addEventListener('resize',()=>{if(running)resize();});
if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(()=>{if(running)resize();});observer.observe($('views'));}
})();
