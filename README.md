# PIXEL GRAND PRIX — 2D Track Racer

Juego arcade retro de carreras desde arriba: circuitos cerrados, frenado necesario, rivales, dos jugadores local, neumáticos de seguridad y campeonato.

## Cómo jugar
Abrí `index.html` en un navegador moderno. Para publicarlo online, activá GitHub Pages en Settings → Pages.

## Controles
- **Jugador 1:** W acelera, S frena, A/D gira, ESPACIO freno de mano, R reinicia y ESC pausa.
- **Jugador 2:** flechas para acelerar/frenar/girar, ENTER freno de mano.
- Podés elegir auto y color en el garaje antes de iniciar.
- Un jugador compite contra el rival CPU; dos jugadores corren en la misma pantalla.

## Versiones / fases desarrolladas
1–3. Menú, controles, física inicial y diez circuitos temáticos.
4–5. Renovación 2D, vueltas, minimapa, rival CPU, colisiones entre autos, cronómetro y mejores vueltas.
6–7. Sonidos de motor/choque y campeonato por puntos.
8. **Garaje:** cuatro autos con diferencias reales de velocidad, aceleración, frenado, giro y agarre; seis pinturas.
9. **Manejo y límites de pista:** asfalto más ancho, barreras de seguridad, neumáticos en el exterior de curvas, rebote al tocar el muro, pérdida fuerte de velocidad en el pasto y menor agarre al entrar pasado. No aparece un cartel de “BRAKE!”; la conducción depende de tus decisiones.
10. **Pulido:** renderizado estático del circuito cacheado para reducir trabajo por fotograma, opciones gráficas detalladas/retro/rendimiento, reinicio rápido, mejor vuelta y clasificación acumulada.

## Diseño de la conducción
Soltar el acelerador reduce velocidad, pero las curvas cerradas piden anticipación y freno. El pasto frena mucho. Las barreras evitan que salgas indefinidamente del circuito, pero chocarlas cuesta velocidad. El modo normal busca ser competitivo; fácil reduce la fuerza del rival y difícil la aumenta.

El juego está en desarrollo. Se realizaron comprobaciones de sintaxis y pruebas simuladas; todavía es importante probarlo visualmente en un navegador real y ajustar la física con la sensación de manejo.
