# PIXEL GRAND PRIX — entrega 0.40

## Qué incluye esta base

14 circuitos, cuatro modelos/seis pinturas, 1–3 rivales con estilos/nombres propios, dos jugadores local, campeonato y tablas de puntos. HUD exterior, cámara cercana/overview/dividida, pistas abiertas por defecto según circuito, superficies, derrape, récords versionados, audio sintetizado y bandera de llegada.

Las últimas correcciones arreglan pausa/reanudación rápida, teclas retenidas, pausa al ocultar pestaña y redondeo de tiempos al minuto. La CPU establece antes el carril reservado ante una convergencia cercana. Los recursos web llevan la misma versión que el HTML para reducir mezclas por caché.

## Conducción revisada en 0.40

Aceleración progresiva y giro limitado por fuerza lateral. Frenar permite cerrar más la trayectoria. CPU y humanos comparten el cambio; máximas, trazados y tamaño del coche no se alteran. Récords con sufijo `:p2`, conservando los anteriores. La sensación de conducción aún necesita aprobación humana.

Plan vigente de cinco bloques: conducción, grava/pasto/barreras, motor nuevo, modo local de 2–4 humanos y revisión final. La estimación anterior de una sola entrega pendiente queda reemplazada. Grava, sonido nuevo y 3–4 humanos todavía no están implementados.

## Sunset ampliado en 0.39

Nuevo recorrido con recta larga, curva exterior, sector interior y regreso técnico. Longitud +76,5 %, nueve checkpoints y perfil abierto. Se conservan tamaño/velocidad del coche y los otros 13 trazados. Los récords @2 se conservan y el recorrido nuevo usa @3. Normal libre mide 34,86 s por vuelta de CPU; el objetivo humano de 25–45 s sigue pendiente de calibración.

## Evidencia

- 0.40: se repiten 42 carreras clásicas, 20 de parrilla y 14 de tráfico; 450 vueltas válidas con la física 2. La conducción humana no se sustituye por estas simulaciones.
- 0.38: integración, pruebas focalizadas y Chromium completo/audio real. Entrega probada con archivos originales bajo `/f1/`, sin instrumentar el juego. La apertura directa del archivo no pudo comprobarse: Chromium administrado bloquea la navegación `file:`.
- Fuente de verdad: versión visible en el pie, commit de `main` y último registro de `ROADMAP_24_FASES.md`.

## Publicación

Archivos estáticos en raíz, sin instalación ni compilación. Para Pages: rama `main`, carpeta `/`. Conservar juntos `index.html`, `style.css` y `script.js`. Al cambiar la versión, actualizar metadato, consultas de ambos recursos y pie; la validación de integración detecta discrepancias.

La carga pública de Pages no se pudo verificar desde esta sesión: el proxy bloqueó la conexión a `gomeza2.github.io` con 403. Una subida a `main` no demuestra por sí sola que Pages terminó su despliegue. Las URLs versionadas tampoco fuerzan renovar un HTML todavía en caché.

## Pendientes conocidos

- Física 2: tráfico de dos coches sin contactos en las 14 referencias. Esto no garantiza carreras sin contactos contra personas.
- Física 2: parrilla Normal registra 18 frames con contacto (Sunset 3, Dusty 5, Volcano 5, Champion 1 y Meadow 4); Fácil añade uno en Sunset. Son casos pendientes de mejorar.
- El objetivo humano de vueltas de 25–45 segundos necesita validación con el nuevo Sunset; los otros trazados no se ampliaron en esta entrega. La próxima entrega se centra en la revisión final de jugabilidad/correcciones.
- Faltan calibración humana, pruebas en dispositivos físicos, controles táctiles y medición de rendimiento. Los videos adjuntos superaban el límite de transferencia y no pudieron verse.
- Contrarreloj, desafíos, editor y progresión ampliada siguen pendientes. Esta entrega no equivale a terminar las 24 fases ni a declarar una versión estable definitiva.
