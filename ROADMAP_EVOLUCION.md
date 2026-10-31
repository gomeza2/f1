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

## Prioridades actualizadas — catálogo, online y vista inclinada

- 0.69: recuperación/marcha atrás y motor longitudinal ampliado, integrados y comprobados; deriva lateral aún rechazada para publicación.
- 0.70: primer catálogo visual de coches/pistas conectado a la carrera; fase 38 parcial.
- 0.71: primer motor de vehículos compartido con paridad; pendiente la carrera completa. Próximo tramo 30.2: geometría de pistas sin render, y después contactos/progreso/eventos y RaceState aislado para salas reales. Diseño concreto en [ONLINE_DESIGN.md](ONLINE_DESIGN.md). Online todavía no disponible.
- Conducción/derrape, CPU justa, audio, cuatro circuitos uniformes, gráficos y local siguen abiertos y se alternarán por impacto. No reducir todo el trabajo a CPU ni dar por terminada la sensación humana por tests.
- Vista 3D inclinada opcional en fase 37, solicitada para más adelante; no reemplazará por obligación la vista cenital actual.

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


### Avance 0.58 — conducción consistente, primer tramo de fase 30

La revisión de fase 25 encontró un defecto previo a retocar fuerzas: el límite por frame de 30 ms ralentizaba carrera y respuesta a 20/30 FPS. Se adelanta el paso fijo de fase 30: 60 Hz, acumulador, seis pasos/100 ms máximos, posición/rumbo interpolados en coches y cámaras, limpieza de historial al pausar/reiniciar/recolocar. Arranque conserva tiempo real; claves `:s1` separan registros anteriores sin borrarlos.

60 Hz conserva el paso físico de las referencias existentes de 60 Hz, admite controles/resolución de tiempo de 16,7 ms y evita duplicar las evaluaciones de física/IA de una base de 120 Hz. No se afirma una frecuencia óptima para todos los dispositivos ni que se haya terminado la separación de simulación/eventos: física aún depende de sistemas del IIFE. Cap de recuperación implica pérdida deliberada de tiempo ante bloqueos largos y tasas sostenidas inferiores a 10 FPS.

Comprobadas dirección/aceleración/freno/mano en asfalto/tierra/hielo y 108 vueltas válidas de carreras completas entre ritmos, con estados/tiempos idénticos a la referencia 60 Hz. Tramo implementado y comprobado automáticamente/en Chromium; resultados y límites en `tests/experiments/FIXED_STEP_058.md`; aceptación humana del manejo y claridad dinámica pendientes. No se cambian fuerzas/pistas para ocultar el defecto ni se cierra fase 25. Próximo: comparar curvas y recuperación sobre este reloj estable; fases 26 (timbre/escucha), 27 (siete rutas uniformes), 28 (estrategia/contactos), 29 (local/hardware) y 36 (escenarios/luz/materiales) continúan abiertas. Ghosts/online quedan después de consolidar la base, sin opciones ficticias.


### Avance 0.59 — fase 25, descarga del contravolante

Con reloj estable, se comparan cuatro intensidades de descarga de volante opuesto. Se elige 1,5× solo hasta cruzar el centro; después recupera el peso normal. Entrada inicial, neutral, correcciones analógicas pequeñas, yaw, aceleración/frenado y fuerza lateral permanecen. Aplica a 1–4 humanos con teclado/mandos; CPU mantiene su controlador. Se integra el cruce en tiempo continuo para evitar cambiar la respuesta al subdividir el paso.

Física 6 por cambio del controlador humano, con p5 conservado y reloj s1 sin migrar. Doce maniobras de cuatro modelos/asfalto/tierra/hielo, también con teclado real en Chromium, invierten yaw 117 → 100 ms y reducen ~17 % el giro residual anterior sin dar más velocidad. Se comprueba el resto del núcleo de conducción/IA/colisión contra el snapshot 0.58; no se congelan gráficos/interfaz ni se limita la evolución futura. Fixture versionado documenta la migración, no se reescriben tiempos históricos para aprobarla.

