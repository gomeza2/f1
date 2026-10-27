# PIXEL GRAND PRIX — Hoja de ruta histórica y registro de avances

La planificación abierta vigente continúa en [`ROADMAP_EVOLUCION.md`](ROADMAP_EVOLUCION.md), sin límite artificial de fases. Las 24 originales y sus decisiones se conservan aquí como contexto y registro.

## Objetivo de diseño

Crear un arcade de carreras 2D con circuitos originales, recorridos más variados y largos, física expresiva, una CPU competitiva pero justa, distintos terrenos y una interfaz que no tape la pista. La referencia general es el género de carreras desde arriba; el arte, los trazados y la personalidad del juego deben seguir siendo propios.

## Estado real de la versión

La interfaz identifica la build como **0.61**, continuando la base 0.17 del commit `a19be4bd82a5715a54d7f37f753ec468a91518a3` en `main`. El código registra **14 circuitos**, tiene modos de un jugador y 2–4 jugadores local, perfiles de barreras, una primera capa de superficies, derrapes, checkpoints, récords locales, telemetría exterior y reglas de ataque/defensa para CPU.

**Importante:** “Implementado” significa presente en el código; no implica que se haya comprobado visualmente una carrera en navegador. Las fases que afectan la sensación de manejo siguen necesitando pruebas de juego reales.

## Prioridad histórica 0.39–0.41 — reemplazada por el plan abierto

El siguiente cuadro registra el alcance anterior; el nuevo prompt reabre conducción, contacto y variedad, e incorpora evolución online sin techo de fases. Plan activo: `ROADMAP_EVOLUCION.md`.

El usuario reporta que se acelera demasiado rápido, puede completar curvas sin frenar, falta grava antes del pasto, el motor no resulta convincente y el modo local necesita 3–4 humanos. Este reporte reemplaza la estimación anterior de una entrega restante. **Cinco bloques principales contando la conducción en curso**, con posibilidad de varias iteraciones por bloque:

| Orden | Fases del plan | Entrega y criterio de aceptación | Estado |
|---|---|---|---|
| 1 | 7, 8, 10, 23 | Aceleración progresiva, peso/inercia y radio que exijan frenar en curvas cerradas, recuperación justa. CPU con las mismas reglas; récords separados si cambia la física. Comprobar curvas rápidas/técnicas, coches y superficies con el usuario. | Primera revisión 0.40 implementada; sensación humana pendiente. |
| 2 | 6, 4, 12, 13 | Pianos/asfalto → escapatoria de grava/tierra frenante → pasto, definidas por sector/lado. Dibujo, agarre, resistencia y partículas usan el mismo material. Respetar barreras automáticas/elegidas y no dibujar grava sobre otro ramal ni barreras invisibles. Recuperarse acelerando sin teletransporte ni velocidad generada. | Implementado 0.41; probado automáticamente/en Chromium; valoración humana pendiente. |
| 3 | 15 | Sustituir timbre actual por motor convincente: pulsos/armónicos, carga/acelerador y régimen, transiciones/cambios suaves, freno/derrape/grava con mezcla moderada. Recursos propios o con licencia verificada. Escucha humana obligatoria antes de aprobar calidad; conservar silencio en pausa/OFF/menú. | Pendiente; el audio actual no se considera aceptado por el usuario. |
| 4 | 17, 2, 16, 22 | Mejorar dos jugadores y ampliar a 3/4 humanos: selector, entradas independientes/configurables, cámaras legibles, HUD/tiempos/CP por persona, nombres/colores, contactos, clasificación y puntos de todos. Controles sin solaparse con R/C/Esc; prever mandos para evitar depender de muchas teclas simultáneas. Probar teclado real/mandos, pausa/reinicio y modos 1/2/3/4. | Pendiente; hoy solo 2 humanos. |
| 5 | 23, 24 | Revisión final en pistas, dificultades, coches, superficies/perfiles y cantidades de humanos; cronometraje humano 25–45 s donde corresponda, salidas/recuperación, rendimiento medido y publicación verificable. Corregir lo hallado antes de declarar base decente. | Pendiente; validación continua en cada bloque. |

Editor, desbloqueos y desafíos extra quedan fuera de este hito. No ampliar más trazados para compensar una conducción que aún no está aceptada.

### Fase 1 — Auditoría y estabilidad
**En curso continuo.**

- Revisar el código actual antes de cada cambio.
- Conservar las funciones que ya están presentes.
- Mantener comprobaciones de sintaxis, identificadores HTML y referencias entre archivos.
- Corregir regresiones sin rehacer innecesariamente el proyecto.

### Fase 2 — Pantalla completa y espacio de conducción
**Cámara ampliada en 0.20 y espacio de ventana/pantalla completa ajustado en 0.26; comprobado en Chromium.**

- El lienzo utiliza una relación de aspecto fija.
- El botón de pantalla completa ajusta el contenedor principal.
- La telemetría principal se trasladó fuera del lienzo.
- Vista cercana 1,35× con anticipación, alternativa de circuito completo y cámaras divididas independientes en dos jugadores. Minimap muestra el área visible.
- Ventana de carrera de hasta 1600 px de ancho, alto disponible sin scroll y franja compacta de datos. Pantalla completa horizontal y redibujado al redimensionar incluso en pausa.
- Pendiente: conducción humana y diferentes navegadores/dispositivos físicos.

### Fase 3 — Geometría y recorrido de las pistas
**Ampliación de 0.22 y rediseño largo de Sunset en 0.39 comprobados automáticamente y en Chromium; balance humano pendiente.**

- Mundos ampliados a 1400×896 o 1300×832, independientes del canvas. Se conservan tamaño del coche, ancho de conducción y prestaciones de 0.21.
- Champion Road rediseñado: recta larga, frenadas y sector técnico; los 14 nombres y el orden del campeonato se conservan.
- Coastline, Meadow e Industrial separan además los pares de ramales conflictivos. Cuatro trazados largos antes tenían distancia central 62–75 frente a ancho 84; ahora todas las pistas superan el margen de seguridad del test.
- Validación del ancho completo, límites del mundo y proximidad no local entre segmentos, con casos sintéticos que prueban que el detector encuentra solapes sin cruce central.
- Entre cinco y nueve checkpoints por longitud y récords separados por versión de trazado, conservando los datos anteriores. Sunset 0.39 usa nueve y récord @3.
- Sunset 0.39: 6304 unidades (+76,5 %), mundo 1800×1152, recta larga/curva exterior/sector interior/regreso técnico; coche, ancho y velocidad intactos, perfil abierto. CPU Normal libre 34,86 s.
- Objetivo pedido por el usuario: vuelta humana aproximada 25–45 s. En 0.39 CPU Normal libre mide 19,40–34,86 s según pista; Sunset 34,86 s. No se ralentiza artificialmente el coche para obtenerlo.
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
**Champion, Dusty y Sunset rediseñados; Sunset 0.39 tiene identidad geométrica comprobada. Resto y balance humano pendientes.**

- Champion Road (0.22): recta larga y sector de curvas enlazadas, conservando su identidad de carrera final.
- Dusty Mesa (0.23): silueta triangular, recta rápida arriba, “S” al este y regreso diagonal; tierra, perfil abierto y cinco checkpoints conservados.
- La separación libre mínima entre ramales de Dusty pasa de 37,9 a 73,3; referencia Normal de 28,91 s por vuelta, dentro del objetivo 25–45 s.
- Comprobación de identidad geométrica independiente de escala, traslación, giro, reflejo, sentido y colocación de la meta. El nuevo Dusty se distingue de las otras 13 pistas; la prueba detecta una copia transformada.
- Récord de Dusty separado como versión 3; se conservan los datos de la versión 2. Las otras 13 pistas no cambian sus registros ni su geometría.
- Sunset (0.39): silueta propia, comparada sin escala/giro/reflejo contra la anterior y las otras 13; no se acepta una variante que se parecía a Champion.
- Pendiente: diferenciar los otros siete originales, sin convertir la variedad en cambios de color ni perder las escapatorias; evaluación humana de ritmo y diversión.

### Fase 6 — Superficies mixtas y escapatorias
**Base 0.16 y grava frenante 0.41 implementadas; materiales compartidos y 70 perfiles comprobados. Valoración humana pendiente.**

- Superficies de asfalto, tierra, pasto, hielo y volcánico.
- Los sectores de tierra de circuitos mixtos aplican una adherencia específica.
- Agarres, partículas y minimapa usan el material del sector. La etiqueta de terreno se retiró del HUD en 0.26 a pedido del usuario.
- El minimapa indica los segmentos visuales de tierra.
- 0.41: grava en exteriores seleccionados de ocho pistas pavimentadas/mixtas/costeras, seguida de terreno nativo. Dibujo, agarre, resistencia, polvo/huellas y ruido de terreno usan una definición común por punto. No cubre asfalto de otro ramal ni sectores con valla activa.
- Pendiente: probar el agarre, frenado, recuperación y lectura con conducción humana.

### Fase 7 — Derrape y respuesta física
**Reabierta por feedback: aceleración progresiva y límite lateral implementados en 0.40; sensación humana y refinamiento de derrape pendientes.**

- Aceleración, frenado y desplazamiento aumentados en los cuatro modelos. Balanced 76→110 de aceleración, 192→230 de frenado y escala real .62→.84.
- Dirección más rápida con pérdida progresiva de agarre al exceder la velocidad de curva; se evita el antiguo mínimo .14 que dejaba al coche casi sin giro.
- Freno de mano reduce velocidad por sí mismo y ayuda a rotar, manteniendo la penalización por velocidad excesiva y diferencias de terreno.
- Recuperación de derrape por tiempo real, sin depender de la cantidad de frames.
- Inercia de giro en 0.24: velocidad angular progresiva, algo más de peso a alta velocidad, recuperación mediante contravolante y respuesta más rápida al usar freno de mano. Reinicios limpian la inercia y los impactos de vallas la amortiguan.
- Física y planificación de curvas de CPU comparten `vehicleHandling`; no se compensan cambios con ventajas exclusivas del rival.
- Pruebas reproducibles de aceleración, velocidad real, radio de giro, dirección rápida, freno de mano y terrenos; repetir carreras completas de CPU y tráfico tras el ajuste.
- 0.40: potencia de aceleración progresiva y giro limitado por fuerza lateral compartida. Récords con sufijo de física `:p2`, conservando anteriores. No se considera cerrado el control hasta probarlo con personas.
- Pendiente: sensación del derrape con personas, entrada/salida y recuperación, contactos y recalibración en cada superficie.

### Fase 8 — CPU y trazada ideal
**Mejora de ritmo y controlador implementada en 0.25; contraste humano y tráfico agresivo pendientes.**

- Se elimina el techo antiguo de velocidad orientativa por curva. La búsqueda usa el modelo físico compartido y contempla el agarre perdido por exceso de velocidad y el derrape.
- Anticipación de trayectoria según velocidad, giro calculado desde la curvatura necesaria y capacidad de dirección real; frena más tarde con márgenes dentro del frenado disponible.
- Normal/Difícil usan freno de mano para curvas exigentes con espacio libre, con su coste físico real. Fácil no lo usa. En tráfico cercano se conserva una respuesta más cauta.
- Normal mejora al menos 20 % frente al benchmark de 0.24 en las 14 pistas; techo de 232 del Balanced, aceleración, movimiento y coste del freno de mano comprobados.
- Dusty: Normal 19,40 s / Difícil 18,82; Sunset: Normal 22,39 / Difícil 21,58. El usuario declara unos 18 s en ambas, por lo que no se declara resuelto todo el balance humano.
- Pendiente: mayor agresividad y adaptación de línea en tráfico (fase 9), otros modelos/riesgos y más rivales (fase 10), medición frente a conducción humana real.

### Fase 9 — Adelantamientos y defensa
**Anticipación y reserva de espacio mejoradas en 0.27; validación registrada más abajo. Contactos residuales y balance humano pendientes.**

- Maniobra persistente con estado de seguimiento, ataque, defensa, solapamiento y cesión; lado comprometido durante el ataque y una línea defensiva por aproximación.
- Intentos infructuosos limitados a ocho segundos, con pausa de 1,5 s antes de volver a atacar.
- Durante el solapamiento prima el lado ocupado físicamente por cada coche; la defensa no autoriza cerrar la línea exterior del rival.
- Distancia física circular separada de la posición acumulada: reconoce obstáculos doblados y tráfico cerca de la meta; no confunde ramales alejados de una horquilla.
- Frenado preventivo por velocidad relativa y espacio disponible, con prestaciones compartidas. Avance lento alrededor de un detenido solo con una trayectoria libre de contacto.
- En 0.27 predice posiciones con velocidad, dirección y giro actual hasta 0,75 s; frena ante entradas laterales y considera la velocidad proyectada del rival.
- Selecciona un lado con espacio antes de comprometer el ataque. Mayor reserva lateral durante el solapamiento; el perseguidor cede cuando el borde no permite circular a la par.
- Prueba `tests/validate-traffic.mjs`: predicción recta/curva, entrada lateral, carriles divergentes, borde ocupado, decisiones, conservación del lado, límite del intento, defensa, espacio, doblados, cesión, meta, reinicio, dos adelantamientos físicos y carreras completas de dos controladores.
- Pendiente: calibración frente a personas, contactos tras movimientos impredecibles, todos los modelos y personalidades. Las pruebas de dos controladores no representan automáticamente a un jugador humano.

### Fase 10 — Dificultad y personalidades de la CPU
**Tres dificultades/estilos en 0.28; revisión de convivencia en curvas y nombres en 0.36. Balance humano pendiente.**

- Selector de 1/2/3 rivales; tres por defecto. TRAZO (antes CPU 1) conserva el controlador equilibrado, FURIA ataca con menor diferencia de velocidad y ÁPICE tiene mayor precisión y elección más selectiva de ataque.
- En paralelo con riesgo de convergencia cercana, acorta el punto de seguimiento para respetar el carril en la curva. Conserva anticipación normal sin riesgo; considera todos los coches del grupo. Nombres y estilos se presentan en el menú y se conservan en avisos/resultados/puntos.
- Cada estilo adapta ritmo objetivo, margen de frenado, respuesta, velocidad lateral y condiciones de ataque; mantiene el Balanced y los límites físicos. No se añade potencia, agarre ni velocidad máxima.
- Tráfico considera todos los participantes, contactos por pares, posición en HUD, resultados completos y puntos 25/18/15/12. Dos jugadores sigue separado de la selección de CPU.
- Fácil: ritmo conservador, mayor margen de frenado y respuesta más lenta.
- Normal: ritmo intermedio, menor margen y cambio lateral más rápido.
- Difícil: mayor precisión y aprovechamiento del coche, respetando sus prestaciones.
- En las 14 pistas las simulaciones verifican difícil más rápido que normal, y normal más rápido que fácil.
- Pedido del usuario: revisar otra vez competitividad de CPU y nombres. Usar nombres ficticios reconocibles y coherentes en pista, minimapa, resultados y puntos; conservar identificadores internos y contrastar ritmo en Sunset/Dusty con vueltas humanas.
- Pendiente: errores razonables, más rasgos defensivos y calibración de estilos frente a personas. Furia y Ápice ya introducen ataque y precisión diferentes desde 0.28.

### Fase 11 — Choques y recuperación
**Separación de grupos, impacto y recuperación desde reposo corregidos en 0.29; validación registrada abajo.**

- Resolución iterativa de pares con reconciliación de vallas/neumáticos después de cada empujón; conserva la geometría visible compartida.
- Impacto según velocidad relativa normal, una vez por pareja y paso; sin frenazo fijo por roce paralelo, aceleración del coche golpeado ni rebote añadido.
- Cruces válidos de meta/checkpoints y datos de posición coherentes después del contacto.
- El terreno no arranca un coche detenido; los cuatro modelos recuperan desde reposo con física ordinaria en asfalto, tierra e hielo.
- Pruebas de amontonamiento de cuatro coches, valla, impacto, 30/120 FPS, meta y recuperación. Pendiente: conducción humana y contactos residuales; se conserva el volumen circular aproximado entre coches.

### Fase 12 — Escenarios y objetos ambientales
**Ambientación y colocación mejoradas en 0.30; comprobaciones registradas abajo.**

- Catorce perfiles temáticos con vegetación, rocas, estructuras, tribunas, público y elementos industriales; paletas y detalles propios.
- Colocación reproducible con variación espacial, prioridad para hitos grandes y separación entre objetos. Distancia exacta a los segmentos completos, incluida huella visual y sombras; 124 unidades libres desde el centro de pista.
- Respeta bordes del mundo y escapatorias; fondos estáticos cacheados y densidad/detalles según calidad.
- Pendiente: revisión humana, medir rendimiento y enriquecer hitos de pistas con poco espacio sin invadir conducción.

