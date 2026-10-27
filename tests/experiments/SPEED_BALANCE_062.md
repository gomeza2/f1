# 0.62 — Speed Demon 260 con entrega progresiva

## Base y objetivo

Main limpio revisado en `d7f46bc` (0.61), historial, modelos, aceleración, fuerza lateral, entradas, freno/mano, reloj, récords y pruebas. Rama recuperable `work/speed-062`. Fase 25: cumplir el objetivo de ~260 del coche rápido conservando salida ágil, frenadas útiles y diferencias de coches.

No se cambia el velocímetro para simular rapidez. `speed.maxSpeed` pasa de 250 a **260**, y el modelo incorpora `accelerationTaper:0.58`. La función común admite ese parámetro opcional; Balanced/Corner/Rally mantienen el valor anterior 0,45 y su curva exacta. Acceleration nominal 123, freno 215, dirección 0,84, grip 0,87 y penalización exterior de Speed permanecen. CPU de producción sigue con Balanced 232, sin más potencia oculta.

## Comparación antes de elegir

Integración longitudinal a 120 Hz con fuerza/resistencia comunes, misma potencia inicial. Son referencias de aceleración, no vueltas humanas:

| Tope / reducción final | 0–100 | 0–200 | 0–máxima | Recorrido hasta máxima |
|---|---:|---:|---:|---:|
| 250 / 0,45 anterior | 1,125 s | 2,542 s | 3,417 s | 396,98 |
| 260 / 0,45 | 1,125 s | 2,517 s | 3,550 s | 428,60 |
| 260 / 0,55 | 1,150 s | 2,675 s | 3,900 s | 485,77 |
| **260 / 0,58 elegida** | **1,158 s** | **2,725 s** | **4,025 s** | **506,54** |
| 260 / 0,62 | 1,167 s | 2,800 s | 4,208 s | 537,21 |

Subir solo el tope mantiene un final demasiado rápido para el objetivo de progresión. 0,58 conserva la salida y da más recorrido a la fase alta sin ir al valor más lento. Es una elección técnica comparada, pendiente de aceptación humana.

## Física real y teclado en Champion

Prueba sobre una sección **existente y recta** de Champion, desde progreso 400, parada y sin rivales bloqueando. Utiliza el acumulador de producción a 60 Hz; no modifica la geometría ni sustituye física por una fórmula de HUD.

| Medida | 0.61 | 0.62 |
|---|---:|---:|
| 0–100 | 1,133 s | 1,167 s |
| 0–200 | 2,550 s | 2,733 s |
| 0–máxima | 3,417 s (250) | 4,017 s (260) |
| Desplazamiento hasta máxima | 398,10 | 505,98 |
| Frenada normal desde máxima | 105,40 | 114,07 |
| Tiempo de frenada | 1,033 s | 1,067 s |

Distancias en unidades del mundo, no metros SI. El coche mantiene 260 al sostener gas, garaje muestra 260 y el HUD coincide con su estado físico. La referencia permanece dentro del corredor. Chromium usa eventos reales W/S y compara antes/después; capturas de máxima revisadas.

La frenada desde 260 cuesta ~8,2 % más distancia. Límite de radio sostenido en asfalto, cada modelo en su máxima: **215,52 → 233,10** (~8,2 %). Es el límite calculado por la función de fuerza lateral, no una medición humana de círculo completo. La fuerza máxima nominal no se eleva; la curva normalizada de agarre utiliza el nuevo máximo, por lo que no se afirma identidad de comportamiento a toda velocidad absoluta con el Speed anterior. Se conserva el límite finito y el carácter de menor agarre del modelo.

## Mano y recuperación

La revisión no introduce una simulación completa de velocidad lateral. Se comprueba la mecánica existente para no subir velocidad rompiendo su control: a 180, giro con gas durante 0,2 s termina en 191,32 y gira 0,129 rad; con mano, 168,15 y 0,187 rad. Mano rota más y paga velocidad. Al soltarlo, la señal de deslizamiento baja por debajo de un cuarto de su valor en medio segundo; dirección/agarre recuperan su respuesta normal.

Son maniobras automatizadas, no aceptación humana del derrape. El modelo todavía desplaza según rumbo y velocidad. Próximo ensayo: componente lateral y recuperación, con comparación antes de adoptar un rediseño.

## Persistencia y protección de la base

