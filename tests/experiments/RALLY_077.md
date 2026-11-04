# 0.77 — Rally Canyon, materiales y conservación de récords

Base: `91cdcc14f5d827e5c6a2bea6dd3055d2d6278504` / 0.76. Rama `work/rally-canyon-077`; trabajo preservado y revalidado al reanudarse el entorno. Se prioriza variedad jugable tras contrarreloj, conservando 30.4 como requisito de online. Auditoría: `AUDIT_077.md`.

## Cambio integrado

- `track-core.js`: solo la definición de Rally Canyon pasa de layout 2 a 3, roadVersion 1, mundo 2.500×1.600. Longitud 4.005,04 → 9.030,79 **unidades del mundo**, sin equivalencia definida con kilómetros. Recta larga, dos retornos y secuencia técnica al sur. Secciones de 68–128 de ancho útil, sin pianos sobre tierra, transiciones suaves. Trece checkpoints, separados ≤645,06 unidades; abierto por defecto, conservando las cinco opciones de barreras.
- `script.js`: la vista previa usa la paleta real del material en lugar del gris fijo. Grano de tierra determinista, cacheado y espaciado por calidad (12/20/28 unidades); se retira la pintura de línea central de Dusty/Rally. Se conserva la decoración temática, sin introducir recursos externos ni colisiones decorativas.
- Récord de ruta nuevo `RALLY CANYON@3:p6:r1:s1:b1`; anterior `RALLY CANYON@2:p6:s1:b1` conservado. Se corrige `readTrialStore`: conserva también tiempos de versiones anteriores con pista/modelo/perfil conocidos, lectura ≤512 combinaciones con prioridad para las actuales y límite global JSON 2 MB. Un fantasma anterior no se reproduce en la nueva geometría; permanecen hasta ocho repeticiones activas válidas.
- Recursos HTML/CSS/JS/fallback 0.77, documentación/roadmap actualizados. No cambian fuerzas, límites de velocidad, conducción, decisiones de CPU, modelos, puntos ni controles. Los trece trazados restantes quedan congelados por snapshot completo.

## Geometría y selección del candidato

Se rechazó un primer candidato parecido a Night (distancia normalizada 0,145). El conservado cambia respecto de Rally anterior **0,796**; distancia mínima frente a cualquier otro circuito **0,412** (Jungle), tras permitir traslación, escala, rotación, reflexión, sentido y posición de meta. No es simplemente un aumento de escala.

Análisis independiente de anchura: margen carretera/mundo **65,88**, separación libre entre bordes de ramales **33,50**, sin cruces muestreados. Estos datos describen geometría, no prueban que conducir sea divertido. Los perfiles visibles/físicos se comprueban aparte.

## Pruebas ejecutadas y superadas

