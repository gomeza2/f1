# Auditoría reconciliada — base 0.73 y entrega 0.74

Se conserva la inspección de partida de las entregas anteriores y se contrasta con archivos y pruebas actuales. Main inspeccionado antes de la rama: `e32b8e6` (0.73), limpio; 0.74 comparte reglas sin cambiar balance. No se toma la hoja antigua como descripción actual.

## Archivos y comportamiento contrastados

HTML/CSS/paddock/HUD y script real; módulos `driving-core.js`, `track-core.js`, `engine-audio.js` y nuevo `race-rules.js`; README/notas, ROADMAP_13_FASES completo, arquitectura, diseño online y pruebas. La hoja de 13 fases describe builds 0.12–0.14, diez circuitos/dos humanos: es historial, no estado vigente. No se borra ni se ejecutan sus propuestas retiradas de HUD sobre curvas.

Estado comprobado por código/pruebas:

- Catorce circuitos (diez originales + cuatro ampliaciones), diez con secciones variables; Champion/Rally/Meadow/Industrial siguen uniformes. Cinco perfiles de barreras y siete materiales. Consultas comunes de terreno, pianos y colisión; validaciones geométricas y carreras disponibles.
- Cuatro modelos/seis pinturas; Speed 260, demás diferenciados por grip/freno/giro. Dirección con inercia, contravolante y reversa. `drift` sigue siendo estado escalar de agarre/feedback; no hay velocidad lateral física integrada. Los ensayos laterales anteriores rechazados no se activan por esta auditoría.
- CPU 1–3 con planes de velocidad y perfiles TRAZO/FURIA/ÁPICE; tres dificultades y física común. Más rivales requieren revisar identidad/colores, tráfico, puntos, parrilla y rendimiento. Los tiempos automatizados no validan competitividad humana.
- Rápida con revancha independiente; campeonato desde pista elegida hasta la última, puntos/resultados; local 2–4 con coches/controles/cámaras/HUD propios. No hay libre, contrarreloj/fantasma, eliminación ni diarios implementados.
- Récords locales versionados y mezcla de audio persistida; síntesis procedural, sin muestras externas. El timbre humano y manejo siguen abiertos. Marcas ≤1.400 y partículas ≤360; fondos/pista cacheados y resolución de buffer limitada.
- 0.74 usa conducción/geometría/contactos/progreso compartidos en Node/navegador. Reloj/estado/clasificación completos siguen en main; no hay servidor, salas, transporte, reconexión ni ranking seguro. La autoridad de resultados no se presenta como implementada.
- Móvil: CSS responsive y fullscreen, pero no hay manejadores pointer/touch ni botones de conducción. El menú todavía indica que hace falta teclado. **Es una barrera real de acceso al juego**, no solo un tema de distribución.

## Cinco oportunidades prioritarias

1. Conducción/derrape: diseñar el próximo ensayo con evolución del ángulo de deslizamiento y el controlador, comparar ritmo/contactos/recuperación y aceptación humana; evitar reactivar pruebas rechazadas o subir velocidades globalmente.
2. Móvil jugable: entrada multitáctil, limpieza ante cancelación/pausa/foco, tamaño/posición, cámara legible y controles fuera del HUD. El bloqueo por falta de entrada justifica la siguiente entrega de producto tras publicar 0.74.
3. Pistas memorables: rediseñar las cuatro uniformes, con variación de anchura, rectas y sectores coherentes, conservando registro/identidad y aislando récords por trazado; no inflar todas a la misma duración.
4. CPU/parrillas: ampliar con identidades y tráfico medidos; dificultad por decisiones y riesgo, con física común, no velocidad imposible.
5. Online real: consolidar 30.4 (RaceState/reloj/resultados/aislamiento/replay), luego salas autoritativas y sincronización. No añadir un botón que no termine una carrera ni confundir récord local con validación de servidor.

## Evidencia y límites

0.74: 36 vueltas actuales emparejadas con 36 de referencia real, 56 casos/5.600 pasos de componente, contactos y gates, seis vueltas adicionales en Chromium, local/UX/carga y normalización histórica. Detalle en `tests/experiments/SHARED_RULES_074.md`. Son pruebas automáticas/nativas; no escucha humana, conducción humana ni mandos/teléfonos físicos. Pages público no está confirmado por el entorno.

Siguiente entrega de producto: controles táctiles (42, desglosada de 41), con las mismas reglas compartidas. En paralelo de planificación, 30.4 sigue siendo el siguiente requisito para online. Ampliaciones de garaje/progresión y modos especiales se mantienen separadas para no introducir todos los sistemas a la vez.


## Seguimiento 0.75

El bloqueo móvil identificado se aborda con controles multitáctiles reales para P1 y cámara que ocupa el panel en vertical/horizontal, usando la misma física. Activación/tamaño/disposición y persistencia validados; teclado, mandos y local conservados. Evidencia en `tests/experiments/TOUCH_075.md`. El diagnóstico anterior describe la base auditada, no niega este avance. Teléfono físico/aceptación humana siguen pendientes.


## Revisión de continuación 0.76

Base real revisada: `main` limpio `e628ad3` / 0.75, antes de crear `work/time-trial-076`. Contrastados inicio/modos/resultados/tiempos, paso fijo, dibujo de coches, carga de dependencias, almacenamiento, reglas de vueltas, módulos de conducción/geometría y pruebas; documentación/arquitectura/online consultadas. Siguen catorce pistas, cuatro modelos, diez anchos variables y cuatro uniformes; no se usa el resumen antiguo como autoridad.

Cinco oportunidades vigentes: (1) práctica con feedback propio: faltaba contrarreloj/fantasma real, implementado en 0.76; (2) manejo/derrape y evaluación humana, aún pendiente; (3) variar cuatro trazados uniformes y sus decisiones; (4) audio/claridad gráfica y aceptación en dispositivos físicos; (5) aislar carrera completa antes de autoridad de servidor. Se elige 31.1 por valor jugable y porque puede aprovechar las reglas actuales sin inventar un servidor ni un segundo modelo físico.

La inspección de navegador de esta entrega y sus límites se registran en `tests/experiments/TRIAL_076.md`. El punto histórico «no hay contrarreloj» de la auditoría 0.74 queda superado solo para el modo/fantasma personal 0.76; libre/eliminación/diarios/replay completo siguen pendientes.