Tramo implementado y comprobado automáticamente/en Chromium: doce maniobras, 316 vueltas válidas de regresión, local 2–4 y 70 perfiles de superficies/barreras. Evidencia y límites en `tests/experiments/COUNTERSTEER_059.md`. No cierra la conducción humana ni convierte la maniobra en una vuelta humana equilibrada. Próximo: fase 27, Jungle Sprint con trazado/secciones propios (todavía uniforme), conservando esta respuesta; después escenarios 36.3 y escucha/revisión de timbre según pruebas humanas. Siguen abiertos el tacto de frenada/curva/derrape y los demás frentes del plan.


### Avance 0.60 — fase 27, Jungle Sprint propio

Jungle pasa de la forma uniforme a un enlace en S, horquilla y retorno rápido: 6.178 unidades, ancho 72–116, nueve gates y mundo 2000×1280. Pasto nativo, sin pianos asfaltados y perfil abierto automático, con alternativas conservadas. Paleta/grano del corredor variable definidos en el material, sin alterar grip/resistencia/partículas; Meadow uniforme conserva sus píxeles. El resto de trece rutas se congela en fixture 0.59; no se reescriben tiempos antiguos para la nueva ruta.

Se descartan un cierre con solapamiento y una variante cuya valla completa se desviaba >2 unidades del contorno. La elegida separa ramales (53,1), conserva margen al mundo 75,4 y pasa barreras con error máximo ~0,34. CPU Normal libre 36,12/35,03 s frente a 25,50/24,53. No equivale a diversión o equilibrio humano. Nuevo récord @3:p6:r1:s1 y @2 conservado. Física 6, reloj s1, CPU, audio, gráficos de coches y local se mantienen.

Estado: ocho pistas con secciones variables, seis uniformes por desarrollar. Evidencia/resultados en `tests/experiments/JUNGLE_060.md`. Próximo tramo recomendado: 36.3, ambientación con escala e identidad por tema y legibilidad; mantener manejo 25, seis rutas uniformes 27 (Thunder candidato), timbre/escucha 26 y competición/local abiertos. Las fases siguen ampliables; esta entrega no cierra el juego.


## Estado del plan activo — 0.62

Quedan **12 frentes abiertos (25–36)**, no doce entregas restantes: varios están implementados en parte y requieren más de una revisión. No hay un techo fijo ni se da por cerrado un sistema por su primera prueba automática.

| Frente | Estado real | Qué falta para consolidarlo |
|---|---|---|
| 25 Manejo/derrape/contacto | Base p6 y reloj s1, comparaciones y correcciones presentes | Speed Demon **260 km/h implementado en 0.62**, balance b1 con aceleración progresiva/frenada comprobadas. Continúan evaluación humana, agarre/derrape/recuperación y diferencias entre modelos. |
| 26 Audio | Motor separado y mezcla regulable | Timbre/escucha, fatiga a máxima, superficies/ambiente y contactos convincentes. |
| 27 Circuitos | 14, ocho variables, Jungle propio | Seis uniformes, más ritmo/identidad y evaluación humana de las rutas nuevas. |
| 28 CPU | 1–3 rivales, perfiles y tráfico compartido | Estrategia de grupos, doblajes/recuperación y agresividad justa comprobada. |
| 29 Local | 2–4, previa, coches/mandos/HUD/cámaras propios | Hardware y comodidad reales, remapeo/acceso según evidencia. |
| 30 Simulación | Paso fijo e interpolación implementados | Separar núcleo y eventos de DOM/audio/persistencia para replay/servidor. |
| 31 Contrarreloj/fantasma/repetición | Pendiente de producto completo | Vuelta válida, grabación/guardado/reproducción y límites. |
| 32 Online jugable | Diseño, sin servidor ni salas | Servidor autoritativo, salas, inicio/final coordinados y clientes reales. |
| 33 Online desplegado | Pendiente | Latencia/reconexión probadas, TLS/alojamiento/costes medidos y resultados validados por servidor. |
| 34 Progresión/editor | Puntos/récords locales presentes | Objetivos, estadísticas/editor/importación segura y pruebas de recorridos. |
| 35 Rendimiento/acceso/entrega | Presupuestos, cachés y pruebas presentes | Medición en dispositivos reales, accesibilidad/controles y publicación comprobada. |
| 36 Gráficos | Materiales/coches/luz y vegetación en evolución | Escenarios completos, edificios/ambiente/luz, escala y presupuestos medidos manteniendo lectura retro. |

### Hitos para llegar al online

