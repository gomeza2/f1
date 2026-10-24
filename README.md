# PIXEL GRAND PRIX

Juego web arcade de carreras 2D desde arriba, con identidad retro propia, circuitos de formas variadas, rivales controlados por CPU, derrapes, superficies y campeonato.

## Cómo ejecutar

Abrí `index.html` en un navegador moderno. No necesita servidor ni instalación de dependencias para su versión básica.

Para publicarlo, podés habilitar GitHub Pages desde **Settings → Pages** y usar la rama y carpeta en la que estén los archivos principales.

## Controles

- **Jugador 1:** W acelera, S frena, A/D gira, ESPACIO freno de mano.
- **Jugador 2:** flechas para acelerar, frenar y girar; ENTER freno de mano.
- **R:** reinicia la carrera actual.
- **C / botón VISTA:** alterna vista cercana y circuito completo en modo individual. Dos jugadores usa pantalla dividida, con una cámara y contador de vuelta por jugador.
- **ESC:** pausa o reanuda la carrera. Si estás en pantalla completa, también permite salir.
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

El objetivo es una vuelta de aproximadamente **25–45 segundos**. La referencia automática con Balanced y CPU Normal, sin tráfico, da **28,9–44,1 s** de media por vuelta según la pista. El tiempo humano depende del coche, la dificultad y la conducción; no se fuerza con límites de velocidad ni esperas artificiales.

El perfil automático deja **siete pistas abiertas, cuatro con protección en curvas cerradas y tres con vallas parciales**. Sunset Circuit arranca sin muros. Podés seguir eligiendo vallas completas o cualquier otro perfil en el menú.

Las superficies incluyen asfalto, tierra, pasto, hielo, volcánico y secciones mixtas. En las pistas mixtas, el agarre, el minimapa y los indicadores de terreno cambian según el sector. Cada pista tiene entre cinco y siete checkpoints secuenciales según su longitud, para evitar recortes grandes entre sectores. Los récords se separan por versión del recorrido: se conservan los anteriores, pero no compiten con los tiempos de los trazados nuevos.

## Funcionalidades actuales

- Carrera para un jugador contra CPU y modo local de dos jugadores.
- Campeonato por carreras.
- Cuenta regresiva, cronómetro, vueltas, checkpoints y resultados.
- Récords de mejor vuelta guardados en `localStorage`.
- Barreras, neumáticos, señales de frenado y sectores de adelantamiento.
- CPU con frenado anticipado por curvatura y terreno, tres dificultades y física principal compartida con el Balanced del jugador.
- Adelantamientos persistentes, una línea defensiva por aproximación, espacio durante el solapamiento y reconocimiento físico de doblados.
- Derrapes, marcas de neumáticos, partículas de terreno y efectos básicos de sonido.
- HUD separado del lienzo de conducción, con velocidad, sector siguiente, checkpoints, mejor vuelta, terreno y minimapa.
- Opciones de gráficos detallados, retro y rendimiento.
- Vista cercana por defecto, minimapa visible en pantallas pequeñas y distribución compacta en pantalla completa horizontal.

## Comprobaciones

Con Node.js, desde la raíz y sin dependencias adicionales:

```sh
node --check script.js
node tests/validate-tracks.mjs
node tests/validate-track-identity.mjs
node tests/validate-integration.mjs
node tests/validate-cpu.mjs
node tests/validate-traffic.mjs
node tests/validate-driving.mjs
node tests/validate-barriers.mjs
```

La prueba de identidad detecta copias de un trazado aunque se escalen, giren o reflejen, y comprueba que Dusty Mesa se diferencia de las otras 13 pistas. Esto no evalúa la diversión ni sustituye jugar.

La prueba de CPU también verifica el objetivo de 25–45 s en Normal y usa el código real en un entorno DOM simulado: completa tres vueltas con checkpoints en las 14 pistas y las tres dificultades, verifica prestaciones compartidas y prueba frenado ante tráfico y recuperación. No sustituye una carrera humana.

Prueba opcional de navegador: `node tests/browser-smoke.cjs`. Requiere Playwright y Chromium instalados en el entorno de desarrollo; `CHROMIUM_PATH` permite indicar el ejecutable. Inicia un servidor temporal en localhost y bloquea Google Fonts. No agrega dependencias al juego.

## Conducción — build 0.23

