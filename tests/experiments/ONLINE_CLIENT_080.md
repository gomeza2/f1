# 0.80 — salas y carreras desde el juego real (33.1)

Base: main 0.79 `fb4db69164f2e325b5788036ecee4b52f3923ec4`. Node 24.19.0, ws 8.22.1 y Chromium/Playwright locales. Auditoría en `AUDIT_080.md`.

## Entrega

Panel de sala integrado, URL pública configurable, invitación, selección, opciones del anfitrión, listos por revisión, salida y carrera con renderer/HUD/cámara/minimapa originales. Sin física paralela en cliente; servidor mantiene toda autoridad. Presentación interpolada, controles 20 Hz, reconexión automática, resultados/DNF/revancha y regreso a offline. Credencial privada en memoria y URL sin secretos. Datos online no alteran los récords o temporada locales.

Manifiesto versionado y huella de los cuatro núcleos, verificables desde Node; el cliente rechaza manifiesto/servidor incompatible. `render.yaml` y `HOSTING.md` proponen Render Web Service sin suspensión + Pages, sin contratar/desplegar servicio. `PORT` y `PGP_HOST` probados con el entrypoint CLI y health HTTP.

## Evidencia ejecutada

| Prueba | Resultado y límites |
|---|---|
| `tests/browser-online-game.cjs` | **Cuatro contextos Chromium independientes con HTML/Canvas reales**: crear/unirse, cuatro modelos, anfitrión/listos, salida, cuatro vueltas válidas en Dusty, teclado nativo P3 y Escape, navegación automática por mandos emulados, cámara por identidad, corte WebSocket real y token rotado, resultados equivalentes, nombre con sintaxis HTML tratado como texto, revancha, lobby móvil y salida a offline. Sin errores JS del recorrido final. |
| `tests/validate-online-client.cjs` | Huella/build, URL/TLS/credenciales, handshake, ack/entradas, snapshots antiguos, interpolación acotada sin modificar autoridad y aislamiento del socket cerrado. Regresión de reconexión: no enviar controles hasta recibir sesión restaurada, incluso con socket abierto/welcome. |
| `npm test --prefix server` | **10/10**: contratos, permisos, revisión, rates/tamaños/origen, watchdog, abandono, limpieza y sobrecarga; WebSockets reales con salas 2/4 simultáneas, once vueltas válidas incluyendo superviviente tras DNF. Scheduler monotónico real comprobado además del reloj acelerado. |
| `browser-shared-driving.cjs` con fuente auténtica 0.79 | 16 escenarios de teclado nativo, cuatro modelos/materiales, 3552 pasos y 96 estados con movimiento/progreso/tiempos/HUD idénticos. No mide diversión humana. |
| `validate-race-session.mjs` | Comparación con variante de orquestación generada por el helper actual: 16 casos/3552 pasos/96 estados, 22 contactos y 24 vueltas válidas de sesiones separadas/intercaladas. Esta ejecución no usa una fuente histórica congelada. |
| `browser-local.cjs` | 2/3/4 teclados simultáneos, selección, cámaras/HUD, pausa/reinicio/resultados/siguiente, fullscreen/cinco resoluciones y mandos emulados; hardware humano pendiente. |
| `browser-touch.cjs` | Multitouch CDP, pedales/dirección/mano/reversa, limpieza/cancelación, tamaños/persistencia, fullscreen y compatibilidad local. Sin dispositivo físico. |
| `browser-release.cjs` | Ocho recursos offline, /f1/, caché anterior/HTML real 0.79, fallbacks y error de módulos, carrera/input/pausa/reinicio/menú sin errores JS. No prueba Pages desplegado. |
| `validate-integration.mjs`, `validate-ghost.mjs` | IDs/recursos, diez pistas originales/catorce registradas y 70 combinaciones pista/barrera/checkpoints; persistencia/límites/recuperación de récord/fantasma. |
| `validate-fixed-step.mjs`, `validate-events.mjs`, `validate-driving.mjs`, `validate-race-lifecycle.mjs` | Pasos físicos iguales a distintas frecuencias/jitter, modos/puntos, cuatro coches, cien ciclos de pausa y limpieza conservados. |
| Sintaxis, manifiesto y diff | JavaScript analizado, huella/build coincidentes y diff sin errores de whitespace. |

Referencias de carrera automatizada: cuatro vueltas en torno a **40–42 s**, con política conservadora, tráfico, emulación de mando y servidor a reloj acelerado. Los temporizadores de red también incorporan tiempo monotónico real para no falsear los límites de frecuencia durante la preparación de UI. No son récords humanos ni una medida de ping/FPS. Capturas de carrera P3 y lobby móvil revisadas para encuadre/HUD y legibilidad; no demuestran todos los dispositivos.

## Errores corregidos durante la entrega

- Falta de partículas en snapshot provocaba error del renderer: estado visual añadido en adaptador, sin ampliar simulación autoritativa.
- Input antes de confirmar resume: barrera de sesión restaurada en el transporte, con prueba específica y corte real.
- La interfaz offline indicaba pausa en ajustes online: textos y controles ahora dejan claro que la carrera continúa.
- Cámara/HUD asumían primer coche: selección por identidad, comprobada en los cuatro asientos.

Los primeros fallos de la automatización al cambiar un select oculto o congelar completamente el reloj de los límites de red se corrigieron en el harness: selección antes de largar y reloj monotónico adicional. No se relajaron las restricciones del servidor para hacer pasar la prueba.

## Repetir

```sh
npm ci --prefix server
node server/scripts/client-config.cjs --check
node tests/validate-online-client.cjs
npm test --prefix server
node tests/browser-online-game.cjs
node tests/validate-race-session.mjs
node tests/validate-integration.mjs
node tests/validate-ghost.mjs
node tests/validate-fixed-step.mjs
node tests/validate-events.mjs
node tests/validate-driving.mjs
node tests/validate-race-lifecycle.mjs
LOCAL_STAGE=11 node tests/browser-local.cjs
node tests/browser-touch.cjs
git show fb4db69:script.js > /tmp/pixelgp-driving-before-080.js
DRIVING_SOURCE_BASELINE=/tmp/pixelgp-driving-before-080.js node tests/browser-shared-driving.cjs
git show fb4db69:index.html > /tmp/pixelgp-html-before-080.html
DRIVING_HTML_BASELINE=/tmp/pixelgp-html-before-080.html node tests/browser-release.cjs
```

Navegadores requieren Playwright/Chromium de desarrollo (`NODE_PATH`/`CHROMIUM_PATH` si corresponde). `ONLINE_SCREENSHOTS` habilita capturas de la prueba UI en un directorio elegido. Los tests abren/cierran sus servidores efímeros; no despliegan servicios públicos.

## Pendiente 33.2 y aceptación humana

Predicción/reconciliación del coche propio, simulación de latencia/jitter/pérdida, pruebas humanas en varios dispositivos, publicación WSS y mediciones de carga/coste. La interpolación inicial tiene ≈100 ms de margen y no ofrece aún respuesta competitiva bajo ping alto. Sin ranking público, persistencia, cuentas ni CPU de servidor. Aceptación del manejo/derrape/audio sigue abierta en sus fases. La próxima entrega puede conectar una URL pública y validar el hosting sin tocar claves privadas.
