# 0.59 — recuperar el contravolante sin quitar peso de giro

## Base y objetivo

`main` revisado limpio en `b4b2908` (0.58), último historial, controlador humano/CPU, física, reloj fijo, pruebas y hoja abierta. Rama `work/countersteer-059`. Fase 25: permitir corregir una curva sin sentir que el volante sigue empujando demasiado hacia el lado anterior. El reloj de 0.58 permite comparar la maniobra con pasos iguales.

El filtro humano anterior usaba la misma respuesta para construir dirección que para descargarla al pedir la opuesta. Encima permanece la inercia del chasis. Se mide esa demora antes de aumentar agarre, velocidad o giro sostenido: esos cambios podrían volver a permitir curvas a fondo sin frenar.

## Experimentos

Misma entrada: 150 km/h, 250 ms acelerando/girando a derecha, después 400 ms acelerando a izquierda; 60 pasos/s, coches reales del juego. Cuatro modelos, comparación inicial en Sunset. El coeficiente aumenta solo al pedir dirección opuesta y solo hasta llegar al centro.

| Descarga | Primer yaw contrario (Balanced) | Giro residual anterior, rad | Velocidad al finalizar |
|---|---:|---:|---:|
| 1,00 (0.58) | 116,7 ms | 0,09912 | 187,75 |
| 1,35 | 100 ms | 0,08632 | 187,75 |
| **1,50 elegida** | **100 ms** | **0,08228** | **187,75** |
| 1,80 | 100 ms | 0,07729 | 187,75 |

Se elige una respuesta intermedia: 1,35 ya adelanta la inversión un paso, 1,50 reduce algo más el arrastre; 1,80 descarga más deprisa sin adelantar otro paso la inversión en esta referencia. No se elige el valor que minimiza todo peso. Esta elección técnica no sustituye una prueba humana.

En cuatro modelos sobre asfalto/tierra/hielo, la opción elegida conserva velocidad y reduce ~16,8–17,1 % el giro residual anterior. Las doce referencias invierten yaw en 100 ms frente a 116,7. Son medidas discretas de una maniobra a 60 Hz, no tiempo de respuesta universal ni tiempo ganado por vuelta humana.

## Implementación

- `humanSteeringInput`: construcción inicial, neutral y mismo sentido mantienen respuesta 14 (16 con mano). Al solicitar sentido opuesto con magnitud >0,15, descarga a 1,5× y vuelve a la respuesta base al cruzar el centro.
- Se calcula el instante de cruce dentro del paso y se integra el resto a respuesta normal. Evita que subdividir en 30/120 Hz cambie la respuesta de esta función. El juego sigue simulando a 60 Hz.
- Las correcciones pequeñas del stick mantienen respuesta fina; sin nuevas opciones ni asignaciones. Los 1–4 humanos de teclado/mandos usan el mismo controlador. CPU conserva su propio filtro.
- No cambia yaw, fuerza lateral, agarre máximo, aceleración, freno, radio sostenido, superficies, límites, colisiones, trazados, gráficos ni audio. Soltar/frenar sigue siendo útil; el chasis no cambia de rumbo instantáneamente.
- **Física 6** versiona el cambio de conducción humana. Registros p5, incluidos los de reloj s1, conservados; nuevos p6/s1 separados. No se borra progreso.

## Pruebas y protección de regresiones

`validate-countersteer.mjs` compara las doce maniobras con el controlador anterior. La reconstrucción de referencia deshace solo función/call de controlador y versión. Un fixture nuevo registra los hashes reales del núcleo de conducción/IA/colisiones y de tuning en el commit 0.58. El resto de ese núcleo debe ser idéntico tras deshacer la migración; gráficos/interfaz quedan fuera para no impedir su evolución. No se modifican los fixtures históricos de rutas, modelos ni tiempos. Los tests históricos explicitan que p6 migra control humano; mantienen sus límites de ritmo/contactos/salida.

También comprueba neutral, construcción inicial, corrección fina de stick, espejos de giro, mano, cruce exacto con subdivisión y conservación de registros p5. Las pruebas de paso fijo conservan estado idéntico a 20/30/60/120/144 FPS y jitter.

`browser-countersteer.cjs` usa **eventos de teclado reales**, acumulador de producción y Canvas en Chromium. Repite los doce casos antes/ahora: yaw contrario antes, giro residual menor y misma velocidad; sin errores JavaScript. Captura de Sunset revisada para comprobar posición/cámara, carretera y HUD; el escenario lo dispone el test y no representa una vuelta humana completa.

Regresiones comprobadas: demanda de giro/frenado/retención, inercia, contacto y progreso, 21 parrillas locales/mandos emulados, coches/luces y 100 pausas rápidas. Integración: catorce pistas/70 perfiles, geometría y secciones variables; superficies/escapatorias con 50.201 sondeos independientes y 151.938 celdas, física local equivalente y registros conservados. CPU: 120 vueltas de grupos, diez de ritmo libre y 24 de carril = **154 vueltas válidas de referencia**, con límites de contacto/ritmo anteriores sin ampliar. Históricas Frost/Pixel/Volcano: otras 54 vueltas cada una (162); no son vueltas humanas. Navegador general, local 2–4 y entrega sin puente bajo `/f1/` pasaron sin errores JavaScript. No se cuentan maniobras como vueltas.

## Pendiente

Aceptación humana de ligereza/peso, frenado/derrape y comodidad local/hardware. El modelo todavía mueve el coche según rumbo/velocidad, sin una simulación completa de velocidad lateral. No se presenta esta revisión de volante como una nueva física de neumáticos. Audio mantiene timbre pendiente de escucha/revisión; gráficos conservan fase 36 y pistas fase 27.

Próximo tramo recomendado: Jungle Sprint con silueta y ancho variables propios, uno de los siete uniformes restantes. Mantener pruebas de control y volver al tacto si la prueba humana detecta más problemas. Escenarios, audio y otras fases abiertas siguen documentados.

```sh
node tests/validate-countersteer.mjs
git show b4b2908:script.js > /tmp/pixelgp-before-059.js
CONTROL_SOURCE_BASELINE=/tmp/pixelgp-before-059.js node tests/browser-countersteer.cjs
```

Playwright/Chromium solo en desarrollo; `CHROMIUM_PATH` admite ejecutable alternativo y `CONTROL_SCREENSHOTS` guarda capturas. No se agregan dependencias al juego.

La consulta a Pages devuelve `CONNECT tunnel failed, response 403` del proxy. Entrega local comprobada; despliegue público sin confirmar.
