// Compare route silhouettes independently of translation, scale, rotation,
// reflection, traversal direction and start-line placement.
export function sampleTrackShape(track,count=64){
 const points=[];let segment=0;
 for(let i=0;i<count;i++){
  const distance=track.length*i/count;
  while(segment+1<track.samples.length&&track.samples[segment+1].d<=distance)segment++;
  const a=track.samples[segment],b=track.samples[(segment+1)%track.samples.length];
  const fraction=(distance-a.d)/(Math.hypot(b.x-a.x,b.y-a.y)||1);
  points.push({x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction});
 }
 return points;
}
function normalize(points){
 const count=points.length,center=points.reduce((p,q)=>({x:p.x+q.x/count,y:p.y+q.y/count}),{x:0,y:0});
 const radius=Math.sqrt(points.reduce((sum,p)=>sum+(p.x-center.x)**2+(p.y-center.y)**2,0)/count);
 if(!Number.isFinite(radius)||radius<1e-9)throw new Error('A route shape must have nonzero extent.');
 return points.map(p=>({x:(p.x-center.x)/radius,y:(p.y-center.y)/radius}));
}
export function normalizedShapeDistance(first,second){
 if(first.length!==second.length||first.length<3)throw new Error('Shapes require equal sample counts of at least three.');
 const a=normalize(first),b=normalize(second),count=a.length;let best=Infinity;
 for(const mirror of [-1,1])for(const direction of [-1,1])for(let shift=0;shift<count;shift++){
  let dot=0,cross=0;
  for(let i=0;i<count;i++){
   const p=a[i],q=b[(shift+direction*i+count)%count],x=q.x*mirror;
   dot+=p.x*x+p.y*q.y;cross+=p.x*q.y-p.y*x;
  }
  best=Math.min(best,Math.sqrt(Math.max(0,2-2*Math.hypot(dot,cross)/count)));
 }
 return best;
}
