# Servidor privado de Pixel Grand Prix — 0.87

Diagnóstico y despliegue actuales en [HOSTING.md](../HOSTING.md). No hay binario de desarrollo distinto: `node server/index.cjs` es el comando de producción. `/health` y `/protocol` informan serverVersion/clientBuild/revision además del protocolo y huella reales. La marca literal «servidor local» de 0.86 no indicaba modo de ejecución. Verificar el commit de Render antes de atribuir un fallo al texto.


**Actualización 0.86:** Champion Road tiene nueva geometría compartida. Desplegar este mismo commit en Render mediante **Manual Deploy → Deploy latest commit**; conservar Free/Build/Start/variables. La huella nueva es `ad20dd46ef387058811cdd3072626a264f39238ab9141d9a9c044ff99042c8f0`. Un backend viejo se rechaza por versión. Ver `../HOSTING.md`; aquí no se confirma despliegue público.


Backend autoritativo separado del frontend estático. **Desde 0.80 el menú ONLINE PRIVADO conecta a estas salas.** La raíz HTTP ahora sirve el juego completo; los diagnósticos siguen en /health y /protocol. El frontend configura por defecto la URL de Render aportada por el usuario. Para alojamiento propuesto ver `../HOSTING.md`; latencia humana/hosting y predicción pendientes en 33.2.

## Ejecutar y comprobar

Desde la raíz del repositorio, con Node >=22:

```sh
npm ci --prefix server
npm start --prefix server
npm test --prefix server
```

La CLI escucha por defecto en `0.0.0.0:8787`; `createApp().listen()` conserva loopback para pruebas. Render proporciona `PORT`, que tiene prioridad sobre `PGP_PORT`. `GET /health` muestra solo contadores/protocolo/huella; `GET /protocol` expone catálogo y límites; WebSocket en `/ws`, sin parámetros de URL. También sirve los archivos públicos del juego en su raíz. Los modos offline siguen funcionando sin Node ni npm.

Variables opcionales: `PORT` (puerto asignado por el hosting, preferente), `PGP_PORT` (1–65535, override local sin PORT), `PGP_HOST` y `PGP_ALLOWED_ORIGINS` (orígenes exactos separados por coma, sin rutas). Por defecto solo acepta Origin de localhost/127.0.0.1 de su propio puerto; permite clientes CLI sin Origin. Para frontend en otro puerto se debe declarar su origen. Para Internet falta configurar TLS/WSS, proceso supervisado, proxy y alojamiento; no exponer tokens en URLs/logs. El filtro Origin es protección del navegador, no autenticación de cuentas. No se confía en cabeceras de IP reenviadas: detrás de un proxy el límite por IP corresponde al proxy.

Para la prueba opcional de navegador, instalar Playwright/Chromium en el entorno de desarrollo y ejecutar `node tests/browser-online-server.cjs` desde la raíz (admite `CHROMIUM_PATH`). No se añaden esas dependencias al frontend/servidor productivo.

## Protocolo v1

Mensajes de texto JSON, campos exactos. El servidor envía `hello` con protocolo, huella SHA-256 de los cuatro módulos físicos, catálogo y límites. El cliente contesta `{type:"hello", protocol:1, simulation:<huella>}` y espera `welcome`. La huella identifica compatibilidad; no certifica que un navegador sea confiable.

| Mensaje de cliente | Campos además de `type` | Regla |
|---|---|---|
| `create` | opcionales `name`, `model`, `paint`, `config` | Crea sala y recibe sesión privada. |
| `join` | `code`; opcionales `name`, `model`, `paint` | Solo lobby con plaza libre; pintura única. |
| `choose` | opcionales `name`, `model`, `paint` | Solo lobby; reinicia listos. |
| `configure` | `config` | Solo anfitrión/lobby; reinicia listos. |
| `ready` | `ready` booleano, `revision` entero actual | Configuración/parrilla exacta confirmada. |
| `start` | `revision` actual | Solo anfitrión, 2–4 conectados/listos. |
| `input` | `raceId`, `seq`, `controls` | Solo salida/carrera; secuencia ascendente. |
| `resume` | `code`, `token` | Recupera identidad/coche y renueva token. |
| `leave` | ninguno | Abandono explícito; invalida credencial. |
| `rematch` | ninguno | Anfitrión, desde resultados: vuelve a lobby. |

`config`: `track` entero 0–13, `barriers` auto/open/full/half/corners, `laps` 1–9, `maxPlayers` 2–4. Se aceptan cambios parciales; valores iniciales pista0/auto/3vueltas/4plazas. `model` y `paint` deben estar en el catálogo; nombre 1–20 caracteres Unicode, sin controles/bidi, tratar siempre como texto en la futura interfaz. La pintura no cambia rendimiento.

