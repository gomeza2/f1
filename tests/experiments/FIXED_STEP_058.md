# 0.58 — simulación fija, conducción y reloj consistentes

## Auditoría y problema confirmado

Base revisada: `main` limpio en `4697d06` (0.57), historial, física/entrada, bucle real, cuenta atrás, pausa/resultados, cámaras y plan abierto. Rama recuperable `work/fixed-step-058`. Continúa fase 25; se adelanta una parte de fase 30 porque una comparación de manejo no es fiable con tiempo físico dependiente del dibujo.

El bucle anterior calculaba `dt = min(frameTime, 0.03)`. Perdía un 10 % del tiempo a 30 FPS y un 40 % a 20 FPS. La cuenta atrás usaba tiempo real, pero aceleración/frenado, dirección, contacto y reloj de carrera usaban el valor recortado. Era un defecto real, no una preferencia de dificultad.

Chromium, bucle y render reales con timestamps controlados, seis acciones de medio segundo (acelerar, girar a gas, frenar girando, contravolante, mano, soltar):

| Ritmo de dibujo | Reloj anterior | Reloj nuevo |
|---|---:|---:|
| 20 FPS | 1,8 s | 3 s |
| 30 FPS | 2,7 s | 3 s |
| 60 FPS | 3 s | 3 s |
| 120 FPS | 3 s, trayectoria ligeramente distinta | 3 s |
| 144 FPS | 3 s, trayectoria ligeramente distinta | 3 s |

Ahora los cinco casos producen también el mismo estado físico (posición, velocidad, rumbo, yaw, dirección, vueltas/checkpoints), no solo el mismo número del cronómetro. Los timestamps controlados no miden FPS del hardware.

## Decisiones e implementación

- Paso fijo **1/60 s**, acumulador fraccional y hasta seis pasos por frame. La frecuencia conserva las referencias existentes de física a 60 Hz; no duplica el trabajo de planificación/colisión de una base 120 Hz. No se afirma que 60 Hz sea óptimo en todo dispositivo.
- Render interpolado de posición/rumbo con arco angular corto en coches y cámaras; solo representación, sin mutar la física. Hasta un paso (16,7 ms) de retardo de presentación. Ruedas/partículas/HUD siguen usando estados físicos; no es una interpolación de todos los efectos.
- Historial limitado a los coches actuales, con `WeakMap`. Pausa/reanudación, inicio, menú y final limpian acumulador/poses. `placeCar` elimina su pose anterior; desplazamientos mayores de 64 unidades no se arrastran visualmente desde el punto previo.
- Cuenta atrás sigue en tiempo real; no acumula tres segundos de movimiento antes de la salida. Aviso de salida, partículas y desgaste visual del suelo avanzan con los pasos efectivos; audio y HUD se actualizan una vez por dibujo.
- Cap de recuperación de **100 ms**: un bloqueo de diez segundos no dispara cientos de pasos ni teletransporta la carrera al volver. Pérdida deliberada del exceso. Por debajo de 10 FPS sostenidos todavía puede ralentizarse el juego; no se promete tiempo real ilimitado ni rendimiento medido en el dispositivo del jugador.
- Récords nuevos agregan `:s1`. Persisten todos los anteriores, sin usarlos como mejor vuelta del nuevo reloj. Física 5, fuerzas, modelos, agarre, frenado, límites, trazados, reglas de CPU/contacto, audio y gráficos 0.57 no se retocan.
- No se presenta como terminada la fase 30: quedan separación de simulación/eventos, replay y arquitectura de red. Tampoco se declara aceptada la conducción humana.

## Pruebas

