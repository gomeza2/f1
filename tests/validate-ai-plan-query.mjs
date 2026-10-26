import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game}=loadGame();let checks=0;
function reference(progress,model,driver,hand,lane){let speed=model.maxSpeed*driver.pace;for(const point of game.aiSpeedPlan){const distance=((point.progress-progress)%game.track.length+game.track.length)%game.track.length;if(distance>240)continue;const planned=hand&&point.curvature>1/180?Math.max(point.speed,point.driftSpeed*.98):point.speed;const corner=planned*driver.pace*Math.sqrt(Math.max(.12,Math.min(1,1-point.signedCurvature*lane)));speed=Math.min(speed,Math.sqrt(corner*corner+2*model.braking*driver.brakingMargin*distance/game.WORLD_SPEED_SCALE));}return speed;}
for(const stage of [0,3,6,13]){
 game.start('solo',stage);
 const positions=[-241,-1,0,1,11,12,13,game.track.length-241,game.track.length-1,game.track.length,game.track.length+1];
 for(let i=0;i<40;i++)positions.push(game.track.length*(i*.61803398875%1));
 for(const progress of positions)for(const model of [game.CAR_MODELS.balanced,game.CAR_MODELS.corner])for(const driver of Object.values(game.AI_DRIVERS))for(const hand of [false,true])for(const lane of [-30,0,30]){assert.ok(Math.abs(game.aiTargetSpeed(progress,model,driver,hand,lane)-reference(progress,model,driver,hand,lane))<1e-8,`Envelope differs near ${progress}`);checks++;}
 if(stage===3){let reads=0;for(const point of game.aiSpeedPlan){const value=point.progress;Object.defineProperty(point,'progress',{get(){reads++;return value},configurable:true});}game.aiTargetSpeed(200,game.CAR_MODELS.balanced,game.AI_DRIVERS.normal,true);assert.ok(reads<64,`Long track still scanned ${reads} entries`);console.log(`QUERY: ${game.aiSpeedPlan.length} plan entries; ${reads} progress reads for one horizon.`);}
}
console.log(`PASS: ${checks} envelope comparisons against independent full scan, negative/wrapped distances, last/first sample, different models/difficulties and handbrake modes and inner/outer lanes; long-track query bounded to the braking horizon.`);
