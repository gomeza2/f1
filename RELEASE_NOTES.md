# PIXEL GRAND PRIX — entrega 0.46

## Qué incluye esta base

14 circuitos, cuatro modelos/seis pinturas, 1–3 rivales con estilos/nombres propios, dos jugadores local, campeonato y tablas de puntos. HUD exterior, cámara cercana/overview/dividida, pistas abiertas por defecto según circuito, superficies, derrape, récords versionados, audio sintetizado y bandera de llegada.

Las últimas correcciones arreglan pausa/reanudación rápida, teclas retenidas, pausa al ocultar pestaña y redondeo de tiempos al minuto. La CPU establece antes el carril reservado ante una convergencia cercana. Los recursos web llevan la misma versión que el HTML para reducir mezclas por caché.

## Night Run largo en 0.46

Night Run pasa de 3.813 a 10.681 unidades con una silueta propia, chicana, gancho y regreso técnico. Ancho útil 68–108, pianos por sector, mundo 2650×1696 y perfil automático de barreras en curvas. Los otros trece trazados, modelos, física 5 y audio permanecen iguales. Referencia Normal libre a 60 Hz: primeras vueltas 59,80/58,67 s. No se ralentiza el coche para conseguir duración.

Dieciséis checkpoints ordenados (intervalos ~628), sin el límite global anterior de nueve. Posiciones de las otras trece pistas conservadas. Récord nuevo `NIGHT RUN@3:p5:r1`, versiones anteriores preservadas. Snapshot 0.45 y test específico verifican geometría con anchura real/forma diferenciada y conservación de las otras trece pistas. La evaluación humana del ritmo y el rendimiento en móviles siguen pendientes.

## Soltar/frenar y motor de crucero en 0.45

Volante/aceleración conservados; fuerza lateral cae gradualmente sobre el 58 % de máxima, hasta un 16 % adicional. Retención de 30 unidades/s al soltar; eliminado el pequeño frenado automático según la curva próxima. Mismas reglas de humanos y CPU, con plan de velocidad recalculado. Récords `:p5` conservan anteriores `:p4` y `:r1`. Comparación de dos alternativas en `tests/experiments/LIFT_045.md`; se descarta la de 24 % por excesiva penalización a gas continuo.

Motor sostenido más grave y filtrado, con menos armónicos y brillo al máximo. Sin siseo de derrape en recta por un indicador de drift sin giro. Cuatro renderizados sostenidos de seis segundos: sexta estable, salida audible, sin recorte muestreado y menor energía aguda que 0.44. Calidad percibida pendiente de escucha humana. Sin nuevas longitudes ni modificación de perfiles de carretera.

## Secciones de pista en 0.44

Sunset, Neon y Dusty estrenan anchos graduales (72–124/72–112/72–108 unidades totales), con sectores de pianos y sin pianos en las dos asfaltadas. Dusty conserva tierra. La sección común conecta render, física de terreno, barreras/neumáticos, CPU, checkpoints/meta, carteles, recuperación, exclusión de decoraciones, menú y minimapa. Superficie precalculada en caché; no se reconstruye por frame.

Récords de esas tres pistas separados con `:r1`; anteriores preservados. Sin cambios a longitudes, potencia o física 4. Primera parte de fase 27: quedan once pistas sin perfiles variables, más rediseños y recorridos largos de unos 60 s. Pianos asimétricos y barreras personalizadas por sector siguen pendientes. No se declara terminada la variedad completa ni aprobado el balance humano.

## Motor sustituido en 0.43

Nueva síntesis propia en `engine-audio.js`: pulsos de combustión limitados en armónicos, cuerpo grave, filtro/carga del acelerador y seis marchas con histéresis y caída de régimen. Cuatro perfiles de motor. No cambia física, récords `:p4`, trazados ni controles. Se conservan capas de terreno/derrape, señales de carrera, mezcla de dos humanos y silencio en pausa/OFF/menú. Un contexto reutilizado; no se crean osciladores por frame.

