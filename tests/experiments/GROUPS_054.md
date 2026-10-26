# CPU en grupos — experimento 0.54 / fase 28

## Base y problemas confirmados

Main real `9bcf8cadc94f412c7a0be357beb314cf524a0c4e` / 0.53, árbol limpio/remoto confirmado; trabajo recuperable en `work/cpu-groups-054`. Revisados tráfico, proyección de movimiento, planificación de velocidad, física/colisiones, reinicio, carreras de regresión, documentación y versión de recursos.

Sunset Normal, cuatro controladores/tres vueltas a 30 Hz: **13 pasos con contacto**, cero pasos de centro fuera del corredor legal. Son pasos de solapamiento antes de resolver colisiones, no trece choques distintos. El selector elegía al rival físicamente más cercano con intención activa: un líder podía borrar la reserva de un coche al lado. Cada estado individual persistía, pero la elección de cuál gobernaba la trazada podía cambiar por pequeñas diferencias de distancia.

Un escenario controlado de cuatro coches muestra otro riesgo: elegir solo un rival lateral puede dirigir el coche hacia el rival del otro flanco. La prioridad sola mejora carreras pero no resuelve ese caso.

## Alternativas comparadas

Mismos modelos/física 5, rutas y especificaciones de pilotos. Sunset con tres CPU más P1 automatizado, dt 1/30, tres vueltas válidas por coche, sin saltar gates ni desactivar contactos.

| Variante | Pasos con contacto Sunset | Resultado/contrapartida |
|---|---:|---|
| 0.53, rival más cercano | 13 | Base |
| Retener rival previo hasta 12 unidades de diferencia | 5 | Reduce cambios, sin resolver prioridad del solapamiento |
| Retener hasta 24 | 5 | Sin mejora adicional |
| Retener hasta 40 | 8 | Compromiso excesivo |
| Prioridad al rival solapado, sin corredor compartido | 1 | Cierre reproducible hacia el otro flanco; insuficiente |
| Reservas con todos los solapados, mínimo 28 | 5 | Night introduce un contacto, frente a cero; descartada |
| Reservas con todos, mínimo 26 | 4 | No se elige solo por reducir margen de seguridad |
| **Prioridad + corredor entre flancos opuestos** | **1** | **Elegida; Night conserva cero y resuelve el caso encajonado** |

La reserva objetivo individual existente es 32; la restricción de grupo admite mínimo 28 (radio de contacto 23 + cinco de margen). Con coches en ambos flancos, se intersectan los límites laterales y el espacio de carretera actual/futuro. Si cabe, se conserva una línea dentro de esa intersección. Si no cabe, se mantiene el carril ocupado y se pide bajar de velocidad respecto al coche adelantado para que se abra espacio. Solo genera objetivos para el volante/acelerador/freno compartidos.

Los trenes por un solo lado conservan la reserva del rival lateral más próximo; todos los rivales siguen participando en el límite de frenado. No se inventa una línea lateral común para coches longitudinalmente separados. Esta decisión evita la regresión Night de la variante general. No es un planificador conjunto de trayectorias ni predice todas las futuras maniobras humanas.

## Comparaciones elegidas

Diez escenarios congelados en `fixtures/groups-0.53.json`, todos con cuatro controladores y tres vueltas por coche; salvo indicación, dt 1/30. Ninguno suma pasos de centro fuera del corredor legal. La mejora Sunset es la referencia a 30 Hz; a 60 Hz conserva seis pasos con contacto y los mismos tiempos. No se extrapola la reducción a todas las frecuencias ni se comparan conteos entre frecuencias distintas. Contactos antes → después:

| Referencia | Contacto 0.53 → 0.54 |
|---|---|
| Sunset Normal | 13 → 1 |
| Night Normal | 0 → 0 |
| Meadow Normal | 0 → 0 |
| Industrial Normal | 0 → 0 |
| Dusty Fácil | 1 → 1 |
| Volcano Normal | 0 → 0 |
| Rally Normal | 4 → 4 |
| Frostbite Difícil, recorrido versión 3 | 4 → 4 |
| Pixel Normal, recorrido versión 3 | 0 → 0 |
| Sunset Normal a 60 Hz | 6 → 6 |

