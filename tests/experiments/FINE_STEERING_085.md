# Dirección fina 0.85 — entradas analógicas sobre el motor existente

## Base y objetivo

Main auténtico `59d323c8e8b34f53c52792b715064e0ab4f6341b` / 0.84, limpio y remoto coincidente. El teclado y el táctil eran binarios; el motor, mandos y protocolo ya admiten dirección normalizada entre −1 y 1. Se permite al humano graduar esa intención sin modificar el límite lateral ni compensar errores con ayudas físicas.

## Implementado

- **Teclado**: mantener la tecla FINO pide medio giro (±0,5) en vez del giro completo (±1). P1 Shift izquierdo, P2 Shift derecho, P3 O, P4 B. Cada tecla afecta solo a su piloto; ambos Shift se distinguen por `event.code` y se liberan independientemente. Direcciones opuestas siguen cancelándose. No toca gas/freno/mano.
- **Táctil Graduable**: elección en el panel existente, separada de activación/tamaño/disposición. La fracción horizontal del dedo dentro de la flecha pide 25–100 % de volante, reflejada entre izquierda/derecha. La captura deja deslizar el dedo sin cancelar GAS ni cambiar el signo. Salir horizontalmente del botón satura el mismo rango; soltar/cancelar vuelve a cero.
- Varios dedos en una flecha toman la mayor intensidad, evitando sumarla artificialmente; ambos lados se restan y el adaptador conserva el límite habitual. Pedales siguen independientes.
- Porcentaje de entrada en la propia flecha solo durante una pulsación graduable. No añade HUD sobre el circuito ni afecta el dibujo clásico en reposo.
- Clásica sigue predeterminada y conserva la entrada 0/±1. Persistencia en la clave anterior, con campo nuevo validado: ajustes viejos conservan sus opciones y obtienen Clásica; valores inválidos también. Sin borrar preferencias.
- Mandos sin cambios, ya analógicos. Local, práctica, contrarreloj y online usan el mismo adaptador. El servidor recibe los valores normales del protocolo y conserva toda la autoridad.

Es una mejora de control, **no** una física nueva de neumáticos, aumento de giro o boost. El chasis conserva inercia y las curvas rápidas siguen limitadas por la fuerza original. Usar medio volante produce menos giro, no una trazada universalmente mejor.

## Comparaciones aprobadas

`browser-fine-steering.cjs`, Chromium/DOM/Canvas reales, sin modificar fuerzas:

- **24 maniobras físicas**: cuatro modelos × Champion/asfalto, Dusty/tierra y Frost/hielo × giro normal/fino. Entrada 180, gas/derecha y 18 pasos de 60 Hz. En las doce parejas se conserva exactamente la velocidad; el giro fino es positivo y menor al 60 % del completo. Son correcciones de 0,30 s, no vueltas humanas ni prueba de que todo sea más fácil/divertido.
- Cuatro teclados simultáneos: Shift izquierdo solo cambia P1, Shift derecho solo P2; liberar uno con el otro aún pulsado conserva el otro. O/B independientes para P3/P4; pausa limpia las entradas.
- CDP multitouch: dirección graduada + GAS, arrastre de ~32,5 % a ~92,5 % sin perder aceleración, giro reflejado a izquierda, oposición y cancelación. El porcentaje visible coincide con la intensidad. La velocidad aumenta bajo GAS usando el motor real.
- Clásica vuelve a pedir exactamente 1 aunque el dedo esté cerca del borde interior. Ajustes nuevos persisten al recargar; los antiguos sin campo nuevo y valores inválidos migran a Clásica conservando otros valores válidos.
- Captura horizontal con GAS y flecha graduable revisada: coche/pista legibles, porcentaje contenido dentro del botón, panel y HUD exteriores. Dispositivos físicos/comodidad humana pendientes.

`browser-online-game.cjs` amplía el escenario nativo de teclado del piloto conectado: el servidor recibe dirección 0,5 con Shift izquierdo y 1 al soltarlo, manteniendo gas/mano. El asiento de servidor no se confunde con el jugador cero del teclado local. No se inventa un mensaje nuevo.

## Regresiones de la entrega

