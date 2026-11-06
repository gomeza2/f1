# Práctica de sectores 0.84

## Base y decisión

Main auténtico `52b7300bab035335111136f1ce1bbf00179db08d` / 0.83, limpio y remoto coincidente. La física actual tiene giro/yaw y una señal escalar drift, pero no velocidad lateral completa. El ensayo 0.63 se rechazó por ritmo/contactos. No se reactiva sin resolver planificación/tráfico ni se anuncia como aprobado.

Se entrega un modo para aprender y comparar curvas sobre el motor real. No se cambian fuerzas para aparentar una mejora de sensaciones. La aceptación humana sigue abierta.

## Funcionamiento implementado

- Menú **PRÁCTICA DE SECTORES → PRACTICAR CURVAS**. Un humano, sin CPU ni fantasma; cualquiera de los catorce circuitos/cuatro modelos/perfiles de barreras existentes.
- **132 intervalos** desde meta/CP al CP siguiente/meta. El coche aparece centrado ocho unidades después del gate de origen, orientado según la pista; el sector final tiene todos los CP anteriores sembrados y termina por el evento real de meta. Las semillas existen exclusivamente en la sesión local de práctica.
- Entrada desde parado, 120, 180 o máxima real del modelo. Un segundo de preparación. Repetir con botón/R y siguiente sector conserva el mundo y las cachés de fondo/carretera, reiniciando coche/reloj/entradas/marcas/partículas.
- Cierre por evento de checkpoint/meta válido en la misma implementación de reglas. Salirse de la huella legal o cruzar en sentido contrario no satisface el gate. Un intento sin completar expira a 120 s.
- La práctica cede entre pasos canónicos para pausar inmediatamente tras el cierre; no continúa acumulando movimiento/reloj por el resto del frame. No cambia el reloj de los otros modos.
- Feedback exterior: tiempo de intento, velocidad de salida, tiempo con freno, mano, gas suelto, tiempo fuera del corredor y número de impactos emitidos por el núcleo. **MANO mide uso del control, no un ángulo de derrape físico inexistente.** El coche sigue sufriendo los costes de frenado/terreno/contacto originales.
- Mejor limpio = gate válido, cero tiempo fuera y cero impactos registrados. Es un indicador local, no prueba de ausencia universal de contactos leves que no emitan impacto. Solo en memoria, separado por sector y velocidad de entrada dentro del coche/pista/barreras de esta práctica; al volver a iniciar desde el menú se reinicia el conjunto.
- Vueltas parciales no se guardan como récord global, fantasma ni puntos. Incluso la llegada del sector final pasa por un guard explícito antes del guardado de vueltas normal.

## Pruebas de práctica en Chromium

`browser-practice.cjs` usa el HTML/Canvas reales. El conductor opcional solo entrega controles normales al mismo `humanControls`/motor/sesión; no modifica fuerzas ni reposiciona el coche durante los sectores conducidos.

- **112 sectores completados físicamente**: primero/último de 14 pistas × cuatro modelos, entrada 120. Todos los gates y tiempos provienen de la sesión. Son sectores, no 112 vueltas completas.
- **132 semillas**: todos los sectores de las catorce pistas, progreso y CP esperados coherentes, mismas cachés antes/después de repetir. Los sectores interiores se inicializaron, pero no se condujeron todos: queda pendiente esa matriz exhaustiva.
- Récords globales, contrarreloj/fantasmas y puntos iguales antes/después. Terminar pausa, enfoca Repetir y deshabilita continuar; Escape y nuevos frames no alteran el tiempo completado.
- Teclado real: freno/dirección y mano bajan velocidad, R repite exactamente el sector/entrada, se reinician métricas. Gate fuera de ancho rechazado mediante inyección geométrica de fallo; no se cuenta como sector conducido.
- Timeout, siguiente, entrada máxima/parado, mejor limpio por entrada y transición a local comprobados. Mandos conservan su ruta original, con regresión local separada.
- Tras corregir botones deshabilitados: otros 24 sectores de Sunset/Dusty/Frost, cuatro modelos; repetición con CDP multitouch, aceleración real por GAS y liberación del dedo al repetir. Matriz de tamaños 1440×1000, 844×390, 390×844 y 320×568.
- Tras compactar el panel se repite la matriz afectada en Sunset; además se comprueba lienzo lleno en los dos tamaños táctiles, separación respecto del panel y ausencia de scroll. Capturas revisadas; no sustituye un teléfono físico.

El primer intento de test exigía que la cuenta regresiva siguiera exactamente en 1, aunque ya habían pasado frames del navegador; se corrigió la aserción para admitir el intervalo real (0,1], sin alterar el reloj del juego. La primera variante táctil dejaba unos 83 px de altura de conducción en horizontal; se corrigió el producto, sin reducir el mínimo de 100 px del test: instrucciones activas se ocultan en pantallas bajas, resumen final sigue visible.

## Maniobras comparativas

`compare-sector-controls.cjs`: **48 maniobras** con sesión compartida, cuatro modelos × asfalto/tierra/hielo × gas/soltar/freno/mano. Misma posición inicial a progreso 600, 180 de entrada, giro completo y 18 pasos de 60 Hz (0,30 s). Sin tuning modificado ni teletransporte durante el movimiento.