Sunset, medias por coche P1/TRAZO/FURIA/ÁPICE: antes 36,57/36,93/35,57/35,18; después **36,29/36,67/34,94/35,54 s**. Media de parrilla 36,06 → 35,86 s (aprox. −0,6 %), con cuatro llegadas dentro del plazo normal de 18 s. No todos los pilotos mejoran individualmente. El test limita cualquier pérdida de media por parrilla al 2 %; no se obtiene menos contacto frenando indiscriminadamente ni escapando al terreno.

Se preservan los catorce trazados/superficies/perfiles por hash, modelos, especificaciones de dificultad/personalidad, física 5, récords humanos, audio y local 2–4. No se alteran presupuestos de contactos existentes para aprobar. No hay nueva ventaja de velocidad, fuerza, agarre, recolocación o intangibilidad. Los estados de tráfico siguen acotados a los rivales cercanos y se limpian al terminar/alejarse/reiniciar.

## Pruebas y alcance

- `validate-group-traffic.mjs`: reserva lateral frente al líder más cercano y pequeños cambios de distancia, ambos lados reflejados, frenado ante un segundo rival bloqueado, retirada de terminado y reinicio. Franjas factibles entre dos coches y encajonamiento, planificación sin mutar posiciones/velocidades y cesión por frenado físico común. Diez carreras de referencia / **120 vueltas válidas**, nueve a 30 Hz y una a 60 Hz. `--high-rate` comprueba solo la última sin repetir las otras nueve.
- `validate-grid.mjs`: **20 carreras / 240 vueltas**, catorce pistas Normal y Sunset/Dusty/Frost Fácil-Difícil. Presupuestos físicos/contactos sin ampliar.
- Regresiones: tres carreras de borde /36 vueltas, dos de carril ocupado /24, cinco comparaciones de ritmo libre /10. Proyección, consultas de plan, coches detenidos/doblados/corte de línea, roces suaves, contactos múltiples y recuperación. **430 vueltas Node** en estas suites; hay referencias comunes entre suites con aserciones distintas. Excluye candidatos, repeticiones adicionales, carreras parciales de adelantamiento y navegador. No se repiten las 42 libres de dificultad.
- Integración de IDs/recursos y 70 perfiles, geometría catorce pistas, local 21 configuraciones, ciclo de carrera, menú y gates de contacto. Sintaxis y `git diff --check`.
- `browser-boundary.cjs` ampliado a Sunset/Night/Meadow/Industrial/Pixel: cinco carreras/cuatro controladores/tres vueltas, **60 vueltas Chromium**, escenario encajonado por frenado compartido, límite de llegada y consola. Sunset máximo un paso con contacto, otros cuatro cero; sin pasos de centro fuera en estas referencias.
- `browser-smoke.cjs`, `browser-local.cjs`, `browser-release.cjs`: recorrido general/14 pistas, 2–4 humanos/mandos emulados/resoluciones y entrega local con recursos 0.54 coherentes bajo `/f1/`. El test de entrega usa los archivos sin puente de estado. Captura opcional Sunset revisada.

## Pendientes y oportunidades

Conserva contactos residuales (Sunset uno, Rally/Frost cuatro en las referencias indicadas); no se promete cero contacto ni aprobación de diversión. Siguen pendientes evaluación humana de CPU/manejo, hardware físico, escucha del motor y verificar Pages público: el proxy ha bloqueado el acceso con 403.

Próxima propuesta: fase 26, controles de mezcla y revisión auditiva del motor. Continúan fase 27 (siete pistas uniformes, Jungle candidata), fase 25 (manejo humano) y fase 30 (simulación fija y separación necesaria para fantasmas/online). La fase 28 mantiene pendiente la planificación de varios segundos y los trenes por un lado; no se considera cerrada con estos escenarios.
