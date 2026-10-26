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

### 27. Anchura, curvas y duración variadas — primera revisión 0.44

- Datos por sector con anchura y materiales; extender una consulta común como `roadHalfWidthAt` para render, línea de carrera, barreras, gates, minimapa y editor.
- Renderizar un corredor de anchura variable; validar la huella completa y las transiciones, no solo la línea central. Adecuar marchado de barreras, escapatorias y exclusión de decoraciones.
- Pianos utilizables, entrada más amplia/salida estrecha donde tenga sentido; rectas, chicanas, horquillas y zonas de adelantamiento con riesgo visible.
- Circuitos cortos, medios y largos: referencias aproximadas 20/40/60 s, sin forzar todas las pistas a una ventana ni alterar artificialmente el coche.
- Pruebas de geometría/anchura, 5 perfiles, superficie, cámaras y varias vueltas por coche/dificultad. Récords por versión; preservar los anteriores.
- Estado 0.44: primera migración en Sunset, Neon y Dusty, con secciones interpoladas/ancho útil 72–124/72–112/72–108 respectivamente. Pianos presentes/ausentes en Sunset/Neon y tierra ancha/estrecha sin pianos en Dusty. Consulta compartida con material físico, CPU, geometría de vallas/neumáticos, gates/meta, carteles, recuperación y exclusión de decoraciones; render/vista previa/mapa coherentes. Récords `:r1` conservan anteriores `:p4`.
- Comprobación: geometría con anchura variable y continuidad, pruebas de terreno/barrera/gate y píxeles reales de Canvas en tres pistas/cinco perfiles. Capturas revisadas; conducción humana pendiente. Se mantiene la física 4. No se añadieron longitudes: las referencias libres siguen aproximadamente 21/23/37 s. Ningún trazado de 60 s se declara terminado.
- Siguiente tramo: nuevas siluetas/ritmos y más perfiles, escogidos con espacio real entre ramales y límites. Quedan once pistas sin ancho variable; pianos de un solo lado y barreras personalizadas por sector aún pendientes.

### 28. CPU y estrategia de carrera

- Ampliar trazadas y elección de líneas según anchura real/material; anticipar frenadas por la línea elegida y reaccionar a grupos.
- Personalidades reconocibles por respuesta/riesgo/ataque/defensa, no potencia oculta. Errores acotados y recuperaciones que no regalen checkpoints.
- Medir ritmo libre y tráfico por separado; probar doblajes, coches detenidos, roces, golpes y última vuelta. Evitar que un contacto menor arruine una carrera por un fallo de progreso.
- Comparar tiempos, consistencia, tiempo fuera de pista y energía de impactos; contacto cero no es el objetivo de una carrera arcade con disputa.
- Estado: base y pruebas presentes, ampliación pendiente.

### 29. Local de 2–4 humanos y entradas

- Mejorar el actual modo de dos y añadir selector real de 3/4 con entradas independientes/configurables. Mantener R/C/Esc fuera de las teclas de conducción; incorporar mandos mediante Gamepad API.
- Cámaras y HUD por persona, tiempos/CP/vueltas, nombres/colores, clasificación y puntos de todos. Tres puede usar un cuarto cuadrante de información; cuatro necesita vista legible por coche.
- Pausa/reinicio coherentes, conexión/desconexión de mandos y pruebas de teclado simultáneo. El hardware puede limitar muchas teclas a la vez: comprobar dispositivos reales, sin prometer resolverlo por software.
- Estado: pendiente; solo hay dos humanos y 1–3 CPU en solo. No hay opciones vacías de 3/4.

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

## Continuación

Verificar main y el último registro de `ROADMAP_24_FASES.md`. 0.43 sustituye el motor y conserva la revisión de manejo 0.42. 0.44 comienza la fase 27 con tres pistas de ancho variable. 0.45 atiende el nuevo reporte de gas continuo demasiado fácil y motor agudo a máxima. Próxima implementación: **continuar fase 27 con trazados/ritmos distintos, incluyendo recorridos largos y más perfiles**. La evaluación humana de motor y conducción permanece abierta; puede reordenar la prioridad. Local 3–4 y online siguen pendientes.
