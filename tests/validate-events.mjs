import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game:g,element:e}=loadGame();
function finish(dnf=false){g.cars.forEach((c,i)=>{c.done=!(dnf&&i===0);c.lap=c.done?3:1;c.finishTime=c.done?60+i:null;c.lapTimes=c.done?[20,20,20+i]:[];});g.setElapsed(65);g.finishRace();}
for(const mode of ['solo','duo'])for(const count of [2,3,4]){
 e('eventType').value='quick';e('localPlayerCount').value=String(count);g.start(mode,13);finish(true);
 assert.ok(Object.values(g.championship).every(points=>points===0));assert.match(e('resultText').textContent,/PARTIDA RÁPIDA/);assert.doesNotMatch(e('resultText').textContent,/PTS|CAMPEÓN/);assert.notEqual(e('resultTitle').textContent,'¡CAMPEONATO TERMINADO!');assert.equal(e('nextBtn').textContent,'REVANCHA ↻');
 e('eventType').value='championship';e('nextBtn').onclick();assert.equal(g.track.name,'INDUSTRIAL MIX');finish();assert.ok(Object.values(g.championship).every(points=>points===0),'Revenge switched format from the active race');
}
e('eventType').value='championship';g.start('solo',12);finish();assert.equal(g.championship.player1,25);assert.match(e('seasonCaption').textContent,/1 CARRERA/);e('nextBtn').onclick();assert.equal(g.track.name,'INDUSTRIAL MIX');finish();assert.equal(g.championship.player1,50);assert.equal(e('resultTitle').textContent,'¡CAMPEONATO TERMINADO!');assert.equal(e('nextBtn').textContent,'NUEVA TEMPORADA ↻');e('nextBtn').onclick();assert.equal(g.track.name,'SUNSET CIRCUIT');assert.equal(g.championship.player1,0);
// Geometry/driving remain canonical; race formatting does not retune the simulation.
assert.equal(g.CAR_MODELS.speed.maxSpeed,260);assert.equal(g.PHYSICS_VERSION,6);
console.log('PASS: independent quick race/revenge, DNF and no championship points, active format snapshot, last-track title, local 2–4, preserved championship advancement/final/reset and original driving version.');
