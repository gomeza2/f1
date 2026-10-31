# Recuperación 0.69 — motor longitudinal y fases 25/11

Base auditada: main `d338ca92587da96c9d1e4abbf490195581b8d29d` / 0.68; remoto igual, árbol limpio al comenzar. Rama `work/dynamics-069`.

## Integración estable

Motor longitudinal separado en `updateDriveSpeed`, con velocidad firmada y orden explícita de marcha. El conductor humano solicita reversa tras ~0,35 s detenido con freno >50 %, acelerador prácticamente suelto y sin freno de mano. Máximo 28 km/h; dirección inversa, transición frenada al volver a acelerar y resistencia del terreno compartida. Frenar una CPU parada no selecciona reversa: su controlador no solicita ese comando, pero las capacidades físicas son las mismas.

Contactos entre coches y con vallas usan velocidad con signo y disipan cierre; no crean empuje. HUD individual R, luces blancas y audio adaptado a velocidad/carga de reversa. Posición y colisiones siguen en el mismo recorrido físico, sin teletransporte para retroceder.

`raceOffset` evita que retroceder por la meta dé casi una vuelta de progreso de clasificación. No se conceden vueltas/gates al cruzarlos hacia atrás; al volver se restaura la posición de carrera y una vuelta válida limpia el desplazamiento. Pausa/foco/reinicio limpian la intención de reversa.

Se añade defensa interna a `advanceRaceFrame`: no avanza durante pausa, cuenta regresiva o fuera de carrera. La prueba que invocaba directamente el avance estando pausado detectó que antes dependía solo de la protección del bucle exterior. No se afirma que el bucle público normal estuviera avanzando durante pausa.

Prestaciones hacia adelante y registros p6/b1/s1 conservados. La inversión exacta de las modificaciones de recuperación reconstruye byte a byte el script de 0.68. Las fixtures históricas permanecen intactas: los tests revierten explícitamente esta migración antes de comprobar sus hashes antiguos, sin ocultar otros cambios.

## Ensayo de deriva no publicado

Se prueba separar orientación/desplazamiento con respuesta transitoria, recuperación limitada por agarre y previsión/contactos según movimiento real, más compensación del controlador. Intensidad 0,35: pulso Champion a 180 durante 0,30 s alcanza ~5,52° de separación, pero la matriz de diez escenarios falla límites previos de contactos/ritmo. Variante 0,18: ~2,84°, Night pasa, Meadow registra cuatro pasos con contacto frente a presupuesto 0. Se rechaza para publicación sin ampliar límites.

El candidato suave queda en `INERTIAL_DRIFT_CANDIDATE_069.patch`, relativo exclusivamente a `script.js` de 0.68 (`d338ca9`). No se carga por HTML ni se aplica sobre main. Las 120 y 24 vueltas exploratorias de las variantes fallidas no cuentan como validación de la entrega estable. No hay deriva lateral nueva activa ni migración a p7.

## Verificación estable

- `validate-reverse`: cuatro modelos, retardo/interbloqueo, tope y retorno, dirección inversa, seis terrenos, colisiones firmadas, vallas completas, reacción ante un rival retrocediendo, meta/gates/rank, pausa/cuenta regresiva y seguridad del freno CPU. Dieciocho trayectorias hacia adelante exactamente iguales a 0.68.
- `validate-pedal-races` con fuente auténtica 0.68: 36 vueltas actuales emparejadas con 36 de referencia, estados/posiciones/tiempos/contactos/progreso/resultados exactos en Sunset Normal, Coastline Normal y Frost Hard.
- Meadow estable: doce vueltas con cero contactos/salidas y presupuesto previo de ritmo/contactos intacto. Total: 48 vueltas estables actuales; las 36 referencias se cuentan por separado.
- Speed 260, doce maniobras de contravolante, Coastline geométrico y pedales previos comprobados. Los tests de parada se detienen en el primer reposo, antes de la nueva orden deliberada de retroceder.
- Reloj fijo: doce escenarios de modelos/materiales a 20/30/60/120/144 FPS y jitter, estados idénticos, interpolación sin mutación y ciclo de vida conservados.
- Chromium: reversa simultánea P1–P4 con cuatro modelos/HUD R, retorno, pausa/release, recuperación desde frente a valla, LT/RT emulados y reinicio/menú. Retroceso de la escena de valla: 26,95 unidades; capturas revisadas. Escenarios posicionados por puente de prueba; no es conducción humana de una carrera completa.
- Local 2–4, cinco resoluciones, pantalla completa y mandos emulados; pedales P1–P4; Web Audio real, silencio de pausa/mute/menú y mezcla. Sin errores JS en los recorridos comprobados.
- Integración: IDs/archivos/versiones, diez originales, 70 configuraciones/checkpoints. Entrega local real bajo `/f1/`, caché anterior y recursos coherentes, teclado/cuenta regresiva/pausa/reinicio/menú.

```sh
node tests/validate-reverse.mjs
node tests/browser-recovery.cjs
git show d338ca9:script.js > /tmp/pixelgp-before-069.js
RACE_SOURCE_BASELINE=/tmp/pixelgp-before-069.js node tests/validate-pedal-races.mjs
GROUP_STAGES=12 node tests/validate-group-traffic.mjs
```

## Pendientes

Tacto humano, mandos físicos, timbre y rendimiento en equipos modestos. La deriva lateral continúa abierta y requiere anticipar la evolución del deslizamiento, no solo su ángulo presente. Online aún no existe. La prueba local y el push no acreditan despliegue público de Pages; el entorno había bloqueado ese dominio con 403.
