import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const revision=JSON.parse(readFileSync(new URL('../fixtures/rally-0.77.json',import.meta.url),'utf8'));
// Historical invariance tests use the explicitly reviewed new route snapshot, never a blind skip.
export function assertRallyRevision(t){
 if(t.name!=='RALLY CANYON'||t.layoutVersion!==3)return false;
 const hash=createHash('sha256').update(JSON.stringify({points:t.points,samples:t.samples,worldScale:t.worldScale,layoutVersion:t.layoutVersion,roadProfile:t.roadProfile,roadVersion:t.roadVersion,surface:t.surface,defaultBarriers:t.defaultBarriers,dirtRanges:t.dirtRanges})).digest('hex');
 assert.equal(hash,revision.routeHash,'Rally changed outside its declared route revision');return true;
}
// Give the historical inline geometry reference this declared route only; all other paths stay frozen.
export function withRallyRevision(source){
 if(source.includes("const tracks=trackDefs.map(makeTrack)"))return source.replace(/\{name:'RALLY CANYON'.*?\},(?=\n)/,revision.definition);
 return source;
}

// Preserve the original traffic/pace budgets on the original layout. New Rally has its own race suite.
export function withLegacyRally(source){
 const original=JSON.parse(readFileSync(new URL('../fixtures/rally-0.76.json',import.meta.url),'utf8'));
 const pattern=/\{name:'RALLY CANYON'.*?\},(?=\n)/;
 assert.ok(pattern.test(source),'Missing Rally definition in geometry reference');
 return source.replace(pattern,original.definition);
}