| Prueba | Resultado y alcance |
|---|---|
| `node --check` de código/pruebas nuevos; `git diff --check` | Sintaxis y formato. |
| `RALLY_SOURCE_BASELINE=… node tests/validate-rally.mjs` | Forma propia, longitud/ancho/continuidad, 13 gates, límites, trece rutas iguales a snapshot 0.76, hash de conducción conservado. Tiempos anteriores y nuevos independientes; 600 claves históricas no desplazan el récord actual, lectura ≤512 y rechazo de identidad/modelo/versiones inválidos. La prueba del adaptador de archivo usa hooks sintéticos. Migración de script reversible exactamente al original 0.76. |
| `validate-tracks.mjs` | Catorce circuitos, nombres/superficies/perfiles, geometría finita, mundos, ancho y ausencia de cruces; regresiones sintéticas de cruce/solapamiento. |
| `TEST_TRACKS=11 validate-road-sectors.mjs` | 7.126 sondas físicas de borde, secciones periódicas, suaves y de anchura real; checkpoints con la misma anchura; tres rutas uniformes restantes. |
| `TEST_TRACKS=11 validate-barriers.mjs` | Cinco perfiles; dos contornos cerrados, 1.912 sondas, vallas/neumáticos físicos y respuesta al contacto/parada. |
| `validate-integration.mjs` | IDs/recursos de HTML, diez originales y 70 combinaciones pista/barreras, posiciones de gates. |
| `validate-shared-tracks.mjs` | 70 perfiles, 13.860 consultas de secciones/materiales, contornos y cápsulas de colisión, contextos inmutables. Referencia geométrica histórica con **solo Rally v3 migrado de forma declarada**; no dos carreras online. |
| `browser-rally.cjs` | **62 vueltas válidas** en Chromium: cinco perfiles×dos vueltas; cuatro coches×tres vueltas de contrarreloj; Fácil/Difícil×dos; tres niveles×cuatro coches×tres vueltas. Física/gates/eventos/paso fijo reales. Solo en el test, P1 utiliza entrada del controlador repetible `driveAI`; rivales usan su controlador normal. No se asignan vueltas ni checkpoints ni se teletransporta durante estas carreras. |
| Misma prueba | Cero pasos fuera del corredor en estas escenas, velocidades dentro del modelo, cuatro coches terminan cada parrilla dentro del plazo de llegada. Fantasmas completos y resultados por vuelta, sin puntos de temporada; registro anterior conservado tras recarga. Se inspeccionan render/capturas de tres calidades y pixels de preview de asfalto/tierra/hielo/pasto/volcánico sin cambiar pista activa. |
| `ROAD_STAGES=11 browser-road-sectors.cjs` | **9.863 sondas Canvas** de bordes/materiales en cinco perfiles y tres calidades: pintura/corredor y terreno coinciden, fuera de pista transparente, sin muros con perfil abierto. Además conserva carrera Night y vista local. Tolerancia de raster: tres unidades del mundo. |
| `validate-scenery.mjs` | **2.262 colocaciones** en catorce pistas/tres calidades; límites visibles, separación de carretera, mundo, espaciado, generación determinista y caché. Rally: ≤150 objetos en calidad alta, repartidos por el mundo. |
| `LOCAL_STAGE=11 browser-local.cjs` | Teclado simultáneo real, 2/3/4 humanos, coches/cámaras/HUD, pausa/reinicio/resultados/siguiente, fullscreen/cinco tamaños y mandos/desconexión emulados en el nuevo circuito. Las escenas de resultados del test son sintéticas; las 62 vueltas anteriores prueban gates y llegada. |
| `TOUCH_STAGE=11 browser-touch.cjs` | Multitouch CDP, GAS/giro/mano/freno/reversa, captura/cancelación, limpieza, cuatro tamaños, fullscreen, ajustes/persistencia; local P1 táctil/P2 teclado y exclusión de mando P1. Primera carrera sobre Rally; la prueba de recarga vuelve al valor de menú predeterminado. |
| `browser-catalogue.cjs`, `browser-release.cjs` | Catálogo nativo en cinco tamaños, selección de coche/pintura/pista y carrera, foco/overflow; entrega local `/f1/`, siete recursos coherentes y recuperación/fallo de dependencias con HTML anterior. No verifica el sitio público. |
| `validate-ghost.mjs`, `validate-events.mjs`, `validate-fixed-step.mjs`, `validate-countersteer.mjs` | Grabación/interpolación/datos inválidos/cuota, formatos/puntos/revancha/campeonato, paso fijo/pausa y doce referencias de contravolante conservadas. |
| `validate-coast.mjs --geometry` | Preservación del trazado/materiales de Coast, cobertura mixta y caché. Rally se compara con su snapshot nuevo, sin sobrescribir fixtures antiguos. |
| `validate-group-traffic.mjs` | Diez escenarios de cuatro coches / 120 vueltas válidas. Conserva presupuestos históricos de contactos/salidas/ritmo; el caso Rally de la batería histórica usa **layout 2** explícito y exige cuatro coches. El diseño nuevo se comprueba con la batería propia de 62 vueltas. No se aumentan velocidades ni se relajan presupuestos de CPU para aprobar la pista. |

