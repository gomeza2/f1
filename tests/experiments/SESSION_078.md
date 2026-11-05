# 0.78 — sesión de carrera compartida e integración local (fase 30.4)

Base: `1b85a503e26ad4c4a2f8ae34108f59b8469a00c8` / 0.77; rama `work/race-session-078`. Objetivo: continuar hacia online con carreras completas por instancia, conservando el comportamiento del juego. Auditoría: `AUDIT_078.md`.

## Integración

- `race-session.js`: módulo clásico/CJS API 1; dependencia explícita de conducción, geometría y reglas existentes. Coches propios/copias de parrilla, configuración congelada, reloj/acumulador a 60 Hz y seis pasos máximos, salida/pausa/reinicio/parada, paso de vehículos/contactos, plazo de llegada, clasificación/puntos base, snapshots separados y resultados congelados. No hay DOM, audio, fecha, RNG, almacenamiento ni red en el módulo.
- `script.js`: los antiguos coches/relojes/flags se sustituyen por `raceState.*`. La sesión activa ejecuta el paso completo. El adaptador mantiene dispositivos/CPU, audio/render/partículas, récords y temporada. No hay un segundo reloj físico ni otro array de coches de producción. La sesión anterior se detiene antes de cambiar/reiniciar; cámara/interpolación leen el acumulador real.
- Orden preservado: snapshot de pose anterior → incremento de reloj → controles/vehículo/terreno/gates → efectos por coche → cooldown de impacto → contactos del grupo → efectos de suelo/ghost → flash de salida/acumulador → consulta de cierre. Las fórmulas siguen en `driving-core.js`/`race-rules.js`.
- Eventos con `raceId + sequence`; los procedentes de reglas conservan `ruleSequence`. Identidad proporcionada por el host, secuencia por instancia y sin cola ilimitada. `snapshot` excluye partículas/política interna del planificador; `results` copia tiempos/vueltas/posición/puntos base. Puntos de temporada se conceden solo donde el modo lo hacía antes.
- Se rechazan parrillas duplicadas, modelos/estados básicos inválidos, cuenta regresiva inválida y cambio de parrilla iniciada. Entradas humanas por defecto se normalizan. Estos límites no sustituyen el parser/validación de mensajes de un servidor.
- Una carrera cerrada devuelve cero pasos y mantiene su reloj aunque el host solicite otro frame. La interfaz sigue mostrando resultados al terminar; el host de Node dispone de `finishState`, `stop` y `results`.
- HTML, ocho recursos CSS/JS y fallback coherentes 0.78. No se modifican pistas, fuerzas, velocidades, coches, materiales físicos ni timbre del motor; claves p6/b1/s1 conservadas.

## Pruebas ejecutadas y superadas

| Prueba | Evidencia y límites |
|---|---|
| Sintaxis y `git diff --check` | Archivos de producción y nuevas pruebas analizables, sin errores de formato. |
| `SESSION_SOURCE_BASELINE=… node tests/validate-race-session.mjs` | Script 0.77 auténtico frente a CJS actual, 16 combinaciones (cuatro modelos y asfalto/tierra/hielo/costa), 3.552 pasos, 96 estados de fin de acción iguales. Acelerar, frenar, dirección, mano y reversa; comparación exacta, sin tolerancia sobre movimiento/progreso. La reversión de la migración de script devuelve exactamente el archivo auténtico. |
| Misma prueba, contactos | 22 escenas, 60 pasos cada una: contactos entre coches a velocidad positiva/cero/reversa y frontal contra barreras, asfalto/hielo y perfiles open/full/half. Cada paso conserva posiciones, velocidad, yaw/steer/drift, vueltas/gates y **flash/cooldown** respecto del orquestador anterior; se producen impactos reales de coche y barrera. |
| Misma prueba, carreras independientes | Dos carreras de dos coches, Sunset y Dusty: ejecución separada e intercalada, **24 vueltas válidas** en total. Física/gates/contactos del módulo original; un controlador de navegación de prueba suministra comandos, sin asignar vueltas/checkpoints ni teletransportar durante la carrera. Resultados/posiciones/tiempos iguales; pausa/reinicio de A deja B intacta. |
| Misma prueba, ciclo de vida | Cuenta regresiva sin movimiento/overshoot, pausa, límite tras stall, entradas/steps inválidos, copia/bloqueo de parrilla, restart desde salida, snapshots separados, resultados congelados, secuencias ordenadas e identidades distintas, reloj detenido después del cierre. |
| `browser-shared-driving.cjs` con 0.77 auténtico | 16 escenas de teclado nativo / 96 estados de movimiento, progreso, tiempos y HUD idénticos, 3.552 pasos de conducción observados en cada versión. El juego real usa la nueva sesión. No es una prueba de confort humano. |
| `browser-trial.cjs` | 30 vueltas válidas con cuatro coches en asfalto/hielo, mejor vuelta y fantasma, igualdad con ghost ON/OFF, resultados sin temporada, persistencia y transición local. El controlador P1 es instrumentación de prueba; reglas y paso fijo reales. |
| `browser-rally.cjs` | 62 vueltas válidas: cinco perfiles, cuatro modelos, tres dificultades y parrillas de cuatro. Se comparó el JSON completo de sus 14 escenas con el registro 0.77 preservado: mismos tiempos, salidas, impactos, longitudes máximas de paso, final y ghost. No se retoca el ritmo de la CPU. |
| `browser-events.cjs`, `validate-events.mjs` | Rápida/campeonato/local: puntos, DNF, revancha, avance/final/reset, formato activo, preparación/duplicación/foco/error/reintento/pérdida de mando. Algunas escenas de resultados se preparan artificialmente, sin confundirlas con las vueltas anteriores. |
| `LOCAL_STAGE=11 browser-local.cjs` | Teclas simultáneas reales, 2/3/4 coches elegidos, cámaras/HUD, pausa/reinicio/resultados/siguiente, fullscreen/cinco tamaños y mandos/desconexión emulados. |
| `browser-touch.cjs` | Multitouch CDP, pedales/giro/mano/reversa, captura/cancelación, limpieza de entrada, cuatro tamaños, fullscreen, ajustes/persistencia y local táctil+teclado/exclusión de mando P1. |
| `validate-fixed-step.mjs` | 20/30/60/120/144 Hz y jitter; mismo estado físico/pasos, interpolación sin mutación y limpieza de pausa/reinicio/menú. |
| `validate-integration.mjs` | IDs/recursos, diez originales y catorce pistas registradas, 70 combinaciones pista/barrera/gates. |
| `validate-race-lifecycle.mjs` | Cien ciclos rápidos de pausa/reanudación, un solo bucle, foco/pestaña oculta, acelerador limpio, reinicio/menú y formato de tiempo conservados. |
| `validate-rally.mjs`, `validate-ai-pace.mjs` | Rally/otros trece trazados y archivo de récords conservados; hash normalizado solo por la migración declarada. Diez vueltas de cinco comparaciones históricas de CPU conservan sus presupuestos; el snapshot declarado de Rally v3 corrige la referencia antigua de geometría sin cambiar tiempos objetivo ni fixtures anteriores. No es una mejora nueva de ritmo en 0.78. |
| `validate-ghost.mjs`, `validate-countersteer.mjs` | Datos corruptos/cuota/límites y grabación/ángulos/recarga; doce escenarios de contravolante, hash físico histórico conservado tras revertir migraciones declaradas. |
| `browser-release.cjs` | Bundle real bajo `/f1/`, caché vieja, ocho recursos versionados, ausencia/fallo de cualquiera de cinco módulos compartidos, selección/cuenta regresiva/conducción/pausa/reinicio/menú y P3 local, consola sin excepciones. HTML real 0.77 probado con el bundle nuevo. La entrega no instala los aliases de pruebas (`cars`, `elapsed`, `raceState`) en el objeto global. Esto no verifica Pages público. |

