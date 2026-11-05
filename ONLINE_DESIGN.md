# PIXEL GRAND PRIX — diseño de online privado

**Estado en 0.82: salas/cliente y URL configurados, anticipación visual del coche propio con física compartida y modo Clásico.** Guard de tráfico/contactos, reconciliación de errores visuales pequeños, límite de horizonte y parada sin reversa; backend/protocolo sin cambios. No equivale a replay completo de inputs ni predicción de colisiones grupales. La validación pública y humana sigue pendiente; el bloqueo CONNECT 403 observado anteriormente no se elude.

## Primera entrega completa que se busca

Salas privadas de 2–4 personas: crear, compartir código, unirse, elegir coche/pintura, confirmar listo y correr tres vueltas. Cuenta regresiva y resultados decididos por un servidor. El anfitrión configura la sala, pero no controla las posiciones ni valida sus propios tiempos. Sin ranking público ni cuentas en el primer hito. El juego local sigue funcionando sin red.

Pages puede seguir sirviendo el cliente. Las salas necesitan un proceso separado con HTTPS/WSS; Pages por sí solo no ejecuta ese servidor persistente. No se añade un botón ONLINE que no pueda completar una partida.

## Base integrada en 0.78

El servidor puede construir una instancia `race-session.create({world,geometry,driving,rulesModule,raceId,laps})`, crear/copiar parrilla con `createVehicle`/`setVehicles`, llamar `start(3)` y avanzar `frame(1/60, inputs)` con controles humanos normalizados. Obtiene `snapshot`, `finishState` y `results`; no necesita ejecutar `script.js` ni un DOM simulado. Los participantes no proporcionan posiciones, vueltas, tiempos, modelos físicos ni `dt` como autoridad. El estado es interno del host.

El transporte 0.79 valida tipos/límites/frecuencia/orden de inputs, asigna pilotos y modelos, bloquea la configuración y genera identidades únicas. `raceId + sequence` separa eventos de partidas; no autentica al remitente. Un snapshot es lectura de física/progreso, no un formato de restauración de IA completa ni un resultado firmado. El controlador CPU del cliente todavía no se usa para varias salas de servidor; primer hito con 2–4 humanos.

32.1 implementada en 0.79: servidor local autoritativo y salas/listos/inputs/resultados con contrato probado por clientes independientes. 33.1 integrada en 0.80: cliente del juego, interpolación y reconexión visible. Siguiente 33.2: predicción/reconciliación y validación de latencia/hosting. El despliegue externo y sus costes se preparan cuando exista un artefacto de servidor probado. No se anuncia disponibilidad pública antes de eso.

## Criterios de fase 30 y obligaciones del servidor

La primera sesión integrada cubre estado/reloj/gates/resultados para entradas humanas; el servidor debe conservar estas garantías:

- `race-session.create(config)` produce un estado por partida con coches, vueltas, gates, reloj y configuración bloqueada. Los planes CPU de servidor se incorporarán por un controlador aislado, separado del callback de la única carrera local.
- `session.frame(1/60, inputs)` avanza el mismo núcleo en cliente/Node; emite eventos numerados y expone cierre/resultados. El host decide cuándo publicar el resultado de la partida.
- Geometría de pistas/barreras y especificaciones son datos compartidos inmutables; estado de cada carrera es independiente. Ni `stage`, ni `cars`, ni temporizadores globales pueden compartirse entre salas.
- El cliente identifica su coche por `selfPilotId`; cámara, HUD y controles no deben asumir que su asiento de servidor es el índice cero.
- Canvas, audio, partículas decorativas y localStorage quedan en el adaptador del navegador. No se ejecutará un DOM falso o un navegador en el servidor.
- Intención de conducción y física se separan: el servidor calcula el retardo de reversa. Un freno de emergencia de red no puede activar marcha atrás automáticamente.
- Primer formato elegido en 0.71: módulo clásico/CJS compartido sin bundler, para mantener Pages estático y uso directo en Node. Revisar la opción de módulos ES si la siguiente extracción la justifica. Las rutas/versiones bajo `/f1/` y recuperación ante HTML anterior están comprobadas para este bloque.

Criterio de salida: con las mismas entradas, el adaptador actual y el núcleo extraído producen posiciones/velocidades, contactos, gates, vueltas y tiempos iguales. Dos carreras simultáneas no deben contaminar estado. La extracción no es permiso para cambiar el balance sin medirlo.

## Transporte y autoridad — fase 32