1. **Salas y carrera bajo autoridad de servidor.** Extraer simulación compartida de fase 30, crear/unirse y correr 2–4 clientes; el frontend no decide posiciones/resultados válidos.
2. **Sincronización jugable.** Predicción/reconciliación, interpolación, retraso/jitter y desconexión/reconexión, con pruebas completas. Abrir dos pestañas no aprueba este hito.
3. **Servicio desplegado y competición validada.** Elegir alojamiento con precios vigentes/carga medida, TLS/límites/limpieza y clasificación confirmada por servidor. Pages sirve el frontend; no aloja un servidor persistente por sí mismo.

Son hitos de las fases 30/32/33, no promesa de tres mensajes ni una fecha. Online puede avanzar cuando esté el núcleo compartido y la base de carrera sea estable, mientras gráficos, editor y progresión continúan en paralelo. No hay online disponible hoy. El usuario reafirma terminar bien las fases y priorizar conducción divertida, derrape y variedad; la velocidad ~260 se medirá junto a frenado/curva en la próxima revisión de manejo.

### Avance 0.61 — primer tramo de escenarios 36.3

Vegetación más definida en detallado/retro: copas por capas, palmeras con hojas perfiladas, pinos por niveles/nieve y cactus con volumen, raíces/troncos y sombras orientadas con la luz fija del mundo. Se conservan posiciones/tamaños/huellas/presupuestos y el modo rendimiento anterior. Sin nueva física, objetos de colisión ni decoración dentro de escapatorias; carreteras/CPU/control p6/reloj s1/audio/local permanecen.

Pruebas y capturas en `tests/experiments/VEGETATION_061.md`. Es un tramo de vegetación, no toda la ambientación terminada. Próxima prioridad: volver a fase 25 con aceleración/frenada/derrape y objetivo de velocidad ~260 para el modelo rápido, preservando variedad de coches y límites justos. Online continúa en sus hitos y escenarios/otras fases siguen abiertos.


### Avance 0.62 — fase 25, velocidad y balance medidos

Speed Demon llega a 260 con aceleración progresiva específica (taper 0,58), manteniendo la salida. Teclado y física reales en Champion: 0–100 1,17 s, 0–200 2,73 s, 0–260 4,02 s; frenada normal desde máxima 114 unidades frente a 105 desde 250. No se cambia el HUD para simular potencia ni se añaden ventajas a la CPU. Balanced/Corner/Rally conservan sus modelos y curva anterior; rivales de producción mantienen Balanced. El modelo más veloz conserva sus desventajas de agarre/dirección/salida de pista.

Balance b1 separa récords sin borrar p6/s1 previos. Los fixtures anteriores permanecen: el helper valida únicamente máximo y taper nuevos de Speed y exige identidad del resto de campos. El núcleo p6 acepta una propiedad opcional de aceleración; el valor por defecto conserva los otros coches. Gráficos 0.61, catorce rutas, materiales, audio, colisiones y local se mantienen. Evidencia/resultados en `tests/experiments/SPEED_BALANCE_062.md`.

Tramo implementado y pendiente de aceptación humana de sensaciones, no cierre de toda la física. Próxima revisión recomendada: fase 25, ensayo de derrape con componente lateral/recuperación y freno de mano, comparando variantes antes de reemplazar el modelo actual. CPU/sonido/seis pistas uniformes/escenarios y los hitos online siguen abiertos; no se reanuncia 260 como trabajo pendiente.


## Avance 0.63 — ensayo de fase 25 y corrección integrada de fase 28

Se comparó deslizamiento lateral 0/0,10/0,18/0,28, recuperación por agarre y compensación de dirección CPU. **No se publica el prototipo**: la matriz amplia detectó pérdida de ritmo y contactos nuevos en Meadow/Industrial, incluso al probar pulsos. El diff experimental se conserva en `tests/experiments/HANDBRAKE_CANDIDATE_063.patch`, aplicado exclusivamente sobre 0.62; no lo carga el juego. No volver a anunciar este ensayo como derrape integrado ni repetir su ajuste aislado sin resolver planificación/control compartidos.

Sí se integra una corrección real de tráfico: cierre radial inminente ignorado cuando el rival era longitudinalmente más rápido. La CPU solicita su freno normal ante esa convergencia; se conservan contactos físicos y roce paralelo. Física p6, b1, s1, Speed 260, conducción, modelos, rutas y récords existentes permanecen. Evidencia en `tests/experiments/HANDBRAKE_SLIP_063.md`; no se cierra toda la fase 25/28 por este caso.

