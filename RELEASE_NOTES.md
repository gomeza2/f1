# PIXEL GRAND PRIX — entrega 0.55

## Qué incluye esta base

14 circuitos, cuatro modelos/seis pinturas, 1–3 rivales con estilos/nombres propios, 2–4 jugadores local, campeonato y tablas de puntos. HUD exterior, cámara cercana/overview/dividida, pistas abiertas por defecto según circuito, superficies, derrape, récords versionados, audio sintetizado y bandera de llegada.

Las últimas correcciones arreglan pausa/reanudación rápida, teclas retenidas, pausa al ocultar pestaña y redondeo de tiempos al minuto. La CPU establece antes el carril reservado ante una convergencia cercana. Los recursos web llevan la misma versión que el HTML para reducir mezclas por caché.

## Mezcla de audio en 0.55

Tres volúmenes independientes (general/motores/efectos), persistencia local y restauración. Panel nativo accesible desde la cabecera, compacto en móvil; apertura en carrera pausa, Escape/cierre conservan pausa y SEGUIR reanuda manualmente. No reproduce audio al ajustar desde el menú ni anula SONIDO OFF. Los valores iniciales 80/70/85 reducen la presencia del motor respecto de los avisos.

Salidas separadas para motor/cuerpo y efectos/terreno/señales, con rampas suaves y un contexto reutilizado hasta cuatro humanos. Datos corruptos/bloqueo de almacenamiento no impiden correr. Timbre, física 5, CPU 0.54, catorce pistas y récords conservados. La escucha del motor y aceptación de manejo permanecen abiertas; esto entrega control de mezcla, no aprobación auditiva. Evidencia en `tests/experiments/MIX_055.md`.

## Disputas en grupos en 0.54

La trazada prioriza un coche solapado lateralmente frente a otro más cercano por delante, conservando el frenado frente a todos. Con rivales en ambos flancos se intersectan sus reservas y la anchura disponible; sin espacio común se mantiene la línea ocupada y se cede espacio longitudinal mediante frenado compartido. No cambia la física humana, potencia, pistas, récords, audio ni local.

Sunset Normal pasa de 13 a un paso de simulación con contacto, sin salir del corredor legal, en la referencia de cuatro controladores/tres vueltas a 30 Hz. La referencia a 60 Hz conserva seis pasos con contacto y sus tiempos. Se comparan retenciones del rival por distancia, prioridad sola, reservas generales y reservas entre flancos opuestos; se descartan las que introducen una regresión Night o dejan un cierre de línea reproducible. Es una mejora acotada de grupos, no garantía de contacto cero ni equilibrio humano. Evidencia en `tests/experiments/GROUPS_054.md`.

## Pixel City en 0.53

Nuevo recorrido de 4.368 unidades (+28,7 %), avenidas, desvío interior técnico y regreso enlazado; ancho útil 76–112, pianos por sector, seis checkpoints, mundo 1600×1024. Asfalto y perfil parcial automático conservados; cinco opciones de barreras. Referencia Normal libre 25,47/24,42 s, frente a 23,02/22,08 anteriores. Se elige un circuito corto propio en lugar de alargar todos hacia un minuto.

La separación de siluetas normalizada pasa de 0,092 (Thunder) a 0,239 (Jungle); margen de carretera 51,8 y separación de ramales 59,7. Esta medida detecta copias geométricas, no demuestra diversión. Récord @3:p5:r1 separado de @2. Otros trece trazados/modelos/física/CPU/audio/local preservados; siete pistas variables y siete uniformes. Condiciones y pruebas en `tests/experiments/PIXEL_053.md`. Falta evaluación humana y verificación del sitio público.

## Frostbite GP en 0.52

Trazado asimétrico con arco oriental rápido y regreso técnico, 6.369 unidades (+86 %), ancho 68–112, nueve checkpoints y mundo 2200×1408. La silueta antigua estaba a 0,060 de Thunder; la nueva queda a 0,258 de la más próxima (Volcano). Se descartan propuestas similares a Night y un cierre con bordes superpuestos. Geometría elegida: margen 86,1 y separación de ramales 57,4.

Carretera de hielo con paleta/rasguños propios y marcas azuladas desde el material compartido, sin pianos de asfalto. Agarre/resistencia del hielo intactos. Primeras vueltas Normal libres 36,93/35,85 s frente a 27,17/26,17 anteriores. Perfil automático en curvas y alternativas existentes. Récord `FROSTBITE GP@3:p5:r1` conserva @2.