La aceleración del Balanced pasa de 76 a 110, el frenado de 192 a 230 y la escala real de movimiento de 0,62 a 0,84. Los otros tres modelos se ajustan en la misma dirección y conservan sus diferencias. A igual velocidad indicada, el coche recorre un 35,5 % más de distancia. La pérdida de agarre por exceso de velocidad es progresiva y conserva dirección; frenar sigue permitiendo cerrar mejor una curva. ESPACIO reduce velocidad aunque se mantenga W y ayuda a rotar el coche. La recuperación del derrape usa tiempo real, evitando cambios según los FPS.

Los circuitos ahora tienen dimensiones de mundo independientes del lienzo. La cámara cercana conserva coches legibles y anticipa el camino; C o VISTA muestra el circuito completo. Dos jugadores usa dos cámaras independientes para evitar que los coches se vuelvan diminutos en un mapa grande. El minimapa muestra ambas posiciones y las ventanas de cámara.

## CPU

El rival usa acelerador y freno con las mismas prestaciones del modelo Balanced, incluida la escala de desplazamiento. No recibe aumentos ocultos de agarre, velocidad ni aceleración. La dificultad cambia ritmo, margen de frenado, respuesta y cambio de línea. La velocidad de curva se calcula con el agarre real del sector, incluido hielo y tierra en circuitos mixtos.

La CPU mantiene el lado elegido durante el ataque, limita el tiempo de un intento y no copia cada cambio lateral del rival al defender. Al quedar a la par, la separación física tiene prioridad sobre la defensa. Un doblado sigue siendo un obstáculo; ante un coche más rápido con una vuelta de ventaja, la CPU cede espacio. En tráfico bloqueado usa su frenado normal y puede rodear un coche detenido a baja velocidad si la trayectoria deja margen de contacto.

## Estructura

- `index.html`: menú, opciones, interfaz de carrera y telemetría.
- `style.css`: diseño adaptable, modo de pantalla completa y estilos de la interfaz.
- `script.js`: circuitos, conducción, CPU, superficies, colisiones, checkpoints, renderizado y audio.
- `ROADMAP_24_FASES.md`: estado y prioridades del desarrollo.
- `tests/`: validación de geometría, ancho completo, integración, conducción, récords, barreras y CPU; prueba opcional de Chromium.

## Validación conocida

La build 0.23 supera las comprobaciones de sintaxis, geometría, integración y 42 carreras simuladas de CPU (126 vueltas). La prueba `validate-traffic.mjs` comprueba decisiones de ataque/defensa/doblaje y carreras de dos controladores en las 14 pistas. Chromium comprobó controles de teclado, pausa, reinicio, menú, carga de pistas, pantalla completa, HUD, resultados y modo local. La carrera de CPU en hielo se ejecutó acelerando la física desde la prueba, sin conducción humana. `validate-driving.mjs` verifica aceleración de los cuatro modelos, radio de giro, dirección a alta velocidad, freno de mano, agarres y cámara dentro de los límites de las 14 pistas.

Las barreras de 0.21 siguen contornos cerrados del ancho de pista, sin los pliegues de las curvas interiores. Los segmentos usados para dibujarlas también resuelven los impactos del coche; los neumáticos tienen colisión en los círculos visibles y se descartan pilas que invadan otro ramal. La prueba de barreras comprueba 37 contornos, 11174 puntos y los cinco perfiles en las 14 pistas, además de impactos, coche detenido y rebote moderado.

Pendientes: balance contra personas, tráfico humano impredecible, nuevos perfiles personalizados, audio, rendimiento medido y conducción móvil. El minimapa ya permanece visible en pantallas pequeñas. Todavía no hay controles táctiles; las pruebas móviles comprueban distribución y visibilidad, sin conducción humana en un teléfono.

La fase 5 continúa: Champion Road y Dusty Mesa ya tienen geometría propia; quedan ocho originales con estructuras similares por revisar, conservando conducción, CPU, cámara y barreras. El registro detallado está en la hoja de ruta.

## Hoja de ruta

La planificación vigente está en [`ROADMAP_24_FASES.md`](ROADMAP_24_FASES.md). Las hojas anteriores se mantienen como referencias históricas; no describen necesariamente el estado actual.


## Publicación

Los cambios se publican mediante Git usando el historial real de `gomeza2/f1`, conservando las revisiones previas. La app de GitHub y la CLI pueden tener capacidades diferentes: una lectura fallida por API no demuestra por sí sola que un push por Git esté bloqueado.

Para servir el juego con GitHub Pages, usá la rama/carpeta configurada en Settings → Pages y comprobá el despliegue. Subir código a una rama no implica que Pages ya haya terminado de actualizarse.
