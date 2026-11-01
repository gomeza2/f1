# 0.76 — contrarreloj con fantasma personal (fase 31.1)

Base inspeccionada: `main` 0.75, `e628ad3fba20fccd115ca64ceae3794f53a25442`, árbol limpio. Rama `work/time-trial-076`. Se eligió un modo jugable tras la entrada táctil; 30.4 sigue pendiente antes de servidor/salas.

## Implementación

- `ghost-lap.js`: módulo clásico/CJS sin DOM, reloj, almacenamiento, audio ni física propia. Grabador de poses aproximadamente a 10 Hz, interpolación XY/dirección y ángulo por arco corto. Inicio t=0 y extremo final; ≤180 segundos/1.802 muestras; redondeo solo de repetición (XY a 0,01), nunca del coche real. Validación de versión/identidad, tamaño, tiempos monótonos, fin, números finitos, coordenadas y dirección.
- `script.js`: integra el nuevo formato individual de tres vueltas y el callback de vueltas de `race-rules`. Solo un coche físico. Captura tras el paso de simulación; playback visual alineado con el retardo de interpolación. Fantasma transparente debajo del jugador, fuera de `cars`, colisiones, audio, clasificación y gates. Interruptor exterior y resultados/reintento propios, sin puntos de campeonato; lista de las tres vueltas válidas y mejor de la tanda.
- Persistencia `pixelGP.timeTrials.v1`: récord por trazado/física/balance/modelo/perfil resuelto; AUTO comparte el perfil real. Se aceptan solo las 224 combinaciones conocidas; tiempos de 1 a menos de 3.600 s. Hasta ocho repeticiones de mejores vueltas, sin retirar tiempos cuando se retira una repetición. Lectura acotada a 2 MB, datos corruptos descartados, fallo de escritura comunicado en resultados y sesión funcional. Los récords generales anteriores se conservan.
- HTML/CSS: cuarto modo real, selección ARIA, controles CPU desactivados en contrarreloj, botón de fantasma fuera del lienzo, resultados por vuelta, recursos coherentes 0.76. Lobby local cambia explícitamente a rápida. El loader recupera la cuarta dependencia si falta el tag en HTML anterior y bloquea inicio si falla.
- Servidores de pruebas actualizados para servir el recurso nuevo. Helper histórico revierte únicamente la migración declarada; se comprueba contra el script auténtico 0.75, sin escribir otra física de producción.

## Pruebas superadas

| Prueba | Evidencia y alcance |
|---|---|
| `node --check script.js`, `ghost-lap.js`, tests nuevos; `git diff --check` | Sintaxis y formato. |
| `validate-ghost.mjs` | Ángulo ±π, límites 180 s, tamaño, datos malformados, separación modelo/perfil, reload, ocho repeticiones sin perder tiempos, cuota/corrupción, local cuatro pilotos. Hooks sintéticos de almacenamiento, no carreras. Reversión exacta al script previo mediante `TRIAL_SOURCE_BASELINE`. |
| `browser-trial.cjs` | 30 vueltas reales con física/gates/paso fijo: cuatro coches en Sunset y Frostbite, más dos tandas para comparar ghost ON/OFF. Se reemplaza **solo en el test** la entrada P1 por el controlador repetible `driveAI`; P1 sigue humano para validar el callback real. No hay teletransporte ni asignación manual de vueltas/checkpoints. |
| Misma prueba | Mejor vuelta, extremos completos y presupuesto de replay; resultados con tres tiempos, sin puntos de temporada, reintento, persistencia tras recarga, toggle, pausa/reinicio, cuatro tamaños sin overflow y transición al lobby local. Posiciones/heading/velocidad/tiempos/checkpoints idénticos con ghost visible/oculto. |
| `browser-trial-touch.cjs` | HTML/JS de entrega sin puente de estado ni controlador modificado, navegador táctil: cuenta regresiva, controles automáticos, botón exterior, tres tamaños 844×390/390×844/320×568 con lienzo ocupando su contenedor, sin superposición/scroll, pausa/reinicio/menú y consola sin errores. |
| `browser-shared-driving.cjs` | Fuente 0.75 auténtica frente a actual: 16 escenas nativas de teclado, cuatro coches/asfalto/tierra/hielo/costa, 96 estados y HUD iguales, 3.552 pasos compartidos observados por versión; reversa/derrape/freno incluidos. |
| `validate-integration.mjs` | IDs/recursos, diez originales y 70 opciones pista/barreras, centros de checkpoints. No demuestra por sí sola alineación visual ni diversión. |
| `validate-events.mjs`, `browser-events.cjs` | Rápida/campeonato/local conservados: puntos, cierre, revancha, siguiente/final/reset, carga/error/reintento, pérdida de mando durante preparación, foco y tamaños. |
| `validate-fixed-step.mjs`, `validate-countersteer.mjs` | Paso fijo/interpolación/pausa/limpieza, paridad temporal; doce escenarios de contravolante y hash histórico conservado. No es un ajuste físico nuevo. |
| `browser-local.cjs` | Teclado simultáneo, 2–4 modelos/cámaras/HUD, pausa/reinicio/resultados/siguiente, pantalla completa, resoluciones y mandos/desconexión emulados. |
| `browser-touch.cjs` | Multitouch CDP real (pedales/giro/mano/reversa), captura/cancelación, limpieza de estados, layouts/configuración/persistencia, fullscreen, local P1 táctil/P2 teclado y exclusión de mando P1. |
| `browser-paddock.cjs` | Cinco tamaños, inicio y coche en primer viewport de escritorio, selección/foco/lobby/retorno conservados. |
| `browser-release.cjs` | Entrega local `/f1/`, siete recursos versionados, caché anterior, recuperación y fallo de cualquier módulo compartido, controles/reinicio/menú. No acredita Pages público. |