Próximo tramo recomendado: fase 27, Thunder Valley con recorrido/secciones propios, alternando después con una revisión de planificación/control antes de retomar derrape lateral. Mantener timbre/escucha 26, local 29, escenarios 36 y los hitos online abiertos. Doce frentes (25–36), ampliables; no son doce mensajes ni entregas restantes.

Verificación estable 0.63: 120 vueltas válidas de tráfico con límites anteriores conservados y cero salidas; caso CPU antes/ahora y Chromium, 14 pistas/70 perfiles, reloj/contravolante/Speed 260, local 2–4 y entrega local bajo `/f1/` superados. El candidato lateral fallido queda fuera de estos resultados. Evaluación humana y sitio público (403 del proxy) pendientes.


## Avance 0.64 — variedad, superficies y lectura visual, fase 27

Thunder Valley conserva nombre/posición, con nuevo recorrido 7.081,60 (+101,6 %), mundo 2100×1344, ancho 76–116, sectores con/sin pianos, dos tramos de tierra y diez gates. Referencia Normal libre 40,80/39,80 s, sin retocar velocidad ni conducción. Abierto por defecto; cinco perfiles válidos y sin salto de valla al cambiar material. Raster de tierra compartiendo definiciones físicas, caché, preview/minimapa mixtos y pintura solo en asfalto. Las otras trece rutas/imágenes y el núcleo de CPU/conducción se conservan. Récord Thunder @3/r1 guarda @2; p6/b1/s1 permanecen.

Nueve pistas variables y cinco uniformes: Champion, Coastline, Rally, Meadow e Industrial. La fase 27 sigue abierta; variedad no se limita a hacer más larga cada pista. Evidencia y límites en `tests/experiments/THUNDER_064.md`. Evaluación humana de diversión/curvas y hardware pendiente.

El usuario pide alternar los frentes y no concentrar cada entrega en CPU. En 0.64 no se modifica IA: solo se valida el trazado. **Siguiente tramo recomendado: fase 26, motor/feedback audible**, comparando crucero a máxima, aceleración, retención y cambios. Continuar después escenarios 36 y manejo 25 con planificación estable antes de retomar el ensayo lateral rechazado. Doce frentes abiertos, online según sus hitos, sin presentar salas inexistentes.

Verificación de 0.64: 34 vueltas de la matriz Thunder, tres más en Chromium a reloj fijo; 40.886 probes de secciones y 7.462 de píxel/borde, color/material en tres calidades, 39 imágenes idénticas de las otras trece carreteras, local 2–4 en Thunder, sintaxis/integración/geometría y entrega local superados. Sensación humana y Pages público (proxy 403) pendientes.


## Avance 0.65 — fase 26 y portada/paddock local

Motor con pulsos revisados, registro una octava más grave, cuerpo triangular y crucero suave detectado por velocidad real; se filtran muestras repetidas de física de 60 Hz para conservar respuesta a 20–144 Hz. Se comparan alternativas y máximos de los cuatro modelos en Web Audio, manteniendo marchas/carga, volúmenes, contexto y presupuesto de nodos. La voz cambia; no se cambian aceleración, velocidad, fuerzas ni CPU. Escucha humana pendiente, fase 26 sigue abierta.

Por pedido adicional del usuario se mejora la portada: bandera e identidad retro, inicio/resumen de pista-coche primero, personalización directa y local 2–4 desplegable con foco/ARIA/valores retenidos. Controles/pistas/modos existentes conservados. Evidencia y pruebas en `tests/experiments/MOTOR_PADDOCK_065.md`; no volver a tratar el motor ni la nueva portada como solo planificados.

Siguiente tramo recomendado: **36.3, escenarios/referencias visuales y ambientación**, alternando con cinco rutas uniformes y manejo; mantener el motor abierto a feedback audible. Se respeta alternar áreas y no centrar cada entrega en IA. Online permanece en sus hitos, sin opciones vacías ni plazo artificial.

Verificación 0.65: cuatro modelos a sus máximos reales, cinco cambios de marcha/sexta estable, audio real/mezcla/mute/ciclo de vida y hasta cuatro humanos; portada nativa en cinco resoluciones con foco/ARIA/selecciones retenidas, menú de 14 pistas/24 combinaciones, integración y entrega local superados. Quedan escucha humana/dispositivos y Pages público (proxy 403) pendientes.


