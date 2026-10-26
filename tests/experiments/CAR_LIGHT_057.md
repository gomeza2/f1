# 0.57 — coches y luz fija, tramo 36.2

## Base y objetivo

Revisado `main` limpio en `2f37712` (0.56), historial, código real de coches/garaje/parrilla, plan abierto y pruebas existentes. Rama recuperable `work/car-light-057`. El paso anterior de asfalto/reposo/recuperación se conserva, sin repetirlo como trabajo nuevo.

Problema confirmado en código y capturas: los dos rectángulos de sombra se dibujaban dentro del sistema rotado del chasis. Su desplazamiento giraba con el coche. El borde claro de la carrocería tampoco respondía a una dirección de luz fija. Al cambiar orientación, la luz aparente cambiaba con el vehículo.

## Implementación

- Sombra separada en coordenadas del mundo, desplazamiento `(3,4)` constante. Silueta del modelo y cuatro ruedas, incluyendo orientación de las delanteras.
- Detallado: sombra proyectada y contacto corto (0,6 unidades de borde); retro: solo proyectada; rendimiento: ninguna operación nueva de sombra.
- Normal de cada segmento de carrocería transformada por el rumbo, producto con luz `(-0,6,-0,8)` y borde claro/oscuro contenido. Colores planos y contorno retro, sin filtros borrosos ni imágenes externas.
- Conserva pintura, cuatro siluetas, dirección, rodadura, faros, freno y destello de contacto. El destello conserva prioridad sobre los reflejos de borde. Garaje y parrilla declaran el ángulo de su presentación.
- Solo cambia presentación. No se alteran fuerzas, física 5, tamaño de colisión, materiales, trazados, planificador CPU, audio, récords ni controles.

## Evidencia específica

`validate-car-visuals.mjs`: 72 combinaciones modelo/pintura/calidad; luz consistente para una misma normal mundial en cinco rumbos; desplazamiento de sombra fijo en cuatro rumbos/tres calidades; capas según calidad; estado de coche intacto, transformaciones restauradas, luces y ejes de marcas coherentes.

`browser-car-light.cjs`: Canvas real en Chromium, 288 combinaciones (cuatro modelos × seis pinturas × cuatro orientaciones × tres calidades). **192 imágenes detallado/retro cambian; 96 de rendimiento quedan idénticas byte a byte**. Todas incluyen ruedas dirigidas y freno; el dibujo no modifica el coche. Sin errores JavaScript.

Capturas antes/después revisadas: plancha de cuatro modelos/cuatro rumbos ampliada sin suavizado; captura de carrera local a cuatro cámaras en 1366×768, con modelos/pinturas distintos y HUD exterior. Las capturas de la prueba local contienen estados dispuestos por el test; no son una carrera humana de cuatro personas.

El script registra tiempo por dibujo tras calentamiento. Con otras pruebas ejecutándose se observó mucha variabilidad entre versiones y calidades; esos valores no se usan para anunciar mejora de rendimiento ni FPS. En una repetición aislada, tras calentamiento y lectura de píxel para completar el dibujo (120 muestras, lienzo 96×96 limpiado y orientación variable), se observaron antes/ahora: detallado **0,054/0,072 ms**, retro **0,046/0,042 ms**, rendimiento **0,019/0,015 ms** por dibujo. Es una observación de laboratorio, no una mejora global: detallado añade trabajo y los otros cambios pequeños pueden ser ruido. La medición completa de frame, caché y dispositivo modesto sigue en 36.5. No se añade una promesa de rendimiento por un microbenchmark de Canvas.

## Comprobaciones de integración

- Sintaxis de juego y prueba nueva, `git diff --check`.
- Integración: identificadores HTML, archivos reales/URLs versionadas, diez originales y catorce registros, 70 configuraciones de pista/barreras/checkpoints.
- Geometría de las catorce pistas; barreras con 37 contornos cerrados y 14.415 sondeos, contacto visible, neumáticos y cero velocidad generada al recuperar parado.
- Coches, local, exigencia de conducción, efecto de soltar acelerador, colisiones, ciclo de carrera; parrilla y tráfico de grupos focalizados. Pasaron las 21 parrillas locales y 100 ciclos rápidos de pausa/reanudación. Parrilla focalizada: Sunset Normal y Dusty Normal, cuatro controladores × tres vueltas por caso = **24 vueltas válidas**; contactos 1/0 pasos respectivamente, sin exceder presupuestos anteriores. Tráfico de grupos focalizado conserva los fixtures de catorce trazados/materiales/modelos/perfiles y reservas laterales. No se repite la matriz completa de 430 vueltas de 0.56 por un cambio de render.
- Navegador general: conducción con teclado, pausa/reinicio/menú, fullscreen, cambios de pista, móvil, cámaras, CPU/carreras y consola.
- Navegador local: 2/3/4 entradas simultáneas, selección, cámaras/HUD, cinco resoluciones, pausa/reinicio/resultados y mandos estándar emulados. Hardware físico pendiente.
- Entrega sin puente de prueba bajo `/f1/`: caché antigua precargada, HTML/CSS/JS 0.57 coherentes, salida, conducción y ciclo de carrera. Esto no demuestra despliegue de Pages. La consulta pública vuelve a fallar con `CONNECT tunnel failed, response 403` del proxy; no se anuncia publicación verificada en la web.

## Límites y continuación

Es un tramo de profundidad de coches, no un renderizador realista completo. La iluminación de escenarios sigue siendo estilizada; quedan armonización ambiental, más detalle de carrocería/materiales y medidas completas con cuatro cámaras. No se cambió la jugabilidad para simular avance gráfico. Fase 25 conserva prioridad para comparar curvas/frenado/recuperación y aceptación humana. Siete circuitos uniformes, audio/timbre y demás áreas del plan abierto continúan pendientes.

Para reproducir la comparación con el código conservado:

```sh
git show 2f37712:script.js > /tmp/pixelgp-before-057.js
CAR_SOURCE_BASELINE=/tmp/pixelgp-before-057.js node tests/browser-car-light.cjs
```

Requiere Playwright/Chromium en desarrollo; `CHROMIUM_PATH` admite ejecutable alternativo y `CAR_SCREENSHOTS` guarda las planchas. No se incorporan dependencias de ejecución al juego.
