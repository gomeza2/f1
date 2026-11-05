# 0.82 — anticipación propia y parada segura online

Base: main `627fe622a996410aff8c7d253dffd9f00c9a48f6`, build 0.81. Rama `work/local-response-082`. Auditoría: `AUDIT_082.md`. Node 24.19.0, ws 8.22.1, Chromium/Playwright locales.

## Implementación y límites

`online-prediction.js` consume el núcleo físico real para una copia descartable del coche propio. Se publican al renderer solo posición/orientación, ruedas y atributos visuales. El HUD sigue leyendo la sesión autoritativa; ni inputs ni tiempos/gates/resultados contienen poses predichas. Progreso provisional y callbacks del clon no guardan récords ni emiten avisos de vuelta a la UI.

Máximo nueve pasos de 60 Hz (150 ms), lead habitual de 0–75 ms y corrección pequeña suavizada (hasta 48 unidades); recuperaciones grandes reinician el offset. Con datos de más de 250 ms congela la última pose. Tráfico cercano, contactos, barreras, liberación de controles, desconexión y final/DNF usan fallback. Se comprueba otra vez tráfico/geometría tras la corrección. Los rivales siguen interpolados; esto no es predicción conjunta de contactos ni replay determinista de entradas.

El retardo observado de ack incluye red y batching de snapshots: **no es ping ni un offset de relojes conocido**. Historial máximo de 64 inputs. Se mantienen protocolo/huella y servidor originales, sin nueva dependencia productiva ni despliegue de Render. La nueva carga JS ocurre solo al abrir online; offline conserva sus ocho recursos.

## Experimento de respuesta

`compare-online-response.cjs`: un coche ya rodando a 100, cuatro segundos de órdenes fijadas (aceleración, primer giro a 500 ms, contragiro y frenado), núcleo real y snapshots a 20 Hz. Se simulan subida/bajada, jitter y orden de entrega TCP. Se comparan presentación clásica 0.81, último estado directo y Ágil. Error medio de posición respecto al **estado actual del servidor**, en unidades del mundo; no metros, FPS ni tiempos humanos.

| Subida/bajada simuladas | Clásica: error medio | Estado directo | Ágil seleccionada |
|---|---:|---:|---:|
| 0 / 0 ms | 8,23 | 1,37 | 0,08 |
| 50 / 50 ms | 12,69 | 5,68 | 0,09 |
| 100 / 100 ms | 17,51 | 10,25 | 3,03 |
| 150 / 150 ms | 22,66 | 15,13 | 7,53 |
| 100 / 100 ms + jitter | 19,29 | 13,47 | 4,56 |
| 30 / 170 ms | 23,65 | 16,72 | 9,57 |
| 170 / 30 ms | 12,38 | 4,68 | 3,02 |

El primer giro supera el umbral angular en 116,7–416,7 ms con Clásica, 50–350 ms con estado directo y dentro de la misma muestra o la siguiente (0–16,7 ms) con Ágil. Resolución de muestreo 16,7 ms: **no significa ping cero ni mide la experiencia humana**. La mejora se obtiene anticipando imagen, no haciendo que el servidor ejecute antes una orden.

Se compararon techos de lead de 50/75/100 ms. El de 100 produjo menor error global pero empeoró frente al estado directo en la asimetría 170/30 (5,89 frente a 4,68). Se descartó como valor predeterminado. Entre candidatos sin regresión frente al directo en estos siete casos, 75 tuvo menor media (3,98) que 50 (4,56). Esta elección no garantiza mejora en cualquier conexión; se conserva Clásica y se requiere aceptación humana.

## Verificaciones ejecutadas

