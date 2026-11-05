# Simulación compartida — estado 0.82

`driving-core.js` es el primer bloque extraído del motor real. Lo usa `script.js` para conducir en el navegador y puede importarse directamente en Node. No necesita DOM, Canvas, audio, almacenamiento, reloj externo ni dependencias de npm.

**Desde 0.79 hay backend local de salas privadas en `server/`; desde 0.80 el cliente online ya se integra con Canvas/HUD; el despliegue y pruebas humanas de latencia siguen pendientes.** Desde 0.72, geometría/barreras, terreno y gates están en `track-core.js`; desde 0.74, contactos/progreso en `race-rules.js`. En 0.78, `race-session.js` posee coches/reloj/ciclo de vida y clasificación/puntos base, se integra en el navegador y ejecuta carreras completas en Node. Cámaras/audio/partículas, entradas de dispositivo, política CPU y temporada/guardado permanecen en sus adaptadores. Dos sesiones de dos coches completan vueltas independientes en las pruebas.

## Una implementación de conducción

El módulo contiene los modelos, parámetros de conducción/recuperación y materiales canónicos. Las superficies conservan apariencia y respuesta en una definición común. El navegador mantiene alias a esas reglas y funciones; no conserva una segunda fórmula de aceleración, giro o frenado.

API versión 1, distinta de la versión física p6/balance b1/reloj s1 del juego. Reglas por instancia copiadas y congeladas; cada coche tiene su propio estado mutable serializable. Intercalar dos motores/coches no comparte steer, velocidad, temporizador de reversa ni posición.

| API | Responsabilidad |
|---|---|
| `create()` | Motor independiente con reglas inmutables. |
| `createState(model)` | Estado de movimiento nuevo; rechaza modelos desconocidos. |
| `humanControls(state, input, dt, allowReverse=true)` | Filtro de dirección, intención/retardo de reversa y comandos de pedales. `false` impide reversa por un freno de seguridad. |
| `stepVehicle(state, controls, model, surface, safeSpeed, dt)` | Velocidad firmada, manejo/yaw, derrape escalar previo, ruedas y posición. |
| `accelerationAtSpeed`, `vehicleHandling` | Consultas compartidas usadas también por la planificación CPU actual. |
| `applyGroundDrag` | Resistencia firmada; el adaptador consulta primero la geometría real del terreno. |

Las funciones de bajo nivel reciben estado/contexto e inputs completos y validados. No son un parser de mensajes de red; modelos, terreno, velocidad de curva y dt no deben aceptarse del cliente como autoridad.

```js
const {create} = require('./driving-core.js');
const engine = create();
const car = engine.createState('speed');
const dt = 1 / 60;
for (let tick = 0; tick < 300; tick++) {
  const command = engine.humanControls(car, {
    throttle: 1, brake: 0, steering: 0, hand: false
  }, dt);
  engine.stepVehicle(car, command, engine.rules.models[car.model],
    'asphalt', 220, dt);
}
console.log(car.speed); // 260: recta abstracta, sin carrera ni colisiones.
```

El formato clásico/CJS se elige para conservar los scripts estáticos de Pages y permitir `require` sin bundler. No obliga a mantener ese formato si la próxima extracción necesita una alternativa mejor.

## Orden conservado en el cliente

El controlador genera comandos; la geometría aporta material/curva; el módulo avanza el vehículo; `race-rules.js` aplica terreno/barreras y progreso; sus contactos entre coches se resuelven después del grupo, manteniendo el orden existente. La CPU usa la misma conducción compartida.

No se cambian fuerzas, topes, agarre, trayectoria, reglas de reversa, pistas ni récords p6/b1/s1. No hay un derrape lateral nuevo. Las seis funciones matemáticas trasladadas conservan su cuerpo original y las pruebas comparan además la ejecución real, no solo sus textos.

## Carga y pruebas

HTML carga `driving-core.js` antes de `script.js`, con la misma consulta de versión de recursos. Si un HTML previo en caché omite la nueva etiqueta pero obtiene el main nuevo, el arranque carga la dependencia relativa a ese script y espera antes de habilitar la carrera. Si falla, muestra recarga necesaria y bloquea iniciar. No se incluye otra copia de la física como fallback.

Al cambiar versión de entrega, revisar las URLs del HTML y la versión de dependencia del bootstrap; `browser-release` comprueba su coherencia, el HTML anterior y el fallo de carga. Esto no fuerza renovar todos los HTML ya cacheados ni prueba Pages público.

