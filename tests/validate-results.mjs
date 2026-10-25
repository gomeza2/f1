import assert from 'node:assert/strict';
import {loadGame} from './helpers/game-harness.mjs';
const {game,element}=loadGame();element('opponentCount').value='3';game.start('solo',0);
function finish(order){for(const [index,player] of order.entries()){const car=game.cars.find(c=>c.player===player);car.done=true;car.finishTime=60+index*2;car.lap=3;car.lapTimes=[20,21,19+index*2];}game.setElapsed(80);game.finishRace();}
finish([1,2,0]);
assert.deepEqual(Array.from(game.seasonStandings(),e=>[e.car.player,e.points,e.rank]),[[1,25,1],[2,18,2],[0,15,3],[3,0,4]]);
const raceHTML=element('raceRows').innerHTML,seasonHTML=element('seasonRows').innerHTML;
assert.ok(raceHTML.indexOf('CPU 1')<raceHTML.indexOf('FURIA'));assert.ok(raceHTML.indexOf('FURIA')<raceHTML.indexOf('P1'));
assert.match(raceHTML,/SIN TERMINAR/);assert.match(raceHTML,/\+00:04\.0/);assert.match(raceHTML,/00:19\.0/);
assert.match(seasonHTML,/total-points">25/);assert.match(seasonHTML,/earned-points">\+0/);
assert.match(element('seasonCaption').textContent,/1 CARRERA DISPUTADA/);
const scores=JSON.stringify(game.championship);game.renderResults(game.raceClassification());game.finishRace();assert.equal(JSON.stringify(game.championship),scores,'Rendering or repeated finish awarded points');
game.start('solo',1,true);finish([0,2,1,3]);
assert.deepEqual(Array.from(game.seasonStandings(),e=>[e.car.player,e.points,e.rank]),[[0,40,1],[1,40,1],[2,36,3],[3,12,4]]);
assert.match(element('seasonCaption').textContent,/2 CARRERAS DISPUTADAS/);
assert.equal((element('seasonRows').innerHTML.match(/<td>1\.º<\/td>/g)||[]).length,2,'Tied championship leaders did not share rank');
// A tied final must not declare one arbitrary champion based on array order.
game.start('duo',13);game.championship.player2=7;finish([0,1]);
assert.match(element('resultText').textContent,/EMPATE EN EL CAMPEONATO: P1 \/ P2 \(25 pts\)/);
assert.equal(element('nextBtn').textContent,'NUEVA TEMPORADA ↻');element('nextBtn').onclick();
assert.equal(game.track.name,'SUNSET CIRCUIT');assert.equal(game.championship.player1,0);assert.equal(game.championship.player2,0);
// Every allowed CPU count and local mode keeps the expected number of rows and identities.
for(const count of [1,2,3]){element('opponentCount').value=String(count);game.start('solo',2);finish(game.cars.map(c=>c.player));assert.equal((element('raceRows').innerHTML.match(/<tr/g)||[]).length,count+1);assert.equal((element('seasonRows').innerHTML.match(/<tr/g)||[]).length,count+1);}
game.start('duo',0);finish([1]);assert.match(element('raceRows').innerHTML,/P2/);assert.match(element('raceRows').innerHTML,/SIN TERMINAR/);assert.equal(game.championship.player1,0);assert.equal(game.championship.player2,25);
console.log('PASS: race order/times/gaps/best laps, DNF zero points, separate race and season totals, stable identities across stages, shared tied ranks and final title, single award, season reset, 1–3 CPUs and local two-player.');
