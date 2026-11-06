# Champion Road 0.86 — recorrido, secciones y servidor coordinados

## Base y alcance

Main auténtico `82c10d3635e01cfa1f9161b63f2be81f553021b1` / 0.85, limpio y remoto coincidente. Se revisaron datos/geometría, render, barreras/superficies/gates, controles, sesiones, récords y publicación. Una sola definición cambia en producción: Champion Road, compartida por cliente y servidor. No se modifican fuerzas, modelos, IA, audio ni fórmulas geométricas.

| Propiedad | Antes | 0.86 |
|---|---|---|
| Mundo | 1400×896 | 2100×1344 |
| Longitud | 4.973,59 | 8.158,07 |
| Puntos de control | 32 | 38 |
| Asfalto | 84 uniforme | 72–120 variable |
| Pianos utilizables | Uniformes donde aplicaba | 0–6 por lado, distribuidos por sectores |
| Checkpoints | 7 | 12 |
| Identidad de tiempos | Champion @2 / p6/s1/b1 | Champion @3 / p6/r1/s1/b1 |
| Barreras automáticas | Curvas | Curvas, con los cinco perfiles elegibles |

Recta principal más amplia, retorno este revisado, pasaje interior más estrecho y regreso enlazado. Conserva el tema de estadio/asfalto y su posición 10 del campeonato. La distancia normalizada de silueta respecto al recorrido anterior es 0,15464; la más cercana entre las otras trece es 0,26663. Es una revisión de Champion con trazada y secciones distintas, no una promesa de catorce pistas rehechas.

## Variantes descartadas y geometría aceptada

La primera propuesta acercaba el retorno este al ramal inferior: separación de bordes −12,12 en escala 1,9 y −2,72 en 2,1. Escalar a 2,3 solo dejaba 6,68 y no resolvía bien el diseño. Se separaron esos puntos antes de elegir escala 2,1; no se ocultó el solapamiento con capas de pintura.

`validate-champion.mjs` / comprobaciones independientes:

- Margen al mundo de todo el corredor **43,92**; separación de ramales **55,31**, no solo ausencia de cruces de la línea central.
- Doce gates ordenados, distancias positivas y ninguna separación >650; anchuras legales compartidas con la carretera. Los trece sectores de práctica se inicializan con las identidades nuevas.
- Sectores distribuidos: 329 muestras de semiancho <40, 404 >54, 336 con piano >5,5 y 548 sin piano apreciable (paso 5). Transiciones continuas y cierre periódico.
- Cinco perfiles de barreras. Se comprueban extremos y centro de cada cápsula contra el corredor; mínima separación del eje de barrera al borde legal **6,86**. No equivale a una prueba continua de toda la huella del coche; las carreras y capturas complementan la geometría.
- **Trece rutas completas idénticas por SHA-256** a 0.85. Reponer la definición antigua reconstruye byte a byte el `track-core.js` auténtico de 0.85: el algoritmo geométrico y los otros datos no cambian.
- `validate-tracks.mjs`: catorce circuitos, límites/márgenes, perfiles y cruces. `validate-road-sectors.mjs`: **6.373 sondeos** de borde físico/visual de Champion, materiales, gates, periodicidad y dos pistas que siguen uniformes.

## Carreras y render nativos

`browser-champion.cjs` usa HTML/Canvas/sesión/reglas reales. Para pruebas de P1 se sustituye únicamente su intención por el controlador CPU existente; no se modifican fuerzas ni se recoloca el coche durante las vueltas:

- **62 vueltas válidas**, **744 checkpoints**: cinco barreras × dos vueltas libres; cuatro modelos × tres vueltas de contrarreloj; Fácil/Difícil libres; tres parrillas de cuatro coches × tres vueltas por coche.
- **Cero pasos fuera**, cero impactos de coche/barrera registrados en esa matriz. Todos los grupos completan el plazo normal; individuales sin saltos de recuperación y sin superar sus máximos. No prueba todas las colisiones posibles ni garantiza diversión humana.
- Normal libre Balanced: **45,07 / 43,98 s**. Fácil: 52,63 / 51,90; Difícil: 43,95 / 42,78. Son referencias del controlador, sin ajustar potencia o dificultad para forzar esos tiempos.
- Contrarreloj: Balanced 45,48/43,98/43,98; Corner 47,67/46,15/46,17; Speed 45,15/43,77/43,73; Rally 46,92/45,52/45,53. Fantasmas acotados completos, resultado/lista/reintento, cero puntos y tiempo viejo @2 conservado al recargar.
- Capturas generales y de tres sectores en Detallado/Retro/Rendimiento; revisadas la vista general y una zona de transición/piano/barrera. La cámara de captura está instrumentada; no cuenta como conducir humanamente esos sectores.
- Comparación contra `script.js` y `track-core.js` auténticos de 0.85: **39 imágenes de carretera byte a byte iguales** en las otras trece pistas × tres calidades. Champion se excluye explícitamente porque tiene su propia geometría/carrera, no para esconder una diferencia.

El mundo mayor implica más memoria del fondo/capa vial: aproximadamente 22,58 MB RGBA combinados frente a 10,04 MB antes (sin contar otras estructuras). Se mantienen cachés, presupuestos de decoración y modos gráficos; no se acredita el mismo FPS ni tiempo de carga en teléfonos sin medirlos.

## Online y actualización necesaria

Nueva huella compartida:

`ad20dd46ef387058811cdd3072626a264f39238ab9141d9a9c044ff99042c8f0`

El servidor anterior tenía otra geometría y se rechaza por versión. Backend **0.86.0**, manifiesto y recursos 0.86 alineados; protocolo/controles no cambian. `render.yaml` conserva Free y `autoDeploy: false`.

