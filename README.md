# PIXEL GRAND PRIX

Juego web arcade de carreras 2D desde arriba, con identidad retro propia, circuitos de formas variadas, rivales controlados por CPU, derrapes, superficies y campeonato.

## Nuevo en 0.80 — primeras carreras online desde el juego

**ONLINE PRIVADO · 2–4 PILOTOS** abre la sala integrada: dirección de servidor, código de invitación, nombre, coche/pintura/control, configuración del anfitrión y confirmación de listos. Cada cambio reinicia la confirmación. La misma pantalla de conducción muestra el coche del piloto conectado con cámara propia, velocidad, posición, vueltas, checkpoints, tiempo y minimapa; usa teclado, mando o táctil.

El servidor decide movimiento/contactos/vueltas/resultado usando el motor original. El cliente envía controles y representa snapshots con interpolación acotada, sin extrapolar posiciones indefinidamente ni guardar esos tiempos como récords locales. Cuenta regresiva, efectos visuales/audio existentes, reconexión automática con la misma identidad, resultados compartidos y regreso a la sala para revancha. Escape libera tus controles: **no pausa la carrera de los demás**. Abrir ajustes, ocultar la pestaña o perder datos recientes aplica freno de seguridad.

Para jugar hace falta ejecutar/configurar un servidor compatible: no hay servicio público predeterminado todavía. El juego recuerda la dirección pública que ingresás; la credencial de reanudación vive solo en memoria y no se comparte con los rivales. HTTPS exige WSS. Si las versiones físicas no coinciden, se rechaza la conexión. En local: servir los archivos por HTTP, iniciar el backend y autorizar el origen de ese frontend; ver [server/README.md](server/README.md).

**Hosting propuesto: Render Web Service en plan sin suspensión + GitHub Pages**, con receta y datos en [HOSTING.md](HOSTING.md). No se contrató ni desplegó un servidor. La URL pública se puede pegar directamente en la sala y configurar como valor predeterminado cuando exista.

Pruebas: cuatro navegadores con UI/Canvas y controles completan vueltas con resultados del servidor, reconexión real y cámara/HUD por identidad; modos locales/táctil/recursos conservados. Es una primera integración, sin predicción local: latencia competitiva, dispositivos humanos y alojamiento público siguen pendientes en 33.2. No se cambian físicas, CPU, audio de motor, pistas ni récords p6/b1/s1. Evidencia en [ONLINE_CLIENT_080.md](tests/experiments/ONLINE_CLIENT_080.md).

## Nuevo en 0.79 — servidor real de salas privadas (fase 32.1)

`server/` incorpora un servidor Node/WebSocket autoritativo para 2–4 humanos: código de invitación, elección de coche/pintura, configuración, confirmación de listos ligada a la revisión de la sala, salida coordinada y resultados compartidos. Ejecuta los mismos módulos físicos y checkpoints del juego, con sesiones independientes. El cliente solo envía pedales/dirección: no puede declarar su posición, vueltas o tiempos.

Incluye reconexión durante diez segundos con credencial privada que se renueva, frenado de seguridad sin marcha atrás al perder entradas, abandono DNF sin puntos y límites de mensajes/conexiones. Una sobrecarga cancela la carrera en lugar de validar tiempos alterados. Se comprobaron salas simultáneas y cuatro navegadores con vueltas completas.

**En 0.79 se entregó solo el backend; la interfaz se integró después, en 0.80.** Todavía no hay servicio público desplegado. Las pruebas de navegadores usan clientes de protocolo, reloj acelerado y conducción automática; no demuestran jugabilidad por Internet.

El juego local sigue siendo estático y no necesita npm. Para probar el servidor por separado: Node >=22, `npm ci --prefix server`, `npm start --prefix server`. Contrato y operación: [server/README.md](server/README.md). Evidencia: [ROOMS_079.md](tests/experiments/ROOMS_079.md). Se conservan las catorce pistas, cuatro modelos, CPU, campeonato, contrarreloj/fantasma, local 2–4, táctil y récords p6/b1/s1. No se cambian fuerzas, audio ni trazados en esta entrega.

## Nuevo en 0.78 — sesiones de carrera independientes

El juego utiliza `race-session.js` para poseer coches, reloj fijo, cuenta regresiva, pausa, contactos, vueltas, clasificación y puntos base de llegada. La misma sesión se ejecuta directamente en Node con `driving-core.js`, `track-core.js` y `race-rules.js`. Se conserva la conducción, el campeonato, contrarreloj/fantasma, local 2–4, táctil, catorce pistas y récords p6/b1/s1.

Cada sesión tiene identidad, eventos ordenados, estado propio, snapshots separados y resultados que no pueden modificarse. Se comprobaron carreras completas intercaladas sin compartir relojes, coches, vueltas o resultados; las carreras cerradas dejan de acumular tiempo aunque el anfitrión vuelva a pedir otro frame. La interfaz conserva cámaras/audio/partículas, entradas locales y temporada; el núcleo no necesita un navegador ficticio para funcionar.

Esto prepara el servidor autoritativo. **Todavía no hay salas online disponibles.** La CPU actual conserva su controlador en el adaptador; las primeras salas se diseñan para humanos. Transporte, salas/listos, desconexión/reconexión, sincronización y validación de mensajes quedan en 32/33. La repetición de poses local no se convierte por esto en replay completo de entradas/eventos ni en ranking seguro.

Arquitectura y API: [SIMULATION_ARCHITECTURE.md](SIMULATION_ARCHITECTURE.md). Pruebas y límites: [SESSION_078.md](tests/experiments/SESSION_078.md).

## Nuevo en 0.77 — Rally Canyon más largo y con otro ritmo

El circuito **12 · RALLY CANYON** conserva su nombre y superficie de tierra, con un trazado nuevo de 9.031 unidades del mundo (antes 4.005), recta larga de salida, dos retornos y una secuencia técnica al sur. El ancho útil varía de 68 a 128 unidades y los trece checkpoints evitan saltarse ramales. Sigue abierto por defecto; admite las cinco opciones de barreras. Las vueltas automatizadas de referencia rondan 48–60 s según coche/dificultad, sin fijar un tiempo objetivo humano.

La tierra ahora tiene grano estático y carece de la línea central de asfalto. El menú utiliza la paleta del material real también para tierra, hielo, pasto y suelo volcánico. Se mantienen las otras trece pistas, los cuatro coches, física/CPU, modos, controles táctiles y local 2–4.

La revisión del trazado usa una clave nueva de récord/fantasma. Los tiempos generales y de contrarreloj anteriores se conservan por separado; un fantasma del trazado anterior no se carga en el nuevo. La lectura de tiempos de contrarreloj admite hasta 512 combinaciones actuales/históricas de pistas/modelos conocidos, priorizando las actuales; se mantienen ocho fantasmas activos como máximo. Solo se trata de datos locales, sin verificación de servidor.

Pruebas y límites en [RALLY_077.md](tests/experiments/RALLY_077.md). Quedan tres pistas de ancho uniforme: Champion Road, Meadow Run e Industrial Mix. La siguiente prioridad técnica sigue siendo 30.4, aislamiento completo de carrera antes de salas online; manejo/derrape, audio y aceptación humana continúan abiertos.

## Nuevo en 0.76 — contrarreloj con fantasma personal

Elegí **CONTRARRELOJ**, pista, coche y barreras, y pulsá **CORRER CONTRARRELOJ**. Tres vueltas válidas sin CPU: practicá frenadas, trazadas y derrapes contra tu propia mejor vuelta. Los checkpoints y la conducción son los mismos de carrera. La primera vuelta crea una referencia; una mejora válida reemplaza el fantasma para la siguiente vuelta/intento. **FANTASMA ON/OFF** está en la barra exterior y no cambia el coche ni el cronómetro.

Récord independiente por trazado/física/coche/perfil real de barreras; AUTO y su perfil equivalente comparten récord. Resultados muestran las tres vueltas, mejor de la tanda y récord personal, sin puntos de campeonato; **OTRO INTENTO** repite la pista. El lobby local cambia a partida rápida: el contrarreloj es individual.

Guardado local versionado (`pixelGP.timeTrials.v1`), con todos los tiempos y hasta ocho fantasmas de las últimas mejores vueltas guardadas. Cada repetición admite hasta 180 s, muestreo de poses aproximadamente a 10 Hz y máximo 1.802 muestras; las vueltas más largas conservan su tiempo, hasta menos de una hora, sin prometer un fantasma completo. Datos inválidos se descartan. Si el navegador rechaza el guardado, resultados avisa que el récord queda solo en esta sesión. Se conservan los récords generales anteriores. No son resultados verificados por servidor ni una repetición completa de carrera.

Evidencia y límites: [TRIAL_076.md](tests/experiments/TRIAL_076.md). Siguiente requisito para online: aislamiento completo de estado/reloj/resultados en fase 30.4; también siguen abiertos manejo/derrape, audio, cuatro rutas uniformes y gráficos.

## Cómo ejecutar

Abrí `index.html` en un navegador moderno. No necesita servidor ni instalación de dependencias para su versión básica.

Para publicarlo, podés habilitar GitHub Pages desde **Settings → Pages** y usar `main` y la carpeta raíz (`/`). La entrega mantiene rutas relativas y funciona bajo `/f1/`.

La versión aparece en el pie. JavaScript y CSS llevan una versión en su URL para evitar reutilizar los recursos de una entrega anterior cuando se recibe el HTML nuevo. Esto no fuerza la renovación de un HTML que siga en caché. La comprobación local de entrega no confirma por sí sola el despliegue público. Ver [notas de entrega y pendientes](RELEASE_NOTES.md).

## Controles

- **Táctil (P1):** automático en teléfono; botón **TÁCTIL** para activar/ocultar, tamaño y disposición. Flechas giran, GAS acelera, FRENO frena/retrocede y MANO derrapa en movimiento. Admite varios dedos.
- **Jugador 1:** W acelera, S frena, A/D gira, ESPACIO freno de mano. Frenar a fondo tiene prioridad aunque mantengas acelerar (también en P2–P4 y mandos).
- **Jugador 2:** flechas para acelerar, frenar y girar; ENTER freno de mano.
- **Jugador 3:** I acelera, K frena, J/L gira; U freno de mano.
- **Jugador 4:** T acelera, G frena, F/H gira; Y freno de mano.
- **Mandos estándar (local):** cada piloto puede elegir un mando diferente en la parrilla. Stick izquierdo gira, RT o A acelera, LT o B frena, X derrapa. Acelerador, freno y dirección analógicos con zona muerta. Conectá el mando y pulsá un botón para que el navegador lo detecte. Si falta un mando asignado, la carrera espera en pausa; reconectalo y pulsá ESC o SEGUIR. No se requiere mando para usar teclado.
- **Marcha atrás:** detenete, soltá el acelerador y mantené el freno ~0,35 s (S, ↓, K o G; LT/B en mando). Retrocede hasta 28 km/h, con dirección inversa y señal R en cada HUD. Soltá el freno y acelerá para detener la marcha atrás y volver hacia adelante. Acelerar+frenar juntos sigue deteniendo el coche sin seleccionar reversa.
- **R:** reinicia la carrera actual.
- **C / botón VISTA:** alterna vista cercana y circuito completo en modo individual. El modo local usa una cámara por jugador: dos mitades para dos personas, tres/cuatro cuadrantes para tres/cuatro. La vista se adapta al espacio de la ventana sin deformar los coches.
- **ESC:** pausa o reanuda la carrera. Si estás en pantalla completa, también permite salir. La pestaña oculta pausa automáticamente; al volver se reanuda de forma manual. Pausar limpia las teclas mantenidas: volvé a acelerar al continuar.
- **Pantalla completa:** botón en la cabecera.

## Opciones

Antes de correr podés elegir gráficos, dificultad, circuito, coche, color y perfil de barreras.

- **Según circuito:** utiliza el perfil guardado para esa pista.
- **Vallas completas:** barreras en ambos lados del recorrido.
- **Mitad + neumáticos:** barreras en una mitad y neumáticos en curvas seleccionadas de la otra.
- **Solo en curvas:** coloca barreras en sectores de mayor curvatura.
- **Sin barreras:** deja zonas abiertas, pero la salida de pista sigue teniendo penalización y recuperación.

## Parrilla local de 2–4 jugadores — 0.49

En el paddock, elegí la pista, las barreras y los gráficos. **PREPARAR MULTIJUGADOR · 2–4** lleva a la parrilla local: seleccioná cuántos juegan y configurá cada coche/pintura/control. P1 conserva la elección del garaje superior; P2 ya no está limitado a Balanced. La dificultad y cantidad de CPU corresponden solo al botón individual.

Cada persona tiene cámara propia y un panel exterior con posición, velocidad, vuelta, checkpoints, tiempo de vuelta y mejor vuelta de esa carrera. Al terminar aparece su tiempo final; resultados y puntos incluyen a todos. Para tres personas, el cuadrante restante muestra posiciones. Las cámaras y el minimapa usan los mismos rectángulos de vista. En ventanas anchas el área local aprovecha el ancho disponible, sin estirar el coche ni cambiar su física.

