import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Execute the real game closure; expose state only inside this test sandbox.
export function loadGame() {
  const elements = new Map();
  const context = new Proxy({}, { get: () => () => {} });
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      value: ({ graphics: 'lite', difficulty: 'normal', stageSelect: '0', barrierMode: 'auto', carModel: 'balanced', carColor: 'pink', opponentCount: '1' })[id] || '',
      classList: { add() {}, remove() {}, toggle() {} }, style: { setProperty() {} },
      getContext: () => context, getBoundingClientRect: () => ({ width: 1000, height: 640 }),
      addEventListener() {}, append() {},
    });
    return elements.get(id);
  }
  const sandbox = {
    document: { body:element('body'),getElementById: element, createElement: () => element(Symbol()), querySelectorAll: () => [], addEventListener() {} },
    window: { addEventListener() {} }, localStorage: { getItem: () => null, setItem() {} },
    performance: { now: () => 0 }, requestAnimationFrame: () => 1, cancelAnimationFrame() {}, console,
  };
  vm.createContext(sandbox);
  const source = readFileSync(new URL('../../script.js', import.meta.url), 'utf8');
  const expose = `globalThis.testGame={start,physics,placeCar,setupCar,aiTraffic,trafficApproach,AI_DRIVERS,AI_PERSONALITIES,driverFor,raceClassification,awardPoints,standingsText,finishRace,CAR_MODELS,WORLD_SPEED_SCALE,vehicleHandling,updateSteeringInertia,raceCamera,toggleCamera,overviewZoom,usesSplitScreen,lapRecordKey,saveBestLap,currentLapTime,updateTelemetry,
    get championship(){return championship},get bestLapRecords(){return bestLapRecords},sampleAt,nearestOnTrack,curvatureAt,resolveCollisions,guardrailActive,barrierContoursForTrack,resolveBarrierContact,projectToSegment,closestSegments,
    get decorations(){return decorations},decorationsForTrack,SCENERY_THEMES,TRACK_SCENERY,SCENERY_CLEARANCE,drawSceneryObject,get physicalBarriers(){return physicalBarriers},get guardrailPaths(){return guardrailPaths},
    get checkpoints(){return checkpoints},get tracks(){return tracks},get cars(){return cars},get track(){return track},
    tick(dt){elapsed+=dt;cars.forEach((car,i)=>{if(!car.done)physics(car,i,dt)});const contact=cars.some((a,i)=>!a.done&&cars.slice(i+1).some(b=>!b.done&&Math.hypot(a.x-b.x,a.y-b.y)<23-1e-6));resolveCollisions(dt);return contact},
    setKeys(value){keys=value},setDifficulty(value){difficulty=value}};`;
  vm.runInContext(source.replace(/\}\)\(\);\s*$/, expose + '})();'), sandbox);
  return { game: sandbox.testGame, element };
}
