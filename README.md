# PIXEL GRAND PRIX — 2D Track Racer

Juego arcade retro de carreras desde arriba, con circuitos cerrados, frenado exigente, rivales, dos jugadores local, barreras y campeonato.

## Cómo jugar
Abrí `index.html` en un navegador moderno. Para publicarlo online, activá GitHub Pages en Settings → Pages.

## Controles
- **Jugador 1:** W acelera, S frena, A/D gira, ESPACIO freno de mano, R reinicia y ESC pausa.
- **Jugador 2:** flechas para acelerar/frenar/girar, ENTER freno de mano.
- Botón **Pantalla completa** para ocupar la pantalla; usalo otra vez o pulsá ESC para salir.
- Podés elegir auto, color, gráficos y dificultad antes de iniciar.

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

El desarrollo continuará en diez fases incrementales documentadas en [`ROADMAP_10_FASES.md`](ROADMAP_10_FASES.md). La fase 1 agrega una cuenta regresiva, récord personal por circuito guardado en el navegador, indicador de checkpoints y una respuesta más rápida del freno de mano. El registro se guarda localmente en este dispositivo y navegador; no necesita cuentas ni servidor.

La sintaxis debe revisarse y la sensación de manejo debe validarse en un navegador real después de cada fase. El código actual conserva el enfoque Canvas 2D y los sistemas de carrera existentes.
