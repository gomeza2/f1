'use strict';
const fs = require('node:fs');
const path = require('node:path');
const P = require('../protocol.cjs');
const file = path.join(__dirname, '../../online-config.json');
const build = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8').match(/name="application-version" content="([^"]+)"/)?.[1];
if (!build) throw new Error('Missing frontend build version');
const expected = {build, protocol: P.PROTOCOL, simulation: P.SIMULATION, serverUrl: ''};
if (process.argv.includes('--check')) {
  const current = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (current.build !== build || current.protocol !== expected.protocol || current.simulation !== expected.simulation) throw new Error('Online client simulation mismatch: run node server/scripts/client-config.cjs');
  console.log('PASS: online client manifest matches canonical simulation');
} else {
  if (fs.existsSync(file)) expected.serverUrl = JSON.parse(fs.readFileSync(file, 'utf8')).serverUrl || '';
  fs.writeFileSync(file, JSON.stringify(expected, null, 2) + '\n');
}
