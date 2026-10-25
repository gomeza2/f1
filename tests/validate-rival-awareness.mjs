import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();element('opponentCount').value='3';game.start('solo',0);
const [car,other,third,fourth]=game.cars;
car.x=0;car.y=0;car.heading=0;car.yawRate=0;car.speed=100;car.aiManeuver={type:'alongside'};
other.x=40;other.y=20;other.heading=0;other.yawRate=0;other.speed=0;
third.x=fourth.x=500;third.y=fourth.y=500;
assert.ok(game.trafficApproach(car,other).clearance<29);
const close=game.aiLookAhead(car);assert.equal(close,34,'Overlap with predicted convergence kept a target across the rival');
other.done=true;assert.equal(game.aiLookAhead(car),55,'Finished car changed the racing line');other.done=false;
other.x=40;other.y=36;other.speed=100;assert.equal(game.aiLookAhead(car),55,'Parallel safe lane unnecessarily shortened the target');
other.x=60;other.y=20;other.speed=0;assert.equal(game.aiLookAhead(car),55,'Distant car disrupted normal anticipation');
other.x=40;car.aiManeuver.type='clear';assert.equal(game.aiLookAhead(car),55,'Free driving changed its anticipation');
car.aiManeuver.type='alongside';other.done=true;third.x=35;third.y=20;third.speed=0;third.heading=0;third.yawRate=0;
assert.equal(game.aiLookAhead(car),close,'A second rival was hidden by the primary opponent');
car.speed=10;assert.equal(game.aiLookAhead(car),9.5,'Stopped-obstacle steering recovery lost its short target');
assert.deepEqual(Array.from(Object.values(game.AI_PERSONALITIES),p=>p.name),['TRAZO','FURIA','ÁPICE']);
for(const count of [1,2,3]){element('opponentCount').value=String(count);game.updateMenuPreview();const names=Object.values(game.AI_PERSONALITIES).map(p=>p.name);for(let i=0;i<3;i++)assert.equal(element('opponentSummary').textContent.includes(names[i]),i<count);}
for(const level of ['easy','normal','hard']){game.setDifficulty(level);for(const personality of ['racer','attacker','precise']){car.personality=personality;const driver=game.driverFor(car);assert.ok(driver.pace<=1&&driver.brakingMargin<=1);assert.equal(driver.handbrake,level!=='easy');}}
// A close overlap may change the target lane faster, but still uses normal physics.
element('opponentCount').value='1';game.start('solo',0);const [obstacle,follower]=game.cars;
game.placeCar(follower,150,0);game.placeCar(obstacle,175,0);follower.speed=100;obstacle.speed=80;
const speed=follower.speed;game.physics(follower,1,1/30);
assert.equal(follower.aiManeuver.type,'alongside');
assert.ok(Math.abs(Math.abs(follower.aiLane)-game.driverFor(follower).laneSpeed*1.5/30)<1e-6,'Close conflict did not establish the reserved lane sooner');
assert.ok(follower.speed-speed<=game.CAR_MODELS.balanced.acceleration/30,'Close conflict added power');
console.log('PASS: nearby converging overlap shortens target; safe parallel, distant and finished rivals do not; all opponents considered, low-speed recovery preserved, named roster matches selected count and difficulty has no added physical power.');