El teclado tiene cuatro conjuntos distintos, pero muchos teclados no registran todas las combinaciones simultáneas. Se puede mezclar teclado y mandos; un mando no puede asignarse a dos pilotos. Se admiten mandos con mapeo estándar del navegador y P1 táctil desde 0.75; el remapeo libre sigue pendiente. En local el táctil complementa el teclado de P1; al asignarle un mando se oculta. Cuatro personas en un teléfono vertical tienen poca superficie por coche: las pruebas de distribución no sustituyen jugar en una pantalla compartida grande. La comodidad y los mandos físicos requieren comprobación humana.

## Motor compartido para avanzar al online — 0.71

`driving-core.js` contiene la misma conducción que usa el juego y puede ejecutarse directamente en Node sin navegador. Incluye modelos/materiales, aceleración, freno, reversa, agarre, dirección y movimiento. Cada motor tiene reglas inmutables y cada coche su propio estado; no se mantienen dos físicas distintas.

Esta extracción conserva conducción, CPU, pistas y récords. La geometría se comparte desde 0.72 y contactos/progreso/eventos desde 0.74; falta consolidar reloj/estado/resultados completos por carrera para crear salas. **No hay online disponible aún.** API, ejemplo Node y siguientes bloques en [SIMULATION_ARCHITECTURE.md](SIMULATION_ARCHITECTURE.md); evidencia en [SHARED_DRIVING_071.md](tests/experiments/SHARED_DRIVING_071.md).

La carga comprueba el nuevo archivo también ante un HTML anterior en caché y muestra una recarga necesaria si no puede obtenerlo. Se mantienen las rutas de Pages y el juego local sin backend.

## Móvil jugable — 0.75

**TÁCTIL** abre controles/configuración desde el paddock o durante la carrera. Activación automática con puntero principal táctil, manual o desactivada; tres tamaños y disposición normal/invertida, guardados con esquema `pixelGP.touch.v1`. El tamaño se ajusta al espacio disponible. No hay posiciones libres ni palanca virtual en esta primera entrega.

Botones independientes para izquierda/derecha, GAS, FRENO y MANO, con varios dedos, captura al arrastrar fuera del botón y liberación de cada dedo por separado. Gas+freno conserva la prioridad del freno; la reversa usa la misma espera de ~0,35 s; mano permite derrapar en movimiento y no da empuje desde parado. No se alteran las fuerzas ni los récords.

El panel controla P1 en individual o en local con P1 asignado a teclado; P2–P4 conservan teclado/mandos. Un mando asignado a P1 en local oculta el táctil. Los botones están fuera de lienzo y telemetría, con `touch-action` limitado a ellos; menú/HUD conservan sus gestos. Pausa, cancelación/pérdida de captura/foco, cambio de tamaño/fullscreen, preferencias, menú y reinicio limpian pulsaciones retenidas.

La cámara individual táctil llena el rectángulo disponible también en vertical, con escala legible y anticipación según velocidad; al retroceder mira hacia atrás. 2D cercana/panorámica siguen disponibles. Buffer limitado en ambos ejes a 2560, DPR ≤2 y perfiles gráficos conservados. La distribución de teclado/escritorio mantiene sus dimensiones anteriores.

Abrir ajustes durante carrera pausa y exige **SEGUIR** para reanudar. No se requiere teclado para cerrar ajustes/continuar. Configuración corrupta vuelve a valores conocidos; si el navegador bloquea almacenamiento, los controles funcionan durante la sesión sin garantizar persistencia.

Probado con Pointer Events generados por gestos CDP reales de Chromium: varios dedos, giro/maniobra, freno/reversa, captura/cancelación, cambios de pantalla, ajustes, local mixto y fuente de mando. **Teléfonos/mandos físicos, comodidad humana y FPS siguen pendientes.** Detalle en [TOUCH_075.md](tests/experiments/TOUCH_075.md). El núcleo online 30.4 y las mejoras de conducción/CPU/pistas/audio continúan abiertos.

## Contactos, vueltas y eventos compartidos — 0.74

El juego ya usa `race-rules.js` también disponible en Node para movimiento sobre terreno/recuperación, colisiones entre coches y con barreras, checkpoints/vueltas y plazo de cierre. Genera eventos numerados de checkpoint, vuelta e impacto. Audio y guardado local consumen esos eventos desde el adaptador, con la misma respuesta de la 0.73.

Se conservan manejo, CPU, 14 pistas, modos rápida/campeonato/local y récords p6/b1/s1. **Online aún no está disponible:** falta agrupar estado/reloj/resultados en una carrera independiente (30.4), y después salas/sincronización. API en [SIMULATION_ARCHITECTURE.md](SIMULATION_ARCHITECTURE.md); evidencia en [SHARED_RULES_074.md](tests/experiments/SHARED_RULES_074.md).

## Modos y comodidad — 0.73

El paddock separa **PARTIDA RÁPIDA**, **CAMPEONATO** y **MULTIJUGADOR LOCAL**. La rápida disputa tres vueltas en la pista elegida: resultados independientes, sin puntos de campeonato y botón **REVANCHA** sobre el mismo trazado. El campeonato conserva la secuencia existente desde la pista seleccionada hasta Industrial Mix, suma puntos y permite iniciar una nueva temporada. El local de 2–4 puede usar cualquiera de los dos formatos; conserva coches, controles y panel por piloto. La revancha/reinicio conserva el formato de la carrera activa.

**CONFIGURACIÓN DE CARRERA** es una sección plegable con pista, dificultad, cantidad de CPU, barreras y calidad gráfica. Cerrarla conserva las elecciones; **CAMBIAR PISTA Y COCHE** la abre y lleva el foco a la selección. El catálogo y la mezcla de sonido siguen disponibles.

La carrera individual aprovecha el ancho de las pantallas grandes, ampliando el campo visible con la misma escala de coches y sin estirar el lienzo. Se conserva el límite de resolución del buffer y el HUD exterior. Desde 0.75, el modo táctil individual llena también la altura en vertical y conserva el coche legible; la comodidad de cada teléfono requiere prueba humana.

Al iniciar desde el paddock o continuar/repetir desde resultados aparece **PREPARANDO LA PARRILLA** antes del trabajo de pista y gráficos. Sin porcentajes inventados ni demora mínima añadida; se bloquean inicios duplicados y se conserva el desbloqueo de audio dentro del gesto de usuario. Si falla la preparación, se muestra un error con regreso al paddock y posibilidad de reintentar. La generación todavía ocurre en el hilo principal; el aviso no equivale a una optimización ni a un worker. Los reinicios directos por R/botón conservan su comportamiento inmediato.

**Aún no disponibles:** online, 3D inclinada y más de tres CPU. Las fases 30/32/33 continúan online; 37, 39–41 organizan la vista opcional, parrillas más grandes/competitivas, variantes arcade y configuración/rendimiento. No se agregan opciones vacías al menú. Evidencia en [EVENT_HUB_073.md](tests/experiments/EVENT_HUB_073.md).

## Pistas compartidas para online — 0.72

El juego y Node ya usan `track-core.js` para las catorce pistas: recorrido, anchuras/pianos, curvas, materiales y escapatorias, checkpoints, vallas y neumáticos físicos. Registro inmutable y contexto separado para cada pista/perfil; no se mantienen dos geometrías distintas. La entrega conserva las pistas y la conducción anteriores.

Esto completa el bloque de geometría 30.2; **todavía no hay partidas online**. 0.74 comparte contactos y vueltas; sigue reloj/estado completo, aislamiento de carreras y después salas/sincronización. Documentación técnica en [SIMULATION_ARCHITECTURE.md](SIMULATION_ARCHITECTURE.md) y evidencia en [SHARED_TRACKS_072.md](tests/experiments/SHARED_TRACKS_072.md).

La futura vista **3D inclinada opcional** tendrá acceso en **Cámara y gráficos** del paddock y desde pausa, con elección 2D/3D y regreso rápido a 2D. Se mantendrá separada del encuadre cerca/panorámica (`C`). Es una ubicación planificada: el renderizador 3D y ese selector aún no están disponibles.

## Catálogo visual — 0.70

**EXPLORAR COCHES Y CIRCUITOS** abre un catálogo conectado al paddock. Cuatro siluetas, seis pinturas, velocidad real y comparación de giro/frenada/agarre respecto a Balanced; catorce pistas con trazado, superficies, recorrido corto/medio/largo, checkpoints y perfil predeterminado. La búsqueda admite nombre o superficie y no distingue tildes. La elección del coche corresponde a P1; los demás pilotos conservan su parrilla individual.

Las fichas modifican los selectores existentes y la siguiente carrera, sin alterar el estado de una carrera anterior. Diálogo con teclado, foco contenido, cierre visible y diseño adaptable. No añade coches, retoca la física ni cambia récords. Pruebas y límites en [CATALOGUE_070.md](tests/experiments/CATALOGUE_070.md).

**Online y vista 3D:** todavía no disponibles. [ONLINE_DESIGN.md](ONLINE_DESIGN.md) concreta salas autoritativas de 2–4, controles, sincronización, reconexión y criterios de despliegue. Conducción, geometría y reglas de contactos/vueltas ya se comparten sin DOM; el próximo hito es el reloj/estado/resultados completos independientes por carrera. La fase 37 reserva una vista 3D inclinada opcional para más adelante; la 38 continúa catálogo/presentación. Conducción, CPU, audio, cuatro pistas uniformes y gráficos siguen abiertos en [ROADMAP_EVOLUCION.md](ROADMAP_EVOLUCION.md).

## Recuperación y motor de movimiento — 0.69

Ahora podés retroceder para salir de una mala posición sin reiniciar la carrera. El motor longitudinal incorpora velocidad con signo, resistencia del terreno en ambos sentidos, contactos que respetan el movimiento real y retorno a marcha adelante. El HUD marca R, los coches encienden luces blancas de reversa y el audio recibe la velocidad/carga de marcha atrás.

Retroceder sobre la meta no suma vueltas ni coloca al coche falsamente al frente. El avance fijo se protege también internamente durante pausa/cuenta regresiva y fuera de carrera. Se conservan las prestaciones hacia adelante y los récords p6/b1/s1.

El ensayo de deriva lateral sigue fuera de la versión estable por regresiones de tráfico. Evidencia, archivo experimental y límites en [RECOVERY_069.md](tests/experiments/RECOVERY_069.md). No se presenta la recuperación como un derrape físico nuevo.

## Pedales más previsibles — 0.68

Frenar a fondo deja de luchar contra el acelerador mantenido. En mandos, levantar RT de forma gradual recupera retención de forma continua: rozar el gatillo ya no anula casi todo el freno motor. La presión parcial de freno reduce progresivamente el empuje. La prioridad se aplica a los cuatro jugadores y conserva el uso del freno de mano.

No aumenta la fuerza máxima de frenado: la frenada con acelerador soltado, el acelerador a fondo y la retención al soltarlo por completo mantienen su respuesta. Velocidades, agarre, dirección, pistas y récords p6/b1/s1 se conservan. No se incorpora todavía deriva física lateral; ver evidencia y límites en [PEDALS_068.md](tests/experiments/PEDALS_068.md).

## Coastline con recorrido propio — 0.67

Coastline Run pasa de 4.261 a 7.143 unidades (+67,6 %), con mundo 2000×1280, recta costera y regreso interior técnico. Ancho de 72–116, pianos por sector, tramo de tierra coherente con la física y diez checkpoints. Abierto por defecto; conserva las cinco opciones de barreras. La referencia automática Normal es 39,90/38,83 s: no es un tiempo humano garantizado.

Los récords de la ruta anterior quedan guardados y la nueva usa `COASTLINE RUN@3:p6:r1:s1:b1`. Las otras trece pistas y sus imágenes se conservan. Hay diez pistas con secciones variables y cuatro uniformes pendientes: Champion, Rally, Meadow e Industrial. Evidencia en [COAST_067.md](tests/experiments/COAST_067.md).

## Escenarios con más profundidad — 0.66

Tribunas con gradas/público, edificios urbanos con ventanas y azoteas, cabañas nevadas, depósitos, contenedores, tanques y carpas con volumen y sombras coherentes. Detallado añade pequeños elementos; Retro conserva las siluetas y Rendimiento mantiene sus dibujos anteriores. Se generan en el fondo estático existente, sin aumentar la cantidad de objetos ni ocupar las escapatorias. No cambian trazados, fuerzas, CPU, audio ni récords.

Evidencia, pruebas y límites en [ARCHITECTURE_066.md](tests/experiments/ARCHITECTURE_066.md). Es otro tramo de escenarios 36.3; iluminación ambiental, rocas y más variedad de edificios siguen abiertos.

## Motor y portada más cómodos — 0.65

El motor tiene una voz más grave, cuerpo una octava por debajo y una transición suave al sostener velocidad. Conserva cambios de marcha, aceleración, retención y controles de mezcla; no cambia la conducción. Se comprueban los cuatro modelos y hasta cuatro motores humanos. [Comparaciones y límites de escucha](tests/experiments/MOTOR_PADDOCK_065.md).

La portada muestra primero **la pista/coche elegidos y el inicio rápido**. **CAMBIAR PISTA Y COCHE** lleva a la configuración. **PREPARAR MULTIJUGADOR · 2–4** abre la parrilla; podés cerrarla con **VOLVER A UN JUGADOR** y reabrir sin perder tus elecciones. La bandera a cuadros y el diseño compacto mantienen la identidad retro. El motor nuevo sigue pendiente de tu evaluación al jugar.

