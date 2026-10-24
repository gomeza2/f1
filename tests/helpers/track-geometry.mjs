// Independent geometry checks for the driving width, not just the centerline.
function projection(point,a,b){
 const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;
 const t=length?Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/length)):0;
 return {t,distanceSq:(point.x-a.x-dx*t)**2+(point.y-a.y-dy*t)**2};
}
function closestCandidates(a,b,c,d){
 const candidates=[];
 for(const [p,s] of [[a,0],[b,1],[{x:(a.x+b.x)/2,y:(a.y+b.y)/2},.5]]){const q=projection(p,c,d);candidates.push({s,t:q.t,distanceSq:q.distanceSq});}
 for(const [q,t] of [[c,0],[d,1],[{x:(c.x+d.x)/2,y:(c.y+d.y)/2},.5]]){const p=projection(q,a,b);candidates.push({s:p.t,t,distanceSq:p.distanceSq});}
 const rx=b.x-a.x,ry=b.y-a.y,sx=d.x-c.x,sy=d.y-c.y,den=rx*sy-ry*sx;
 if(Math.abs(den)>1e-8){
  const s=((c.x-a.x)*sy-(c.y-a.y)*sx)/den,t=((c.x-a.x)*ry-(c.y-a.y)*rx)/den;
  if(s>=0&&s<=1&&t>=0&&t<=1)candidates.push({s,t,distanceSq:0});
 }
 return candidates;
}
export function analyzeTrackWidth(track,roadEdge=42,localArc=180){
 const samples=track.samples,lengths=samples.map((a,i)=>Math.hypot(a.x-samples[(i+1)%samples.length].x,a.y-samples[(i+1)%samples.length].y));
 let roadMargin=Infinity,distantSpacing=Infinity,segments=null;
 for(const p of samples)roadMargin=Math.min(roadMargin,p.x-roadEdge,p.y-roadEdge,track.worldWidth-p.x-roadEdge,track.worldHeight-p.y-roadEdge);
 for(let i=0;i<samples.length;i++)for(let j=i+2;j<samples.length;j++){
  if(i===0&&j===samples.length-1)continue;
  for(const p of closestCandidates(samples[i],samples[(i+1)%samples.length],samples[j],samples[(j+1)%samples.length])){
  const a=samples[i].d+p.s*lengths[i],b=samples[j].d+p.t*lengths[j],gap=Math.abs(a-b);
  if(Math.min(gap,track.length-gap)<localArc)continue;
  if(p.distanceSq<distantSpacing*distantSpacing){distantSpacing=Math.sqrt(p.distanceSq);segments=[i,j];}
  }
 }
 return {roadMargin,distantSpacing,clearance:distantSpacing-roadEdge*2,segments};
}