| Prueba | Alcance |
|---|---|
| `browser-shared-driving.cjs` | Frente a script auténtico 0.84: 16 escenas, 3.552 pasos y 96 estados/HUD idénticos con controles clásicos, cuatro modelos/asfalto/tierra/hielo/costa. |
| `browser-touch.cjs` | Multitouch clásico, dedos duplicados, arrastre/cancelación, pausa/blur/reinicio, cuatro tamaños, cámaras/fullscreen, tamaño/disposición/activación, persistencia y P1 táctil/P2 teclado. Solo se amplían expectativas del objeto de preferencias; no se relajan límites físicos/de pantalla. |
| `browser-local.cjs` | 2/3/4 teclados, cuatro mandos emulados, identidad de coches/cámaras/HUD, pausa/reinicio/resultados/siguiente, fullscreen/cinco resoluciones y desconexión. |
| `browser-practice.cjs` | 24 sectores completos de Sunset/Dusty/Frost × cuatro coches, semillas/cachés, no escribir récords/puntos, teclado y multitouch, cuatro layouts y cambio a local. Son sectores, no vueltas completas. |
| `browser-release.cjs` | `/f1/`, HTML auténtico anterior/caché/fallback y ocho recursos offline, catorce pistas y ciclo de vida. Sirve localmente, no demuestra Pages publicado. |
| `validate-integration.mjs` y `validate-ghost.mjs` | Identificadores/recursos/versiones, diez originales/catorce registradas, 70 perfiles/gates; separación/persistencia/corrupción/cuota de récords/fantasmas. |
| Sintaxis/manifiesto/diff | Código nuevo/modificado analizado, build 0.85 y misma simulación, sin errores de whitespace. |

`browser-online-game.cjs` aprobó una carrera completa de cuatro navegadores/modelos, vueltas válidas de 40,20–41,57 s y resultados coincidentes, reconexión real/token renovado, UI/HUD/cámara por identidad, revancha y vuelta a offline. La prueba previa de teclado fino llega al servidor como 0,5/1. Segunda escena: 108 frames de anticipación propia observados, opción Clásica, parada sin reversa y mando perdido; termina por abandono y no cuenta como otra carrera completada. Reloj/conductor/mandos de red instrumentados: no aprueba latencia WAN.

## Repetir

```sh
git show 59d323c8e8b34f53c52792b715064e0ab4f6341b:script.js > /tmp/pixelgp-before-085.js
git show 59d323c8e8b34f53c52792b715064e0ab4f6341b:index.html > /tmp/pixelgp-before-085.html
node tests/browser-fine-steering.cjs
DRIVING_SOURCE_BASELINE=/tmp/pixelgp-before-085.js node tests/browser-shared-driving.cjs
DRIVING_HTML_BASELINE=/tmp/pixelgp-before-085.html node tests/browser-release.cjs
TOUCH_STAGE=10 node tests/browser-touch.cjs
LOCAL_STAGE=10 node tests/browser-local.cjs
PRACTICE_TRACKS=0,2,4 node tests/browser-practice.cjs
node tests/browser-online-game.cjs
node tests/validate-integration.mjs
node tests/validate-ghost.mjs
node server/scripts/client-config.cjs --check
```

Requieren Playwright/Chromium en desarrollo, no en producción. `CHROMIUM_PATH` permite elegir ejecutable y `FINE_SCREENSHOTS` guardar la captura.

## Conservación y pendiente

Núcleo `driving-core.js`/`track-core.js`/`race-rules.js`/`race-session.js`, CPU, audio, trazados, cuatro modelos, Speed 260, gráficos y récords p6/b1/s1 intactos. Misma huella de servidor `63cfdf88c6904edf63d78f65dc44d3627a06bd1139fd21229235c4a45f955d6d`, URL Free y protocolo; no hace falta desplegar otro backend. No se presenta un cambio de entrada válido como una nueva simulación física.

Pendientes valoración humana, teclados/mandos/teléfonos físicos, velocidad lateral completa con planificación/tráfico, audio y tres trazados uniformes. No se verificó el sitio público Pages/Render en esta entrega. Próxima propuesta: fase 27, Champion Road con secciones y ritmo más variados, alternando después con audio/iluminación.
