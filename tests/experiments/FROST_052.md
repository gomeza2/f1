# Frostbite GP: forma propia y material de hielo — 0.52

Base real `5e2c27a` / 0.51, árbol limpio y main remoto verificado. Se conserva `before.js` fuera del repositorio durante el trabajo; la información útil queda congelada en `fixtures/frost-0.51.json`.

## Diseño y variantes

La silueta de Frostbite estaba a 0,060 de Thunder y a 0,091 de Neon según la comparación normalizada que ignora escala, rotación, reflejo, sentido y punto de salida. No bastaba cambiar el tamaño/color.

- Las dos primeras propuestas tenían margen/espacio insuficientes para lo buscado y se parecían a Night (distancias 0,174/0,148): descartadas.
- Una forma más asimétrica tenía una inversión cerrada junto a la meta: margen entre bordes −72,4. Se descarta aunque la línea de checkpoints permitiera vueltas. Esto prueba por qué no basta con que una CPU termine.
- La corrección del cierre daba geometría válida pero quedaba demasiado próxima a Dusty (0,177). Se abandona en favor de un arco oriental grande y regreso técnico occidental.
- Variante final: distancia más cercana 0,258 (Volcano), 0,260 a Dusty y 0,286 a Sunset. Mundo 2200×1408, recorrido 6368,7 frente a 3424,2 unidades (+86,0 %), ancho útil 68–112 y nueve checkpoints ordenados separados por unos 636,9 de recorrido. Sin cruces/superposiciones en la validación; margen del corredor al mundo 86,1 y separación de ramales 57,4.

La referencia Normal libre de dos vueltas a 60 Hz pasa de 27,17/26,17 s a 36,93/35,85 s. No se modifica potencia ni velocidad para conseguir esa duración. La comparación es automática, no un tiempo humano ni objetivo obligatorio para cada coche. El arco rápido permite velocidad; el regreso estrecho/curvo exige otra conducción sobre hielo.

## Material y continuidad

Se conserva hielo con agarre 0,68, resistencia y recuperación anteriores. Paleta de carretera, rasguños longitudinales y marcas de rueda azuladas están en la definición del material. No recibe el aspecto de asfalto ni pianos rojos/blancos. El grano se reduce por calidad y se integra en la superficie cacheada; no se genera un sistema de partículas nuevo por frame.

La misma sección alimenta render, física, barreras/neumáticos, meta/checkpoints, escenario, CPU, vista previa y minimapa. Perfil automático en curvas, con cuatro alternativas manuales existentes. Se conservan los otros trece recorridos y los diez nombres originales. `FROSTBITE GP@3:p5:r1` preserva los tiempos de `@2:p5`.

## Comprobaciones

- `validate-frost.mjs`: 12 carreras/54 vueltas válidas, cinco perfiles, cuatro modelos, parrillas de cuatro en tres dificultades, sin cambio de especificaciones ni teletransporte de recuperación. Las cinco pruebas libres Balanced tienen cero pasos fuera; no se extrapola a todos los modelos/personas.
- Parrillas Easy/Normal/Hard: medias por piloto 42,87/43,43/40,77/41,50; 36,79/37,12/35,69/35,32; 36,64/36,33/35,81/35,47. Contacto acumulado 1/4/4 pasos a 30 Hz. Se mantiene el orden de dificultad de la primera plaza; el tráfico puede invertir pequeñas diferencias entre otras personalidades.
- Geometría de las 14 pistas y de las seis secciones variables: 27.280 sondas físicas de borde. Colisión/escenario Frost: dos contornos cerrados/1.366 sondas; 340 objetos entre tres calidades, presupuesto 150/110/80 y distribución por el mundo.
- Chromium: 6.944 sondas de píxeles Frost en cinco perfiles y las tres calidades; carrera de tres vueltas 36,87/35,80/35,73 s, más Night y cámaras locales. Capturas abiertas/valladas/cercanas/ligeras revisadas. La prueba usa instrumentación solo en el servidor de tests.
- Quince imágenes completas de los cinco corredores variables anteriores × tres calidades son idénticas antes/después. Reproducir con `ROAD_SOURCE_BASELINE=/tmp/script-051.js node tests/browser-material-parity.cjs`, conservando antes `git show 5e2c27a:script.js > /tmp/script-051.js`.

Las validaciones históricas de Sunset/Night/Volcano no exigen el hash del Frost antiguo una vez migrado a versión 3. La conservación de los otros trece pasa al fixture nuevo; no se borran las protecciones. El benchmark de ritmo 0.47 ya no compara tiempos de Frost entre recorridos distintos: conserva cinco comparaciones y deja la nueva pista al test específico.

## Límites

No es aprobación humana del hielo, del ritmo o de la dificultad. No se prueba toda la combinación cartesiana de coches, barreras, entradas y dispositivos. La física/CPU 0.51, audio y local 2–4 se conservan; pruebas de teclado/mandos emulados no demuestran comodidad con hardware físico. La fase 27 sigue abierta: seis pistas tienen sección variable y ocho aún no; las siluetas antiguas más parecidas requieren otras revisiones.

Cierre de regresión: doce carreras Volcano/54 vueltas y cinco comparaciones CPU/diez vueltas en trazados intactos, además de las doce Frost/54: 118 vueltas válidas en la batería Node principal. Los otros trece recorridos se conservan por hash; no se repiten las 42 carreras libres y todas las veinte parrillas. Integración/menú/gates/colisiones, CPU focalizada y dieciocho parrillas locales (2/3/4 humanos en seis pistas, incluida Frost) superados. Chromium completo/local/entrega superados. La carga pública de Pages sigue requiriendo comprobación externa al proxy.
