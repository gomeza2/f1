import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game:g,element:e}=loadGame();g.start('solo',0);const [other,car]=g.cars;
const loc=()=>g.nearestOnTrack(car.x,car.y),plan=()=>g.aiBoundarySpeed(car,loc());
// Predict the same straight and circular motion, with zero yaw/speed safe and immutable inputs.
const still={x:4,y:7,heading:.6,speed:0,yawRate:0};assert.deepEqual(JSON.parse(JSON.stringify(g.projectVehicle(still,.5))),{x:4,y:7});
for(const sign of [-1,1]){const v={x:0,y:0,heading:0,speed:100,yawRate:sign*Math.PI},p=g.projectVehicle(v,.5),r=100*g.WORLD_SPEED_SCALE/Math.PI;assert.ok(Math.abs(p.x-r)<1e-10&&Math.abs(p.y-sign*r)<1e-10);}
// Both road sides: anticipation before reaching the edge, not an invisible wall.
for(const sign of [-1,1]){
 g.placeCar(car,180,sign*26);car.speed=180;car.heading+=sign*.5;car.yawRate=0;car.aiManeuver={type:'alongside'};
 const initial=JSON.stringify(car),ground=g.terrainAt(car.x,car.y),limit=plan();assert.equal(ground.offroad,false);assert.ok(limit>=30&&limit<car.speed,'Outward motion did not request earlier braking');assert.equal(JSON.stringify(car),initial,'Planner directly changed the vehicle');
 car.aiManeuver.type='clear';assert.equal(plan(),Infinity,'Free pace was changed');car.aiManeuver=null;assert.equal(plan(),Infinity,'Absent traffic intent caused braking');
 car.aiManeuver={type:'alongside'};car.speed=40;assert.equal(plan(),Infinity,'Low-speed recovery was capped');
 // Same lateral position with a trajectory pointing inward: no new restriction.
 car.speed=100;car.heading=g.sampleAt(180).angle-sign*.3;assert.equal(plan(),Infinity,'Inward recovery was slowed');
 // Already inside the buffer, heading back into the road, should also keep recovering.
 g.placeCar(car,180,sign*(g.roadHalfWidthAt(180)-3));car.speed=80;car.heading-=sign*.5;car.yawRate=0;car.aiManeuver={type:'alongside'};assert.equal(plan(),Infinity,'Returning from the shoulder was stuck under the boundary cap');
}
// World widths and road profiles determine the forecast; no metal wall is required.
e('barrierMode').value='open';g.start('solo',0);const a=g.cars[1],obstacle=g.cars[0];g.placeCar(a,180,25);g.placeCar(obstacle,185,-5);a.speed=180;a.heading+=.5;obstacle.speed=180;const x=a.x,y=a.y,speed=a.speed;
g.physics(a,1,1/60);assert.notEqual(a.aiManeuver.type,'clear');assert.ok(a.aiTargetSpeed<speed);assert.ok(a.speed<speed);assert.ok(speed-a.speed<=(g.CAR_MODELS.balanced.braking+30)/60+1e-9,'Boundary planner added braking force');assert.ok(Math.hypot(a.x-x,a.y-y)<=speed*g.WORLD_SPEED_SCALE/60+1e-8,'Boundary planner moved the car outside physics');
console.log('PASS: immutable shared arc prediction, both road sides before actual runoff, free/absent traffic and low-speed preservation, inward/shoulder recovery, open roads and braking/motion under shared physical limits.');
