// Shared immutable circuit geometry for the browser and an authoritative Node host.
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory();
 else root.PixelTrackCore=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const wrapAngle=a=>Math.atan2(Math.sin(a),Math.cos(a));
 const pointDistance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 const ROAD_EDGE=42,ROAD_SHOULDER=48,GRAVEL_WIDTH=38;
 const empty=Object.freeze([]);
 function freeze(value){if(value&&typeof value==='object'&&!Object.isFrozen(value)){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;}
 function create(){
// roadProfile knots: [lap fraction, road half-width, usable kerb width], in world units.
const trackDefs=[
{name:'SUNSET CIRCUIT',roadVersion:1,roadProfile:[[0,46,0],[0.07,56,0],[0.16,56,6],[0.24,42,6],[0.32,38,0],[0.4,44,6],[0.5,50,6],[0.6,40,0],[0.7,36,0],[0.8,42,6],[0.9,50,6],[1,46,0]],worldScale:1.8,layoutVersion:3,sky:'#f4a66c',grass:'#36784d',accent:'#f6d27c',points:[[140,100],[350,90],[620,90],[850,120],[920,220],[900,370],[820,450],[700,470],[620,420],[650,340],[600,270],[500,260],[430,320],[450,410],[530,490],[520,560],[400,580],[250,540],[130,480],[80,380],[110,280],[210,280],[300,290],[350,235],[300,170],[220,165],[150,205],[90,180]]},
{name:'NEON HARBOR',roadVersion:1,roadProfile:[[0,44,6],[0.1,50,6],[0.2,38,0],[0.3,38,0],[0.4,46,6],[0.52,48,6],[0.62,36,0],[0.72,40,6],[0.82,46,6],[0.92,44,0],[1,44,6]],worldScale:1.4,layoutVersion:2,sky:'#5dbfc8',grass:'#25766b',accent:'#84fff0',points:[[150,95],[330,100],[385,145],[470,120],[535,95],[730,100],[820,148],[855,230],[810,275],[700,270],[650,340],[700,430],[640,490],[510,495],[455,435],[340,450],[295,520],[180,510],[120,445],[95,350],[145,285],[110,200]]},
{name:'DUSTY MESA',roadVersion:1,roadProfile:[[0,46,0],[0.14,54,0],[0.28,48,0],[0.4,36,0],[0.52,36,0],[0.64,44,0],[0.76,50,0],[0.88,40,0],[1,46,0]],worldScale:1.4,layoutVersion:3,sky:'#dfb878',grass:'#b99c61',accent:'#f5dd91',points:[[140,120],[360,90],[600,90],[820,110],[900,170],[910,240],[850,290],[760,280],[690,240],[620,250],[570,310],[580,380],[650,420],[680,480],[640,540],[560,550],[450,500],[340,430],[230,360],[130,300],[90,230],[110,160]]},
{name:'NIGHT RUN',worldScale:2.65,layoutVersion:3,roadVersion:1,roadProfile:[[0,50,0],[0.1,54,0],[0.16,38,6],[0.24,48,6],[0.34,42,0],[0.42,34,0],[0.5,46,6],[0.6,52,0],[0.7,48,6],[0.8,38,6],[0.9,40,0],[1,50,0]],sky:'#5a5b9e',grass:'#263a54',accent:'#ff5fae',points:[[130,85],[340,85],[390,85],[420,110],[450,110],[480,85],[650,85],[880,100],[930,170],[900,240],[800,265],[700,240],[670,290],[720,335],[835,320],[900,365],[925,440],[880,520],[780,565],[600,575],[460,530],[320,560],[155,550],[90,490],[85,420],[145,375],[240,390],[330,450],[460,450],[540,400],[540,330],[470,280],[350,250],[240,285],[155,280],[95,220],[95,150]]},
{name:'FROSTBITE GP',worldScale:2.2,layoutVersion:3,roadVersion:1,roadProfile:[[0, 52, 0], [0.12, 56, 0], [0.22, 44, 0], [0.31, 38, 0], [0.4, 48, 0], [0.5, 54, 0], [0.61, 42, 0], [0.7, 34, 0], [0.79, 38, 0], [0.9, 46, 0], [1, 52, 0]],sky:'#d9eff4',grass:'#a4c9d8',accent:'#e7fbff',points:[[340, 80], [560, 100], [760, 180], [875, 280], [900, 400], [830, 490], [700, 520], [610, 480], [570, 400], [500, 350], [430, 380], [370, 480], [280, 540], [160, 530], [90, 450], [90, 350], [170, 285], [270, 280], [350, 235], [360, 180], [300, 170], [190, 185], [130, 150], [150, 100], [240, 80]]},
{name:'JUNGLE SPRINT',worldScale:2,layoutVersion:3,roadVersion:1,roadProfile:[[0,50,0],[0.12,58,0],[0.24,42,0],[0.35,36,0],[0.46,42,0],[0.56,52,0],[0.66,40,0],[0.76,36,0],[0.86,46,0],[1,50,0]],sky:'#72b987',grass:'#205a3d',accent:'#a8e77e',points:[[190,100],[300,90],[470,100],[560,140],[600,210],[550,270],[440,260],[350,310],[380,380],[500,390],[570,350],[650,280],[760,220],[850,230],[900,300],[880,400],[780,440],[700,420],[650,460],[670,530],[580,570],[420,550],[290,560],[170,520],[100,440],[100,340],[90,240],[100,160]]},
{name:'VOLCANO RING',worldScale:1.8,layoutVersion:3,roadVersion:1,roadProfile:[[0,48,0],[0.14,56,0],[0.26,44,0],[0.35,38,0],[0.45,34,0],[0.56,44,0],[0.66,50,0],[0.77,40,0],[0.88,36,0],[1,48,0]],sky:'#9e645d',grass:'#4c4349',accent:'#ff704e',points:[[160,400],[320,360],[490,245],[670,125],[800,90],[885,130],[920,205],[885,270],[800,290],[740,265],[675,275],[650,325],[690,370],[780,375],[860,425],[860,500],[790,555],[670,560],[580,520],[500,465],[420,470],[340,525],[240,560],[145,545],[85,500],[80,450],[105,415]]},
{name:'PIXEL CITY',worldScale:1.6,layoutVersion:3,roadVersion:1,roadProfile:[[0,52,0],[0.12,48,6],[0.22,34,6],[0.32,38,0],[0.43,50,0],[0.56,56,0],[0.65,42,6],[0.75,36,6],[0.85,40,0],[0.94,50,0],[1,52,0]],sky:'#c67bb2',grass:'#356c5d',accent:'#5bf4ec',points:[[160,100],[340,100],[415,120],[460,170],[460,250],[530,290],[650,290],[720,250],[750,170],[790,110],[860,110],[905,180],[905,360],[880,440],[800,480],[660,480],[600,530],[490,550],[410,485],[310,470],[255,520],[165,540],[100,485],[90,360],[90,200],[110,135]]},
{name:'THUNDER VALLEY',worldScale:2.1,layoutVersion:3,roadVersion:1,roadProfile:[[0,52,0],[0.1,58,0],[0.18,48,6],[0.23,44,0],[0.24,44,0],[0.28,38,0],[0.33,42,0],[0.34,42,0],[0.42,52,6],[0.52,56,0],[0.62,48,0],[0.66,44,0],[0.72,38,0],[0.75,40,0],[0.76,42,0],[0.84,50,6],[0.92,48,0],[1,52,0]],sky:'#a4b4d3',grass:'#406d5a',accent:'#e8f6ff',points:[[100,120],[350,95],[600,95],[780,110],[920,200],[880,280],[760,290],[650,260],[530,300],[510,350],[620,400],[760,440],[820,520],[760,570],[600,570],[450,520],[370,430],[300,390],[250,430],[190,520],[130,550],[80,500],[80,400],[130,300],[190,260],[160,210],[80,190]]},
{name:'CHAMPION ROAD',worldScale:1.4,layoutVersion:2,sky:'#f3dc7e',grass:'#397653',accent:'#ffffff',points:[[140,100],[400,100],[680,100],[850,100],[910,150],[910,260],[850,300],[750,270],[690,290],[690,380],[790,410],[890,400],[920,460],[890,520],[790,550],[650,530],[580,470],[500,460],[430,520],[320,550],[210,540],[120,500],[90,430],[110,365],[190,350],[270,380],[350,350],[360,270],[290,240],[210,270],[130,250],[90,180]]}
,
{name:'COASTLINE RUN',worldScale:2,layoutVersion:3,roadVersion:1,roadProfile:[[0,52,0],[0.1,58,0],[0.18,50,6],[0.25,44,6],[0.3,42,0],[0.31,42,0],[0.35,38,0],[0.37,42,0],[0.38,42,0],[0.44,48,6],[0.52,40,6],[0.6,36,0],[0.69,46,0],[0.78,52,6],[0.88,42,0],[1,52,0]],sky:'#76c6db',grass:'#347f68',accent:'#cfff9d',environment:'coast',points:[[160,95],[450,80],[720,120],[860,210],[910,330],[865,470],[740,550],[600,560],[540,515],[545,445],[620,390],[710,370],[740,320],[700,270],[620,270],[540,325],[450,380],[410,470],[330,540],[220,535],[130,475],[90,380],[100,290],[185,255],[300,270],[355,220],[330,160],[230,150],[150,180],[100,155]]},
{name:'RALLY CANYON',worldScale:1.3,layoutVersion:2,sky:'#d7b17c',grass:'#a58b5b',accent:'#f5d49a',environment:'rally',points:[[110,120],[158,88],[220,82],[278,104],[328,147],[390,131],[446,88],[515,79],[574,106],[613,150],[673,137],[732,105],[798,111],[855,146],[900,196],[892,244],[850,267],[798,255],[753,274],[745,322],[785,348],[838,338],[887,362],[904,411],[878,456],[831,474],[779,454],[731,433],[687,458],[651,504],[599,533],[536,535],[483,510],[421,525],[361,511],[303,528],[245,513],[189,529],[140,498],[103,455],[84,409],[101,365],[145,349],[191,362],[235,345],[256,309],[240,273],[199,253],[157,270],[119,250],[88,208],[91,160]]},
{name:'MEADOW RUN',worldScale:1.3,layoutVersion:2,sky:'#b5d7ad',grass:'#43864c',accent:'#deff91',environment:'meadow',points:[[88,145],[124,104],[196,85],[270,102],[402,102],[445,145],[506,159],[552,122],[617,91],[697,86],[757,110],[828,98],[887,132],[912,184],[895,224],[842,240],[791,219],[745,246],[752,306],[812,327],[874,313],[911,353],[912,399],[878,442],[824,458],[778,440],[735,461],[698,508],[638,533],[571,520],[518,541],[391,539],[322,521],[258,539],[197,514],[149,482],[113,435],[91,380],[111,348],[163,338],[214,356],[267,333],[277,291],[237,266],[184,272],[141,248],[105,213],[82,177]]},
{name:'INDUSTRIAL MIX',worldScale:1.3,layoutVersion:2,sky:'#9ba9b6',grass:'#4c6956',accent:'#ffcc63',environment:'industrial',points:[[95,110],[175,88],[255,100],[315,132],[385,118],[450,84],[520,85],[565,120],[625,112],[698,85],[780,95],[855,126],[905,180],[892,230],[846,252],[790,246],[744,277],[751,324],[808,344],[875,331],[912,372],[906,423],[865,460],[806,471],[746,449],[698,471],[658,514],[597,538],[532,523],[480,493],[418,510],[360,489],[302,512],[244,498],[182,523],[127,491],[92,445],[90,396],[127,370],[179,381],[221,360],[224,315],[185,283],[136,299],[97,263],[80,213],[95,160]]}
];
function makeTrack(def){
 // World size is independent of the viewport; road sectors are expressed in world units.
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
const TRACK_BARRIERS=['open','half','open','corners','corners','open','corners','half','open','corners','open','open','open','half'];
tracks.forEach((item,index)=>{item.surface=TRACK_SURFACES[index]||'asphalt';item.defaultBarriers=TRACK_BARRIERS[index]||'full';item.dirtRanges=item.surface==='mixed'?[[item.length*.24,item.length*.33],[item.length*.66,item.length*.75]]:[];});
freeze(tracks);
const barrierContourCache=new WeakMap(),runoffBucketsCache=new WeakMap();
function surfaceAtProgress(distance,item=tracks[0]){
 const d=((distance%item.length)+item.length)%item.length;
 if(item.surface==='mixed')return (item.dirtRanges||[]).some(([start,end])=>d>=start&&d<=end)?'dirt':'asphalt';
 if(item.surface==='coastal'&&d>=item.length*.31&&d<=item.length*.37)return 'dirt';
 return item.surface||'asphalt';
}
function roadSectionAt(progress,item=tracks[0]){
 const surface=surfaceAtProgress(progress,item),paved=surface==='asphalt'||surface==='coastal';
 if(!item.roadProfile)return {halfWidth:ROAD_EDGE,kerb:paved?ROAD_SHOULDER-ROAD_EDGE:0};
 const phase=((progress%item.length)+item.length)%item.length/item.length,profile=item.roadProfile;
 let i=0;while(i<profile.length-2&&phase>profile[i+1][0])i++;
 const a=profile[i],b=profile[i+1],t=clamp((phase-a[0])/(b[0]-a[0]),0,1),blend=t*t*(3-2*t);
 return {halfWidth:a[1]+(b[1]-a[1])*blend,kerb:paved?a[2]+(b[2]-a[2])*blend:0};
}
function roadHalfWidthAt(progress,item=tracks[0]){const section=roadSectionAt(progress,item);return section.halfWidth+section.kerb;}
function roadMaxHalfWidth(item=tracks[0]){return item.roadProfile?Math.max(...item.roadProfile.map(p=>p[1]+p[2])):ROAD_SHOULDER;}
function barrierRadiusAt(progress,item=tracks[0]){
 if(!item.roadProfile)return 55;
 const surface=surfaceAtProgress(progress,item),legacy=item.surface==='mixed'||item.surface==='coastal'||surface==='asphalt'||surface==='coastal'?ROAD_SHOULDER:ROAD_EDGE;
 return 55+roadHalfWidthAt(progress,item)-legacy;
}
function sampleAt(distance,item=tracks[0]){
 const d=((distance%item.length)+item.length)%item.length,s=item.samples;let lo=0,hi=s.length-1;
 while(lo<hi){const mid=(lo+hi+1)>>1;if(s[mid].d<=d)lo=mid;else hi=mid-1;}
 const a=s[lo],b=s[(lo+1)%s.length],seg=pointDistance(a,b)||1;
 const t=clamp((d-a.d)/seg,0,1);
 return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,angle:Math.atan2(b.y-a.y,b.x-a.x)};
}
function nearestOnTrack(x,y,indices=null,item=tracks[0]){
 const s=item.samples;let best=Infinity,found=null;
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
function projectToSegment(x,y,a,b){
 const dx=b.x-a.x,dy=b.y-a.y,lengthSq=dx*dx+dy*dy;
 const t=lengthSq?clamp(((x-a.x)*dx+(y-a.y)*dy)/lengthSq,0,1):0;
 const px=a.x+dx*t,py=a.y+dy*t;
 return {x:px,y:py,t,distanceSq:(x-px)**2+(y-py)**2};
}
function checkpointsForTrack(item=tracks[0]){
 const result=[];
 const count=Math.max(3,Math.ceil(item.length/650)-1);
 for(let i=1;i<=count;i++){const progress=item.length*i/(count+1),p=sampleAt(progress,item);result.push({id:i,progress,x:p.x,y:p.y,angle:p.angle,halfWidth:roadHalfWidthAt(progress,item)});}
 return result;
}
function runoffBuckets(item=tracks[0]){
 if(runoffBucketsCache.has(item))return runoffBucketsCache.get(item);
 const buckets=new Map(),pad=roadMaxHalfWidth(item)+GRAVEL_WIDTH+12,s=item.samples;
 for(let i=0;i<s.length;i++){
  const a=s[i],b=s[(i+1)%s.length];
  for(let row=Math.floor((Math.min(a.y,b.y)-pad)/128);row<=Math.floor((Math.max(a.y,b.y)+pad)/128);row++)for(let column=Math.floor((Math.min(a.x,b.x)-pad)/128);column<=Math.floor((Math.max(a.x,b.x)+pad)/128);column++){
   const key=column+','+row;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(i);
  }
 }
 for(const indices of buckets.values())Object.freeze(indices);
 const view=Object.freeze({get:key=>buckets.get(key)});runoffBucketsCache.set(item,view);return view;
}
function createWorld(index=0,profile='auto'){
 if(!Number.isInteger(index)||index<0||index>=tracks.length)throw new RangeError('Unknown circuit');
 if(!['auto','full','half','corners','open'].includes(profile))throw new RangeError('Unknown barrier profile');
 const track=tracks[index],barrierMode=profile==='auto'?track.defaultBarriers:profile;
 const wrapDistance=d=>((d%track.length)+track.length)%track.length;
function surfaceAtProgress(distance,item=track){return queries.surfaceAtProgress(distance,item);}
function roadSectionAt(progress,item=track){return queries.roadSectionAt(progress,item);}
function roadHalfWidthAt(progress,item=track){return queries.roadHalfWidthAt(progress,item);}
function roadMaxHalfWidth(item=track){return queries.roadMaxHalfWidth(item);}
function barrierRadiusAt(progress,item=track){return queries.barrierRadiusAt(progress,item);}
function sampleAt(distance,item=track){return queries.sampleAt(distance,item);}
function nearestOnTrack(x,y,indices=null,item=track){return queries.nearestOnTrack(x,y,indices,item);}
function checkpointsForTrack(item=track){return queries.checkpointsForTrack(item);}
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
function curvatureAt(distance){
 const a=sampleAt(distance-38).angle,b=sampleAt(distance+38).angle;
 const turn=wrapAngle(b-a),severity=Math.abs(turn);
 return {turn,severity,safeSpeed:clamp(224/(1+severity*1.65),78,220)};
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
  const tire={x:p.x+nx*outside*(barrierRadiusAt(d)+2),y:p.y+ny*outside*(barrierRadiusAt(d)+2),angle:p.angle,progress:d,side:outside};
  if(nearestOnTrack(tire.x,tire.y).distance>=barrierRadiusAt(d)-3)list.push(tire);
 }return list;
}
function barrierContoursForTrack(){
 if(barrierContourCache.has(track))return barrierContourCache.get(track);
 const buckets=new Map(),cell=32,pad=track.roadProfile?roadMaxHalfWidth()+22:64,step=4;
 for(let i=0;i<track.samples.length;i++){
  const a=track.samples[i],b=track.samples[(i+1)%track.samples.length],segment={a,b};
  for(let y=Math.floor((Math.min(a.y,b.y)-pad)/cell);y<=Math.floor((Math.max(a.y,b.y)+pad)/cell);y++){
   for(let x=Math.floor((Math.min(a.x,b.x)-pad)/cell);x<=Math.floor((Math.max(a.x,b.x)+pad)/cell);x++){
    const key=x+','+y;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(segment);
   }
  }
 }
 function nearest(x,y){
  let distanceSq=pad*pad,progress=0;
  for(const {a,b} of buckets.get(Math.floor(x/cell)+','+Math.floor(y/cell))||[]){
   const p=projectToSegment(x,y,a,b);
   if(p.distanceSq<distanceSq){distanceSq=p.distanceSq;progress=a.d+p.t*pointDistance(a,b);}
  }
  return {distanceSq,progress};
 }
 const width=Math.ceil((track.worldWidth+pad*2)/step)+1,height=Math.ceil((track.worldHeight+pad*2)/step)+1,values=new Float64Array(width*height);
 const vertex=index=>({x:-pad+(index%width)*step,y:-pad+Math.floor(index/width)*step});
 for(let i=0;i<values.length;i++){
  const p=vertex(i),loc=nearest(p.x,p.y),radius=barrierRadiusAt(loc.progress),value=loc.distanceSq-radius*radius;
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
 freeze(contours);barrierContourCache.set(track,contours);return contours;
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
const guardrailRanges=freeze(guardrailRangesForTrack()),trackFeatures=freeze(buildTrackFeatures()),runoffZones=freeze(buildRunoffZones()),tireBarriers=freeze(barriersForTrack());
 let guardrailPaths=[],physicalBarriers=[],barrierBuckets=new Map(),physicalReady=false;
 function ensurePhysical(){if(physicalReady)return;buildPhysicalBarriers();freeze(guardrailPaths);freeze(physicalBarriers);for(const list of barrierBuckets.values())Object.freeze(list);physicalReady=true;}
 return Object.freeze({track,barrierMode,guardrailRanges,features:trackFeatures,runoffZones,tireBarriers,terrainAt,curvatureAt,guardrailActive,
  get contours(){return barrierContoursForTrack();},get guardrailPaths(){ensurePhysical();return guardrailPaths;},get physicalBarriers(){ensurePhysical();return physicalBarriers;},
  barriersNear(x,y){ensurePhysical();return barrierBuckets.get(Math.floor(x/32)+','+Math.floor(y/32))||empty;}});
}
const queries=Object.freeze({surfaceAtProgress,roadSectionAt,roadHalfWidthAt,roadMaxHalfWidth,barrierRadiusAt,sampleAt,nearestOnTrack,projectToSegment,checkpointsForTrack,runoffBuckets});
return Object.freeze({rules:Object.freeze({roadEdge:ROAD_EDGE,roadShoulder:ROAD_SHOULDER,gravelWidth:GRAVEL_WIDTH}),tracks,...queries,createWorld});
}
return Object.freeze({apiVersion:1,create});
});