### Fase 13 — Efectos de terreno y cierre visual
**Bandera y feedback de llegada implementados en 0.31; efectos de terreno existentes conservados.**

- Bandera a cuadros compacta fuera del lienzo al llegar el primer coche. Quienes siguen en pista conservan controles; reloj de cierre de 18 s, pausa y reanudación coherentes.
- Bandera de resultados con tres ciclos de animación y preferencia de movimiento reducido. Resumen personal, ganador identificado y foco al título. La tabla de puntos queda pendiente en fase 17.
- Partículas de derrape y salida de pista.
- Marcas de neumáticos limitadas para mantener el rendimiento.
- Textura volcánica con piedras oscuras y destellos de calor.
- Pendiente: validar densidad, colores y rendimiento en máquinas lentas.

### Fase 14 — Coches y animación
**Siluetas y feedback de ruedas/freno implementados en 0.32; comprobados automáticamente y en Chromium.**

- Cuatro carrocerías propias y seis pinturas: compacto, ruedas expuestas, deportivo afilado y rally ancho. Contorno, cristales, luces y detalles conservan dirección legible.
- Ruedas delanteras según dirección suavizada; rodadura según avance, luces traseras según freno/freno de mano y marcas de derrape en el eje dibujado de cada modelo.
- La pintura se conserva durante el destello de choque. Calidad escala sombras/detalles/rodadura y respeta movimiento reducido.
- Sin cambios de prestaciones, volumen de colisión, controles ni CPU. Pendiente: percepción humana a velocidad real y ampliar opciones cosméticas posteriormente.

### Fase 15 — Audio
**Reabierta: implementación técnica 0.33 comprobada, pero el usuario rechaza la calidad del motor. Sustitución y escucha pendientes.**

- Timbres/régimen de motor según modelo y conducción; mezcla de los dos humanos en modo local. Capas de derrape y terreno.
- Cuenta regresiva, salida, checkpoints/vueltas/récords y llegada/resultados diferenciados; evita avisos de checkpoints de CPU. Impactos próximos con intensidad y límite de repetición.
- Mezcla con compresión, máximo de ocho voces transitorias, rampas suaves y limpieza de nodos. Un contexto reutilizado; pausa/OFF/menú/pestaña oculta silencian las capas.
- Interruptor con estado accesible y carrera funcional sin Web Audio.
- Pendiente: escucha con personas, teléfonos, interrupciones de navegador, volumen/latencia y más calibración.

### Fase 16 — Pantalla inicial, HUD y minimapa
**HUD simplificado en 0.26 y paddock inicial implementado en 0.34; comprobados automáticamente y en Chromium.**

- Pedido del usuario: pantalla inicial más linda y cómoda, con jerarquía clara, selección de carrera fácil de entender y buen uso en escritorio/móvil. Conservar accesibles opciones y controles.
- Paddock con configuración, garaje, mapa real con checkpoints/meta/sentido, récord por versión y perfil efectivo. Vista del modelo/pintura con el render de carrera. Selectores y botones funcionan con teclado nativo; foco al lienzo y al volver al menú. Configuración móvil apilada y controles secundarios desplegables.
- Velocidad actual, vueltas, checkpoints, cronómetro de vuelta, mejor tiempo y minimapa. Se retiraron velocidad objetivo, próxima curva, terreno y porcentaje de derrape.
- Cronómetro relativo al inicio de cada vuelta; conserva la última al finalizar. El resultado mantiene tiempo total.
- Minimap independiente del área de conducción, visible también bajo 1050 px desde 0.20 y con marco de cámara.
- Chromium verifica proporción, ausencia de scroll, HUD exterior y visibilidad en escritorio, móvil vertical/horizontal y pantalla completa. Pendiente: dispositivos físicos, controles táctiles y conducción humana.

### Fase 17 — Modos de carrera y tabla de puntos
**Tabla de carrera/campeonato implementada y comprobada en 0.35; expansión de modos pendiente.**

- Pedido del usuario: tabla de puntos legible con puesto, piloto, puntos por carrera y total; marcar sin terminar y mantener orden/nombres entre etapas.
- Dos tablas con tiempos/diferencias/mejor vuelta, puntos ganados y clasificación acumulada; humanos y colores identificados. Sin terminar recibe cero puntos. Empates de puntos comparten puesto; final empatada se informa sin elegir campeón arbitrario.
- Pruebas automáticas y Chromium de tablas, continuidad y móvil; contrarreloj/desafíos siguen pendientes.
- Carrera contra CPU.
- Dos jugadores en el mismo dispositivo; mejorar su lectura/controles y ampliar a 3/4 humanos, todavía pendiente.
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
**Batería completa y flujo de Chromium comprobados en 0.37; correcciones de pausa/tiempo implementadas. Balance humano y contactos residuales pendientes.**

- Completar carreras en cada pista y dificultad.
- Probar perfiles de barreras y coches.
- Verificar salida, checkpoints, meta, récords, pausa y reinicio.
- Corregir errores de conducción y CPU basados en resultados reales.

### Fase 24 — Pulido y publicación
**Primera entrega web consolidada en 0.38 y comprobada localmente; despliegue público y estabilidad humana pendientes.**

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

### Continuación prevista tras 0.22 (histórico)

Partir del commit remoto de 0.22 y mantener conducción rápida, escapatorias y objetivo de 25–45 s. Siguiente fase recomendada: **5**, diferenciar otro de los nueve trazados originales aún similares, usando las nuevas pruebas de ancho/ritmo antes de publicarlo. No volver al mundo fijo de 1000×640 ni reemplazar los récords de trazados anteriores.

## Avance — build 0.23 (24 de octubre de 2026)

Se partió de `main` limpio y sincronizado con `70fe153`. Se continúa la fase 5 sin alterar aceleración, giro, freno, perfiles automáticos ni el objetivo de 25–45 s pedido por el usuario.

### Dusty Mesa: cambio real de geometría

- Se sustituyó el recorrido de dos lóbulos parecido a los otros originales por un circuito triangular de 22 puntos: recta rápida superior, frenada hacia una “S” al este y una salida diagonal extensa.
- Sigue usando tierra y escapatorias abiertas. El tamaño del mundo permanece 1400×896 y no se añadieron paredes ni se modificó la física para cambiar la dificultad.
- Longitud: 3541→3487 unidades (-1,5 %). No se añadieron zigzags para inflar distancia. El ritmo cambia por la forma del recorrido y las rectas, no por un aumento artificial de velocidad.
- Separación libre mínima de ramales: 37,9→73,3. Margen mínimo a los límites del mundo: 43,0. Sin cruces centrales en la validación muestreada; los cinco checkpoints siguen siendo accesibles.
- Las tres vueltas de referencia en Normal fueron 29,03 / 28,83 / 28,87 s (media 28,91). La referencia de los 14 circuitos queda en 28,9–44,1 s. Tiempos de personas y otros coches pueden diferir.
- Dusty cambia a versión de trazado 3. Récords anteriores conservados por separado; las otras 13 pistas mantienen la versión 2 y su forma.

### Comprobación de identidad

- `tests/helpers/track-shape.mjs` muestrea a distancia uniforme, normaliza la silueta y compara formas permitiendo giro, reflejo, escala y desplazamiento cíclico de la salida.
- `tests/validate-track-identity.mjs` detecta una copia geométricamente transformada y exige distancia normalizada mayor a 0,15 entre Dusty y las otras 13 pistas. La más cercana fue Frostbite, con 0,264.
- La medida sirve como detector de copias y regresión, no como calificación de diseño ni de diversión. Los ocho originales restantes no se declaran diferenciados por este test.

### Validación de la etapa

- Sintaxis e identidad de registros: comprobadas. Se conservan los 14 nombres, el orden, los siete perfiles abiertos y todas las opciones manuales.
- Geometría y ancho: probados en las 14 pistas. Contactos y perfiles de barreras, conducción, cámaras y récords: comprobados con las pruebas existentes.
- Prueba nueva de conservación de récords: Dusty v2 permanece intacto al guardar una vuelta de Dusty v3, incluso si el tiempo antiguo era menor.
- Regresión de CPU: 42 carreras / 126 vueltas válidas, tres dificultades y referencia Normal dentro de 25–45 s. Tráfico: 14 carreras / 84 vueltas válidas; Dusty terminó con ambos coches sin contactos medidos. Chromium superó una carrera de Dusty, la de hielo, controles, vistas, fullscreen, dos jugadores y modos retro/rendimiento. Se inspeccionaron las dos capturas de Dusty. Sigue pendiente evaluación humana.

### Continuación prevista tras 0.23 (histórico)

Partir del commit de 0.23. Próximo paso de fase 5: dar identidad a uno de los otros ocho originales, conservando pistas abiertas y tiempos de referencia 25–45 s. Dusty y Champion ya están rediseñados; no repetirlos como si fueran trabajo pendiente. Mantener el control de geometría, ritmo y récords por versión.

### Prioridad añadida por el usuario

Antes de seguir ampliando pistas, pidió algo más de peso en las curvas. La etapa de Dusty se cierra aquí; el siguiente cambio es un ajuste acotado de inercia de giro (fase 7), conservando dirección recuperable y el objetivo 25–45 s. No agrandar más circuitos por ahora.

## Avance — build 0.24 (24 de octubre de 2026)

La fase de Dusty se cerró y se publicó en `main` como `1b78910`. A continuación se atendió la petición de algo más de peso en las curvas, sin agrandar pistas ni alterar las prestaciones del coche.

### Inercia de giro (fase 7)

- Estado `yawRate` en cada coche: la dirección acumula y descarga velocidad angular progresivamente en lugar de cambiarla instantáneamente.
- Respuesta algo más pesada a velocidad alta y rotación más rápida con el freno de mano. Se conserva el mismo giro sostenido, aceleración, frenado, agarre y máxima velocidad.
- Integración analítica de la respuesta de giro por paso de tiempo; la prueba del componente coincide a 30 y 120 FPS. Esto no afirma que todo el motor sea idéntico en todos los FPS.
- El mismo paso físico se aplica a personas y CPU; no se añade ningún beneficio exclusivo al rival.
- Colocar/reiniciar el coche deja la velocidad angular en cero. Los impactos contra vallas la amortiguan junto a la dirección y la velocidad lineal, para facilitar la recuperación.
- `tests/validate-steering-inertia.mjs`: entrada progresiva, giro sostenido, descarga, contravolante, freno de mano, respuesta según velocidad, independencia temporal del componente y reinicio.
- Los tamaños y geometrías de los 14 circuitos no cambian respecto a 0.23. Los récords por versión del trazado se conservan.

### Feedback humano y próximos rivales — pendiente para fases 8–10

- El usuario comunica una vuelta aproximada de 18 s y una CPU demasiado lenta/conservadora; no especifica el circuito. Ese feedback invalida usar el ritmo de referencia de la CPU como prueba de equilibrio humano.
- Revisar ritmo real y trazada antes de declarar competitivo un nivel. Comparar con tiempos humanos; la prueba actual de 25–45 s solo comprueba una referencia de simulación.
- Punto a investigar: `buildAiSpeedPlan()` limita su búsqueda superior a `bend.safeSpeed`, aunque el modelo físico actualizado puede permitir más velocidad. Medirlo frente a la física compartida, sin elevar máximas ni otorgar agarre o aceleración exclusivos.
- Añadir en su etapa uno o dos rivales adicionales (dos o tres CPU en total), con actitudes más agresivas y riesgos razonables. No está implementado en 0.24.
- Antes de ampliar parrilla: tráfico debe atender varios vecinos, contactos deben recorrer todos los pares y posiciones/puntos/resultados deben soportar más de dos coches. No basta con dibujar vehículos adicionales.
- Petición vigente: no agrandar más las pistas por ahora. Mantener escapatorias y continuar por fases.

### Comprobaciones de 0.24

- Inercia y pruebas focalizadas de conducción, recuperación, tráfico, reinicio y giro: superadas.
- Regresión completa: 42 carreras de CPU / 126 vueltas válidas y 14 carreras de tráfico / 84 vueltas válidas, sin salidas del ancho de conducción en las pruebas. Se conservan límites físicos y orden de dificultades. Referencia Normal: 28,91–44,14 s; sigue sin ser una calibración humana.
- Chromium comprobó entrada de giro con D, descarga al soltar, contravolante con A y las funciones de carrera anteriores: todos superados. También pasó el componente de inercia a 30/120 FPS.
- Geometría, identidad de Dusty, 70 perfiles, barreras, récords y archivos/IDs: superados. Quedan contactos residuales de tráfico; falta evaluación humana del peso del coche y calibración competitiva de CPU.

### Continuación prevista tras 0.24 (histórico)

Partir de 0.24 y verificar el commit remoto. Siguiente fase: **8**, corregir ritmo y trazada de la CPU con mediciones y física compartida, incorporando el feedback de vueltas humanas de unos 18 s. Dejar la ampliación de parrilla para las fases de tráfico/personalidades una vez que el controlador sea competitivo. Conservar pistas, escapatorias e inercia de giro; no comenzar otra ampliación de tamaño.

## Avance — build 0.25 (24 de octubre de 2026)

Base limpia: `main`, `c1f7135`. Se atendió la fase 8 y el feedback concreto: el usuario obtiene unos 18 s en Dusty Mesa y Sunset y deja muy atrás a la CPU. Se mantiene un rival; no se agrandaron circuitos ni se alteró la física del jugador.

### Causa y corrección

- La planificación anterior buscaba velocidad solo hasta `bend.safeSpeed`, un valor orientativo heredado de una física anterior. Era un límite innecesario, incluso cuando el coche podía sostener más velocidad.
- Ahora se evalúa el intervalo completo hasta la máxima real del Balanced (232), usando `vehicleHandling`, superficie, exceso de velocidad y derrape esperado. El margen de dirección deja capacidad de corrección.
- El volante se calcula con la velocidad, la distancia al objetivo, el error de orientación y el giro físico disponible. El objetivo se mira más lejos al circular rápido, aprovechando la inercia de 0.24.
- Normal aprovecha más el ritmo disponible y frena más cerca de la curva; Difícil usa márgenes menores. Ningún perfil modifica máxima, aceleración, agarre, desplazamiento o velocidad angular del vehículo.
- Se calcula también el paso por curva con freno de mano; Normal/Difícil lo aplican cuando la demanda de giro lo justifica y no hay un rival próximo. La pérdida de velocidad se produce en la física común y está verificada por frame.
- Se conserva la recuperación normal y no se teletransporta ni se añade avance exclusivo al rival.

### Mediciones y límites

- Referencia sin tráfico, tres vueltas, paso 1/30 s: Normal mejora entre 26,5 % y 40,4 % en las 14 pistas frente a 0.24. Hay un benchmark versionado en `tests/fixtures/cpu-0.24.json` con el commit y las condiciones.
- Dusty pasa de 28,91 a 19,40 s en Normal; Difícil mide 18,82. Sunset pasa de 35,84 a 22,39; Difícil mide 21,58. El rival se acerca al ritmo comunicado por el usuario, pero sigue por detrás de sus 18 s en Sunset.
- Se reemplazó el mínimo de 25 s en el test de CPU por mejora de ritmo y controles físicos. La duración de diseño de una pista no puede imponerse frenando artificialmente al rival para cumplir un test.
- El test comprueba por frame máxima, aceleración, distancia recorrida, agarre de pista y pérdida de velocidad al usar freno de mano. Fácil mantiene el freno de mano desactivado.
- Un experimento de optimización de línea se descartó porque empeoraba las vueltas de varias pistas. No se conserva otro controlador ni una segunda ruta incompatible en el juego.
- Quedan diferencias entre aire libre y tráfico: el freno de mano se reserva cuando existe espacio. No se declara que la CPU ya sea invencible ni que gane a una persona concreta.

### Comprobaciones

- Regresión: 42 carreras / 126 vueltas válidas, tres dificultades ordenadas y límites físicos compartidos; al menos 20 % de mejora Normal frente a 0.24 en cada pista comparable.
- Tráfico: 14 carreras / 84 vueltas válidas, ambos coches terminan y el máximo offset medido fue 38,5 dentro del ancho de 42; contactos residuales medidos, sin afirmar ausencia de choques.
- Sintaxis, geometría, identidad de Dusty, IDs/archivos, 70 perfiles, conducción, inercia, récords y barreras: superados. Chromium superó controles, giro, pausa, reinicio, menú, cámaras, fullscreen, carga de 14 pistas, carreras en Dusty/hielo, resultados y modos gráficos. Falta calibración frente a personas.

### Cambio solicitado de interfaz — siguiente etapa

El usuario pidió retirar velocidad objetivo, próxima curva y terreno del HUD; conservar velocidad actual, checkpoints, tiempo de vuelta y mejor tiempo; dar más superficie visible al juego. Se cierra primero esta mejora de CPU y después se simplifica el HUD (fases 2/16). Se conservan escapatorias y la posibilidad de salir un poco de pista: no se castiga al jugador con reglas distintas de las del rival.