`ONLINE_STAGE=9 browser-online-game.cjs`: cuatro navegadores/modelos reales, vueltas de **83,95–85,48 s**, resultados iguales, reconexión/token, identidad propia/cámara/HUD, teclado fino, texto seguro y revancha. El conductor de esa prueba está limitado a 145 y es conservador: no es el controlador CPU ni una vuelta humana comparable con los 44 s anteriores. Segunda escena conserva Ágil/Clásica, parada sin reversa y mando perdido. No se cuentan sus abandonos como otra carrera completada.

**Acción del usuario después del push:** Render → servicio `pixel-grand-prix-rooms` → **Manual Deploy → Deploy latest commit**. Mantener Free/Build/Start/variables y recargar el frontend. `/health` debe devolver la huella anterior y `ok: true`; raíz identifica 0.86. No se accedió al panel ni se confirma un despliegue público. Instrucciones: `HOSTING.md`.

## Regresiones y mantenimiento de pruebas

- `validate-shared-tracks.mjs`: catorce registros/70 perfiles, **13.860 consultas de terreno/geometría**, 175.350 segmentos físicos; contornos/rails/cápsulas/índices, inmutabilidad y contextos separados frente a referencia histórica migrada.
- `validate-integration.mjs`: IDs/recursos/versiones, diez originales, catorce registradas, 70 perfiles y gates.
- Local nativo 2–4 en Champion: teclados, mandos emulados, cámaras/HUD, pausa/reinicio/resultados/siguiente/fullscreen y cinco resoluciones. Táctil en Champion: multitouch, cancelación/ajustes, cuatro tamaños, P1 táctil/P2 teclado.
- Práctica: ocho sectores completados (primero/último × cuatro modelos), trece semillas/caché, teclado/táctil/reintento/timeout/persistencia de sesión y transición local. Los interiores no se condujeron exhaustivamente.
- Dirección fina: 24 maniobras, cuatro humanos independientes, graduación táctil y guardado. Contravolante: doce casos y hash histórico del núcleo conservados.
- Pedales: cuatro modelos, 18 rutas digitales equivalentes, prioridades/retención, reloj 20–144 Hz. Speed: 0–100 1,17 s, 0–200 2,73 s, 0–260 4,02 s; mano/frenada/recuperación y registros conservados. La referencia longitudinal mide distancia real sin exigir heading mundial cero en el nuevo trazado.
- Recuperación nativa: cuatro jugadores, reversa/adelante, LT/RT, pausa y salida de barrera; metadatos de archivo actualizados a @3 y récord viejo no mostrado como vigente.
- Fantasmas/archivo: corrupción/cuota/separación/recarga; Rally conserva su revisión y registros. Diez tests de servidor aprobados, incluidas salas simultáneas, límites/versión/reconexión/DNF.
- Entrega en `/f1/`: HTML previo/fallback/caché, ocho recursos y flujos. Sintaxis/manifiesto/diff comprobados.

Se actualizaron expectativas de la identidad de Champion y la cuenta de pistas variables (12). Los fixtures anteriores no se sobrescriben: una revisión conocida exige un hash explícito nuevo y una prueba que conserve los otros trece. Los adaptadores de pruebas se habían desfasado por hooks de práctica/online: se normalizan esas capas opcionales para reconstruir las referencias históricas offline, sin borrar pruebas ni ampliar presupuestos de ritmo/contactos.

## Repetir

```sh
git show 82c10d3635e01cfa1f9161b63f2be81f553021b1:track-core.js > /tmp/pixelgp-tracks-085.js
git show 82c10d3635e01cfa1f9161b63f2be81f553021b1:script.js > /tmp/pixelgp-script-085.js
git show 82c10d3635e01cfa1f9161b63f2be81f553021b1:index.html > /tmp/pixelgp-html-085.html
CHAMPION_TRACK_BASELINE=/tmp/pixelgp-tracks-085.js node tests/validate-champion.mjs
node tests/validate-tracks.mjs
TEST_TRACKS=9 node tests/validate-road-sectors.mjs
node tests/browser-champion.cjs
ROAD_SOURCE_BASELINE=/tmp/pixelgp-script-085.js ROAD_TRACK_BASELINE=/tmp/pixelgp-tracks-085.js PARITY_STAGES=0,1,2,3,4,5,6,7,8,10,11,12,13 node tests/browser-material-parity.cjs
node tests/validate-shared-tracks.mjs
node tests/validate-integration.mjs
node tests/validate-rally.mjs
node tests/validate-countersteer.mjs
node tests/validate-pedals.mjs
node tests/validate-speed-balance.mjs
node tests/validate-ghost.mjs
node tests/browser-recovery.cjs
node tests/browser-fine-steering.cjs
PRACTICE_TRACKS=9 node tests/browser-practice.cjs
LOCAL_STAGE=9 node tests/browser-local.cjs
TOUCH_STAGE=9 node tests/browser-touch.cjs
DRIVING_HTML_BASELINE=/tmp/pixelgp-html-085.html node tests/browser-release.cjs
ONLINE_STAGE=9 node tests/browser-online-game.cjs
node server/scripts/client-config.cjs --check
npm test --prefix server
```

Playwright/Chromium solo en desarrollo. `CHAMPION_SCREENSHOTS` guarda capturas; `CHROMIUM_PATH` elige ejecutable. No se agregan assets externos ni dependencias de ejecución al juego.

## Pendiente

Aceptación humana de Champion, más maniobras con contactos/salidas intencionales y todos los sectores interiores, dispositivos físicos y memoria/FPS sostenidos. Despliegue Render y prueba pública entre dispositivos pendientes. Quedan Meadow/Industrial uniformes, conducción lateral, audio y los demás frentes; próximo recomendado: audio fase 26.
