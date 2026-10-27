# 0.65 — motor y portada de entrada

## Base y alcance

Main limpio `9654867` / 0.64, remoto coincidente antes de cambiar. Se revisaron motor, integración/mezcla, HTML/CSS del paddock, handlers de inicio/local y pruebas. El usuario suma mejorar la «portada inicial»: se toma como pantalla de entrada y se implementa junto al audio.

Cuatro archivos de ejecución cambian: `engine-audio.js`, `index.html`, `style.css`, `script.js`. Se mantienen rutas, parámetros de coches, CPU, fuerzas, reloj p6/b1/s1 y récords. El snapshot Thunder verifica que las funciones de conducción/IA/colisión y sus parámetros siguen iguales. No hay carrera online nueva.

## Motor

La voz anterior sostenía una frecuencia de disparo de 416,67 Hz en Speed a máxima; la capa de cuerpo tenía otra relación con el giro según cilindros. Se comparan intensidades de tono 0,80 / 0,65 / 0,50 sobre la nueva síntesis, con la misma entrada y salida real de Web Audio. Se elige 0,50: registro más grave y menor energía de medios/altos en los cuatro modelos.

- Pulsos armónicos rediseñados, capa triangular una octava por debajo y cuerpo ajustado. Dos osciladores por motor, sin ruido de banda ancha nuevo, grabaciones externas o dependencias.
- Se conservan seis marchas con histéresis, RPM/carga y respuesta al acelerador/retención/freno. No cambian potencia ni velocidad del coche; las marchas siguen siendo sonoras.
- Crucero se detecta con velocidad real estable y acelerador, no solo con llegar al rango alto. Transición exponencial de brillo/nivel; vuelve a la carga al acelerar/soltar/frenar, sin añadir crepitación de limitador.
- La derivada de velocidad se filtra: el audio puede actualizar a 144 Hz y repetir muestras de física de 60 Hz. Una lectura instantánea de esos intervalos inmóviles podía confundirse con crucero durante aceleración. Pruebas a 20/30/60/120/144 Hz mantienen aceleración fuera de crucero y permiten asentarlo al sostener velocidad.
- Pausa/OFF/countdown/menú silencian ambos caminos sin avanzar RPM/carga/crucero. Reset limpia la detección. No se crean nodos en cada actualización ni al tocar deslizadores; hasta cuatro motores humanos y mezcla existente preservados.

### Comparación nativa a máxima

OfflineAudioContext, seis segundos a los máximos reales 232/218/260/222, ventana final de dos segundos. Cociente de energía filtrada por un high-pass de 500 Hz frente a energía total; incluye la respuesta gradual del filtro y no es una medida exacta de sonoridad o de energía solo por encima del corte.

| Coche | Disparo anterior → nuevo | Cociente 500 Hz anterior → nuevo | RMS nuevo/anterior |
|---|---:|---:|---:|
| Balanced | 262,50 → 131,25 Hz | 0,280 → 0,056 | 0,888 |
| Corner | 186,67 → 93,33 Hz | 0,137 → 0,020 | 0,872 |
| Speed | 416,67 → 208,33 Hz | 0,733 → 0,193 | 0,883 |
| Rally | 141,67 → 70,83 Hz | 0,076 → 0,006 | 1,085 |

El cambio se verifica con energía normalizada, sin presentarlo como bajar simplemente el volumen. La banda filtrada de 3 kHz también disminuye más de cuatro veces respecto a 0.64 en los cuatro modelos. Sexta estable, sin cambios repetidos al sostener el máximo; señal finita y sin recorte en estas pruebas.

`browser-engine-tone` puede exportar WAV de comparación al directorio indicado: dos segundos anteriores, pausa de 0,4 s, dos nuevos, RMS igualado y fades. Son artefactos para escuchar, no recursos que carga el juego ni una certificación de calidad percibida. Los parámetros de mezcla guardados se conservan, sin música/autoplay nuevos.

## Portada / paddock

