# PIXEL GRAND PRIX — Roadmap de 10 fases

## Objetivo

Hacer que PIXEL GRAND PRIX sea un juego arcade retro de carreras con controles agradables, pistas memorables, rivales competitivos y una presentación coherente. La idea es profundizar el proyecto existente, no reemplazarlo con otro juego ni perder las diez pistas, los cuatro coches, el campeonato o el modo local para dos jugadores.

## Criterios para cada fase

- Mantener una versión jugable en todo momento y hacer cambios pequeños que se puedan revisar.
- Probar primero que la carrera termina correctamente, que los checkpoints se respetan y que reiniciar/pausar siguen funcionando.
- No confundir una mejora visual con una mejora de jugabilidad: cada mecánica debe cambiar de forma clara las decisiones del jugador.
- La prueba de sensación de conducción debe hacerse en un navegador real; los cambios de código por sí solos no garantizan que el balance se sienta bien.

## Fase 1 — Base de carrera, controles y récords
**Estado: implementada en build 0.12; pendiente de prueba visual manual.**

- Cuenta regresiva de salida de tres segundos, señal sonora y tiempo de carrera que empieza al dar la salida.
- Respuesta más marcada del freno de mano: facilita la rotación en curvas sin eliminar totalmente el agarre.
- Indicador en el HUD con el mejor tiempo local del circuito y la progresión de checkpoints.
- Récords personales por circuito almacenados en `localStorage`, sin cuentas ni backend.
- Revisar en navegador el inicio, reinicio, pausa durante la cuenta regresiva, modo de dos jugadores y guardado de récords.

**Se considera terminada cuando:** no se mueve ningún coche antes de la salida, el cronómetro no incluye la cuenta regresiva, los checkpoints siguen validándose en orden y los mejores tiempos permanecen después de recargar la página.

## Fase 2 — Diseño de las diez pistas
- Revisar cada trazado para que tenga identidad propia: rectas para adelantar, curvas lentas y rápidas, chicanas, horquillas y cambios de ritmo.
- Añadir rutas alternativas muy controladas o atajos con riesgo, sin permitir saltarse los checkpoints.
- Ajustar las barreras al trazado y dejar espacio suficiente para distintas líneas de conducción.
- Darle a cada entorno una composición visual propia, no solo un cambio de color.

**Se considera terminada cuando:** cada pista tiene una estrategia reconocible y se puede completar limpiamente con todos los coches.

## Fase 3 — Mecánicas especiales del circuito
- Incorporar boosts colocados con intención, zonas de adherencia reducida y obstáculos móviles en sectores concretos.
- Señalizar cada peligro con anticipación visual y sonora.
- Evitar que un obstáculo decida una carrera por azar; permitir esquivarlo con habilidad.
- Activar solo mecánicas compatibles con el circuito seleccionado.

**Se considera terminada cuando:** las mecánicas agregan decisiones y no impiden terminar una carrera de forma consistente.

## Fase 4 — Física, derrape y colisiones
- Separar aceleración, velocidad máxima, frenado, giro y recuperación para equilibrar los cuatro modelos de coche.
- Mejorar la sensación de inercia y el derrape, diferenciando el freno normal del freno de mano.
- Afinar los impactos contra barreras y coches; evitar rebotes exagerados o autos atrapados.
- Dar una oportunidad clara de recuperación tras salirse de pista.

**Se considera terminada cuando:** cada coche se siente distinto y el jugador puede explicar qué provocó una pérdida de velocidad o un derrape.

## Fase 5 — Rival CPU y adelantamientos
- Mejorar la línea de carrera del rival y su lectura de curvas.
- Añadir decisiones simples de adelantamiento, defensa y recuperación tras un error.
- Hacer que fácil, normal y difícil cambien el comportamiento de forma perceptible y justa.
- Evitar que la CPU atraviese obstáculos o reciba ventajas ocultas.

**Se considera terminada cuando:** un jugador puede ganar con práctica y el rival comete errores razonables en lugar de parecer perfecto o impredecible.

## Fase 6 — Campeonato, progreso y desafíos
- Ampliar la persistencia de estadísticas: victorias, podios, mejores vueltas y resultados por pista.
- Crear contrarreloj, objetivos de conducción y retos con reglas claras.
- Diseñar desbloqueos cosméticos que premien jugar sin hacer más lento el inicio.
- Mantener datos locales exportables o fáciles de reiniciar.

**Se considera terminada cuando:** los resultados siguen disponibles entre sesiones y el progreso puede entenderse sin consultar documentación externa.

## Fase 7 — Arte, escenarios y efectos
- Mejorar capas del asfalto, pianos, marcas de goma, sombras, vegetación y elementos de fondo.
- Añadir partículas de polvo, humo, chispas y pequeñas sacudidas al chocar, con opciones de rendimiento.
- Mejorar los sprites de los coches, sus luces y animaciones de ruedas.
- Conservar el lenguaje visual retro y una lectura clara de los límites de pista.

**Se considera terminada cuando:** los efectos refuerzan la velocidad y los impactos sin tapar el trazado ni bajar demasiado los FPS.

## Fase 8 — Cámara, HUD y accesibilidad
- Mostrar velocidad, estado de vuelta, checkpoints y récord con buena jerarquía visual.
- Refinar el minimapa, las señales de frenado y el aviso de curvas.
- Mejorar el escalado, el modo de pantalla completa y la distribución en pantallas pequeñas.
- Ofrecer controles claros y opciones para reducir efectos visuales.

**Se considera terminada cuando:** las señales importantes se leen sin distraer de la pista en escritorio y móvil.

## Fase 9 — Sonido y feedback
- Separar sonido de motor, derrape, choque, checkpoints, cuenta atrás y final de carrera.
- Hacer que el motor responda gradualmente a aceleración y velocidad.
- Equilibrar volúmenes y respetar el interruptor de sonido.
- Añadir feedback visual breve para récords, salida de pista y resultados.

**Se considera terminada cuando:** cada acción importante se entiende por sonido o imagen y ningún efecto molesta durante carreras largas.

## Fase 10 — Balance final, pruebas y publicación
- Recorrer las diez pistas con cada coche y cada dificultad.
- Probar pausa, reinicio, salida al menú, modo de dos jugadores, pantalla completa y progreso del campeonato.
- Revisar rendimiento en gráficos detallados, retro y rendimiento.
- Corregir errores, actualizar instrucciones y preparar una versión estable para GitHub Pages.

**Se considera terminada cuando:** el flujo completo funciona sin errores conocidos y la versión publicada coincide con el código probado.