## Thunder Valley más largo y variado — 0.64

**Elegí Thunder Valley, pista 9.** Nuevo recorrido de **7.082 unidades**, con recta larga, retorno interior y horquilla; ancho útil de **76–116**, sectores con/sin pianos y dos tramos de tierra de ancho real. Referencia automática Normal: **40,80/39,80 s** por vuelta; otros circuitos conservan sus duraciones. La vista cercana mantiene el tamaño del coche.

Tierra con grano propio y agarre diferente, sin pianos ni pintura vial de asfalto encima; preview y minimapa muestran las superficies. Barreras **abiertas en automático**, con los demás perfiles disponibles y colisiones alineadas. **Diez checkpoints** y récord nuevo por recorrido, guardando el anterior. Las otras trece pistas, conducción, CPU, Speed 260 y audio se mantienen.

Ya hay **nueve pistas con secciones variables y cinco uniformes**. [Geometría, capturas comprobadas y pruebas](tests/experiments/THUNDER_064.md). Jugabilidad humana pendiente; próximo foco: audio y feedback del motor.

## Cierre lateral de rivales — 0.63

La CPU ahora detecta un cruce lateral peligroso aunque el otro coche sea más rápido hacia delante. Antes podía predecir el contacto y aun así seguir acelerando. La corrección solicita el freno normal; no cambia fuerzas, velocidad máxima, colisiones ni la libertad de correr en paralelo.

Se comparó también un derrape lateral nuevo. **No se activa en esta versión**: las pruebas amplias mostraron más contactos y pérdida de ritmo en algunos circuitos. Se conserva la conducción actual y Speed Demon a 260 mientras se replantea ese modelo. Física p6, reloj s1, balance b1 y récords continúan. [Experimento, corrección y pruebas](tests/experiments/HANDBRAKE_SLIP_063.md).

## Speed Demon a 260, con aceleración progresiva — 0.62

**Elegí SPEED DEMON en el garaje** para llegar a **260 km/h**. Mantiene la salida ágil, pero entrega los últimos kilómetros por hora de forma más gradual: en la recta real de Champion la prueba de teclado mide 0–100 en **1,17 s**, 0–200 en **2,73 s** y 0–260 en **4,02 s**. Requiere espacio y una buena salida de curva; no es un aumento solo del velocímetro.

La frenada normal desde 260 necesita **114 unidades de pista**, frente a **105 desde 250** en esa misma referencia. El radio de giro a máxima también crece. Conservar velocidad exige elegir frenadas y trazada. Balanced/Corner/Rally conservan especificaciones y aceleración; las CPU de producción continúan con Balanced y sus reglas físicas compartidas. El freno de mano sigue pagando velocidad y recupera agarre al soltarlo; la sensación humana de conducción/derrape continúa abierta.

Los récords nuevos añaden **`:b1`** por la revisión de balance; los anteriores quedan guardados aparte. Física p6 y reloj s1 se mantienen. Carreteras, gráficos, audio y local 2–4 permanecen. [Mediciones, variantes y pruebas](tests/experiments/SPEED_BALANCE_062.md).

## Vegetación con profundidad retro — 0.61

Árboles y copas tienen capas de follaje y troncos/raíces más definidos; palmeras con hojas perfiladas, pinos por niveles/nieve y cactus con detalles propios. Las sombras siguen la luz fija del mundo en **DETALLADOS** y **RETRO**. Todo se dibuja en el fondo en caché, sin animación ni partículas nuevas.

Se conservan posiciones, cantidades y espacios reservados: la vegetación no invade pista/escapatorias ni añade colisiones. **RENDIMIENTO** mantiene el dibujo anterior. No cambia fuerza, velocidad, rutas, CPU, audio ni controles. Es el primer tramo de escenarios 36.3; edificios, ambiente y medición completa siguen abiertos. [Pruebas y límites](tests/experiments/VEGETATION_061.md).

El plan activo tiene **12 frentes abiertos**, varios avanzados, no doce actualizaciones para terminar todo. Online requiere salas con autoridad de servidor, sincronización/reconexión y despliegue/resultados validados; todavía no existe servidor ni opción online funcional. Estado y dependencias en [hoja de evolución](ROADMAP_EVOLUCION.md). Próxima revisión de manejo: objetivo del coche rápido alrededor de **260 km/h**, junto con frenado/curva/derrape; esa velocidad aún no está implementada en esta entrega gráfica.

## Jungle Sprint: enlace en S y regreso rápido — 0.60

Jungle tiene ahora un trazado propio de **6.178 unidades** (+77,2 %), mundo **2000×1280**, un enlace en S, horquilla interior y regreso rápido. El ancho cambia suavemente entre **72 y 116**, con recta amplia y sectores más estrechos; nueve checkpoints ordenados controlan el recorrido. Mantiene pasto nativo y **sin barreras** como opción automática, con los otros cuatro perfiles disponibles.

La carretera usa tonos de vegetación pisada, borde claro y grano propio en caché, con menos detalle en rendimiento. No dibuja asfalto ni pianos rojos sobre el pasto. Apariencia y agarre siguen el material común; no se modifica su física. Los otros trece trazados se conservan y sus imágenes de carretera se comparan byte a byte en tres calidades.

Referencia CPU Normal libre: **36,12 / 35,03 s** en las dos primeras vueltas, frente a **25,50 / 24,53 s** anteriores. Son tiempos de prueba, no una duración garantizada para cualquier jugador. Continúan física 6/contravolante y reloj s1; los récords nuevos son `JUNGLE SPRINT@3:p6:r1:s1`, manteniendo los de @2. **Ocho pistas con secciones variables y seis uniformes pendientes.** Geometría, iteraciones y pruebas en [Jungle 0.60](tests/experiments/JUNGLE_060.md).

## Contravolante más recuperable — 0.59

Cuando pedís el giro contrario, el volante descarga antes la dirección que llevaba; al cruzar el centro vuelve al peso normal. No acelera la entrada inicial de curva ni elimina la inercia del chasis. Teclados de los cuatro pilotos y mandos comparten el ajuste; las correcciones pequeñas de stick mantienen su respuesta fina.

Comparación con la misma maniobra a 150 km/h en cuatro modelos y asfalto/tierra/hielo: la inversión del giro pasa de **117 a 100 ms** y el giro residual hacia el lado anterior baja aproximadamente **17 %**, con la misma velocidad. Es una maniobra reproducible, no una medida universal de tiempo de reacción ni una aprobación humana del manejo.

Agarre máximo, necesidad de frenar, aceleración, giro sostenido, CPU, rutas, gráficos y audio se mantienen. El controlador cambia la conducción humana: los nuevos récords usan **física 6** (`:p6:…:s1`) y se conservan los de física 5. El reloj fijo/interpolación de 0.58 continúa. Detalle en [comparación 0.59](tests/experiments/COUNTERSTEER_059.md).

## Conducción consistente entre pantallas — 0.58

La simulación avanza ahora a **60 pasos por segundo**, separada del dibujo. Antes cada fotograma admitía como máximo 30 ms: a 20 FPS, tres segundos reales solo avanzaban 1,8 s de carrera; a 30 FPS, 2,7 s. Esto cambiaba aceleración, dirección, contactos y tiempos según el equipo. Con el nuevo bucle, las referencias de 20/30/60/120/144 FPS producen tres segundos y el mismo estado físico con la misma secuencia de controles.

La posición y el rumbo de coches/cámaras se interpolan al dibujar, sin modificar la simulación. La presentación queda hasta un paso (16,7 ms) detrás; pausa, reinicio, cambio de pista y recolocación limpian poses anteriores. El arranque sigue usando tres segundos de tiempo real. Ante un bloqueo largo se recuperan como máximo **100 ms/seis pasos** por fotograma para evitar una cadena de saltos; equipos sostenidamente por debajo de 10 FPS aún pueden perder tiempo de juego. No es una promesa de FPS.

Los récords nuevos agregan **`:s1`** a su clave. Los anteriores permanecen guardados y no se usan como referencia del nuevo reloj. Se mantienen física 5, potencia, agarre, frenado, modelos, pistas, gráficos 0.57, audio y controles locales. **No se declara aceptado el tacto de curvas**: se corrige primero una base que impedía compararlo de manera consistente. Ver [pruebas y límites 0.58](tests/experiments/FIXED_STEP_058.md).

## Coches, sombras y luz — 0.57

Continúa el tramo **36.2**, con profundidad de carrocería y lectura retro. La sombra proyectada utiliza la silueta y las ruedas del modelo, con desplazamiento fijo hacia abajo/derecha del mundo; ya no gira su dirección al girar el coche. En detallado se añade una sombra de contacto de borde corto. Los bordes de carrocería reciben luz desde arriba/izquierda según su orientación real. Las vistas de garaje y parrilla utilizan también esa orientación.

Las cuatro siluetas, seis pinturas, ruedas dirigibles, luces de freno y destello de impacto siguen legibles. Retro usa una sola capa de sombra; rendimiento conserva sus píxeles anteriores. No se agregan filtros borrosos, recursos externos ni colisiones. Física, trazados, récords, audio y controles permanecen. Es una entrega de coches/luz, no el cierre de toda la fase gráfica ni la aceptación humana del manejo. Ver [evidencia 0.57](tests/experiments/CAR_LIGHT_057.md).

## Conducción y primer detalle gráfico — 0.56

El coche ya no gira sobre su eje estando totalmente detenido: podés orientar las ruedas y el chasis gira al avanzar. La CPU puede rodear un obstáculo cercano desde parado mediante avance lento y dirección normal, en lugar de depender de ese pivote. Un caso a 25 unidades que antes no salía en 20 s se recupera en ~11,9 s sin contacto en la referencia automatizada; otros a 30/40 lo hacen en ~4,6/4,3 s. No es recuperación universal ni una ayuda de posición/agarre.

Las marcas y el humo de derrape usan la misma señal que el sonido: circular recto con un indicador interno de exceso de velocidad ya no dibuja neumáticos derrapando. Derrapes con giro, rotación residual y freno de mano conservan su respuesta. Aceleración, fuerza lateral, frenado y modelos en movimiento permanecen; la sensación humana de curvas sigue abierta.

Primer paso de la nueva **fase 36: realismo estilizado con identidad retro**. El asfalto incorpora agregado fino de bajo contraste en **DETALLADOS** y **RETRO**, generado una vez y guardado con la carretera. **RENDIMIENTO** conserva su superficie anterior. Pianos, bordes, tierra, hielo, pasto y volcánico se mantienen; no se agregan colisiones ni recursos externos. La fase incluye posteriores mejoras de coches, luces/sombras, escala y detalle de escenarios, con presupuestos por calidad. Detalle en [experimento 0.56](tests/experiments/ROAD_FEEL_056.md).

## Mezcla de sonido — 0.55

El botón **MEZCLA** de la cabecera (engranaje en pantallas pequeñas) abre tres controles: **general, motores y efectos/avisos**. Podés bajar o silenciar los motores y conservar checkpoints, salida y llegada; también podés silenciar efectos sin apagar el motor. Sus valores se guardan localmente, con botón para restablecerlos.

Valores iniciales: general **80 %**, motores **70 %**, efectos **85 %**. El botón SONIDO ON/OFF sigue siendo independiente. Ajustar volumen no lo reactiva. Abrir el panel durante una carrera la pausa, limpia las teclas mantenidas y deja reanudación manual con **SEGUIR**; Escape cierra el panel. Se mantiene el teclado nativo de los deslizadores y el foco vuelve al botón de apertura.

La mezcla se aplica a los 1–4 humanos con un contexto reutilizado. Motor/cuerpo van por una salida; derrape, terreno y señales van por otra, ambas bajo volumen general/compresor. No se crean grafos nuevos al mover deslizadores ni se reproducen motores CPU. **El timbre de `engine-audio.js` permanece y sigue pendiente de escucha/revisión humana**; bajar su nivel no lo convierte en un motor nuevo. Detalle en [pruebas de mezcla](tests/experiments/MIX_055.md).

## CPU en grupos — 0.54

Al disputar posiciones, la CPU da prioridad de trazada al rival que circula a su lado. Un coche algo más cercano por delante ya no borra esa reserva. Sigue calculando el frenado frente a **todos** los rivales, aunque haya elegido otro como referencia lateral.

Con rivales en ambos flancos, busca una franja común que respete a los dos y el ancho de carretera. Si no cabe, conserva la línea ocupada y deja espacio longitudinal mediante acelerador/freno normales. No desplaza coches, aumenta adherencia ni desactiva roces. Los trenes de coches por un solo lado conservan la reserva del más próximo; todavía no es un planificador conjunto de trayectorias.

Referencia Sunset Normal, cuatro coches/tres vueltas a 30 Hz: **13 → 1 pasos con contacto**, sin pasos de centro fuera de pista. No son trece choques distintos ni una promesa de cero contactos. La referencia a 60 Hz conserva seis pasos con contacto y los mismos tiempos; no se extrapola la reducción a todas las frecuencias. La media de parrilla mejora ligeramente; las otras referencias de seguridad y el ritmo libre se comprueban por separado. Se conservan física 5, modelos, los catorce trazados, récords, audio y local 2–4. Detalle y límites en [experimento de grupos](tests/experiments/GROUPS_054.md).

