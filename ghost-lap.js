/* Personal lap playback. Local records are not verified online results. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PixelGhostLap=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create(){
  const maxDuration=180,maxFrames=1802,interval=.1;
  const round=(n,d)=>Number(n.toFixed(d));
  function pose(time,car){return [round(time,3),round(car.x,2),round(car.y,2),round(Math.atan2(Math.sin(car.heading),Math.cos(car.heading)),4),round(Math.max(-1,Math.min(1,car.steer||0)),3)];}
  function valid(record,{key,model,worldWidth,worldHeight}){
   if(!record||record.version!==1||record.key!==key||record.model!==model||!Number.isFinite(record.duration)||record.duration<1||record.duration>maxDuration||!Array.isArray(record.frames)||record.frames.length<2||record.frames.length>maxFrames)return false;
   let previous=-1;
   for(const f of record.frames){if(!Array.isArray(f)||f.length!==5||!f.every(Number.isFinite)||f[0]<0||f[0]<=previous||f[0]>record.duration+.001||Math.abs(f[3])>Math.PI+.001||Math.abs(f[4])>1||f[1]<-256||f[1]>worldWidth+256||f[2]<-256||f[2]>worldHeight+256)return false;previous=f[0];}
   return record.frames[0][0]===0&&Math.abs(previous-record.duration)<=.001;
  }
  function recorder(key,model,car){
   const frames=[pose(0,car)];let next=interval,invalid=false;
   function capture(time,state,force=false){
    if(!Number.isFinite(time)||time<0||time>maxDuration){invalid=true;return;}
    if(invalid||(!force&&time+1e-7<next))return;
    const frame=pose(time,state),last=frames[frames.length-1];
    if(!frame.every(Number.isFinite)||frame[0]<last[0]){invalid=true;return;}
    if(frame[0]===last[0]){if(force)frames[frames.length-1]=frame;return;}
    if(frames.length>=maxFrames){invalid=true;return;}
    frames.push(frame);next=time+interval;
   }
   return {capture,finish(duration,state){capture(duration,state,true);return invalid?null:{version:1,key,model,duration,frames:frames.map(f=>f.slice())};}};
  }
  function sample(record,time){
   if(!record||!Number.isFinite(time))return null;
   const frames=record.frames;let lo=0,hi=frames.length-1;
   while(lo+1<hi){const mid=(lo+hi)>>1;if(frames[mid][0]<=time)lo=mid;else hi=mid;}
   const a=frames[lo],b=frames[hi],alpha=Math.max(0,Math.min(1,(time-a[0])/(b[0]-a[0]))),angle=Math.atan2(Math.sin(b[3]-a[3]),Math.cos(b[3]-a[3]));
   return {x:a[1]+(b[1]-a[1])*alpha,y:a[2]+(b[2]-a[2])*alpha,heading:a[3]+angle*alpha,steer:a[4]+(b[4]-a[4])*alpha};
  }
  return Object.freeze({maxDuration,maxFrames,recorder,valid,sample});
 }
 return Object.freeze({apiVersion:1,create});
});
