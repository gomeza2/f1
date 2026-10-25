# PIXEL GRAND PRIX

Juego web arcade de carreras 2D desde arriba, con identidad retro propia, circuitos de formas variadas, rivales controlados por CPU, derrapes, superficies y campeonato.

## Cómo ejecutar

Abrí `index.html` en un navegador moderno. No necesita servidor ni instalación de dependencias para su versión básica.

Para publicarlo, podés habilitar GitHub Pages desde **Settings → Pages** y usar `main` y la carpeta raíz (`/`). La entrega mantiene rutas relativas y funciona bajo `/f1/`.

La versión aparece en el pie. JavaScript y CSS llevan una versión en su URL para evitar reutilizar los recursos de una entrega anterior cuando se recibe el HTML nuevo. Esto no fuerza la renovación de un HTML que siga en caché. La comprobación local de entrega no confirma por sí sola el despliegue público. Ver [notas de entrega y pendientes](RELEASE_NOTES.md).

## Controles

- **Jugador 1:** W acelera, S frena, A/D gira, ESPACIO freno de mano.
- **Jugador 2:** flechas para acelerar, frenar y girar; ENTER freno de mano.
- **R:** reinicia la carrera actual.
- **C / botón VISTA:** alterna vista cercana y circuito completo en modo individual. Dos jugadores usa pantalla dividida, con una cámara y contador de vuelta por jugador.
- **ESC:** pausa o reanuda la carrera. Si estás en pantalla completa, también permite salir. La pestaña oculta pausa automáticamente; al volver se reanuda de forma manual. Pausar limpia las teclas mantenidas: volvé a acelerar al continuar.
- **Pantalla completa:** botón en la cabecera.

## Opciones

Antes de correr podés elegir gráficos, dificultad, circuito, coche, color y perfil de barreras.

- **Según circuito:** utiliza el perfil guardado para esa pista.
- **Vallas completas:** barreras en ambos lados del recorrido.
- **Mitad + neumáticos:** barreras en una mitad y neumáticos en curvas seleccionadas de la otra.
- **Solo en curvas:** coloca barreras en sectores de mayor curvatura.
- **Sin barreras:** deja zonas abiertas, pero la salida de pista sigue teniendo penalización y recuperación.

## Circuitos y superficies

El registro conserva los 14 circuitos y los diez nombres originales. La ampliación de 0.22 se conserva: Champion Road tiene una nueva recta larga y un sector técnico, y Coastline Run, Rally Canyon, Meadow Run e Industrial Mix tienen ramales separados para que sus caminos no se superpongan. El coche y el ancho de conducción conservan su tamaño. En 0.23, Dusty Mesa estrena un trazado triangular de tierra: recta rápida superior, “S” técnica al este y regreso diagonal. Sigue abierto y conserva su nombre y lugar en el campeonato.

En **0.39 Sunset Circuit** gana un recorrido propio: recta principal larga, curva exterior amplia, sector interior enlazado y regreso técnico. Pasa de 3572 a 6304 unidades de recorrido (**+76,5 %**) y su mundo de 1400×896 a 1800×1152. El coche, el ancho de pista (84), la velocidad y el perfil abierto se mantienen. El minimapa/vista previa y nueve checkpoints utilizan la geometría nueva.

El objetivo humano sigue siendo una vuelta aproximada de **25–45 segundos**, pendiente de calibración con jugadores. En 0.39 Sunset midió **34,86 s** por vuelta de CPU Normal libre, frente a 22,39 s anteriores; con la física de 0.40 la referencia Normal pasa a **39,78 s**. No se ralentizó la CPU ni el coche para lograrlo. Los otros 13 trazados no cambian; no se promete que todos ya cumplan el objetivo humano. Los récords de Sunset se separan como versión 3 y se conservan los de la versión 2.

El perfil automático deja **siete pistas abiertas, cuatro con protección en curvas cerradas y tres con vallas parciales**. Sunset Circuit arranca sin muros. Podés seguir eligiendo vallas completas o cualquier otro perfil en el menú.