Node con una biblioteca WebSocket pequeña y mantenida. El cliente transmite controles; el servidor simula todos los coches y devuelve snapshots. WebRTC no elimina señalización, NAT ni confianza en el anfitrión; por eso no es la primera opción para competición validada.

Contrato propuesto, no API existente:

| Mensaje | Contenido y reglas |
|---|---|
| `hello` | Versión de protocolo y hash de simulación; rechazar incompatibles antes de entrar. p6/b1/s1 por sí solos no identifican revisiones de controles/recuperación. |
| `create` / `join` | Nombre limitado, código de sala y selección entre modelos/pinturas conocidos. El servidor asigna piloto e identidad de sesión. |
| `configure` | Solo anfitrión y solo en lobby: pista, perfil de barreras y vueltas permitidas. Configuración y geometría versionadas se bloquean al iniciar. |
| `ready` | Estado por piloto; cualquier cambio de configuración invalida confirmaciones previas. |
| `input` | Secuencia y controles `{throttle, brake, steering, hand}`; no posiciones, dt elegido por cliente, vuelta ni tiempo final. |
| `snapshot` | Tick del servidor, último input reconocido por piloto, poses/velocidades firmadas, estado de vuelta/gates/clasificación y eventos numerados. |
| `resume` | Credencial de sesión para recuperar el mismo coche dentro del plazo; se rota al usarla. |
| `results` | Clasificación, vueltas válidas, llegada/DNF y tiempos calculados por el servidor. |

Entradas numéricas finitas, throttle/brake en [0,1], steering en [-1,1], hand booleano. Piloto asociado al socket, no a un ID arbitrario aceptado desde el mensaje. Rechazar secuencias repetidas/antiguas, objetos/campos inesperados, mensajes excesivos y modelos/configuraciones inexistentes. Nombres como texto, nunca HTML.

Los snapshots incluyen reversa (velocidad hasta −28 en la base actual), `raceOffset` y temporizadores necesarios para predecir/reconciliar. El servidor decide vueltas y checkpoints por geometría/orden. Un valor de localStorage no se acepta como resultado online.

## Ciclo de sala

`lobby → countdown → running → results → lobby`.

- Inicio con al menos dos pilotos listos. Una desconexión durante countdown cancela esa salida y devuelve la sala al lobby.
- No se admite incorporar un coche nuevo a una carrera en curso. Reconexión al coche existente es otra operación.
- Plazo inicial propuesto de reconexión: 10 s; después, DNF. No es un temporizador ya implementado.
- Al perder inputs, retirar acelerador y frenar con comando de seguridad sin reversa; limpiar la intención retenida de marcha. No conservar indefinidamente la última pulsación.
- La salida del anfitrión no detiene una carrera autoritativa; el servidor conserva la carrera y reasigna la administración del lobby.
- ESC no pausa globalmente una carrera online. El menú personal debe explicar que el coche sigue en carrera y usar un control seguro; la pausa local actual conserva su comportamiento.
- Limpieza de salas vacías/inactivas, límites por instancia y aviso claro al reiniciar un servidor. La primera versión puede guardar salas solo en memoria; no prometer persistencia/reconexión tras reinicio.

## Sincronización jugable

Simulación fija inicial a 60 Hz. Comparar snapshots de 15 y 20 Hz con carga medida antes de fijar el envío. Inputs al cambiar y un pulso periódico limitado; no se permite simular más tiempo por enviar más paquetes.

Predicción del coche propio con el mismo núcleo; reconciliación desde snapshot reconocido y repetición de inputs pendientes. Interpolación de rivales separada de la simulación. Las correcciones visuales no conceden velocidad al estado autorizado. Los eventos llevan ID para no repetir audio/puntos al reconciliar.

Si el servidor no sostiene el reloj, debe detectar sobrecarga y suspender/cerrar la sesión de forma explícita; no esconder tiempo perdido ni validar récords como si fuera una carrera normal. El cliente no puede decidir el avance del reloj de la sala.

## Pruebas que habilitan publicación

1. Paridad de simulación y dos salas aisladas; reglas de reversa/terreno/contactos/gates incluidas.
2. Dos y cuatro clientes reales crean/unifican lobby, cambian modelos, confirman y terminan carreras con el mismo resultado.
3. Retraso/jitter de 0/50/100/200 ms, pérdida/corte/reconexión, inputs duplicados/reordenados y navegadores a frecuencias distintas.
4. Desconexión de anfitrión, caída durante countdown/última vuelta, piloto detenido, DNF y limpieza de salas.
5. Rechazo de posiciones/resultados falsos, controles fuera de rango, exceso de frecuencia y sesiones ajenas. Esto es prevención básica, no garantía contra todo ataque.
6. Medir CPU/memoria/bytes y salas por instancia; revisar movimiento/predicción humanamente. Abrir dos pestañas y conectar un socket no completa el hito.