Los otros trece trazados, física 5, prestaciones, CPU 0.51, audio y local 2–4 se conservan. Quedan seis pistas con sección variable y ocho uniformes. Carrera y aspecto comprobados automáticamente/en Chromium; diversión, control humano y equilibrio pendientes. Condiciones en `tests/experiments/FROST_052.md`.

## Anticipación del borde en 0.51

La CPU proyecta velocidad/yaw a 0,25 y 0,5 s durante una disputa y pide menor velocidad cuando prevé empeorar su margen hasta salir de la franja legal. Usa aceleración/frenado de la física común; sin recolocación, fuerza extra ni intervención en el coche humano. Respeta pista libre, baja velocidad y recuperación hacia dentro. Proyección compartida con contactos.

Night Normal: 32 → 0 pasos-coche fuera y 2 → 0 pasos con contacto; Meadow 7 → 0 contactos; Industrial 12 → 0, todos en referencias de cuatro coches/tres vueltas. Chromium confirma estas tres carreras, el plazo de llegada y ausencia de errores de JavaScript. Dusty Fácil y Volcano mantienen el avance previo. Comparadas tres anticipaciones y cambios de separación/activación; se elige 0,5 s sin cambiar el volante/reservas. Sunset Normal tiene 13 pasos con contacto frente a uno anterior: pendiente explícito.

No es una predicción exhaustiva de todos los controles futuros ni aprobación humana del manejo. Física 5, modelos, dificultad, 14 trazados, audio, récords y local 2–4 se conservan. Evidencia y condiciones en `tests/experiments/BOUNDARY_051.md`.

## Velocidad de disputa en 0.50

La CPU considera el radio menor de una línea interior ocupada, conservando signo de curvatura, previsión de frenado y física compartida. Sin bonus por línea exterior, potencia extra ni cambios a dificultades/coche humano. La consulta sin tráfico mantiene la referencia anterior. Modelo aproximado de carril paralelo; no es una trazada ideal global ni predicción completa de una transición lateral.

Dusty Fácil pasa de 28 a 3 pasos con contacto a 30 Hz en una parrilla de cuatro/tres vueltas; todos terminan. El piloto antes trabado pasa de 25,60 a 23,41 s de media. Se conservan los contactos arcade y queda evaluación humana. El modo local 2–4, motor, 14 trazados y récords física 5 no cambian.

## Parrilla local en 0.49

Previa de 2–4 humanos con pista/barreras/gráficos compartidos y coche/pintura/control individual. P1 usa el garaje; P2, P3 y P4 tienen sus propias elecciones. Teclado con cuatro conjuntos separados y mandos estándar con aceleración/freno/dirección analógicos, zona muerta y asignación exclusiva. Un mando ausente impide largar; desconectarlo pausa la carrera y exige reanudar manualmente tras reconectar.

Cámara por persona, pantalla dividida adaptable al ancho de ventana sin estirar el render, HUD exterior por piloto y minimapa con todos sus campos de visión. Tres humanos aprovechan el cuarto cuadrante para posiciones. Resultados, puntos, reinicio y siguiente etapa incluyen hasta cuatro identidades humanas. Audio reutiliza un solo contexto y hasta cuatro canales de motor; los que dejan de usarse se silencian. Física 5, CPU 0.48, 14 recorridos y récords conservados.

Pruebas específicas Node/Chromium de entradas, controles analógicos y ciclo de vida. Los mandos de las pruebas se emulan: falta hardware real, comodidad/teclas simultáneas, conducción humana completa y rendimiento sostenido con cuatro vistas. Sin remapeo libre ni táctil. Se adelanta fase 29 por pedido; fases 27/28 y aceptación de manejo/audio permanecen abiertas. Push y despliegue Pages se verifican por separado.

## Ritmo CPU en 0.48

Curvatura geométrica más continua para planificar velocidad, con los mismos límites físicos. En seis referencias Normal de dos vueltas mejora 3–10,2 % frente a 0.47 sin salidas del corredor. Neon 22,975 → 21,583 s y Frostbite 29,683 → 26,667. Usa más freno de mano en varios casos y paga su coste; no se añade potencia. Se conservan física 5, coche humano, pistas, audio y récords.

La consulta de frenado deja de barrer todo el plan: búsqueda por progreso y próximos 240 de recorrido. 2.448 equivalencias, incluida la meta, y Night con 31 lecturas frente a 891 entradas. Condiciones en `tests/experiments/AI_CURVATURE_048.md`. Tráfico/adelantamientos y equilibrio humano siguen pendientes; fase 28 en revisión, no cerrada.

