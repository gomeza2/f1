# PIXEL GRAND PRIX — Hoja de ruta de 24 fases

## Objetivo de diseño

Crear un arcade de carreras 2D con circuitos originales, recorridos más variados y largos, física expresiva, una CPU competitiva pero justa, distintos terrenos y una interfaz que no tape la pista. La referencia general es el género de carreras desde arriba; el arte, los trazados y la personalidad del juego deben seguir siendo propios.

## Estado real de la versión

La interfaz identifica la build como **0.22**, continuando la base 0.17 del commit `a19be4bd82a5715a54d7f37f753ec468a91518a3` en `main`. El código registra **14 circuitos**, tiene modos de un jugador y dos jugadores local, perfiles de barreras, una primera capa de superficies, derrapes, checkpoints, récords locales, telemetría exterior y reglas de ataque/defensa para CPU.

**Importante:** “Implementado” significa presente en el código; no implica que se haya comprobado visualmente una carrera en navegador. Las fases que afectan la sensación de manejo siguen necesitando pruebas de juego reales.

### Fase 1 — Auditoría y estabilidad
**En curso continuo.**

- Revisar el código actual antes de cada cambio.
- Conservar las funciones que ya están presentes.
- Mantener comprobaciones de sintaxis, identificadores HTML y referencias entre archivos.
- Corregir regresiones sin rehacer innecesariamente el proyecto.

### Fase 2 — Pantalla completa y espacio de conducción
**Cámara y distribución ampliadas en 0.20; pruebas automáticas de navegador disponibles.**

- El lienzo utiliza una relación de aspecto fija.
- El botón de pantalla completa ajusta el contenedor principal.
- La telemetría principal se trasladó fuera del lienzo.
- Vista cercana 1,35× con anticipación, alternativa de circuito completo y vista completa en dos jugadores. Minimap muestra el área visible.
- Pantalla completa horizontal compacta y redibujado al redimensionar incluso en pausa.
- Pendiente: conducción humana y diferentes navegadores/dispositivos físicos.

### Fase 3 — Geometría y recorrido de las pistas
**Primera mejora completa implementada en 0.22 y comprobada automáticamente; balance humano pendiente.**

- Mundos ampliados a 1400×896 o 1300×832, independientes del canvas. Se conservan tamaño del coche, ancho de conducción y prestaciones de 0.21.
- Champion Road rediseñado: recta larga, frenadas y sector técnico; los 14 nombres y el orden del campeonato se conservan.
- Coastline, Meadow e Industrial separan además los pares de ramales conflictivos. Cuatro trazados largos antes tenían distancia central 62–75 frente a ancho 84; ahora todas las pistas superan el margen de seguridad del test.
- Validación del ancho completo, límites del mundo y proximidad no local entre segmentos, con casos sintéticos que prueban que el detector encuentra solapes sin cruce central.
- Entre cinco y siete checkpoints por longitud y récords separados por versión de trazado, conservando los datos anteriores.
- Objetivo pedido por el usuario: vuelta aproximada 25–45 s; referencia de CPU Normal 32,5–44,1 s. No se ralentiza artificialmente el coche para obtenerlo.
- Pendiente: evaluación humana de ritmo y dificultad y continuar dando identidad geométrica a los otros nueve originales.

### Fase 4 — Barreras y perfiles de circuito
**Geometría y colisiones corregidas en 0.21; perfiles personalizados pendientes.**

- Contornos del ancho de pista sustituyen el desplazamiento directo de normales, que formaba bucles cuando el radio de curva era menor a 55.
- Contornos muestreados cada cuatro unidades, calculados una vez por pista y reutilizados en todos los perfiles. Render y colisión comparten los mismos segmentos y extremos.
- Colisión del coche mediante cápsula de 30×20 unidades; neumáticos mediante los círculos dibujados, incluido su borde. Impactos normales pierden energía y conservan un rebote pequeño, sin generar velocidad en un coche detenido.
- Pilas de neumáticos descartadas cuando invaden otro ramal. Perfiles automático, completo, mitad, curvas y abierto conservados. En 0.22 el automático prioriza escapatorias: siete abiertos, cuatro de curvas cerradas y tres parciales; completo queda como elección explícita.
- `tests/validate-barriers.mjs`: 14 pistas, cinco opciones, 31 contornos cerrados, 7747 puntos, contacto visible, impactos frontales y coche parado. `validate-integration.mjs` conserva la prueba de las 70 configuraciones.
- Pendiente: perfiles personalizados/solo neumáticos, pruebas humanas contra todas las transiciones y validación integral de anchura en pistas cercanas a los bordes.

