# 0.64 — Thunder Valley: trazado, secciones y material mixto

## Base y prioridad

Main inspeccionado limpio: `36a0222` / 0.63. Revisados ruta, geometría/render, superficies, barreras, preview/minimapa, registros, pruebas y hoja activa. El usuario pide avanzar también pistas, gráficos, manejo y audio. Esta entrega trabaja fase 27 y lectura visual; la CPU sirve para validar recorrido, sin cambios en su código ni parámetros.

## Recorrido propio

- Thunder pasa de **3.512,62 a 7.081,60 unidades** (+101,6 %); mundo **2100×1344** frente a 1400×896. Mantiene nombre, posición 9 y superficie mixta.
- Recta superior larga, giro exterior derecho, retorno interior, horquilla inferior y enlace de regreso. Secciones útiles **76–116**, con estrechamientos progresivos, sectores sin pianos y sectores con pianos de hasta 6 por lado.
- Dos tramos de tierra (24–33 % y 66–75 % de vuelta). Tierra sin pianos; transiciones con kerb cero antes/después para no crear saltos de ancho legal.
- Diez checkpoints ordenados, separados como máximo **643,79** unidades. Auto sigue **abierto**, con recuperación; full/half/corners/open siguen seleccionables.
- Forma normalizada a 0,355 de la anterior; la más próxima entre las otras trece es Dusty a 0,256. Se rechazaron dos propuestas más parecidas a Champion (0,181) y Night (0,169). Estas métricas descartan cambios triviales, no certifican diversión.
- Margen de carretera/mundo **39,97** y separación mínima de ramas útiles **20,17** según el analizador de anchura. Sin cruces de línea central detectados; barreras verificadas aparte.

Referencia libre Normal, mismo coche/control: **40,80 / 39,80 s**. Chromium con reloj de producción completa tres vueltas **40,80 / 39,80 / 39,80**, llegada 120,40 s. Son referencias automáticas, no un tiempo obligatorio para cada jugador. Vista cercana conserva tamaño del coche; el circuito completo se ofrece en overview.

## Material que ocupa su ancho real

La implementación mixta histórica dibujaba franjas de anchura fija, incompatible con secciones variables. Se conserva para Industrial sin modificar su imagen. El nuevo camino de render para mixtos variables:

- Raster de celdas de 2 unidades, solo dentro del corredor y donde la consulta compartida de material devuelve tierra. Usa los mismos `surfaceAtProgress` y `roadHalfWidthAt` que física/gates; no pinta un filtro marrón encima de toda la ruta.
- Bordes/tres tonos de grano discretos. Calidad lite conserva geometría y reduce variación cromática.
- **25.747 celdas**, geometría en WeakMap reutilizada entre calidades y perfiles; consulta espacial por segmentos, sin regeneración por fotograma. El mapa temporal de celdas visitadas mide 705.600 bytes y se libera tras construir el raster.
- Pianos rojo/blanco solo en asfalto donde el perfil los habilita. Pintura central de este mixto se dibuja estática en la caché antes de tapar la tierra, en vez de atravesar el camino sin pavimento como una marca vial animada.
- Preview de selección y minimapa muestran los dos materiales. El preview consulta la geometría del circuito elegido sin cambiar la simulación activa. `nearestOnTrack`/buckets admiten un circuito explícito; el argumento predeterminado conserva el uso existente.
- Tierra mantiene agarre 0,84 frente al 1 de asfalto; feedback/partículas/sonido leen su material existente. No se retocan fuerzas, motor, velocidades ni conducción para alargar artificialmente la vuelta.

## Error encontrado y corregido

La primera comprobación de vallas falló: un vértice quedaba a más de dos unidades del campo esperado. En mixtos variables, la referencia de barrera cambiaba de 48 a 42 al cruzar el material, generando un salto de seis aun con anchura suave. El perfil mixto usa ahora referencia constante pavimentada y sigue su ancho real. No afecta Industrial uniforme ni los otros materiales.

Repetición: **dos contornos cerrados, 1.492 probes**, cinco perfiles, contactos de cápsula/rail y recuperación desde reposo pasan. No se amplía la tolerancia de dos unidades. Los elementos visibles y físicos siguen compartiendo primitivas.