Pruebas de cambios/revoluciones/carga, grafo y ciclo de vida; medición real de salida en Chromium. Esto no confirma que el timbre guste: pendiente escucha humana. Fase 26 tiene una primera revisión; ambientes temáticos y controles separados de volumen quedan abiertos. Siguiente implementación: fase 27, anchuras/pianos/barreras por sector y ritmos distintos de pista.

## Fluidez y contacto en 0.42

Respuesta de volante/acelerador más fluida, con capacidad de frenar y cerrar curvas. Comparadas dos alternativas frente a 0.41; la más permisiva se descartó. La CPU mantiene roces leves y anticipa impactos fuertes. Se corrige un gate que podía provocar una vuelta extra al coche parcialmente dentro de la franja; meta y checkpoints usan intersección real/huella del coche. Cuenta atrás en segundos reales incluso con pocos frames.

Física `:p4`, con récords anteriores conservados. No se sube la velocidad máxima ni se borran las colisiones. La sensación de manejo necesita evaluación humana. Plan abierto: `ROADMAP_EVOLUCION.md`; quedan visibles motor nuevo, anchos/duraciones variados, 3–4 humanos, modos/progresión y arquitectura online. El límite de dos humanos sigue vigente; el motor se reemplaza en 0.43.

## Grava y terrenos en 0.41

Escapatorias exteriores en curvas seleccionadas de ocho circuitos pavimentados, seguidas por pasto/terreno nativo. Grava con resistencia, agarre, textura, polvo y huellas propios; el material visible alimenta la física de humanos y CPU. No invade otro ramal y desaparece donde hay valla activa. Vallas completas desactiva las trampas; abierto/parciales/automático mantienen lo permitido por su perfil.

Recuperación con acelerador comprobada. Registro de física `:p3`, conservando los anteriores. No cambia la aceleración progresiva de 0.40, el motor actual ni el límite de dos humanos. La prioridad siguiente es el motor nuevo; la evolución posterior se guía por el plan abierto.

## Conducción revisada en 0.40

Aceleración progresiva y giro limitado por fuerza lateral. Frenar permite cerrar más la trayectoria. CPU y humanos comparten el cambio; máximas, trazados y tamaño del coche no se alteran. Récords con sufijo `:p2`, conservando los anteriores. La sensación de conducción aún necesita aprobación humana.

El antiguo plan de cinco bloques se reemplaza por `ROADMAP_EVOLUCION.md`, sin límite artificial de fases. La estimación anterior de una sola entrega pendiente queda reemplazada. Grava implementada/comprobada en 0.41; motor nuevo implementado en 0.43; 3–4 humanos todavía pendientes.

## Sunset ampliado en 0.39

Nuevo recorrido con recta larga, curva exterior, sector interior y regreso técnico. Longitud +76,5 %, nueve checkpoints y perfil abierto. Se conservan tamaño/velocidad del coche y los otros 13 trazados. Los récords @2 se conservan y el recorrido nuevo usa @3. Normal libre mide 34,86 s por vuelta de CPU; el objetivo humano de 25–45 s sigue pendiente de calibración.

## Evidencia

- 0.46: 96 carreras simuladas/490 vueltas válidas: 42 clásicas, 20 parrilla, 14 tráfico y 20 pruebas de dos vueltas por perfil. Night Normal libre promedia 58,93 s; su parrilla completa sin contactos en esta referencia. Los otros trece tiempos/trazados permanecen como en 0.45.
- Geometría con ancho real, 18.313 sondas físicas y 18.090 comprobaciones de píxeles en cuatro pistas/cinco perfiles; 37 contornos cerrados/13.183 sondas de vallas y 70 configuraciones de grava, con 43.896 puntos independientes del mundo. Chromium completa tres vueltas Night (59,60/58,60/58,60), prueba cámaras separadas de dos jugadores, recorrido general y entrega local bajo `/f1/`. Capturas de Night abierta/vallada/cercana y duo revisadas. No confirma diversión humana ni despliegue de Pages.
- La ampliación excedía el límite de decoración: corregida con presupuesto 150/110/80 por calidad, selección distribuida y caché, con 1.213 colocaciones comprobadas entre las tres calidades y manteniendo huella/espaciado. Rendimiento en teléfonos físicos sigue pendiente.

