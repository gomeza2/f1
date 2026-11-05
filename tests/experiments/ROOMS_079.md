# 0.79 — backend autoritativo de salas privadas (32.1)

Base: main 0.78 `3ecaa678587162b9cb7bfc00e68dd51dcfb62639`. Rama `work/private-rooms-079`. Node 24.19.0, ws 8.22.1, Chromium local/Playwright. Protocolo público y operación en `server/README.md`.

## Implementación

`server/index.cjs`, `room-service.cjs` y `protocol.cjs`: transporte/operación, salas y contrato separados. No hay física paralela: cada sala ejecuta los cuatro módulos originales. El núcleo añade retiro DNF sin movimiento/contacto/puntos, sin alterar las fuerzas de un participante activo. Recursos frontend y fallback versionados 0.79. Servidor opcional, no añade dependencias para abrir el juego offline.

## Pruebas ejecutadas

| Comprobación | Resultado y límite |
|---|---|
| `npm test --prefix server` | **10/10**. Contratos estrictos, versión, revisión/listos, anfitrión, pintura/parrilla, límites, limpieza, timeout, watchdog sin reversa, DNF, revocación/rotación y cancelación por sobrecarga. |
| WebSockets reales dentro de la suite | Dos salas simultáneas: 2 pilotos ×3 vueltas Sunset y 4 pilotos ×1 vuelta Dusty con los cuatro modelos; diez vueltas válidas y resultados idénticos entre sus participantes. Desconexión/reanudación del anfitrión conserva coche/identidad y revoca token anterior. Otra carrera produce DNF real por caducidad y una vuelta válida del superviviente. **11 vueltas válidas en total**. |
| Reloj de producción | El scheduler monotónico real avanza cuenta regresiva sin entradas ni ticks manuales; cierre del servicio repetido sin errores. |
| Transporte hostil | Origin ajeno 403, binario 1003, payload excesivo 1009, incompatibilidad 1008; flood de inputs no adelanta tiempo y cierra conexión. No se aceptan posiciones/resultados/dt. Estado público sin credenciales; no sustituye una auditoría externa. |
| `node tests/browser-online-server.cjs` | **4 contextos Chromium separados**, WebSocket nativo. Hello/create/join/ready por revisión/start/input/snapshot/resultados; cuatro vueltas completas Dusty, 887 snapshots por navegador y resultados idénticos. Sin errores JS/protocolo. Reloj acelerado del servidor y navegación automatizada; no utiliza la interfaz del juego ni prueba Internet. |
| `SESSION_SOURCE_BASELINE=…/session-078/before.js node tests/validate-race-session.mjs` | Comparativa auténtica preextracción 0.77: 16 casos modelo/material, 3552 pasos, 96 estados y 22 contactos/cooldowns conservados. 24 vueltas válidas en carreras separadas/intercaladas; relojes/resultados/eventos propios. |
| Comparativa nativa de teclado | 16 escenarios/96 estados, 3552 pasos, cuatro coches y asfalto/tierra/hielo/costa, sin diferencias de movimiento/progreso/tiempo/HUD frente al script 0.78 archivado. |
| `browser-release.cjs` | HTML real anterior 0.78 con bundle nuevo, caché previa, ocho recursos versionados, /f1/, selección/salida/input/pausa/reinicio/menú y fallos de módulo comprobados. No demuestra despliegue público. |
| `LOCAL_STAGE=11 browser-local.cjs` | Teclas reales simultáneas 2/3/4, selección, cámaras/HUD, pausa/reinicio/resultados/siguiente, fullscreen/cinco tamaños y mandos emulados. Hardware físico pendiente. |
| `browser-touch.cjs` | Multitouch CDP real, dirección/GAS/mano/freno/reversa, cancelación/limpieza, ajustes/persistencia, fullscreen/cuatro tamaños y táctil+teclado/exclusión mando. Dispositivo físico y comodidad humana pendientes. |
| `validate-integration.mjs`, `validate-ghost.mjs` | IDs/recursos, diez pistas originales/catorce registradas y 70 combinaciones pista/barrera/gates; conservación, separación y límites de fantasma/récords, almacenamiento y fallback local. No son pruebas humanas de geometría/fun. |
| Sintaxis, `git diff --check`, npm audit runtime | Sin errores detectados; cero vulnerabilidades conocidas al consultar la dependencia instalada. |

Referencias repetibles, no récords humanos: Sunset termina en 206,85/209,55 s (tres vueltas); Dusty cuatro modelos 40,05/40,50/40,92/41,33 s. Navegadores Dusty 40,03/40,45/40,87/41,27 s. La política automática es conservadora; estos valores no representan el equilibrio humano del juego.

Las pruebas de migración usan el archivo auténtico anterior a la extracción (0.77), distinto del script 0.78 empleado para comparar teclado/HTML de esta entrega. Se neutraliza solo la versión de caché en la inversión declarada; no se reescriben físicas o estados esperados para esconder diferencias.

## Repetir verificaciones principales

Desde la raíz, con Node >=22 y Playwright/Chromium disponibles para las pruebas de navegador:

```sh
npm ci --prefix server
npm test --prefix server
node tests/browser-online-server.cjs
node tests/validate-integration.mjs
node tests/validate-ghost.mjs
node tests/browser-touch.cjs
LOCAL_STAGE=11 node tests/browser-local.cjs
git show 1b85a50:script.js > /tmp/pixelgp-session-before.js
SESSION_SOURCE_BASELINE=/tmp/pixelgp-session-before.js node tests/validate-race-session.mjs
git show 3ecaa67:script.js > /tmp/pixelgp-driving-before.js
DRIVING_SOURCE_BASELINE=/tmp/pixelgp-driving-before.js node tests/browser-shared-driving.cjs
git show 3ecaa67:index.html > /tmp/pixelgp-release-before.html
DRIVING_HTML_BASELINE=/tmp/pixelgp-release-before.html TRACK_HTML_BASELINE=/tmp/pixelgp-release-before.html node tests/browser-release.cjs
```

Si Playwright no está en la resolución estándar de Node, configurar `NODE_PATH`; `CHROMIUM_PATH` permite indicar el ejecutable existente. El script de navegador online sirve su propio endpoint efímero, lo cierra al terminar y no publica un servicio externo.

## Pendientes y siguiente entrega

Fase **33.1**: integrar sala, selección/listos, representación de snapshots, cámara/HUD por identidad y reconexión en el cliente real. Después interpolación/reconciliación/latencia/jitter, varios dispositivos humanos y hosting HTTPS/WSS. No hay acceso online desde menú ni servidor público desplegado. Estado/resultados en memoria; sin ranking firmado, persistencia, cuentas ni CPU de servidor. No se declara aceptación de conducción, sonido, hardware físico o equilibrio de pistas.
