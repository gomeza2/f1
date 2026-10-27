# 0.60 — Jungle Sprint con recorrido y secciones propios

## Base

Main limpio revisado en `dd49054` (0.59); código de pistas, secciones, superficies, barreras, CPU, récords y pruebas, historial y plan abierto. Rama recuperable `work/jungle-060`. Se conserva el control humano p6 y el reloj fijo s1. Jungle era un trazado uniforme de 3.485 unidades y mundo 1400×896. El fixture nuevo guarda su forma anterior, materiales físicos y las firmas de los otros trece recorridos.

## Diseño elegido

- 28 puntos de trazado propios: apertura rápida, enlace en S, interior técnico, arco oriental y horquilla del regreso. No es la forma anterior ampliada ni renombrada.
- 6.177,514 unidades (+77,2 %), mundo 2000×1280. Sectores de ancho 72–116 con transiciones suaves: apertura para acelerar/disputar, estrechamiento en los enlaces y recuperación abierta.
- Nueve gates ordenados, separación máxima <650; misma sección para terreno, render, barreras, puertas, CPU, mapa y previa. Record `JUNGLE SPRINT@3:p6:r1:s1`; @2/p6/s1 y anteriores conservados.
- Mantiene material **grass**, grip 0,79 y resistencia originales. Añade únicamente `road` a la definición común de pasto: borde verde claro, cuerpo pisado y grano determinista, guardados con la pista. Sin pianos rojos ni asfalto sobre pasto; las pistas asfaltadas conservan sus pianos propios. Detalle adaptado a high/retro/lite.
- Perfil automático abierto y alternativas full/half/corners/open/auto. Física, modelos, fuerza lateral, contravolante, CPU, audio, controles y otros trece trazados permanecen.

Distancia de silueta normalizada a la ruta anterior **0,544**; la más próxima entre las otras trece queda en **0,393** (Dusty). La medida ignora escala/rotación/reflejo/salida, por lo que no aprueba una simple ampliación. No mide diversión.

## Errores detectados y variantes descartadas

1. Primer cierre corto hacia meta: separación de carretera **−2,46**, bordes solapados. Se cambia el retorno occidental, sin rebajar la prueba.
2. Cierre corregido, mundo 1,8: longitud 5.560, separación legal 39. La CPU libre y la prueba de píxeles pasaban, pero la validación fina de contorno completo detectó once vértices con desvío >2, máximo **3,27**. Esto demuestra por qué carrera sin incidentes/píxeles generales no bastan para aprobar barreras.
3. Misma silueta con más separación de ramales:

| Escala | Longitud | Desvío máximo del contorno | Vértices >2 |
|---|---:|---:|---:|
| 1,8 | 5.560 | 3,270 | 11 |
| 1,9 | 5.869 | 1,110 | 0 |
| **2,0 elegida** | **6.178** | **0,342** | **0** |
| 2,1 | 6.486 | 0,334 | 0 |

2,0 deja más margen que 1,9 sin alargar por la mejora mínima de 2,1. Geometría elegida con sección legal: margen al mundo **75,4**, separación entre carreteras **53,1**. Vallas dibujadas y colisión siguen compartiendo las mismas primitivas. El test final comprueba dos contornos cerrados/1.352 sondeos, contacto con valla/neumáticos y respuesta desde parado sin generar velocidad. No se amplía su tolerancia de dos unidades.

Los tests nuevos se ajustaron al dato real de nueve gates tras ampliar el mundo. El test común de perfiles mantenía un máximo histórico de semiancho 56: admite 58 **solo para Jungle**, con su geometría y perfil propios acotados; los otros siete máximos permanecen. No se recorta el diseño para adaptarlo a una constante histórica del test.

## Carreras de la variante publicada

Normal libre: anterior **25,50 / 24,53 s**; elegida **36,12 / 35,03 s**. No se comparan récords de diseños diferentes. Cinco perfiles, dos vueltas CPU por perfil: sin pasos fuera de pista en todos. Cuatro modelos dirigidos por el controlador real, dos vueltas: respetan su velocidad máxima, completan puertas y no usan recuperación teletransportada.

| Parrilla de cuatro, tres vueltas | Media por vuelta de cada piloto | Pasos con contacto |
|---|---|---:|
| Fácil | 42,32 / 41,80 / 40,67 / 40,26 | 0 |
| Normal | 35,86 / 36,32 / 35,04 / 34,62 | 0 |
| Difícil | 35,69 / 36,07 / 35,12 / 34,59 | 3 |