- `validate-fixed-step.mjs`: doce combinaciones de cuatro modelos y tres superficies, controles de aceleración/giro/freno/mano/soltar, 20/30/60/120/144 FPS y jitter. Cada secuencia de tres segundos debe ejecutar 180 pasos y conservar el mismo estado. Interpolación sin mutación, cruce de +/-pi, reposicionamiento, stalls acotados, registros anteriores y ciclo RAF con reloj real durante pausa.
- `validate-step-races.mjs`: cuatro controladores, tres vueltas por carrera, Sunset Normal/Dusty Fácil/Frost Difícil; compara actualización directa a 60 Hz frente a acumulador con dibujo 20/144 Hz. Posiciones, gates, tiempos de vuelta y finales deben ser idénticos. El fixture de pruebas usa carretera abierta para aislar la consistencia del reloj.
- `browser-fixed-step.cjs`: reproduce el fallo anterior y comprueba los cinco ritmos con el bucle/render reales en Chromium, sin errores JavaScript. Puente solo en servidor de pruebas.
- Regresiones: entrada/inercia, aceleración, radio rápido/lento, soltar/frenar, colisiones/gates, reservas de grupos, secciones variables, local, mezcla, ciclo de vida y migración de claves en las pruebas de pistas.
- Integración de HTML/recursos/versionado, catorce pistas y 70 perfiles/checkpoints; geometría; navegador general, local, audio y entrega bajo `/f1/`.

Resultados inspeccionados: **108 vueltas válidas en nueve carreras completas**, mismas posiciones/gates/tiempos exactos entre referencia física 60 Hz y dibujo 20/144 Hz. También pasan los doce escenarios de modelo/superficie con todos los ritmos y jitter, el navegador con cinco tasas, integración 70 perfiles y regresiones de controles/colisiones/local/audio/ciclo de vida. No se cuentan ejecuciones fallidas o parciales ni las repeticiones de test como vueltas nuevas. Las baterías históricas de Frost/Pixel/Volcano pasaron también (54 vueltas válidas cada una) y no inflan esas 108 vueltas. Pasaron geometría de las catorce pistas, 70 perfiles y 50.201 sondeos independientes de superficies, 21 parrillas locales, 100 pausas rápidas, reservas de grupos y conservación de registros. Chromium general/local/entrega/mezcla pasó sin errores JavaScript; la prueba de entrega usa archivos sin puente de estado bajo `/f1/`.

Se corrigió un defecto del nuevo test de carreras: los arrays exteriores creados por `map` pertenecían a VM distintas y `deepStrictEqual` rechazaba los prototipos pese a contener los mismos números. Se usa `Array.from` en el entorno del test, conservando comparación exacta de todos los valores; no se afloja la tolerancia ni se cambia la física para aprobarlo. El test de secuencias reutiliza el fixture y reinicia la carrera para evitar reconstruir innecesariamente geometría/escapatorias.

## Reproducción y revisión humana pendiente

```sh
node tests/validate-fixed-step.mjs
node tests/validate-step-races.mjs
git show 4697d06:script.js > /tmp/pixelgp-before-058.js
STEP_SOURCE_BASELINE=/tmp/pixelgp-before-058.js node tests/browser-fixed-step.cjs
```

Playwright/Chromium solo en desarrollo; no se agregan dependencias de ejecución. `CHROMIUM_PATH` permite elegir ejecutable.

Para revisar manejo: Sunset/Balanced/Normal, acelerar en recta, soltar antes de una curva cerrada, comparar con frenada y toque breve de mano; recuperar desde grava y repetir en Frost. Probar también dos/cuatro cámaras, pausa y regreso a la pestaña. Esto sigue pendiente de evaluación humana: una trayectoria repetible no demuestra diversión. La entrada real sigue muestreándose en el navegador: la consistencia medida con controles sostenidos por intervalos no elimina latencia de entrada, jitter de eventos o pérdida de taps muy breves entre dibujos. Siguiente prioridad: curvas/frenado/recuperación sobre esta base estable, sin olvidar siete rutas uniformes, timbre/escucha y evolución gráfica de escenarios.

Consulta pública de Pages: `CONNECT tunnel failed, response 403` desde el proxy; entrega local `/f1/` verificada, despliegue público sin confirmar.