## Volcano Ring en 0.47

Nuevo trazado diagonal con horquilla interior y regreso enlazado, 4.961 unidades, ancho útil 68–112 y siete gates. Primeras vueltas Normal libre a 60 Hz: 29,45/28,37 s. Mantiene el agarre y suelo volcánico; apariencia/grano del corredor desde el material compartido, sin pianos de asfalto. Preserva los otros trece trazados, física/audio 0.45 y opciones de barreras. Récord @3:p5:r1 conserva @2.

Se rechazó una primera variante por superposición de bordes cerca de meta. Final: margen 49,3 y separación 69,5. Comparación de doce imágenes reales demuestra que la extracción del estilo no cambia los cuatro corredores previos. Doce carreras focalizadas/54 vueltas válidas, cuatro coches y tres dificultades; no es validación de todas las combinaciones ni aprobación humana. Fase 27 abierta; siguiente prioridad CPU, fase 28.

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

- 0.52: doce carreras Frost/54 vueltas y doce Volcano/54 vueltas; cinco comparaciones de CPU en recorridos intactos/diez vueltas. Batería principal Node: **118 vueltas válidas**. Las 42 carreras libres y toda la matriz de 20 parrillas no se repiten: el cambio de recorrido tiene prueba focalizada y los otros trece se conservan por hash. Especificaciones físicas/modelos/dificultades intactas; CPU focalizada, colisiones, menú, gates e integración de 70 configuraciones superados.
- Geometría de catorce pistas y seis perfiles variables: 27.280 sondas de borde. Frost: dos contornos cerrados/1.366 sondas de barrera y 340 objetos de escenario entre tres calidades, con presupuesto 150/110/80 y distribución por el mundo. Regresión local ampliada a 18 parrillas de 2/3/4 humanos, incluida Frost.
- Chromium completo/local 2–4/entrega `/f1/` superados. Frost: 6.944 sondas de píxeles en cinco barreras/tres calidades y tres vueltas 36,87/35,80/35,73; Night y cámaras divididas también comprobadas. Capturas hielo abierto/vallado/cercano/ligero revisadas. Quince imágenes de los cinco corredores anteriores son idénticas frente a 0.51; esto no declara igual el Frost que se rediseñó ni sustituye prueba humana.

- 0.51: batería Node de 20 parrillas/240 vueltas, 14 carreras de tráfico/84, seis referencias libres/doce, tres regresiones de borde/36 y dos de carril/24: **396 vueltas válidas**. CPU focalizada (movimiento/frenado/recuperación), planner, colisiones, integración 70 perfiles, local 2–4 y 7.344 consultas superados. No se repiten las 42 carreras libres de tres dificultades, porque el cambio no interviene en pista libre; las seis comparaciones conservan la referencia anterior.
- Chromium completo, local 2–4/cinco resoluciones y entrega `/f1/` superados. Prueba nueva de Night/Meadow/Industrial: 36 vueltas adicionales con los cuatro controladores y resultado coincidente, cierre dentro de los 18 s y sin errores de JavaScript. Captura instrumental de Night revisada. No se equipara a prueba humana o de mandos físicos.

- Batería principal 0.50: 42 carreras libres/126 vueltas (14 pistas × tres dificultades), 20 parrillas/240 vueltas y 14 carreras de tráfico/84 vueltas; más dos regresiones focalizadas/24 vueltas. Integración de 70 perfiles, consultas, conciencia de rivales y Node local superados. Chromium completo, local 2–4 en cinco resoluciones y entrega sin instrumentación bajo `/f1/` superados; sin errores de JavaScript en esos recorridos. No se cuentan las variantes descartadas como validación de la versión elegida.
- 0.50: regresión específica Dusty Fácil/Volcano Normal con cuatro coches/tres vueltas, contactos 28 → 3 y 4 → 0 respectivamente. Radio analítico, simetría, recta, meta y conservación de modelos/perfiles/física; 7.344 consultas comparadas con barrido independiente. La primera variante solicitaba frenado como si el carril ya estuviese ocupado y empeoraba Volcano: descartada por la comparación.
- Cinco comparaciones de parrilla 0.49/0.50 suman 56 → 8 pasos de contacto y 72 → 45 pasos-coche fuera del corredor. No todas mejoran: Night suma 32 pasos-coche fuera y Sunset Difícil dos pasos de contacto nuevos; todos completan tres vueltas. Condiciones/resultados/limitaciones en `tests/experiments/TRAFFIC_LANES_050.md`.