`validate-shared-driving` compara 140 casos/3.164 pasos de cuatro modelos, siete rutas y cinco secuencias contra la física 0.70 real; además grip/resistencia de los siete materiales y estados aislados, con acceso a DOM/almacenamiento/reloj prohibido al módulo. `browser-core-vectors` compara 28 vectores/140 snapshots entre Node y Chromium: velocidad/timers/flags exactos, y redondeo de posición/ángulos acotado a 1e-10 (máximo observado 1,42e-14). No se promete igualdad binaria universal entre runtimes. `browser-shared-driving` comprueba 16 escenarios de teclado, 96 snapshots y 3.552 llamadas observadas al paso compartido, frente a cero del motor anterior.

## Próximos bloques para online

1. **30.1 — vehículos compartidos: integrado.** Paridad de este componente, sin declarar cerrado el núcleo de carreras.
2. **30.2 — pistas/geometría: integrado en 0.72, con verificación detallada en la evidencia de entrega.** Registro de 14 pistas, secciones/materiales, curvas, checkpoints, zonas de grava y barreras sin Canvas/DOM. Contextos por pista/perfil y geometría inmutable; todavía no son carreras completas.
3. **30.3 — reglas y eventos: integrados en 0.74, sin cerrar toda la carrera.** Terreno/recuperación, contactos, gates/vueltas, consulta de cierre y eventos numerados compartidos. El reloj/estado completo y clasificación/puntos siguen para 30.4; orden CPU preservado.
4. **30.4 — aislamiento de carreras: pendiente.** Dos `RaceState` completos sin globals compartidos, replay/paridad con el juego y pruebas de ciclo de vida. Dos vehículos aislados no acreditan dos salas completas.
5. **32/33 — salas, sincronización y despliegue: pendiente.** El primer online privado puede empezar con humanos 2–4; los controladores CPU offline pueden seguir como adaptadores sobre la misma física, sin bloquear toda la red por rehacer la IA.

Contratos de red y criterios de publicación en [ONLINE_DESIGN.md](ONLINE_DESIGN.md). Ningún ranking local se presenta como resultado online validado.


## Geometría compartida — 0.72

`track-core.js` se carga antes del adaptador y también funciona con `require` en Node, sin importar el juego ni simular un DOM. El navegador usa su registro real y delega las consultas y construcción de barreras a esta misma implementación. No cambia puntos, anchuras, materiales, pianos, colisiones, meta ni claves de récord.

```js
const tracks = require('./track-core.js').create();
const world = tracks.createWorld(10, 'auto'); // Coastline; resuelve a abierto.
const position = tracks.sampleAt(400, world.track);
const nearest = tracks.nearestOnTrack(position.x, position.y, null, world.track);
console.log(world.terrainAt(position.x, position.y, nearest));
console.log(world.barriersNear(position.x, position.y));
```

API versión 1:

- `tracks`: catorce definiciones/muestras/longitudes, congeladas recursivamente por instancia. `rules` centraliza borde, arcén y ancho de grava.
- `sampleAt`, `nearestOnTrack`, `surfaceAtProgress`, `roadSectionAt`, `roadHalfWidthAt`, `roadMaxHalfWidth`, `barrierRadiusAt`, `projectToSegment`, `checkpointsForTrack`: consultas sin efectos; el parámetro de pista es explícito, con la primera como valor predeterminado.
- `runoffBuckets(item)`: índice de segmentos de carretera, fachada de solo lectura con `get(clave)`; arrays congelados. Es un índice amplio para render/materiales; fuera de su cobertura usar `nearestOnTrack` completo. No se expone un Map modificable.
- `createWorld(index, profile='auto')`: valida índice entero/perfil conocido y devuelve contexto inmutable con `track`, `barrierMode`, `features`, `guardrailRanges`, `runoffZones`, `tireBarriers`, `curvatureAt`, `guardrailActive` y `terrainAt`. La consulta de terreno puede recibir la proyección ya calculada.
- `contours`, `guardrailPaths`, `physicalBarriers` y `barriersNear(x,y)`: límites visibles y cápsulas físicas comunes, con índice de colisiones privado. Contornos cacheados e inmutables por pista; cápsulas/índice propios por contexto. Construcción costosa diferida hasta pedir geometría física. La consulta de candidatos conserva el orden del juego anterior.