## Pixel City — 0.53

Pixel City deja el trazado parecido a Thunder y estrena un recorrido de **4.368 unidades** (+28,7 %): avenidas rápidas, desvío interior y retorno con curvas enlazadas. Su anchura útil varía entre **76 y 112**, con sectores con/sin pianos y **seis checkpoints**. Mundo 1600×1024, sin reducir el coche. Referencia CPU Normal libre **25,47/24,42 s**: una pista corta distinta de Frostbite (~36 s) y Night (~58 s), no un tiempo obligatorio para el jugador.

Conserva asfalto y barreras parciales automáticas; los otros cuatro perfiles siguen disponibles. Dibujo, colisiones, grava, gates, minimapa, vista previa y CPU consultan la misma sección. Récords nuevos `PIXEL CITY@3:p5:r1`, anteriores @2 preservados. Los otros trece trazados, física 5, CPU 0.51, audio y local 2–4 se mantienen. **Siete pistas tienen sección variable y siete conservan sección uniforme.**

La comparación de tamaños favorece esta versión compacta frente a una ampliación de 4.913 unidades (~27–28 s). Geometría y carreras automatizadas no aprueban diversión ni equilibrio humano. Evidencia y límites en [experimento Pixel](tests/experiments/PIXEL_053.md).

## Frostbite GP — 0.52

Frostbite estrena un recorrido asimétrico: arco rápido amplio y regreso técnico, con secciones de **68–112** unidades de ancho útil. Mide **6.369** unidades (+86 %), mundo 2200×1408 y **nueve checkpoints**. La referencia CPU Normal libre queda alrededor de **36–37 s** por vuelta frente a unos 27 del recorrido anterior; no cambia la potencia ni la física para alargarlo.

Hielo con paleta, rasguños y marcas azuladas propios, sin pianos de asfalto. Conserva el agarre y respuesta físicos del hielo, protección automática en curvas y los cinco perfiles seleccionables. Minimapa, cámara, vista previa, límites y checkpoints usan el mismo recorrido. Los récords nuevos usan `FROSTBITE GP@3:p5:r1`; los anteriores se conservan.

Las otras trece pistas, física 5, CPU 0.51, audio y local 2–4 permanecen. Ya hay **seis pistas con anchura por sectores; ocho siguen con sección uniforme**. Se comprobaron carreras de los cuatro modelos y parrillas en tres dificultades, además de píxeles/carreras en Chromium; falta conducirlo humanamente para aprobar la sensación de hielo y el equilibrio.

## Circuitos y superficies

El registro conserva los 14 circuitos y los diez nombres originales. La ampliación de 0.22 se conserva: Champion Road tiene una nueva recta larga y un sector técnico, y Coastline Run, Rally Canyon, Meadow Run e Industrial Mix tienen ramales separados para que sus caminos no se superpongan. El coche conserva su tamaño; el ancho uniforme histórico empieza a reemplazarse por sectores en 0.44. En 0.23, Dusty Mesa estrena un trazado triangular de tierra: recta rápida superior, “S” técnica al este y regreso diagonal. Sigue abierto y conserva su nombre y lugar en el campeonato.

En **0.39 Sunset Circuit** gana un recorrido propio: recta principal larga, curva exterior amplia, sector interior enlazado y regreso técnico. Pasa de 3572 a 6304 unidades de recorrido (**+76,5 %**) y su mundo de 1400×896 a 1800×1152. En esa ampliación se mantuvieron coche, ancho de pista (84), velocidad y perfil abierto; el ancho se revisa por sectores en 0.44. El minimapa/vista previa y nueve checkpoints utilizan la geometría nueva.

La dirección actual busca **duraciones variadas**: pistas cortas de unos 20 s, medias de unos 40 s y largas de unos 60 s, sin una ventana obligatoria para todas. En 0.39 Sunset midió **34,86 s** por vuelta de CPU Normal libre, frente a 22,39 s anteriores; con la física de 0.40 la referencia Normal pasa a **39,78 s**. No se ralentizó la CPU ni el coche para lograrlo. Los otros 13 trazados no cambian; no se promete que todos ya cumplan el objetivo humano. Los récords de Sunset se separan como versión 3 y se conservan los de la versión 2.

En **0.44**, Sunset, Neon y Dusty tienen anchos graduales por sector: Sunset **72–124**, Neon **72–112** y Dusty **72–108** unidades de ancho útil total. Son unidades del mundo, no píxeles de pantalla. Sunset/Neon combinan sectores con y sin pianos; los pianos cuentan como franja transitable. Dusty mantiene tierra sin pianos de asfalto. Rectas amplias permiten buscar otra línea y sectores estrechos requieren más precisión.

Una misma sección alimenta dibujo, material del suelo, vallas/neumáticos, gates/meta, carteles, espacio de CPU, recuperación, vista previa y minimapa. La superficie se guarda en caché y el minimapa la reutiliza. Los récords de esas tres pistas suman `:r1` a la clave `:p4`; los registros anteriores se conservan. Los otros once perfiles de ancho siguen como antes. No se cambiaron longitudes, potencia ni controles en esta entrega: todavía falta desarrollar recorridos largos de unos 60 s y extender las variantes a más pistas.

En **0.46 Night Run** estrena un trazado largo propio, con recta de salida, chicana, gancho hacia el puerto y regreso técnico. Longitud **10.681** unidades frente a 3.813 anteriores; mundo **2650×1696**, sin reducir el coche ni modificar potencia/física. Anchura útil variable **68–108**, pianos por sector y protección automática en curvas, con el resto de perfiles seleccionables. La referencia Normal libre queda cerca del minuto (primeras vueltas medidas a 60 Hz: 59,80 y 58,67 s); no es una promesa de tiempo humano ni una velocidad impuesta.

Los checkpoints dejan de limitarse a nueve: Night tiene **16** en orden, con unos **628** de recorrido entre marcas. Los otros trece circuitos conservan sus puntos, ancho y longitudes; mantienen sus referencias cortas/medias. Night usa `NIGHT RUN@3:p5:r1`, conservando los récords de la versión 2. Ya hay cuatro pistas de ancho variable; diez mantienen ancho histórico.

En **0.47 Volcano Ring** deja de compartir casi la misma silueta que Thunder Valley. Nuevo recorrido de **4.961** unidades, recta diagonal para adelantar, horquilla interior y regreso enlazado; ancho útil **68–112** y siete checkpoints. Las primeras vueltas Normal libres a 60 Hz marcan **29,45/28,37 s**. Mantiene terreno volcánico con agarre propio, gránulos y ceniza, partículas y límites físicos según sección, sin pianos de asfalto sobre ese material. No se añaden trampas de lava invisibles. Barreras automáticas en curvas y todos los perfiles seleccionables.

La paleta del corredor se toma del mismo material que su física. La extracción conserva exactamente los píxeles de los cuatro corredores variables anteriores (comparación en Chromium de tres calidades). Volcano usa `VOLCANO RING@3:p5:r1`, preservando los tiempos @2; los otros trece recorridos permanecen iguales. Ya hay **cinco** pistas de ancho variable; quedan nueve con sección histórica.

El perfil automático deja **siete pistas abiertas, cuatro con protección en curvas cerradas y tres con vallas parciales**. Sunset Circuit arranca sin muros. Podés seguir eligiendo vallas completas o cualquier otro perfil en el menú.

Las superficies incluyen asfalto, tierra, pasto, hielo, volcánico y secciones mixtas. En las pistas mixtas, el agarre, las partículas y el minimapa cambian según el sector. Cada pista tiene entre cinco y dieciséis checkpoints secuenciales según su longitud, para evitar recortes grandes entre sectores. Los récords se separan por versión del recorrido: se conservan los anteriores, pero no compiten con los tiempos de los trazados nuevos.

## Funcionalidades actuales

- Carrera para un jugador contra **1, 2 o 3 CPU** (tres por defecto) y modo local de **2, 3 o 4 jugadores** sin CPU, con coche, pintura y control por persona.
- Campeonato por carreras.
- Cuenta regresiva, cronómetro, vueltas, checkpoints y resultados.
- Récords de mejor vuelta guardados en `localStorage`.
- Barreras, neumáticos, señales de frenado y sectores de adelantamiento.
- CPU con frenado anticipado por curvatura y terreno, tres dificultades y física principal compartida con el Balanced del jugador.
- Adelantamientos persistentes, una línea defensiva por aproximación, espacio durante el solapamiento y reconocimiento físico de doblados.
- Derrapes, marcas de neumáticos, partículas de terreno y efectos básicos de sonido.
- HUD compacto fuera del lienzo: velocidad actual, checkpoints, tiempo de la vuelta en curso, mejor vuelta y minimapa. Sin velocidad recomendada, próxima curva ni etiqueta de terreno.
- Opciones de gráficos detallados, retro y rendimiento.
- Vista cercana por defecto, minimapa visible en pantallas pequeñas y área de carrera ajustada a la ventana y a pantalla completa, sin desplazamiento de página durante la carrera.

## Comprobaciones

Con Node.js, desde la raíz y sin dependencias adicionales:

```sh
node --check script.js
node tests/validate-tracks.mjs
node tests/validate-road-feedback.mjs
node tests/validate-pixel.mjs
node tests/validate-sunset.mjs
node tests/validate-track-identity.mjs
node tests/validate-integration.mjs
node tests/validate-cpu.mjs
node tests/validate-ai-pace.mjs
node tests/validate-ai-plan-query.mjs
node tests/validate-traffic.mjs
node tests/validate-grid.mjs
node tests/validate-group-traffic.mjs
node tests/validate-collisions.mjs
node tests/validate-scenery.mjs
node tests/validate-finish.mjs
node tests/validate-car-visuals.mjs
node tests/validate-audio.mjs
node tests/validate-audio-mix.mjs
node tests/validate-menu.mjs
node tests/validate-results.mjs
node tests/validate-rival-awareness.mjs
node tests/validate-race-lifecycle.mjs
node tests/validate-driving.mjs
node tests/validate-driving-demand.mjs
node tests/validate-lift-demand.mjs
node tests/validate-arcade-flow.mjs
node tests/validate-gate-contact.mjs
node tests/validate-runoff.mjs
node tests/validate-steering-inertia.mjs
node tests/validate-barriers.mjs
node tests/validate-road-sectors.mjs
node tests/validate-night-long.mjs
node tests/validate-volcano.mjs
node tests/validate-sector-races.mjs
```

La prueba de identidad detecta copias de un trazado aunque se escalen, giren o reflejen, y comprueba que Dusty Mesa se diferencia de las otras 13 pistas. Esto no evalúa la diversión ni sustituye jugar.

La prueba de CPU comprueba límites físicos, desplazamiento y coste del freno de mano. La comparación de mejora de ritmo frente a 0.24 corresponde a la física anterior; con la versión 2 se mide una referencia nueva porque cambiaron las reglas para humanos y rivales. Usa el código real en un entorno DOM simulado: completa tres vueltas con checkpoints en las 14 pistas y las tres dificultades, verifica prestaciones compartidas y prueba frenado ante tráfico y recuperación. No sustituye una carrera humana.

Pruebas opcionales de navegador: `node tests/browser-smoke.cjs`, `node tests/browser-audio.cjs`, `node tests/browser-audio-mix.cjs` y `node tests/browser-release.cjs`. Para crucero sostenido del motor: `node tests/browser-engine-cruise.cjs`. Para bordes/pianos: `node tests/browser-road-sectors.cjs`; `ROAD_SCREENSHOTS` guarda capturas opcionales. Requiere Playwright y Chromium instalados en el entorno de desarrollo; `CHROMIUM_PATH` permite indicar el ejecutable. Inicia un servidor temporal en localhost y bloquea Google Fonts. No agrega dependencias al juego.

Para reproducir la comparación gráfica 0.56 contra el código anterior:

```sh
git show b34df3a:script.js > /tmp/pixelgp-before-056.js
ROAD_SOURCE_BASELINE=/tmp/pixelgp-before-056.js node tests/browser-road-detail.cjs
```

Esta prueba compara las superficies de las catorce pistas en tres calidades, sus bordes y la corrección del reposo. Las capturas opcionales se guardan indicando `DETAIL_SCREENSHOTS`.

## Conducción — build 0.42

La primera revisión 0.40 quedó demasiado pesada según la prueba humana. En 0.42 se comparan dos variantes y se conserva una respuesta más fluida: Balanced alcanza 100 en unos 1,28 s y el 95 % de su máxima en 3,32 s, frente a 1,59/4,40 anteriores. Los otros modelos conservan su identidad y velocidad máxima. La escala de movimiento sigue en 0,84.

El giro está limitado por una fuerza lateral finita compartida: a alta velocidad crece el radio mínimo y una curva cerrada exige bajar la velocidad. Frenar devuelve una trayectoria más cerrada. Se conserva dirección recuperable, inercia de giro y freno de mano con coste de velocidad; la sensación final del derrape sigue pendiente de validación humana. La CPU construye su plan de frenado usando el mismo modelo; no recibe potencia, agarre ni dirección extra.

La física de 0.40 usa sufijo `:p2`; 0.41 usa `:p3` por el nuevo agarre/resistencia de las escapatorias. La revisión 0.42 usa `:p4`, conservando las tres referencias anteriores. No se comparan como récord vigente tiempos logrados con la física que permitía pasar curvas mucho más rápido.