### Fase 5 — Variedad de circuitos
**Parcial; 14 circuitos conservados y cargados en Chromium.**

- Coastline Run, Rally Canyon, Meadow Run e Industrial Mix añaden recorridos más largos y ambientes propios.
- Señales 100/50 y zonas PASS se conservan; dependen de curvatura y separación mínima.
- Pendiente: comparar ritmo, rectas, anchuras y estrategia de cada trazado; varias pistas originales comparten una estructura similar.
- En 0.22 Champion Road recibe un trazado nuevo; las otras pistas conservan su identidad y ganan espacio. Quedan nueve originales con estructuras parecidas para revisar.

### Fase 6 — Superficies mixtas
**Primera capa implementada y corregida en build 0.16.**

- Superficies de asfalto, tierra, pasto, hielo y volcánico.
- Los sectores de tierra de circuitos mixtos aplican una adherencia específica.
- El HUD cambia la etiqueta según el sector.
- El minimapa indica los segmentos visuales de tierra.
- Pendiente: probar el agarre y la salida de pista jugando.

### Fase 7 — Derrape y respuesta física
**Mejora 0.20 implementada y comprobada automáticamente; sensación humana pendiente.**

- Aceleración, frenado y desplazamiento aumentados en los cuatro modelos. Balanced 76→110 de aceleración, 192→230 de frenado y escala real .62→.84.
- Dirección más rápida con pérdida progresiva de agarre al exceder la velocidad de curva; se evita el antiguo mínimo .14 que dejaba al coche casi sin giro.
- Freno de mano reduce velocidad por sí mismo y ayuda a rotar, manteniendo la penalización por velocidad excesiva y diferencias de terreno.
- Recuperación de derrape por tiempo real, sin depender de la cantidad de frames.
- Física y planificación de curvas de CPU comparten `vehicleHandling`; no se compensan cambios con ventajas exclusivas del rival.
- Pruebas reproducibles de aceleración, velocidad real, radio de giro, dirección rápida, freno de mano y terrenos; repetir carreras completas de CPU y tráfico tras el ajuste.
- Pendiente: sensación del derrape con personas, contactos impredecibles y persistencia por versión de física si los récords dejan de ser comparables.

### Fase 8 — CPU y trazada ideal
**Mejora 0.18 implementada y comprobada automáticamente; balance humano pendiente.**

- Plan de velocidad por curvatura y agarre del sector, calculado al iniciar la carrera.
- Frenado anticipado según distancia disponible y prestaciones del Balanced.
- Aceleración, frenado, velocidad máxima, agarre y escala de movimiento compartidos con el jugador; eliminados bonos exclusivos de CPU.
- Dirección con anticipación corta en curvas y cambios laterales graduales; recuperación del terreno abierto mediante conducción.
- 42 simulaciones: 14 pistas × tres dificultades × tres vueltas válidas, con checkpoints reales; límites de velocidad/aceleración verificados.
- Chromium completa una carrera de CPU en hielo mediante simulación acelerada de la física real y comprueba resultados y siguiente etapa.
- Pendiente: carreras humanas, tráfico prolongado, salidas tras impactos y comparaciones con los cuatro modelos.

### Fase 9 — Adelantamientos y defensa
**Mejora 0.19 implementada; validación automática y de navegador registrada más abajo. Balance humano pendiente.**