Las consultas devuelven resultados nuevos donde corresponde; las definiciones, índices y derivados publicados no se pueden editar. Los validadores de entradas de red siguen siendo necesarios: esta API no analiza mensajes ni sustituye controles de autorización.

El cambio de pista activa el nuevo contexto **antes** de planificar la CPU, manteniendo el orden posterior de movimiento/contactos/progreso. Solo los renderizadores de carretera, raster decorativo, Canvas, audio y UI permanecen en el cliente; la respuesta a contactos/progreso se extrae en 0.74; la propiedad del reloj y el estado completo siguen en 30.4.

El bootstrap recupera cualquiera de los dos módulos omitidos por HTML viejo, resolviendo ambas rutas desde la URL del script capturada antes del primer `await`. Falla de forma explícita si no puede cargarlos y bloquea largar. `browser-release` prueba HTML sin ambos módulos y HTML con conducción pero sin pistas, además del fallo individual de cada archivo. Evidencia y límites en [SHARED_TRACKS_072.md](tests/experiments/SHARED_TRACKS_072.md).


## Reglas de carrera compartidas — 0.74

`race-rules.js` es clásico/CJS y recibe `world`, `geometry` y `driving`; no usa globals del juego, DOM, almacenamiento, audio, reloj ni aleatoriedad. El navegador lo crea de nuevo al empezar/reiniciar una carrera, y Node lo importa directamente. API versión 1, conservando física p6/b1/s1.

| Método | Contrato |
|---|---|
| `create({world, geometry, driving, laps=3, onEvent, onLap})` | Contexto de reglas para una pista/perfil, gates congelados y secuencia propia. Laps debe ser entero 1–99. Hooks opcionales y síncronos. No crea coches ni reloj. |
| `advanceVehicle(car, controls, dt, elapsed, before?, bend?)` | Muta movimiento, terreno, recuperación, barreras y progreso en orden original. Devuelve terreno/profundidad para efectos visuales. Cliente puede reutilizar su observación previa a decidir la CPU. |
| `resolveCollisions(cars, dt, elapsed)` | Resuelve contactos del grupo, vuelve a resolver barreras y actualiza gates cruzados por el empuje; mismo orden y disipación anteriores. |
| `resolveBarrierContact`, `closestSegments`, `gateCrossed`, `updateProgress` | Consultas/adaptadores compartidos para contactos y escenarios; sin otra implementación en el cliente. |
| `finishState(cars, elapsed)` | Llegados ordenados, plazo de 18 segundos desde el primero y cierre; tiempo siempre proporcionado por el llamador. No avanza ni pausa un reloj. |
| `checkpoints`, `lastSequence` | Gates inmutables y último número de evento del contexto. No es un historial de eventos ni un snapshot de carrera. |

`onEvent(event, car)` recibe un evento inmutable y serializable con `sequence`, `type`, `pilot`, `time` y campos específicos: checkpoint/passes, lap/lapTime/finished/personalBest o source/strength de impacto. `car` es una referencia transitoria aparte para el adaptador de sonido; no forma parte del evento de red. El módulo no almacena una cola creciente: el consumidor procesa o recoge eventos por paso. No debe mutar el coche ni lanzar errores desde el hook.

`onLap(car, time)` es una anotación opcional de récord humano. El adaptador conserva `saveBestLap` en almacenamiento local; Node puede dejarla en falso o conectar una política propia. Su respuesta solo marca nuevo récord/feedback, no concede una vuelta ni modifica tiempos/fuerzas. Un servidor no aceptará un récord enviado por cliente como verdad.

La secuencia empieza en 1 por contexto y se reinicia al crear otro. Las futuras salas deben identificar eventos con **raceId + sequence**, no con sequence aislada, y gestionar restauración/reconexión. No se inventan UUIDs ni reloj dentro del componente.

Orden actual: la CPU/humano decide controles; `advanceVehicle` aplica el paso y progreso; el adaptador crea efectos y reduce `flash` como antes; después se resuelve el grupo de contactos. La decadencia de flash participa en el límite de eventos de impacto y debe conservar su ubicación al construir el `RaceState`. No moverla ni procesar todos los rivales simultáneamente a ciegas.

Falta consolidar en 30.4 la creación del coche/estado, reloj/contador, cuenta regresiva, pausa/reinicio, clasificación/resultados y replay en una carrera completamente independiente; la CPU offline puede seguir como adaptador de intención. El primer servidor puede empezar con humanos 2–4. Consumir estos componentes desde Node **no demuestra todavía dos carreras aisladas ni una sala online**.

