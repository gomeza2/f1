# PIXEL GRAND PRIX — evolución abierta

Plan vigente desde 0.42. Reemplaza los límites y prioridades antiguas; `ROADMAP_24_FASES.md` conserva el historial útil. Las fases pueden dividirse, reordenarse o ampliarse con evidencia. No representan un número fijo de entregas ni un compromiso de que todo quede resuelto en una actualización.

## Auditoría de partida

- Main real: `1df936d` / build **0.41**, posterior a la 0.40 citada en el nuevo pedido. Árbol limpio y cinco commits recientes revisados antes de trabajar en `work/arcade-drive-042`.
- Leídos HTML, CSS, JavaScript, README, roadmap/notas, pruebas y referencias de recursos. No hay package.json ni workflows de publicación/CI en el árbol inspeccionado; el juego es estático y no tiene backend. Las pruebas de navegador necesitan Playwright/Chromium en desarrollo.
- Chromium local: menú, 14 escenarios renderizados/capturados, carrera/CPU, dos humanos, materiales/barreras, HUD/mapa, cámaras, pantalla completa, pausas/reinicio/resultado, resoluciones de escritorio y móvil. Consola sin errores en el recorrido automatizado. Las capturas de las 14 pistas se revisan en conjunto; no sustituyen conducirlas humanamente.
- Publicación: main remoto coincide. La conexión a `gomeza2.github.io/f1/` recibe 403 del proxy; no se puede confirmar el sitio público. Rutas relativas versionadas comprobadas localmente bajo `/f1/`.
- La prueba humana del usuario rechaza el peso de conducción y el motor. Los tests anteriores no invalidan ese reporte.

## Cinco oportunidades de mayor impacto

| Prioridad | Evidencia confirmada | Decisión |
|---|---|---|
| 1. Manejo fluido | Dos filtros de dirección, pérdida de agarre por velocidad y límite lateral restrictivo se acumulan. La respuesta de entrada y aceleración de 0.41 resultan pesadas según el usuario. | Comparar variantes con medidas, conservar frenado útil y una dirección recuperable. Primera revisión en 0.42; aceptación humana pendiente. |
| 2. Disputa de posiciones y progreso justo | Frenado preventivo ante roces laterales de baja energía; recuperación limitada por distancia fija en vez de material. En Dusty un coche cruzó CP3 a 46,37 unidades, parcialmente sobre la franja, pero no se contó y su vuelta tardó 44,33 s. | Permitir roces leves con colisión física; anticipar impactos fuertes. Checkpoints por intersección y huella del coche, con anchura legal compartida. Corregido en 0.42 y cubierto por regresiones. |
| 3. Motor convincente | Dos osciladores periódicos y bandas de tono; la salida técnica funciona pero el usuario rechaza el sonido. | Sustituir el sistema de motor, escuchar y comparar; mantener señales de carrera y ciclo de vida. Próxima prioridad. |
| 4. Identidad/ritmo de circuitos | 14 pistas, ancho uniforme de conducción y siete originales todavía muy parecidos; Sunset/Dusty/Champion ya tienen rediseños. | Anchos por sector y más siluetas propias. Admitir vueltas de unos 20, 40, 60 s u otras duraciones útiles. El anterior objetivo global de 25–45 s queda retirado. |
| 5. Base para modos/local/online | IIFE de unas 1400 líneas mezcla simulación, render, audio, entradas, récords y eventos. Control/cámara/resultados tienen ramas específicas para dos humanos. No hay red ni autoridad de servidor. | Extraer responsabilidades cuando se implemente el sistema que lo necesita: audio, entradas, simulación/eventos. Preservar comparativas; no convertir récords locales en ranking online seguro. |

## Fases abiertas

### 25. Control arcade fluido y competición con contacto — revisiones 0.42/0.45

