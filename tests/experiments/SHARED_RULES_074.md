# 0.74 — reglas compartidas, tramo 30.3

## Base y cambio real

Main 0.73 `e32b8e6a40a58189af89d19145a9ffa55997e3f7`, revisado limpio y actualizado antes de crear rama. Se conserva el archivo real anterior para comparaciones independientes; no se sustituyen fixtures ni se relajan presupuestos de contactos.

`race-rules.js` es la implementación usada por navegador y Node de avance con terreno/recuperación, contactos entre coches y con vallas/neumáticos, gates/vueltas y consulta de cierre. Usa los módulos reales de conducción/pistas y recibe tiempo explícito. Emite eventos inmutables numerados de checkpoint, vuelta e impacto; el cliente traduce a sus cues y mantiene el récord local con una anotación de vuelta. No hay una segunda física ni un DOM falso en el módulo.

Se conserva exactamente el orden: control CPU/humano, avance/terreno/barreras/progreso, efectos y flash en el adaptador, después contactos de todo el grupo. Contexto/eventos se reinician al empezar carrera; no se retoca marcha atrás, grip, velocidades, modelos, pistas, dificultad, audio ni récords p6/b1/s1. Rápida/campeonato/local, carga y vista amplia siguen disponibles.

## Validación final

Sintaxis de 28 archivos JS nuevos/modificados y diff comprobados. La normalización histórica conserva el hash físico: las doce regresiones de contravolante y cruces de signo 30/120 Hz también pasan; son preservación de la mejora anterior, no una nueva mejora de giro en 0.74.

- `validate-shared-rules` contra el archivo real 0.73: 56 casos, 5.600 pasos, cuatro modelos/siete rutas/perfiles abierto y completo. Movimiento, terreno/recuperación y estado de progreso idénticos al legado. Esos pasos no produjeron cues: la validación de eventos está en los escenarios siguientes, no se afirma cobertura de impacto por esa matriz vacía.
- 27 escenas de contacto con velocidad firmada −28/0/160 en Sunset/Frost/Coast y abierto/completo/mitad. Estados y orden/fuerza de cues idénticos; sin crear velocidad. Se usa coche posterior detenido para cubrir alcances reales.
- Seis escenas frontales de valla/neumático (tres rutas, completo/mitad): contactos efectivos y eventos de impacto no vacíos, estados y cues exactos.
- Cruce de todos los gates y meta durante tres vueltas del escenario explícito: 30 eventos ordenados, anotación de récord/lap/final y estado exactos; cierre a 18 s, no a 17. Son cruces de prueba, no tres vueltas conducidas.
- Eventos congelados, secuencia propia, configuración de vueltas inválida rechazada. Carga/uso Node con DOM, almacenamiento, audio, Date, performance, RAF y Math.random prohibidos. No hay cola interna de eventos que acumular; el hook del consumidor tiene responsabilidad de vaciar su propio buffer.
- 36 vueltas actuales emparejadas con 36 del archivo real 0.73: Sunset Normal, Coastline Normal y Frost Hard, cuatro coches. Posición/velocidad/tiempos/gates/llegadas/contactos exactos; contactos 2/6/0, cero salidas, igual que referencia.
- Chromium: 16 escenarios nativos, 96 snapshots de cuatro modelos/cuatro rutas, 3.552 pasos observados del motor compartido; movimiento/progreso/tiempo/HUD exactos frente a 0.73.
- `validate-gate-contact`: roce legal Dusty, exclusión de coche completo fuera de pista, intersección exacta, no doble conteo, gates/meta en 14 rutas. `validate-finish`: primer llegado, humano continúa, plazo, pausa, DNF y premio único. `validate-events`/`validate-results`: rápida/revancha/campeonato/local y puntos preservados.
- `validate-barriers`: tres rutas × cinco perfiles, seis contornos y 4.277 sondeos geométricos; cápsulas de rail/tire y respuesta parada/frontal. Chromium recuperación: P1–P4, marcha atrás/avance/HUD, pared frontal, mandos emulados, pausa y récords.
- Chromium carretera: Coast, 7.679 probes de borde/material y cinco perfiles; tres vueltas a paso fijo 39,90 / 38,83 / 38,83 s. Night, tres vueltas en escenario heredado 1/30: 58,80 / 57,73 / 57,73 s, además de cámaras divididas.
- Chromium modos 0.73: rápida/campeonato/local, preparación/duplicados, fallo controlado y reintento, pérdida de mando durante preparación, selección/estados y cinco tamaños. El error de preparación inyectado emite el diagnóstico esperado, no una excepción sin manejar.
- Chromium local: 2–4 teclados, coches/cámaras/HUD, pausa/reinicio/resultados/siguiente, fullscreen/cinco tamaños y mandos estándar emulados, exclusividad/desconexión/reconexión. Hardware físico pendiente.
- Integración: IDs/archivos/versiones, diez originales y 70 perfiles. Entrega real `/f1/`, seis recursos CSS/JS versionados, HTML anterior con módulos omitidos y fallo de cualquiera de los tres compartidos; P3 local y controles nativos, sin errores inesperados. No acredita Pages público.

La migración inversa de prueba reconstruye exactamente el script real 0.73. Se conecta antes de las normalizaciones históricas de conducción/geometría, manteniendo intactos los fixtures anteriores. Además de esa restauración se comparó contra el archivo externo real, para no depender solo del helper.

Comandos principales:

```sh
git show e32b8e6:script.js > /tmp/pixelgp-073.js
RULES_SOURCE_BASELINE=/tmp/pixelgp-073.js node tests/validate-shared-rules.mjs
RACE_SOURCE_BASELINE=/tmp/pixelgp-073.js node tests/validate-pedal-races.mjs
node tests/validate-gate-contact.mjs
node tests/validate-finish.mjs
```

## Problemas de integración revisados

Al añadir el archivo servido por los harnesses, una sustitución alcanzó también la tupla de nombre/marker del test de carga; se corrigió al revisar el diff antes de correr esa prueba. Se prueban tanto las rutas normales como los marcadores de fallback de los tres módulos. No se sustituye geometría ni reglas por mocks.

No se observó una divergencia de reglas en las comparaciones finales. No se confunde esa paridad con mejorar el equilibrio humano, el timbre o la diversión.

## Pendientes explícitos

No hay `createRace`/`stepRace` completos: reloj/acumulador, creación/estado de coches, cuenta regresiva/pausa, decadencia de flash, clasificación/puntos/resultados y reinicio siguen en el adaptador. Estos componentes y sus eventos no acreditan aislamiento de dos carreras/salas completas. El número de evento es local al contexto y se reinicia: el futuro servidor debe usar raceId + sequence y decidir reloj/resultados, sin confiar en récords del cliente.

Próximo: 30.4, estado/reloj/resultados independientes, replay y dos carreras intercaladas; después 32/33 salas privadas autoritativas y sincronización. Online y 3D todavía no disponibles; más CPU/gráficos/modos/sonido siguen en sus fases. Evaluación humana, mandos físicos, FPS de dispositivos y Pages público pendientes.
