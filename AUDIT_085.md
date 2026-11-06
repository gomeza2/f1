# Auditoría 0.85 — entrada de volante graduable

Base real main `59d323c8e8b34f53c52792b715064e0ab4f6341b`, build 0.84, limpio y remoto coincidente; rama `work/fine-steering-085`. Revisados controlador humano, conducción/sesión/geometría, práctica, HTML/CSS, teclado/mandos/táctil, contrato online, historial/roadmap y pruebas. Se aplica la guía del entorno para acceso/red sin eludir el proxy.

## Oportunidades confirmadas

1. Teclado solo pedía giro 0/±1; el motor y los mandos ya admiten valores intermedios. Se añade un modificador deliberado de medio volante, sin cambiar fuerzas ni rebajar la dificultad por software.
2. Ambas teclas Shift comparten `event.key`, pero tienen códigos físicos distintos. Se registran y liberan de forma independiente para no acoplar P1/P2; O/B sirven a P3/P4.
3. El táctil también era binario y mantenía la acción original al deslizar. Se introduce graduación opcional por posición horizontal bajo captura, manteniendo pedales/multitouch y Clásica como predeterminado.
4. Guardado táctil previo no tiene el campo nuevo. La lectura conserva tamaño/disposición/activación válidos y asigna Clásica; valores inválidos no activan graduación. No se borra la clave existente.
5. Una mejora del núcleo lateral exige tráfico/planificación y actualización coordinada del servidor. Se aprovecha aquí la API analógica compartida, sin introducir otra física ni reactivar el ensayo rechazado de 0.63.

## Resultado y límites

Control fino de 1–4 humanos, táctil graduable con porcentaje en flecha y envío analógico comprobado contra el servidor real local. La práctica 0.84 permite comparar estas entradas. No se anuncia nueva física ni tacto humano aprobado. Se mantienen p6/b1/s1, trazados, cuatro modelos, CPU, audio/gráficos, récords, campeonato, contrarreloj/fantasma y online.

Evidencia y regresiones: `tests/experiments/FINE_STEERING_085.md`. Sin despliegue ni verificación de Pages/Render públicos en esta entrega. Próxima propuesta: Champion Road (fase 27), luego alternar con audio/iluminación, manteniendo el manejo abierto a pruebas humanas.