### Trabajo pendiente para la base

El plan vigente es abierto: [ROADMAP_EVOLUCION.md](ROADMAP_EVOLUCION.md) recoge auditoría, conducción/contactos, motor, anchuras/duraciones variadas, CPU, local 2–4, arquitectura, fantasmas/progresión y online. Las 24 fases anteriores se conservan como historial. Las estimaciones anteriores de una entrega o cinco bloques no limitan esta evolución.

Las escapatorias de grava se implementan en 0.41, con validación humana pendiente. **Lo próximo es rehacer el motor**, después ampliar el modo local y cerrar la revisión final. Hoy siguen funcionando **dos humanos**, y **tres/cuatro todavía no están implementados**. El editor y desbloqueos quedan fuera de este hito.

## Grava, pasto y barreras — build 0.41

Ocho circuitos con sectores pavimentados incorporan escapatorias en el exterior de hasta seis curvas seleccionadas. La secuencia es asfalto/piano → grava frenante → terreno nativo (normalmente pasto). La grava tiene menos agarre, mayor resistencia, textura propia, polvo beige y huellas marrones; salir acelerando sigue siendo posible. Los caminos de tierra, hielo, volcánicos y pasto conservan su terreno nativo.

Una misma consulta del material en coordenadas del mundo decide el dibujo de grava, la adherencia, la resistencia, las partículas y la capa sonora del terreno. Las ruedas generan huellas según su contacto; el polvo toma el material del eje trasero. La salida de pista ya no conserva el agarre del asfalto por consultar solo el progreso del circuito.

**Según circuito** respeta el perfil predeterminado; **Sin barreras** expone todas las zonas, **Vallas completas** las desactiva y los perfiles parciales conservan únicamente partes abiertas. La geometría física de vallas/neumáticos no se desplaza. El borde dibujado del pavimento se ajusta al piano/transición física, y los otros ramales quedan protegidos por la consulta de pista más cercana. El raster de grava usa celdas de dos unidades, caché por trazado/perfil e índice espacial; el fondo se reutiliza durante la carrera.

En una prueba de 0,25 s desde 160, el coche terminó a 154,1 en asfalto, 110,0 en grava y 136,6 en pasto a la misma distancia de salida. La recuperación lejana conserva su frenado adicional y no se confunde con esta comparación de materiales. Son medidas de simulación, pendientes de conducción humana.

## Interfaz — build 0.26

La carrera aprovecha el alto de la ventana y un contenedor de hasta 1600 px de ancho. El lienzo conserva su proporción y se ajusta al espacio restante después de los controles y datos esenciales. El menú recupera su distribución al salir o terminar; redimensionar también funciona con la carrera pausada. Los fondos del circuito no se regeneran por cambiar el tamaño de ventana y el búfer de imagen se limita a 2560 px de ancho.

TIEMPO DE VUELTA muestra la vuelta actual, vuelve a cero al pasar la meta con los checkpoints completos y conserva la última vuelta al terminar el jugador. Los resultados mantienen el tiempo total de carrera. Este cambio amplía la presentación en la web; la geometría y las escapatorias de los circuitos se conservan.

## CPU

El rival usa acelerador y freno con las mismas prestaciones del modelo Balanced, incluida la escala de desplazamiento. No recibe aumentos ocultos de agarre, velocidad ni aceleración. La dificultad cambia ritmo, margen de frenado, respuesta y cambio de línea. La velocidad de curva se calcula con el agarre real del sector, incluido hielo y tierra en circuitos mixtos.

La CPU de 0.25 calcula velocidades de curva con el agarre y el derrape reales, mira más adelante a velocidad alta y convierte el giro necesario en una entrada de volante proporcional a su capacidad física. Normal y Difícil pueden usar freno de mano en curvas exigentes y con espacio; Fácil conserva una conducción más conservadora. El freno de mano paga la misma pérdida de velocidad que en el coche humano.

Frente a 0.24, Normal mejora entre 26,5 % y 40,4 % por pista. En Dusty Mesa mide 19,40 s (Difícil 18,82); en Sunset 22,39 s (Difícil 21,58). Todavía queda calibrar su competitividad humana, sobre todo en Sunset. En 0.28 ya se puede elegir hasta tres CPU; el modo clásico de un rival conserva su controlador y sigue disponible.

En 0.27, el tráfico anticipa acercamientos hasta 0,75 s usando velocidad, dirección e inercia de giro actuales. Antes de adelantar elige un lado con espacio; durante el solapamiento reserva más separación. Si el borde deja al perseguidor sin una línea segura, cede espacio longitudinal. El frenado considera la componente de velocidad del rival en su dirección y las entradas laterales a su carril. No cambian la velocidad máxima, la potencia ni la física humana.

La CPU mantiene el lado elegido durante el ataque, limita el tiempo de un intento y no copia cada cambio lateral del rival al defender. Al quedar a la par, la separación física tiene prioridad sobre la defensa. Un doblado sigue siendo un obstáculo; ante un coche más rápido con una vuelta de ventaja, la CPU cede espacio. En tráfico bloqueado usa su frenado normal y puede rodear un coche detenido a baja velocidad si la trayectoria deja margen de contacto.

## Parrilla — build 0.28

El menú permite elegir uno, dos o tres rivales. **CPU 1** conserva el estilo clásico. **Furia** inicia ataques con menor diferencia de velocidad, más anticipación y cambios de línea más rápidos. **Ápice** exige más diferencia para atacar y destaca por respuesta de dirección y margen de frenado más preciso. Las tres dificultades se aplican a cada estilo; todos usan el Balanced sin potencia, agarre ni velocidad máxima adicionales. El límite de ritmo nunca supera el calculado por la física compartida.

El tráfico evalúa todos los coches cercanos y conserva una maniobra por rival; un coche seguro en otro carril no oculta un obstáculo más adelante. Los contactos se resuelven entre todos los pares, sin acelerar artificialmente coches detenidos. Nombres y colores propios permiten reconocer rivales en pista y minimapa.

POS muestra el puesto actual. Los resultados ordenan a todos los participantes: primero quienes terminan por tiempo, después los demás por progreso. El campeonato puntúa **25/18/15/12**, con cero para quien no termina. El cierre de carrera conserva la espera máxima de 18 s después del primer finalista. Dos jugadores mantiene sus dos coches y cámaras divididas. La geometría y las escapatorias no cambian.

## Contactos y recuperación — build 0.29

La separación entre coches se resuelve hasta 16 veces por paso, comprobando de nuevo las mismas vallas y neumáticos visibles después de cada empujón. Así una pareja no queda encajada de nuevo al separar otra. La pérdida de velocidad depende del acercamiento real en el contacto y se aplica una sola vez por pareja en ese paso: un roce paralelo sin acercamiento no recibe un frenazo fijo y un choque frontal disipa más velocidad, sin generar aceleración ni rebote artificial.

Los desplazamientos por contacto actualizan la posición en pista y los cruces válidos de checkpoints/meta. El mínimo de velocidad de las escapatorias ya no pone en marcha un coche detenido sin acelerar; se conserva el avance lento para recuperar con acelerador y dirección normales. No se añaden teletransportes de CPU ni se elimina terreno de recuperación.

## Escenarios — build 0.30

Los 14 circuitos tienen perfiles de ambientación propios: parque de Sunset, puerto, noche urbana, desierto, nieve, selva, volcán, ciudad, valle, estadio, costa, cañón, pradera e industria. Se combinan árboles, palmeras, pinos, cactus, mesetas, basalto, flores, carpas, tribunas con público, depósitos, contenedores, grúas y tanques, con paletas y detalles originales dibujados en Canvas.

La colocación usa variación determinista y distancia exacta a todos los segmentos del circuito. Cada objeto reserva su huella completa, incluida sombra, y deja **124 unidades libres desde el centro de pista**; también respeta el borde del mundo y los otros objetos. La decoración queda fuera de las escapatorias habituales. La señalización de carrera y barreras conservan su función junto al trazado.

Detallados añade sombras, relieve, ventanas, público y detalles pequeños; Retro simplifica, y Rendimiento reduce densidad y detalles. La decoración se genera una vez por circuito/calidad y se dibuja en el fondo cacheado. No cambia geometría, superficies, coches, física, CPU ni puntos.

## Bandera a cuadros — build 0.31

Cuando termina el primer coche, aparece un aviso con bandera en la franja de estado, fuera del lienzo. Si todavía estás corriendo, podés continuar hasta que todos terminen o se cumplan **18 segundos desde el primer finalista**. El reloj de cierre se detiene con la pausa y el aviso se recupera al reanudar. Al terminar vos, se informa tu puesto y se conserva el tiempo de tu última vuelta.

Los resultados muestran una bandera con una animación breve de tres ciclos, el nombre del ganador y un resumen de tu puesto/tiempo o «sin terminar». En dos jugadores se muestran los tiempos de ambos. La preferencia del sistema **reducir movimiento** desactiva la animación. El foco pasa al título de resultados y el lector de pantalla recibe avisos por llegada, sin anunciar cada segundo del reloj. Cerrar dos veces no duplica los puntos.

## Coches y animación — build 0.32

Los cuatro modelos tienen carrocerías propias: Balanced compacto, Corner King de ruedas expuestas, Speed Demon afilado y Rally Fox ancho con protecciones y barras de techo. Conservan las seis pinturas. El contorno, los cristales y las luces distinguen frente y parte trasera; un contacto ilumina el contorno sin blanquear toda la pintura.

Las ruedas delanteras muestran la dirección suavizada del coche. La rodadura sigue el avance y se detiene en reposo; las luces traseras se encienden con freno o freno de mano, tanto en humanos como en CPU. Las marcas de derrape salen del eje trasero dibujado en cada modelo. Detallados añade capas, sombra y detalles; Retro simplifica y Rendimiento usa menos operaciones y ruedas sin bandas animadas. Reducir movimiento desactiva la rodadura decorativa y conserva dirección y frenado visibles.

No se cambian prestaciones, tamaños físicos, superficies, dificultad ni controles. Las geometrías de carrocería y los estados de dibujo están separados del modelo de conducción; el render no modifica el estado del coche.

## Audio — motor nuevo en 0.43

El motor anterior se reemplazó por síntesis propia de pulsos de combustión con armónicos limitados, cuerpo grave y filtro según carga. `engine-audio.js` concentra el régimen, seis marchas con histéresis y una caída breve al cambiar; las marchas son sonoras y no modifican las prestaciones. Cada modelo tiene régimen, cilindros y cuerpo distintos. El acelerador abre el timbre y soltarlo reduce la carga. No se usan muestras externas.

**Escucha pendiente:** se comprobó salida y ciclo de vida en Chromium, pero el nuevo timbre necesita evaluación humana en auriculares/parlantes y móvil. No se declara solucionada la calidad percibida por medir una señal.

El motor sintetizado cambia de timbre según el coche y de régimen según velocidad, acelerador y frenado. El derrape y el terreno tienen capas propias. En modo local se mezclan los dos coches humanos; los checkpoints de las CPU lejanas no producen avisos que se confundan con los tuyos. La primera llegada de un rival conserva su señal de aviso y los impactos cercanos se escuchan según intensidad/proximidad.

Cuenta regresiva, salida, checkpoint, vuelta, récord y resultado tienen señales distintas. El sistema limita las voces transitorias, suaviza entradas/salidas y usa una mezcla con compresión. Pausa, sonido OFF, pestaña oculta y menú silencian todas las capas; los resultados conservan una señal breve y paran el motor. Se reutiliza un único contexto de audio y los efectos terminados se desconectan. El botón mantiene su control de encendido/apagado y expone su estado accesible.

Todo se sintetiza con Web Audio, sin archivos de sonido externos. Si la API no existe o falla, la carrera sigue funcionando. La calidad percibida y el volumen en parlantes/auriculares y teléfonos siguen pendientes de escucha humana.

## Pantalla inicial — build 0.34

El paddock reúne configuración de carrera, garaje y vista previa. El mapa usa el trazado real, indica checkpoints, meta y sentido, y muestra el perfil de barreras efectivo y el récord de esa versión. El garaje dibuja el modelo y pintura elegidos con el mismo render de carrera. Las vistas previas no modifican la simulación.

Las flechas y Enter funcionan en los selectores y botones del menú; antes el control global de carrera bloqueaba esas teclas. Al correr el foco pasa al lienzo y al volver regresa al título del menú. Los controles secundarios se consultan en un desplegable. En móvil la configuración se apila sin desbordar. Esa entrega todavía necesitaba teclado; 0.75 añade controles táctiles reales para P1.

## Rivales — build 0.36

La parrilla usa nombres propios estables: **TRAZO** mantiene el estilo equilibrado, **FURIA** inicia ataques con menor ventaja de velocidad y **ÁPICE** responde con más precisión. El menú explica los estilos de los rivales elegidos. Colores, avisos de llegada y tablas comparten esos nombres; las claves de puntuación permanecen iguales.

En paralelo, si las trayectorias actuales prevén contacto con un coche cercano, la CPU sigue un punto más próximo de su carril. Esto evita que apunte al otro lado de la curva y cierre el espacio del rival. Conserva su anticipación normal con un carril libre, un coche lejano o trayectorias paralelas seguras; considera también los otros rivales del grupo.

