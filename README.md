# PIXEL GRAND PRIX

Juego web arcade de carreras 2D desde arriba, con identidad retro propia, circuitos de formas variadas, rivales controlados por CPU, derrapes, superficies y campeonato.

## Cómo ejecutar

Abrí `index.html` en un navegador moderno. No necesita servidor ni instalación de dependencias para su versión básica.

Para publicarlo, podés habilitar GitHub Pages desde **Settings → Pages** y usar la rama y carpeta en la que estén los archivos principales.

## Controles

- **Jugador 1:** W acelera, S frena, A/D gira, ESPACIO freno de mano.
- **Jugador 2:** flechas para acelerar, frenar y girar; ENTER freno de mano.
- **R:** reinicia la carrera actual.
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

El registro actual contiene 14 circuitos: diez pistas originales y cuatro incorporaciones de trazado largo: Coastline Run, Rally Canyon, Meadow Run e Industrial Mix.

Las superficies incluyen asfalto, tierra, pasto, hielo, volcánico y secciones mixtas. En las pistas mixtas, el agarre, el minimapa y los indicadores de terreno cambian según el sector. Las pistas tienen checkpoints secuenciales; cortar camino no debería contar como una vuelta válida.

## Funcionalidades actuales

- Carrera para un jugador contra CPU y modo local de dos jugadores.
- Campeonato por carreras.
- Cuenta regresiva, cronómetro, vueltas, checkpoints y resultados.
- Récords de mejor vuelta guardados en `localStorage`.
- Barreras, neumáticos, señales de frenado y sectores de adelantamiento.
- CPU con anticipación de curvas y primeras reglas de defensa y búsqueda de línea.
- Derrapes, marcas de neumáticos, partículas de terreno y efectos básicos de sonido.
- HUD separado del lienzo de conducción, con velocidad, sector siguiente, checkpoints, mejor vuelta, terreno y minimapa.
- Opciones de gráficos detallados, retro y rendimiento.

## Validación geométrica (opcional)

Con Node.js instalado, ejecutá `node tests/validate-tracks.mjs` desde la carpeta raíz. No necesita dependencias adicionales. El test lee las definiciones reales de los circuitos y comprueba nombres únicos, perfiles de superficie/barreras, muestras finitas, límites del lienzo y cruces de las líneas centrales.

## Estructura

- `index.html`: menú, opciones, interfaz de carrera y telemetría.
- `style.css`: diseño adaptable, modo de pantalla completa y estilos de la interfaz.
- `script.js`: circuitos, conducción, CPU, superficies, colisiones, checkpoints, renderizado y audio.
- `ROADMAP_24_FASES.md`: estado y prioridades del desarrollo.
- `tests/validate-tracks.mjs`: comprobación geométrica reproducible de los circuitos (requiere Node.js solo para ejecutar la prueba).

## Validación conocida

Se revisaron la sintaxis de JavaScript, la correspondencia de los identificadores de interfaz, el número de circuitos y la geometría aproximada de los trazados con muestreo de segmentos. La revisión también corrigió el agarre por sector de los circuitos mixtos, los efectos de partículas por terreno, la textura volcánica y el cálculo de distancia de la CPU cuando hay vueltas acumuladas. Estas comprobaciones automáticas no sustituyen jugar carreras completas en un navegador.

Antes de considerar estable una versión, probá los 14 circuitos, cada perfil de barreras, las vueltas y checkpoints, el modo para dos jugadores, la pausa, el reinicio y el comportamiento de la CPU en rectas, curvas y superficies mixtas.

## Hoja de ruta

La planificación vigente está en [`ROADMAP_24_FASES.md`](ROADMAP_24_FASES.md). Las hojas anteriores se mantienen como referencias históricas; no describen necesariamente el estado actual.
