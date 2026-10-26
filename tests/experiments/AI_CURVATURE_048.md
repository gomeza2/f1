# CPU 0.48: lectura de curvas y consulta de frenado

Base preservada: 0.47, commit `1862342`. Balanced, Normal/TRAZO, sin tráfico, dos vueltas, paso 1/60. Misma conducción, coches, recorridos, potencia y física 5. El cálculo anterior comparaba tangentes a ±12 unidades: las juntas del trazado muestreado podían producir picos de curvatura que el controlador no terminaba siguiendo literalmente.

Se comparó curvatura geométrica por tres posiciones, con semiventanas de 24/36/48 unidades. Se eligió 36: mejora medida en los seis casos y mantiene una lectura más local que 48, sin perseguir solo el menor tiempo. 48 también acabó las pruebas libres, pero usó más freno de mano en varios casos. No se presenta como una variante fallida ni se garantiza que 36 sea óptimo para todos los trazados.

| Pista | Media 0.47 | Media 0.48 | Mejora |
|---|---:|---:|---:|
| Sunset | 37,209 | 35,592 | 4,3 % |
| Neon | 22,975 | 21,583 | 6,1 % |
| Dusty | 21,558 | 20,908 | 3,0 % |
| Frostbite | 29,683 | 26,667 | 10,2 % |
| Volcano | 28,909 | 28,033 | 3,0 % |
| Industrial | 28,892 | 26,883 | 7,0 % |

No hubo pasos fuera del corredor legal en esas doce vueltas. La CPU usa más freno de mano en varias curvas; paga su coste normal de velocidad y no recibe agarre, aceleración, frenado ni velocidad máxima extra. No se afirma que siempre frene menos en total. Es un benchmark de conducción automática, no una carrera contra personas ni una trazada ideal demostrada.

Para repetir variantes: `git show 1862342:script.js > /tmp/script-047.js`, luego `node tests/experiments/compare-ai-curvature.mjs /tmp/script-047.js`. La referencia y condiciones quedan en `tests/fixtures/cpu-0.47.json`; `validate-ai-pace.mjs` compara con el código vigente y verifica modelos/recorridos preservados.

La consulta del plan de velocidad conserva el sobre de frenado, pero busca por posición y recorre solo el horizonte de 240 unidades. En Night, 891 entradas de plan se resuelven con 31 lecturas de progreso en la consulta medida. 2.448 comparaciones contra un barrido completo cubren modelos, dificultades, freno de mano y la unión meta/inicio. Es trabajo algorítmico medido, no una promesa de FPS en todos los dispositivos.

En las parrillas de referencia siguen existiendo roces: destaca Dusty Fácil con 28 pasos a 30 Hz (0,93 s acumulados en tres vueltas); todos terminan, y está dentro del presupuesto vigente de 30. Ese aumento respecto a 0.47 queda pendiente para el siguiente trabajo de tráfico. Cero contacto no es el objetivo, pero tampoco se declara resuelta toda la IA.

La prueba Chromium de reinicio esperaba observar la cuenta atrás antes de tres segundos; bajo carga podía llegar tarde. Ahora captura en la propia tarea de la tecla R el estado de reinicio (cuenta 3, tiempo 0, coche sin terminar), conservando entrada de teclado real y sin cambiar el temporizador del juego.