Ejemplo Balanced / Champion Road:

| Entrada | Velocidad al final | Giro, rad | Radio aproximado por cuerda/giro |
|---|---|---|---|
| Gas | 196,42 | 0,28093 | 168,60 |
| Soltar | 171,00 | 0,31032 | 141,61 |
| Freno | 102,00 | 0,39884 | 87,05 |
| Mano + gas | 159,40 | 0,41146 | 102,63 |

Las doce combinaciones conservan coste distinto y frenada que cierra la trayectoria respecto a gas. No son radios estacionarios, comparación de vueltas humanas ni demostración de que el tacto ya sea divertido. Esta entrega no cambia esos valores: ofrece una forma jugable de experimentar con sus consecuencias.

## Regresiones

| Prueba | Resultado |
|---|---|
| `browser-shared-driving.cjs` | Frente a 0.83 auténtica: 16 escenas, 3.552 pasos físicos y 96 estados/HUD idénticos, cuatro modelos/asfalto/tierra/hielo/costa. |
| `validate-driving-demand.mjs` | Aceleración progresiva y costes de giro/frenada/retención. Radio rápido 288,5 frente a 68,1 lento en su maniobra original; no es aprobación humana. |
| `browser-local.cjs` | 2/3/4 teclados, coches/cámaras/HUD, pausa/reinicio/resultados/siguiente, fullscreen/cinco tamaños y cuatro mandos emulados/desconexión. |
| `browser-touch.cjs` | Multitouch CDP, gas/dirección/freno/mano/reversa, cancelación/ajustes/persistencia, P1 táctil/P2 teclado. |
| `browser-release.cjs` | `/f1/`, caché anterior, ocho recursos offline, HTML auténtico 0.83/fallback, controles y ciclo de vida; servidor local. |
| `browser-online-game.cjs` | Cuatro navegadores, cuatro modelos, vueltas válidas 40,15–41,55 s, reconexión real, UI/HUD/cámara por identidad y resultados iguales/revancha. Segunda escena: 107 frames de anticipación, opción Clásica, parada sin reversa y mando perdido. Reloj/conductor/mandos instrumentados; no prueba WAN. |
| `validate-integration.mjs` | IDs/recursos/build, diez originales/catorce registradas, 70 perfiles y checkpoints en carretera. |
| `validate-ghost.mjs` | Grabación limitada, separación por modelo/barreras, recarga/evicción, cuota/corrupción y local de cuatro; pruebas sintéticas de adaptador. |
| Sintaxis/manifiesto/diff | Fuentes nuevas/modificadas analizadas; build 0.84, misma huella física y diff sin whitespace incorrecto. |

`browser-trial.cjs` aprobó **30 vueltas completas** con gates reales, cuatro coches en asfalto/hielo, mejores personales y replay limitado completo, fantasma sin efecto físico, resultado/reintento, recarga, pausa/reinicio, cuatro tamaños y transición a local. Conductor automatizado, no aceptación humana.

## Repetir

```sh
git show 52b7300bab035335111136f1ce1bbf00179db08d:script.js > /tmp/pixelgp-before-084.js
git show 52b7300bab035335111136f1ce1bbf00179db08d:index.html > /tmp/pixelgp-before-084.html
node tests/experiments/compare-sector-controls.cjs
node tests/browser-practice.cjs
PRACTICE_TRACKS=0,2,4 node tests/browser-practice.cjs
DRIVING_SOURCE_BASELINE=/tmp/pixelgp-before-084.js node tests/browser-shared-driving.cjs
DRIVING_HTML_BASELINE=/tmp/pixelgp-before-084.html node tests/browser-release.cjs
node tests/validate-driving-demand.mjs
node tests/validate-integration.mjs
node tests/validate-ghost.mjs
node tests/browser-trial.cjs
LOCAL_STAGE=10 node tests/browser-local.cjs
TOUCH_STAGE=10 node tests/browser-touch.cjs
node tests/browser-online-game.cjs
node server/scripts/client-config.cjs --check
```

Playwright/Chromium son herramientas de desarrollo. `CHROMIUM_PATH` elige ejecutable; `PRACTICE_SCREENSHOTS` guarda capturas. No se añade una dependencia de ejecución al frontend.

## Conservación y siguientes pasos

No se modifican `driving-core.js`, `track-core.js`, `race-rules.js`, `race-session.js` ni backend/audio. Mismo p6/b1/s1 y huella `63cfdf88c6904edf63d78f65dc44d3627a06bd1139fd21229235c4a45f955d6d`. El cliente conserva la URL de Render Free; no requiere desplegar un backend nuevo.

Sin prueba pública de Pages/Render ni aceptación humana de manejo/sonido en esta entrega. Pendientes sectores interiores conducidos exhaustivamente, todos los perfiles en ese modo jugados, hardware físico y comparación lateral conjunta con tráfico. La siguiente mejora física deberá utilizar la simulación compartida y coordinar la actualización del servidor si cambia su huella. Alternar con audio, iluminación/escenarios y los tres circuitos de ancho uniforme.