Pruebas y límites en [SHARED_RULES_074.md](tests/experiments/SHARED_RULES_074.md). El bootstrap recupera ahora cualquiera de tres dependencias omitidas por HTML viejo, y las pruebas HTTP sirven el módulo real.


## Adaptador táctil — 0.75

El táctil permanece en la capa de entrada/DOM de `script.js`, no en los módulos Node. Normaliza GAS/FRENO/dirección/mano y comparte `humanControls`/`advanceVehicle` con teclado y CPU. P1 puede combinar táctil y teclado; al elegir mando en local solo se usa esa fuente. El resto de asientos conserva su mapeo.

La cámara táctil adapta dimensiones/anticipación sin realimentar la simulación; el estado mundial y los récords p6/b1/s1 permanecen. Limpieza de punteros en ciclo de vida y ajustes evita órdenes pegadas. Al extraer RaceState en 30.4 hay que mantener esa frontera: el adaptador entrega comandos, la carrera posee su estado/reloj. En online, abrir ajustes no podrá pausar globalmente al servidor; seguirá la política de input seguro del diseño de salas.

## Consumidor local de vueltas — 0.76

El contrarreloj de fase 31.1 usa `race-rules.onLap` para aceptar una vuelta y un grabador `ghost-lap.js` sin DOM/reloj. `script.js` posee almacenamiento y playback de poses. El fantasma no pertenece a la lista de coches ni llama a física, colisiones, gates o audio; el tiempo de reproducción se ajusta al retardo visual existente. No hay un segundo modelo dinámico.

Esto no implementa la repetición determinista de entradas/eventos ni el estado completo de carrera de 30.4. Los datos de poses son una referencia local validada por esquema, no evidencia de un resultado competitivo ante un servidor. Siguen pendientes aislamiento del reloj/estado/resultados y dos carreras independientes antes de salas.


## RaceSession 0.78 — propiedad y contrato

La fábrica clásica/CJS `PixelRaceSession.create()` recibe `world`, `geometry`, `driving`, `rulesModule`, `laps`, `raceId` y hooks opcionales. Geometría/modelos/reglas son las implementaciones originales compartidas. No importa DOM, Canvas, almacenamiento, fecha, RNG ni red. El host es dueño del estado mutable de cada sesión; los mensajes de un cliente remoto no deben poder escribirlo.

| API | Responsabilidad |
|---|---|
| `createVehicle({player,model,isAI})`, `setVehicles(grid)` | Estado inicial canónico, copia de parrilla, modelos/identidades/valores básicos validados; parrilla bloqueada al iniciar. Metadatos de presentación los añade el adaptador. |
| `start(countdown)`, `restart(countdown)`, `stop(reason)`, `setPaused(value)` | Ciclo de vida y limpieza del acumulador; reinicio desde la copia de salida. El navegador crea otra sesión con otra identidad al reiniciar/cambiar pista. |
| `frame(dt, inputs)` | Cuenta regresiva o avance; el frame que da GO se consume igual que antes. |
| `advanceFrame(dt, inputs)` | Solo simulación activa, paso 1/60, máximo seis pasos de recuperación, sin avanzar una carrera cerrada. |
| `advanceVehicle(car,index,dt)`, `rules` | Componentes de bajo nivel para el adaptador/pruebas; el servidor de partidas debe usar el paso completo. No son un parser de red. |
| `finishState()`, `classification()`, `points(car,index)`, `results()` | Plazo de cierre original; posición estable; puntos base 25/18/15/12; resultados separados y congelados. La asignación a temporada corresponde al modo/campeonato del adaptador. |
| `snapshot()` | Copia serializable de configuración/tiempos y campos físicos/de progreso. No incluye partículas ni el estado interno completo del planificador CPU. No es todavía un formato de restauración de replay. |

Cada evento incorpora `raceId` y secuencia de sesión creciente. Los eventos de reglas conservan además `ruleSequence`. El host debe proporcionar identidades únicas para sus salas/partidas; la identidad local no es una credencial. El flujo de callbacks no retiene una cola ilimitada. La cuenta regresiva, pausas y parada producen eventos de ciclo de vida; las señales del audio local siguen reproduciéndose una sola vez.

