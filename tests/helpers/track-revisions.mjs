// Explicit accepted-route assertions for historical invariance tests. Never skip a changed path blindly.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {assertRallyRevision,withRallyRevision} from './rally-revision.mjs';
export {withLegacyRally} from './rally-revision.mjs';
const champion=JSON.parse(readFileSync(new URL('../fixtures/champion-0.86.json',import.meta.url),'utf8'));
export function assertKnownTrackRevision(track){
 if(track.name==='CHAMPION ROAD'&&track.layoutVersion===3){
  const hash=createHash('sha256').update(JSON.stringify({points:track.points,samples:track.samples,worldScale:track.worldScale,layoutVersion:track.layoutVersion,roadProfile:track.roadProfile,roadVersion:track.roadVersion,surface:track.surface,defaultBarriers:track.defaultBarriers,dirtRanges:track.dirtRanges})).digest('hex');
  assert.equal(hash,champion.routeHash,'Champion changed outside its declared revision');return true;
 }
 return assertRallyRevision(track);
}
export function withTrackRevisions(source){
 source=withRallyRevision(source);
 return source.includes('const tracks=trackDefs.map(makeTrack)')?source.replace(/\{name:'CHAMPION ROAD'.*?\}(?=\n)/,champion.definition):source;
}