## Conservación y registros

Catorce pistas y las diez originales registradas; las otras trece rutas/materiales/modelos quedan congelados en `fixtures/thunder-0.63.json`. El hash de funciones de conducción/CPU/colisiones y la línea de tuning son iguales a 0.63. Los fixtures antiguos permanecen; sus comprobaciones exceptúan solo Thunder `layoutVersion:3`, cubierto por el nuevo snapshot, al igual que las migraciones anteriores.

Solo Thunder pasa a **`THUNDER VALLEY@3:p6:r1:s1:b1`**. `@2:p6:s1:b1` queda guardado, sin mezclar sus tiempos con el recorrido nuevo. Física p6, balance b1, reloj s1, Speed 260, controles y audio continúan.

## Pruebas

- `validate-thunder`: forma/anchura, trece rutas y reglas conservadas, diez gates, meta rechaza saltarse gates, raster completo legal/cobertura lateral/caché, material y barreras continuos, registros conservados. `--geometry` omite las carreras para futuras comprobaciones de conservación.
- Matriz del circuito: **34 vueltas válidas** (cinco perfiles × dos, cuatro modelos × dos, Fácil/Difícil × dos y una parrilla Normal de cuatro coches × tres). Libre Normal: cero pasos fuera en los cinco perfiles. Parrilla Normal: cero pasos con contacto/fuera, todos terminan dentro del plazo habitual. No se suman repeticiones, smoke ni experimentos forzados.
- Modelos desde sus posiciones de salida: Balanced 41,23/39,80; Corner 42,75/41,30; Speed 41,47/40,15; Rally 42,32/40,88. Fácil libre 47,38/46,62; Difícil 39,92/38,82. El piloto automático sigue siendo conservador/basado en Balanced: no son vueltas humanas óptimas ni demuestran alcanzar 260 en todo el circuito.
- `validate-road-sectors`: nueve perfiles / cinco uniformes, **40.886 probes** de borde, periodicidad, pianos y gates.
- Chromium: **7.462 probes** de bordes/pianos a través de cinco barreras y tres calidades; carrera de tres vueltas a reloj fijo, referencia Night y cámaras divididas.
- `browser-thunder-material`: **7.920 probes de color/material** (471 tierra + 2.169 asfalto por calidad), cobertura a ambos lados del camino, preview mixto con simulación activa todavía en Sunset, caché reutilizada y registros viejo/nuevo al recargar. Sin errores JS en estos recorridos.
- `browser-material-parity`: **39 imágenes de carretera idénticas** en las otras trece pistas/tres calidades frente al script auténtico 0.63. No se afirma identidad de la ruta modificada.
- Local nativo de 2/3/4 jugadores en Thunder, controles/HUD/cámaras, cinco resoluciones, pausa/reinicio/resultado/siguiente/fullscreen y mandos emulados. Comodidad y mandos físicos pendientes.

Las capturas de overview/close y paddock se revisan visualmente, con reloj controlado y countdown saltado cuando corresponde. No equivalen a conducir humanamente una carrera. Los tiempos de arranque del test son diagnósticos del entorno, no una medida de FPS del dispositivo del jugador.

Quedan abiertos tacto/diversión humana, cinco rutas uniformes, más ambientación y timbre de motor. Próximo tramo recomendado: fase 26, revisión audible del motor a máxima estable, carga y cambios; continuar después gráficos/variedad/manejo, alternando áreas. Online continúa en los hitos del plan activo y no está disponible hoy.

Comprobación final: sintaxis/diff, IDs/recursos/versiones y 70 perfiles/gates; geometría de las catorce; escenarios de Thunder (224 objetos entre calidades, límites/espaciado/caché), conservación histórica, contravolante y 100 pausas rápidas pasan. La entrega sin puente bajo `/f1/` y el smoke de navegador pasan sin errores JS. GitHub Pages sigue devolviendo 403 del proxy al CONNECT: se verifica el commit remoto al subir, no el sitio público.

Como contraste exploratorio, forzar el controlador a gas constante/sin freno/sin mano no cerró una vuelta ordenada dentro de 200 s (63,7 s fuera). No se convierte ese resultado en un tiempo humano ni en prueba de equilibrio; se excluye de las vueltas válidas anteriores.
