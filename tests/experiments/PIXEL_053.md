# Pixel City — experimento 0.53 / fase 27

## Base inspeccionada y objetivo

Main `6d4776cf2c0c0d22f9c267307d80e81bf18c3efb` / build 0.52, árbol limpio y remoto confirmado antes de crear `work/pixel-city-053`. Revisados definiciones de pista, consulta de secciones/materiales, dibujo/cachés, CPU, checkpoints, récords, escenas, pruebas y documentación vigente. Las auditorías anteriores de manejo, audio y local siguen como contexto, no como aceptación humana.

Problema confirmado: Pixel City casi comparte forma con Thunder (distancia normalizada 0,09154), Neon (0,10297) y Jungle (0,11801), con ancho uniforme. Se conserva el nombre/posición del campeonato y se cambia el recorrido real.

## Comparación de variantes

Misma física 5, modelos, CPU 0.51, dt 1/60, un rival Normal, coche humano marcado terminado; vueltas válidas por todos los gates. Sin ventajas de velocidad ni recolocación.

| Variante | Longitud | Mundo | Vueltas Normal | Gates | Decisión |
|---|---:|---|---|---:|---|
| 0.52 preservada | 3394,67 | 1400×896 | 23,02 / 22,08 s | 5 | Base |
| A, escala 1,6 | 4367,54 | 1600×1024 | 25,47 / 24,42 s | 6 | Elegida: pista corta propia |
| A, escala 1,8 | 4913,49 | 1800×1152 | 28,10 / 27,00 s | 7 | Correcta, no hace falta agrandar todas |

Avenidas rápidas, desvío interior y retorno enlazado. Anchura útil total 76–112, pianos transitables presentes/ausentes según sector; ancho interpolado y cierre periódico. Asfalto y barreras parciales automáticas conservados, cinco perfiles seleccionables.

Silueta más próxima: Jungle 0,23867, después Thunder 0,28239 y Neon 0,28910. Comparación independiente de escala/traslación/giro/espejo/inicio/sentido. Margen de carretera al mundo 51,83 y separación mínima de corredores no adyacentes 59,65 usando ancho real; centro sin cruces. Estos números detectan copias/errores geométricos, no prueban diversión ni equilibrio.

## Integración y conservación

Una sola definición de sección alimenta dibujo/pianos, terreno y grava, límites/colisiones, barreras, espacio de CPU, gates/meta, minimapa y previa. Seis gates ordenados, separación máxima 623,94. Nuevo récord `PIXEL CITY@3:p5:r1`; @2 queda guardado. Fixture `pixel-0.52.json` registra la base y congela otros trece recorridos/modelos/dificultades/personalidades/materiales/física. Los tests históricos eximen únicamente Pixel versión 3 y remiten su conservación a este fixture; no se actualizan hashes para ocultar cambios ajenos.

No cambia física, potencia, sonido, CPU ni local 2–4. Siete circuitos variables y siete uniformes. La ambientación urbana detallada aún puede evolucionar; el fondo recuperable conserva su material actual.

## Pruebas

- `node --check script.js`, `engine-audio.js` y scripts de prueba modificados; `git diff --check`.
- `validate-pixel.mjs`: **12 carreras / 54 vueltas válidas**. Cinco perfiles × dos vueltas; cuatro modelos × dos; tres dificultades × cuatro coches × tres vueltas. Sin desplazamiento extra ni exceso de potencia, gates y récords coherentes. CPU Normal libre: cero pasos de centro fuera de la franja legal en los cinco perfiles (no implica todas las ruedas siempre dentro).
- Modelos, controlador real a 60 Hz: Balanced 25,87/24,42; Corner 26,65/25,20; Speed 25,67/24,32; Rally 26,33/24,97 s.
- Parrillas a 30 Hz, medias por coche: Fácil 29,69/29,27/28,31/27,89; Normal 25,46/25,09/24,42/24,07; Difícil 25,02/24,68/24,23/23,84 s. **Cero pasos con contacto en estas tres referencias**; se mantiene presupuesto anterior ≤30, sin prometer cero contacto universal.
- `validate-frost.mjs`: otras doce carreras/54 vueltas, referencias de hielo intactas; los otros trece trazados también quedan preservados por el fixture nuevo. No se repite la matriz completa de 42 carreras libres/20 parrillas en esta entrega.
- Geometría de catorce pistas, identidad Dusty/Sunset/Night, siete perfiles variables y **30.669 sondas físicas**. Barreras Pixel: dos contornos cerrados / **947 sondas**, cinco perfiles, contacto visible/resto. Escena: **82 colocaciones** en tres calidades, límites/holgura/reutilización; 32 objetos high frente a 23 lite.
- Integración de recursos/IDs/70 combinaciones de pista-perfil, menú, checkpoints, contactos/recuperación y CPU focalizada. Local Node ampliado a **21 configuraciones** incluyendo Pixel, 2/3/4 personas.
- Chromium `ROAD_STAGES=7 browser-road-sectors.cjs`: **4.669 sondas de píxeles**, cinco perfiles y tres calidades. Pixel tres vueltas 25,33/24,27/24,30, finish 73,90. Night tres vueltas y cámaras separadas conservadas. Capturas open/full/cercana revisadas, sin barreras superpuestas al corredor ni errores JS en el recorrido automatizado.
- `browser-material-parity.cjs`, baseline 0.52 preservada: **18 imágenes** de los otros seis corredores variables × tres calidades, byte idénticas.
- `browser-smoke.cjs`, `browser-local.cjs`, `browser-release.cjs`: recorrido general, 2–4 personas/resoluciones/mandos emulados y recursos nuevos coherentes bajo `/f1/`; el último usa los archivos de entrega sin puente de estado.

El primer pase general de Chromium agotó 30 s al iniciar una carrera durante carga concurrente. Se repitió con menos pruebas simultáneas y pasó, sin cambiar código ni aumentar timeouts. No demuestra rendimiento en hardware del usuario.

Los conteos principales Pixel/Frost suman 108 vueltas Node; no incluyen repeticiones de la misma batería, candidatos ni vueltas adicionales del navegador. Una repetición no representa escenarios nuevos.

## Pendiente y siguiente

Falta conducir humanamente Pixel, valorar las zonas de frenado/adelantamiento, probar hardware/móvil físico y escuchar el audio. No se declara aceptación humana ni publicación Pages verificada por pruebas locales. El acceso público ha recibido 403 del proxy.

Próxima propuesta: fase 28, reservas de espacio y selección de rival en grupos, especialmente Sunset Normal (regresión residual conocida), sin cambiar de nuevo las rutas recién validadas ni deshacer local 2–4.