### Continuación vigente con «siguiente»

Partir de 0.25 y verificar la revisión remota. La limpieza de interfaz solicitada tiene prioridad inmediata. Después continuar ataque/defensa de fase 9 y soporte para uno o dos rivales adicionales; el ritmo de aire libre ya fue revisado. Conservar tamaño de circuitos, inercia, perfiles abiertos y física compartida.


## Avance — build 0.26 (24 de octubre de 2026)

### Fases 2/16 — Espacio visible y datos esenciales

- Se retiraron las tarjetas de velocidad recomendada, próxima curva, terreno y derrape; se conservan velocidad, checkpoints, vueltas, mejor vuelta y minimapa.
- El cronómetro del HUD ahora mide la vuelta actual, en lugar del acumulado de carrera. Se reinicia tras una vuelta válida y mantiene el último tiempo cuando termina el jugador. Resultados y clasificación siguen usando el total.
- La carrera ajusta su alto a la ventana tanto en vista normal como en fullscreen. Contenedor ampliado a 1600 px; se compactan encabezado y controles y se ocultan pie y ayuda secundaria durante la conducción.
- Se conserva la proporción 1000:640. En pantallas con otra relación pueden quedar bandas; no se deforma el circuito ni se reduce la escala del mundo para encajarlo.
- ResizeObserver ajusta el lienzo al contenedor, también en pausa. Cambiar tamaño no invalida los fondos del mundo; búfer limitado a 2560 px de ancho. Salir o terminar restaura el menú.
- Se conservan geometría, superficies, perfiles abiertos, checkpoints y física compartida. No se añade una penalización exclusiva al jugador por salir un poco del asfalto.

### Comprobaciones

- Sintaxis JavaScript, identificadores HTML, archivos referenciados, diez originales y 14 registros, geometría y separación entre ramales: superados.
- Conducción de cuatro modelos, terrenos, freno de mano, inercia y cámaras; pruebas de barreras y casos focalizados de CPU: superados.
- Chromium: datos eliminados, tres tarjetas esenciales, cronómetro de vuelta/reinicio/fin, ausencia de scroll, proporción, HUD exterior, menú y resultado, fullscreen, resize, móvil vertical/horizontal, 14 pistas, dos jugadores, gráficos retro/rendimiento y carreras CPU en Dusty y hielo: superados.
- Capturas de escritorio y cámaras divididas revisadas. No equivalen a conducción humana, prueba de audio ni medición de rendimiento en teléfonos. No se repiten las 42 carreras de 0.25: este cambio no modifica el controlador ni la física.

### Continuación vigente con «siguiente»

Partir de 0.26 y verificar rama/commit remoto. Próxima etapa: fase 9, revisar ataques, defensa y contactos antes de ampliar la parrilla con uno o dos rivales adicionales en fase 10. Sigue pendiente contrastar Sunset y Dusty contra las vueltas humanas de unos 18 s y el uso de escapatorias; no considerar equilibrado el juego solo por las simulaciones. La siguiente ampliación física de trazados debe conservar zonas abiertas y validar duración humana, geometría y checkpoints; esta etapa mejora el área visible de la web.


## Avance — build 0.27 (25 de octubre de 2026)

### Fase 9 — Anticipación y espacio en tráfico

- Verificada rama `main` limpia y remota en `158042f` antes de cambiar código.
- Se conservan circuito, interfaz compacta, coches, inercia y escapatorias. Sigue habiendo una CPU; no se añaden rivales antes de revisar tráfico y contactos.
- La CPU proyecta posiciones con la velocidad y la velocidad angular actuales en una ventana de 0,75 s. Así detecta acercamientos laterales y en arco, además del coche directamente delante.
- El frenado usa la componente de avance del rival; abre espacio ante una entrada lateral próxima en vez de asumir que estar en otro carril es seguro.
- El lado inicial de ataque debe dejar espacio dentro del ancho de pista. Durante el solapamiento conserva el lado físico y pide mayor separación. Si falta espacio contra el borde, el perseguidor baja su objetivo de velocidad y deja pasar.
- No cambia la física, la aceleración ni la velocidad máxima. El perseguidor usa sus frenos normales; el coche no se desplaza artificialmente a otro carril.

### Errores encontrados y corregidos

- La base 0.26 registraba 70 frames con contacto en 14 carreras de dos controladores normales, concentrados en seis pistas. La comprobación previa solo exigía terminar y conservar la carretera; no evaluaba mejora de contactos.
- El primer ajuste de cesión podía detener a la CPU al rodear un coche parado, porque exigía más separación de la que dejaba una curva. Detectado por la prueba física de adelantamiento y Chromium; se corrigió el umbral para conservar un paso seguro y se repitieron las pruebas.
- La predicción inicial recta no describía bien las aproximaciones en curva. Se incorporó la velocidad angular real y pruebas de arcos en ambos sentidos.

### Validación y límites

- La referencia de tráfico se conserva en `tests/fixtures/traffic-0.26.json`, con commit, dificultad, modelo, paso físico y contactos por pista. La prueba exige reducir al menos a la mitad el total en ese mismo escenario.
- Nuevos casos reproducibles: ataque con borde ocupado, reserva lateral, perseguidor sin hueco, entrada lateral con frenado, rival paralelo/divergente sin frenado innecesario, arcos de giro y vehículos detenidos.
- Resultado final de tráfico: **70 → 11 frames con contacto** (84,3 % menos tiempo de contacto) en 14 carreras normales y **84 vueltas válidas**. Todos terminaron y el máximo desvío fue menor que el ancho físico de conducción. Es una referencia determinista de dos controladores, no una garantía frente a un jugador.
- En Dusty aparecieron 11 frames residuales (0 en esa referencia anterior), mientras los otros 13 circuitos terminaron sin contacto en este escenario. Se registra esta regresión local; no se declara resuelta toda la interacción lateral y debe revisarse en fase 11 antes de cerrar el balance.
- 42 carreras de CPU y 126 vueltas válidas: tres dificultades ordenadas, prestaciones compartidas, coste real de freno de mano y mejora de ritmo frente a 0.24 conservados. El benchmark en pista libre mantiene los tiempos de 0.25.
- Superadas sintaxis, integración HTML/archivos/14 pistas, geometría, identidad de trazados, conducción de cuatro modelos, inercia y barreras (37 contornos, 11174 puntos). Los cambios posteriores al pase de barreras se limitaron a la predicción de tráfico; se repitieron los casos afectados.
- Chromium: adelantamiento al detenido, carreras CPU de Dusty y hielo, controles, pausa, reinicio, menú, resultados, 14 pistas, fullscreen, resize en pausa, HUD compacto/cronómetro, ausencia de scroll, minimapa móvil y dos jugadores: superados. Revisada captura de escritorio.
- Pendientes: partidas humanas, conducción/táctil en teléfono, audio y rendimiento medido. Las pruebas móviles verifican distribución y visibilidad.

### Continuación vigente con «siguiente»

Partir de 0.27 y verificar la revisión remota. Próxima fase: **10**, ampliar la parrilla con uno o dos rivales y comportamientos diferenciados, después de adaptar detección de tráfico, colisiones por pares, clasificación, cámaras y resultados. Conservar la interfaz despejada, las escapatorias y prestaciones compartidas; no declarar resuelto el balance contra personas. Los contactos restantes deben seguir registrados al abordar fase 11.


## Avance — build 0.28 (25 de octubre de 2026)

### Fase 10 — Parrilla y personalidades

- Base remota verificada en `37eea1a` y árbol limpio antes de editar.
- Menú de 1, 2 o 3 rivales, con tres por defecto. CPU 1 clásico, Furia agresivo y Ápice preciso; etiquetas y colores propios. La parrilla se escalona sobre la pista sin solapar coches y antes del primer checkpoint.
- Se reutiliza la lógica de maniobra de fase 9 por cada vecino. El tráfico cercano se ordena físicamente y todos sus límites de velocidad se consideran; conserva estados independientes y descarta los de coches alejados.
- Dificultad y estilo componen decisiones de conducción con límites máximos de ritmo/frenado. Furia busca atacar con menor ventaja de velocidad; Ápice requiere una oportunidad más clara y responde con mayor precisión. No se añaden prestaciones al Balanced.
- Los contactos ya no se limitan a los dos primeros coches. Se corrige además el mínimo anterior de 30 que aceleraba un coche parado al tocarlo: el contacto solo puede quitar velocidad.
- Clasificación por tiempo de finalización y luego progreso; indicador POS compacto, resultados de todos los coches y campeonato individual 25/18/15/12. Quienes no terminan reciben cero. Se conserva el límite de 18 s tras el primer finalista.
- Modo local conserva dos humanos y sus cámaras. No cambian geometría, superficies, récords, escapatorias ni el resto del HUD.

### Comprobaciones

- Se incorpora `tests/validate-grid.mjs`: selector, estilos distintos en la misma situación de ataque, múltiples amenazas, pares de contacto, coche detenido, clasificación, puntos, continuidad y dos humanos.
- Las pruebas clásicas fijan explícitamente un rival para conservar la comparación con versiones previas; la nueva batería comprueba la parrilla ampliada de forma separada.
- **20 carreras de parrilla, 80 finalizaciones y 240 vueltas válidas**: Normal en las 14 pistas y Fácil/Difícil en Sunset, Dusty y hielo. Desvío máximo observado 36,8 unidades, dentro del ancho físico de 42. Todos terminaron en la simulación completa.
- Contactos de parrilla: Normal suma 19 frames (10 Dusty, 9 Coastline); Fácil cero en las tres pistas comprobadas; Difícil cuatro en Dusty. Son contactos residuales, no carreras universalmente libres de choques. El benchmark de dos coches mantiene 11 frames frente a la referencia de 70.
- **42 carreras clásicas y 126 vueltas válidas**: dificultades ordenadas, límites físicos y coste de freno de mano conservados. Tráfico clásico: 14 carreras y 84 vueltas válidas.
- Superadas sintaxis, IDs HTML/archivos, 14 pistas/diez originales, geometría, identidad, conducción, inercia y barreras (37 contornos/11174 puntos).
- Chromium: selector 2/3 rivales, cuatro coches, reinicio, carrera completa de parrilla, nombres/resultados y continuidad con siguiente circuito, vuelta a modo local; además controles, fullscreen, resize, HUD, cronómetro, minimapa y distribución móvil. Captura con cuatro coches revisada.
- Se comprobaron también los cuatro valores de puntos 25/18/15/12 y la ausencia de puntos para quien no termina. La prueba del coche seguro cercano más otro obstáculo más adelante confirma que se consideran varias amenazas.
- Pendientes: pruebas con jugadores, todos los modelos humanos en tráfico de cuatro coches, controles táctiles/audio/rendimiento medido, fallos deliberados y rasgos más amplios de personalidad. Las pruebas aceleradas no aplican el cierre visual de 18 s; Chromium comprueba el flujo de resultados y siguiente etapa.

### Continuación vigente con «siguiente»

Partir de 0.28 y verificar main. Próxima fase: **11**, revisar contactos en grupo, separación tras impactos, interacción con barreras y recuperación con varios coches y modelos. Mantener los contactos residuales como referencia y no declararlos resueltos por completar carreras. Conservar la parrilla, estilos, interfaz compacta y pistas abiertas. Después continuar ambientación/feedback, sin ampliar circuitos antes de validar geometría y duración humana.


## Avance — build 0.29 (25 de octubre de 2026)

### Fase 11 — Contactos y recuperación

- Base limpia y remota verificada en `42cbaff`.
- La prueba nueva detectó que una única pasada por las parejas dejaba coches interpenetrados en un amontonamiento. Ahora se resuelve hasta 16 pasadas, con salida temprana al separar el grupo.
- Cada empujón vuelve a comprobar las mismas vallas/neumáticos visibles. El caso de cuatro coches contra una valla se separa conservando el lado permitido y sin añadir velocidad.
- Se reemplaza la pérdida fija de 54×dt por impacto normal relativo, una vez por pareja en el paso. Se disipa velocidad de los coches que se acercan; no se acelera a la víctima ni se añade rebote. El roce paralelo a la misma velocidad no frena por sí solo.
- Los empujones finales actualizan posición, terreno y cruces reales de checkpoints/meta. La prueba exige contar una meta válida una vez, sin perder ni duplicar la vuelta.
- Se corrige otra fuente de aceleración artificial: los mínimos de 14/12 en escapatorias se limitan a la velocidad que ya tenía el coche. Detenido sin acelerador permanece detenido; el acelerador y la dirección siguen permitiendo recuperar desde reposo.
- Se conservan parrilla, estilos, prestaciones, HUD, pistas y zonas abiertas. No se añade una recuperación exclusiva de CPU mediante teletransporte.

### Comprobaciones

- `tests/validate-collisions.mjs`: fallo original reproducido antes del arreglo; separación de cuatro coches, inmovilidad, roce paralelo, alcance/frontal, 30/120 FPS, valla, meta y recuperación desde reposo de cuatro modelos en tres superficies.
- **20 carreras de parrilla, 80 finalizaciones y 240 vueltas válidas**: Normal en 14 pistas; Fácil/Difícil en Sunset, Dusty y hielo. Máximo desvío 36,8, dentro del ancho físico de 42. Normal registra 15 frames con contacto (10 Dusty, 5 Coastline), frente a 19 en 0.28; Difícil 3 frente a 4; Fácil cero en las tres pistas comprobadas.
- **42 carreras clásicas y 126 vueltas válidas**, dificultades ordenadas y prestaciones compartidas conservadas. Tráfico de dos controladores: **14 carreras/84 vueltas**, 11 frames con contacto; no se declara eliminado todo contacto.
- Superadas sintaxis, IDs HTML/archivos, diez originales/14 registros, geometría, identidad de trazados, conducción, inercia y barreras (37 contornos/11174 puntos).
- Chromium: amontonamiento de cuatro coches sin velocidad generada ni checkpoints falsos, carrera completa de parrilla, resultados/siguiente circuito, controles, pausa, reinicio, menú, fullscreen, resize, HUD/cronómetro, minimapa móvil y dos jugadores. Captura de separación revisada.
- Pendientes: conducción humana, contactos residuales, volumen circular simplificado entre coches, táctil/audio y rendimiento medido. La recuperación de los cuatro modelos se comprobó mediante controlador automático con física real, no con una persona al volante.

### Continuación vigente con «siguiente»

Partir de 0.29 y verificar main. Próxima fase: **12**, mejorar ambientación y colocación de elementos temáticos sin ocultar curvas ni perder las escapatorias. Mantener las nuevas pruebas de contacto, las carreras de parrilla y el benchmark clásico. El balance humano, contactos residuales y la forma simplificada entre coches siguen documentados; no declarar terminadas las 24 fases ni agrandar trazados sin revisar geometría y duración de vuelta humana.


## Avance — build 0.30 (25 de octubre de 2026)

### Fase 12 — Ambientación con escapatorias libres

- Base limpia y remota verificada en `57aafe8`. La decoración anterior repetía una cuadrícula, usaba muestreo salteado para distancia y no reservaba la huella completa.
- Nuevo catálogo temático para los 14 circuitos: vegetación propia, cactus/mesetas, pinos/cabañas, selva, basalto, arquitectura nocturna, puerto, grúas/contenedores/tanques, tribunas con público y pradera con flores. Dibujado original con primitivas de Canvas, sin recursos externos nuevos.
- Variación reproducible de posición, tamaño y tipo; hitos grandes se colocan antes de llenar huecos. Cada objeto reserva su radio completo, sombra incluida; evita otros objetos y bordes del mundo.
- Distancia exacta a los segmentos completos y margen libre de 124 unidades desde el centro de pista, para conservar las escapatorias. La decoración nueva no añade obstáculos físicos ni muros.
- Detallados incorpora sombras, capas y detalles; Retro simplifica; Rendimiento reduce densidad/detalles. Caché de colocación por circuito/calidad y fondo estático compartido con el render existente.
- No cambian trazados, récords, superficies, física, CPU, campeonato ni el HUD despejado.

### Comprobaciones