Las superficies incluyen asfalto, tierra, pasto, hielo, volcánico y secciones mixtas. En las pistas mixtas, el agarre, las partículas y el minimapa cambian según el sector. Cada pista tiene entre cinco y nueve checkpoints secuenciales según su longitud, para evitar recortes grandes entre sectores. Los récords se separan por versión del recorrido: se conservan los anteriores, pero no compiten con los tiempos de los trazados nuevos.

## Funcionalidades actuales

- Carrera para un jugador contra **1, 2 o 3 CPU** (tres por defecto) y modo local de dos jugadores sin CPU.
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
node tests/validate-sunset.mjs
node tests/validate-track-identity.mjs
node tests/validate-integration.mjs
node tests/validate-cpu.mjs
node tests/validate-traffic.mjs
node tests/validate-grid.mjs
node tests/validate-collisions.mjs
node tests/validate-scenery.mjs
node tests/validate-finish.mjs
node tests/validate-car-visuals.mjs
node tests/validate-audio.mjs
node tests/validate-menu.mjs
node tests/validate-results.mjs
node tests/validate-rival-awareness.mjs
node tests/validate-race-lifecycle.mjs
node tests/validate-driving.mjs
node tests/validate-driving-demand.mjs
node tests/validate-runoff.mjs
node tests/validate-steering-inertia.mjs
node tests/validate-barriers.mjs
```

La prueba de identidad detecta copias de un trazado aunque se escalen, giren o reflejen, y comprueba que Dusty Mesa se diferencia de las otras 13 pistas. Esto no evalúa la diversión ni sustituye jugar.

La prueba de CPU comprueba límites físicos, desplazamiento y coste del freno de mano. La comparación de mejora de ritmo frente a 0.24 corresponde a la física anterior; con la versión 2 se mide una referencia nueva porque cambiaron las reglas para humanos y rivales. Usa el código real en un entorno DOM simulado: completa tres vueltas con checkpoints en las 14 pistas y las tres dificultades, verifica prestaciones compartidas y prueba frenado ante tráfico y recuperación. No sustituye una carrera humana.

Pruebas opcionales de navegador: `node tests/browser-smoke.cjs`, `node tests/browser-audio.cjs` y `node tests/browser-release.cjs`. Requiere Playwright y Chromium instalados en el entorno de desarrollo; `CHROMIUM_PATH` permite indicar el ejecutable. Inicia un servidor temporal en localhost y bloquea Google Fonts. No agrega dependencias al juego.

## Conducción — build 0.41

La revisión de 0.40 responde a la conducción demasiado fácil reportada por el usuario. La aceleración cae progresivamente con la velocidad: Balanced alcanza 100 en unos 1,59 s y el 95 % de su máxima en 4,40 s en la prueba de aceleración. Los otros modelos conservan su identidad y velocidad máxima. La escala de movimiento sigue en 0,84.

El giro está limitado por una fuerza lateral finita compartida: a alta velocidad crece el radio mínimo y una curva cerrada exige bajar la velocidad. Frenar devuelve una trayectoria más cerrada. Se conserva dirección recuperable, inercia de giro y freno de mano con coste de velocidad; la sensación final del derrape sigue pendiente de validación humana. La CPU construye su plan de frenado usando el mismo modelo; no recibe potencia, agarre ni dirección extra.

La física de 0.40 usa sufijo `:p2`; desde 0.41 se usa `:p3` (por ejemplo, `SUNSET CIRCUIT@3:p3`) por el nuevo agarre/resistencia de las escapatorias. Se conservan ambas referencias anteriores. No se comparan como récord vigente tiempos logrados con la física que permitía pasar curvas mucho más rápido.

### Trabajo pendiente para la base

El plan vigente tiene cinco bloques contando esta revisión: conducción; grava/pasto/barreras; motor y sonido; modo local de 2–4 jugadores; revisión final. El feedback reemplaza la estimación anterior de una sola entrega restante. Cada bloque puede necesitar varias iteraciones.

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

## Audio — build 0.33

**Revisión de calidad pendiente:** el usuario informó que la síntesis actual no se parece a un motor convincente. La próxima revisión de fase 15 debe reemplazar el timbre y respuesta al acelerador; las pruebas técnicas previas solo verifican salida y ciclo de vida.

El motor sintetizado cambia de timbre según el coche y de régimen según velocidad, acelerador y frenado. El derrape y el terreno tienen capas propias. En modo local se mezclan los dos coches humanos; los checkpoints de las CPU lejanas no producen avisos que se confundan con los tuyos. La primera llegada de un rival conserva su señal de aviso y los impactos cercanos se escuchan según intensidad/proximidad.

Cuenta regresiva, salida, checkpoint, vuelta, récord y resultado tienen señales distintas. El sistema limita las voces transitorias, suaviza entradas/salidas y usa una mezcla con compresión. Pausa, sonido OFF, pestaña oculta y menú silencian todas las capas; los resultados conservan una señal breve y paran el motor. Se reutiliza un único contexto de audio y los efectos terminados se desconectan. El botón mantiene su control de encendido/apagado y expone su estado accesible.

Todo se sintetiza con Web Audio, sin archivos de sonido externos. Si la API no existe o falla, la carrera sigue funcionando. La calidad percibida y el volumen en parlantes/auriculares y teléfonos siguen pendientes de escucha humana.

## Pantalla inicial — build 0.34

El paddock reúne configuración de carrera, garaje y vista previa. El mapa usa el trazado real, indica checkpoints, meta y sentido, y muestra el perfil de barreras efectivo y el récord de esa versión. El garaje dibuja el modelo y pintura elegidos con el mismo render de carrera. Las vistas previas no modifican la simulación.

Las flechas y Enter funcionan en los selectores y botones del menú; antes el control global de carrera bloqueaba esas teclas. Al correr el foco pasa al lienzo y al volver regresa al título del menú. Los controles secundarios se consultan en un desplegable. En móvil la configuración se apila sin desbordar; todavía se necesita teclado para conducir. No se agregaron controles táctiles.

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
- `script.js`: circuitos, conducción, CPU, superficies, colisiones, checkpoints, renderizado y audio.
- `ROADMAP_24_FASES.md`: estado y prioridades del desarrollo.
- `tests/`: validación de geometría, ancho completo, integración, conducción, récords, barreras y CPU; prueba opcional de Chromium.

## Validación conocida

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

Pendientes: balance contra personas, contactos residuales en tráfico, tráfico humano impredecible, nuevos perfiles personalizados, audio, rendimiento medido y conducción móvil. El minimapa ya permanece visible en pantallas pequeñas. Todavía no hay controles táctiles; las pruebas móviles comprueban distribución y visibilidad, sin conducción humana en un teléfono.

La fase 5 continúa: Champion Road, Dusty Mesa y Sunset ya tienen rediseños propios; quedan siete originales con estructuras similares por revisar, conservando conducción, CPU, cámara y barreras. El registro detallado está en la hoja de ruta.

## Hoja de ruta

La planificación vigente está en [`ROADMAP_24_FASES.md`](ROADMAP_24_FASES.md). Las hojas anteriores se mantienen como referencias históricas; no describen necesariamente el estado actual.


## Publicación

Los cambios se publican mediante Git usando el historial real de `gomeza2/f1`, conservando las revisiones previas. La app de GitHub y la CLI pueden tener capacidades diferentes: una lectura fallida por API no demuestra por sí sola que un push por Git esté bloqueado.

Para servir el juego con GitHub Pages, usá la rama/carpeta configurada en Settings → Pages y comprobá el despliegue. Subir código a una rama no implica que Pages ya haya terminado de actualizarse.