## Avance 0.66 — arquitectura y referencias visuales, tramo 36.3

Tribunas con cuatro gradas, público determinista, pasillos y soportes; ciudad con azoteas/fachadas y ventanas encendidas/apagadas; cabañas nevadas, depósitos con persianas, contenedores acanalados, tanques con escalera y carpas con paneles. Siete tipos en Detallado/Retro, conservando dibujos de Rendimiento. Sombras coherentes con la luz mundial de coches/vegetación. Sin nuevos objetos, recursos externos o actualización por fotograma: continúa el fondo estático cacheado.

Pruebas de huella en 1.829 colocaciones, 14 pistas/tres calidades: espacio de recuperación, límites, separación y caché superados (759 objetos Detallado/464 Rendimiento). Comparación Chromium: 21 fondos modificados, 21 iguales; las 42 imágenes de carretera y todos los metadatos de colocación idénticos a 0.65. Capturas generales/cercanas revisadas en tribunas, ciudad, nieve e industria. No son carreras humanas ni medición de FPS de hardware.

Código de conducción, CPU, geometría, materiales, controles, audio y récords intacto: al quitar únicamente la nueva función gráfica y su despacho, el script reproduce exactamente 0.65. Física p6/b1/s1 conservada. Evidencia en `tests/experiments/ARCHITECTURE_066.md`. La fase gráfica sigue abierta: rocas, más variantes e iluminación ambiental. Próximo tramo recomendado: fase 27, Coastline con trazado y secciones propios, escapatorias y variación de anchura/pianos; alternar con manejo/derrape y escucha humana, sin concentrar todas las entregas en CPU. Siguen doce frentes abiertos, ampliables; no son un número fijo de entregas restantes. Online sigue sin backend/salas.

Cierre 0.66: integración (70 perfiles), menú, local 2–4 y entrega local bajo `/f1/` superados. Pages público pendiente: CONNECT rechazado por el proxy con HTTP 403; no es un fallo observado del juego.


## Avance 0.67 — Coastline, variedad real de circuitos, fase 27

Coastline conserva identidad costera/nombre/posición, con nuevo trazado 7.142,93 (+67,6 %), mundo 2000×1280, ancho 72–116, recta amplia y curvas interiores técnicas, sectores con/sin pianos, tierra al 31–37 % y diez checkpoints. Automático abierto y cinco perfiles comprobados. Se amplía el raster compartido de Thunder para respetar el material/ancho de Coastline en pista, preview y minimapa, sin pintar la línea central sobre tierra. Se corrige salto de seis unidades en la valla al cambiar material. No cambia el núcleo de conducción/CPU, modelos, fuerzas ni audio.

Geometría: margen al mundo 66,21 y separación libre de ramales 35,57; distancia de silueta anterior 0,432 y a la más cercana 0,305. 34 vueltas válidas entre perfiles/modelos/dificultades/parrilla; Normal libre 39,90/38,83 s, parrilla completa con seis pasos de contacto y cero salidas. Tres vueltas adicionales en Chromium a reloj fijo. No se declara equilibrio humano por estos tiempos.

Se conservan las otras trece rutas y sus 39 imágenes de carretera. Récord nuevo `COASTLINE RUN@3:p6:r1:s1:b1`; ruta @2 conservada, sin migrar física/balance/reloj. Diez pistas variables; cuatro uniformes restantes: Champion, Rally, Meadow e Industrial. Evidencia y límites en `tests/experiments/COAST_067.md`.

Siguiente tramo recomendado: fase 25, conducción/frenada/derrape con comparación controlada sobre el reloj estable y sin reactivar a ciegas el ensayo lateral descartado en 0.63. Alternar con las cuatro pistas pendientes, gráficos/local y audio según feedback humano; no concentrar todas las entregas en CPU. Doce frentes ampliables y online aún sin backend/salas, sin prometer un número fijo de entregas.


## Avance 0.68 — pedales, entrada en curva y control, tramo de fase 25

Se confirman dos defectos de control: cualquier presión de acelerador anulaba casi toda la retención, y acelerar+frenar mantenía toda la tracción contra el freno. Nueva mezcla compartida: freno parcial quita empuje progresivamente, freno completo lo cancela; retención continua con acelerador efectivo. Teclado P1–P4 y gatillos de mando comprobados. No se cambian límites de aceleración/frenado/velocidad, agarre/giro, modelos, pistas, sonido ni fuerzas del freno de mano.

