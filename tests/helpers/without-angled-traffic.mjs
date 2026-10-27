// Reverse only the 0.63 planning correction, preserving old core hashes and a failing-control reference.
export function withoutAngledTraffic(source){
 return source
  .replace(/ \/\/ Angled cars can close sideways[^\n]*\n const approachClosing=[^\n]*\n/,'')
  .replace('  if(closing===0&&converging&&approach.time<.55&&approachClosing>18)speedLimit=Math.min(speedLimit,Math.max(0,car.speed-approachClosing*.75));\n','');
}
