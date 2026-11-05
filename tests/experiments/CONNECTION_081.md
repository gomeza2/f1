# 0.81 — conexión inicial, URL y presentación bajo jitter

Auditoría: `AUDIT_081.md`.

Base: main `422cd52b08684505e5cce8b9ef0ee205f2fe477a`, build 0.80. Rama `work/online-connection-081`. Objetivo: integrar la dirección de Render entregada por el usuario y resolver dos problemas observables del cliente: espera inicial de cinco segundos insuficiente para servicios suspendidos y timeline que podía retroceder ante retrasos irregulares.

## Cambios

`online-config.json` incorpora `https://pixel-grand-prix-rooms.onrender.com`. La interfaz conserva un servidor personalizado ya guardado. Conexión inicial: 90 s como máximo, intentos pre-welcome, estado visible y cancelación con botón/Escape/cierre/inicio offline. No reenviar creación cuando se pierde una confirmación incierta. La reconexión de carrera sigue con presupuesto corto; el ack de sesión también debe llegar antes de su vencimiento.

Timeline de presentación monotónico, limitado al último estado y reiniciado por carrera; no se introduce física paralela, extrapolación indefinida ni predicción. Backend, protocolo y huella física conservados. Build/recursos/JSON 0.81 coherentes.

## Pruebas

| Comprobación | Evidencia y alcance |
|---|---|
| `validate-online-network.cjs` | Reloj y WebSockets simulados: servicio que tarda 12 s tras varios intentos, create enviado una sola vez, límite de 90 s, cancelación sin timers/acciones pendientes, creación incierta no repetida, límite de 8,5 s para reconexión incluido welcome sin session. Jitter/bursts, timeline sin retroceso ni poses futuras, reset por carrera/reversa. |
| `compare-online-jitter.cjs` | Comparación con el módulo auténtico de `422cd52`: **11 retrocesos antes / 0 después** en 31 snapshots con recepción variable 10–150 ms y muestreo de presentación continuo cada 10 ms. Escenario de presentación, sin conducción ni medición WAN. |
| `validate-online-client.cjs` | Compatibilidad, URL/TLS, handshake, secuencias/ack, inputs bloqueados hasta recuperar sesión, token renovado y sockets antiguos aislados; interpolación sin modificar autoridad. |
| `browser-online-connection.cjs` | HTML real, WebSocket nativo y puerta HTTP 503 local antes del RoomService real. URL predeterminada correcta, mensajes de espera, acciones duplicadas bloqueadas, cancelación explícita/Escape que detiene reintentos y no crea salas, nuevo intento exitoso con exactamente una sala. No es un test de Render. |
| `browser-online-game.cjs` | Cuatro navegadores con UI/Canvas, cuatro modelos y cuatro vueltas válidas; teclado nativo P3/Escape, navegación por mandos emulados, identidad/cámara, corte y reanudación de socket con credencial rotada, resultados equivalentes, revancha y vuelta offline. Comprueba también la URL inicial antes de usar el servidor local de prueba. Reloj acelerado y conducción automatizada. |
| `browser-shared-driving.cjs` | Frente al script auténtico 0.80: 3552 pasos, 16 escenarios y 96 estados/HUD idénticos con cuatro coches y materiales. No comprueba diversión humana. |
| `browser-release.cjs` | HTML real 0.80, /f1/, ocho recursos, fallback/cache, controles/pausa/reinicio/menú y errores de módulo conservados. No confirma Pages publicado. |
| `browser-local.cjs` | 2/3/4 humanos de teclado simultáneos, selección, cámaras/HUD, mandos emulados, fullscreen/cinco tamaños y flujo de resultados/revancha. |
| `npm test --prefix server` | Diez pruebas del backend original, sockets/salas simultáneas, vueltas válidas, permisos, DNF, watchdog, límites y scheduler. |
| `validate-integration.mjs`, `validate-ghost.mjs`, `validate-fixed-step.mjs` | IDs/recursos, catorce pistas/setenta perfiles, conservación de récord/fantasma y pasos físicos a distintas frecuencias/jitter. |
| Sintaxis, manifiesto y diff | Analizados JS nuevos/modificados, build/huella consistentes y whitespace comprobado. |

Las pruebas automatizadas no miden ping real, FPS de hardware, timbre de audio ni satisfacción humana. La física y los trazados no cambian en esta entrega. La fase 33.2 queda parcial: faltan predicción/reconciliación y carreras humanas bajo latencia real.

## Verificación pública y restricción observada

El usuario informó que el servicio funciona. Se intentó `GET https://pixel-grand-prix-rooms.onrender.com/health` y se repitió tras su confirmación. El entorno respondió `CONNECT tunnel failed, response 403`, `server: envoy`: el proxy rechazó el túnel antes de llegar al host. **No se observó un error del servidor de Render ni se verificó su salud, protocolo o partida pública.** No se eludió la restricción mediante rutas alternativas.

Para validación pendiente desde un entorno con acceso: abrir `/health`, comparar protocolo/huella con JSON y completar una carrera desde el cliente en Pages con 2–4 dispositivos. Abrir la raíz de Render muestra el backend, no el Canvas del juego. No se requiere compartir contraseñas/credenciales privadas.

## Repetir lo local

```sh
node server/scripts/client-config.cjs --check
node tests/validate-online-client.cjs
node tests/validate-online-network.cjs
git show 422cd52:online-client.js > /tmp/pixelgp-online-before-081.cjs
node tests/experiments/compare-online-jitter.cjs /tmp/pixelgp-online-before-081.cjs
node tests/browser-online-connection.cjs
node tests/browser-online-game.cjs
npm test --prefix server
node tests/validate-integration.mjs
node tests/validate-ghost.mjs
node tests/validate-fixed-step.mjs
LOCAL_STAGE=11 node tests/browser-local.cjs
git show 422cd52:script.js > /tmp/pixelgp-before-081.js
DRIVING_SOURCE_BASELINE=/tmp/pixelgp-before-081.js node tests/browser-shared-driving.cjs
git show 422cd52:index.html > /tmp/pixelgp-before-081.html
DRIVING_HTML_BASELINE=/tmp/pixelgp-before-081.html node tests/browser-release.cjs
```

Navegadores: Playwright/Chromium instalados en desarrollo; `NODE_PATH`, `CHROMIUM_PATH` y `ONLINE_SCREENSHOTS` opcionales según entorno. Los servidores de pruebas son efímeros/locales y se cierran al terminar; no modifican salas del servicio público.
