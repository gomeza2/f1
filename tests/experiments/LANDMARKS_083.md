# Paisajes 0.83 — comparación y regresión

## Alcance

Base auténtica: main `7311b4353e89c9d2d255cc5e67fe32e47c5584e3` / 0.82, no un fixture reescrito. Renderer clásico `script.js`, sin nuevos módulos ni assets. Trece referencias ambientales en cinco temas:

| Circuito | Referencia | Cantidad | Radios del mundo |
|---|---|---|---|
| Neon Harbor | Dársena con muelles, contenedores y embarcación | 1 | 104 |
| Dusty Mesa | Mesetas con estratos y cactus | 3 | 77, 120, 107 |
| Volcano Ring | Cráteres por capas de basalto/lava | 3 | 135, 161, 106 |
| Coastline Run | Lagunas con arena, bajíos y agua profunda | 3 | 93, 78, 101 |
| Rally Canyon | Relieves de cañón escalonados | 3 | 145, 160, 160 |

Detallado y Retro comparten posiciones/huellas; Retro reduce líneas y capas. Rendimiento conserva el fondo anterior. Todas las figuras son originales, estáticas y fuera del recorrido; no son nuevos terrenos transitables ni objetos físicos.

## Colocación y coste

Candidatos de cuadrícula de 48 unidades, distancia exacta a la pista, radio acotado por espacio vial, límites del mundo y máximo 180. Solo radios >=72; máximo tres por pista, separados por radios +24. Huella completa, incluida sombra, a >=164 unidades de la línea central, más el incremento de anchura máxima respecto a la base. El buffer extra evita ocupar la recuperación que sí se permite al coche. Los objetos pequeños respetan el círculo reservado.

Metadatos congelados en WeakMap por pista; los elementos entran en el presupuesto existente de 150/110/80 decoraciones. Se pintan en el Canvas de fondo existente antes del asfalto/escapatorias. No se crea otra textura/lienzo ni se dibuja paisaje por frame. Las cachés no retienen pistas descartadas mediante claves fuertes.

## Comparación nativa aprobada

`browser-landmarks.cjs` sirve el juego real y sustituye únicamente el script por la versión auténtica anterior en la página de referencia. Chromium headless nativo, 1440×1000, 14 pistas × tres calidades para ambas versiones:

- Diez fondos cambiaron: cinco temas en Detallado/Retro. Los otros **32 fondos y sus metadatos de decoración son idénticos byte a byte**.
- Las **42 capas de carretera/material** conservan SHA-256. **1.611.612 muestras de píxeles** del fondo alrededor de la línea central/corredor de recuperación conservan su hash; esto complementa, no sustituye, la comprobación geométrica de las huellas completas.
- Igual número de Canvas creados e igual tamaño RGBA de fondo + carretera en cada escena. Cuatro dibujos consecutivos reutilizan las cachés y no invocan de nuevo el renderizador de paisajes.
- Dibujar no modifica el estado físico de los coches. Sin errores de JavaScript.
- Capturas antes/después de cinco temas, generales/cercanas. Se revisaron las cinco vistas cercanas: volumen, identidad y sombras legibles. La cámara enfocada es instrumentación de prueba, no una cámara nueva del producto ni prueba humana de una vuelta.

Microbenchmark local aislado (una muestra; milisegundos, sin valor estadístico):

| Circuito | Preparar escena antes / después | Media de 4 frames cacheados antes / después |
|---|---|---|
| Neon | 473,0 / 474,3 | 0,275 / 0,275 |
| Dusty | 204,9 / 192,5 | 0,225 / 0,250 |
| Volcano | 308,4 / 335,3 | 0,425 / 0,275 |
| Coast | 884,8 / 830,8 | 0,200 / 0,250 |
| Rally | 680,9 / 812,1 | 0,525 / 0,375 |

Rally tarda unos 131 ms más en esta preparación aislada; no se oculta ese coste. Las variaciones no demuestran una aceleración del motor ni FPS sostenidos. El trabajo extra está en la preparación, no en cada frame; siguen pendientes perfilado prolongado y teléfonos físicos.

## Regresiones de la entrega