La sección de conducción/IA/contactos desde `AI_DRIVERS` hasta `getTrackPath` conserva SHA-256 **`44a446af69efc9e9695df654cadc4be29c243f217068bf099b39c7ae340d40f1`**, igual que 0.75. No se retocan aceleración, giro, CPU, geometría ni timbre del motor.

Tiempos del controlador de prueba, no objetivos humanos ni calibración de CPU:

| Pista | Balanced | Corner | Speed | Rally |
|---|---:|---:|---:|---:|
| Sunset, mejor de 3 | 35,000 s | 36,400 s | 35,100 s | 36,017 s |
| Frostbite, mejor de 3 | 35,817 s | 37,283 s | 36,350 s | 36,850 s |

Replays guardados de estas tandas: 351–374 muestras, con t inicial cero y extremo final a ≤0,001 s de la duración. Capturas inspeccionadas de carrera con fantasma en escritorio y tamaños pequeños; se verifica por separado el navegador táctil para no confundir un viewport angosto de ratón con un teléfono.

## Fallos de verificación corregidos

La prueba de publicación podía aceptar el texto inicial «¡A FONDO!» del HTML mientras `requestRace` todavía preparaba el circuito; con el HTML auténtico 0.75 y la carga de la nueva dependencia, enviaba acelerar antes de que el inicio limpiara entradas. El diagnóstico mostró `PREPARADOS`, sin pausa ni pérdida de foco. Se corrige el **test** para esperar área de carrera visible y cuenta regresiva terminada; la comprobación de movimiento espera respuesta real acotada en lugar de suponer un RAF en 350 ms. No se cambia la física ni se retiran las comprobaciones de teclado. También se ajustó una aserción de replay a su precisión declarada de 0,01 unidades y el flujo de resultados del controlador de prueba.

## Pendientes y continuación

No se declara balance humano, mejora de timbre, FPS de hardware ni comodidad en teléfono/mandos físicos. No se condujeron humanamente catorce pistas. Siguen pendientes evaluación de diversión/derrape y comparación audible, cuatro pistas uniformes, gráficos, calendario completo y otros modos. La repetición es una trayectoria personal local: no reproduce entradas/contactos/eventos de una carrera completa, no acepta importación pública, no valida récords de servidor. No hay online disponible ni 3D nuevo.

Prueba humana propuesta: Sunset/Balanced/AUTO → tres vueltas con teclado o táctil → otro intento → comparar una frenada temprana y tardía con el fantasma ON/OFF; cambiar coche y perfil para comprobar récord independiente; volver a la combinación anterior y recargar. Revisar si el fantasma es legible sin distraer y si las transiciones de vuelta resultan claras.

Siguiente requisito para online: 30.4 (`RaceState`, reloj/cuenta regresiva/clasificación/resultados aislados y dos carreras simultáneas independientes), después salas autoritativas 32/33. Este bloque no debe duplicar fuerzas ni usar localStorage como autoridad. Alternar con revisión de una ruta uniforme y aceptación del manejo/audio.