Resultados de las carreras CJS intercaladas:

| Sesión | Pista | Tiempos finales | Eventos |
|---|---|---|---:|
| A | Sunset | 190,700 / 191,100 s | 65, incluyendo la pausa/reanudación de prueba |
| B | Dusty | 106,883 / 107,283 s | 40 |

Cada coche completa tres vueltas, resultados 25/18 puntos base y llegada dentro del plazo. Los tiempos corresponden al controlador de prueba conservador; no describen competitividad ni diversión humana.

También se abrió el bundle sin instrumentar, se condujo con teclado en Rally y se capturaron carrera/pausa sin excepciones; se revisó la captura de carrera para comprobar coches, cámara, pista y HUD. No es una carrera humana completa ni una prueba de FPS.

## Compatibilidad de las pruebas y límites

Las sondas históricas usaban nombres de variables privadas (`cars`, `elapsed`, etc.). `tests/helpers/race-state-bridge.cjs` instala **solo en los scripts instrumentados de prueba** getters/setters hacia el estado actual, sin copiarlo ni sustituir la física. Producción usa `raceState.*` y no carga ese helper. Los servidores de prueba sirven el nuevo recurso.

`without-race-session.mjs` revierte exactamente las modificaciones declaradas para preservar fixtures anteriores; la igualdad contra 0.77 auténtico detecta cambios fuera de la extracción. No se sobrescriben fixtures ni se relajan presupuestos de carrera para aceptar otra física.

No hubo que cambiar valores de manejo/IA para superar las pruebas. Se conserva explícitamente el orden del cooldown de impactos, que habría sido una regresión si se descontaba después de los contactos del grupo. La protección de cierre evita un avance posterior accidental del reloj fuera del flujo de UI normal.

La política CPU de la carrera local sigue en el adaptador y se invoca por hook; no se ha aislado su planificador para varias salas de bots. El snapshot no incluye toda esa política ni implementa restauración/importación de replays. La temporada/guardado son consumidores de resultados, no estado físico de cada sala. Los registros locales no son autoridad de servidor ni resultados firmados.

No hay WebSocket/servidor/salas/listos/reconexión/predicción ni partidas entre dispositivos todavía. Se requiere 32.1/33 con entradas validadas, identidad/pilotos/configuración bloqueados, snapshots y resultados producidos por servidor, varios clientes independientes y prueba de carreras antes de anunciar online. Tampoco se declara mejora audible, mayor diversión, hardware FPS ni comodidad física de controles por estos tests.

Siguiente entrega preparada: **32.1**, servidor autoritativo local y salas privadas para humanos sobre esta misma API. Mantener la experiencia local sin red, cerrar contrato/pruebas antes de integrar el botón online o proponer un despliegue externo. Manejo/derrape/audio, gráficos y tres trazados uniformes siguen en sus fases.