**12 carreras / 54 vueltas válidas** sobre la geometría final, todas a 60 Hz como producción. No se suman las 54 de la variante 1,8 ni reruns de geometría a ese total. Tres pasos con contacto no son tres accidentes independientes ni se promete ausencia universal de roces.

Prueba exploratoria de gas permanente con la misma política automática de dirección: con frenado planificado completa dos vueltas sin salir; forzando gas y quitando freno/mano no completa una vuelta en 250 s y acumula ~86,6 s fuera. Es un controlador sintético incapaz de negociar curvas a esa velocidad, no una medida de dificultad humana ni una prueba de que toda curva requiera frenar.

## Comprobación de navegador y conservación

- Chromium: geometría final, cinco perfiles y tres calidades, **6.671 sondeos** de píxeles/borde/material; transparencia fuera, material nativo dentro y sin barreras abiertas invisibles. Carrera Jungle con acumulador de producción: tres vueltas **36,12 / 35,03 / 35,02**, final 106,17 s. La prueba conserva además la referencia Night y cámara dividida; sus vueltas no se suman a las 54 de Node.
- Revisadas capturas de overview abierto/completo y cercana: curvas, separación, carretera verde, vallas y puertas visibles. La presentación sigue siendo procedural retro; ambientación más profunda queda en 36.3.
- Comparación de carretera de los otros trece circuitos, tres calidades: **39 imágenes byte a byte idénticas**, incluido Meadow. Solo Jungle cambia diseño/arte. La adición de estilo no altera comportamiento físico de pasto.
- Históricos: la excepción de Jungle versión 3 remite a su nuevo fixture, sin modificar hashes/tiempos antiguos. Los tests de materiales excluyen solo la nueva propiedad visual `grass.road`; toda física/otras apariencias permanece comparada. Se habilita `--geometry` en Frost/Pixel/Volcano para comprobar conservación sin repetir sus carreras completas; default mantiene sus matrices de carrera.
- Integración de IDs/archivos/versionado y diez originales/catorce registros, 70 perfiles/gates, geometría, ocho secciones variables y seis uniformes. Núcleo de conducción/IA/colisiones y contravolante p6 comprobados contra su fixture. Reloj fijo conserva estados a 20/30/60/120/144 FPS y jitter.
- Local: 21 configuraciones y cuatro mandos emulados; navegador local 2–4, cámaras/HUD, cinco resoluciones, pausa/reinicio/resultados/fullscreen y entrega sin puente bajo `/f1/`. Hardware físico/comfort siguen pendientes.
- CPU de rutas no modificadas: diez vueltas libres y 24 de carril, reservas focalizadas; no se amplían presupuestos de contacto/ritmo. No se anuncia una mejora de IA por cambiar Jungle.
- Escenario Jungle: 240 ubicaciones en tres calidades, despeje del corredor/huella y límites de mundo, determinismo/caché; 97 objetos en high y 65 en lite. No se mide FPS del equipo del jugador.

## Reproducción

```sh
node tests/validate-jungle.mjs
node tests/validate-jungle.mjs --geometry
TEST_TRACKS=5 node tests/validate-barriers.mjs
ROAD_STAGES=5 node tests/browser-road-sectors.cjs
git show dd49054:script.js > /tmp/pixelgp-before-060.js
ROAD_SOURCE_BASELINE=/tmp/pixelgp-before-060.js PARITY_STAGES=0,1,2,3,4,6,7,8,9,10,11,12,13 node tests/browser-material-parity.cjs
```

Navegador requiere Playwright/Chromium de desarrollo, no nuevas dependencias del juego. `ROAD_SCREENSHOTS` guarda capturas.

## Pendiente

Jugar la nueva ruta humanamente, ritmo/diversión, adelantamientos reales y salidas/recuperación en distintas curvas. Pruebas geométricas o vueltas CPU no sustituyen esa evaluación. Ocho circuitos variables y seis uniformes pendientes. Próximo tramo recomendado: escenarios 36.3 con mejor escala/temas/lectura; seguir manejo, audio y CPU según pruebas humanas. La consulta pública de Pages vuelve a responder `CONNECT tunnel failed, response 403` del proxy; entrega local comprobada, despliegue público sin confirmar.