| Prueba | Resultado |
|---|---|
| `validate-scenery.mjs` | 2.091 colocaciones en 14 pistas × tres calidades; huellas dibujadas dentro de su reserva, separación, límites del mundo, margen vial, registro por tema/calidad, generación determinista y reutilización de caché. 849 objetos en Detallado frente a 560 en Rendimiento. |
| `browser-shared-driving.cjs` | 16 escenas, 3.552 pasos físicos y 96 estados/HUD idénticos frente a 0.82; cuatro modelos y asfalto/tierra/hielo/costa. |
| `browser-local.cjs` | 2/3/4 teclados simultáneos, cámaras/HUD, coches, pausa/reinicio/resultados/siguiente, fullscreen/cinco tamaños y mandos emulados con desconexión. Coastline con paisaje nuevo. |
| `browser-touch.cjs` | Multitouch nativo CDP, gas/dirección/freno/mano/reversa, cancelación, ajustes/persistencia y P1 táctil/P2 teclado; Coastline. Teléfono físico pendiente. |
| `browser-release.cjs` | Juego en `/f1/`, caché previa, ocho recursos offline versionados, catorce pistas, controles/ciclo de vida/fallback de HTML auténtico anterior. Es servidor local, no Pages publicado. |
| `browser-online-game.cjs` | Cuatro contextos Chromium, cuatro modelos, carrera Dusty con vueltas válidas de 40,40–41,70 s y resultados coincidentes; reconexión real, UI/HUD/cámara por identidad y revancha. Segunda escena P2: 108 frames de anticipación observados, modo Clásico, parada sin reversa y mando perdido; termina por abandono y no cuenta como otra carrera completa. |
| `validate-online-prediction.cjs` | 32 combinaciones coche/terreno frente a seis pasos de 60 Hz; guards y cuatro regresiones de parada sin reversa. |
| `validate-online-ack/client/network.cjs` | Historial acotado, contrato/huella/TLS, conexión/reintentos/cancelación y timeline con jitter; sockets/relojes instrumentados. |
| `npm test --prefix server` | Diez pruebas aprobadas, salas simultáneas y once vueltas válidas, reconexión, límites, DNF y scheduler. Backend intacto. |
| `validate-ghost.mjs` | Grabación acotada a 180 s, interpolación angular, separación por coche/barreras, recarga, ocho fantasmas sin borrar tiempos, cuota/corrupción y fallback local de cuatro jugadores. Pruebas de adaptador sintéticas. |
| `validate-integration.mjs` | IDs únicos/referencias/recursos versionados, diez pistas originales, 70 perfiles de pista/barreras y checkpoints sobre carretera. |
| Sintaxis/manifiesto/diff | JS modificado/nuevo analizado; manifiesto coherente con mismo núcleo; sin errores de whitespace. |

Las carreras, relojes y mandos están instrumentados. Esos tiempos no son vueltas humanas ni evidencia de equilibrio, latencia por Internet o calidad de audio.

## Repetir

Con Node y Playwright/Chromium instalados (sin añadir dependencias de ejecución al frontend):

```sh
git show 7311b4353e89c9d2d255cc5e67fe32e47c5584e3:script.js > /tmp/pixelgp-before-083.js
git show 7311b4353e89c9d2d255cc5e67fe32e47c5584e3:index.html > /tmp/pixelgp-before-083.html
node --check script.js
node server/scripts/client-config.cjs --check
node tests/validate-scenery.mjs
SCENERY_SOURCE_BASELINE=/tmp/pixelgp-before-083.js node tests/browser-landmarks.cjs
DRIVING_SOURCE_BASELINE=/tmp/pixelgp-before-083.js node tests/browser-shared-driving.cjs
DRIVING_HTML_BASELINE=/tmp/pixelgp-before-083.html node tests/browser-release.cjs
LOCAL_STAGE=10 node tests/browser-local.cjs
TOUCH_STAGE=10 node tests/browser-touch.cjs
node tests/browser-online-game.cjs
node tests/validate-integration.mjs
node tests/validate-ghost.mjs
node tests/validate-online-prediction.cjs
node tests/validate-online-ack.cjs
node tests/validate-online-client.cjs
node tests/validate-online-network.cjs
npm test --prefix server
```

`SCENERY_SCREENSHOTS` permite guardar las capturas; `CHROMIUM_PATH` selecciona el ejecutable. La referencia siempre debe ser el script auténtico del commit indicado. No se modifican fixtures para esconder diferencias.

## Conservado y pendiente

Mismos catorce trazados/checkpoints/barreras, cuatro modelos, física p6/b1/s1, CPU, audio, récords, campeonato, fantasma, local 2–4, táctil y online. Misma huella de simulación `63cfdf88c6904edf63d78f65dc44d3627a06bd1139fd21229235c4a45f955d6d`; backend y contrato intactos, URL de Render Free conservada. Recursos/manifiesto del cliente 0.83 coherentes.

Sin despliegue ni prueba pública de Render/Pages en esta entrega. Pendientes valoración humana de manejo/arte, escucha de audio, teléfonos/mandos físicos, iluminación más amplia, nueve escenarios sin paisaje grande nuevo y tres circuitos de anchura uniforme. 36.3 sigue parcial. Próxima propuesta: fase 25, comparar control en curva/derrape y recuperación con escenarios repetibles antes de cambiar la física compartida.