No se aumenta potencia, agarre ni velocidad máxima. El ajuste no vuelve más lento al jugador ni cambia la penalización del terreno. El ritmo humano, las escapatorias y las diferencias de estilo siguen necesitando carreras reales; no se declara resuelto el reporte de dos vueltas de ventaja.

## Resultados y campeonato — build 0.35

La llegada muestra dos tablas: carrera (puesto, piloto, tiempo/diferencia, mejor vuelta y puntos ganados) y campeonato (puesto por puntos, piloto, puntos de esta carrera y total). Se identifican ambos humanos y los colores de todos los coches; los mismos nombres y puntos continúan al siguiente circuito. Quien no termina aparece como **SIN TERMINAR**, con sus vueltas y cero puntos. La escala sigue siendo 25/18/15/12.

Los empates de puntos comparten puesto en el campeonato. Si la última etapa termina con líderes empatados se informa el empate, en lugar de elegir un campeón por orden interno. Una nueva temporada reinicia los puntos. Las tablas se apilan en pantallas pequeñas, conservan encabezados accesibles y el foco de llegada permanece en el título. Contrarreloj y desafíos todavía no están implementados.

## Estabilidad de carrera — build 0.37

La pausa cancela el frame pendiente antes de reanudar, evitando ciclos duplicados cuando se pulsa muy rápido. Dibuja el aviso inmediatamente, muestra SEGUIR en el botón y limpia teclas mantenidas. Ocultar la pestaña congela carrera y sonido; volver no reanuda sin una acción del jugador. Reiniciar recupera el estado normal del botón.

Los tiempos se redondean en décimas enteras antes de separar minutos y segundos: `59,96 s` aparece como `01:00.0`, en lugar de `00:60.0`. No cambia el tiempo usado para récords o posiciones.

En una convergencia cercana en paralelo, la CPU establece antes su objetivo de carril, usando la dirección y física compartidas. Se conservan potencia, agarre, aceleración, límites y superficies. No se aplica un desplazamiento lateral directo.

## Estructura

- `index.html`: menú, opciones, interfaz de carrera y telemetría.
- `style.css`: diseño adaptable, modo de pantalla completa y estilos de la interfaz.
- `script.js`: circuitos, conducción, CPU, superficies, colisiones, checkpoints, renderizado y mezcla/señales de audio.
- `engine-audio.js`: síntesis del motor, régimen, carga y cambios de marcha; cargar antes de `script.js`.
- `ROADMAP_EVOLUCION.md`: plan abierto, auditoría, prioridades y ruta online.
- `ROADMAP_24_FASES.md`: historial de sistemas y entregas.
- `tests/`: validación de geometría, ancho completo, integración, conducción, récords, barreras y CPU; prueba opcional de Chromium.

## Validación conocida

En 0.42 se mide una respuesta de giro inicial un 72 % mayor frente a 0.41 en la misma prueba de 0,3 s, sin subir la velocidad máxima. Se conserva el beneficio de frenar y la rampa de aceleración. La CPU permite roces laterales leves, anticipa alcances fuertes y consulta el terreno real para recuperarse. Checkpoints/meta usan el cruce exacto y la huella física del coche: se corrige el caso de Dusty donde un roce causaba una vuelta extra. `validate-arcade-flow.mjs` compara la referencia congelada, `validate-gate-contact.mjs` reproduce el fallo y `tests/experiments/compare-driving.mjs` permite repetir las variantes con una política de dirección automática. Ninguna de esas pruebas sustituye la sensación humana.

En 0.41, `validate-runoff.mjs` recorre 14 pistas y 70 perfiles, compara 37.082 puntos independientes del mundo y verifica 149.324 celdas de grava en perfiles abiertos. Comprueba dibujo/material, exclusión del asfalto y barreras activas, caché, secuencia pavimento/grava/pasto, frenado distinto, recuperación de cuatro modelos desde reposo sin generar velocidad, dos humanos con la misma física y CPU que sale de una trampa sin teletransporte. Chromium comprueba frenado sobre grava visible y ausencia con vallas completas; capturas revisadas. Se repiten 76 carreras/450 vueltas con tiempos sobre pavimento conservados y los contactos en grupo ya registrados. Récords de física anterior conservados. El motor convincente sigue pendiente y dos jugadores sigue siendo el límite local actual.

En 0.40, la nueva prueba de conducción mide aceleración progresiva, diferencia real de trayectoria entre 100/máxima y recuperación de radio al frenar, límite de fuerza lateral en cuatro superficies y separación de récords. Pasan conducción, inercia, integración, geometría, colisiones y pruebas de navegador/entrega. Se repiten carreras completas con la nueva física; las referencias de contacto previas quedan asociadas a su versión. El criterio nuevo comprueba finalización y evita contactos sostenidos (más de 1 s acumulado por carrera de parrilla o 0,5 s con dos coches), sin afirmar que no haya roces. La batería completa suma 76 carreras y 450 vueltas válidas: cero contactos en el tráfico de dos coches; 18 frames acumulados en parrillas Normal y uno en Sunset Fácil. Siguen pendientes los contactos en grupo y la valoración humana. Grava, motor nuevo y 3–4 jugadores siguen pendientes.

En 0.39, `validate-sunset.mjs` compara con una referencia congelada de 0.38: recorrido +76,5 %, silueta distinta de la anterior y de las otras 13, huella física del coche/pista y prestaciones conservadas, nueve checkpoints, meta sin vuelta válida si faltan checkpoints, récord previo conservado y hashes de los otros 13 trazados idénticos. Geometría: margen de asfalto al borde del mundo 41,3 y separación libre entre ramales 42,5 unidades. Chromium comprueba el circuito, cámaras, mapa y flujo de juego; se revisan capturas reales de vista completa y menú. El tiempo de CPU no reemplaza una vuelta humana. Se repite la batería completa de 76 carreras/450 vueltas y se conserva el orden de dificultad. Sunset Normal/Difícil de parrilla no registra contactos; Fácil registra tres frames nuevos. Los contactos de Coastline Normal, Dusty Difícil y Meadow con dos coches siguen documentados.

En 0.38, la prueba de entrega abre los archivos originales sin instrumentar el juego, bajo `/f1/`. La apertura directa de archivos quedó pendiente: este Chromium administrado la bloqueó con `ERR_BLOCKED_BY_ADMINISTRATOR`. Prepara recursos antiguos en caché, verifica carga de JS/CSS con la misma versión, las 14 pistas, configuración, cuenta regresiva, conducción por teclado, pausa/reinicio/menú y ausencia de errores de JavaScript. Pasan el flujo completo de Chromium, audio real, integración con versiones y comprobaciones focalizadas/estructurales. La batería completa de 76 carreras corresponde a 0.37: esta entrega no cambia la simulación. La URL pública no pudo comprobarse porque el proxy devolvió 403 al conectar con `gomeza2.github.io`; no se afirma que Pages esté desplegado.

En 0.37 pasan 76 carreras de la batería completa (450 vueltas válidas), Chromium y Web Audio real, además de las pruebas estructurales/físicas. La regresión de ciclo de carrera prueba 100 pausas/reanudaciones rápidas, una sola cadena de frames, teclas liberadas, pausa por evento de visibilidad, reinicio/menú y redondeo al minuto. El tráfico de dos coches baja de 12 a 7 frames con contacto: Sunset/Neon/Dusty quedan en cero, pero aparecen siete en Meadow. En parrilla Normal el total sigue en cuatro: Jungle pasa a cero y Coastline de tres a cuatro; Dusty Fácil pasa a cero y Difícil registra dos. Se conserva este registro de regresiones locales y no se declara libre de contactos ni equilibrado contra personas.

En 0.36, la revisión de CPU supera las 42 carreras clásicas (126 vueltas), conserva el orden de dificultad en las 14 pistas y prueba el seguimiento próximo solo ante convergencia en paralelo. En parrilla Normal, Sunset/Dusty bajan a cero fotogramas con contacto y el total de las 14 pistas pasa de 15 a 4 (uno en Jungle y tres en Coastline). Se registra un contacto en Dusty Fácil, donde la referencia anterior tenía cero. El tráfico de dos coches suma 12 frames de contacto frente a 11 previos (Dusty 10 y Neon 2); queda pendiente de corrección. No se considera una solución universal. Las 76 carreras de la batería completa suman 450 vueltas válidas. Chromium comprueba nombres, carreras, menú, resultados, controles y pantallas adaptables. Las pruebas de conciencia de rivales, integración/física/colisiones/barreras y sistemas existentes pasan; el balance con personas sigue pendiente.

En 0.35, `validate-results.mjs` comprueba orden, tiempos/diferencias/mejores vueltas, sin terminar, puntos por carrera/total, continuidad de identidad, empate de puestos y final, ausencia de doble premio, reinicio de temporada, 1–3 rivales y dos jugadores. Chromium comprueba ambas tablas de cuatro coches, nombres, puntajes, ausencia de desbordamiento móvil y continuación de carrera. Pasan además integración, geometría/identidad, conducción/inercia, colisiones/barreras, coches, llegada, menú, audio y CPU/tráfico/parrilla focalizados. Las capturas se revisan; esto no reemplaza carreras humanas.

En 0.34 se comprueban las 14 vistas previas, checkpoints/récords/perfiles, 24 selecciones de modelo y pintura, ausencia de cambios en la simulación y continuidad de selección entre etapas. Chromium comprueba teclado nativo, foco, menú móvil, vistas previas y el flujo de carrera existente. También se repiten las pruebas físicas/estructurales y CPU/tráfico/parrilla focalizados, y la medición real de audio. No se declara resuelto el balance humano ni los errores del reporte de video, que todavía no pudo transferirse.

En 0.33 pasaron las pruebas de grafo/ciclo de vida de audio y la medición real de Web Audio en Chromium: motor audible, respuesta de derrape, pico muestreado sin recorte, silencio tras pausa/OFF/menú, recuperación al encender, mezcla local y motivo de resultado. El analizador registró RMS 0 en pausa/OFF/menú durante esta prueba. Esto no evalúa gusto musical, volumen de dispositivos, latencia móvil ni interrupciones de todos los navegadores. También pasaron el flujo completo de Chromium, integración, geometría, conducción, inercia, colisiones, llegada y CPU/tráfico/parrilla focalizados.

En 0.32, `validate-car-visuals.mjs` verifica 72 combinaciones de modelo/pintura/calidad, conservación del color en impactos, luces, giro/contravolante, rodadura, reposo, marcas bajo las ruedas, reinicio, movimiento reducido y dibujo sin mutar la simulación ni dejar transformaciones abiertas. Chromium comprobó los modelos/pinturas/calidades con el render real y el feedback de dirección/freno con teclado. Pasaron conducción, inercia, geometría, integración, contactos, llegada, barreras y casos focalizados de CPU/tráfico/parrilla. Se conservan los tiempos de las carreras de referencia de Sunset/Dusty; no se repiten todas las carreras de 0.29 en una etapa de dibujo.

En 0.31, `validate-finish.mjs` comprueba primer finalista, continuidad humana, plazo de 18 s, pausa/reanudación, resumen personal, vueltas/tiempos, sin terminar, puntos una sola vez, reinicio y dos jugadores. Chromium comprueba además bandera/aviso sin reducir el lienzo, distribución móvil, continuación de controles, foco, animación limitada y movimiento reducido. Pasaron integración, geometría, conducción, inercia, contactos, barreras y casos focalizados de CPU/tráfico/parrilla. No se modifica la física ni se repiten todas las carreras de 0.29.

`validate-scenery.mjs` comprueba las 14 pistas en tres calidades: 962 colocaciones, huella visible dentro del espacio reservado, separación exacta de pista, límites del mundo, distancia entre objetos, generación reproducible y reutilización de caché. Detallados suma 385 objetos y Rendimiento 247 entre las 14 pistas. Pasaron también integración, geometría, conducción, inercia, barreras, contactos/recuperación, casos focalizados de CPU/tráfico, carreras de parrilla en Sunset/Dusty y Chromium con render de los 14 escenarios. Se revisaron capturas de ocho entornos. No se midieron FPS ni se repitió en esta etapa toda la batería de carreras de 0.29; la física y los controladores no cambian.

En 0.29 pasaron las 20 carreras de parrilla (240 vueltas), 42 clásicas (126 vueltas), 14 de tráfico de dos coches (84 vueltas), comprobaciones estructurales/físicas y Chromium. La parrilla Normal conserva contactos residuales en Dusty y Coastline: 15 frames en total frente a 19 en 0.28; no se declara libre de choques. Los nuevos casos de colisión y recuperación también pasaron.

`validate-collisions.mjs` reproduce y comprueba amontonamientos de cuatro coches, inmovilidad sin entrada, roces paralelos, alcance/frontal, respuesta igual a 30/120 FPS, empujones contra una valla y cruce de meta por contacto sin duplicar vueltas. También comprueba recuperación desde reposo de los cuatro modelos en asfalto, tierra e hielo, sin saltos de posición. La colisión entre coches conserva su aproximación circular de 23 unidades; no es una simulación de carrocerías deformables.

