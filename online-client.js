/* WebSocket transport and bounded presentation interpolation. No vehicle simulation. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PixelOnlineClient=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function endpoint(value,secure=false){
  const url=new URL(value);if(url.protocol==='https:')url.protocol='wss:';if(url.protocol==='http:')url.protocol='ws:';
  if(!['ws:','wss:'].includes(url.protocol)||url.username||url.password||url.search||url.hash)throw new Error('Dirección de servidor inválida.');
  if(secure&&url.protocol!=='wss:')throw new Error('Esta página necesita un servidor seguro HTTPS/WSS.');
  if(url.pathname==='/'||url.pathname==='')url.pathname='/ws';if(url.pathname!=='/ws')throw new Error('Usá la dirección del servidor o su ruta /ws.');return url.href;
 }
 function create({simulation,WebSocketImpl=globalThis.WebSocket,now=()=>performance.now(),onMessage=()=>{},onStatus=()=>{},timers=null}){
  let socket=null,url='',session=null,room=null,stopped=true,retry=null,handshake=null,deadline=0,seq=0,raceId=null,frames=[],received=-Infinity,lastTick=-1,joined=false;
  const setTimer=(fn,ms)=>timers?timers.setTimeout(fn,ms):setTimeout(fn,ms),clearTimer=id=>timers?timers.clearTimeout(id):clearTimeout(id);
  let connectDeadline=0,request=null,renderTick=-Infinity;
  const notify=(state,detail='')=>onStatus(state,detail);
  function send(message){if(socket?.readyState===1){socket.send(JSON.stringify(message));return true;}return false;}
  function forget(){joined=false;session=null;room=null;frames=[];raceId=null;seq=0;lastTick=-1;received=-Infinity;renderTick=-Infinity;request=null;connectDeadline=0;}
  function close(){stopped=true;clearTimer(retry);clearTimer(handshake);const old=socket;socket=null;old?.close(1000,'left');forget();}
  function connect(value,action){close();url=endpoint(value,globalThis.location?.protocol==='https:');stopped=false;request=action;connectDeadline=now()+90000;notify('connecting');open();}
  function lost(detail){stopped=true;clearTimer(retry);clearTimer(handshake);const old=socket;socket=null;old?.close();forget();notify('lost',detail);}
  function open(){
   if(stopped)return;const limit=session?deadline:connectDeadline;
   if(now()>=limit){lost(session?'No se pudo recuperar la conexión. La carrera continúa en el servidor.':'El servidor no respondió en 90 segundos. Podés volver a intentar.');return;}
   joined=false;let ws;try{ws=new WebSocketImpl(url);}catch{lost('No se pudo abrir la conexión segura al servidor.');return;}socket=ws;let welcomed=false;
   handshake=setTimer(()=>{if(socket===ws){if(now()>=limit)lost('El servidor no respondió a tiempo. Volvé a intentar.');else ws.close();}},Math.min(session?5000:10000,limit-now()));
   ws.onmessage=event=>{
    if(socket!==ws||stopped)return;let m;try{m=JSON.parse(event.data);}catch{lost('Respuesta de servidor inválida.');return;}
    if(m.type==='hello'){
     if(m.protocol!==1||m.simulation!==simulation){lost('Versiones incompatibles. Actualizá el juego y el servidor.');return;}
     send({type:'hello',protocol:1,simulation});return;
    }
    if(m.type==='welcome'){welcomed=true;clearTimer(handshake);if(session){handshake=setTimer(()=>{if(socket===ws&&!joined)lost('La reconexión venció antes de confirmar la sesión.');},Math.max(0,deadline-now()));send({type:'resume',code:session.code,token:session.resumeToken});}else{notify('connected');const action=request;request=null;if(action)send(action);}return;}
    if(m.type==='session'){clearTimer(handshake);joined=true;session={code:m.code,pilotId:m.pilotId,resumeToken:m.resumeToken};room=m.room;deadline=0;notify('connected');}
    if(m.type==='room')room=m.room;
    if(m.type==='snapshot'){
     if(m.raceId!==raceId){raceId=m.raceId;seq=0;frames=[];lastTick=-1;renderTick=-Infinity;}
     if(m.tick<lastTick)return;lastTick=m.tick;
     const ack=m.inputs.find(p=>p.pilotId===session?.pilotId)?.seq??-1;seq=Math.max(seq,ack+1);
     const at=now();if(frames.at(-1)?.tick===m.tick)frames.pop();frames.push({tick:m.tick,cars:m.state.cars});frames=frames.slice(-6);received=at;
    }
    if(m.type==='error'&&['bad_token','version_mismatch','not_in_room'].includes(m.code)){lost(m.code==='bad_token'?'La reconexión venció. Volvé a unirte desde la sala.':'La sesión dejó de estar disponible.');return;}
    if(['left','room_closed'].includes(m.type)){forget();}
    onMessage(m);
   };
   ws.onerror=()=>{};
   ws.onclose=()=>{
    if(socket!==ws||stopped)return;clearTimer(handshake);socket=null;joined=false;
    if(!session){if(!welcomed&&now()<connectDeadline){notify('warming');retry=setTimer(open,Math.min(1000,connectDeadline-now()));}else lost('No se pudo conectar. Revisá el servidor y volvé a intentar.');return;}
    if(!deadline)deadline=now()+8500;
    if(now()>=deadline){lost('No se pudo recuperar la conexión. La carrera continúa en el servidor.');return;}
    notify('reconnecting');retry=setTimer(open,Math.min(500,deadline-now()));
   };
  }
  function input(controls){if(!joined||!session||!raceId||!['countdown','running'].includes(room?.phase))return false;return send({type:'input',raceId,seq:seq++,controls});}
  function pose(car,at=now()){
   if(frames.length<2||car.retired||car.done)return car;
   const latest=frames.at(-1),target=Math.min(latest.tick,Math.max(frames[0].tick,renderTick,latest.tick-6+Math.max(0,at-received)/(1000/60)));renderTick=target;
   let left=frames[0],right=latest;for(const frame of frames){if(frame.tick<=target)left=frame;if(frame.tick>=target){right=frame;break;}}
   const a=left.cars.find(c=>c.player===car.player),b=right.cars.find(c=>c.player===car.player);if(!a||!b)return car;
   const fraction=right.tick===left.tick?1:Math.max(0,Math.min(1,(target-left.tick)/(right.tick-left.tick)));
   if(Math.hypot(b.x-a.x,b.y-a.y)>160)return car;
   const delta=Math.atan2(Math.sin(b.heading-a.heading),Math.cos(b.heading-a.heading));
   return {...car,x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction,heading:a.heading+delta*fraction};
  }
  return {connect,close,send,input,pose,get session(){return session&&{...session};},get room(){return room;},get tick(){return lastTick;},get stale(){return now()-received>500;}};
 }
 return {create,endpoint};
});