- Aceleración progresiva con respuesta útil al salir de una curva; límite lateral que conserve curva rápida a gas y exija bajar velocidad en horquillas.
- Entrada de dirección exponencial independiente del paso, menos penalizaciones acumuladas y recuperación sin giro instantáneo. CPU comparte capacidades del coche.
- Roce lateral leve mantiene flujo; no desactivar contactos ni permitir atravesar coches/vallas. Frenado anticipado ante coches detenidos, alcances fuertes y cierres de línea.
- Cruce de gate/meta por punto exacto de intersección y contacto de la huella física con la franja legal. Fuera completo y orden incorrecto siguen rechazados.
- Estado: implementado, probado automáticamente/en Chromium; sensación humana abierta. Recoger prueba de aceleración, entrada/salida de curva y adelantamiento en Sunset/Dusty antes de declararlo aceptado.

Revisión 0.45 tras reporte humano de conducción demasiado permisiva: se conserva volante/aceleración y se reduce fuerza lateral solo en el rango alto (hasta 16 %), con retención al soltar de 30 y sin frenado automático por curva próxima. Comparación 16/24 % con política común; se elige 16 %. Física 5/anteriores preservadas. Frenar/soltar aporta ventaja en Sunset y Dusty; Neon admite gas continuo con la política usada y deja abierta una mejora del ritmo/trazada CPU. No se afirma equilibrio humano.

### 26. Sustituir motor y mezcla de audio — primera revisión 0.43

- Separar motor del código principal con una interfaz pequeña de estado del coche y ciclo de vida; migrar rutas y pruebas de publicación al introducir el módulo.
- Probar pulsos de combustión/armónicos, carga del acelerador, régimen continuo y cambios suaves. Evitar saltos de tono repetitivos, zumbido plano y fatiga auditiva.
- Motor al acelerar, retener, frenar, deslizar, tocar grava y chocar; mezcla de varios humanos. Volumen general/motor/efectos si ayuda a ajustar la experiencia.
- Efectos útiles de salida, vuelta/record y llegada; sonido de roce de baja energía frente a golpe fuerte. Ambientes temáticos con presupuesto de voces.
- Recursos propios/síntesis o muestras con licencia comprobada. Validar limpieza, silencio en pausa/OFF/menú, navegador y escucha humana. Un analizador de señal no aprueba el timbre.

Estado 0.43: motor reemplazado y separado en `engine-audio.js`; pulsos/armónicos, carga, régimen continuo y seis marchas con histéresis, cuatro perfiles. Integración de recursos y mezcla existente comprobadas. Grafo, marchas/carga, Web Audio real y navegador comprobados; escucha humana pendiente. Controles separados de volumen, ambientes temáticos y una revisión específica del sonido de roce quedan pendientes, sin opciones vacías. Física/ritmo de CPU sin cambios en esta entrega.

Revisión 0.45 tras reporte humano de sonido desagradable a máxima estable: motor más grave/filtrado y menor brillo de crucero; evita ruido de derrape en recta sin giro. Prueba específica sostenida para cuatro modelos, con comparación frente a 0.44 de energía filtrada y estabilidad de marcha. Sigue pendiente escuchar/dispositivos reales; no se cierra fase 26 por resultados del analizador.

Avance 0.55: tres controles general/motores/efectos, guardado local y restauración, salidas separadas y valores iniciales 80/70/85. Panel modal con pausa/manual return, teclado/foco y cierre Escape sin reanudar detrás; compacto en móvil. No crea contexto al ajustar desde menú ni desactiva mute; reutiliza hasta cuatro motores humanos. Timbre de `engine-audio.js` intacto, sin presentar una reducción de nivel como motor nuevo. Escucha y nueva revisión de timbre siguen abiertas.

### 27. Anchura, curvas y duración variadas — primera revisión 0.44