## Alojamiento y costes — fase 33

Elegir proveedor solo cuando exista servidor medido y una versión concreta para desplegar. Comparar en ese momento precios y límites vigentes de un servicio Node o contenedor con WSS permanente; no se ha contratado ni elegido hosting.

Presupuesto = horas de cómputo + salida de datos + almacenamiento + dominio/servicios que se decidan. Tráfico de una sala = tamaño medido de snapshot × frecuencia × clientes × duración, más protocolo/inputs. No se presupuestan salas ilimitadas ni un plan gratuito permanente sin medir sus condiciones.

TLS, orígenes permitidos, sesiones impredecibles, límites de conexiones/salas/mensajes y logs sin credenciales. Tokens de reanudación cortos y con alcance por sala/piloto; ninguna clave privada en el frontend. El ranking persistente necesitará validación y almacenamiento de resultados del servidor como hito posterior.

## Orden inmediato

0.70 completa el primer catálogo visual y 0.71 extrae el motor de vehículos con paridad/aislamiento de ese componente. 0.72 integra geometría/materiales/checkpoints/barreras compartidos de las 14 pistas. 0.74 integra contactos, progreso/vueltas y eventos de componente. Próximo paso online: estado/reloj/resultados completos y dos RaceState aislados (30.4/32.1). Después, servidor/salas y prueba local integral; luego reconciliación/latencia; finalmente despliegue revisable. La vista 3D inclinada queda en fase 37 como opción de render que consumirá la misma simulación, sin cambiar la autoridad ni duplicar la física.


## Modos y UX tras 0.73

La rápida y el campeonato offline ya tienen resultados separados; local 2–4 admite ambos. El primer hito online sigue siendo carreras rápidas privadas de 2–4 humanos, con capacidad configurable después de medirla. Campeonato de sala/calendario/puntos se ampliará después, decidido por servidor; no reutilizar el objeto de puntos del frontend como autoridad.

La preparación local visible no es una sala ni sincroniza salida entre clientes. El lobby de red deberá confirmar configuración/listos y carga de pista de cada participante antes de la cuenta regresiva autoritativa, con timeout/desconexión explícitos. La elección 2D/3D será de presentación por cliente; las variantes arcade que cambien reglas deberán ser acordadas por sala y versionadas.


Los eventos brutos de reglas 0.74 conservan su secuencia local. Desde 0.78 la sesión los envuelve con `raceId + sequence` y conserva `ruleSequence`; el servidor deberá proporcionar identidades únicas por partida y deduplicar esa clave, sin volver a usar la secuencia de reglas como identidad global. `time` lo calcula el reloj de la sesión del servidor, nunca un timestamp aceptado del cliente. El hook de récord local sigue siendo anotación/feedback. Falta el servidor/protocolo de sala: disponer de esta envoltura de eventos no significa que haya conexión online.

## Contrato operativo 0.79 (prevalece sobre propuestas anteriores)

Protocolo v1, huella SHA-256 de los cuatro archivos de simulación, JSON estricto por `/ws`. El cliente confirma protocolo/huella antes de crear/unirse/reanudar; es compatibilidad, no autenticación de código confiable. `ready` y `start` incluyen `revision`; todo cambio de parrilla/configuración invalida listos. `configure.config.maxPlayers` admite 2–4 y `laps` 1–9. El servidor crea `raceId`, cronómetro, progreso y resultados; el cliente solo aporta controles normalizados y secuencia ascendente. Snapshots a 20 Hz incluyen tick, ack por piloto y eventos numerados.

El token de reanudación es privado de cada piloto, cambia al reanudar y caduca después de diez segundos sin conexión. No aparece en room/snapshot/resultados/health/URL ni se persiste. Al caducar, DNF sin puntos y sin colisión; no se inventa llegada. Si la red cae durante salida se cancela a lobby. El servidor limita conexiones, salas, carreras, tamaños y frecuencia; frena inputs vencidos sin reversa. El digest de resultados permite comparar el mismo mensaje: **no es firma ni prueba para un ranking externo**.

Servidor en memoria: reinicio pierde salas y resultados; sin cuentas, almacenamiento, ranking ni bots. Pages sirve solo el cliente estático. Antes de publicar: integrar 33.1, medir retrasos/tráfico/carga, definir HTTPS/WSS y orígenes del cliente, revisar alojamiento y costes reales. No hay contratación ni despliegue en esta entrega.

