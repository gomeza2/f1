import assert from 'node:assert/strict';
// b1 changes only Speed's terminal speed and late acceleration; keep old fixtures intact.
export function assertOriginalModels(models,original){
 const current=JSON.parse(JSON.stringify(models));
 assert.equal(current.speed.maxSpeed,260);assert.equal(current.speed.accelerationTaper,.58);
 current.speed.maxSpeed=250;delete current.speed.accelerationTaper;
 assert.deepEqual(current,original,'Model fields changed outside the measured Speed b1 migration');
}