La prueba `validate-grid.mjs` comprueba el tamaño de parrilla, diferencias de ataque ante la misma situación, detección de varios coches, contactos por pares, clasificación, puntos por puesto y sin terminar, continuidad del campeonato y modo local. Ejecuta carreras de cuatro controladores en las 14 pistas en Normal, más Sunset/Dusty/hielo en Fácil y Difícil. En 0.28 pasaron esas 20 carreras con 80 finalizaciones y 240 vueltas válidas. El máximo desvío fue 36,8 frente al ancho físico de 42; quedaron contactos en Dusty y Coastline. También pasaron las 42 carreras clásicas, 14 de tráfico de dos coches, comprobaciones estructurales/físicas y Chromium con la parrilla ampliada. Esto comprueba carreras y checkpoints; no representa una partida humana.

En 0.27, el benchmark de tráfico completa 14 carreras y 84 vueltas válidas; los frames con contacto bajan de 70 a 11 frente a 0.26 (84,3 % menos tiempo con contacto). Los 11 restantes aparecen en Dusty, donde esa referencia previa no registraba contactos; se conserva como regresión local pendiente de ajuste. Los otros 13 circuitos no registraron contactos en este escenario. Esto no garantiza carreras sin choques contra personas. Pasaron también las 42 carreras de dificultad (126 vueltas), sintaxis, integración, geometría, conducción, inercia, barreras y Chromium. El ritmo en pista libre se conserva.

La base de CPU de 0.25 superó 42 carreras simuladas (126 vueltas) y pruebas de tráfico en las 14 pistas. En 0.26 se repitieron sintaxis, geometría, identidad, integración, conducción, inercia, barreras y casos focalizados de CPU. La prueba `validate-traffic.mjs` comprueba decisiones de ataque/defensa/doblaje, entradas laterales, trayectorias curvas, espacio contra el borde y carreras de dos controladores en las 14 pistas; compara contactos con la referencia reproducible de 0.26. Chromium comprobó controles de teclado, pausa, reinicio, menú, carga de pistas, pantalla completa, HUD, resultados y modo local. Las pruebas de 0.26 verifican además los datos retirados, el cronómetro por vuelta, ausencia de scroll y proporción del lienzo en escritorio, móvil vertical y horizontal. La carrera de CPU en hielo se ejecutó acelerando la física desde la prueba, sin conducción humana. `validate-driving.mjs` verifica aceleración de los cuatro modelos, radio de giro, dirección a alta velocidad, freno de mano, agarres y cámara dentro de los límites de las 14 pistas.

Las barreras de 0.21 siguen contornos cerrados del ancho de pista, sin los pliegues de las curvas interiores. Los segmentos usados para dibujarlas también resuelven los impactos del coche; los neumáticos tienen colisión en los círculos visibles y se descartan pilas que invadan otro ramal. La prueba de barreras comprueba 37 contornos, 11174 puntos y los cinco perfiles en las 14 pistas, además de impactos, coche detenido y rebote moderado.

Pendientes: balance contra personas, contactos residuales en tráfico, tráfico humano impredecible, nuevos perfiles personalizados, audio, rendimiento medido y conducción móvil. El minimapa ya permanece visible en pantallas pequeñas. En aquella entrega no había controles táctiles. Desde 0.75 hay entrada multitáctil comprobada en Chromium; conducir humanamente en un teléfono físico sigue pendiente.

La fase 5 continúa: Champion Road, Dusty Mesa y Sunset ya tienen rediseños propios; quedan siete originales con estructuras similares por revisar, conservando conducción, CPU, cámara y barreras. El registro detallado está en la hoja de ruta.

## Hoja de ruta

La planificación vigente está en [`ROADMAP_EVOLUCION.md`](ROADMAP_EVOLUCION.md); el registro de entregas sigue en [`ROADMAP_24_FASES.md`](ROADMAP_24_FASES.md). Las hojas anteriores se mantienen como referencias históricas; no describen necesariamente el estado actual.


## Publicación

Los cambios se publican mediante Git usando el historial real de `gomeza2/f1`, conservando las revisiones previas. La app de GitHub y la CLI pueden tener capacidades diferentes: una lectura fallida por API no demuestra por sí sola que un push por Git esté bloqueado.

Para servir el juego con GitHub Pages, usá la rama/carpeta configurada en Settings → Pages y comprobá el despliegue. Subir código a una rama no implica que Pages ya haya terminado de actualizarse.


### Entrega 0.43 — fase 26, primera revisión

Motor sustituido e integrado; pruebas de régimen/cambios/carga, presupuesto de voces y ciclo de vida, salida Web Audio real, recorrido de Chromium y recursos versionados bajo `/f1/`. Física `:p4`, trazados y controles conservados. La evaluación humana del motor y manejo sigue abierta. Próxima implementación: fase 27, anchos/pianos/barreras por sector y variedad real de recorridos cortos, medios y largos; 20/40/60 s son referencias, no un límite universal.


### Entrega 0.44 — fase 27, primera revisión

Tres perfiles de anchura y pianos por sector integrados con física, CPU y barreras. Geometría independiente y pruebas de píxeles reales, además de carreras con checkpoints. Las capturas revisadas muestran sectores amplios/estrechos y vallas sobre sus bordes. La prueba automatizada no confirma diversión/equilibrio humano. Faltan más siluetas, ritmos largos y extensión de perfiles a las once pistas restantes; no se declara completada toda la fase 27.


### Entrega 0.45 — soltar/frenar y crucero de motor

Respuesta de volante y aceleración conservadas. Por encima del 58 % de la velocidad máxima, la fuerza lateral cae gradualmente hasta un 16 % adicional: a velocidad alta hace falta abrir la trayectoria o soltar/frenar antes de una curva cerrada. La retención al soltar pasa de 20 a 30 unidades/s; el freno sigue siendo una acción mucho más fuerte. Se elimina la pequeña desaceleración automática según la curva próxima: la conducción decide cuándo perder velocidad. CPU y humanos comparten estas reglas; se recalcula el plan de frenado del rival. Récords `:p5` conservan `:p4` (incluidos los `:r1`) y versiones anteriores.

Comparadas reducciones del 16 y 24 %, se elige la moderada. En una política automática con la misma dirección, Sunset marca 37,72 s planificando velocidad frente a 45,90 s con gas continuo. Neon aún permite ir a gas con esa política; no se declara toda la IA óptima ni cada curva equilibrada. Valores y reproducción: `tests/experiments/LIFT_045.md`.

Motor de crucero menos agudo: armónicos limitados, tono del escape más grave y menos brillo al llegar a máxima, sin alternar marchas/cortes repetitivos. No se activa el siseo de derrape en recta por el mero valor de drift: requiere giro real o freno de mano. Se comprueba audio sostenido de los cuatro modelos mediante Web Audio real; la energía filtrada y ausencia de recorte no sustituyen escuchar el timbre.

Esta revisión responde al reporte del usuario. No modifica trazados ni añade el recorrido largo pendiente. Siguiente tramo: continuar fase 27, variedad de siluetas/ritmos y pistas largas, sujeto a la prueba humana del manejo/audio revisados.


### Entrega 0.46 — fase 27, recorrido largo

Night Run aporta una silueta y duración distintas; no es solo una ampliación del trazado anterior. La primera variante se rechazó por semejanza con Champion y se rediseñó. Geometría con ancho completo, conservación de los otros trece circuitos, checkpoints secuenciales, récords y pruebas de carrera forman parte de `validate-night-long.mjs` y de las baterías de CPU/perfiles. Chromium comprueba píxeles de la carretera y cámaras del mundo largo. Queda conducción humana, rendimiento en teléfonos y seguir diferenciando los otros trazados. Física/audio de 0.45 conservados. La expansión detectó exceso de decoración: el fondo conserva como máximo 150/110/80 objetos en alta/retro/ligera, distribuidos por todo el mundo y reutilizados desde caché.


### Entrega 0.47 — Volcano Ring y material de carretera

Rediseño de nivel, paleta/grano de superficie volcánica y selección de pruebas focalizadas con `TEST_TRACKS=6` en barreras/decoración y `ROAD_STAGES=6` en el navegador. Los comandos sin esas variables siguen validando todos sus casos. `validate-volcano.mjs` comprueba doce carreras/54 vueltas válidas: cinco perfiles, cuatro modelos, tres parrillas de cuatro coches/dificultades, límites compartidos y orden Fácil/Normal/Difícil. No es toda la combinación cartesiana ni una aprobación humana de equilibrio.

La comparación visual opcional requiere guardar el script anterior: `git show 301bb27:script.js > /tmp/script-046.js` y ejecutar `ROAD_SOURCE_BASELINE=/tmp/script-046.js node tests/browser-material-parity.cjs` con Playwright/Chromium disponibles. Comprueba imágenes completas de carretera, no solo llamadas de dibujo.

Siguiente prioridad propuesta: fase 28, ritmo y trazada CPU en curvas rápidas/tráfico; la revisión de más siluetas y perfiles de fase 27 queda abierta. Física y audio siguen en la revisión 0.45, con aceptación humana pendiente.


### Entrega 0.48 — fase 28, primera revisión de CPU

La CPU lee la curvatura sobre un arco continuo de posiciones, reduciendo la influencia de las juntas de la línea muestreada. El plan sigue limitado por la física compartida y las superficies. En seis referencias Normal de dos vueltas, mejora 3–10,2 % frente a 0.47 sin salir del corredor; Neon pasa de 22,975 a 21,583 s de media y Frostbite de 29,683 a 26,667. No cambia la potencia ni la respuesta del coche del jugador. La CPU utiliza más freno de mano en varios casos y paga su coste normal.

La consulta de velocidad recorre solo las próximas 240 unidades de recorrido, con búsqueda inicial por progreso; no todo el plan en cada frame. Se comprueba igualdad con el barrido anterior, incluida la meta. Night tiene 891 entradas de plan: 31 lecturas de progreso en la consulta medida. No es una medición de FPS.

Referencia/variantes y limitaciones: `tests/experiments/AI_CURVATURE_048.md`. Física/recorridos/récords `:p5` y audio se conservan. Sigue pendiente competir contra personas y refinar adelantamientos/defensa por línea elegida; Dusty Fácil muestra más roces en esta parrilla de prueba. La fase 28 sigue abierta y es la siguiente prioridad. Las nueve pistas sin sección variable y la fase 27 también permanecen abiertas.


### Entrega 0.49 — fase 29, parrilla local

Adelantada por pedido del usuario: previa real de 2–4 humanos, elecciones individuales, controles normalizados de teclado/mando, cámaras/HUD, resultados y continuidad del campeonato. Audio amplía el contexto existente hasta cuatro motores humanos; voces extra quedan mudas al volver a dos/solo. Sin cambios a física 5, potencia, geometrías, récords o política de CPU 0.48.

Pruebas específicas: `node tests/validate-local.mjs` y, con Playwright/Chromium, `node tests/browser-local.cjs`. Cubren 15 parrillas de cinco pistas, entradas aisladas/simultáneas, selección, cámaras, HUD, resultados/DNF/puntos, pausa/reinicio/siguiente, cinco resoluciones y mandos estándar emulados con desconexión/reconexión/asignación exclusiva. No son carreras humanas completas ni validación de hardware físico. La revisión de tráfico de fase 28 (Dusty Fácil), más perfiles/siluetas de fase 27, escucha del audio y equilibrio humano siguen pendientes. Próximo tramo recomendado: tráfico y líneas de ataque/defensa, conservando esta base local.


### Entrega 0.50 — fase 28, velocidad por carril de disputa

La CPU conserva el signo de la curvatura y reduce su velocidad prevista cuando ocupa una línea interior, cuyo radio es menor que el del centro de pista. La previsión conserva el horizonte de frenado y el coste físico del freno de mano. No recibe un aumento de velocidad por ir por fuera. La conducción libre, prestaciones, dificultad, físicas y recorridos siguen iguales.

Referencia reproducible Dusty Fácil, cuatro controladores y tres vueltas a 30 Hz: contacto acumulado de **28 a 3 pasos** (0,93 a 0,10 s). El piloto que quedaba trabado mejora de **25,60 a 23,41 s** de media; los demás marcan 24,57/25,07/23,83. Son pasos con solapamiento, no un contador de choques separados. La colisión sigue activa; no es una promesa de carreras sin contacto contra personas.

Pruebas: `node tests/validate-lane-speed.mjs` comprueba el radio interior, curvas reflejadas, rectas, meta, prestaciones preservadas y la carrera de regresión; `node tests/validate-ai-plan-query.mjs` compara 7.344 consultas con el barrido completo. Experimentos y límites: `tests/experiments/TRAFFIC_LANES_050.md`. La fase 28 sigue abierta: transiciones de línea y grupos de varios coches necesitan más trabajo, además de balance humano. El modo local 2–4 de 0.49 se conserva.

En cinco comparaciones de parrilla frente a 0.49, el contacto acumulado suma 56 → 8 pasos. Hay contrapartidas documentadas: Night Normal tiene 32 pasos-coche fuera de la franja legal y Sunset Difícil dos pasos de contacto nuevos. La CPU conserva la penalización física y todos terminan; estas transiciones y reservas de espacio siguen pendientes. No se declara una IA sin errores ni se extrapola la mejora a todo tráfico humano.


### Entrega 0.51 — fase 28, anticipación del borde