Sin `controller`, la sesión normaliza acelerador/freno/dirección/mano y utiliza `driving.humanControls`. El adaptador del navegador aporta su controlador actual para teclado/mando/táctil/CPU. La política CPU aún captura el contexto de la única carrera local activa y no se presenta como planificador aislado listo para varias salas con bots. El primer online será humano contra humano.

`beforeStep` permite capturar poses de render; `afterVehicle` conserva efectos; el núcleo descuenta cooldown de impactos después de ese hook y antes de los contactos del grupo. `afterStep` mantiene efectos de suelo/ghost en el navegador. Los generadores visuales aleatorios no se trasladan al motor de servidor.

El código de producción usa `raceState.*`, sin copias paralelas de los antiguos relojes/coches. Las pruebas anteriores instalan aliases únicamente en su script instrumentado mediante `tests/helpers/race-state-bridge.cjs`; esos aliases acceden a la sesión real y no forman parte del HTML publicado. `without-race-session.mjs` revierte solo la migración declarada y se compara con el script auténtico de 0.77 para los fixtures históricos.

Validación: `node tests/validate-race-session.mjs` (opcional `SESSION_SOURCE_BASELINE` con 0.77 auténtico), teclado nativo, contactos, carreras completas CJS e intercaladas y regresiones de modos/entrada. Resultados en `tests/experiments/SESSION_078.md`. Siguen protocolo/autoridad de mensajes, salas, predicción/reconciliación, desconexiones, restauración de replay y despliegue; el snapshot no convierte datos del navegador en resultados confiables.

## Abandono de red en 0.79

`session.retire(player, reason)` marca `retired`, conserva `done=false` y los tiempos/vueltas realmente obtenidos, detiene el coche y emite evento. No avanza ni colisiona después del abandono. Clasificación coloca DNF detrás de participantes activos/finalizados; puntos solo para finalizados sin abandono. `finishState` cierra también cuando todos terminaron o abandonaron. Snapshots/resultados incluyen `retired` y `retireReason`; la API permanece en 1 por ser una ampliación.

Los vehículos locales nacen con `retired=false`; no se cambia aceleración, dirección, frenado, agarre, contactos normales ni versión p6/b1/s1. Las comparativas offline conservan los estados físicos y eventos originales. La ausencia temporal de input de red la resuelve el controlador del servidor con `humanControls(..., false)`, sin fórmula física paralela ni reversa involuntaria. Las sesiones no reciben tiempo desde los mensajes de clientes.

## Adaptador de snapshots 0.80

La carrera online avanza exclusivamente en el servidor. `online-client.js` recibe snapshots, interpola poses con historial acotado y confirma la huella de compatibilidad; no redefine aceleración/giro/frenado. El adaptador de `script.js` conserva estado visual (partículas/marcas) separado de lo transmitido y selecciona cámara/HUD por identidad del piloto. No persiste esos tiempos en récords locales ni llama al paso físico de su sesión de presentación.

El transporte no envía controles durante reconexión hasta recibir el nuevo `session`; socket abierto/`welcome` por sí solos no significan que el servidor haya restaurado la pertenencia a sala. Una regresión específica cubre ese orden, además del corte/reanudación real con cuatro navegadores. Predicción/reconciliación del coche propio aún pendientes de 33.2.

## Presentación anticipada del coche propio en 0.82

`online-prediction.js` es otro consumidor del mismo núcleo, no un motor de fuerzas alternativo. Posee un clon por snapshot y lo avanza hasta nueve pasos de 1/60 usando controles actuales, terreno/barreras/recuperación canónicos. Sus callbacks no registran récords, eventos de carrera ni resultados. El clon utiliza progreso provisional para poder invocar las reglas compartidas; solo una lista de atributos de dibujo llega a `online.visual`. La sesión recibida conserva coches/progreso/tiempo como autoridad y el HUD la sigue leyendo.

Reconciliación visual acotada, sin replay exacto de controles aplicados por tick. Fallback en tráfico/contactos/barreras/controles liberados/fin; datos antiguos congelan la pose. Se reinicia ante otra carrera, desconexión o recuperación grande. El transporte agrega métricas locales de ack e historial máximo 64, sin campos nuevos en mensajes ni cambio de huella física.

Parada de controles: usar freno + mano evita que el retardo de reversa se cumpla mientras la interfaz mantiene un freno de seguridad. Se verificó en cuatro modelos y en navegador con mandos emulados. No modifica la reversa normal de un piloto conduciendo.