- Datos por sector con anchura y materiales; extender una consulta común como `roadHalfWidthAt` para render, línea de carrera, barreras, gates, minimapa y editor.
- Renderizar un corredor de anchura variable; validar la huella completa y las transiciones, no solo la línea central. Adecuar marchado de barreras, escapatorias y exclusión de decoraciones.
- Pianos utilizables, entrada más amplia/salida estrecha donde tenga sentido; rectas, chicanas, horquillas y zonas de adelantamiento con riesgo visible.
- Circuitos cortos, medios y largos: referencias aproximadas 20/40/60 s, sin forzar todas las pistas a una ventana ni alterar artificialmente el coche.
- Pruebas de geometría/anchura, 5 perfiles, superficie, cámaras y varias vueltas por coche/dificultad. Récords por versión; preservar los anteriores.
- Estado 0.44: primera migración en Sunset, Neon y Dusty, con secciones interpoladas/ancho útil 72–124/72–112/72–108 respectivamente. Pianos presentes/ausentes en Sunset/Neon y tierra ancha/estrecha sin pianos en Dusty. Consulta compartida con material físico, CPU, geometría de vallas/neumáticos, gates/meta, carteles, recuperación y exclusión de decoraciones; render/vista previa/mapa coherentes. Récords `:r1` conservan anteriores `:p4`.
- Comprobación: geometría con anchura variable y continuidad, pruebas de terreno/barrera/gate y píxeles reales de Canvas en tres pistas/cinco perfiles. Capturas revisadas; conducción humana pendiente. Se mantiene la física 4. No se añadieron longitudes: las referencias libres siguen aproximadamente 21/23/37 s. Ningún trazado de 60 s se declara terminado.
- Siguiente tramo: nuevas siluetas/ritmos y más perfiles, escogidos con espacio real entre ramales y límites. Quedan once pistas sin ancho variable; pianos de un solo lado y barreras personalizadas por sector aún pendientes.

Avance 0.46: Night Run rediseñado, 10.681 unidades, ancho útil 68–108, chicana/gancho/regreso técnico, mundo 2650×1696 y 16 checkpoints sin separaciones mayores a 650. Primeras dos vueltas Normal libres a 60 Hz: 59,80/58,67 s; referencia, no objetivo forzado para cada jugador. Se conserva física/audio 0.45, perfil automático en curvas y los otros trece recorridos. Silueta próxima más cercana a 0,353 (Champion) frente a 0,188 de la primera variante descartada; nueva forma comparada contra las catorce y contra la anterior, sin sustituir conducirla. Pianos/anchos variables ya presentes en cuatro pistas; diez pendientes. Récord Night @3 conserva @2. Evaluación humana, más rediseños y prestaciones en dispositivos reales siguen abiertos.

Avance 0.47: Volcano Ring con silueta diagonal/horquilla/regreso enlazado, 4.961 unidades y sección 68–112, siete gates y dos primeras vueltas Normal 29,45/28,37 s a 60 Hz. Material volcánico conservado con paleta/ceniza nativas y sin pianos de asfalto; colores del corredor en la definición del material. Se descarta una primera variante por superposición de bordes cerca de meta; versión final tiene margen 49,3/separación 69,5. Los otros trece recorridos y prestaciones permanecen intactos, con doce imágenes de los cuatro corredores anteriores idénticas en Chromium tras la extracción del estilo. Récord @3:p5:r1 preserva @2. Cinco pistas con ancho variable, nueve pendientes. La fase sigue abierta; la siguiente prioridad se mueve a CPU para equilibrar variedad con competición.

Avance 0.52: Frostbite GP deja la forma casi compartida con Thunder (distancia 0,060). Recorrido asimétrico de 6.369 unidades, arco rápido/regreso técnico, sección 68–112, nueve gates y mundo 2200×1408; silueta más próxima a 0,258 (Volcano). Se descartan dos propuestas parecidas a Night y una con inversión/superposición junto a meta. Material de hielo conservado en física, con carretera/rasguños/marcas nativas; sin pianos de asfalto. Referencia libre Normal 36,93/35,85 s y clave @3:p5:r1, con tiempos @2 preservados. Pruebas de cuatro modelos/cinco barreras/tres dificultades y Chromium; sensación humana pendiente. Los otros trece recorridos están preservados por fixture 0.51 y quince imágenes de los cinco corredores anteriores son idénticas. Seis pistas variables, ocho uniformes; fase 27 sigue abierta.

