# Anticipación del borde en una disputa — 0.51

Base real: `eef9493` / 0.50. Cuatro Balanced, mismos perfiles/dificultades, tres vueltas, paso 1/30 s; primera plaza conducida por el controlador solo en el sandbox. El fixture `traffic-0.50.json` conserva las tres referencias reproducidas desde ese código.

## Causa y solución

Night registraba 32 pasos-coche con el centro fuera de la franja legal. En el episodio, el rival exterior seguía acelerando hacia el borde: a 225,7 km/h de marcador tenía un error de rumbo de unos 0,315 rad respecto de la pista. La recuperación actuaba después de salir. Meadow e Industrial tenían secuencias de roce durante las correcciones de trayectoria.

La CPU ahora consulta dos proyecciones de su movimiento actual (0,25 y 0,5 s), incluyendo su velocidad angular. Compara cada posición prevista contra la anchura legal de ese punto, con un margen de seis unidades. Si el margen empeora y cruza el borde previsto, pide una velocidad menor mediante acelerador/freno normales. No desplaza el coche ni añade fuerza de frenado, agarre o potencia. No interviene en pista libre, sin maniobra activa o a baja velocidad; una trayectoria de regreso hacia dentro conserva la recuperación normal.

La predicción circular antes privada de contactos se extrae como `projectVehicle` y se comparte con esta consulta. No hay dos fórmulas incompatibles ni llamadas de red. No cambia la física 5, controles humanos, coches, superficies, trazados, audio o claves de récord.

## Experimentos

Pasos con contacto en carreras completas; no número de choques distintos. Todas las referencias de esta tabla completan tres vueltas por coche.

| Variante | Night Normal: contacto / fuera | Industrial Normal: contacto | Otros datos |
|---|---:|---:|---|
| 0.50 | 2 / 32 | 12 | Meadow 7, Sunset Normal 1 |
| Previsión 0,35 s | 0 / 0 | 8 | Meadow sigue 7; Sunset Normal 4 |
| **Previsión 0,50 s** | **0 / 0** | **0** | **Meadow 0; Sunset Normal 13** |
| Previsión 0,65 s | 0 / 0 | 0 | Más anticipación sin mejora de estas referencias |
| Solo aumentar separación lateral de 32 a 36 | 6 / 0 | 0 | Cambia la disputa y aumenta contacto Night |
| 0,50 s + separación 36 | 3 / 0 | 0 | No mejora el conjunto frente a previsión sola |
| 0,50 s solo cerca del borde | 1 / 0 | 0 | Meadow sube a 14; Sunset Normal 6 |

Se elige previsión 0,50 s sin cambiar reservas/volante. La vuelta media de toda la parrilla Night aumenta aproximadamente 0,9 %; no es una mejora universal de velocidad. La guarda de recuperación hacia dentro se prueba por separado y conserva las cifras de las referencias elegidas.

## Referencias elegidas

| Circuito | Contacto 0.50 → 0.51 | Pasos-coche fuera 0.50 → 0.51 | Medias nuevas, P1/TRAZO/FURIA/ÁPICE (s) |
|---|---:|---:|---|
| Night Normal | 2 → 0 | 32 → 0 | 59,29 / 59,67 / 57,86 / 57,56 |
| Meadow Normal | 7 → 0 | 0 → 0 | 30,70 / 30,19 / 29,19 / 28,80 |
| Industrial Normal | 12 → 0 | 0 → 0 | 27,37 / 27,86 / 26,56 / 26,10 |

Protección del avance previo: Dusty Fácil queda en un paso con contacto (tres en 0.50), con medias 24,59/25,04/23,83/23,40 y sin pasos fuera. Volcano conserva cero contactos y baja de 13 pasos-coche fuera documentados en 0.50 a cero en esta referencia. No implica que cada coche o escenario sea más rápido.

## Comprobaciones y límites

- `validate-boundary-plan.mjs`: proyección recta/circular, ambos lados, planner inmutable, anticipación antes de la salida, pista libre/sin intención/baja velocidad, regreso desde el borde y movimiento/frenado por física normal en pista abierta.
- `validate-boundary-races.mjs`: tres carreras/36 vueltas válidas, especificaciones preservadas, cero contacto/salida en esas referencias y no más de 3 % de pérdida de media de parrilla.
- `browser-boundary.cjs`: las tres carreras con Canvas/Chromium real, 36 vueltas, mismo resultado, todos dentro del plazo normal de 18 segundos tras la primera llegada y consola sin errores. La captura opcional `BOUNDARY_SCREENSHOT` muestra Night en el paso 630; la primera plaza es IA solo por la instrumentación. No es una carrera conducida por una persona.
- Consultas/ritmo libre, tráfico, parrillas, integración, colisiones y local se comprueban con las baterías existentes. No se elevan sus presupuestos para ocultar contactos.

La previsión mantiene velocidad/yaw actuales, no simula todos los cambios de control futuros ni garantiza no salir. Dos muestras no son una prueba exhaustiva de la trayectoria. Sunset Normal pasa de 1 a 13 pasos con contacto: pendiente explícito, no se presenta como una mejora en todos los circuitos. Los contactos arcade siguen activos. Sigue pendiente balance humano, hardware físico y estrategias frente a grupos de tres. No se declara terminada la fase 28.

Cierre: batería Node de 396 vueltas válidas: 20 parrillas/240, 14 tráfico/84, seis referencias libres/doce, tres regresiones nuevas/36 y dos anteriores/24. No se repiten las 42 carreras libres de dificultades: se comprueba el ritmo libre con seis referencias y la guarda inactiva fuera de disputa. Colisiones, CPU focalizada, consultas, integración y local superados. Chromium completo, local, entrega y 36 vueltas adicionales en los tres casos nuevos superados. Rally Normal registra cuatro pasos con contacto nuevos y Frostbite Difícil conserva cinco; se mantienen como pendientes. No se amplían los presupuestos vigentes de contacto para aprobar.