- `tests/validate-scenery.mjs`: 962 colocaciones en 14 pistas y tres calidades. Comprueba huella visible, distancia a segmentos, límites de mundo, separación entre objetos, variedad, generación repetible y caché. Detallados: 385 objetos; Rendimiento: 247.
- Chromium renderizó los 14 escenarios sin errores. Se revisaron capturas de puerto, desierto, hielo, estadio, selva, volcán, costa e industria; curvas y escapatorias permanecen legibles. Campeón tiene menos decoración por el espacio disponible, sin forzar objetos dentro del margen.
- Superados controles, pausa, reinicio, menú, fullscreen, resize, HUD/cronómetro, minimapa móvil, gráficos Retro/Rendimiento, carreras CPU de Dusty/hielo, parrilla completa/resultados/siguiente etapa y separación de cuatro coches.
- Superadas sintaxis, IDs HTML/archivos, diez originales/14 registros, geometría, identidad, colisiones/recuperación, CPU/tráfico focalizados y dos carreras completas de parrilla en Sunset/Dusty (24 vueltas válidas). No se repiten las 42 carreras clásicas ni las 20 de parrilla completas: esta etapa no modifica física ni controladores; la referencia publicada de 0.29 se conserva.
- Pase final de conducción, inercia y barreras superado: cuatro modelos, cámaras/terrenos, 37 contornos y 11174 puntos geométricos. No se midieron FPS ni se condujo en un teléfono; la comprobación móvil cubre distribución y visibilidad.

### Pedidos añadidos durante esta etapa

- Fase 16: pantalla inicial más linda y cómoda.
- Fase 13: bandera a cuadros y cierre visual de carrera.
- Fase 17: tabla de puntos clara por carrera y total.
- Fase 10: otra revisión de competitividad y nombres ficticios de los rivales, manteniendo coherencia entre las pantallas. Se incorporan como trabajo pendiente, sin marcarlo implementado ni mezclarlo con esta etapa.

### Continuación vigente con «siguiente»

Partir de 0.30 y verificar main. Próxima fase: **13**, efectos/feedback y bandera a cuadros solicitada; conservar la visibilidad de quienes siguen compitiendo, los límites de partículas y la accesibilidad. Después abordar pantalla inicial y tabla de puntos en sus fases, manteniendo el pedido de mejores CPU/nombres registrado en fase 10. No repetir la ambientación ya comprobada ni cambiar geometría sin validación de recorrido y vueltas humanas.


## Avance — build 0.31 (25 de octubre de 2026)

### Fase 13 — Bandera y cierre de carrera

- Base limpia y remota verificada en `0da765e`.
- Aviso con icono a cuadros en la franja de estado existente, fuera del lienzo. Identifica a quien terminó e indica que el jugador puede seguir; al llegar el jugador muestra su puesto y espera a los rivales.
- Se centraliza la condición de cierre: todos terminan o 18 s después del primer finalista válido. El contador se congela al pausar; el aviso se restaura al reanudar. Los avisos hablados cambian por llegada y el contador queda excluido del anuncio por segundo.
- Resultados con bandera propia de CSS, animación limitada a tres ciclos (4,8 s) y desactivación por `prefers-reduced-motion`. Identifica al ganador y añade puesto/tiempo personal o sin terminar; en modo local muestra ambos tiempos.
- Foco programático al título de resultados; botones de siguiente circuito y menú conservados. Se protege el cierre contra llamadas repetidas para evitar sumar puntos dos veces.
- No se cambian física, CPU, trazados, límites de partículas, récords ni puntos por puesto. No se añade una superposición de llegada sobre la pista.

### Errores encontrados y comprobaciones

- La primera revisión perdía el aviso de llegada después de pausa/reanudación. Se corrigió y se añadió la regresión a Node y Chromium.
- `tests/validate-finish.mjs`: primeros finalistas, continuidad del humano, ausencia de anuncios cada frame/segundo, plazo exacto, pausa/reanudación, cronómetro de última vuelta, puesto/tiempo, sin terminar, puntos una vez, reinicio y modo local.
- Chromium: aviso no reduce ni tapa el lienzo; humano sigue acelerando, reloj en pausa y aviso restaurado, móvil vertical/horizontal sin scroll de carrera, reinicio limpia bandera, foco en resultados, resumen, tres ciclos de animación y movimiento reducido. Revisadas capturas de aviso y resultados en escritorio/móvil.
- Sintaxis, IDs/archivos, diez originales/14 registros, geometría, identidad, cuatro modelos, dirección, colisiones/recuperación y barreras (37 contornos/11174 puntos): superados. Casos focalizados de CPU/tráfico y parrilla Sunset/Dusty: dos carreras/24 vueltas válidas. No se repiten las 42 carreras clásicas ni las 20 de parrilla completas: no cambia el controlador ni la física.
- Repetición final de Chromium superada tras corregir pausa/reanudación; nueva captura del aviso sin superposición revisada. Siguen pendientes conducción humana, audio y medición de rendimiento/dispositivos físicos.

### Hito orientativo — base principal buena y cómoda

Ante la consulta del usuario, se estima **unas seis entregas después de 0.31**: fase 14 (coches), 15 (audio), 16 (pantalla inicial/HUD), 17 (resultados/tabla de puntos), otra pasada de fase 10 (CPU/nombres) y fase 23 (pruebas completas/correcciones). Es una estimación de alcance, no una garantía de que no aparezcan regresiones ni una declaración de terminado. Editor, progresión ampliada y otras mecánicas permanecen en las 24 fases para ampliaciones posteriores.

La base debe permitir entrar, configurar y correr cómodamente; reconocer coches/rivales y estados de carrera; consultar resultados/puntos claros; y completar las pistas con CPU competitiva y sin errores bloqueantes. El balance requiere probar contra personas, especialmente los tiempos de Sunset/Dusty y las escapatorias.

### Continuación vigente con «siguiente»

Partir de 0.31 y verificar main. Próxima fase: **14**, mejorar lectura y respuesta visual de los coches, conservando los cuatro modelos, pinturas, física y controles. Seguir después audio, pantalla inicial y tabla de puntos; mantener la pasada de CPU/nombres y las pruebas finales como parte del hito de base principal. No marcar completo el balance humano ni volver a desarrollar la bandera que ya está implementada.


## Avance — build 0.32 (25 de octubre de 2026)

### Fase 14 — Coches reconocibles y feedback de conducción

- Base limpia y remota verificada en `cf4eebe`.
- Se reemplaza el dibujo único por perfiles de carrocería propios para los cuatro modelos, conservando las seis pinturas: Balanced compacto, Corner King de ruedas expuestas, Speed Demon afilado y Rally Fox ancho/protegido.
- Ruedas delanteras giran según la dirección suavizada real; las bandas de rodadura siguen el avance del coche y quedan quietas en reposo. Luces traseras responden al freno y freno de mano de humanos/CPU.
- Sombras, contorno, cristales, bordes iluminados, faros y rasgos de cada modelo mejoran lectura. El destello de impacto actúa sobre el contorno y conserva el color identificable.
- Se corrige la posición de las marcas de derrape: eje y separación trasera usan la misma definición visual que las ruedas, en lugar del desplazamiento fijo anterior.
- Detallados conserva las capas y detalles; Retro simplifica; Rendimiento omite bandas animadas y detalles. La preferencia de movimiento reducido desactiva rodadura decorativa, sin ocultar dirección/freno.
- El render guarda/restaura su estado y no modifica al coche. Los nuevos estados `braking`/`wheelTravel` solo comunican controles/avance; reinicio y recolocación los limpian. No cambian modelos físicos, colisiones, trazados, récords ni dificultad.

### Comprobaciones

- `tests/validate-car-visuals.mjs`: cuatro modelos × seis pinturas × tres calidades (**72 combinaciones**), color conservado en impacto, dibujo finito dentro del contorno visual establecido, estado de Canvas restaurado y simulación sin mutar.
- Entradas reales de física: giro/contravolante, luces de freno/freno de mano, avance y ruedas quietas, marcas coincidentes con ambos neumáticos traseros de cada modelo, movimiento reducido y reinicio.
- Chromium: atlas del render real con cuatro modelos/seis pinturas/tres calidades; capturas revisadas. Dirección/freno de teclado, movimiento reducido, controles de carrera, HUD, pausa, fullscreen, resize, cámaras, bandera/resultados, varios rivales y dos jugadores: superados.
- Conducción de cuatro modelos, inercia, geometría, identidad, HTML/archivos/diez originales/14 registros, colisiones/recuperación, llegada y barreras (37 contornos/11174 puntos): superados. CPU/tráfico focalizados y dos carreras de parrilla Sunset/Dusty (24 vueltas válidas): superados, con tiempos conservados.
- No se repite la batería completa de 42 carreras clásicas/20 de parrilla: no se modifica la conducción. Siguen pendientes percepción humana, audio, controles táctiles y rendimiento medido; no se declara resuelto el balance con jugadores.

### Continuación vigente con «siguiente»

Partir de 0.32 y verificar main. Próxima fase: **15**, mejorar motor, frenado/derrape, impactos y señales sonoras conservando el interruptor, evitando saturación y respetando pausa/menú. Después pantalla inicial/HUD (16), resultados/puntos (17), pasada de CPU/nombres (10) y pruebas/correcciones (23): **unas cinco entregas estimadas** para el hito de base principal, sujetas a lo que encuentren las pruebas. Mantener físicas, pistas abiertas y render de coches recién comprobado.


## Avance — build 0.33 (25 de octubre de 2026)

### Fase 15 — Motor, agarre y señales sonoras

- La fase 14 se publicó y verificó primero en `5cda006`. Ante el nuevo «siguiente» se continuó con esta fase, sin reemplazar ni perder el render de coches.
- Motor con capa fundamental/subgrave y filtro; timbre y régimen vinculado a modelo, velocidad, acelerador y frenado. El régimen sonoro es un recurso arcade, no introduce cambios mecánicos.
- Ruido propio generado para derrape/frenado y terreno; mezcla normalizada para hasta dos humanos. Los rivales no duplican sus motores en esa mezcla.
- Señales distintas de cuenta regresiva, salida, checkpoint, vuelta, récord y resultados. Se corrige la confusión de checkpoints de CPU que sonaban como los del jugador. Solo la primera llegada de CPU avisa el cierre; el humano conserva su señal de llegada.
- Impactos limitados por proximidad, intensidad y tiempo mínimo. Una corrección estática de penetración contra valla ya no suena como un choque.
- Un contexto reutilizado, mezcla maestra con compresión, rampas suaves y límite de ocho voces transitorias. Fuentes/filtros se desconectan al terminar; el motivo de resultados espera la limpieza de las voces de carrera.
- Pausa, OFF, pestaña oculta y menú silencian motor/capas/efectos. Se conserva solo una breve señal en resultados, con motores apagados. Recupera contextos suspendidos desde gestos de usuario; si Web Audio falta o falla, el juego continúa.
- No cambian física, dificultad, superficies, trazados, puntuación ni controles.

### Errores encontrados y comprobaciones

- Se corrigió que repetidos pedidos de silencio podían posponer el fin de una voz: ahora cada fuente inicia su salida una sola vez. Prueba de regresión incluida.
- La primera medición de Chromium se hizo antes de que el analizador tuviera un bloque; se inicializó antes del intervalo de muestra. No se confundió esa lectura inicial vacía con una comprobación auditiva.
- `tests/validate-audio.mjs`: cuatro timbres, mezcla de humanos, derrape/terreno, CPU sin avisos de checkpoint, límite de voces y limpieza, pausa/OFF/visibilidad/menú, reutilización, modo local, motivo final, corrección estática silenciosa y fallback sin API/constructor fallido: superados.
- `tests/browser-audio.cjs`: Web Audio real tras clic de usuario, motor y derrape audibles en muestras, silencio tras pausa/OFF/menú, recuperación al encender, contexto reutilizado, dos humanos y resultados: superados. Muestra de motor RMS 0,0206/pico 0,0505; silencio muestreado RMS 0. No constituye escucha humana ni medición de latencia móvil.
- Chromium completo: controles, coches/pinturas/calidades, pausa, menú, HUD, fullscreen/resize, minimapa, bandera/resultados, parrilla y modo local: superado. Sintaxis, HTML/archivos, geometría/identidad, diez originales/14 registros, conducción, inercia, colisiones/recuperación y llegada: superados. Casos focalizados CPU/tráfico y dos carreras de parrilla (24 vueltas): superados.
- Pase final de barreras (37 contornos/11174 puntos) y repetición del grafo tras la última limpieza: superados. Escucha humana, hardware, interrupciones reales de dispositivos y balance siguen pendientes.

### Reporte de carrera real del usuario

El usuario indicó que persisten varios errores y adjuntó tres grabaciones. La herramienta de transferencia rechazó los archivos por superar 32 MiB cada uno; no se pudieron reproducir ni atribuir fallos concretos al video. Se solicitó un recorte/comprimido bajo ese límite o capturas. Revisar ese material y priorizar errores reales antes de declarar estable la base. Las pruebas automáticas no invalidan el reporte del usuario.

### Continuación vigente con «siguiente»

Partir de 0.33 y verificar main. Priorizar la revisión del reporte de carrera si llega material accesible; corregir fallos reproducibles y repetir pruebas afectadas. Después continuar **fase 16**, pantalla inicial más linda/cómoda y HUD, conservando el espacio de conducción. Tabla de puntos (17), CPU/nombres (10) y pruebas/correcciones (23) siguen en el hito de base principal; son unas cuatro entregas orientativas, sujetas a los problemas reales que aparezcan. No marcar el balance humano ni las 24 fases como terminadas.


## Avance — build 0.34 (25 de octubre de 2026)

### Fase 16 — Paddock y selección de carrera

- Se continúa desde main 0.33 (`c67321d`), conservando coches y audio ya publicados.
- Menú organizado en configuración, garaje y presentación de próxima carrera. Se mantienen todas las opciones y modos existentes.
- Vista previa de los 14 trazados reales, checkpoints, bandera de meta/sentido, perfil de barreras efectivo y récord de la versión actual. No cambia la pista activa ni sus coches.
- Vista del coche con el mismo render de carrera, cuatro modelos/seis pinturas y descripción existente. Resumen de vueltas, rivales y dificultad junto a los botones.
- Corrección funcional: el manejador global interceptaba flechas, Enter y espacio incluso en el menú. Ahora respeta controles nativos; al iniciar se enfoca el lienzo y al regresar el título. La selección de pista sigue el avance del campeonato.
- Escritorio en dos columnas, disposición móvil apilada, controles secundarios desplegables, tamaños de selección cómodos y fuente de respaldo monoespaciada cuando la externa falla. Se conserva el HUD exterior y el espacio de conducción.
- No cambia física, CPU, trazados, puntuación ni récords. No se añaden controles táctiles.

### Comprobaciones

- Sintaxis, integración HTML/archivos, diez originales/14 registros, identidad y geometría; conducción, inercia, colisiones, barreras, llegada, render de coches y grafo de audio: superados.
- `validate-menu.mjs`: 14 mapas con checkpoints/récords/perfiles, resumen de rivales/dificultad, 24 combinaciones de modelo/pintura, vistas sin mutar simulación y selección conservada al avanzar.
- Chromium: selectores con flechas/Enter, sonido con Enter, inicio con Enter/foco al lienzo, vistas previas, móvil sin desbordamiento, controles desplegables y flujo de carrera completo. Capturas de escritorio y móvil revisadas.
- Audio real de Chromium: salida de motor/derrape, pausa/OFF/menú silenciosos, reanudación, dos humanos y motivo de resultados: superado. No constituye escucha humana.
- Casos focalizados CPU/tráfico y parrilla Sunset/Dusty repetidos; no se repite la batería completa de 42/20 carreras en una fase de interfaz.
- Pendientes: dispositivos físicos, controles táctiles, percepción humana del manejo y errores reportados en grabaciones que superan el límite de transferencia; no se afirma haberlas visto.

### Continuación vigente con «siguiente»

Partir de 0.34 y verificar main. Continuar **fase 17**, tabla clara de resultados/puntos por carrera y total, manteniendo nombres/orden de campeonato y sin terminar. Después revisión CPU/nombres (10) y pruebas/correcciones (23), sin considerar cerrados el balance humano ni los errores reportados.


## Avance — build 0.35 (25 de octubre de 2026)

### Fase 17 — Resultados y tabla de puntos

- La fase 16 se publicó y verificó en main (`3c2f805`) antes de continuar.
- El párrafo que mezclaba resultados y campeonato se reemplaza por dos tablas semánticas: carrera con tiempos, diferencias, mejor vuelta y puntos; campeonato con puesto acumulado, premio de esta carrera y total.
- Conserva nombres/colores por identidad, destaca humanos y muestra sin terminar con vueltas completadas y cero puntos. No modifica el reparto 25/18/15/12 ni el cierre de carrera.
- Orden acumulado estable por puntos; los empates comparten puesto. Se corrige un error real del final de temporada: ante igualdad se declaraba campeón al primero del arreglo. Ahora se anuncia empate entre todos los líderes.
- Dos columnas en escritorio y tablas apiladas en móvil, encabezados y captions accesibles, continuidad de foco de llegada y botones de continuación/menú.
- No cambia física, trazados, barreras, IA, dificultad ni récords. Contrarreloj y desafíos quedan expresamente pendientes dentro de la fase 17.

### Comprobaciones