| Prueba | Resultado y alcance |
|---|---|
| `validate-online-prediction.cjs` | **32 casos**, cuatro coches, siete rutas y grava adicional: poses previstas iguales a seis pasos originales de sesión a 60 Hz; snapshot/HUD/progreso intactos. Guards clásico, stale, controles, otro piloto, contacto, tráfico, barrera, recuperación/reset. Cuatro reproducciones de reversa involuntaria con el antiguo freno y cuatro paradas correctas con freno + mano. |
| `validate-online-ack.cjs` | Historial máximo 64, retraso/EWMA observado, duplicados no vuelven a contarse, reset por carrera/cierre y wire format de controles intacto. |
| `validate-online-client.cjs`, `validate-online-network.cjs` | Handshake/versiones, URL/TLS, secuencias, entrada bloqueada hasta session, credenciales, cancelación/cold start, deadline de reconexión y timeline con jitter conservados. |
| `browser-online-game.cjs` | **Cuatro contextos Chromium**, cuatro modelos, cuatro vueltas válidas y resultados iguales; teclado nativo P3, propia cámara/HUD, corte y reanudación reales, nombres como texto y revancha. Segunda parrilla: P2 de fila delantera se separa sin editar posiciones, activa anticipación, pose prevista llega al renderer sin mutar el coche del servidor, cambia a Clásica, se detiene tras Escape y mantiene cero/reverseHeld0; mando emulado perdido aplica freno + mano. Esa segunda escena termina por abandono y no se cuenta como otra carrera completada. |
| `browser-online-connection.cjs` | WebSocket nativo, gate HTTP503 local, URL predeterminada, reintentos/cancelación/Escape y exactamente una sala al reconectar. Carga del nuevo módulo real. |
| `browser-shared-driving.cjs` | Frente a script auténtico 0.81: 16 escenas, 3552 pasos y 96 estados/HUD idénticos; teclado, cuatro modelos/materiales, reversa/freno/mano conservados offline. |
| `browser-local.cjs`, `browser-touch.cjs` | 2/3/4 teclados, mandos emulados, selección/cámaras/HUD, pausa/reinicio/resultados/siguiente, fullscreen/tamaños; multitouch CDP y persistencia/cancelación. No prueba hardware físico. |
| `browser-release.cjs` | HTML auténtico 0.81, /f1/, caché/fallback, ocho recursos offline, controles/ciclo de vida y error de módulos. No prueba Pages desplegado. |
| `npm test --prefix server` | Diez pruebas con salas simultáneas y once vueltas válidas, permisos, límites, DNF, reconexión y scheduler; backend sin cambios. |
| `validate-integration.mjs`, `validate-ghost.mjs`, `validate-fixed-step.mjs` | Catorce pistas/setenta perfiles/IDs/recursos, récords y fantasma preservados, pasos físicos a distintas frecuencias/jitter. |
| Sintaxis/manifiesto/diff | JS nuevo/modificado analizado, build 0.82 y huella física coherentes, sin errores de whitespace. |

Capturas locales de carrera libre P2 y sala móvil revisadas: coche/cámara, HUD exterior y nueva selección legibles. Navegación/relojes/mandos instrumentados: los valores de vueltas de unos 40–42 s de las pruebas no son récords humanos ni medida de equilibrio. La activación visual se comprueba después de separación real; no se debilita el guard de tráfico para hacer pasar una escena con vehículos aparcados.

## Repetir

```sh
npm ci --prefix server
node server/scripts/client-config.cjs --check
node tests/validate-online-prediction.cjs
node tests/validate-online-ack.cjs
node tests/validate-online-client.cjs
node tests/validate-online-network.cjs
node tests/experiments/compare-online-response.cjs --policies
node tests/browser-online-game.cjs
node tests/browser-online-connection.cjs
npm test --prefix server
node tests/validate-integration.mjs
node tests/validate-ghost.mjs
node tests/validate-fixed-step.mjs
LOCAL_STAGE=11 node tests/browser-local.cjs
node tests/browser-touch.cjs
git show 627fe62:script.js > /tmp/pixelgp-before-082.js
DRIVING_SOURCE_BASELINE=/tmp/pixelgp-before-082.js node tests/browser-shared-driving.cjs
git show 627fe62:index.html > /tmp/pixelgp-before-082.html
DRIVING_HTML_BASELINE=/tmp/pixelgp-before-082.html node tests/browser-release.cjs
```

Playwright/Chromium deben estar disponibles en desarrollo; `NODE_PATH`, `CHROMIUM_PATH` y `ONLINE_SCREENSHOTS` según entorno. Los tests abren/cierran servidores locales y no modifican salas públicas.

## Pendiente

Prueba humana de Ágil frente a Clásica con red real, varios dispositivos y hardware modesto; validación pública del servicio (bloqueo CONNECT 403 observado previamente). No se declara ese despliegue verificado aquí. Para replay/reconciliación completa faltan ticks/timestamps aplicados por el servidor y solución de contactos grupales, antes de retirar guards. Manejo/derrape/audio siguen abiertos. Próxima entrega recomendada: alternar con presentación/escenarios de fase 36, sin tocar el contrato físico del servidor por estética.