- Maniobra persistente con estado de seguimiento, ataque, defensa, solapamiento y cesión; lado comprometido durante el ataque y una línea defensiva por aproximación.
- Intentos infructuosos limitados a ocho segundos, con pausa de 1,5 s antes de volver a atacar.
- Durante el solapamiento prima el lado ocupado físicamente por cada coche; la defensa no autoriza cerrar la línea exterior del rival.
- Distancia física circular separada de la posición acumulada: reconoce obstáculos doblados y tráfico cerca de la meta; no confunde ramales alejados de una horquilla.
- Frenado preventivo por velocidad relativa y espacio disponible, con prestaciones compartidas. Avance lento alrededor de un detenido solo con una trayectoria libre de contacto.
- Prueba `tests/validate-traffic.mjs`: decisiones, conservación del lado, límite del intento, defensa, espacio, doblados, cesión, meta, reinicio, dos adelantamientos físicos y carreras completas de dos controladores.
- Pendiente: calibración frente a personas, contactos tras movimientos impredecibles, todos los modelos y personalidades. Las pruebas de dos controladores no representan automáticamente a un jugador humano.

### Fase 10 — Dificultad y personalidades de la CPU
**Tres dificultades implementadas y medidas; personalidades pendientes.**

- Fácil: ritmo conservador, mayor margen de frenado y respuesta más lenta.
- Normal: ritmo intermedio, menor margen y cambio lateral más rápido.
- Difícil: mayor precisión y aprovechamiento del coche, respetando sus prestaciones.
- En las 14 pistas las simulaciones verifican difícil más rápido que normal, y normal más rápido que fácil.
- Pendiente: errores razonables y personalidades defensiva, agresiva y técnica; calibrar frente a personas.

### Fase 11 — Choques y recuperación
**Primera capa implementada; pendiente de pruebas.**

- Colisiones entre vehículos.
- Rebote y penalización de velocidad en vallas.
- Recuperación automática en zonas abiertas.
- Mejorar separación de coches y control después de impactos.

### Fase 12 — Escenarios y objetos ambientales
**Primera capa implementada.**

- Decoraciones temáticas generadas según el circuito.
- Elementos costeros, rocas, vegetación y estructuras.
- Mejorar sombras, escalas, variedad y colocación sin obstruir la pista.

### Fase 13 — Efectos de terreno
**Primera capa implementada y revisada.**

- Partículas de derrape y salida de pista.
- Marcas de neumáticos limitadas para mantener el rendimiento.
- Textura volcánica con piedras oscuras y destellos de calor.
- Pendiente: validar densidad, colores y rendimiento en máquinas lentas.

### Fase 14 — Coches y animación
**Base implementada; mejora visual pendiente.**

- Modelos seleccionables y seis pinturas.
- Sprites sencillos de carrocería, ruedas, ventanas y luces.
- Mejorar siluetas, animación, diferencias entre modelos y lectura en movimiento.

### Fase 15 — Audio
**Primera capa implementada.**

- Sonido de motor, cuenta regresiva y choques.
- Interruptor de sonido.
- Pendiente: probar en distintos navegadores y equilibrar volumen, variedad y latencia.

### Fase 16 — HUD y minimapa
**Primera capa implementada en build 0.16.**

- Velocidad, velocidad objetivo, sector siguiente, checkpoints, mejor vuelta y terreno.
- Minimap independiente del área de conducción, visible también bajo 1050 px desde 0.20 y con marco de cámara.
- Pendiente: comprobar la distribución responsive y el modo de pantalla completa.

### Fase 17 — Modos de carrera
**Base implementada; expansión pendiente.**

- Carrera contra CPU.
- Dos jugadores en el mismo dispositivo.
- Campeonato por puntos.
- Añadir contrarreloj, carreras personalizadas y retos de circuito.

### Fase 18 — Progreso persistente
**Récords locales implementados; expansión pendiente.**

- Mejor vuelta por pista guardada en el navegador.
- Extender estadísticas, victorias, tiempos por coche y objetivos.
- Añadir controles claros para exportar, borrar o reiniciar el progreso, si se incorpora esa función.

### Fase 19 — Mecánicas especiales
**Pendiente.**

- Boosts limitados, obstáculos móviles y zonas de baja adherencia.
- Señales previas y reglas que se puedan aprender.
- Evitar que una mecánica aleatoria decida la carrera.

### Fase 20 — Editor de circuitos
**Pendiente.**

- Editor para diseñar puntos, anchura, terreno y barreras.
- Previsualización inmediata.
- Guardado local de pistas y validación antes de jugar.

### Fase 21 — Validación de circuitos
**Primera herramienta reproducible añadida; prueba local disponible.**

