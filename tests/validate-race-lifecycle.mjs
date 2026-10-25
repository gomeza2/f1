import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
let serial=0,now=0;const pending=new Map();
const frameScheduler={request(callback){const id=++serial;pending.set(id,callback);return id},cancel(id){pending.delete(id)}};
const {game,element,document,documentEvents}=loadGame({frameScheduler});
function frame(){const callbacks=[...pending.values()];pending.clear();now+=16;callbacks.forEach(callback=>callback(now));}
// A low rendering rate must not turn the 3-second countdown into 100 rendered frames.
game.start('solo',0);
for(const remaining of [2,1,0]){const callbacks=[...pending.values()];pending.clear();now+=1000;callbacks.forEach(callback=>callback(now));assert.equal(game.countdown,remaining,'Countdown was tied to the capped simulation delta');}
now=0;
game.start('solo',0);game.setCountdown(0);assert.equal(pending.size,1);
for(let i=0;i<100;i++){game.togglePause();assert.equal(pending.size,0,'Paused race kept a scheduled frame');assert.equal(element('pauseBtn')['aria-pressed'],'true');game.togglePause();assert.equal(pending.size,1,'Rapid resume created duplicate animation loops');}
frame();assert.equal(pending.size,1,'One frame created multiple successor frames');
// Pause clears held controls: resuming cannot keep accelerating without a fresh key press.
game.setKeys({w:true});game.togglePause();game.togglePause();const car=game.cars[0];car.speed=50;game.physics(car,0,1/60);assert.ok(car.speed<50,'Pause left throttle latched');
const visibility=documentEvents.get('visibilitychange');assert.equal(typeof visibility,'function');
document.hidden=true;visibility();assert.equal(game.paused,true);assert.equal(pending.size,0);const snapshot=JSON.stringify(game.cars);frame();assert.equal(JSON.stringify(game.cars),snapshot,'Hidden paused race advanced');
visibility();assert.equal(game.paused,true,'Repeated hidden event resumed the race');document.hidden=false;visibility();assert.equal(game.paused,true,'Returning to tab resumed without a player action');assert.equal(pending.size,0);
game.togglePause();assert.equal(pending.size,1);assert.match(element('pauseBtn').textContent,/PAUSA/);
game.togglePause();game.start('duo',1);assert.equal(game.paused,false);assert.equal(element('pauseBtn')['aria-pressed'],'false');assert.equal(pending.size,1,'Restart while paused leaked frames');
element('backBtn').onclick();assert.equal(pending.size,0);visibility();assert.equal(game.running,false);
for(const [time,expected] of [[0,'00:00.0'],[.04,'00:00.0'],[.06,'00:00.1'],[59.94,'00:59.9'],[59.96,'01:00.0'],[60,'01:00.0'],[119.96,'02:00.0'],[3599.96,'60:00.0']])assert.equal(game.format(time),expected,`Wrong timer rounding at ${time}`);
for(const time of [NaN,Infinity,-1,undefined])assert.equal(game.format(time),'--:--.-');
console.log('PASS: 100 rapid pause/resume cycles keep one loop, immediate paused frame/button state, cleared throttle, hidden-tab pause/manual return, restart/menu cleanup, and decisecond rounding across minute boundaries.');
