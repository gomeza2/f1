# Auditoría 0.89 — encontrar la trazada y seguir aprendiendo

## Revisión de 0.88 antes de editar

Se repitió con Playwright el recorrido nativo de entrada, teclado y tres revancha completas. La 0.88 ya tenía portada, tutorial omisible, una vuelta, medallas, efectos de velocidad y audio procedural avanzado: no se reconstruyen. Se observaron dos carencias: las revancha repetían la misma introducción sin progresión; los checkpoints se veían, pero el siguiente y la necesidad de reducir velocidad no se distinguían. Capturas previas: /workspace/artifacts/evolution-089-before.

## Cambios funcionales

- Tres retos opcionales de una vuelta: Neon Harbor / Dusty Mesa / Sunset. Corner King y un rival con ritmo pedagógico de 100 / 110 / 125 km/h, solicitado mediante acelerador y freno existentes. No modifica prestaciones ni decisiones de la IA fuera del aprendizaje. Una alternativa con Meadow no pasó el recorrido automatizado completo y se descartó; no se relajaron gates, plazos ni aserciones para aceptarla.
- El perfil guarda el siguiente reto solo al completar una carrera válida. La interfaz cambia a SIGUIENTE RETO y finalmente CARRERA RÁPIDA de tres vueltas con la configuración del paddock. Reiniciar/repetir una lección no permite saltar avances. Los retos 2/3 mantienen orientación contextual sin repetir los pasos de gas/giro/freno.
- Flechas sobre la carretera, ámbar si la velocidad supera la referencia local de curva, y marco del checkpoint pendiente; pasa a META tras todos los gates. Se basa en geometría/curvatura de producción, sin controlar el coche. Aviso de curva con histéresis, actualizado como máximo a 5 Hz; es orientación, no una promesa de velocidad óptima.
- Diseño LAUREL equipable tras tres medallas, visible en el coche P1 offline y en la vista previa. Decoración original de carrocería sin fuerzas/estadísticas. El desbloqueo es por habilidad medida y no bloquea contenido previo. Elección y progreso persisten; un fallo al guardar el diseño se informa como solo de sesión. No se sincroniza esta nueva decoración por red.
- Presupuesto: hasta seis flechas por vista guiada, tres en Rendimiento; sin buffers ni partículas adicionales. El recuento de medallas para dibujar el diseño se cachea al actualizar el perfil. La ayuda puede ocultarse junto a la trazada. La orientación y la decoración no añaden controles de audio ni descargas externas.

## Pruebas y evidencia

`node tests/browser-first-drive.cjs`: entrada con clic, acciones de teclado, tres carreras físicas completas con control normalizado automatizado, progresión por las tres pistas, resultados/medallas, recarga del perfil, desbloqueo/equipamiento persistente y comparación del Canvas real antes/después. Detectó que inicialmente la vista previa no recibía identidad P1 y no dibujaba el diseño; se corrigió antes de publicar. También verifica la salida del aprendizaje a una carrera normal de tres vueltas y que abandonarla no incremente finales. Contexto móvil táctil real, instrucciones GAS, omitir ayuda y ausencia de desborde horizontal. Capturas inspeccionadas escritorio/móvil en /workspace/artifacts/evolution-089.

Ensayo completo: ~47,3 / 39,5 / 68,9 s de simulación, cuatro medallas y aprendizaje 3/3. No son tiempos objetivo humanos ni una prueba de diversión. El conductor de prueba y el avance acelerado del reloj se declaran instrumentación; no se asignan posiciones/gates para completar carreras.

`node tests/validate-drive-coach.mjs`: condiciones de tutorial, recompensa no estática, interrupción por contacto, recuperación de derrape, adelantamiento sostenido, abandono/final único, almacenamiento inválido, umbral cosmético, META tras gates y orientación sin mutación del coche.

Regresiones ejecutadas: validate-menu, validate-events, validate-results, validate-shared-driving (140 casos), validate-race-session (24 vueltas), browser-release, browser-trial (30 vueltas y fantasmas), browser-local (2/3/4 jugadores, cinco resoluciones), browser-touch, browser-audio y browser-audio-mix. `npm test --prefix server`: 14 tests, incluidos CLI de producción y TLS/WSS con proxy local. `browser-online-game`: cuatro perfiles, reconexión, resultados y revancha. Manifiesto verificado. Adaptadores históricos normalizan solo la nueva llamada de dibujo/ritmo de aprendizaje para mantener las comparaciones de extracción; no se cambian fixtures ni límites físicos.

## Conservación y límites

Los cuatro módulos compartidos no cambian: física, coches, catorce trazados, contactos, gates, sesiones y huella de servidor. Sin cambios en reglas de campeonato, récords, fantasmas, local o salas. Frontend 0.89 / servidor 0.87.0 / protocolo 1; versiones con responsabilidades distintas. No se afirma haber desplegado Render ni comprobado una carrera pública por Internet.

La experiencia sigue necesitando principiantes humanos: comprensión de señales, fatiga de HUD, ritmo 100/110/125, satisfacción y legibilidad cosmética en teléfono. Faltan una renovación profunda de coches/escenarios, música, desafíos más variados, revisión humana de derrape/IA y perfilado móvil sostenido. Las pruebas automáticas no cierran esos objetivos. Próxima entrega: observar sesiones humanas y ajustar presión/ayuda, después renovar materiales/iluminación/coches con comparativas y presupuesto; los futuros atajos/impulsos necesitan reglas y pruebas compartidas, no bonificaciones cliente que rompan online.