- `tests/validate-tracks.mjs` lee las definiciones reales y comprueba perfiles, dimensiones, longitud, muestras finitas y cruces de línea central.
- Ejecutar `node tests/validate-tracks.mjs` desde un checkout local para repetir la validación.
- Próximo paso: detectar segmentos demasiado cercanos, curvas agudas, anchuras insuficientes y checkpoints mal ubicados.
- Validar que cada barrera tenga colisión correspondiente.

### Fase 22 — Rendimiento y accesibilidad
**Primera capa implementada; pendiente de medir.**

- Caché del fondo y del asfalto.
- Modos detallado, retro y rendimiento.
- Mantener la carga de partículas acotada.
- Añadir controles y ajustes útiles para distintas pantallas y preferencias visuales.

### Fase 23 — Balance y pruebas completas
**Pendiente de validación en navegador.**

- Completar carreras en cada pista y dificultad.
- Probar perfiles de barreras y coches.
- Verificar salida, checkpoints, meta, récords, pausa y reinicio.
- Corregir errores de conducción y CPU basados en resultados reales.

### Fase 24 — Pulido y publicación
**Pendiente.**

- Limpiar código duplicado y nombres inconsistentes.
- Actualizar README y documentación.
- Comprobar que la versión de GitHub Pages carga todos los archivos.
- Declarar una versión estable solo después de las pruebas completas.

## Registro de auditoría — build 0.17

- JavaScript: comprobación de sintaxis superada.
- Se agregó `tests/validate-tracks.mjs` como prueba geométrica reproducible, sin dependencias externas.
- Integración de interfaz: no se encontraron referencias de JavaScript a IDs inexistentes en el HTML en la inspección estática.
- Circuitos: 14 registros.
- Geometría: el muestreo de segmentos no detectó intersecciones de línea central en los 14 circuitos.
- Superficies: arreglada la selección de agarre por sector en pistas mixtas, el etiquetado local del HUD, los tramos de minimapa y los efectos de partículas según material.
- CPU: corregida la comparación de distancia para respetar las vueltas acumuladas y no confundir coches separados por una vuelta.
- HUD: los indicadores se dibujan fuera del lienzo principal.

Esta lista es una comprobación estática. No afirma que el juego haya sido probado en un navegador ni que todas las colisiones y decisiones de CPU estén perfectamente equilibradas.


## Registro de auditoría — build 0.18 (24 de octubre de 2026)

### Punto de partida y conservación

- Rama remota inspeccionada: `main`, commit `a19be4b` (último mensaje: “Update phase 21 with the circuit validation tool”). Los cinco commits recientes ya incluían pruebas de geometría y documentación 0.17.
- El workspace no contenía un checkout de este juego. La clonación falló por conexión al proxy; se recuperaron todos los archivos de esa revisión mediante el conector GitHub y se creó una copia de trabajo aislada en `work/f1`. No se sobrescribió trabajo local ajeno.
- Revisados HTML, CSS, JavaScript, README, las hojas de 13, 16 y 24 fases y la prueba existente. No había AGENTS.md ni configuración de build en el árbol remoto.
- La hoja de 24 fases ya existía: se actualiza en lugar de recrear el proyecto. Se corrigió la numeración de las fases 3–5 para coincidir con el documento maestro. Las hojas históricas se conservan.

### Hallazgos y correcciones

- La CPU tenía aceleración/frenado propios (112/270), máxima hasta 246 frente a 232 del Balanced y escala de movimiento .66 frente a .62; ahora comparte la física principal y el límite 232.
- El controlador anterior no completó vueltas en Frostbite ni Rally Canyon en simulaciones de 300 s con paso 1/30 s. El nuevo completa tres vueltas válidas en ambos y en las otras doce pistas, en las tres dificultades.
- Ataque/defensa usaban condiciones invertidas; corregidas sin declarar terminada la fase 9.
- La anticipación de CPU y la física consultan una única tabla `SURFACE_GRIP`. Se conservan superficies, coches, campeonato, efectos, sonido y récords.

### Evidencia y límites