Avance 0.53: Pixel City deja la plantilla similar a Thunder y estrena avenidas/desvío interior/retorno enlazado, 4.368 unidades (+28,7 %), sección útil 76–112, pianos por sector, seis gates y mundo 1600×1024. Se comparan escalas 1,6 y 1,8 y se conserva la corta (~25 s), distinta de las duraciones de Frost y Night. Distancia mínima de silueta 0,239 frente a 0,092 anterior. Fixture 0.52 preserva otros trece trazados/modelos/física/materiales/CPU; récord @3:p5:r1 con @2 intacto. Siete variables/siete uniformes. Sensación humana y detalles de ambientación urbana siguen abiertos.

### 28. CPU y estrategia de carrera — primera revisión 0.48

- Ampliar trazadas y elección de líneas según anchura real/material; anticipar frenadas por la línea elegida y reaccionar a grupos.
- Personalidades reconocibles por respuesta/riesgo/ataque/defensa, no potencia oculta. Errores acotados y recuperaciones que no regalen checkpoints.
- Medir ritmo libre y tráfico por separado; probar doblajes, coches detenidos, roces, golpes y última vuelta. Evitar que un contacto menor arruine una carrera por un fallo de progreso.
- Comparar tiempos, consistencia, tiempo fuera de pista y energía de impactos; contacto cero no es el objetivo de una carrera arcade con disputa.
- Estado: base y pruebas presentes, ampliación pendiente.

Avance 0.48: curvatura geométrica sobre tres posiciones en un arco de 72 unidades, comparada con variantes de 48/96 y con las tangentes anteriores. Mejoras Normal de 3–10,2 % en seis comparaciones congeladas, mismas reglas/modelos/recorridos y corredor legal en las doce vueltas. Usa más freno de mano en varios casos y paga su coste: no se oculta ese cambio de táctica ni se afirma equilibrio humano.

Consulta de velocidad con búsqueda por progreso y horizonte 240; 2.448 comparaciones de equivalencia y 31 lecturas frente a 891 entradas en Night. Pruebas generales de CPU/parrilla/tráfico mantienen límites y orden de dificultad. Los roces de Dusty Fácil (28 pasos/0,93 s en tres vueltas) dejan pendiente una revisión de tráfico, especialmente al estrechar y solapar líneas. Siguiente tramo: planificación de la línea elegida, ataque/defensa y salidas tras contacto; no se declara completada la fase 28. Física 5, audio, pistas y récords humanos intactos.

Avance 0.50: velocidad prevista por el radio interior del carril ocupado, con curvatura firmada y sin bonus exterior; no cambia la conducción libre ni las especificaciones del piloto/coche. Dusty Fácil reproducido desde 0.49: 28 → 3 pasos de contacto en cuatro coches/tres vueltas, con mejora del piloto trabado de 25,60 → 23,41 s de media. La primera variante usaba el carril solicitado y subía Volcano Normal de 4 a 24 pasos de contacto; se descarta. El carril realmente ocupado mantiene Dusty en 3 y Volcano en 0, sin alterar las reservas/volante. Se compararon además interpolación y predicción de transición; no aportan mejor resultado conjunto que justifique su coste en esta entrega. Sigue siendo una aproximación de carril paralelo: transiciones laterales y grupos de varios rivales quedan pendientes. No se cierra fase 28 ni se promete equilibrio humano.

Avance 0.51: anticipación del borde por velocidad/yaw actuales, con consultas a 0,25/0,5 s y anchura legal de cada punto. Solo pide acelerar/frenar; no cambia posición ni fuerza física. Proyección común con contactos y recuperación hacia dentro preservada. Referencias Normal: Night 32 → 0 pasos-coche fuera y 2 → 0 contacto; Meadow 7 → 0 contacto; Industrial 12 → 0, confirmadas en Chromium con tres vueltas/plazo normal de llegada. Dusty/Volcano conservan el avance de 0.50. Sunset Normal sube a 13 pasos con contacto: pendiente explícito. Fase 28 sigue abierta para reservas de grupos y balance humano; próxima prioridad alterna a variedad de fase 27.

