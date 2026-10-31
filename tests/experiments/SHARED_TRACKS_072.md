# 0.72 — geometría compartida para avanzar al online

## Alcance real

Base: `main` 0.71, commit `88118ec20f3b5163e4107ed12fa6669768f11ce6`, comprobado limpio y actualizado antes de crear la rama. Se extrae el bloque 30.2 a `track-core.js`, módulo clásico/CJS sin dependencias externas. Es código usado por el juego y por Node; no un segundo trazado de prueba ni un DOM falso.

Incluye los catorce registros, interpolación/muestras/longitudes, anchuras y pianos, materiales por progreso, proyección/índice espacial, curvas/señalización, posiciones de checkpoints, escapatorias de grava, perfiles de vallas y neumáticos, contornos y cápsulas físicas con candidatos privados. Datos y derivados públicos congelados, construcción de cápsulas diferida y contornos reutilizados entre perfiles. Las posiciones de gates son compartidas; la validación de su cruce/orden, vueltas y resultados todavía está en el adaptador.

El cliente conserva las firmas de consultas necesarias para render/CPU y delega al módulo. No se cambian fuerzas, velocidades, coches, trazados, perfiles, sonidos ni récords p6/b1/s1.

## Problemas encontrados y correcciones

- Inicialización de cambio de pista: en una primera integración, el plan CPU podía consultar `curvatureAt` del mundo anterior antes de crear el nuevo. La comparación de carreras falló. Se mueve la creación del contexto inmediatamente después de elegir pista, antes de planificar; no se ajusta la CPU ni se amplían tolerancias para ocultarlo. La corrida fallida no cuenta como validación.
- Carga desde HTML viejo: ahora hay dos dependencias posibles omitidas. Se captura la URL de main antes del primer `await` y se cargan solo las ausentes, sin duplicar implementaciones. Fallo de cualquiera muestra recarga necesaria y deshabilita largar.
- Fixture de migración: una primera generación de reemplazos eliminados sin ancla no reconstruía el fuente. Se añadieron anclas únicas y se verificó igualdad exacta con el archivo real 0.71. Solo se usa en regresiones históricas, nunca en producción.
- Test de proyección: serializar el resultado de referencia con JSON convertía `-0` a `0` y causaba un falso fallo. La comparación plana conserva el signo de cero de ambos resultados, sin tolerancia nueva.
- Los servidores HTTP de pruebas necesitan servir el módulo real. Una sustitución inicial también alcanzó un `path.join` del observador; se corrigió antes de repetir la prueba nativa. No se reemplazan recursos por mocks de geometría.
- `validate-tracks` deja de extraer declaraciones privadas mediante texto/eval y valida el registro del módulo de producción con los mismos umbrales y fixtures negativos de geometría.

## Validación de entrega

Resultados finales superados:

| Comprobación | Resultado y límite |
|---|---|
| Sintaxis | 28 archivos JavaScript modificados/nuevos; diff sin errores de espacios. |
| Datos/geometría Node contra el archivo real 0.71 | 14 pistas × cinco perfiles = 70 configuraciones. 13.860 consultas de proyección/material, secciones/curvas/gates, contornos, vallas visibles/cápsulas e índice privado idénticos. Se mantienen diez originales y cuatro ampliaciones; diez rutas con ancho variable y cuatro uniformes. |
| Inmutabilidad/independencia del componente | Cambiar o consultar un contexto no modifica otro; arrays/reglas/contornos públicos congelados, Map privado y fachada espacial de solo lectura. Índices/perfiles inválidos rechazados. Carga/consulta/cápsulas Node con DOM, storage, audio, RAF y Date prohibidos. No son dos carreras aisladas. |
| Validador de trazados | 14 rutas sin nuevos cruces ni problemas de margen/separación; fixtures negativos de solapamiento/cruce/límite siguen detectados. Umbrales conservados. |
| Núcleo de conducción existente | 140 casos / 3.164 pasos, cuatro coches, siete rutas/cinco secuencias y fuerzas por material. Reglas de 0.71 conservadas. |
| Carreras emparejadas | 36 vueltas actuales y 36 de referencia real 0.71, cuatro coches por carrera: Sunset Normal, Coastline Normal y Frost Hard. Estados, tiempos, progreso, llegadas y contactos exactos; 2/6/0 pasos de contacto y cero salidas, igual que referencia. |
| Chromium: conducción nativa | 16 escenarios / 96 snapshots, cuatro modelos y cuatro pistas, 3.552 llamadas al paso compartido actual; movimiento/progreso/HUD exactos frente a 0.71, también basada en ese módulo. |
| Chromium: carretera | 42 imágenes reales de carretera, 14 pistas × tres calidades, byte a byte iguales a 0.71. |
| Barreras y recuperación | Node: Sunset/Frost/Coast, cinco perfiles, seis contornos y 4.277 probes; contacto/coche parado/cápsulas de valla y neumático superados. Chromium: P1–P4 simultáneos, reversa/avance, recuperación frontal, pausa, LT/RT emulados y récords superados. |
| Chromium: borde y carrera | Coast: 7.679 probes de píxel/material en cinco perfiles y tres calidades. Tres vueltas CPU con paso fijo 39,90 / 38,83 / 38,83 s. Night: otras tres vueltas en el escenario nativo heredado a 1/30, 58,80 / 57,73 / 57,73 s, más cámaras divididas. No son vueltas humanas ni benchmarks de ritmo nuevo. |
| Local | 2–4 teclados simultáneos, modelos, cámaras/HUD propios, pausa/reinicio/resultados/siguiente, fullscreen/cinco tamaños, mandos emulados/desconexión/asignación exclusiva superados. Hardware físico pendiente. |
| Integración/entrega | IDs/recursos/versiones, diez originales y 70 perfiles. Archivos reales bajo `/f1/`, caché antigua, HTML real 0.70 sin ambos módulos y 0.71 sin track-core, carga relativa/versionada y fallo individual de cada dependencia, teclado P3 local, sin errores JavaScript. No acredita Pages público ni backend. |

Revisadas capturas actuales de Coast con vallas completas y acercamiento abierto: pianos/bordes, material, coche y HUD exterior legibles. Son capturas estáticas, no conducción humana. Los comandos reproducibles principales son:

```sh
git show 88118ec:script.js > /tmp/pixelgp-071.js
TRACK_SOURCE_BASELINE=/tmp/pixelgp-071.js node tests/validate-shared-tracks.mjs
RACE_SOURCE_BASELINE=/tmp/pixelgp-071.js node tests/validate-pedal-races.mjs
node tests/validate-tracks.mjs
node tests/validate-integration.mjs
```

`without-shared-tracks.mjs` revierte exclusivamente la extracción declarada para conservar hashes históricos. Su salida se comprobó idéntica al archivo real anterior. La paridad contra el archivo real se ejecuta además de esa restauración, sin sobrescribir fixtures.

## Límites y siguiente fase

Esto no implementa `createRace`/`stepRace`, dos carreras completas aisladas, servidor WebSocket, salas, sincronización, reconexión ni publicación de un backend. El aislamiento de contextos de geometría no demuestra aislamiento de salas. Siguiente: 30.3, respuesta a contactos, progreso/vueltas/reloj y eventos; después 30.4, RaceState completo e intercalado/replay, y 32/33, salas/sincronización.

Chromium automatizado no equivale a jugabilidad humana, mandos físicos o medición de FPS en dispositivos del usuario. Pages público no queda verificado por las pruebas locales bajo `/f1/`.

La vista 3D inclinada sigue planificada: acceso futuro en Cámara y gráficos del paddock y desde pausa, selección 2D/3D separada de cerca/panorámica, regreso sencillo a 2D y misma simulación. No se añade un botón sin renderer.
