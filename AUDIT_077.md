# Auditoría de continuación — 0.77

Main real: `91cdcc14f5d827e5c6a2bea6dd3055d2d6278504` / 0.76; limpio antes de crear `work/rally-canyon-077`. Se conservó el trabajo en curso al reiniciarse el entorno y se volvió a verificar rama/diff/remoto. No se confía en el número 0.40 del pedido histórico.

Inspeccionados HTML/recursos, `script.js` (preview/catálogo, materiales, cachés de render, registro de vueltas, inicio/multijugador), `track-core.js` (14 definiciones, interpolación, perfiles, gates, barreras), módulos compartidos, README/notas/roadmaps, arquitectura/online y pruebas de navegador/fixtures. No se reemplaza el motor ni se agregan dependencias de runtime.

## Oportunidades prioritarias

1. Variedad jugable: Rally Canyon conservaba layout 2, ancho uniforme, 4.005 unidades y una silueta cercana a Meadow/Industrial. Se implementa un trazado propio con distintas anchuras y mayor duración de vuelta.
2. Manejo/derrape: sigue pendiente aceptación humana y una evolución de deriva lateral contrastada; los ensayos rechazados no se reactivan. La entrega conserva fuerzas/modelos.
3. Lectura de materiales: el menú pintaba la tierra gris y los circuitos de tierra conservaban una línea central de asfalto; se corrige con la paleta común y grano estático por calidad.
4. Persistencia: `readTrialStore` aceptaba solo claves del trazado vigente. Una actualización de ruta descartaba tiempos antiguos en la siguiente escritura. Se preservan claves históricas conocidas y se mantiene separación de fantasmas por versión.
5. Online: conducción, geometría y reglas ya son compartidas, pero falta carrera completa aislada de 30.4 antes de salas autoritativas. El nuevo circuito y las poses locales no cierran ese requisito.

El candidato inicial de Rally resultó demasiado similar a Night y fue descartado antes de publicar. El trazado conservado tiene separación independiente y se comprueba con carreras/gates, perfiles y píxeles de Canvas. Geometría válida y carreras automatizadas no prueban diversión humana ni equilibrio frente a una persona.

Estado tras esta entrega: catorce pistas, once con ancho variable, tres uniformes (Champion/Meadow/Industrial); cuatro modelos, rápida/campeonato/contrarreloj/local/táctil conservados. No hay backend, online ni vista 3D nueva. Registro reproducible de pruebas y pendientes: `tests/experiments/RALLY_077.md`.