Avance 0.54: prioridad lateral para un rival solapado aunque haya un líder algo más cercano, con frenado agregado frente a todos. Reserva común solo entre flancos opuestos, limitada por la sección real; si no hay espacio se conserva la línea y se cede longitudinalmente con física normal. Sunset Normal a 30 Hz 13 → 1 pasos con contacto y sin salida; a 60 Hz conserva seis pasos/tiempos, sin extrapolar la mejora entre frecuencias; se comparan retención por distancia, prioridad sola y dos reservas más generales, descartando la que reintroduce contacto Night. Fixture 0.53 conserva catorce trazados/materiales/modelos/pilotos. La planificación completa de trenes por un lado, las decisiones de varios segundos y el equilibrio humano siguen abiertos.

### 29. Local de 2–4 humanos y entradas — primera revisión 0.49

- Mejorar el actual modo de dos y añadir selector real de 3/4 con entradas independientes/configurables. Mantener R/C/Esc fuera de las teclas de conducción; incorporar mandos mediante Gamepad API.
- Cámaras y HUD por persona, tiempos/CP/vueltas, nombres/colores, clasificación y puntos de todos. Tres puede usar un cuarto cuadrante de información; cuatro necesita vista legible por coche.
- Pausa/reinicio coherentes, conexión/desconexión de mandos y pruebas de teclado simultáneo. El hardware puede limitar muchas teclas a la vez: comprobar dispositivos reales, sin prometer resolverlo por software.
- Estado 0.49: implementada primera entrega por pedido del usuario, adelantada respecto al refinamiento de tráfico. Previa 2/3/4, modelos/pinturas individuales, teclado y mandos estándar exclusivos con entradas analógicas; detección de ausencia/desconexión y pausa/manual return. Cámaras independientes, viewport local adaptable, minimapa con sus campos reales, HUD exterior de velocidad/posición/vuelta/CP/tiempo/mejor por piloto, resultados/puntos/reinicio/siguiente para todos. Audio hasta cuatro motores con contexto reutilizado.
- Validación: escenarios automáticos y Chromium con mandos emulados y teclado real automatizado; distribución en escritorio y móvil, capturas revisadas. No equivale a hardware real ni a una carrera humana de cuatro. Siguen pendientes remapeo configurable, comodidad de teclado/mandos físicos y rendimiento sostenido con cuatro cámaras. Física 5, CPU, recorridos y récords conservados.

### 30. Simulación y eventos mantenibles

- Extraer paso de simulación/controles normalizados sin DOM, Canvas, audio ni localStorage. Emitir eventos de checkpoint/vuelta/choque/final para sus consumidores.
- Actualización fija con acumulador, límite de recuperación tras pausas y render interpolado; medir antes de elegir frecuencia y presupuesto.
- Replays/escenarios reproducibles y migración con pruebas de paridad. Separar aleatoriedad visual de decisiones de carrera.
- Justificación: necesario para mandos, fantasmas, repetición y una autoridad online. Mantener Canvas 2D mientras sus mediciones lo permitan.

### 31. Contrarreloj, fantasma y repetición local

- Un modo completo con vuelta válida, récord versionado, fantasma grabado y reproducción; límites de tamaño y validación de datos importados.
- Datos estructurados, sin código ejecutable; distinguir récord local de tiempo confirmado por servidor.
- Estadísticas útiles y progresión después de comprobar el bucle de conducción. Evitar menús vacíos o desbloqueos que bloqueen funciones básicas de prueba.

### 32. Online: prototipo local y arquitectura viable

