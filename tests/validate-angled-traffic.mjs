import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadGame} from './helpers/game-harness.mjs';
import {withoutAngledTraffic} from './helpers/without-angled-traffic.mjs';
const source=readFileSync(new URL('../script.js',import.meta.url),'utf8');
const snapshot=JSON.parse(readFileSync(new URL('./fixtures/angled-contact-0.63.json',import.meta.url),'utf8')),pair=snapshot.cars;
function crossing(sourceOverride){const f=loadGame({sourceOverride}),g=f.game;g.start('solo',snapshot.stage);const [other,car]=g.cars;Object.assign(car,pair[0]);Object.assign(other,pair[1]);const before=JSON.stringify(g.cars),decision=g.aiTraffic(car,g.nearestOnTrack(car.x,car.y),g.driverFor(car),1/60),approach=g.trafficApproach(car,other);assert.deepEqual(JSON.parse(JSON.stringify(g.cars.map(c=>[c.x,c.y,c.speed]))),JSON.parse(before).map(c=>[c.x,c.y,c.speed]),'Planning applied physical movement/braking');return {f,car,other,decision,approach};}
const old=crossing(withoutAngledTraffic(source)),now=crossing(source);
assert.ok(old.decision.speedLimit>old.car.speed,'Snapshot no longer reproduces ignored angled closure');assert.ok(now.approach.clearance<23&&now.approach.time<=.125);assert.ok(now.other.speed>now.car.speed);assert.ok(now.decision.speedLimit<now.car.speed-25,'A faster rival masked the lateral collision');
const initial=now.car.speed;now.f.game.physics(now.car,1,1/60);assert.ok(now.car.speed<initial);assert.ok(initial-now.car.speed<=(230+30)/60+1e-8,'Planner applied extra braking force');assert.equal(now.car.handbrake,false);
// Side-by-side, equal-speed parallel racing remains free: do not brake merely for proximity.
const {game:g,element:e}=now.f;e('barrierMode').value='open';g.start('solo',9);g.placeCar(g.cars[1],400,-16);g.placeCar(g.cars[0],408,16);g.cars.forEach(c=>c.speed=180);assert.equal(g.aiTraffic(g.cars[1],g.nearestOnTrack(g.cars[1].x,g.cars[1].y),g.driverFor(g.cars[1]),1/60).speedLimit,Infinity);
console.log(JSON.stringify({before:old.decision,after:now.decision,approach:now.approach,actualBraking:initial-now.car.speed}));
console.log('PASS: actual Night angled-contact snapshot now requests shared physical braking despite faster rival, immutable planning, impending crossing forecast and free parallel side-by-side racing.');