- 0.49: 15 parrillas locales (2/3/4 humanos en Sunset, Dusty, Night, Volcano e Industrial), elección de coche/color/control, entradas aisladas, cuatro mandos analógicos emulados, cámara/HUD, DNF, puntos, pausa/reconexión, reinicio y siguiente. Chromium usa teclado real automatizado y Gamepad API emulada, cinco resoluciones (incluida ultrapanorámica), pantalla completa y capturas revisadas. No son 15 carreras completas ni una prueba de comodidad de cuatro personas.
- Regresión focalizada: seis comparaciones de CPU/doce vueltas y dos parrillas Normal/24 vueltas, con los mismos tiempos de referencia 0.48; colisiones, manejo, audio 2/4/reutilización/silencio, ciclo de carrera, menú/resultados y entrega local. No se repiten las 94 carreras de 0.48. La inspección visual detectó márgenes laterales y solapamientos en HUD pequeño, corregidos con viewport local adaptable y distribución responsive; se comprueba que el texto no desborde sus celdas.

- 0.48: 76 carreras generales/450 vueltas (42 CPU, 20 parrilla, 14 tráfico), más seis comparaciones de ritmo/doce vueltas y doce carreras Volcano/54 vueltas: 94 ejecuciones, 516 vueltas válidas en total. Límites compartidos, tres dificultades y orden de ritmo conservados. Dos coches no registran contactos en sus catorce referencias; no garantiza contacto cero contra personas.
- Integración de las 14 pistas/70 perfiles, pruebas de aceleración/giro/frenado del jugador, colisiones, pausa/reinicio y Chromium completo/entrega local superados. La primera comprobación de cuenta atrás llegó tarde bajo carga; ahora verifica el estado al procesar R y conserva teclado real. Equilibrio y audio percibido siguen pendientes de prueba humana.

- 0.47: doce carreras focalizadas/54 vueltas válidas en Volcano (cinco perfiles, cuatro modelos, tres dificultades con parrilla de cuatro). Orden Fácil/Normal/Difícil comprobado; 0/0/7 pasos de contacto respectivamente, sin ventajas de potencia. No se repitió toda la matriz anterior de 96 carreras ni se presenta como prueba humana.
- Integración/registro/menú/geometría de las 14 pistas; 22.265 sondas de bordes variables, 3.880 comprobaciones de píxeles en Volcano/cinco perfiles; dos contornos cerrados/1.128 sondas de barreras en la pista nueva y 211 colocaciones de decoración en tres calidades. Doce imágenes completas de los cuatro corredores previos idénticas antes/después de extraer el estilo. Chromium completa tres vueltas Volcano (29,43/28,40/28,37 s), además de Night/división de cámaras, recorrido general y entrega local bajo `/f1/` superados; capturas Volcano abierta/vallada/cercana revisadas.

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

- 0.51 resuelve las referencias Normal de Meadow/Industrial y la salida Night de 0.50. Quedan reservas frente a grupos y comprobar otras situaciones de tráfico humano.
- 0.51: Sunset Normal sube de 1 a 13 pasos con contacto y Rally Normal registra cuatro nuevos en sus referencias; Frostbite Difícil conserva cinco. Se mantienen como pendientes. La previsión de borde puede inducir otra disputa y no es un plan global de todas las trayectorias.
- Referencia 0.45: tráfico de dos coches sin contactos en sus 14 trazados de entonces. Esto no garantiza carreras sin contactos contra personas.
- Parrilla Dusty Fácil: los 28 pasos de 0.48/0.49 se reducen a 3 en 0.50 mediante previsión por radio interior. Son pasos con solapamiento, no choques separados. No implica contacto cero ni resuelve todos los grupos/recuperaciones; balance humano y otros escenarios siguen abiertos.
- Duración y trazados: referencias variadas 20/40/60 s, sin ventana obligatoria. Seis pistas con ancho variable y ocho pendientes; Frost nuevo ronda 36–37 s y Night cerca de 60. Faltan más siluetas propias y evaluación humana.
- Faltan calibración humana, pruebas en dispositivos físicos, controles táctiles y medición de rendimiento. Los videos adjuntos superaban el límite de transferencia y no pudieron verse.
- Contrarreloj, desafíos, editor y progresión ampliada siguen pendientes. Esta entrega no equivale a terminar las 24 fases ni a declarar una versión estable definitiva.