- Frontend puede seguir en Pages; el servidor de salas necesita un servicio separado. Comparar WebSocket con servidor autoritativo frente a WebRTC con anfitrión: WebRTC reduce ciertas cargas pero no resuelve señalización, NAT ni confianza en el anfitrión.
- Opción inicial preferida: Node y una biblioteca WebSocket pequeña/mantenida, simulación compartida sin interfaz y habitaciones pequeñas. Estado de carrera y resultados decididos por servidor; cliente envía controles, no posiciones/tiempos finales aceptados como verdad.
- API de crear/unirse, identificador de sala y credencial de sesión de alcance limitado; no colocar claves privadas de servicios en el frontend. Validar entradas, frecuencia, modelos, gates, vueltas y estados numéricos.
- Cuenta regresiva/fin coordinados; snapshots con tick y ack, predicción local, interpolación de otros coches y reconciliación acotada. Latencia no debe convertirse en teletransporte con ventaja.
- Desconexión/reconexión, caducidad de sala y reapertura de sesión; rechazar mensajes duplicados/antiguos. Definir qué ocurre con el coche ausente y mostrarlo claramente.
- Pruebas locales con retraso/jitter/pérdida de conexión, 2–4 clientes, final simultáneo y clasificación. No declarar competitivo un prototipo solo por conectar dos pestañas.

### 33. Online: despliegue, costes y validación de resultados

- Primero medir CPU, memoria, bytes por snapshot y salas por instancia. Como ejemplo de presupuesto: 600 bytes × 20 snapshots/s × 4 clientes ≈48 KB/s por sala (unos 173 MB/h), antes de compresión/sobrecarga; no es una medición del juego actual.
- Evaluar un contenedor pequeño en un proveedor como Fly.io, Railway o Render. Presupuesto orientativo de infraestructura inicial: 5–15 USD/mes más salida/datos y almacenamiento según uso; no es una oferta ni precio verificado. Planes gratuitos con suspensión pueden no servir para partidas continuas.
- Comparar precios vigentes y límites con una configuración concreta antes de contratar/desplegar. Esta entrega no contrata hosting, no crea cuentas y no introduce dependencia de un servidor remoto para jugar localmente.
- TLS, límites de conexiones/salas/mensajes, limpieza al desconectar, logs sin secretos y respaldo de datos. Resultados persistidos por servidor solo después de carrera validada; cuentas/ranking público más adelante.
- Prevención básica: autoridad de simulación, límites de entradas y secuencia, estado de gates/vueltas y tiempos del servidor. No prometer invulnerabilidad ni llamar seguro a localStorage.
- Estado: diseño; no existen salas, servidor ni ranking online en el producto actual.

### 34. Progresión y editor

- Estadísticas/retos con objetivos claros, pinturas y modelos sin ventajas injustas en competitivo.
- Editor con previsualización, materiales/anchuras/barreras por sector, guardado/versionado y validación; jugar varias vueltas con CPU además de pasar la geometría.
- Compartir formatos de pista y validación con herramientas internas. Mantener juegos anteriores recuperables.

### 35. Rendimiento, acceso y entregas continuas

- Medir física/render y sus percentiles en dispositivos reales, carga inicial, cachés/memoria y presupuestos de partículas/marcas. Optimizar el cuello confirmado antes de migrar el renderizador.
- Accesibilidad, foco, mandos, control táctil si resulta jugable, movimiento reducido y opciones gráficas con pruebas de resolución.
- Publicar versiones recuperables con recursos coherentes; distinguir push, despliegue Pages, pruebas automáticas y evaluación humana.
- Esta es una línea de trabajo continua, no una última fase que impida seguir creciendo.

### 36. Evolución gráfica: realismo estilizado con identidad retro

Pedido nuevo del usuario: mejorar mucho la presentación para que coches/pistas/escenarios tengan materiales y volumen creíbles, conservando un toque retro y la identidad lima/cian. No convertirlo en una imitación de otra franquicia ni confundir detalle con ruido que esconda curvas.