- `validate-results.mjs`: orden de llegada, tiempo/diferencia/mejor vuelta, sin terminar y cero puntos, puntos acumulados a través de dos etapas, mismos pilotos, empate de puestos/final, render sin premio adicional, fin repetido sin doble puntuación, nueva temporada, 1–3 rivales y modo local: superado.
- Chromium completo: ambas tablas, cuatro nombres, puntuación, foco, siguiente circuito y vista móvil sin desbordamiento; capturas de escritorio/móvil revisadas. Continúan pasando los flujos de menú, teclado, carrera, pausa, reinicio, cámaras, pantalla completa, resize, bandera, coches y modo local.
- Sintaxis, integración HTML/archivos/diez originales/14 pistas/70 perfiles, geometría, identidad, conducción, inercia, colisiones, barreras, coches, llegada, menú y grafo de audio: superados. Casos focalizados de CPU/tráfico y parrilla Sunset/Dusty: 24 vueltas válidas; tiempos conservados y 10 frames de contacto residuales en Dusty, cero en Sunset.
- No se repiten las 42/20 carreras completas ni la medición física de audio ya pasada en 0.34: esta etapa modifica tablas y presentación/premio compartido, con su regresión específica. No se mide FPS ni se declara balance humano resuelto.
- Sigue pendiente revisar las grabaciones del usuario, no transferibles por superar 32 MiB, y probar sensaciones en dispositivos físicos. Las pruebas no invalidan su reporte de errores.

### Continuación vigente con «siguiente»

Partir de 0.35 y verificar main. Próxima entrega: revisión de **CPU y nombres (fase 10)**, contrastando especialmente Dusty/Sunset y escapatorias, sin ventajas físicas ocultas. Después **fase 23**, pruebas completas y correcciones del hito de base principal. Son dos entregas orientativas, no una garantía de terminar todos los errores; las 24 fases incluyen funciones futuras que siguen pendientes. Si llega material de carrera accesible, priorizar fallos reproducibles.


## Avance — build 0.36 (25 de octubre de 2026)

### Revisión de fase 10 — CPU en paralelo y nombres

- Base main verificada en `69211e8`, sin cambios locales ajenos.
- Se reproduce el roce de Dusty en el paso por meta: el punto lejano de seguimiento de la CPU recorta la curva sobre el carril ocupado en paralelo.
- `aiLookAhead` acorta el objetivo solo si hay solapamiento, otro coche activo a menos de 50 unidades y las trayectorias actuales predicen separación menor a 29. Considera todos los rivales, conserva el objetivo normal con espacio y la recuperación a baja velocidad.
- Se descartaron dos variantes generales: mejoraban Dusty pero añadían 8/11 frames de roce en Sunset. El ajuste final por proximidad/riesgo mantiene cero en Sunset y elimina los diez de Dusty Normal.
- TRAZO reemplaza el nombre genérico CPU 1; FURIA y ÁPICE conservan sus identidades. El menú muestra nombre/estilo de los rivales seleccionados y la misma fuente alimenta etiquetas, avisos y tablas. Claves de puntuación conservadas.
- Mantiene estilos existentes de ataque/respuesta y las tres dificultades. No hay aumento de potencia/agarre/velocidad máxima, cambios de pista, castigo nuevo al jugador ni ayudas invisibles.

### Comprobaciones y límites

- Nuevo `validate-rival-awareness.mjs`: convergencia cercana, carril paralelo libre, rival lejano/finalizado, segundo rival del grupo, recuperación lenta, nombres según cantidad y límites físicos por dificultad: superado.
- Las 42 carreras clásicas (126 vueltas) terminan en las 14 pistas y tres dificultades; límites compartidos y orden Difícil < Normal < Fácil conservados. Normal libre conserva Dusty 19,40 s y Sunset 22,39 s por vuelta de referencia; no se fuerza el rango humano de 25–45 s reduciendo velocidad.
- Parrilla Normal: cuatro finalistas/12 vueltas por pista; total de contacto 15→4 frames. Sunset 0→0, Dusty 10→0, Coastline 5→3; aparece 1 en Jungle que debe seguirse. En Dusty Fácil aparece 1 frente a cero previo; no se oculta esa regresión local. Difícil Dusty 3→0.
- Batería completa de esta revisión: 42 carreras clásicas (126 vueltas), 20 de parrilla (240 vueltas) y 14 de tráfico de dos coches (84 vueltas): **76 carreras y 450 vueltas válidas**. El benchmark de dos coches registra 12 frames con contacto frente a 11 previos: Dusty 10 y Neon 2. Sigue mejor que los 70 de 0.26, pero es una regresión de un frame respecto de 0.35 y queda abierta para fase 23; no se afirma mejora universal.
- Regresión explícita en `validate-grid.mjs` impide volver a introducir contactos en las carreras de referencia Normal Sunset/Dusty; se repite después de añadirla.
- Chromium completo: carreras/CPU/tráfico, nombres, resultados, puntos, menú, teclado, pausa/reinicio, cambio de etapa, cámaras/fullscreen/resize, móvil, dos jugadores, modelos/calidades y movimiento reducido: superado. Captura de resultados con nombres revisada.
- Sintaxis, geometría, identidad, HTML/archivos/diez originales/14 pistas/70 perfiles, conducción/inercia, colisiones, barreras (37 contornos/11174 puntos), llegada, menú, resultados, coches y grafo de audio: superados.
- Conducción humana, hardware, escapatorias usadas por jugadores, errores razonables/personales de CPU y revisión de videos siguen pendientes. No se declara resuelto el reporte de dos vueltas de ventaja ni se presenta una simulación sin contactos como una partida humana.

### Continuación vigente con «siguiente»

Partir de 0.36 y verificar main. Próxima entrega: **fase 23**, batería de juego y correcciones para la base principal, priorizando contactos residuales (Jungle/Coastline Normal, Dusty Fácil y tráfico de dos coches en Dusty/Neon), pausa/reinicios/checkpoints y carreras humanas reproducibles. Mantener el objetivo de vueltas más largas y pistas abiertas para la siguiente revisión de trazados, validando geometría y ritmo humano. El hito principal no equivale a completar modos futuros, editor ni las 24 fases; no declarar el juego libre de errores.


## Avance — build 0.37 (25 de octubre de 2026)

### Fase 23 — Pruebas completas y estabilidad

- Base main verificada en `19e8fe9`; los cambios anteriores ya estaban publicados.
- Se reproduce el riesgo de dos cadenas de `requestAnimationFrame` al pausar/reanudar antes de consumir el frame programado. Pausa cancela el pendiente, limpia teclas, dibuja la superposición inmediatamente y actualiza etiqueta/estado accesible. Reanudar programa una sola cadena.
- Ocultar la pestaña pausa una carrera activa; la vuelta requiere acción manual y no cambia una pausa ya existente. Se conserva el silencio de pausa/OFF/menú y reinicio recupera el botón normal.
- Se corrige el redondeo que podía mostrar `00:60.0`: primero se calculan décimas enteras, luego minutos/segundos. Los tiempos internos/orden/récords no se redondean ni se migran.
- La CPU establece 1,5 veces más rápido su objetivo de carril solo en el conflicto cercano ya detectado por el seguimiento corto. No mueve directamente el coche ni añade fuerza/dirección, potencia o agarre. El resto de las decisiones conserva sus parámetros.
- Se descarta anticipar más ampliamente el seguimiento corto: añadía contactos y salidas locales. Se conserva el disparador por proximidad de 0.36.

### Resultados comprobados

- `validate-race-lifecycle.mjs`: 100 pausas/reanudaciones rápidas, una cadena de frames, cancelación en pausa/menú, teclas no retenidas, evento oculto/repetido/vuelta visible sin reanudación automática, reinicio local y límites de redondeo al minuto: superado.
- `validate-rival-awareness.mjs` añade reacción de carril en un conflicto real por física, sin potencia extra. Regresión en tráfico impide volver a introducir contactos en las carreras de dos coches Sunset/Neon/Dusty.
- Batería completa: **42 carreras clásicas/126 vueltas**, **20 de parrilla/240 vueltas** y **14 de tráfico/84 vueltas**; 76 carreras y 450 vueltas válidas. Dificultades ordenadas y prestaciones compartidas conservadas.
- Tráfico de dos coches: 12→7 frames de contacto; Sunset/Neon/Dusty en cero. Los siete aparecen en Meadow, que antes tenía cero: regresión local abierta.
- Parrilla Normal: total 4→4; Jungle 1→0 y Coastline 3→4, otras pistas cero. Dusty Fácil 1→0; Dusty Difícil 0→2. No se presenta la reducción de un escenario como ausencia de contactos en todos.
- Chromium completo y Web Audio real: carrera/pausa/reinicio/menú, evento de visibilidad simulado, foco/teclado, pantalla completa/resize, HUD/minimapa, bandera/resultados/puntos, 14 pistas, tráfico/parrilla, coches/calidades, dos humanos y móvil: superados. Audio: motor/derrape, silencio muestreado en pausa/OFF/menú, reanudación y resultados.
- Sintaxis, HTML/archivos/diez originales/14 pistas/70 perfiles, geometría/identidad, conducción, inercia, colisiones, barreras (37 contornos/11174 puntos), escenarios (962 colocaciones), menú, llegada, resultados y coches: superados. No se han medido FPS de dispositivos ni reemplazado una carrera humana por las simulaciones.
- Pendientes: contactos residuales indicados, sensaciones humanas/salidas de pista, dispositivos físicos y revisión de las grabaciones que no pudieron transferirse por superar 32 MiB. La base no se declara libre de errores y el balance humano sigue abierto.

### Continuación vigente con «siguiente»

Partir de 0.37 y verificar main. Continuar **fase 24**, consolidación de entrega web y documentación sin perder estas regresiones; mantener pruebas de estabilidad y registro de contactos. El editor, contrarreloj/desafíos, progresión ampliada y otras partes de las 24 fases siguen pendientes. Una revisión futura de trazados debe conservar escapatorias y validar el objetivo de 25–45 s con conducción humana.


## Avance — build 0.38 (25 de octubre de 2026)

### Fase 24 — Consolidación de entrega web

- La fase 23 se publicó y verificó primero en main (`a0e32cd`). No se cambian la física ni los resultados de sus 76 carreras.
- HTML declara versión de aplicación; CSS y JavaScript usan la misma versión en sus URLs. Al recibir HTML nuevo, el navegador solicita recursos de esa entrega y evita mezclar el menú nuevo con un script anterior en caché.
- La validación de integración comprueba existencia del archivo ignorando consulta/fragmento, coincidencia de versión entre recursos y pie, IDs y registros existentes. Las pruebas de navegador sirven correctamente esas URLs versionadas.
- `browser-release.cjs` abre los tres archivos reales, sin puente de estado ni modificación del código: ruta `/f1/`, recursos antiguos preparados en caché, CSS/JS de igual versión, 14 pistas, selección, cuenta regresiva, conducción real por teclado, pausa/reinicio/menú y cero errores de JavaScript. La comprobación de apertura directa de `index.html` quedó pendiente: Chromium administrado bloqueó la navegación con `ERR_BLOCKED_BY_ADMINISTRATOR`; no se intenta eludir esa política.
- Se añaden notas de entrega con estado verificable, limitaciones y pendientes. No se borran hojas de ruta históricas ni se declaran terminadas las 24 fases.

### Comprobaciones y publicación

- Sintaxis, geometría/identidad, integración, ciclo de carrera, conciencia de rivales, conducción/inercia, colisiones, barreras, menú, llegada/resultados y casos focalizados CPU/tráfico/parrilla: superados. Dos carreras de parrilla Sunset/Dusty suman 24 vueltas válidas; sin contactos en esas referencias Normal.
- Chromium completo, audio real y prueba de entrega sin instrumentación: superados. No se repiten las 42/20/14 carreras completas tras añadir solo versiones a los recursos; se conserva su registro de 0.37 y sus contactos pendientes.
- El acceso público a `https://gomeza2.github.io/f1/` no pudo comprobarse: el proxy devolvió `Tunnel connection failed: 403 Forbidden`. Esto no prueba que el sitio esté caído ni desplegado. La subida/verificación de main y el estado de GitHub Pages son comprobaciones distintas.
- La consulta versionada evita mezclar recursos cuando llega HTML nuevo; no fuerza actualizar un documento HTML que el navegador todavía mantenga en caché. Se conserva apertura local y compatibilidad sin dependencias del juego.
- Pendientes del hito: prueba humana y videos accesibles, contactos de Meadow/Coastline/Dusty Difícil, dispositivos físicos, rendimiento medido y calibración de vueltas. No se etiqueta la entrega como versión estable definitiva.

### Continuación vigente con «siguiente»

Partir de 0.38 y verificar main. La siguiente prioridad de producto es volver a **fases 3/5**, recorrido y variedad: ampliar/rediseñar Sunset con más recorrido útil, escapatorias y objetivo humano de 25–45 s, conservando coche/ancho/velocidad y comprobando geometría/checkpoints/CPU. No ralentizar artificialmente el coche. Mantener abiertos los contactos registrados y las pruebas de la base. Modos nuevos, progreso ampliado, editor, perfiles personalizados y otras partes del plan siguen pendientes; haber hecho una primera entrega de fase 24 no completa las 24 fases.


## Avance — build 0.39 (25 de octubre de 2026)

### Fases 3/5 — Sunset largo y con identidad propia

- Base main verificada en `673291d`; no se sobrescriben cambios locales ajenos.
- Se rediseña solo Sunset: recta principal larga, curva exterior amplia, sector interior enlazado y regreso técnico. Se conservan nombre/orden, asfalto y perfil automático abierto. El jugador puede seguir eligiendo los otros perfiles.
- Recorrido 3572→6304 unidades (+76,5 %), mundo 1400×896→1800×1152. El tamaño del coche, asfalto de ancho 84, cámara cercana, prestaciones, dirección, CPU, superficies y reglas no cambian. La vista completa/minimapa muestran el mundo nuevo sin achicar el coche de la cámara cercana.
- Nueve checkpoints secuenciales y meta sobre geometría nueva. Nuevo récord `SUNSET CIRCUIT@3`; la referencia @2 queda guardada sin competir con el recorrido nuevo.
- Se descartan una variante demasiado similar a Champion, otra con ramales casi juntos y otra con solape de asfalto. No se rebaja el validador ni se eliminan las regresiones de contacto para aceptar el trazado.
- La forma final tiene distancia normalizada mínima 0,387 frente a las otras 13, independiente de escala/giro/reflejo. Margen asfalto/borde del mundo 41,3 y separación libre entre ramales 42,5; sin cruces ni segmentos degenerados en la validación.

### Comprobaciones y límites

- Nueva referencia congelada `tests/fixtures/sunset-0.38.json` y `validate-sunset.mjs`: longitud/silueta, mundo, anchura/prestaciones originales, nueve gates, vuelta rechazada sin checkpoints, récord anterior conservado y hashes idénticos de los otros 13 trazados: superados.
- Sunset libre: Fácil 41,82 s, Normal 34,86 s y Difícil 33,89 s de media por vuelta; antes Normal 22,39 s. Parrilla Normal: cuatro finalistas y 12 vueltas válidas, medias 35,49/35,09/33,77/34,23 s, cero frames con contacto en esa referencia.
- Chromium: menú/mapa nuevo, render real completo, cámaras, minimapa/HUD, fullscreen/resize, pausa/reinicio, cambio de pista, llegada/resultados/puntos, dos humanos, móvil, calidades y movimiento reducido: superados. Capturas de menú y vista completa revisadas.
- Entrega sin instrumentación bajo `/f1/` y audio real de Chromium: superados. Se versionan juntos HTML/CSS/JS a 0.39.
- Sintaxis, geometría/identidad de 14 pistas, diez originales, HTML/archivos/70 perfiles, conducción/inercia, colisiones/recuperación, ciclo de carrera, llegada, menú/resultados, coches y audio: superados. Barreras: 37 contornos y 11733 puntos. Escenarios: 987 colocaciones en tres calidades, huellas fuera del asfalto y caché reproducible.
- Se repite la batería completa: 42 carreras clásicas (126 vueltas), 20 de parrilla (240 vueltas) y 14 de tráfico (84 vueltas), total 76/450. Las 13 pistas sin cambios conservan sus resultados de referencia. Sunset Fácil/Difícil de parrilla termina con cuatro coches; Fácil registra tres frames de contacto nuevos y Difícil cero. Normal cero y tráfico de dos coches cero. Persisten Coastline Normal (4), Dusty Difícil (2) y Meadow dos coches (7); no se ocultan ni se afirma ausencia universal de contactos.
- Pendiente: conducción humana y cronometraje real para confirmar el objetivo 25–45 s, dispositivos físicos, rendimiento medido y el reporte de videos que no pudieron transferirse. Los tiempos de CPU no certifican diversión ni balance humano. Contactos residuales anteriores siguen abiertos; no se toca la IA para compensar el cambio de geometría.

