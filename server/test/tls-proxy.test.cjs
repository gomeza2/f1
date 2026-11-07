'use strict';
// Local TLS terminator models the Render edge; it is not an external deployment check.
const {test}=require('node:test'),assert=require('node:assert/strict');
const https=require('node:https'),net=require('node:net'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {execFileSync}=require('node:child_process'),{once}=require('node:events');
const {createApp}=require('../index.cjs'),{Peer}=require('./helpers.cjs');
test('verified TLS WSS through a terminating proxy accepts Pages/Render origins and rejects others', {timeout:15000},async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'pgp-tls-')),app=createApp({allowedOrigins:['https://gomeza2.github.io','https://pixel-grand-prix-rooms.onrender.com']}),peers=[],tunnels=new Set();let proxy;
 try{
  execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',path.join(dir,'key.pem'),'-out',path.join(dir,'cert.pem'),'-days','1','-subj','/CN=127.0.0.1','-addext','subjectAltName=IP:127.0.0.1'],{stdio:'ignore'});
  const backend=await app.listen(),backendPort=Number(new URL(backend.http).port),ca=fs.readFileSync(path.join(dir,'cert.pem'));
  proxy=https.createServer({key:fs.readFileSync(path.join(dir,'key.pem')),cert:ca});
  proxy.on('upgrade',(req,socket,head)=>{
   const upstream=net.connect(backendPort,'127.0.0.1');tunnels.add(upstream);
   upstream.on('connect',()=>{upstream.write(req.method+' '+req.url+' HTTP/'+req.httpVersion+'\r\n'+req.rawHeaders.reduce((text,value,i)=>text+value+(i%2?'\r\n':': '),'')+'\r\n');if(head.length)upstream.write(head);socket.pipe(upstream).pipe(socket);});
   upstream.on('error',()=>socket.destroy());socket.on('error',()=>upstream.destroy());socket.on('close',()=>upstream.destroy());upstream.on('close',()=>{tunnels.delete(upstream);socket.destroy();});
  });
  proxy.listen(0,'127.0.0.1');await once(proxy,'listening');const url='wss://127.0.0.1:'+proxy.address().port+'/ws';
  for(const origin of ['https://gomeza2.github.io','https://pixel-grand-prix-rooms.onrender.com'])peers.push(await new Peer(url,{ca,origin}).open());
  const session=await peers[0].request({type:'create'},'session'),joined=await peers[1].request({type:'join',code:session.code},'session');assert.equal(joined.room.players.length,2);
  const bad=new Peer(url,{ca,origin:'https://other.invalid'});const [,response]=await once(bad.ws,'unexpected-response');assert.equal(response.statusCode,403);response.resume();bad.ws.terminate();
 }finally{for(const peer of peers)await peer.close();for(const tunnel of tunnels)tunnel.destroy();if(proxy)await new Promise(r=>proxy.close(r));await app.close();fs.rmSync(dir,{recursive:true,force:true});}
});