Durante una disputa, la CPU proyecta su movimiento y giro a 0,25/0,5 segundos y pide frenar antes de una salida prevista. Usa la anchura legal real, sin cambiar su posición, agarre ni potencia. Pista libre, conducción humana y recuperación hacia dentro conservadas. La proyección se comparte con la anticipación de contactos.

Referencias Normal de cuatro coches/tres vueltas: Night pasa de 32 a 0 pasos-coche fuera y de 2 a 0 con contacto; Meadow 7 → 0 contactos; Industrial 12 → 0. Dusty Fácil conserva el avance previo (3 → 1 paso de contacto) y Volcano sigue sin contactos. Son referencias automatizadas, no una garantía de carreras sin roces contra personas. Sunset Normal sube de 1 a 13 pasos con contacto y queda documentado como pendiente.

Pruebas nuevas: `node tests/validate-boundary-plan.mjs`, `node tests/validate-boundary-races.mjs` y `node tests/browser-boundary.cjs` con Playwright/Chromium. La prueba de navegador completa las tres carreras y comprueba el plazo real de llegada, además del render y la consola. Condiciones/variantes/límites en `tests/experiments/BOUNDARY_051.md`. Se conservan local 2–4, física 5, récords, audio y los 14 trazados.

Siguiente prioridad propuesta: retomar variedad de fase 27, diferenciando otro circuito y sus secciones; las reservas frente a grupos y los roces de Sunset siguen abiertos para otra revisión de fase 28. Evaluación humana de conducción/audio/local aún pendiente.


### Entrega 0.52 — fase 27, Frostbite propio

Geometría nueva, material nativo de hielo y récord de recorrido separado. Se descartan propuestas demasiado próximas a Night y otra con bordes superpuestos en el cierre; el recorrido elegido pasa a distancia 0,258 de la silueta más cercana. Condiciones, medidas y variantes: `tests/experiments/FROST_052.md`.

Prueba dedicada: `node tests/validate-frost.mjs`; píxeles/calidades/carreras: `ROAD_STAGES=4 node tests/browser-road-sectors.cjs` con Playwright/Chromium. Las comprobaciones históricas conservan sus otros recorridos y usan el nuevo fixture para Frost. Su vuelta anterior ya no se compara con el nuevo trazado en el benchmark de velocidad CPU.

Siguiente prioridad propuesta: continuar fase 27 con otro recorrido de identidad débil, como Pixel City; completar variedad sin perder las mejoras de conducción, CPU y local. Siguen abiertas evaluación humana de motor/manejo, reservas de tráfico y rendimiento en hardware físico.

Comparación gráfica de coches 0.57 (Playwright/Chromium):

```sh
git show 2f37712:script.js > /tmp/pixelgp-before-057.js
CAR_SOURCE_BASELINE=/tmp/pixelgp-before-057.js node tests/browser-car-light.cjs
```

`CAR_SCREENSHOTS` guarda las planchas antes/después. Compara cuatro modelos, seis pinturas, cuatro orientaciones y tres calidades; el microbenchmark de dibujo no mide FPS del juego completo.

Pruebas de simulación fija:

```sh
node tests/validate-fixed-step.mjs
node tests/validate-step-races.mjs
git show 4697d06:script.js > /tmp/pixelgp-before-058.js
STEP_SOURCE_BASELINE=/tmp/pixelgp-before-058.js node tests/browser-fixed-step.cjs
```

La prueba de navegador usa timestamps controlados con el bucle/dibujo reales. No mide la tasa de fotogramas de un dispositivo físico.

Prueba de recuperación de dirección 0.59:

```sh
node tests/validate-countersteer.mjs
git show b4b2908:script.js > /tmp/pixelgp-before-059.js
CONTROL_SOURCE_BASELINE=/tmp/pixelgp-before-059.js node tests/browser-countersteer.cjs
```

La prueba de navegador utiliza teclado real, física a paso fijo y Canvas; `CONTROL_SCREENSHOTS` guarda capturas antes/después.

Pruebas dedicadas de Jungle 0.60:

```sh
node tests/validate-jungle.mjs
TEST_TRACKS=5 node tests/validate-barriers.mjs
ROAD_STAGES=5 node tests/browser-road-sectors.cjs
```

`validate-jungle --geometry` permite revisar forma, anchuras, gates y conservación sin repetir las carreras. La comparación de otras carreteras admite `PARITY_STAGES=0,1,2,3,4,6,7,8,9,10,11,12,13` con `ROAD_SOURCE_BASELINE` apuntando al script conservado de 0.59.

Comparación de escenarios 0.61 (Playwright/Chromium):

```sh
node tests/validate-scenery.mjs
git show d77285f:script.js > /tmp/pixelgp-before-061.js
SCENERY_SOURCE_BASELINE=/tmp/pixelgp-before-061.js node tests/browser-vegetation.cjs
```

`SCENERY_SCREENSHOTS` guarda capturas antes/después. La prueba compara fondos, posiciones y carreteras en las 14 pistas y tres calidades; no mide FPS del dispositivo del jugador.

Pruebas del balance 0.62:

```sh
node tests/validate-speed-balance.mjs
node tests/validate-speed-races.mjs
git show d7f46bc:script.js > /tmp/pixelgp-before-062.js
SPEED_SOURCE_BASELINE=/tmp/pixelgp-before-062.js node tests/browser-speed-balance.cjs
```

La prueba de navegador usa teclado real sobre Champion, contrasta garaje/HUD/movimiento, frenada y conservación de récords al recargar. `SPEED_SCREENSHOTS` guarda capturas. Las vueltas automáticas con Speed emplean un controlador conservador y no sustituyen conducirlo humanamente.

Pruebas de cierre lateral 0.63:

```sh
node tests/validate-angled-traffic.mjs
node tests/validate-group-traffic.mjs
git show 874fba2:script.js > /tmp/pixelgp-before-063.js
TRAFFIC_SOURCE_BASELINE=/tmp/pixelgp-before-063.js node tests/browser-angled-traffic.cjs
```

`TRAFFIC_SCREENSHOTS` guarda capturas. El caso reproduce el defecto y comprueba la CPU/frenada real; no demuestra que todas las situaciones de tráfico estén resueltas.

Pruebas de Thunder 0.64:

```sh
node tests/validate-thunder.mjs
TEST_TRACKS=8 node tests/validate-barriers.mjs
ROAD_STAGES=8 node tests/browser-road-sectors.cjs
node tests/browser-thunder-material.cjs
LOCAL_STAGE=8 node tests/browser-local.cjs
```

`validate-thunder --geometry` comprueba conservación sin repetir carreras. `THUNDER_SCREENSHOTS` guarda capturas de materiales/paddock. `LOCAL_STAGE` permite revisar otro circuito con la batería local existente. La comparación de las otras trece carreteras usa `PARITY_STAGES=0,1,2,3,4,5,6,7,9,10,11,12,13` y `ROAD_SOURCE_BASELINE` apuntando al script de 0.63.

Pruebas de motor/portada 0.65:

```sh
node tests/validate-engine-timbre.mjs
node tests/browser-paddock.cjs
git show 9654867:engine-audio.js > /tmp/pixelgp-engine-before-065.js
ENGINE_AUDIO_BASELINE=/tmp/pixelgp-engine-before-065.js ENGINE_AUDIO_DIR=/tmp/pixelgp-audio-review node tests/browser-engine-tone.cjs
```

Los WAV exportados reproducen primero el motor anterior y después el nuevo, con pausa y nivel RMS igualado; el juego no los descarga. `PADDOCK_SCREENSHOTS` guarda capturas de cinco resoluciones. `PADDOCK_BASELINE` admite un directorio conservado de la versión anterior (HTML/CSS/scripts) para capturar antes/después.

Pruebas de escenarios 0.66:

```sh
node tests/validate-scenery.mjs
git show e7503c2:script.js > /tmp/pixelgp-before-066.js
SCENERY_FOCUS=architecture SCENERY_SOURCE_BASELINE=/tmp/pixelgp-before-066.js node tests/browser-vegetation.cjs
```

La comparación reutiliza la prueba de fondos, comprueba las 14 pistas en tres calidades y admite `SCENERY_SCREENSHOTS` para capturas generales y cercanas antes/después. No mide FPS del dispositivo del jugador.

Pruebas de Coastline 0.67:

```sh
node tests/validate-coast.mjs
TEST_TRACKS=10 node tests/validate-road-sectors.mjs
TEST_TRACKS=10 node tests/validate-barriers.mjs
ROAD_STAGES=10 node tests/browser-road-sectors.cjs
MIXED_STAGE=10 node tests/browser-thunder-material.cjs
LOCAL_STAGE=10 node tests/browser-local.cjs
```

Las pruebas de material mixto se comparten con Thunder: `MIXED_STAGE=10` selecciona Coastline y `MIXED_SCREENSHOTS` exporta capturas. `validate-coast --geometry` omite la matriz de carreras cuando solo se necesita verificar conservación. La prueba de secciones admite `TEST_TRACKS` para evitar repetir las pistas ya comprobadas.

Pruebas de pedales 0.68:

```sh
node tests/validate-pedals.mjs
node tests/validate-pedal-races.mjs
git show 612a22c:script.js > /tmp/pixelgp-before-068.js
PEDAL_SOURCE_BASELINE=/tmp/pixelgp-before-068.js node tests/browser-pedals.cjs
```

Las comparaciones de carreras contrastan posiciones, velocidades, vueltas, contactos y resultados con la corrección desactivada; no son pruebas humanas. La prueba de navegador usa eventos reales de teclado y mandos emulados, no hardware físico.

Pruebas de recuperación 0.69:

```sh
node tests/validate-reverse.mjs
node tests/browser-recovery.cjs
git show d338ca9:script.js > /tmp/pixelgp-before-069.js
RACE_SOURCE_BASELINE=/tmp/pixelgp-before-069.js node tests/validate-pedal-races.mjs
GROUP_STAGES=12 node tests/validate-group-traffic.mjs
```

`RECOVERY_SCREENSHOTS` guarda capturas de cuatro pilotos en reversa y recuperación ante una valla. La comparación de carreras admite `RACE_SOURCE_BASELINE`; sin esa variable conserva su referencia anterior de pedales. `GROUP_STAGES` selecciona escenarios sin cambiar sus presupuestos históricos.

Pruebas de catálogo 0.70:

```sh
node tests/browser-catalogue.cjs
node tests/validate-menu.mjs
node tests/browser-paddock.cjs
node tests/browser-release.cjs
```

`CATALOGUE_SCREENSHOTS` exporta vistas de coches/circuitos en cinco resoluciones. La prueba usa entradas nativas y un puente de solo lectura para comprobar que elegir en el menú no modifica los coches de la carrera anterior.

Pruebas del motor compartido 0.71:

```sh
node tests/validate-shared-driving.mjs
node tests/browser-core-vectors.cjs
git show d417b94:script.js > /tmp/pixelgp-before-071.js
RACE_SOURCE_BASELINE=/tmp/pixelgp-before-071.js node tests/validate-pedal-races.mjs
DRIVING_SOURCE_BASELINE=/tmp/pixelgp-before-071.js node tests/browser-shared-driving.cjs
git show d417b94:index.html > /tmp/pixelgp-before-071.html
DRIVING_HTML_BASELINE=/tmp/pixelgp-before-071.html node tests/browser-release.cjs
```

Las pruebas nativas usan Playwright/Chromium opcionales; el módulo de conducción no agrega dependencias. La igualdad con la implementación anterior se comprueba por entorno; entre Node y Chromium se mide el pequeño redondeo numérico, sin prometer lockstep binario universal.


Pruebas de geometría compartida 0.72:

```sh
node tests/validate-shared-tracks.mjs
node tests/validate-tracks.mjs
```

Para comparar con un archivo real de la entrega anterior, definir `TRACK_SOURCE_BASELINE`; sin esa variable, el validador revierte exclusivamente la extracción declarada mediante el helper histórico. La evidencia de entrega distingue paridad matemática, carreras automatizadas y navegador; no equivale a aprobación humana ni a despliegue de un servidor.


Pruebas de modos/UX 0.73:

```sh
node tests/validate-events.mjs
node tests/validate-results.mjs
node tests/browser-events.cjs # Requiere Playwright y Chromium de desarrollo.
```


Pruebas de reglas compartidas 0.74:

```sh
node tests/validate-shared-rules.mjs
node tests/validate-gate-contact.mjs
node tests/validate-finish.mjs
```

`RULES_SOURCE_BASELINE` permite comparar el primer test con el script real anterior. Sin esa variable se revierte solo la extracción declarada para fixtures históricos. No confundir casos de componente con carreras completas sin navegador.


La auditoría reconciliada del último prompt está en [AUDIT_074.md](AUDIT_074.md). 0.75 implementa el primer bloque táctil de fase 42; la fase 43 agrupa ampliaciones de garaje/progresión y las variantes de juego se desarrollan en 31/40. El núcleo independiente 30.4 sigue siendo necesario antes de salas online.


Prueba nativa de entrada móvil 0.75 (Playwright/Chromium de desarrollo):

```sh
node tests/browser-touch.cjs
```

El test usa toques CDP multitáctiles, no cambia los controles por comandos físicos directos. La preparación de escenas/reloj está instrumentada para resultados repetibles.