El bloque desde `AI_DRIVERS` hasta `getTrackPath` conserva SHA-256 **`44a446af69efc9e9695df654cadc4be29c243f217068bf099b39c7ae340d40f1`**, igual a 0.76. Conducción/materiales físicos/coches no cambian. `driving-core.js`, `race-rules.js`, `engine-audio.js` y `ghost-lap.js` permanecen sin modificaciones.

Tiempos de referencia del controlador automático, no objetivos ni récords humanos:

| Escena | Vueltas medidas |
|---|---|
| Balanced / Normal / abierto, rival solo | 50,17 / 49,33 s |
| Balanced / Fácil, rival solo | 58,68 / 58,18 s |
| Balanced / Difícil, rival solo | 48,93 / 48,10 s |
| Contrarreloj Balanced | 50,60 / 49,33 / 49,38 s |
| Contrarreloj Corner King | 53,10 / 51,78 / 51,78 s |
| Contrarreloj Speed Demon | 50,18 / 49,12 / 49,15 s |
| Contrarreloj Rally Fox | 52,32 / 51,12 / 51,12 s |

Replays de las mejores vueltas: 493–519 muestras, duración íntegra. En las tres parrillas nativas todos completan tres vueltas y no hay salidas ni eventos de impacto en esas escenas; esto no garantiza ausencia de contactos en todo tráfico ni prueba agresividad frente a una persona. Las referencias históricas pueden contener contactos arcade dentro de sus presupuestos.

## Fallos encontrados y correcciones

- Menú gris para tierra y pintura central de asfalto en dirt: material común y acabado de tierra, verificados en Canvas y capturas.
- Lectura de contrarreloj solo para geometría vigente: descartaba tiempos anteriores en la siguiente escritura. Se retienen identidades históricas conocidas con presupuesto, preservando separación de versión/modelo/barreras.
- `browser-catalogue` podía aceptar el texto inicial «¡A FONDO!» del HTML antes de que terminara la preparación asíncrona, y observar todavía Sunset. El test ahora espera también carrera visible; la selección de pista no se modifica para esconder el fallo.
- La prueba histórica de tráfico comparaba una vuelta nueva de ~49 s con el límite del Rally viejo (~28 s). Se mantiene la referencia original con su geometría de fixture, separada del diseño nuevo. Se agrega una aserción explícita de cuatro coches para que el contexto de prueba no use por accidente el valor predeterminado de un rival. Los datos de fixtures anteriores no se sobrescriben.

## Qué queda pendiente

Conducción humana de varias vueltas para valorar riesgo, frenado, derrape y oportunidades de adelantamiento; aceptación de textura/contraste y confort de táctil/mandos físicos. No se afirma mejora de timbre, FPS de hardware, ausencia universal de contactos ni equilibrio humano. No hay servidor, salas online ni cámara 3D nueva. GitHub Pages público sigue sin comprobarse desde esta entrega; los checks `/f1/` son locales.

Prueba humana propuesta: Rally Canyon / Balanced / Normal / AUTO; aprender la recta ancha, frenar antes del primer retorno, comparar el retorno central de 72 unidades de ancho con la recta de hasta 128, y recuperar una salida corta de tierra. Repetir contrarreloj, cambiar a Speed/Rally Fox y probar barreras completas. Revisar que los trece CP y el minimapa permitan anticipar el ramal correcto.

Siguiente tramo técnico recomendado: 30.4, reloj/cuenta regresiva/estado/clasificación/resultados de carrera aislados y dos carreras completas simultáneas independientes, antes de autoridad de salas 32/33. Fase 27 sigue abierta para Champion Road, Meadow Run e Industrial Mix. Manejo/derrape, audio y gráficos continúan sujetos a pruebas humanas.
