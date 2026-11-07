// Actual game and room server on one origin; no game-state instrumentation.
const {chromium} = require('playwright');
const {createApp} = require('../server/index.cjs');
const assert = require('node:assert/strict');
(async () => {
  const app = createApp(), errors = [];
  let browser;
  try {
    const url = await app.listen();
    browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox']});
    const pages = [];
    for (let i = 0; i < 2; i++) {
      const context = await browser.newContext();
      // An obsolete saved public address must not break this deployment.
      await context.addInitScript(() => localStorage.setItem('pixelGP.onlineServer.v1', 'https://obsolete.invalid'));
      const page = await context.newPage(); pages.push(page);
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url.http);
      await page.click('#onlineSetupBtn');
      await page.waitForFunction(() => !document.getElementById('onlineCreate').disabled);
      assert.equal(await page.locator('#onlineServer').inputValue(), url.http);
      await page.click('#onlineInspect');await page.waitForFunction(()=>document.getElementById('onlineDiagnostic').textContent.includes('WEBSOCKET CONFIRMADO'));assert.equal(app.service.rooms.size,i===0?0:1,'Diagnostic created an extra room');
      if (i === 0) await page.click('#onlineCreate');
      else {
        await page.fill('#onlineCode', await pages[0].locator('#onlineRoomCode').textContent());
        await page.click('#onlineJoin');
      }
      await page.waitForSelector('#onlineRoom:not(.hidden)');
    }
    await pages[0].waitForFunction(() => document.querySelectorAll('#onlinePilots li').length === 2);
    assert.deepEqual(errors, []);
    console.log('PASS: single-origin game, automatic server selection despite stale saved URL, two isolated browser profiles create/join using actual UI without entering a server address');
  } finally { if (browser) await browser.close(); await app.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