Speed desde 200 con gas+freno pasa de 113,51 a 67,17 unidades de parada, exactamente lo que ya lograba soltar gas y frenar; el tope real 260 y 0–260 de 4,02 s permanecen. La retención con gatillo 0,001 deja de saltar: a los 0,5 s desde 200 pasa de ~198,73 a ~185,04 frente a 185 con gatillo cero. Récords p6/b1/s1 se conservan porque no se amplía el rango de fuerzas alcanzable anteriormente.

Comprobado: cuatro modelos/pedales parciales/mano/teclado, 18 trayectorias digitales preservadas entre superficies, reloj 20–144 Hz, doce maniobras de contravolante, Speed 260, geometría Coast/Thunder; 36 vueltas actuales y 36 de referencia con estados/tiempos/contactos/finales idénticos en Sunset Normal, Coastline Normal y Frost Hard. Chromium con teclas nativas P1–P4 y gatillos emulados, local 2–4/cinco tamaños, audio real, integración (70 perfiles) y entrega local `/f1/` superados. Evidencia en `tests/experiments/PEDALS_068.md`.

**No cierra la fase 25:** deriva lateral física y aceptación humana siguen abiertas. No se reactiva el ensayo descartado de 0.63. Siguiente experimento: entrada/salida de derrape, recuperación y contravolante medidos con tráfico/local, sin convertir cada entrega en trabajo de CPU. Continúan diez rutas variables/cuatro uniformes, gráficos, audio y modos/online según hitos; doce frentes ampliables, no doce entregas fijas. Sitio público de Pages aún sin verificar por el bloqueo conocido del entorno.


## Avance 0.69 — motor longitudinal ampliado y recuperación, fases 25/11

Se añade marcha atrás controlada: ~0,35 s parado sosteniendo el freno con acelerador suelto, máximo 28 km/h. Dirección inversa, freno al cambiar a avance, resistencia compartida en ambos sentidos, contactos con velocidad firmada, HUD R por piloto y luces blancas/audio de reversa. El cálculo longitudinal se organiza en `updateDriveSpeed`, con mando explícito de marcha: frenar una CPU parada no la hace retroceder automáticamente. No hay fuerzas o límites distintos por tipo de piloto.

Corregida clasificación al retroceder por la meta: `raceOffset` mantiene progreso previo a la salida sin conceder vueltas/gates; se restablece al volver o completar una vuelta válida. El avance fijo también protege directamente pausa/cuenta regresiva/fuera de carrera. Avance, topes, grip, dirección y mano previos conservados; se mantienen récords p6/b1/s1.

Ensayo lateral: respuesta por orientación/velocidad, recuperación limitada por agarre, previsión/contactos según movimiento y compensación de control. Dos intensidades evaluadas; 0,18 conserva Night pero añade cuatro contactos en Meadow (presupuesto 0). Se rechaza para publicación y se archiva en `tests/experiments/INERTIAL_DRIFT_CANDIDATE_069.patch`, relativo exclusivamente a 0.68. Las vueltas exploratorias fallidas no cuentan como validación estable ni se amplían presupuestos.

Estable: cuatro modelos, seis terrenos, interbloqueo/reversa/retorno, dirección, contactos, vallas, gates/meta/clasificación y pausa comprobados; 18 trayectorias digitales idénticas, 36 vueltas actuales emparejadas con 36 de referencia 0.68, más 12 vueltas Meadow dentro del presupuesto original. Chromium: P1–P4 simultáneos, gatillos emulados, HUD/cámaras, recuperación frontal, pausa y nueva carrera; local 2–4/cinco resoluciones, audio, integración y carga local. Evidencia en `tests/experiments/RECOVERY_069.md`.

La fase 25 no se cierra: el siguiente ensayo lateral debe contemplar la evolución del ángulo de deslizamiento durante la planificación, y compararse con contactos/ritmo antes de integrarse. Alternar con circuitos/gráficos/local: diez pistas variables/cuatro uniformes, doce frentes ampliables, online aún sin backend. Evaluación humana, mando físico y Pages público pendientes.


### 37. Vista 3D inclinada opcional — planificada

