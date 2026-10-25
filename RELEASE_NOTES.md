# PIXEL GRAND PRIX — entrega 0.42

## Qué incluye esta base

14 circuitos, cuatro modelos/seis pinturas, 1–3 rivales con estilos/nombres propios, dos jugadores local, campeonato y tablas de puntos. HUD exterior, cámara cercana/overview/dividida, pistas abiertas por defecto según circuito, superficies, derrape, récords versionados, audio sintetizado y bandera de llegada.

Las últimas correcciones arreglan pausa/reanudación rápida, teclas retenidas, pausa al ocultar pestaña y redondeo de tiempos al minuto. La CPU establece antes el carril reservado ante una convergencia cercana. Los recursos web llevan la misma versión que el HTML para reducir mezclas por caché.

## Fluidez y contacto en 0.42

Respuesta de volante/acelerador más fluida, con capacidad de frenar y cerrar curvas. Comparadas dos alternativas frente a 0.41; la más permisiva se descartó. La CPU mantiene roces leves y anticipa impactos fuertes. Se corrige un gate que podía provocar una vuelta extra al coche parcialmente dentro de la franja; meta y checkpoints usan intersección real/huella del coche. Cuenta atrás en segundos reales incluso con pocos frames.

Física `:p4`, con récords anteriores conservados. No se sube la velocidad máxima ni se borran las colisiones. La sensación de manejo necesita evaluación humana. Plan abierto: `ROADMAP_EVOLUCION.md`; quedan visibles motor nuevo, anchos/duraciones variados, 3–4 humanos, modos/progresión y arquitectura online. El motor actual y el límite de dos humanos no cambian en esta entrega.

## Grava y terrenos en 0.41

Escapatorias exteriores en curvas seleccionadas de ocho circuitos pavimentados, seguidas por pasto/terreno nativo. Grava con resistencia, agarre, textura, polvo y huellas propios; el material visible alimenta la física de humanos y CPU. No invade otro ramal y desaparece donde hay valla activa. Vallas completas desactiva las trampas; abierto/parciales/automático mantienen lo permitido por su perfil.

Recuperación con acelerador comprobada. Registro de física `:p3`, conservando los anteriores. No cambia la aceleración progresiva de 0.40, el motor actual ni el límite de dos humanos. La prioridad siguiente es el motor nuevo; la evolución posterior se guía por el plan abierto.

## Conducción revisada en 0.40

Aceleración progresiva y giro limitado por fuerza lateral. Frenar permite cerrar más la trayectoria. CPU y humanos comparten el cambio; máximas, trazados y tamaño del coche no se alteran. Récords con sufijo `:p2`, conservando los anteriores. La sensación de conducción aún necesita aprobación humana.

El antiguo plan de cinco bloques se reemplaza por `ROADMAP_EVOLUCION.md`, sin límite artificial de fases. La estimación anterior de una sola entrega pendiente queda reemplazada. Grava implementada/comprobada en 0.41; sonido nuevo y 3–4 humanos todavía no están implementados.

## Sunset ampliado en 0.39

Nuevo recorrido con recta larga, curva exterior, sector interior y regreso técnico. Longitud +76,5 %, nueve checkpoints y perfil abierto. Se conservan tamaño/velocidad del coche y los otros 13 trazados. Los récords @2 se conservan y el recorrido nuevo usa @3. Normal libre mide 34,86 s por vuelta de CPU; el objetivo humano de 25–45 s sigue pendiente de calibración.

## Evidencia

- 0.42: se repiten 42 carreras clásicas, 20 de parrilla y 14 de tráfico; 450 vueltas válidas con física 4 y gates por contacto. La conducción humana no se sustituye por estas simulaciones.
- 0.38: integración, pruebas focalizadas y Chromium completo/audio real. Entrega probada con archivos originales bajo `/f1/`, sin instrumentar el juego. La apertura directa del archivo no pudo comprobarse: Chromium administrado bloquea la navegación `file:`.
- Fuente de verdad: versión visible en el pie, commit de `main` y último registro de `ROADMAP_24_FASES.md`.

## Publicación

Archivos estáticos en raíz, sin instalación ni compilación. Para Pages: rama `main`, carpeta `/`. Conservar juntos `index.html`, `style.css` y `script.js`. Al cambiar la versión, actualizar metadato, consultas de ambos recursos y pie; la validación de integración detecta discrepancias.

La carga pública de Pages no se pudo verificar desde esta sesión: el proxy bloqueó la conexión a `gomeza2.github.io` con 403. Una subida a `main` no demuestra por sí sola que Pages terminó su despliegue. Las URLs versionadas tampoco fuerzan renovar un HTML todavía en caché.

## Pendientes conocidos

- Física 4: tráfico de dos coches sin contactos en las 14 referencias. Esto no garantiza carreras sin contactos contra personas.
- Física 4: parrilla registra roces en Dusty/Jungle/Coastline/Industrial Normal, Dusty Fácil y Sunset/Dusty Difícil. Se conserva contacto físico; siguen pendientes incidentes prolongados y evaluación humana.
- Duración y trazados: se busca variedad aproximada de 20/40/60 s, sin ventana obligatoria. Anchos variables y más rediseños siguen pendientes.
- Faltan calibración humana, pruebas en dispositivos físicos, controles táctiles y medición de rendimiento. Los videos adjuntos superaban el límite de transferencia y no pudieron verse.
- Contrarreloj, desafíos, editor y progresión ampliada siguen pendientes. Esta entrega no equivale a terminar las 24 fases ni a declarar una versión estable definitiva.