| Tramo | Desarrollo integrado | Criterio de comprobación |
|---|---|---|
| 36.1 Materiales y lectura de conducción | Asfalto con agregado fino, bordes/pianos claros, suelo nativo propio; marcas/partículas/sonido ligados a la acción y al material. Primer paso en 0.56. | Comparación de píxeles, límites físicos/visuales comunes, ausencia de derrape falso en recta y capturas cercanas antes/después. |
| 36.2 Coches y luz coherente | Mejorar carrocería, ruedas, reflejos contenidos, sombra de contacto y sombra direccional con luz del mundo; conservar cuatro siluetas/pinturas y orientación clara. | Mismo coche en recta/curva/frenada, tamaños pequeños, impactos, dos/cuatro cámaras; el render no modifica física ni contorno de colisión. |
| 36.3 Escenarios con escala y personalidad | Edificios/vegetación/rocas/público mejor proporcionados, bordes y elementos urbanos/costeros/rally propios, referencias visuales de frenado y curvas. | Huellas/sombras fuera del corredor y recuperación; ninguna decoración tapa salidas ni añade choques invisibles. |
| 36.4 Iluminación y ambiente | Dirección de luz consistente, profundidad por capas, noche/atardecer legibles y reflejos de materiales; condiciones húmedas solo si aspecto y reglas se definen juntos. | Contraste coche/suelo/gates, minimapa/HUD, ausencia de brillos o efectos que oculten rivales y geometría. |
| 36.5 Calidad y rendimiento medidos | Escalar detalle/retro/rendimiento, cachés y presupuestos, comparar captura y tiempos de frame en las mismas condiciones, accesibilidad/movimiento reducido. | Medir carga/dibujo/memoria y cuatro cámaras; no prometer FPS del dispositivo del usuario por una prueba de laboratorio. |

Mantener Canvas 2D mientras permita los resultados medidos. Evaluar una evolución del renderizador solo si aparece un límite confirmado y preparar transición comprobable. Recursos originales/procedurales o con licencia revisada; sin dependencias gráficas nuevas por apariencia.

Estado 0.56: textura de agregado de asfalto en detallado/retro, dos tiles reutilizados, cuerpo de carretera compartido con la sección legal, sin capa por frame; rendimiento y superficies nativas preservados. Es el inicio del tramo 36.1, no el rediseño visual completo. Coches, iluminación y escenarios detallados continúan abiertos.

## Continuación

Verificar main y el último registro de `ROADMAP_24_FASES.md`. 0.43 sustituye el motor y conserva la revisión de manejo 0.42. 0.44 comienza la fase 27 con tres pistas de ancho variable. 0.45 atiende el reporte de gas continuo demasiado fácil y motor agudo a máxima. 0.46 añade Night largo con anchos variables y 16 gates. 0.47 diferencia Volcano y conecta su material con el render del corredor. 0.48 revisa lectura de curvas y consulta de frenado de CPU. Próxima implementación: **retomar fase 27 con trazado propio y secciones variables en otro circuito**. 0.49 adelanta la primera entrega local 2–4 por pedido explícito. La evaluación humana de motor/conducción y del multijugador permanece abierta; puede reordenar la prioridad. Local ya admite 2–4 con teclado/mandos estándar; remapeo y hardware físico pendientes. Online sigue en diseño.

0.50 atiende el caso reproducible Dusty Fácil con radio interior por carril de disputa. No repetir la corrección como pendiente: continuar con reservas de espacio de grupos y cambios de línea, conservando comparaciones de ritmo libre, contacto físico y la base local 2–4.

En las cinco referencias de parrilla 0.50, 56 → 8 pasos de contacto, con contrapartidas: Night suma 32 pasos-coche fuera y Sunset Difícil dos pasos con contacto. Siguiente revisión: transición de línea/espacio cerca de curvas y grupos, atendiendo Night sin perder el avance de Dusty/Volcano. Estos casos no quedan cerrados por la batería automática.

0.51 atiende las tres referencias Night/Meadow/Industrial y conserva roces residuales como pendientes; no volver a tratarlas como no implementadas. Siguiente tramo recomendado: fase 27, silueta/ritmo y secciones de otro circuito (Frostbite es candidato por su semejanza histórica con Thunder). Fase 28 continúa abierta para grupos/Sunset y aceptación humana, sin exigir cero contactos en toda carrera arcade.

