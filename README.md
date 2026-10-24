# PIXEL GRAND PRIX — 2D Track Racer

Juego arcade retro de carreras desde arriba, con circuitos cerrados, frenado exigente, rivales, dos jugadores local, barreras y campeonato.

## Cómo jugar
Abrí `index.html` en un navegador moderno. Para publicarlo online, activá GitHub Pages en Settings → Pages.

## Controles
- **Jugador 1:** W acelera, S frena, A/D gira, ESPACIO freno de mano, R reinicia y ESC pausa.
- **Jugador 2:** flechas para acelerar/frenar/girar, ENTER freno de mano.
- Botón **Pantalla completa** para ocupar la pantalla; usalo otra vez o pulsá ESC para salir.
- Podés elegir auto, color, gráficos, dificultad, circuito y perfil de barreras antes de iniciar.
- **Vallas completas:** protección en ambos lados de todo el trazado. **Mitad vallas + neumáticos:** vallas en la primera mitad y curvas protegidas con neumáticos en la segunda.
- Al derrapar aparecen marcas de neumáticos; al salir al terreno se generan partículas de polvo o pasto según el escenario.

## Fases desarrolladas
1–3. Menú, controles, física inicial y diez circuitos temáticos.
4–5. Renovación 2D, vueltas, minimapa, rival CPU, colisiones entre autos, cronómetro y mejores vueltas.
6–7. Sonidos de motor/choque y campeonato por puntos.
8. Garaje con cuatro autos y seis pinturas.
9. Asfalto más ancho, barreras exteriores, neumáticos en curvas, rebote al tocar el muro y penalización fuerte del pasto.
10. Renderizado estático cacheado para mejorar rendimiento, opciones gráficas y equilibrio de dificultad.
11. **Checkpoints, pista más estrecha y pantalla completa.** Tres checkpoints secuenciales por vuelta. Cada uno se valida al cruzar físicamente su línea en la dirección correcta; una vuelta solo cuenta al cruzar la meta después de pasar los tres en orden. Cortar camino o cruzar al revés no cuenta. Barreras de neumáticos solo en curvas más exigentes; otros sectores quedan despejados para permitir distintas trazadas. Se ajustó el ancho visual del asfalto a los límites físicos.

## Diseño de la conducción
Soltar el acelerador reduce velocidad, pero las curvas cerradas piden anticipación y freno. El pasto frena mucho. Las barreras evitan que salgas indefinidamente del circuito, pero chocarlas cuesta velocidad. El modo normal busca ser competitivo; fácil reduce la fuerza del rival y difícil la aumenta.

## Hoja de ruta de mejoras

El desarrollo está organizado en veinte fases documentadas en [`ROADMAP_20_FASES.md`](ROADMAP_20_FASES.md). La build 0.15 sumó los circuitos Coastline Run y Rally Canyon; la build 0.16 amplía el juego a 14 circuitos, agrega Meadow Run e Industrial Mix, asigna superficies y perfiles de barreras según cada pista y mueve la telemetría y el minimapa fuera del lienzo. La CPU también busca huecos, defiende su línea y mejora su recuperación. Los récords personales se guardan localmente en el navegador.

La sintaxis se revisa durante los cambios; la sensación de manejo, las colisiones y la composición en pantalla completa deben verificarse manualmente en un navegador real. El juego continúa usando Canvas 2D y conserva los sistemas de carrera existentes.