- Sintaxis: `node --check script.js`.
- Geometría: `node tests/validate-tracks.mjs` (14 circuitos).
- Integración: `node tests/validate-integration.mjs` (IDs, archivos locales, originales, perfiles y posiciones centrales de checkpoints). No demuestra alineación exacta de colisiones visibles.
- CPU: `node tests/validate-cpu.mjs` (42 carreras sin tráfico, 126 vueltas válidas, velocidades, aceleración, orden de dificultad; además movimiento equivalente, frenado ante bloqueo y recuperación en circuito abierto sin teletransporte).
- Navegador: `node tests/browser-smoke.cjs`, Chromium headless con Playwright. Comprueba teclado de ambos jugadores, cuenta regresiva, pausa/reanudación, reinicio, menú, carga de las 14 pistas, entrada/salida de pantalla completa, proporción del canvas y HUD exterior, carrera de CPU en hielo acelerada, resultados y siguiente etapa.
- Redimensionado a 390×844 y 844×390: solo visibilidad del canvas, no usabilidad móvil completa. El minimapa se oculta bajo 1050 px y no hay controles táctiles: pendientes de fases 2/16/22.
- Se inspeccionó una captura de Frostbite. El test bloquea Google Fonts para funcionar sin fuentes externas; la captura utiliza fuentes de respaldo.
- Renderizado conserva cachés y topes de 1400 marcas/360 partículas. No se midieron FPS ni dispositivos lentos; audio y sensación de conducción humana siguen pendientes.

### Continuación prevista tras 0.18 (histórico)

Partir de esta build y comprobar la rama/commit reales. Prioridad siguiente: fase 9, maniobras persistentes y espacio entre coches, con pruebas de adelantamiento, defensa, solapamiento y doblaje. Después abordar las curvas de vallas y el minimapa responsive. No repetir la auditoría histórica ni marcar todas las fases terminadas.

### Entrega y publicación

El conector de GitHub permitió leer el repositorio, pero rechazó la creación del árbol de cambios con `403 Resource not accessible by integration`. No se creó commit remoto, rama ni PR y no se modificó GitHub Pages. Se entrega el proyecto completo y un parche sobre `a19be4b`; aplicar el parche en un checkout limpio de esa revisión permite continuar. La copia local usa un commit de snapshot propio porque el acceso Git por proxy falló; no representa un clon con todo el historial remoto.

## Avance — build 0.19 (24 de octubre de 2026)

- Base local limpia: `7cf3173`, rama `codex/cpu-fair-driving`. GitHub `main` continúa en `a19be4b`; no se descarta el avance local 0.18 ni se sobrescribe el remoto.
- Se implementó la fase 9 sobre el controlador existente, conservando la física compartida, los 14 circuitos, todos los perfiles, coches, controles, campeonato y efectos.
- Errores detectados por pruebas: la reacción lateral cambiaba con cada frame; los doblados quedaban fuera del detector; el frenado podía inmovilizar al coche sin espacio para completar una maniobra; la defensa podía acercarse a una línea exterior ya ocupada. Cada caso tiene ahora una comprobación reproducible.
- La prueba de tráfico cuenta contactos antes de la resolución física, con tolerancia numérica, en lugar de contar separaciones que quedan exactamente en el límite de colisión.
- No se agregaron dependencias al juego ni se cambiaron prestaciones para favorecer a la CPU.

### Continuación prevista tras 0.19 (histórico)

Revisar el estado real y partir de 0.19. Siguiente fase recomendada: **4**, resolver pliegues y cruces de las vallas interiores con geometría de curvas desplazadas y pruebas de colisión. Después abordar minimapa responsive y accesibilidad móvil. La fase 9 tiene implementación y comprobaciones técnicas; su balance frente a personas sigue pendiente.

GitHub continúa sin cambios publicados: el permiso de escritura fue rechazado en la etapa anterior. El desarrollo sigue en la copia local y se conserva un parche acumulado desde `a19be4b`.

### Comprobaciones de 0.19

