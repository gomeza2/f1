const edits=[
 [
  "// Preserve older route/physics times without making their ghosts active on a new route.\nfunction historicalTrialKey(key){\n if(typeof key!=='string'||key.length>128)return false;\n const match=/^(.+?)(?:@[1-9]\\d{0,3})?:p[1-9]\\d{0,3}(?::r[1-9]\\d{0,3})?:s[1-9]\\d{0,3}:b[1-9]\\d{0,3}\\|([a-z]+)\\|(open|full|half|corners)$/.exec(key);\n return !!match&&tracks.some(item=>item.name===match[1])&&Object.hasOwn(CAR_MODELS,match[2]);\n}\nfunction readTrialStore(){",
  "function readTrialStore(){"
 ],
 [
  "  // Current combinations take priority; up to 512 total current/historical times remain bounded.\n  const keys=[...trialIdentities.keys()].filter(key=>Object.hasOwn(saved.times||{},key)).concat(Object.keys(saved.times||{}).filter(key=>!trialIdentities.has(key)&&historicalTrialKey(key))).slice(0,512);\n  for(const key of keys){const time=saved.times?.[key];if(typeof time==='number'&&Number.isFinite(time)&&time>=1&&time<3600)store.times[key]=time;}",
  "  for(const [key,identity] of trialIdentities){const time=saved.times?.[key];if(typeof time==='number'&&Number.isFinite(time)&&time>=1&&time<3600)store.times[key]=time;}"
 ],
 [
  " const previewRoad=TERRAIN_MATERIALS[surfaceAtProgress(0,item)]?.road||TERRAIN_MATERIALS.asphalt.road;\n if(item.roadProfile){fillRoadRibbon(context,previewRoad.edge,d=>roadHalfWidthAt(d,item)+2,item);fillRoadRibbon(context,previewRoad.body,d=>roadSectionAt(d,item).halfWidth,item);}else{context.strokeStyle=previewRoad.edge;context.lineWidth=ROAD_EDGE*2+10;context.stroke();context.strokeStyle=previewRoad.body;context.lineWidth=ROAD_EDGE*2-10;context.stroke();}",
  " if(item.roadProfile){fillRoadRibbon(context,'#1d3447',d=>roadHalfWidthAt(d,item)+2,item);fillRoadRibbon(context,'#667f8e',d=>roadSectionAt(d,item).halfWidth,item);}else{context.strokeStyle='#1d3447';context.lineWidth=ROAD_EDGE*2+10;context.stroke();context.strokeStyle='#667f8e';context.lineWidth=ROAD_EDGE*2-10;context.stroke();}"
 ],
 [
  " const style=TERRAIN_MATERIALS[track.surface]?.road||TERRAIN_MATERIALS.asphalt.road;\n const grain=style.grain||(track.surface==='dirt'?[style.body,style.border,style.kerb]:null);",
  " const style=TERRAIN_MATERIALS[track.surface]?.road||TERRAIN_MATERIALS.asphalt.road;"
 ],
 [
  " if(grain){",
  " if(style.grain){"
 ],
 [
  "    if(style.grainKind==='ice'){const length=5+seed%9,angle=p.angle+((seed%11)-5)*.04;context.strokeStyle=grain[seed%grain.length];context.lineWidth=1;context.beginPath();context.moveTo(x-Math.cos(angle)*length/2,y-Math.sin(angle)*length/2);context.lineTo(x+Math.cos(angle)*length/2,y+Math.sin(angle)*length/2);context.stroke();}else{context.fillStyle=grain[seed%grain.length];context.fillRect(x-1,y-1,2+(seed%2),2);}",
  "    if(style.grainKind==='ice'){const length=5+seed%9,angle=p.angle+((seed%11)-5)*.04;context.strokeStyle=style.grain[seed%style.grain.length];context.lineWidth=1;context.beginPath();context.moveTo(x-Math.cos(angle)*length/2,y-Math.sin(angle)*length/2);context.lineTo(x+Math.cos(angle)*length/2,y+Math.sin(angle)*length/2);context.stroke();}else{context.fillStyle=style.grain[seed%style.grain.length];context.fillRect(x-1,y-1,2+(seed%2),2);}"
 ],
 [
  "if(!usesMaterialRaster()&&track.surface!=='dirt')strokeTrack(ctx,centerLineColor",
  "if(!usesMaterialRaster())strokeTrack(ctx,centerLineColor"
 ]
];
export function withoutRallyDelivery(source){
 if(!source.includes('function historicalTrialKey(key)'))return source;
 for(const [current,previous] of [...edits].reverse()){if(!source.includes(current))throw Error('Rally delivery migration anchor changed');source=source.replace(current,previous);}
 return source.replace("set('v','0.77')","set('v','0.76')");
}
