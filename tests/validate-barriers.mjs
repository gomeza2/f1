import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();
let contours=0,checked=0;
for(let stage=0;stage<game.tracks.length;stage++){
 element('barrierMode').value='full';game.start('solo',stage);
 const outlines=game.barrierContoursForTrack();
 assert.ok(outlines.length>=1,`${game.track.name}: missing boundary`);
 for(const outline of outlines){
  contours++;assert.equal(outline.closed,true,`${game.track.name}: open contour in full profile`);
  for(let i=0;i<outline.points.length;i+=5){
   const point=outline.points[i],loc=game.nearestOnTrack(point.x,point.y);
   assert.ok(Math.abs(loc.distance-55)<2,`${game.track.name}: boundary folds into the road (${loc.distance})`);
   checked++;
  }
 }
 const rail=game.physicalBarriers.find(b=>b.kind==='rail'&&game.nearestOnTrack((b.a.x+b.b.x)/2,(b.a.y+b.b.y)/2).progress<200);
 assert.ok(rail);
 // Start just inside a visible rail, with zero velocity: depenetrate without adding speed.
 const x=(rail.a.x+rail.b.x)/2,y=(rail.a.y+rail.b.y)/2,loc=game.nearestOnTrack(x,y);
 const length=Math.hypot(loc.x-x,loc.y-y),nx=(loc.x-x)/length,ny=(loc.y-y)/length;
 const car=game.cars[0];car.heading=Math.atan2(rail.b.y-rail.a.y,rail.b.x-rail.a.x);
 car.x=x+nx*12;car.y=y+ny*12;car.speed=0;
 assert.equal(game.resolveBarrierContact(car,car.x+nx*4,car.y+ny*4),true);
 assert.equal(car.speed,0,'Barrier collision generated speed');
 assert.ok((car.x-x)*nx+(car.y-y)*ny>12,'Car was not pushed back toward the road');
 // A real high-speed step toward the wall must be stopped with a small rebound.
 car.x=x+nx*22;car.y=y+ny*22;car.heading=Math.atan2(-ny,-nx);car.speed=160;car.steer=0;
 game.setKeys({});game.physics(car,0,.03);
 assert.ok(car.speed<80,'Head-on barrier collision kept excessive rebound speed');
 assert.ok(Number.isFinite(car.x)&&Number.isFinite(car.heading));
 assert.ok((car.x-x)*nx+(car.y-y)*ny>=19,'Car capsule crossed the visible wall');
 for(const profile of ['auto','half','corners','open']){
  element('barrierMode').value=profile;game.start('solo',stage);
  if(profile==='open')assert.equal(game.physicalBarriers.length,0,'Open profile has invisible barriers');
  for(const barrier of game.physicalBarriers){
   assert.ok(Number.isFinite(barrier.a.x)&&Number.isFinite(barrier.b.y));
   if(barrier.kind==='rail'){
    const middle=game.nearestOnTrack((barrier.a.x+barrier.b.x)/2,(barrier.a.y+barrier.b.y)/2);
    assert.ok(game.guardrailActive(middle.progress),'Physical rail outside selected profile');
   }else{
    assert.ok(game.nearestOnTrack(barrier.a.x,barrier.a.y).distance>46,'Tire pile lies across the road');
   }
  }
 }
 console.log(`PASS: ${game.track.name}, closed boundary, five profiles, visible rail contact and stopped-car response.`);
}
// Zero-length tire segments and crossing capsules must be supported by the same solver.
const point={x:0,y:0};assert.equal(game.closestSegments({x:-2,y:0},{x:2,y:0},point,point).distanceSq,0);
assert.equal(game.closestSegments({x:-2,y:0},{x:2,y:0},{x:0,y:-2},{x:0,y:2}).distanceSq,0);
console.log(`PASS: ${contours} closed contours and ${checked} geometric probes; rail and tire collision primitives.`);