### Hito de base principal y continuación con «siguiente»

El usuario preguntó cuánto falta para una base importante y decente. Estimación comunicada: **dos entregas contando esta** (Sunset y revisión final), con posibilidad de una adicional si aparecen fallos importantes. Después de publicar 0.39 queda **una revisión principal de jugabilidad/correcciones**, sujeta a lo que revelen las pruebas humanas. No es un compromiso de terminar todos los errores ni las 24 fases; editor/desbloqueos/desafíos no forman parte de ese hito.

Partir de 0.39 y verificar main. Próxima prioridad: **fase 23, revisión final del hito**, conservando Sunset y comprobando cortes/salidas de pista, reinicios/pausa, campeonato y contactos pendientes. Evitar añadir modos o agrandar más pistas antes de cerrar esta evaluación; si llega video accesible, priorizar sus fallos reproducibles. No marcar las funciones futuras de las 24 fases como completas.


## Avance — build 0.40 (25 de octubre de 2026)

### Fase 7 reabierta — el feedback humano manda sobre las simulaciones

- Base main verificada en `07a5235`. Se registra el reporte de aceleración demasiado rápida, curvas que no exigen frenar, falta de grava frenante, sonido de motor insatisfactorio y pedido de mejorar 2 jugadores/ampliar a 3–4.
- Se replanifica el hito en los cinco bloques detallados al principio. La estimación anterior de una entrega final queda reemplazada; no se agregan las funciones futuras al código sin probarlas ni se afirma que ya estén hechas.
- Primera revisión: aceleración efectiva disminuye según velocidad. Balanced 0–100 1,59 s y 95 % de máxima 4,40 s; Corner 1,69/4,34, Speed 1,40/4,21 y Rally 1,57/4,13 s en prueba de aceleración. Máximas, tamaños, pistas y escala de movimiento intactos.
- Fuerza lateral finita según modelo/material: el radio mínimo crece con velocidad; se mantiene la dirección recuperable y frenar permite cerrar la trayectoria. El freno de mano mantiene coste de velocidad. No se presenta esto como un modelo final de deriva o sensación humana ya aceptada.
- CPU reconstruye su plan con el mismo `vehicleHandling`; aceleración compartida mediante `accelerationAtSpeed`. No se añade potencia, agarre o dirección exclusiva. Normal libre Sunset 39,78 s y Dusty 23,50 s son nuevas referencias, no tiempos comparables con reglas anteriores.
- Física 2: récords `nombre@trazado:p2`; claves previas permanecen guardadas. No se fuerzan mejores tiempos frente a 0.24 cuando cambió el modelo físico.

### Pruebas y limitaciones de esta revisión

- `validate-driving-demand.mjs`: progresión de 0–100 y aproximación a máxima en cuatro modelos, radio observado mayor al ir rápido, frenado que recupera radio, límite lateral en asfalto/tierra/pasto/hielo y preservación de récords anteriores: superado.
- Se corrige un requisito antiguo de test que exigía llegar a 100 en un segundo: contradecía el feedback actual. Ahora se comprueba respuesta útil y progresiva. Las aserciones de cero contacto asociadas a física anterior se conservan para esa versión; física 2 registra contactos nuevos y exige finalizar sin amontonamientos sostenidos (≤1 s acumulado en parrilla, ≤0,5 s con dos coches en tres vueltas). No se interpreta ese presupuesto como ausencia de errores.
- Se descarta una variante de planificación por carril que elevó los contactos de Sunset 3→10. Se conserva la planificación compartida existente, usando la nueva capacidad física de giro.
- Chromium completo y entrega sin instrumentación: superados, con nuevos récords y controles/cámaras/pausa/resultados/modo local preservados. Conducción/inercia, geometría/identidad, HTML/archivos/70 perfiles, Sunset y récords, colisiones, barreras, conciencia de rivales, ciclo de carrera, llegada/resultados, menú, coches y grafo de audio: superados.
- Batería completa nueva: 42 carreras clásicas/126 vueltas, 20 de parrilla/240 vueltas y 14 de tráfico/84 vueltas: **76 carreras y 450 vueltas válidas**. Dificultades ordenadas en las 14 pistas y prestaciones compartidas comprobadas. Tráfico de dos coches: cero contactos en esa referencia. Parrilla Normal: Sunset 3, Dusty 5, Volcano 5, Champion 1 y Meadow 4 frames de contacto (18 total); Fácil añade 1 en Sunset y Difícil cero en sus tres pistas de prueba. No se presenta esta física como libre de contactos ni se comparan directamente los tiempos con reglas anteriores.
- La calidad del audio actual permanece rechazada por el usuario; que la señal se produzca no acredita un motor convincente. Grava/tierra de escape antes del pasto, dibujo/barreras asociados y 3–4 humanos todavía no se implementan en esta entrega.

### Continuación vigente con «siguiente»

Partir de 0.40 y verificar main. Revisar primero el feedback humano de la nueva conducción. Siguiente bloque de desarrollo: **fases 6/4**, escapatorias de grava/tierra frenante seguidas de pasto, materiales compartidos entre dibujo/física/partículas y respeto de opciones de barreras. Después **15 motor**, **17/2/16 local 2–4 humanos**, y **23/24 revisión final**. Mantener el plan de cinco bloques como guía, sin prometer un número fijo de entregas ni declarar la base aceptada solo por las pruebas automáticas.


## Avance — build 0.41 (25 de octubre de 2026)

### Bloque 2 — Fases 6/4: escapatorias de grava y terreno real

- Main verificado en `d686bdc`, sin cambios locales ajenos. Se conserva la conducción progresiva, Sunset largo y las opciones existentes.
- Hasta seis curvas bien separadas por pista definen el exterior y extensión de las trampas. Se incorporan en ocho circuitos con pavimento; se respeta tierra/hielo/volcánico/pasto en los demás. Las transiciones se estrechan al terminar cada zona.
- Material común por coordenadas del mundo (`terrainAt`/`TERRAIN_MATERIALS`): asfalto/piano → grava → terreno nativo. La física fuera de pista ya consulta el material bajo el coche, en lugar de mantener agarre de asfalto por su progreso. CPU y humanos comparten la misma aplicación.
- Grava: agarre .60, resistencia propia dependiente de velocidad, textura granular determinista, polvo del material del eje trasero y huellas marrones desde cada rueda. Permite avanzar para recuperar el coche, sin añadir velocidad a uno detenido ni teletransportar la CPU.
- El borde pavimentado se ajusta a la transición física del piano (48 unidades de radio exterior; asfalto de conducción 42). No se mueve la geometría de vallas/neumáticos.
- Vallas completas: sin trampas. Perfil abierto: zonas completas. Mitad/curvas/automático: se excluyen los tramos con valla activa y se conserva solo la parte accesible. La pista más próxima impide pintar material sobre otro ramal.
- Raster de dos unidades, índice espacial de segmentos y caché por pista/perfil, reutilizado por el fondo estático. Mismo material en los centros de celdas; tolerancia visual de borde de una celda. No se declara una medición de FPS en dispositivos.
- Física 3 y récords con `:p3`; se conservan las claves de física 2 y todos los trazados anteriores. No se cambian prestaciones de motor, recorrido, dificultad ni opciones.

### Comprobaciones y errores encontrados

- `validate-runoff.mjs`: 14 pistas × cinco perfiles (70), 37.082 sondeos independientes del mundo y 149.324 celdas abiertas. Concordancia muestreada de raster/material, exclusión de asfalto/ramales/vallas activas, límites/caché, transición asfalto-piano/grava/pasto y colores del render: superados.
- Frenado sin entrada durante 0,25 s desde 160: asfalto 154,1; grava 110,0; pasto a la misma profundidad 136,6. La primera prueba comparaba grava con terreno muy alejado, donde también actúa el frenado de contención: se corrigió el caso para aislar material a igual distancia del asfalto, sin debilitar esa contención.
- Cuatro modelos: reposo sin velocidad generada y recuperación con acelerador. Dos humanos: física igual. CPU: recuperación física desde grava sin salto a la pista. Huellas de grava con color del material: superado.
- Chromium completo: grava visible frena al coche real; vallas completas muestran vallas y ninguna trampa. Capturas de pista completa, coche sobre grava y perfil cerrado revisadas. Controles/cámaras/minimapa/fullscreen/resize, pausa/reinicio, 14 pistas, CPU/parrilla, resultados/puntos, dos humanos, móvil y calidades conservados.
- Prueba de entrega sin modificar el juego: superada. La prueba de audio usaba 700 ms fijos para activar derrape, insuficientes tras la aceleración progresiva de 0.40; se corrige para esperar velocidad real de 90 antes del freno de mano. No se cambia el motor para hacer pasar esa prueba ni se declara aceptada su calidad.
- Batería completa: 42 carreras clásicas/126 vueltas, 20 de parrilla/240 vueltas y 14 de tráfico/84 vueltas: **76 carreras y 450 vueltas válidas**. Ritmo libre y orden de dificultades conservados, porque la conducción sobre pavimento no cambia. En la referencia de dos coches no aparecen contactos; parrilla conserva los 18 frames de Normal y uno en Sunset Fácil registrados en 0.40, todavía pendientes de pulir.
- Sintaxis, geometría/identidad, HTML/archivos/diez originales/14 registros/70 perfiles, conducción/inercia, colisiones, ciclo de carrera, menú/llegada/resultados, coches y grafo de audio: superados. Barreras: 37 contornos/11733 puntos. Escenarios: 987 colocaciones. Audio real de Chromium tras corregir el momento de la prueba: superado técnicamente; la sustitución del motor sigue pendiente de calidad humana.
- Pendientes: valoración humana del frenado/recuperación y balance al salir de pista, contactos en grupo ya documentados, dispositivos físicos y medición de rendimiento. El audio de motor y el modo 3–4 humanos continúan pendientes.

### Continuación vigente con «siguiente»

Partir de 0.41 y verificar main. Próximo bloque: **fase 15, sustituir el sonido de motor**, con timbre/régimen/carga más convincentes y escucha humana; conservar señales útiles y silencio en pausa/OFF/menú. Después **17/2/16, mejorar dos jugadores y ampliar a 3/4**, y **23/24, revisión final**. La conducción y la grava están implementadas/comprobadas pero siguen abiertas a la prueba humana. No reiniciar el proyecto ni repetirlas como ausentes; el plan de base conserva esos cinco bloques y tres de ellos todavía esperan desarrollo/cierre.


## Avance — build 0.42 (25 de octubre de 2026)

### Auditoría y fase 25 abierta — fluidez, roces y progreso justo

- Nuevo prompt maestro: se verifica main real 0.41 (`1df936d`), árbol limpio, rama e historial. Trabajo recuperable en `work/arcade-drive-042`. Se leen HTML/CSS/JS, documentación, pruebas y referencias de publicación; no hay workflows ni backend en el árbol actual.
- Chromium local antes de editar: 14 escenarios capturados/revisados en conjunto, menú, conducción/CPU, dos humanos, HUD/mapa, cámaras, fullscreen, pausa/reinicio/resultados y resoluciones. La página pública sigue sin verificarse por 403 del proxy, sin inferir caída ni despliegue.
- Cinco oportunidades priorizadas y planificación sin techo en `ROADMAP_EVOLUCION.md`. Se retira el objetivo obligatorio de todas las vueltas entre 25–45 s: se acepta variedad aproximada 20/40/60 s y otras duraciones útiles. Anchos variables, motor nuevo, 3–4 humanos y online siguen pendientes, no se crean opciones vacías.

### Cambios implementados

- Configuración de conducción agrupada: aceleración menos restrictiva, penalización de agarre por velocidad menos acumulativa, capacidad lateral más permisiva y respuesta de dirección/yaw más rápida sin giro instantáneo. Entrada humana con suavizado exponencial consistente a 30/120 Hz. Máximas, trazados, coche y materiales de grava conservados.
- Dos alternativas comparadas frente a 0.41; la más permisiva se descarta al hacer más rápida la referencia de Sunset con acelerador permanente. Medidas y comando reproducible: `tests/experiments/DRIVING_042.md` y `compare-driving.mjs`.
- Elegida: Balanced 0–100 1,59→1,28 s, 95 % de máxima 4,40→3,32 s. Giro de entrada en la prueba de 0,3 s a máxima: 0,140→0,241 rad (+72 %); no son medidas de radio estabilizado ni aprobación humana.
- CPU permite roce lateral leve de baja energía sin frenado preventivo; mantiene frenado ante trayectoria bloqueada, alcance fuerte y cierre peligroso. Los contactos físicos siguen activos, incluidos roces, empujones y golpes. No se alteran sus prestaciones ni se elimina la colisión para evitar errores.
- Recuperación de CPU consulta material real: un piano pavimentado no dispara el antiguo límite de salida a 65 por distancia fija. Grava y pasto mantienen recuperación y resistencia.
- Fallo confirmado: en Dusty, CP3 rechazaba el coche al rozar a 46,37 unidades pese a seguir tocando la franja. La vuelta de TRAZO tardaba 44,33 s por otra vuelta física. Gates/meta ahora usan el punto exacto de intersección y la huella lateral de diez unidades compartida con el contacto de barrera. Anchura legal de asfalto/piano/terreno también compartida con la consulta de superficie y el dibujo de las franjas. Nueva prueba rechaza el coche entero por fuera, el sentido incorrecto y el doble paso. Caso corregido: 23,17 s; media de carrera 28,73→21,79 s, sin ventajas de motor.
- Cuenta regresiva desacoplada del delta limitado de simulación: tres segundos visibles no requieren cien frames de dibujo en una máquina lenta. No se cambia aquí toda la arquitectura de actualización física; la evolución a paso fijo/eventos queda planificada.
- Física 4 y récords `:p4`; se conservan todos los anteriores. Recursos versionados juntos a 0.42. El audio de motor aún no se ha sustituido.

### Comprobaciones y límites

- Nuevas regresiones: referencia congelada `driving-0.41.json`, respuesta/progresión/frenado/30–120 Hz en `validate-arcade-flow.mjs`, contacto de gate/meta en `validate-gate-contact.mjs`, roce leve frente a impacto y piano frente a salida real en pruebas de tráfico/rivales. Cuenta atrás a un frame por segundo en ciclo de carrera: superados.
- Experimento reproducible: primera vuelta Sunset 40,72→37,42 s con frenado; acelerador permanente 38,45 s con 4,27 s fuera de pista para la opción elegida. Dusty con frenado 23,93→21,57 s; sin freno no completa una vuelta válida en 90 s en esa política. No es una vuelta humana.
- Chromium completo posterior: conducción, giro/contravolante, superficies/grava/barreras, foco/teclado, pausa/reinicio, cámaras/fullscreen/resize, 14 pistas, CPU/adelantamiento/parrilla, llegada/resultados/puntos, dos humanos y móvil: superados. La prueba de entrega detectó el riesgo de cuenta atrás lenta y se repitió tras corregirlo; bajo `/f1/` y sin instrumentar el juego pasó.
- Batería final repetida: 42 carreras clásicas (126 vueltas), 20 de parrilla (240 vueltas) y 14 de tráfico (84 vueltas), total **76 carreras/450 vueltas válidas**. Dificultades ordenadas, límites de prestaciones compartidos y checkpoints completos en las 14 pistas. Dos coches: cero frames de contacto en esa referencia; parrilla mantiene roces (Normal: Dusty 3, Jungle 3, Coastline 7, Industrial 5; Fácil Dusty 5; Difícil Sunset 2 y Dusty 1). Los roces se registran, no se eliminan para lograr un contador artificialmente cero.
- Sintaxis, IDs/recursos/versiones, diez originales/14 registros/70 perfiles, materiales (37.082 puntos/149.324 celdas), barreras (37 contornos/11733 puntos), geometría/identidad, conducción/inercia, colisiones, gates/meta, ciclo de carrera, menú/resultados, coches y escenarios (987 colocaciones): superados. La entrega bajo `/f1/` pasó después del arreglo de cuenta regresiva. No se han medido FPS ni se confirma Pages público.
- La conducción sigue necesitando prueba humana. Se conservan contactos en grupo; no se persigue cero contacto como sustituto de una carrera disputada. Rendimiento real, audio de motor, anchos variables, más humanos, modos y online siguen en el plan abierto.

### Continuación vigente con «siguiente»

Consultar `ROADMAP_EVOLUCION.md`; este archivo conserva historial y evidencia. Cerrar/revisar el feedback de manejo sin convertir parámetros en intocables. Próxima mejora propuesta: **fase 26, sustituir el motor sonoro** y separar su responsabilidad, conservando señales y ciclo de vida. Después se prioriza por impacto, sin obligación de agotar las fases antiguas ni un número fijo de entregas.