`controls`: exactamente `{throttle:0..1, brake:0..1, steering:-1..1, hand:boolean}`. `seq` entero seguro 0..2147483647; reiniciar al cambiar `raceId`. El servidor rechaza campos de posición, tiempo, `dt`, resultados, vueltas y controles no finitos. Entradas antiguas o de otra carrera no mueven coches.

Mensajes de servidor:

- `session`: privado del piloto, con `code`, `pilotId`, `resumeToken` y sala. Token aleatorio de 32 bytes, revocado al renovarse. Guardarlo solo para la sesión; no compartirlo junto al código de invitación.
- `room`: estado público con `revision`, `phase`, `hostPilotId`, configuración, identidad y pilotos/listos/conectados. Cambios de elección/configuración/composición invalidan confirmaciones. La interfaz debe utilizar `pilotId`, no asumir asiento cero.
- `race_started`: identidad, configuración y roster bloqueado. Salida de tres segundos, misma física/colisiones/gates para todos.
- `snapshot`: `raceId`, tick, fase, estado separado de la sesión, secuencias reconocidas por piloto y eventos numerados. Frecuencia 20 Hz; simulación fija 60 Hz. No existe endpoint para avanzar ticks desde la red.
- `results`: identidad, tick, tiempo, ganador o null, filas FINISHED/DNF y digest SHA-256 del mensaje previo al digest. Vueltas/puntos/tiempos provienen solo de la simulación. El digest compara mensajes; **no es firma para un ranking externo**.
- `race_aborted`, `room_closed`, `left`, `error`: estados explícitos; errores como `stale_room`, `not_ready`, `wrong_race`, `bad_token`. Tres mensajes con esquema inválido cierran la conexión; versión incompatible/cargas excesivas también se rechazan.

## Ciclo de vida y límites

- Sin entradas frescas durante 350 ms: freno de seguridad y sin reversa automática. El freno normal de un jugador conectado mantiene la reversa original.
- Desconexión en carrera: diez segundos para reanudar el mismo coche; el token cambia y la conexión anterior queda sustituida. Caducidad/salida explícita retira el coche, DNF sin puntos ni colisión; no inventa llegada. El anfitrión pasa al siguiente conectado. Desconexión durante cuenta regresiva cancela a lobby y exige listos nuevos.
- Cierre normal según reglas compartidas: todos terminados/retirados o dieciocho segundos desde el primer finalista. Límite total veinte minutos, resto DNF. Una sobrecarga del reloj cancela la carrera a lobby sin resultados validados.
- Por instancia: 32 salas, 8 carreras activas, 128 conexiones, 16 conexiones/IP; hasta 4 participantes/sala. Límites conservadores, no una medición de capacidad de producción.
- 4096 bytes/mensaje, 60 inputs/s, 12 comandos de lobby/s y 90 mensajes/s totales por conexión; cola de salida acotada a 256 KiB, compresión desactivada, ping/pong cada 15 s, hello en cinco segundos. Sala inactiva fuera de carrera caduca en cinco minutos.
- En memoria: reiniciar proceso pierde salas, tokens y resultados. No hay CPU de servidor, cuentas, persistencia, ranking público ni protección frente a un administrador malicioso del servidor.

La única dependencia runtime es `ws` fijada en lockfile. No modificar los módulos físicos solo del servidor: su huella debe corresponder a la entrega del cliente. Las pruebas usan reloj acelerado/control automático para repetibilidad; Canvas y primera interpolación ya están integrados; quedan pendientes predicción/reconciliación, latencia/jitter, escucha/feel humano y alojamiento externo.

## Conectar el juego en desarrollo

Servir la raíz estática, por ejemplo `python3 -m http.server 8080` desde el repositorio. En otra terminal, iniciar `PGP_ALLOWED_ORIGINS=http://localhost:8080 npm start --prefix server`. Abrir `http://localhost:8080/`, pulsar ONLINE PRIVADO y usar `http://localhost:8787`. Crear sala, abrir otro navegador/perfil y unirse con el mismo servidor/código. Elegir auto/control, confirmar LISTO y largar como anfitrión. La raíz del Web Service también sirve el frontend; declarar el origen público exacto en PGP_ALLOWED_ORIGINS.

`node server/scripts/client-config.cjs --check` verifica compatibilidad del manifiesto estático; regenerarlo sin `--check` cuando cambien los módulos físicos. Preserva el `serverUrl` público configurado, si existe. La dirección puede quedar vacía y ser ingresada en la interfaz; solo se guarda la URL no secreta en localStorage. Token de reanudación solo en memoria del transporte, no persistido ni incluido en invitaciones.