- Sintaxis, geometría de las 14 pistas, integración de IDs/archivos y 70 perfiles: superadas.
- Regresión de CPU: 42 carreras sin tráfico, tres vueltas en cada una; límites compartidos y orden de dificultades conservados.
- Tráfico: 14 carreras con dos controladores, ambos completan tres vueltas (84 vueltas adicionales). El máximo alejamiento del centro fue 30,2, dentro del límite de pista de 42.
- Se detectaron contactos en cinco pistas (159 frames acumulados): Sunset 17, Neon 13, Pixel City 26, Rally Canyon 65 e Industrial 38. Se registran como pendiente de balance y colisiones; no se declara conducción sin contactos ni superioridad frente a una persona.
- Dos adelantamientos físicos de coche detenido (misma vuelta y doblado) sin contacto, separación mínima 26,4 frente a umbral físico de 23.
- Chromium: controles de ambos jugadores, pausa, reinicio, menú, carga de 14 pistas, pantalla completa/proporción, HUD exterior, adelantamiento físico, carrera de CPU en hielo, resultados y siguiente etapa. La prueba desactiva el hover decorativo para estabilizar clics; el primer intento agotó el tiempo esperando ese efecto.
- La consulta actual al repositorio confirma `pull: true` y `push: false` para esta conexión. Hace falta habilitar escritura en la conexión de GitHub para publicar.

## Avance — build 0.20 (24 de octubre de 2026)

La petición posterior del usuario priorizó errores de manejo, poca velocidad y pista visualmente pequeña. Sobre el commit local `cb8a8fe` (0.19), se ajustaron conducción y cámara antes de abordar las vallas.

- Control: una única función de agarre y giro para conducción y planificación de CPU; pérdida de adherencia progresiva, dirección más rápida, aceleración y frenado aumentados. A 100 en asfalto el radio de giro calculado es 38,5 unidades. El exceso de velocidad todavía ensancha la curva.
- Velocidad real: .62→.84 unidades de desplazamiento por unidad de velocímetro, +35,5 %. Balanced alcanza 107,4 tras un segundo de acelerador; Corner 102,4; Speed 120,4; Rally 109,4.
- Freno de mano: desacelera aunque se siga acelerando; la dirección gana rotación sin girar instantáneamente. Decaimiento del derrape independiente de FPS.
- Cámara: cercana 1,35× por defecto, cambio con C/VISTA y visión completa para dos jugadores. No se alteró ni se infló la longitud real de los trazados. La ventana de cámara aparece en el minimapa.
- Interfaz: minimapa conservado en móvil, distribución compacta para fullscreen horizontal y redibujado del canvas al redimensionar en pausa.
- Nuevas comprobaciones: `tests/validate-driving.mjs`, ajustes en pruebas de CPU para usar prestaciones compartidas y ampliación de `browser-smoke.cjs` para cámara, minimapa y espacio horizontal.
- Regresión: 42 carreras de CPU, 126 vueltas válidas; orden fácil/normal/difícil conservado. Otras 14 carreras con dos controladores, 84 vueltas válidas; todos terminaron y el máximo offset fue 29,9 frente al límite de pista 42.
- Tráfico: contactos residuales en Neon (3 frames), Night (17), Jungle (25), Volcano (19), Pixel City (14), Thunder (7). Se miden y documentan; no se declara conducción libre de contactos. Los adelantamientos de detenido y doblado mantienen margen físico (mínimo 26,1; contacto a 23).
- Pruebas de manejo no equivalen a una evaluación humana: sigue pendiente jugar con estos ajustes y calibrar frente a una persona, con sonido y dispositivos reales.

### Continuación prevista tras 0.20 (histórico)

Partir de 0.20 y verificar rama/commit. Prioridad siguiente: geometría de las barreras interiores (fase 4), conservando la conducción más rápida, el margen de dirección y la cámara. Mantener las pruebas de las 14 pistas y tráfico. No repetir auditorías ya registradas ni reemplazar el avance local por `main` sin reconciliarlo.

La publicación sigue pendiente de escritura en GitHub. La consulta del repositorio confirmó `pull: true`, `push: false`, y se solicitó al usuario habilitar acceso; no se afirma que se haya subido ningún commit ni que GitHub Pages esté actualizado.

### Aclaración sobre la conexión y cierre local

La documentación oficial consultada confirma que la app GitHub de ChatGPT es de lectura: https://help.openai.com/en/articles/11145903-connecting-github-to-chatgpt. La indicación inicial de simplemente habilitar escritura en esa app era insuficiente. Hay que configurar repositorio y acceso Git en Codex; cambiar la política de confirmaciones de un plugin no concede permisos del proveedor. La CLI de este entorno tampoco pudo autenticar correctamente.