- 0.45: 91 carreras/480 vueltas válidas conservadas en los registros de esta revisión: 42 clásicas, 20 parrilla, 14 tráfico y 15 pruebas de dos vueltas por perfil. El test final de frenado esperaba aún retención 20; corregida a 30 y repetida la comprobación focalizada. Audio sostenido de cuatro modelos, grafo/ciclo de vida, gas/retención/freno, colisiones, pausa, gates, integración y Chromium/entrega local comprobados. La prueba humana de sensación/timbre permanece abierta.

- 0.44: 91 carreras simuladas y 480 vueltas válidas: 42 clásicas (14 pistas × 3 dificultades), 20 de parrilla, 14 de tráfico y 15 de dos vueltas con los cinco perfiles en las tres pistas revisadas. CPU libre Normal: Sunset 36,66 s, Neon 22,67 s y Dusty 21,11 s. El tamaño del recorrido no cambia en esta entrega.
- 0.44: 10.004 sondas físicas de bordes variables, 9.845 sondas de píxeles reales de Canvas, 70 configuraciones de material/escapatorias y 947 decoraciones comprobadas. Geometría, gates, manejo, colisiones, pausa/reinicio y audio: pruebas automatizadas. Chromium completo, audio real y entrega sin instrumentación bajo `/f1/`: superados. Capturas abiertas/valladas y vistas cercanas revisadas. No sustituye jugar ni escuchar humanamente.

- 0.43: sintaxis/integración, audio (régimen, marchas, carga y ciclo de vida), manejo, checkpoints, pausa/reinicio, Chromium completo, audio real y entrega bajo `/f1/` superados. RMS muestreado 0 en pausa/OFF/menú; pico de motor 0,114 en la muestra observada, sin recorte en esa muestra. No es un análisis de todos los estados ni escucha humana.

- 0.42: se repiten 42 carreras clásicas, 20 de parrilla y 14 de tráfico; 450 vueltas válidas con física 4 y gates por contacto. La conducción humana no se sustituye por estas simulaciones.
- 0.38: integración, pruebas focalizadas y Chromium completo/audio real. Entrega probada con archivos originales bajo `/f1/`, sin instrumentar el juego. La apertura directa del archivo no pudo comprobarse: Chromium administrado bloquea la navegación `file:`.
- Fuente de verdad: versión visible en el pie, commit de `main` y último registro de `ROADMAP_24_FASES.md`.

## Publicación

Archivos estáticos en raíz, sin instalación ni compilación. Para Pages: rama `main`, carpeta `/`. Conservar juntos `index.html`, `style.css`, `engine-audio.js` y `script.js`. Al cambiar la versión, actualizar metadato, consultas de todos los recursos y pie; la validación de integración detecta discrepancias.

La carga pública de Pages no se pudo verificar desde esta sesión: el proxy bloqueó la conexión a `gomeza2.github.io` con 403. Una subida a `main` no demuestra por sí sola que Pages terminó su despliegue. Las URLs versionadas tampoco fuerzan renovar un HTML todavía en caché.

## Pendientes conocidos

- Física 5: tráfico de dos coches sin contactos en las 14 referencias. Esto no garantiza carreras sin contactos contra personas.
- Parrilla 0.45: todos terminan, con contactos en varias referencias. El máximo es Sunset Normal, 19 pasos a 30 Hz (0,63 s acumulados en tres vueltas); no son 19 golpes separados. En 0.44 el máximo era Dusty Difícil con 24 pasos. Queda revisar el contacto y equilibrio contra personas; una comparación agregada no prueba mejora en todas las situaciones.
- Duración y trazados: se busca variedad aproximada de 20/40/60 s, sin ventana obligatoria. Anchos variables presentes en cuatro pistas; diez restantes y más rediseños pendientes. Night aporta una referencia cercana a 60 s.
- Faltan calibración humana, pruebas en dispositivos físicos, controles táctiles y medición de rendimiento. Los videos adjuntos superaban el límite de transferencia y no pudieron verse.
- Contrarreloj, desafíos, editor y progresión ampliada siguen pendientes. Esta entrega no equivale a terminar las 24 fases ni a declarar una versión estable definitiva.