0.52 entrega Frostbite propio y desplaza sus pruebas de conservación al fixture 0.51. No repetir como pendiente su rediseño ni comparar tiempos nuevos con la vuelta antigua. Siguiente propuesta: continuar fase 27 con Pixel City u otro trazado todavía similar; conservar física/CPU/local y medir juego real. Las revisiones humanas y la fase 28 de grupos/Sunset siguen abiertas.

0.53 continúa fase 27 con Pixel City propio; no repetir este rediseño ni la migración de récords. Próxima propuesta: volver a fase 28 con reservas de espacio/elección de rival en grupos y el caso Sunset Normal, conservando las siete rutas variables y la base local 2–4. Las siete pistas uniformes, la escucha humana y el manejo siguen abiertos; no se declara terminada la base por una prueba automática.

0.54 desarrolla la fase 28 con prioridad y espacio entre flancos; no volver a tratar el caso de selección lateral Sunset como no implementado. Continúan las revisiones humanas y los contactos residuales arcade. Próxima propuesta: fase 26, mezcla regulable y revisión auditiva del motor; fase 27 conserva siete circuitos uniformes por desarrollar (Jungle es candidato). Mantener control ágil con frenado útil y la base local 2–4.

## Prioridad reafirmada por el usuario en 0.55

Leído el prompt maestro adjunto completo. Su referencia 0.40 es histórica: continuar desde main real, sin reiniciar ni cerrar fases por pruebas de sintaxis. Mantener conducción divertida, ágil y con frenado útil por delante de ampliar opciones; comparar curvas/derrape/recuperación en varias pistas y separar verificación automática de aceptación humana.

Conservar la evolución de CPU justa y competitiva, siluetas y anchos variados, pianos/barreras/escapatorias coherentes y duraciones cortas/medias/largas (unos 20/40/60 s sin regla universal). Cámara/HUD legibles, audio ligado al coche, local 2–4, progresión y online real siguen en este plan abierto. No limitarlo a 24 fases ni presentar funciones incompletas como terminadas.

0.55 termina este tramo de mezcla; **próximo trabajo: retomar fase 25, conducción y curvas**, con comparaciones reproducibles y sin dar por aceptado el manejo actual. Fase 27 conserva siete trazados uniformes (Jungle candidato); fase 26 mantiene pendiente el timbre/escucha y ambientes. Mantener el avance CPU 0.54 y local 2–4.

0.56 retoma fase 25 con correcciones concretas: el chasis no pivota a velocidad cero, ruedas aún dirigibles y salida rodando; CPU recupera un caso parado que dependía de ese pivote mediante avance mínimo con física normal y objetivo cercano. Audio/marcas comparten señal de deslizamiento y se eliminan marcas/humo falsos de recta. Se conservan fuerzas/modelos/reglas de conducción en movimiento y récords p5. No se declara aceptado el tacto de curvas ni cerrado el manejo.

Próximo: continuar las comparaciones de conducción de fase 25; desarrollar después 36.2 (coches/sombras) y los materiales restantes, manteniendo lectura retro y el plan abierto. La mejora gráfica acompaña control/CPU/pistas, no reemplaza su evolución.


### Avance 0.57 — tramo 36.2, profundidad de coches

Separadas las sombras del cuerpo rotado: silueta/ruedas proyectadas con vector fijo del mundo, capa de contacto en detallado y una sola sombra en retro. Bordes de carrocería calculan iluminación con su normal orientada en el mundo; garaje/parrilla explicitan su ángulo. Se conservan siluetas, pinturas, freno/impactos y modo rendimiento. No cambia simulación, colisiones, audio, récords ni las catorce rutas.

Tramo implementado y comparado automáticamente en Canvas real; capturas revisadas. No cierra 36.2 completo ni 36.3/36.4/36.5: quedan más detalle de carrocería, escenarios y luz ambiental coherente, medición completa de cuatro cámaras y evaluación humana. Las mediciones aisladas de dibujo no acreditan FPS del dispositivo del jugador. Próximo trabajo prioritario: fase 25, comparación de curvas/frenado/recuperación y conducción; continuar luego escenarios 36.3 y siete pistas uniformes de fase 27 según evidencia.