La build 0.20 quedó guardada en el commit local `a4d5ed4`. Chromium también superó el cambio de cámara con botón/C, minimapa visible a 390×844 y 844×390, pantalla completa horizontal con al menos 150 px de altura de conducción y las comprobaciones anteriores de controles, carrera y resultados. Se inspeccionó la captura de la vista cercana. Sin publicación remota ni actualización de Pages.

## Avance — build 0.21 (24 de octubre de 2026)

### Recuperación y publicación

- Se conservó íntegro el avance local 0.18–0.20. El remoto seguía en `a19be4b`.
- Un clon nuevo permitió conservar el historial Git real. El avance acumulado 0.20 se subió y verificó en `codex/pixel-gp-020`, commit `372426d2601ba5a752bb5f5eabf151b5dc7eb94d`.
- La CLI de API continuó fallando, pero la autenticación de Git mediante el helper del entorno sí permitió escribir. Los informes anteriores de “sin publicación” describen las etapas históricas, no la capacidad actual de Git.

### Cambio concreto

- Corregidos bucles de vallas internas mediante contornos del buffer de la pista, extraídos con triángulos de una cuadrícula y un índice espacial para limitar cálculos.
- Vallas visibles y físicas usan la misma geometría; el coche respeta su orientación y tamaño aproximado de carrocería/ruedas. Neumáticos consultados como círculos físicos reales, sin el antiguo choque por distancia longitudinal y lateral.
- Se conserva la recuperación de circuitos abiertos; sus perfiles no generan barreras invisibles.
- Coche detenido no recibe velocidad por una colisión y los impactos frontales ya no aplican rebotes al 50 % de la velocidad de llegada.
- Sin dependencias nuevas. Contornos y fondo se cachean; consultas de colisión usan celdas espaciales cercanas al coche.

### Comprobaciones

- Sintaxis y geometría central: correctas. IDs, archivos, diez originales, 14 registros y 70 perfiles: correctos.
- Barreras: 31 contornos cerrados y 7747 sondas sin plegarse sobre la pista; cinco perfiles en cada pista, casos de coche detenido, impacto frontal, círculos de neumáticos y segmentos cruzados.
- Conducción: cuatro coches, aceleración, agarre por terreno, freno de mano y cámara: superados.
- CPU: 42 carreras sin tráfico (126 vueltas válidas); tres dificultades y prestaciones compartidas conservadas. Tráfico: 14 carreras de dos controladores (84 vueltas), con contactos residuales medidos; no se declara ausencia de choques entre coches.
- Chromium: controles, reinicio, pausa, menú, 14 pistas, fullscreen/proporción, cámaras, minimapa móvil, espacio horizontal, adelantamiento y carrera de CPU en hielo, resultados y siguiente etapa: superados.
- Se inspeccionó la captura de Sunset: desaparecieron los pliegues visibles que tenía 0.20. Falta prueba humana de conducción, audio y rendimiento en dispositivos físicos.

### Continuación prevista tras 0.21 (histórico)

Verificar la revisión remota y partir de 0.21. Siguiente mejora recomendada: fase 3, medir anchura/proximidad entre ramales y dar variedad geométrica a los circuitos originales más similares. Mantener el control rápido, la respuesta de dirección, los 14 registros, el modo local, las barreras compartidas y la batería de carreras.

## Avance — build 0.22 (24 de octubre de 2026)

Se partió de `main` limpio, commit remoto `d51220a`. La petición adicional fue explícita: más espacio libre, menos muros y vueltas aproximadas de 25–45 s. Se terminó esta etapa antes de abrir otra fase.

### Cambios implementados