Cámara ortográfica elevada, ligeramente de costado, con pista legible y coches/escenario de volumen estilizado, materiales retro y paleta lima/cian. Comparar una proyección 2.5D con WebGL/meshes simples antes de elegir tecnología por coste/resultado. No presentar una transformación CSS plana como 3D completo ni añadir un selector vacío.

Un solo estado físico XY para 2D y 3D, con geometría/material/ancho compartidos. Primer prototipo de una pista: coches, pianos, barreras visibles y sombras, oclusión/cámara y minimapa coherentes. Después validar las catorce, cuatro cámaras locales, móvil/resize/fullscreen y rendimiento con fallback 2D. No migrar todos los recursos a una biblioteca hasta justificarla. La simulación online no debe depender del renderizador.

### 38. Catálogo, presentación y preparación de carrera — parcial 0.70

Primera entrega: fichas de cuatro coches/seis pinturas y catorce circuitos, prestaciones desde los modelos reales, previews originales, búsqueda por nombre/superficie, selección/foco/teclado y adaptación a pantallas pequeñas. Conecta a los selectores existentes: no hay otra configuración de carrera paralela. El catálogo de coche elige P1; los otros puestos conservan la parrilla local.

Siguientes tramos: fichas equivalentes por asiento local, filtros/orden cuando la colección crezca, presentación de pilotos/CPU con personalidades explicadas, categorías/desbloqueos solo si tienen lógica real, y coherencia con lobby online. Evitar menús cargados, cifras técnicas sin utilidad, pinturas que confundan la dirección y nombres que no distingan rivales.

## Avance 0.70 — catálogo integrado y ruta hacia online

Fichas de coches con seis pinturas, siluetas propias y comparación de giro/freno/agarre respecto a Balanced; fichas de las 14 rutas con trazado cacheado, superficie, longitud por categoría, checkpoints, anchura variable y perfil predeterminado. Búsqueda sin distinguir tildes, estado seleccionado, diálogo accesible con foco contenido y retorno al botón. Selección conectada a garaje, preview y carrera real; sin mutar la carrera anterior al navegar el menú.

Próximo tramo recomendado: extracción de simulación compartida para online (30/32.1), con contratos y pruebas definidos en `ONLINE_DESIGN.md`. La 3D inclinada queda después como opción 37, conservando 2D y una única física. No existen todavía servidor/salas/ranking online ni vista 3D en el producto; no se crean botones que aparenten esas funciones.


## Avance 0.71 — fase 30.1, conducción compartida para online

`driving-core.js` es la implementación canónica de modelos/materiales y movimiento: aceleración/pedales/reversa, agarre, dirección/yaw, deriva escalar previa y posición. El navegador la consume y Node puede importarla sin DOM/Canvas/audio/storage/reloj. Reglas inmutables por instancia, coches con estado propio y sin dos fórmulas de conducción paralelas. API versión 1; física p6/b1/s1 y récords conservados.

Verificación: 140 casos/3.164 pasos de cuatro modelos, siete rutas/cinco secuencias, fuerzas de siete materiales y seis funciones trasladadas intactas; 16 escenarios nativos/96 snapshots y 3.552 llamadas observadas al paso compartido; 36 vueltas actuales emparejadas exactamente con 36 de referencia 0.70. Comparación adicional de 28 vectores Node/Chromium: pequeñas diferencias de redondeo en posiciones/ángulos se miden con cota 1e-10, manteniendo velocidad/timers/flags exactos. No se afirma determinismo binario universal ni se relajan presupuestos de contactos/ritmo de carreras.

Se comprueba catálogo/paddock/local, reversa, audio, reloj fijo, integración y entrega bajo `/f1/`, incluida carga desde HTML anterior sin la dependencia y mensaje/arranque bloqueado si falla. Evidencia en `tests/experiments/SHARED_DRIVING_071.md`; API en `SIMULATION_ARCHITECTURE.md`.

**Próximo tramo 30.2:** datos y geometría/materiales/barreras de las catorce pistas sin render. Siguen 30.3 contactos/progreso/reloj/eventos y 30.4 RaceState completo aislado. Solo después salas y sincronización de 32/33. Dos vehículos aislados no acreditan dos salas; no hay online todavía. Las fases de manejo/CPU, audio, pistas, gráficos/3D opcional y catálogo siguen abiertas, sin concentrar cada entrega en IA.