- Cabecera compacta con bandera a cuadros de la identidad existente, acento lima/cian y mejor separación visual.
- Inicio rápido primero en el orden del documento. Resumen de pista/coche seleccionado sincronizado con ambos selectores; tres vueltas/rivales/dificultad siguen mostrando los ajustes reales.
- «Cambiar pista y coche» lleva el foco al selector. En 1366×768, iniciar y elegir coche quedan dentro de la primera ventana comprobada. En móvil, iniciar y personalizar aparecen antes de la configuración larga, sin desborde horizontal.
- Parrilla local cerrada inicialmente. «Preparar multijugador» la despliega, anuncia `aria-expanded` y enfoca cantidad de jugadores. «Volver a un jugador» cierra y devuelve foco al botón; conserva coches/colores/controles/cantidad al reabrir.
- Pista y coche reales en Canvas, vista previa mixta de Thunder y selección de 2–4 conservadas. Los detalles de controles/rivales permanecen desplegables. No se agregan pantallas intermedias obligatorias ni modos vacíos.
- Tests antiguos de audio/smoke que pulsaban directamente el inicio local ahora abren primero la parrilla, igual que el flujo real del usuario. No se evita la nueva interfaz con un bridge para hacerlos pasar.

## Verificación

- `validate-engine-timbre`: cuatro voces/cuerpo, crucero/retención/pausa/reset, cinco ritmos de actualización sobre muestras de física de 60 Hz, nodos acotados.
- `validate-audio` / `validate-audio-mix`: grafos, marchas/carga, señales/derrape/terreno, silencios, ocho voces temporales, contexto reutilizado, 2/4 humanos, guardado/volúmenes y fallback sin Web Audio.
- Chromium Web Audio: reproducción real con gesto, motor/derrape/resultado, OFF/pausa/menú, recuperación, motor/efectos separados, persistencia/modal/teclado/foco/fullscreen. Cuatro motores humanos a volumen máximo de controles sin recorte muestreado y slots extra silenciosos al volver a dos.
- `browser-engine-tone` + `browser-engine-cruise`: cuatro máximos reales, comparación contra biblioteca auténtica 0.64, espectro normalizado/RMS/salida, sexta sin chatter; exportación de comparación opcional.
- `browser-paddock`: archivos reales sin bridge, cinco resoluciones, ausencia de desborde, inicio y coche visibles en escritorio, elección/sincronización, personalización/foco, abrir/cerrar local/ARIA/retener valores, Enter para largar y vuelta al menú. Capturas antes/después revisadas.
- Menú: catorce previews y 24 combinaciones modelo/pintura, sin alterar la carrera activa. Integración: recursos/IDs/versiones y 70 configuraciones. Conservación de Thunder/trece rutas y núcleo de conducción comprobados; no se repite una matriz de vueltas para atribuirle mejoras de conducción a un cambio de audio/UI.

Pendiente escucha humana con parlantes/auriculares y durante carreras reales: la señal limpia o más grave no demuestra que el timbre guste. Móvil cubre layout, no controles táctiles ni comodidad de cuatro personas. Los mandos son emulados; hardware/FPS/latencia reales siguen pendientes.

Siguiente tramo recomendado: fase 36.3, escenarios y referencias visuales (edificios/tribunas/ambientación), alternando con las cinco pistas uniformes restantes y manejo. Mantener escucha/ajustes de fase 26 abiertos a feedback; evitar volver a centrar todas las entregas en CPU. Online sigue el plan técnico, sin anunciar salas disponibles.

Verificación final: sintaxis/diff, IDs/recursos/build coherentes, 70 configuraciones, conservación de Thunder y las otras trece rutas, portada nativa, mezcla/audio real, local 2–4 y smoke de carreras superados. Entrega de archivos sin bridge bajo `/f1/` comprobada con caché antigua precargada. GitHub Pages responde 403 del proxy al CONNECT; el commit remoto se verifica al subir, sin afirmar comprobación del sitio público.