## Avance 0.43 — motor nuevo, fase abierta 26

- Base revisada: main `f3db8e4` / 0.42, árbol limpio, remoto verificado; rama recuperable `work/engine-audio-043`.
- Reemplazado motor de osciladores crudos/bandas por pulsos propios de combustión filtrados, régimen/carga continuos y seis marchas con histéresis. Perfiles por modelo, mezcla de dos humanos y efectos de carrera conservados. Extraído `engine-audio.js`, rutas versionadas actualizadas.
- Validación automática de régimen/cambios/carga/reset, grafo/ciclo de vida y regresiones de manejo/progreso; Web Audio real, flujo Chromium y entrega sin instrumentación bajo `/f1/`. No hay aprobación humana del timbre ni del manejo.
- No se añadieron anchos variables, nuevos trazados ni 3/4 humanos. Fase 27 es la siguiente: anchos, pianos y barreras por sector, luego ritmos/duraciones variados; referencias 20/40/60 segundos sin imponer una ventana universal. Hoja vigente: `ROADMAP_EVOLUCION.md`.


## Avance 0.44 — sectores de anchura variable, primera revisión de fase 27

- Base verificada: main `0a2fa8a` / 0.43, árbol limpio; rama recuperable `work/variable-width-044`.
- Sunset, Neon y Dusty incorporan perfiles de sección gradual, con amplitudes y sectores estrechos distintos. Pianos opcionales por sector en asfalto; Dusty conserva tierra sin pianos artificiales. Render, suelo, gates/meta, barreras, CPU y recuperación consultan la sección real. Minimap reutiliza superficie en caché; vista previa muestra el ancho.
- Versionado de carretera `:r1` en esas tres pistas; conserva récords `:p4` y anteriores. Once trazados mantienen anchura histórica y todos conservan sus puntos/longitudes, velocidad y controles.
- Validación de geometría con ancho variable, materiales, colisiones, checkpoints y píxeles reales en Chromium. Capturas de tres escenarios abiertas/valladas y vistas cercanas revisadas. Queda evaluación humana de diversión/equilibrio, más perfiles y nuevos trazados/ritmos; todavía no hay una pista larga de 60 s confirmada. Hoja activa: `ROADMAP_EVOLUCION.md`.
- Evidencia de cierre: 91 carreras/480 vueltas válidas, 10.004 sondas físicas y 9.845 de píxeles; CPU libre mantiene Normal Sunset 36,66 s / Neon 22,67 s / Dusty 21,11 s. Parrilla Dusty Difícil registra 24 pasos de contacto a 30 Hz, todos terminan: revisar ese roce competitivo con personas; no se declara contacto cero ni equilibrio definitivo.


## Avance 0.45 — revisión humana de conducción y motor sostenido

- Base real revisada `2409e5c` / 0.44, árbol limpio y main remoto confirmado; rama `work/lift-and-engine-045`.
- Se conserva respuesta de volante/aceleración y se exige más soltar/frenar a velocidad alta mediante fuerza lateral progresiva (máximo 16 % menos) y retención de 30. Se retira frenado automático según la curva próxima. CPU comparte física 5 y vuelve a planificar velocidad. Récords anteriores preservados. Comparación de alternativas y limitaciones en `tests/experiments/LIFT_045.md`.
- Sonido sostenido más grave/filtrado, menos armónicos y brillo a máxima; derrape audible requiere giro/freno de mano. Prueba nueva de crucero sostenido en cuatro modelos. La escucha humana sigue abierta.
- Los 14 recorridos y las tres secciones variables se conservan; no se añade aún un trazado largo. Se retoma fase 27 de siluetas/ritmos después de esta corrección prioritaria.
- Cierre retomado tras desconexión: cambios intactos, main aún en 0.44; prueba de frenado actualizada de retención 20 a 30 y repetida. Registros completos de 91 carreras/480 vueltas; máximo de parrilla Sunset Normal 19 pasos de contacto a 30 Hz, todos terminan. Pruebas focalizadas de física, audio sostenido y entrega local repetidas antes de publicar.


## Avance 0.46 — Night Run largo, fase 27

- Base real `85bd29a` / 0.45, árbol limpio y main remoto verificado; rama `work/night-endurance-046`.
- Rediseñado Night Run, sin borrar nombres originales ni alterar las otras trece pistas: 10.681 unidades, secciones 68–108, chicana inicial, gancho y regreso técnico, pianos presentes/ausentes y barreras automáticas en curvas. Mundo 2650×1696 y coche de tamaño conservado.
- Se descartó la primera variante por semejanza con Champion; la nueva compara a distancia 0,353 con la pista más próxima. Snapshot 0.45 verifica forma anterior, prestaciones y preservación de las otras trece. Geometría por ancho real: margen 62,0 y separación de ramales 35,5 unidades.
- Dieciséis checkpoints ordenados, intervalos de unos 628 unidades; se elimina el máximo global de nueve manteniendo las posiciones de las otras trece. Clave `NIGHT RUN@3:p5:r1` conserva tiempos @2. Física y audio 0.45 intactos. Primeras vueltas Normal a 60 Hz 59,80/58,67 s; queda evaluación humana.
- Plan activo en `ROADMAP_EVOLUCION.md`: seguir diferenciando trazados y comprobar la experiencia del recorrido largo. No se declara concluida toda la fase 27 ni el balance de las catorce pistas.
- Cierre: 96 carreras/490 vueltas válidas; Night Normal libre media 58,93 s y parrilla sin contactos en esta referencia. Chromium completa tres vueltas y prueba dos cámaras, píxeles y entrega local. Se detectó exceso de decoración al ampliar el mundo: presupuesto 150/110/80 según calidad con distribución por todo el escenario y caché, comprobado contra huellas/espaciado. Evaluación humana y móvil físico pendientes.


## Avance 0.47 — Volcano Ring y coherencia de material

- Base real `301bb27` / 0.46, árbol limpio y main remoto confirmado; rama `work/volcanic-ridge-047`.
- Volcano era casi una copia de Thunder (distancia de silueta 0,047). Rediseñado: 4.961 unidades, recta diagonal, horquilla interior y regreso enlazado; sección 68–112, siete checkpoints y perfil automático en curvas. Los otros trece trazados/física 5/audio conservados. Récord @3:p5:r1 preserva @2.
- Se descartó una primera geometría con bordes superpuestos cerca de la meta; variante final margen 49,3 y separación 69,5. Distancia más cercana a otra silueta 0,213 (Dusty). Las comprobaciones geométricas no prueban diversión.
- Material volcánico con paleta/grano nativo ligado a la definición física, sin pianos de asfalto. Comparación real en Chromium de doce imágenes antes/después: cuatro corredores previos × tres calidades, píxeles idénticos.
- Doce carreras focalizadas/54 vueltas válidas: cinco perfiles, cuatro modelos y parrillas en tres dificultades, con orden de dificultad correcto. Integración/geometría/menú de catorce circuitos, récords, checkpoints y conservación de las otras trece versiones comprobados. Queda evaluación humana y más combinaciones. Siguiente prioridad: CPU (fase 28); nueve pistas sin perfiles variables y más variedad de fase 27 siguen abiertas.
- Evidencia: 22.265 sondas físicas de sección y 3.880 de píxeles Volcano; cinco perfiles de valla, dos contornos cerrados/1.128 sondas y 211 objetos de escenario en tres calidades. Chromium completo/entrega local superados, imágenes reales revisadas. Esta revisión ejecuta doce carreras focalizadas, no afirma repetir las 96 de 0.46.


## Avance 0.48 — ritmo CPU y consulta de frenado

- Base real `1862342` / 0.47, árbol limpio y main remoto confirmado; rama `work/cpu-line-048`.
- Curvatura geométrica sobre tres posiciones en vez de picos de tangente cortos; comparadas semiventanas 24/36/48, elegida 36. Seis referencias congeladas Normal mejoran 3–10,2 %, sin salidas del corredor en doce vueltas. Más uso de freno de mano en varios casos con coste físico compartido; sin ventajas de potencia.
- Consulta del sobre de frenado por búsqueda y horizonte 240: igualdad con barrido completo en 2.448 casos, incluida la meta; Night pasa de 891 entradas a 31 lecturas en la consulta medida. No es un benchmark de FPS.
- Pistas, modelos, física 5, tiempos humanos y audio conservados. Prueba de reinicio en Chromium estabilizada capturando cuenta 3/tiempo 0/coche no terminado en la misma tarea de teclado real; no se altera el reloj del juego.
- Referencias, condiciones y limitaciones en `tests/experiments/AI_CURVATURE_048.md`. Políticas de tráfico/defensa requieren más trabajo: Dusty Fácil tiene 28 pasos de contacto en la parrilla; todos terminan, pero el aumento se deja explícito. Fases 27 y 28 siguen abiertas; siguiente prioridad: líneas de ataque/defensa y tráfico.


## Avance 0.49 — fase 29 adelantada, parrilla local 2–4

- Base real `4203e5f` / 0.48, árbol limpio y main remoto comprobado; rama `work/local-grid-049`. Pedido del usuario: mejorar dos jugadores, sumar tres/cuatro y una previa con elecciones individuales, velocímetro y tiempos por piloto.
- Previa integrada al paddock, selector 2/3/4, coche/pintura/control por persona. Se mantienen cuatro modelos/seis pinturas y pista/barrera/gráficos compartidos. P2 deja de estar fijado a Balanced/cian. Teclado con veinte teclas de conducción distintas, sin R/C/Esc; mandos estándar con analógicos, zona muerta, exclusividad y pausa ante desconexión. No se añaden menús vacíos.
- Cámaras independientes: dos mitades o cuadrantes; tres aprovecha el sobrante para posiciones. Área local adaptable al ancho útil, sin deformar el coche. HUD exterior individual, minimapa con todos los campos de visión, resultados/puntos/DNF y siguiente/reinicio. Audio amplía a cuatro canales reutilizados y silencia los sobrantes.
- Física 5, prestaciones, política CPU de 0.48, geometrías y claves de récord intactas. Fase 28 conserva pendiente Dusty Fácil y planificación por carril; fase 27 sigue abierta. Fase 29 no se declara terminada: falta comodidad/hardware físico, remapeo y rendimiento real sostenido.
- Pruebas nuevas: `validate-local.mjs` y `browser-local.cjs`; mandos emulados y teclado real automatizado. Los resultados sintéticos no se presentan como carreras humanas completas. Referencias y comprobaciones en README/notas de entrega.

- Cierre: 15 parrillas de configuración/entrada en cinco pistas y pruebas Chromium 2/3/4 con teclado, mandos emulados y cinco resoluciones. Capturas revisadas; corregidos márgenes laterales, HUD superpuesto en pequeño y centrado cuando una vista supera el mundo. Regresión de CPU focalizada: ocho carreras/36 vueltas válidas; integración de 70 perfiles, manejo, contactos, audio hasta cuatro humanos, pausa/resultados y entrega local. No equivale a validación humana ni se repiten las 94 carreras previas.


## Avance 0.50 — fase 28, radio de carril y disputa

- Base real `6b86503` / 0.49, árbol limpio y main remoto comprobado; rama `work/traffic-space-050`.
- Reproducidos 28 pasos de contacto en Dusty Fácil y analizada la trayectoria previa: la velocidad basada solo en el centro no contemplaba el radio interior menor de la línea reservada. Se conserva signo de curvatura en el plan y se ajusta su límite por radio interior ocupado cuando hay disputa; sin bonus exterior ni cambio de volante/reservas, potencia o perfiles de dificultad.
- La variante que suponía ocupar el carril solicitado bajaba Dusty a 2 pasos pero subía Volcano de 4 a 24: descartada. Se comparan posición real, objetivo filtrado, mezcla y predicción; se conserva la posición real, con Dusty en 3 y Volcano en 0, sin modificar dirección ni trazada libre. Medias Dusty 24,57/25,07/23,83/23,41 frente a 25,18/24,38/23,59/25,60. No se afirma que cada rival sea siempre más rápido.
- Regresión congelada en `tests/fixtures/traffic-0.49.json`; prueba analítica de radio, simetría, recta, meta y carrera. Consulta optimizada comparada con barrido completo en 7.344 combinaciones de carril/modelo/dificultad/meta/freno de mano. La recuperación acota radios extremos; no es un optimizador global de trayectorias.
- Física 5, modelos, 14 trazados, récords, audio y local 2–4 conservados. Fase 28 continúa abierta para grupos y transiciones laterales; conducción/escucha y comodidad del multijugador requieren personas/hardware real.

- Cierre automático: batería principal de 42 carreras libres/126 vueltas, 20 parrillas/240 y 14 tráfico/84, más dos regresiones focalizadas/24; integración 70 perfiles, consulta 7.344 casos, conciencia de rivales y local. Chromium completo, local 2–4/cinco resoluciones y entrega `/f1/` superados. Cinco comparaciones congeladas suman 56 → 8 pasos con contacto; Night tiene 32 pasos-coche fuera nuevos y Sunset Difícil dos de contacto nuevos. Se conservan como pendientes, junto a roces residuales en Meadow/Industrial y grupos. No se cuentan las variantes descartadas como validación de la elegida ni se presenta la prueba automática como aceptación humana.


## Avance 0.51 — fase 28, anticipación de salida durante una disputa

- Base real `eef9493` / 0.50, main remoto verificado y árbol limpio; rama `work/traffic-corridor-051`. Reproducidas tres carreras: Night con 32 pasos-coche fuera/2 con contacto, Meadow 7 contactos e Industrial 12.
- Proyección de movimiento/yaw compartida con contactos; dos consultas a 0,25/0,5 s durante disputa y límite de velocidad si prevé empeorar el margen hacia el borde. Solo modifica controles, con fuerza/física normal. No interviene en humanos, pista libre o baja velocidad y deja recuperar hacia dentro.
- Comparadas anticipaciones 0,35/0,5/0,65, más separación lateral y activación solo cerca del borde. Se conserva 0,5 sin modificar reservas/volante. Night/Meadow/Industrial quedan sin contacto ni pasos fuera en las referencias; tres carreras reales de Chromium lo confirman y todos llegan antes del cierre normal. Dusty Fácil 3 → 1 contacto y Volcano conserva cero.
- Nueva regresión congelada 0.50, pruebas de planner inmutable, ambos lados, recuperación y límites físicos. Documentadas variantes/medias/límites en `tests/experiments/BOUNDARY_051.md`. Sunset Normal sube de 1 a 13 pasos con contacto; pendiente explícito, sin elevar umbrales ni declarar completada toda fase 28.
- Se conservan física 5, modelos, dificultad, récords, audio, 14 trazados y local 2–4. Próxima prioridad propuesta: fase 27, variedad real de otro circuito, manteniendo abierta revisión de grupos/Sunset y evaluación humana.

- Cierre: 396 vueltas válidas en la batería Node (20 parrillas/240, 14 tráfico/84, seis referencias libres/doce, tres regresiones nuevas/36 y dos anteriores/24). Se conserva el ritmo libre, sin repetir las 42 carreras de tres dificultades. CPU focalizada, colisiones, integración 70 perfiles, local y 7.344 consultas superados. Chromium completo/local/entrega y tres carreras nuevas/36 vueltas adicionales superados; captura Night revisada. Todas las parrillas respetan el presupuesto vigente de contactos, sin elevarlo. Rally Normal tiene cuatro pasos nuevos y Frostbite Difícil conserva cinco; quedan junto a Sunset como pendientes, sin prometer cero contacto ni aceptación humana.


## Avance 0.52 — fase 27, Frostbite GP y material de hielo

- Base real `5e2c27a` / 0.51, árbol limpio/main remoto confirmado; rama `work/frostbite-layout-052`. Frost antiguo a distancia 0,060 de Thunder: se rediseña la geometría, sin cambiar nombres ni sustituir el proyecto.
- Recorrido final de 6.369 unidades (+86 %), mundo 2200×1408, ancho 68–112 y nueve gates. Arco rápido y regreso técnico de hielo. Distancia más cercana a otra silueta 0,258; margen físico 86,1 y separación 57,4. Se rechazan variantes próximas a Night y otra con bordes superpuestos antes de elegir esta.
- Paleta/rasguños/marcas de hielo desde material, con agarre/resistencia conservados y sin pianos de asfalto. La sección alimenta render, colisión, superficies, CPU, gates, escenario, minimapa y vista previa. Récord @3:p5:r1 conserva @2. Otros trece recorridos/modelos/física/CPU/audio/local intactos.
- Nuevos fixture/test Frost: doce carreras/54 vueltas, cuatro modelos, cinco perfiles y tres parrillas de cuatro coches/dificultades. Normal libre 36,93/35,85 frente a 27,17/26,17 anteriores. Contactos de parrilla Easy/Normal/Hard 1/4/4 pasos, dentro del presupuesto vigente; no se afirma contacto cero universal.
- Validaciones históricas conservan los otros hashes y remiten Frost al fixture nuevo. El benchmark CPU mantiene cinco comparaciones en recorridos intactos y no compara el tiempo del Frost antiguo contra el nuevo. Quedan seis pistas variables y ocho uniformes; fase 27 y aceptación humana continúan abiertas. Próxima propuesta: otro trazado débil de identidad, como Pixel City.

