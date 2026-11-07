'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const net = require('node:net');
const {runtimeOptions} = require('../index.cjs');
const {Peer} = require('./helpers.cjs');
test('production configuration uses hosting PORT, public bind and exact origins', () => {
  assert.deepEqual(runtimeOptions({PORT:'10000',PGP_PORT:'8787',PGP_ALLOWED_ORIGINS:'https://gomeza2.github.io,https://pixel-grand-prix-rooms.onrender.com'}), {port:10000,host:'0.0.0.0',allowedOrigins:['https://gomeza2.github.io','https://pixel-grand-prix-rooms.onrender.com']});
  assert.equal(runtimeOptions({PGP_PORT:'8788',PGP_HOST:'127.0.0.1'}).port,8788);
  for(const port of ['abc','-1','65536']) assert.throws(()=>runtimeOptions({PORT:port}));
  for(const origin of ['https://gomeza2.github.io/f1/','*','https://user:pass@example.com','wss://example.com']) assert.throws(()=>runtimeOptions({PGP_ALLOWED_ORIGINS:origin}));
});
test('actual production command serves health/protocol and real create/join, then shuts down', {timeout:15000}, async () => {
  const reserve=net.createServer();reserve.listen(0,'127.0.0.1');await once(reserve,'listening');const port=reserve.address().port;await new Promise(r=>reserve.close(r));
  const child=spawn(process.execPath,['server/index.cjs'],{cwd:require('node:path').resolve(__dirname,'../..'),env:{...process.env,PORT:String(port),PGP_PORT:'1',PGP_HOST:'0.0.0.0',PGP_ALLOWED_ORIGINS:'https://gomeza2.github.io'},stdio:['ignore','pipe','pipe']});
  const exited=once(child,'exit');let logs='';child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);const peers=[];
  try{
    for(let i=0;i<100&&!logs.includes('listening on');i++)await new Promise(r=>setTimeout(r,30));
    assert.match(logs,new RegExp('listening on 0.0.0.0:'+port));
    const base='http://127.0.0.1:'+port,health=await (await fetch(base+'/health')).json(),protocol=await (await fetch(base+'/protocol')).json();
    assert.equal(health.ok,true);assert.equal(health.serverVersion,require('../package.json').version);assert.equal(health.clientBuild,require('../../online-config.json').build);assert.equal(protocol.serverVersion,health.serverVersion);assert.equal(protocol.protocol,1);assert.equal(protocol.simulation,health.simulation);assert.equal(protocol.tracks.length,14);
    for(let i=0;i<2;i++)peers.push(await new Peer(base.replace('http:','ws:')+'/ws').open());
    const session=await peers[0].request({type:'create'},'session');const joined=await peers[1].request({type:'join',code:session.code},'session');assert.equal(joined.code,session.code);assert.equal(joined.room.players.length,2);
  }finally{for(const p of peers)await p.close();child.kill('SIGTERM');const [code]=await exited;assert.equal(code,0,logs);}
});
