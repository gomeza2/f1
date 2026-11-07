'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createApp} = require('../index.cjs');
test('single service serves the complete game without exposing repository or backend files', async () => {
  const app = createApp();
  try {
    const url = await app.listen();
    const html = await (await fetch(url.http)).text();
    assert.match(html, /<title>PIXEL GRAND PRIX<\/title>/);
    const files = ['style.css', 'script.js', 'driving-core.js', 'track-core.js', 'race-rules.js', 'race-session.js', 'ghost-lap.js', 'engine-audio.js', 'online-client.js', 'online-prediction.js', 'online-config.json'];
    for (const file of files) {
      const response = await fetch(url.http + '/' + file + '?v=0.86');
      assert.equal(response.status, 200, file);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.ok((await response.text()).length > 100, file);
    }
    for (const file of ['.git/config', 'server/index.cjs', 'server/package.json', 'README.md', 'tests/browser-release.cjs', '%2e%2e%2fserver/index.cjs']) {
      assert.equal((await fetch(url.http + '/' + file)).status, 404, file);
    }
    const config = await (await fetch(url.http + '/online-config.json')).json();
    assert.equal(config.sameOrigin, true);
    assert.equal(config.simulation, require('../../online-config.json').simulation);
    assert.equal((await fetch(url.http, {method: 'POST'})).status, 405);
    assert.equal((await (await fetch(url.http + '/health')).json()).ok, true);
  } finally { await app.close(); }
});