## Adaptador online 0.80

`online-client.js` posee socket, handshake, credencial en memoria, reintentos acotados, secuencias/ack e historial de seis snapshots. `script.js` conserva el renderer/audio/dispositivos y adapta los coches recibidos con propiedades visuales locales; no llama al paso físico para moverlos. No guarda tiempos online en PB/fantasma/temporada locales. Posición propia por `pilotId`, no índice cero. Nombre remoto por `textContent` o dibujo Canvas, nunca HTML ejecutable.

Interpolación de presentación con margen de seis ticks (≈100 ms), orientación por arco corto, clamping al último estado y salto directo ante recuperación grande. No hay predicción local ni promesa de latencia competitiva; medir antes de añadir correcciones físicas. Inputs a 20 Hz, frescura y freno de seguridad al quedar sin datos; estado físico/tiempo de carrera siguen en servidor. La pestaña oculta/ajustes/Escape libera al piloto sin pausar al resto.

La huella esperada del cliente está en `online-config.json`, generada/verificada con `server/scripts/client-config.cjs` desde los cuatro archivos canónicos. No se acepta ciegamente la huella anunciada por un servidor diferente. URL configurable, credenciales prohibidas en endpoint, WSS obligatorio desde HTTPS. Cliente/JSON se cargan solo al abrir online; servidor caído no inutiliza los modos offline.

Hosting propuesto: Render Web Service Free para pruebas + Pages estático, receta `render.yaml`; aún sin servicio contratado ni validación pública. Al recibir URL puede fijarse `online-config.json.serverUrl`; no colocar tokens de proveedor en frontend. Siguiente 33.2: latencia/jitter, predicción/reconciliación y despliegue revisado con carreras humanas.

## Primer tramo 33.2 en 0.81

La primera conexión admite 90 s para que un servicio suspendido responda; antes de welcome se puede reintentar sin haber enviado create/join. Después de welcome no se repite una creación incierta. Cancelar limpia timers/socket/acción pendiente y mensajes de un socket anterior no pueden crear una sala posterior. La reconexión activa conserva 8,5 s del cliente, dentro de los diez del servidor; recibir welcome no elimina el plazo de confirmar `session`.

El playhead de interpolación crece monótonamente, se acota al tick más reciente y se reinicia por `raceId`. Un snapshot retrasado no arrastra el render hacia atrás; el movimiento real en reversa sigue permitido. Aún no es predicción del piloto propio ni corrección de estados físicos. Timers inyectables solo para pruebas, sin reloj impuesto al servidor por mensajes del cliente.

URL predeterminada: `https://pixel-grand-prix-rooms.onrender.com`. Sin cambios de protocolo/huella; salud pública no comprobada por restricción del proxy. Ver `HOSTING.md` y `tests/experiments/CONNECTION_081.md`.

## Tramo 33.2.2 en 0.82: límites de la anticipación

`online-prediction.js` recibe copia de snapshot por piloto y vuelve a usar `driving.humanControls` y `race-rules.advanceVehicle` sobre un clon descartable; movimiento, terreno, drag, recuperación y barreras son los originales. El progreso provisional de ese clon nunca sale al servidor/HUD/almacenamiento. Solo posición/orientación, ruedas y estado visual se aplican al renderer del dueño. El resto de coches mantiene interpolación.

Horizonte de nueve pasos de 60 Hz como máximo, con lead de 0–75 ms derivado de media del retraso observado de ack; este último incluye batching de snapshots y no es un RTT/offset de reloj medido. Historial de entrada máximo 64. Datos de más de 250 ms congelan la última imagen prevista; desconexión/controles bloqueados/fin/contactos vuelven al estado presentado por servidor. Tráfico cercano o contacto previsto con vallas usa fallback. La corrección pequeña se suaviza; recuperación grande reinicia el offset. Barreras y tráfico se revisan también después de aplicar corrección visual.

El servidor sigue recibiendo únicamente controls/raceId/seq y conserva la física, gates, tiempo y resultados. No cambian huella ni protocolo; el backend 0.80 original conserva el mismo contrato. El cliente no realiza todavía replay de pasos después del tick exacto aplicado por servidor: falta ese dato en el protocolo actual. No presentar esta entrega como rollback determinista ni como protección de ranking.

UI Ágil/Clásica permite comparar. Liberar controles/pestaña/mando aplica freno + mano para no activar la reversa al detenerse, con las reglas físicas normales. La futura predicción conjunta de contactos debe evaluarse antes de retirar los guards actuales. Evidencia y mediciones controladas: `tests/experiments/RESPONSE_082.md`.
