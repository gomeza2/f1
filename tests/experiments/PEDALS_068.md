# Pedales 0.68 — conducción, tramo de fase 25

Base auditada: main `612a22ccd657b3b67c5b1de0df9108029b94dd26` / 0.67, remoto igual y árbol limpio. Rama `work/pedals-068`. Se revisan física, entrada de teclado/mandos, planificación CPU, manejo de dirección/mano, audio, récords y pruebas históricas.

## Defectos reproducidos

1. La retención usaba una condición binaria: cualquier acelerador mayor que cero bajaba la resistencia de 30 a 2,6. Desde 200, después de medio segundo sin acelerar quedaban 185; con solo 0,001 de gatillo quedaban ~198,73. Rozar el gatillo anulaba casi todo el freno motor, haciendo difícil dosificar la entrada de una curva.
2. Frenar manteniendo acelerar sumaba aún toda la aceleración. Desde 200, Speed frenaba en 67,17 unidades al soltar acelerar, pero necesitaba 113,51 al mantenerlo. La entrada simultánea producía una respuesta inesperadamente distinta.

No se parte de valores inventados ni se cambia el agarre para compensar estos problemas.

## Corrección integrada

Empuje efectivo `throttle × (1 − brake)`: el freno reduce progresivamente la tracción y el freno completo la cancela. Retención interpolada entre 30 (sin acelerador efectivo) y 2,6 (acelerador completo). Se mantienen exactamente los extremos digitales, todos los valores de modelos, aceleración máxima, topes, fuerza máxima de frenado, giro, terreno y freno de mano. La regla es compartida por humanos/CPU; no añade asistencia secreta a un bando.

Con teclado se puede mantener acelerar y pulsar freno sin que el motor contrarreste la orden de frenar. Con mando, soltar parcialmente el gatillo tiene una respuesta continua y el freno parcial quita empuje gradualmente. No cambia el timbre del motor; el audio existente ya elimina carga al frenar.

Se conserva p6/b1/s1 y los récords. No hay aumento del rango de fuerzas alcanzable: la frenada completa nueva equivale exactamente a soltar acelerar y frenar antes. Los valores parciales están dentro de las fuerzas que ya permitía combinar o soltar los pedales. Cambia la interpretación de la entrada simultánea y la continuidad de retención; no convierte récords anteriores en imposibles ni introduce más potencia/agarre.

No se incorpora todavía velocidad lateral física ni el ensayo descartado de 0.63. Se preservan dirección/contravolante, coste/rotación de mano y recuperación existentes.

## Pruebas y medidas

`validate-pedals.mjs` usa el código real en VM con entradas de mando emuladas. Reproduce los dos fallos en una referencia que revierte solo las líneas de pedales. Comprueba presión creciente/monotonicidad, freno completo con varias presiones de gas y mano, teclado, cuatro modelos y extremos anteriores.

| Modelo | Parada desde 200 con gas+freno antes | Ahora, igual a frenar soltando gas | Velocidad tras 0,5 s con gatillo 0,001 antes → ahora |
|---|---:|---:|---:|
| Balanced | 100,09 | 63,22 | 198,728 → 185,042 |
| Corner | 84,71 | 57,55 | 198,725 → 185,040 |
| Speed | 113,51 | 67,17 | 198,728 → 185,042 |
| Rally | 91,72 | 59,70 | 198,727 → 185,042 |

Distancias en unidades de mundo, no metros. En los cuatro modelos el control de gatillo cero sigue en 185. Se comparan además 18 trayectorias digitales en asfalto, tierra, hielo, pasto y sectores mixtos/costeros, incluyendo mano/dirección, con estados exactamente iguales al código anterior. Las muestras analógicas a 20/30/60/120/144 Hz producen la misma simulación fija de 60 Hz.

`browser-pedals.cjs` ejecuta antes/después sobre los archivos reales, eventos nativos de teclado de P1–P4 y gatillos estándar emulados. Parada dentro del asfalto de Champion: gas+freno coincide ahora con freno solo en los cuatro conjuntos de teclas; acelerador completo y retención cero conservan sus velocidades anteriores. Se verifica guardado y recarga de récords, sin errores JS. No equivale a probar un mando físico.

`validate-speed-balance`: Speed mantiene 0–100 en 1,17 s, 0–260 en 4,02 s / 505,98 unidades y frenada desde 260 en 114,07 unidades. Mano a 180 durante 0,2 s mantiene su efecto: giro 0,187 frente a 0,129 rad y salida 168,15 frente a 191,32. No se aumenta esa asistencia para simular deriva lateral.

`validate-countersteer`: doce maniobras de modelos/terrenos y cruces de dirección exactos, sin nueva potencia. Hashes históricos conservados después de revertir explícitamente las migraciones declaradas, incluida únicamente la corrección de pedales. `validate-coast --geometry` y `validate-thunder --geometry` conservan geometría/materiales/modelos/otras rutas. No se sobrescriben fixtures históricas ni se relajan límites para ocultar regresiones.

Prueba local Chromium de 2–4 jugadores: entradas simultáneas, coches/cámaras/HUD independientes, pausa/reinicio/resultados, pantalla completa y cinco resoluciones. Mandos emulados. Web Audio real: motor/derrape/resultado, mute/pausa/menú silenciosos, contexto reutilizado y mezcla local, sin saturación en las muestras. No se ha juzgado subjetivamente el timbre por estas mediciones.

Comparación completa `validate-pedal-races`: **36 vueltas actuales emparejadas con 36 anteriores**, tres parrillas de cuatro coches, Sunset Normal / Coastline Normal / Frost Hard. Posiciones, velocidades, dirección, derrape escalar, gates, vueltas, tiempos, contactos y resultados exactamente iguales, sin tolerancia numérica. Todos terminan las tres vueltas. No se usa esta conservación como evidencia de CPU nueva ni de balance humano.

Integración (IDs/rutas/versiones, diez originales, 70 perfiles/checkpoints) y entrega local real bajo `/f1/` con caché antigua precargada superadas: selección, cuenta regresiva, teclado, pausa/reinicio/menú y cero errores JS. La publicación pública de Pages sigue sin acreditarse; el proxy del entorno había rechazado CONNECT con 403.

## Reproducción

```sh
node tests/validate-pedals.mjs
node tests/validate-pedal-races.mjs
git show 612a22c:script.js > /tmp/pixelgp-before-068.js
PEDAL_SOURCE_BASELINE=/tmp/pixelgp-before-068.js node tests/browser-pedals.cjs
node tests/validate-speed-balance.mjs
node tests/validate-countersteer.mjs
```

Playwright/Chromium son herramientas externas del entorno, sin nuevas dependencias del juego. La primera comparación de carreras falló por comparar arrays de dos contextos VM con prototipos distintos; se corrige el test convirtiendo el estado a arrays del contexto anfitrión, sin tolerancias nuevas ni cambios adicionales al juego.

## Pendientes

Evaluación humana de frenada/entrada en curva y de mando físico, deriva lateral/recuperación, diferencias de superficie a velocidad límite, timbre en dispositivos reales y rendimiento modesto. Los ensayos automáticos no acreditan diversión ni una física lateral nueva. La fase 25 sigue abierta: siguiente experimento recomendado, entrada/salida de derrape con recuperación y contravolante medidos, manteniendo tráfico y local jugables. No se prioriza otra reescritura de IA.