- Cierre: doce carreras Frost/54 vueltas, doce Volcano/54 y cinco comparaciones CPU/diez: 118 vueltas válidas Node, sin repetir las 42 libres/20 parrillas completas. Geometría catorce pistas/seis perfiles variables/27.280 sondas, dos contornos Frost/1.366 sondas y 340 colocaciones entre tres calidades. Chromium píxeles (6.944), tres vueltas Frost más Night/cámaras y recorrido general/local/entrega superados; capturas revisadas. Quince imágenes de los cinco corredores anteriores idénticas en tres calidades. Local Node ampliado a 18 parrillas incluyendo Frost; consolas sin errores en los recorridos automatizados. Evaluación humana, móvil físico y Pages público no se declaran comprobados.

## Avance 0.53 — fase 27, Pixel City propio y corto

- Base real `6d4776c` / 0.52, main limpio/remoto confirmado; rama `work/pixel-city-053`. Se confirma similitud Pixel–Thunder de 0,092 y se reemplaza el recorrido, conservando nombre, orden del campeonato, asfalto y perfil parcial automático.
- Avenidas, desvío interior y retorno enlazado, 4.368 unidades (+28,7 %), ancho útil 76–112, sectores con/sin pianos, seis gates y mundo 1600×1024. Margen al mundo 51,8 / separación de corredores 59,7, sin cruces. Distancia mínima de forma 0,239 (Jungle), sin considerar esto una aprobación de diversión.
- Comparadas escalas 1,6 y 1,8. Se elige la corta: Normal libre 25,47/24,42 s, frente a 23,02/22,08 anteriores; alternativa larga 28,10/27,00. Mantiene variedad de duración junto a Frost/Night. Récord @3:p5:r1 con registros @2 preservados.
- Fixture 0.52 congela los otros trece trazados, modelos, física, materiales y perfiles de CPU. Las comprobaciones históricas remiten la migración Pixel a este fixture, conservando los demás hashes. Siete pistas de sección variable/siete uniformes. Física 5, CPU 0.51, audio y local 2–4 sin cambios.
- Validación: doce carreras Pixel/54 vueltas y doce Frost/54 vueltas, cuatro modelos/cinco perfiles/tres dificultades. Tres parrillas Pixel con cero pasos de contacto en estas referencias; no equivale a cero contacto universal. Geometría catorce pistas, siete perfiles/30.669 sondas, barreras Pixel dos contornos/947 sondas y 82 colocaciones escénicas. Integración 70 perfiles, menú, gates, contactos y CPU focalizada; local Node 21 configuraciones.
- Chromium: 4.669 sondas de píxeles, tres vueltas Pixel, Night/cámaras y suite general/local 2–4/entrega `/f1/`. Capturas revisadas; dieciocho imágenes de los otros seis corredores variables idénticas entre tres calidades. Un primer pase de la suite general agotó el timeout de inicio durante carga concurrente; repetido con menos carga, pasó sin cambiar código ni ampliar límites. No se confunde ese resultado con medir rendimiento del dispositivo del usuario.
- Detalle reproducible: `tests/experiments/PIXEL_053.md`. Falta conducir humanamente, evaluar audio/hardware físico y verificar Pages público. Próxima propuesta: fase 28, reservas de espacio/elección de rival en grupos y Sunset Normal; no repetir el rediseño Pixel como pendiente.

## Avance 0.54 — fase 28, prioridad y espacio en grupos

- Base real `9bcf8ca` / 0.53, main limpio/remoto confirmado; rama `work/cpu-groups-054`. Reproducido Sunset Normal con trece pasos de contacto a 30 Hz. Se confirma que el rival más cercano puede borrar la referencia lateral de uno solapado; prioridad sola también deja un cierre reproducible con rivales en ambos flancos.
- El rival lateral solapado gobierna la trazada, manteniendo el límite de frenado frente a todos. Se intersectan las reservas de flancos opuestos con la anchura disponible; si no caben, conserva carril y cede longitudinalmente con acelerador/freno normales. Mantiene la reserva más próxima en trenes de un lado, sin pretender un planificador conjunto de varios segundos.
- Comparadas retenciones por distancia (12/24/40), prioridad sola y reservas generales de 28/26. La reserva general de 28 introduce un contacto Night y se descarta. Elegida la guarda entre flancos opuestos: Sunset Normal 13 → 1 pasos de contacto y cero salidas, media de parrilla 36,06 → 35,86 s. Referencia a 60 Hz sin cambios: seis pasos de contacto y mismos tiempos; no se extrapola una mejora entre frecuencias.
- Fixture 0.53 conserva catorce recorridos/superficies/perfiles, modelos, física 5, materiales y especificaciones de pilotos. No cambia potencia, intangibilidad, récords humanos, audio ni local 2–4. Reservas y estados se limpian al terminar/alejarse/reiniciar; contactos arcade activos.
- Diez comparaciones de grupo/120 vueltas (nueve a 30 Hz y una a 60), tres regresiones de borde/36, dos de carril/24, cinco referencias libres/diez y veinte parrillas/240: **430 vueltas Node** ejecutadas entre suites, con casos comunes y sin contar candidatos/repeticiones adicionales. No se amplían presupuestos de contactos. Las otras nueve comparaciones de grupo conservan sus límites y no suman salidas de pista; Rally/Frost Difícil mantienen cuatro pasos en las referencias indicadas.
- Chromium: cinco parrillas/60 vueltas, escenario encajonado, llegada normal y sin errores JS; captura Sunset revisada. Suite general catorce pistas, local 2–4/mandos emulados/resoluciones y entrega sin puente bajo `/f1/` superadas. Integración setenta perfiles, geometría, local veintiuna configuraciones, pausa/reinicio/menú y contacto de gates superados; sintaxis y diff revisados. Pendientes juego humano, hardware/escucha y Pages público.
- Evidencia: `tests/experiments/GROUPS_054.md`. Próxima propuesta fase 26: mezcla regulable y revisión auditiva del motor; fase 27 conserva siete pistas uniformes, con Jungle como candidata. La fase 28 sigue abierta a estrategias de mayor horizonte y evaluación humana.

## Avance 0.55 — fase 26, mezcla regulable y persistente

- Base real `c66d8aa` / 0.54, main limpio/remoto revisado; rama `work/audio-mix-055`. Confirmado que motores, ruido de terreno/derrape y señales compartían una única salida sin regulación separada. Leído además el prompt maestro adjunto completo: la referencia 0.40 es histórica; se reafirma conducción como prioridad de continuación.
- Dos salidas bajo volumen general/compresor: motores/cuerpo y efectos/terreno/señales. Deslizadores general/motores/efectos con defaults 80/70/85, guardado local versionado, validación y restauración. Rampas suaves; no asigna nodos al mover controles, no inicia audio desde menú ni anula OFF. Reutiliza el contexto entre dos/cuatro humanos.
- Panel nativo con etiquetas, teclado, foco y límites de viewport. En carrera pausa/limpia teclas; Escape/cerrar mantienen pausa, SEGUIR reanuda manualmente. Evita reiniciar/dirigir/reanudar/salir de fullscreen por teclas del panel. Botón compacto en móvil, sin información permanente encima de la pista.
- `engine-audio.js` byte idéntico: reducción de nivel y regulación no se presentan como timbre nuevo ni aprobado. Física 5, catorce trazados, CPU 0.54, récords y local 2–4 conservados. El motor a máxima requiere aún escucha/revisión.
- Pruebas de grafo/persistencia, cero/máximo, 100 cambios sin nodos nuevos, datos corruptos/versiones desconocidas/cuota/bloqueo, OFF/pausa y cuatro humanos superadas. Se corrigieron getters prematuros del harness y un paréntesis del helper de slider de la prueba nueva, repitiendo las afectadas. Audio previo, contexto/limpieza/voces/fallback, ciclo de carrera, manejo/frenado y reservas de CPU focalizadas superados; no se repiten las 430 vueltas anteriores por este cambio de mezcla.
- Chromium: motor 35 → 70 % duplica aproximadamente amplitud, motor cero conserva avisos, efectos cero conserva motor y master cero silencia. Recarga conserva valores y no inicia audio; Escape/fullscreen, foco, pausa y cinco viewports superados. Cuatro motores/modelos y volúmenes al 100 %: pico muestreado ~0,118, sin clipping en la muestra; dos slots sobrantes silenciosos al volver a dos. Capturas escritorio/móvil revisadas.
- Crucero de cuatro modelos/sexta estable y Web Audio real/lifecycle superados; no prueban calidad percibida. Integración 70 perfiles, geometría 14, menú y local 21 configuraciones superados. Chromium general, local 2–4/mandos emulados y entrega sin puente `/f1/` con recursos 0.55 superados. Sintaxis/diff revisados. Detalle: `tests/experiments/MIX_055.md`.
- Próximo: retomar fase 25, conducción/curvas con comparación, manteniendo respuesta ágil/frenado útil y aceptación humana abierta. Continúan siete pistas uniformes de fase 27, timbre de fase 26 y evolución de CPU/modos/online. No se considera finalizado el juego ni se impone techo de fases.

## Avance 0.56 — fases 25/36.1, reposo/recuperación y detalle de asfalto

- Base real `b34df3a` / 0.55, main limpio/remoto confirmado; rama `work/road-detail-056`. Se agrega la fase 36 abierta de realismo estilizado con toque retro, dividida en materiales, coches/sombras, escenarios/escala, luz/ambiente y calidad/rendimiento; no se declara rediseño completo por iniciar una textura.
- Corregido pivote del chasis a velocidad cero: ruedas dirigibles, carrocería gira al rodar. Antes ~48° por segundo sin desplazarse en la prueba de navegador; después cero. No se cambian capacidades/fuerzas en marcha, modelos o récords p5.
- CPU dependía del pivote para rodear ciertos obstáculos detenidos. Se comparan cinco variantes de avance/objetivo y se elige avance mínimo con dirección cercana, bajo física/colisiones comunes. Caso a 25 que no pasaba en 20 s se recupera en 11,93 s sin contacto a 60 Hz; los nueve casos 25/30/40 × 30/60/120 Hz pasan sin contacto. Tiempos varían con el paso, sin afirmar invariancia del controlador completo ni recuperación universal.
- Marcas/humo comparten señal de deslizamiento con audio: se elimina derrape visual falso en recta y se conservan freno de mano/giro/rotación residual, con marcas por rueda y material. El motor y mezcla 0.55 permanecen.
- Agregado fino original en el interior del asfalto detallado/retro, dos tiles/carretera en caché, sin generar ruido por frame. Primera parte de 36.1. Comparación catorce pistas/tres calidades: dieciséis imágenes cambian intencionadamente, veintiséis nativas/rendimiento son byte idénticas; 71.706 muestras de borde/piano/exterior intactas. Capturas antes/después revisadas; no se añaden texturas de asfalto sobre tierra/hielo/pasto/volcánico.
- Cierre Node: veinte parrillas/240 vueltas, diez grupos/120, tres borde/36, dos carril/24 y cinco ritmo libre/diez: **430 vueltas** entre suites (con referencias compartidas, sin contar candidatos/repeticiones/maniobras parciales). Conservan presupuestos de contacto y referencias de ritmo. Reposo a tres pasos, nueve recuperaciones, marcas/audio, inercia, terreno/grava, contactos y recuperación superados. Integración setenta perfiles, geometría catorce y local veintiuna configuraciones superados.
- Chromium: cinco parrillas/60 vueltas con métricas y plazo normal de llegada; comparación gráfica/reposo/recuperación, suite general, local 2–4 y entrega `/f1/` superadas. El escenario aislado de recuperación se corrigió para elegir un rival (antes dejaba los otros dos del default); la prueba de contravolante ahora garantiza movimiento y mantiene gas, sin depender del pivote estacionado. Aserciones de inercia con tiempo fijo conservadas. Sintaxis/diff revisados.
- Evidencia detallada: `tests/experiments/ROAD_FEEL_056.md`. Manejo humano/curvas, coste sostenido en hardware real y Pages público quedan pendientes. Continuar fase 25 y después 36.2, sin perder CPU/local/pistas y sin techo artificial de fases.


## Avance 0.57 — tramo gráfico 36.2 del plan abierto

Coches con sombra de silueta/ruedas cuya dirección permanece fija en el mundo y borde de contacto en detallado. Reflejos de borde responden a orientación respecto de luz fija; se conservan cuatro modelos/seis pinturas, dirección, freno y destello de impacto. Retro simplifica la sombra; rendimiento mantiene sus píxeles anteriores. Sin cambios de física 5, CPU, pistas, récords, audio o controles.

La ampliación gráfica está en `ROADMAP_EVOLUCION.md`, no se da por cerrada con este paso. Pruebas, comparación y límites en `tests/experiments/CAR_LIGHT_057.md`. Pendiente aceptación humana del aspecto y manejo; próxima prioridad de conducción: fase 25. Escenarios y siete trazados uniformes permanecen abiertos.


## Avance 0.58 — reloj fijo y conducción consistente (fases abiertas 25/30)

Corregida pérdida de tiempo por límite de 30 ms por frame: paso fijo de 60 Hz con acumulador y presupuesto de seis pasos. Coches/cámaras interpolados para dibujar sin tocar el estado físico; limpiezas al pausar/reiniciar/recolocar, cuenta atrás real y récords `:s1` separados de los anteriores conservados. Sin cambios en fuerzas/modelos/trazados/materiales/CPU/audio/gráficos 0.57.

Pruebas de entrada/curvas/frenado/mano, varios ritmos y carreras completas en `tests/experiments/FIXED_STEP_058.md`. Primer tramo de fase 30, no separación completa de arquitectura ni aceptación del manejo humano. Bloqueos largos y equipos por debajo de 10 FPS conservan un límite deliberado de recuperación. Continuar fase 25 con comparaciones sobre reloj estable y las demás áreas según `ROADMAP_EVOLUCION.md`.


## Avance 0.59 — control de contravolante, fase abierta 25

El volante descarga dirección opuesta más deprisa hasta el centro y después vuelve al peso normal; no cambia giro sostenido, neutral, fuerza lateral ni yaw. Teclado/mandos de 1–4 humanos; CPU/pistas/colisiones/audio/gráficos conservados. Física 6 migra los récords del controlador, manteniendo p5 y reloj s1.

Doce maniobras de comparación sobre cuatro modelos/asfalto/tierra/hielo, comprobadas también con teclado real en Chromium: yaw contrario 117 → 100 ms y ~17 % menos giro residual, misma velocidad. Evidencia y pruebas en `tests/experiments/COUNTERSTEER_059.md`. Aceptación humana pendiente; próxima pista candidata a fase 27: Jungle Sprint, sin reiniciar lo ya completado ni cerrar todas las fases.


## Avance 0.60 — Jungle Sprint, fase abierta 27

Trazado nuevo de 6.178 unidades, ancho 72–116, S/horquilla/regreso rápido, nueve gates y mundo 2000×1280. Pasto nativo con estilo propio y perfil automático abierto; se conservan cinco barreras, otros trece recorridos y física 6/reloj s1/CPU/audio/local. Récord @3:p6:r1:s1 separado de @2 retenido.

Se detectaron y corrigieron geometría de cierre y alineación de barrera en variantes rechazadas. Referencia CPU Normal libre 36,12/35,03 s; capturas/Canvas y pruebas en `tests/experiments/JUNGLE_060.md`. Ocho pistas variables, seis uniformes pendientes. Aceptación humana de trazado/manejo abierta; siguiente propuesta gráfica: escenarios de fase 36.3 del plan abierto.


## Avance 0.61 — vegetación, tramo gráfico 36.3 del plan abierto

Follaje/troncos/raíces/sombras más definidos para árboles/copas/palmeras/pinos/cactus en detallado/retro, sin cambiar posiciones, huellas, cantidades, carreteras ni física; rendimiento conservado. Caché de fondo y lectura retro. Pruebas en `tests/experiments/VEGETATION_061.md`.

La hoja activa cuenta doce frentes abiertos (25–36), varios implementados parcialmente. Online se divide en salas autoritativas, sincronización/reconexión y despliegue/resultados validados; no existe backend online hoy. El usuario reafirma jugabilidad/derrape y objetivo ~260 km/h para el coche rápido. Se programa para la próxima revisión de manejo con pruebas de frenado/radio/CPU; no se mezcla un aumento sin comprobar con esta entrega gráfica.