- `CAR_BALANCE_VERSION=1` agrega **`:b1`** a la clave de vuelta. Se separa balance de modelos del núcleo físico p6 y del reloj s1. Como el récord no era por modelo, se abre serie de balance para todos; ninguna serie previa se borra.
- Chromium escribe una marca anterior sin sufijo y otra actual, recarga la web y comprueba que ambas persisten y que la previa muestra la serie nueva.
- Los fixtures históricos no se reescriben. `assertOriginalModels` exige 260/0,58, deshace solo esos dos campos en una copia y compara todos los restantes contra la referencia original. No se permiten cambios silenciosos de freno/grip/otros modelos/dificultades.
- La prueba de contravolante normaliza únicamente la nueva consulta de taper por modelo para comparar el núcleo congelado. Sus maniobras antes/ahora usan el mismo balance actual, aislando el controlador. Sigue comprobando la descarga p6 y el resto de reglas compartidas.
- Se actualiza un control histórico de versión en `validate-boundary-races`: todavía esperaba p5 pese a que p6 cambió el controlador humano. Continúa exigiendo el resto de campos y los límites de contacto/salida/ritmo; no se aflojan sus umbrales.

## Pruebas ejecutadas

- `validate-speed-balance`: física real/cap/movimiento/garaje/HUD, progresión, frenada, fuerza lateral finita, mano/recuperación, otras tres curvas de aceleración idénticas y registros previos conservados.
- `validate-speed-races`: **28 vueltas válidas, dos por cada una de las catorce pistas**, con Speed b1 y sus límites. El piloto automático conserva el plan de velocidad basado en Balanced, por lo que es conservador (~230 máximo en las referencias) y no demuestra vuelta humana óptima a 260. La prueba real de teclado anterior sí alcanza 260.
- Regresiones de CPU: grupos 120 vueltas, ritmo libre diez, carril 24 y frontera/tráfico 36: **190 vueltas válidas** con sus presupuestos previos. No se cuenta la reconstrucción de secuencias de entrada como carreras.
- Total de esas baterías: **218 vueltas válidas**, sin sumar carreras adicionales del smoke de navegador ni repeticiones de test.
- Entrada/contravolante, exigencia de freno/soltar, contactos/progreso, reloj fijo en 20/30/60/120/144 FPS+jitter, 21 configuraciones locales y 100 pausas rápidas.
- Integración: HTML/assets/versiones, diez originales/catorce pistas y 70 perfiles/checkpoints. Geometría y ocho secciones variables; conservación de Jungle/Frost/Pixel/Volcano/Night/Sunset con sus fixtures. Ningún trazado cambia.
- Audio: Web Audio offline de seis segundos a las máximas reales de **232/218/260/222**, sexta estable y salida finita/no recortada; grafos/mezcla/mute/pausa/limpieza pasan. `engine-audio.js` no cambia; esto no aprueba timbre o escucha humana.
- Chromium: maniobra real, registros tras recarga, consola sin errores; smoke general, local 2–4/mandos emulados/cinco resoluciones y entrega de archivos sin puente bajo `/f1/` pasan.

El primer test de garaje cambiaba `element.value` sin disparar la selección, por lo que conservaba el texto inicial de Balanced. Se ajustó el fixture para invocar la actualización de vista; el navegador usa `selectOption` real y comprueba ambos modelos/versiones. No se cambia el producto para ocultar ese fallo de preparación.

## Reproducción y límites

```sh
node tests/validate-speed-balance.mjs
node tests/validate-speed-races.mjs
git show d7f46bc:script.js > /tmp/pixelgp-before-062.js
SPEED_SOURCE_BASELINE=/tmp/pixelgp-before-062.js node tests/browser-speed-balance.cjs
node tests/browser-engine-cruise.cjs
```

Playwright/Chromium solo en desarrollo; `CHROMIUM_PATH` y `SPEED_SCREENSHOTS` permiten ejecutable/capturas. Sin nuevas dependencias del juego.

Pendientes: sensaciones humanas de aceleración/frenada/derrape, vueltas humanas en rutas cortas/largas, tráfico a alta velocidad y hardware físico. Siguen seis pistas uniformes y los frentes de audio/CPU/gráficos/progresión/online. No se presenta velocidad adicional como sustituto de mejor gameplay.

Consulta de Pages: `CONNECT tunnel failed, response 403` del proxy. Entrega local comprobada; despliegue público sin confirmar.
