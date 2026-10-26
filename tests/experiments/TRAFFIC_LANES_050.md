# CPU: radio de carril durante una disputa — 0.50

Base: `6b86503` / 0.49, física 5. Cuatro controladores Balanced con los perfiles existentes, sin aleatoriedad de conducción. La primera plaza humana se controla como IA solo en el sandbox de pruebas. Tres vueltas con checkpoints reales, colisiones activas y paso 1/30 s. No equivale a una carrera conducida por una persona.

## Problema reproducido

En Dusty Fácil había 28 pasos con solapamiento, principalmente dos coches trabados cerca de meta. El plan usaba la magnitud de la curvatura del centro aun cuando la disputa llevaba un coche al interior. Ese carril tiene menor radio; el objetivo lateral tampoco representa una posición alcanzada instantáneamente. La secuencia registrada muestra frenadas/correcciones y contacto prolongado, no un problema de potencia.

## Variantes

Los experimentos retienen las mismas prestaciones, reglas de física, volante, dificultad y decisiones de ataque/defensa. La primera corrección guarda curvatura con signo y reduce el límite de curva por la razón entre radio interior y radio central: si la aceleración lateral es la misma, la velocidad varía con la raíz del radio. No hay bonus de velocidad por una línea exterior. Radios extremos conservan una velocidad de recuperación acotada; no es un cálculo exacto de toda transición lateral.

| Línea usada para la previsión | Dusty Fácil: pasos de contacto | Volcano Normal: pasos de contacto | Decisión |
|---|---:|---:|---|
| Centro, 0.49 | 28 | 4 | Referencia |
| Objetivo lateral solicitado | 2 | 24 | Descartada por regresión en Volcano |
| Objetivo filtrado `aiLane` | 3 | 30 | Descartada |
| Mezcla posición real/objetivo | 0 | 28 | Descartada |
| Transición prevista, limitada por ritmo de cambio de carril | 4 | 0 | Más compleja, no mejora el conjunto frente a posición real |
| **Posición lateral real** | **3** | **0** | **Elegida** |

Dos variantes adicionales limitaban cuánto se desplazaba el objetivo hacia el interior de una curva: ambas seguían con dos pasos en Dusty, sin demostrar una mejora que justificara cambiar además el volante/reservas. No se integran.

Dusty, medias por piloto de la referencia → versión elegida: 25,18 → 24,57; 24,38 → 25,07; 23,59 → 23,83; 25,60 → 23,41 s. Todos completan tres vueltas. No se afirma que cada piloto gane tiempo: se evita el atasco sin ralentizar ampliamente la parrilla. La regresión exige como máximo cuatro pasos en Dusty y Volcano, sin elevar el presupuesto de los tests existentes.

## Comparación adicional elegida contra 0.49

Cinco escenarios con cuatro coches/tres vueltas; misma semilla visual y parámetros. `Pasos fuera` suma pasos-coche con el centro fuera de la franja legal y aplicación de la resistencia del terreno. No es distancia en metros ni número de incidentes.

| Escenario | Contacto antes → después | Pasos fuera antes → después |
|---|---:|---:|
| Dusty Fácil | 28 → 3 | 0 → 0 |
| Sunset Normal | 19 → 1 | 0 → 0 |
| Night Normal | 5 → 2 | 0 → 32 |
| Volcano Normal | 4 → 0 | 22 → 13 |
| Sunset Difícil | 0 → 2 | 50 → 0 |
| Total de estas referencias | 56 → 8 | 72 → 45 |

No todos los valores mejoran: Night suma 32 pasos-coche fuera (1,07 s acumulados entre los cuatro a 30 Hz) y Sunset Difícil tiene dos pasos de contacto nuevos. Todos completan tres vueltas; la física sigue penalizando las salidas. Estos casos quedan pendientes para la revisión de transiciones/espacio, sin presentarlos como errores solucionados. No se extrapola la reducción agregada a todas las carreras posibles.

## Reproducción

```
git show 6b86503:script.js > /tmp/script-049.js
node tests/experiments/compare-traffic-lanes.mjs /tmp/script-049.js
node tests/validate-lane-speed.mjs
node tests/validate-ai-plan-query.mjs
node tests/validate-grid.mjs
node tests/validate-traffic.mjs
```

El comparador informa tiempos, pasos con contacto, pasos-coche fuera del corredor y máximo offset en cinco escenarios de tres vueltas; `--current-only` reutiliza una referencia ya registrada. El fixture 0.49 conserva modelos, perfiles, física y dos casos reales. Las consultas se comparan con el barrido completo en 7.344 combinaciones, incluida la meta y carriles de ambos signos. La consulta de Night sigue limitada al horizonte 240 (31 lecturas en la referencia).

## Límites

La conducción sin tráfico sigue usando la referencia previa y no cambia física/potencia. La aproximación de radio supone un carril paralelo a partir de la posición actual; no resuelve globalmente cambios de línea, grupos de tres, contravolante ni la trazada ideal de toda una vuelta. Los contactos siguen activos. Las pruebas no demuestran equilibrio, diversión ni seguridad ante tráfico humano impredecible. Fase 28 continúa abierta; no se modifica el local 2–4, audio, circuitos o récords.

Batería principal de cierre: 42 carreras libres (126 vueltas), 20 parrillas (240), 14 tráfico (84) y dos regresiones focalizadas (24): 474 vueltas válidas. Los veinte casos de parrilla respetan el presupuesto vigente de contacto, sin aumentarlo; Meadow Normal tiene 7 pasos, Industrial Normal 12 y Frostbite Difícil 5, pendientes para futuras reservas frente a grupos. Integración/consulta/local y Chromium completo/local/entrega superados. Las variantes y repeticiones de investigación quedan fuera de este recuento.