- Tamaño físico del mundo separado del viewport, conservando ancho de pista de 84 y coches de las mismas dimensiones. Fondos, texturas, decoración, contornos de barreras y minimapa cubren ahora todo el mundo.
- Ampliación de recorridos y rediseño de Champion Road con recta prolongada y curvas enlazadas. Se mantienen los 14 registros, las superficies, modelos, controles, campeonato y sonidos.
- Ajustes locales en ramales de Coastline/Meadow/Industrial y simplificación de dos ondulaciones de Meadow para equilibrar distancia y duración. Se descartó un primer diseño demasiado largo, que medía 47–59 s por vuelta.
- Validación del ancho conducible, margen a los bordes y separación de sectores alejados al menos 180 unidades por la ruta. Se analizan extremos, proyecciones e interiores de segmentos para no omitir pares paralelos.
- La regresión sintética detectó un error del primer detector: solo medía extremos de líneas paralelas y podía descartar el solape interior como si fuera una curva local. Se añadió muestreo interior y la prueba reproduce solapes, cruces y salida de límites.
- Automático: Sunset, Dusty, Jungle, Thunder, Coastline, Rally y Meadow abiertos; Night, Frostbite, Volcano y Champion solo en curvas cerradas; Neon, Pixel City e Industrial parciales. El jugador conserva todas las opciones manuales.
- Pantalla dividida en el modo local, con cámara independiente y vuelta propia, para conservar tamaño y lectura del coche. Las cámaras comparten cachés, sin duplicar física ni carreras.
- Checkpoints de 5 a 7, separados por recorrido; tiempos guardados por versión de trazado. Los récords anteriores no se borran ni se comparan con el circuito ampliado.

### Ritmo comprobado

Referencia: CPU Balanced, Normal, tres vueltas sin tráfico, paso 1/30 s; media por vuelta. Se verifica automáticamente el rango 25–45 s. No constituye una garantía del tiempo de cada persona.

| Circuito | Longitud anterior → actual (unidades de mundo) | Media por vuelta |
|---|---:|---:|
| Sunset Circuit | 2552 → 3572 | 35,76 s |
| Neon Harbor | 2419 → 3387 | 32,51 s |
| Dusty Mesa | 2529 → 3541 | 36,42 s |
| Night Run | 2724 → 3813 | 39,66 s |
| Frostbite GP | 2446 → 3424 | 36,76 s |
| Jungle Sprint | 2490 → 3485 | 37,00 s |
| Volcano Ring | 2487 → 3481 | 34,84 s |
| Pixel City | 2425 → 3395 | 34,34 s |
| Thunder Valley | 2509 → 3513 | 34,79 s |
| Champion Road | 2538 → 4974 | 44,13 s |
| Coastline Run | 3275 → 4261 | 43,06 s |
| Rally Canyon | 3081 → 4005 | 43,61 s |
| Meadow Run | 3137 → 4060 | 43,17 s |
| Industrial Mix | 3056 → 3970 | 42,14 s |

### Evidencia y límites

- Sintaxis, IDs y archivos locales: comprobados. Los diez nombres originales y los 14 registros se mantienen.
- Geometría: sin cruces centrales muestreados, margen mínimo de pista a bordes 29,2 y separación libre mínima entre ramales 9,8. Las curvas cercanas a lo largo de la propia ruta se excluyen de la prueba de ramales.
- Barreras: 37 contornos cerrados, 11206 sondas, cinco perfiles por cada pista, contactos y rebote comprobados. El perfil completo continúa disponible.
- Conducción: aceleración, giro, freno de mano, agarre, límites de cámara y separación de récords comprobados.
- Regresión de CPU: 42 carreras / 126 vueltas válidas; orden de dificultad y límites físicos conservados. Tráfico: 14 carreras de dos controladores / 84 vueltas válidas, con contactos medidos; no se declara ausencia de choques.
- Chromium: carga de las 14 pistas y cachés del tamaño del mundo, controles, cámaras cercana/general/dividida, minimapa, pausa, reinicio, menú, fullscreen y resize, adelantamiento y carrera en hielo, resultados y siguiente etapa comprobados.
- Se inspeccionaron las capturas de Champion Road y de las dos cámaras. Falta conducción humana, prueba móvil física con controles táctiles, audio y medición de FPS/memoria. Hay más superficie cacheada que en 0.21.

### Continuación vigente con «siguiente»

Partir del commit remoto de 0.22 y mantener conducción rápida, escapatorias y objetivo de 25–45 s. Siguiente fase recomendada: **5**, diferenciar otro de los nueve trazados originales aún similares, usando las nuevas pruebas de ancho/ritmo antes de publicarlo. No volver al mundo fijo de 1000×640 ni reemplazar los récords de trazados anteriores.
