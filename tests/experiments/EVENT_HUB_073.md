# 0.73 — modos reales, preparación y espacio de carrera

Base revisada: `main` 0.72 (`f2c59d4f7608f2d23a6371a2f0dd082dc1be4131`), árbol limpio antes de la rama. Se continúa el juego existente; no se cambian modelos, geometría, grip, frenada, CPU ni audio sintetizado.

## Implementado

- Elección visual de partida rápida o campeonato, con una única configuración canónica. La rápida usa tres vueltas, resultado independiente y revancha en el mismo circuito; no otorga puntos de temporada, no muestra su tabla ni declara campeón por elegir la última pista.
- Campeonato conserva puntos, DNF, empates, avance desde el circuito seleccionado hasta el último y nueva temporada. El formato activo se captura al iniciar; revancha/reinicio no lo cambian por una modificación posterior del menú.
- Local 2–4 compatible con rápida/campeonato, modelos/controles/cámaras/HUD existentes. El botón local prepara pilotos y conserva el formato elegido.
- Configuración plegable con pista, dificultad, CPU, barreras y gráficos. El acceso de personalización la abre y enfoca la pista. Paddock con fichas, jerarquía y estados elegidos, sin botones falsos de online/3D.
- Vista individual utiliza ancho disponible en escritorio, como ya permitía el local. Proyección/cámara/overview y rectángulo de conducción usan el mismo ancho lógico; altura lógica y zoom de coche conservados, sin estiramiento. Buffer mantiene tope 2560/DPR/calidades y HUD exterior.
- Preparación visible en arranque del paddock y continuación/revancha. Se cede a dos RAF para pintar antes de generar la pista, sin porcentaje inventado ni espera mínima. Audio se desbloquea en el gesto de usuario, inicios duplicados rechazados, foco al coche al terminar. Fallo visible, limpieza del estado, vuelta al paddock y reintento. R y botón de reinicio siguen inmediatos.
- Se limpia la clase de carrera local al terminar/salir, evitando que afecte el tamaño del paddock/resultados.

## Comprobaciones superadas

- Sintaxis de seis archivos JavaScript modificados/nuevos, diff y comprobación estática final de IDs/recursos/versiones/bootstrap: superados.

- `validate-events`: rápida/revancha, DNF y ausencia de puntos, formato activo preservado aunque cambie el menú, título correcto al elegir última pista, local 2–4 y campeonato/avance/final/reinicio.
- `validate-results`: resultados/tiempos/diferencias/mejores vueltas, puntos DNF, empate, identidades, premio único, CPU 1–3 y local.
- `validate-integration`: recursos/versiones/IDs de la entrega, diez originales y 70 configuraciones pista/barreras. Comprobación estática final de los nuevos IDs y versiones después de añadir la sección plegable.
- `browser-events`: cinco tamaños de menú, modos nativos, tabla rápida/temporada, revancha, dos etapas de campeonato y reset, local cuatro modelos, configuración plegable/foco. Preparación detenida deliberadamente mediante un gate de RAF de prueba: aviso pintado, estado ocupado, doble inicio rechazado; liberación/foco. Fallo real de `getContext` inyectado una vez: error recuperable, cierre y reintento exitoso, sin excepción no manejada. El fallo controlado sí emite su diagnóstico en consola, como corresponde. Mando que desaparece entre validación inicial y preparación: la revalidación devuelve al lobby con motivo/foco, sin enfocar un lienzo oculto ni dejar el diálogo ocupado.
- Vista individual: más del 95 % del ancho de ventana en 1366 y 2560, sin scroll horizontal/vertical en escritorio/móvil horizontal/vertical. Esto verifica distribución, no comodidad humana en teléfono vertical.
- `browser-paddock`: cinco tamaños, correr y elegir coche en primer viewport de escritorio, menú sin desbordes, foco/ARIA/local y selección conservada.
- `browser-local`: 2–4 teclados simultáneos, coches/cámaras/telemetría, pausa/reinicio/resultados/siguiente, fullscreen/cinco tamaños, cuatro mandos emulados, desconexión/reconexión y asignación exclusiva. Hardware físico pendiente.
- `browser-audio-mix`: Web Audio real, buses independientes, silencio, controles guardados, ausencia de autoplay, foco/pausa/fullscreen y cuatro motores sin clipping muestreado. No se escucha ni aprueba el timbre humano.
- `browser-release`: archivos reales bajo `/f1/`, caché antigua/versiones, configuración/cuenta regresiva/teclado/pausa/reinicio/menú; HTML real 0.70/0.71 con dependencias faltantes y fallo individual de ambos módulos. No acredita Pages público.
- Revisión de capturas actuales: paddock, preparación y carrera ancha. Mantiene lima/cian, coches sin deformación y HUD fuera del circuito.

El tramo entre `const AI_DRIVERS=` y `function getTrackPath` es idéntico al archivo real 0.72, SHA256 `8a12835edbed7e53283b2e1a49bedc61405a8986a39d2a4ff00b7ae338db6c86`. `driving-core.js`, `track-core.js` y `engine-audio.js` no se modifican. Esta entrega no vuelve a contar como propias las vueltas emparejadas de 0.72; sus pruebas nuevas se centran en eventos y UI.

## Fallos encontrados durante la implementación

Un selector adicional de formato desplazaba el garaje fuera del primer viewport; se eliminó esa selección redundante y las fichas controlan el valor canónico. La configuración plegable conserva la selección directa y el acceso por teclado.

Se detectó además que `start` puede rechazar un mando perdido entre validación y preparación: ahora se respeta ese retorno y se vuelve a la parrilla, con prueba nativa de la desconexión durante el gate de RAF.

Los probes de navegador que intervenían inmediatamente después del click de inicio ahora esperan preparación terminada. Un primer ajuste esperó también en la prueba de mando duplicado, donde correctamente no se inicia: se corrigió esa espera, manteniendo el rechazo original.

La comprobación RMS de mezcla falló una vez en la ejecución concurrente; un diagnóstico posterior pasó con relación ~2,13. Se añadió una condición explícita de marcha/carga estabilizadas antes de medir, conservando los mismos límites de relación de ganancia y silencio. La versión final de esa prueba pasó; no se retocó el motor para aprobarla. Esto no sustituye medir rendimiento de hardware o escuchar el motor.

## Pendiente y siguientes pasos

Online y 3D no están implementados. Permanecen 1–3 CPU y las reglas de conducción actuales. Más rivales competitivos está en 39; variantes arcade/temporadas configurables en 40; configuración persistente/remapeo/carga/rendimiento en 41, junto con gráficos 36/37 y audio 26.

La preparación todavía bloquea el hilo principal durante la generación: el aviso es feedback, no prueba de que el trabajo sea asíncrono. Sin tiempos medidos de dispositivo ni FPS garantizados. Móvil vertical/táctil, aceptación humana, mandos físicos y Pages público pendientes.

Siguiente bloque técnico recomendado: 30.3 contactos/progreso/reloj/eventos compartidos y 30.4 carrera completa aislada; después salas/sincronización de 32/33. No se presentan los menús ni las puntuaciones locales como online seguro.
