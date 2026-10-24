# PIXEL GRAND PRIX — Roadmap de 16 fases

## Dirección de diseño

PIXEL GRAND PRIX conserva su identidad arcade: colores lima y cian, señales tipo arcade, coches compactos y controles directos. La referencia de carreras 2D sirve para orientar el género y la variedad, no para copiar sus pistas, interfaces, coches ni recursos. Queremos combinar carreras desde arriba, curvas memorables, terrenos distintos y rivales agresivos con una identidad propia.

La referencia de género incluye más que circuitos de asfalto: *Ultimate Racing 2D* destaca por carreras desde arriba y variedad de modalidades como carretera, óvalos, tierra e hielo. Eso inspira a diversificar los trazados, pero los recorridos, nombres y estilo visual de este proyecto son originales. <https://store.steampowered.com/app/808080/Ultimate_Racing_2D/> <https://store.steampowered.com/app/1285230/Ultimate_Racing_2D_2/>

## Fase 1 — Salida, controles y récords
**Implementada en build 0.12.**

- Cuenta regresiva de tres segundos; el cronómetro comienza con la largada.
- Mejor vuelta por circuito guardada localmente.
- Indicadores de checkpoints y récord.
- Respuesta más marcada del freno de mano.

## Fase 2 — Pista más grande y pantalla completa
**Primera capa en build 0.13.**

- Escalar el trazado para aprovechar más el lienzo.
- En pantalla completa, priorizar la zona de carrera y reducir elementos secundarios.
- Redimensionar el canvas al cambiar la ventana.

## Fase 3 — Dos perfiles de barreras
**Primera capa en build 0.13.**

- Vallas en ambos lados de todo el circuito o una combinación de media pista vallada y curvas con neumáticos.
- Postes y bandas con contraste alto.
- Colisiones que dependen de si hay barrera en ese sector.
- Recuperación más amplia en zonas abiertas.

## Fase 4 — Señales de frenado y lectura de curvas
**Primera capa en build 0.14.**

- Carteles de frenado antes de curvas fuertes.
- Marcas de zonas de ataque en sectores con menos curvatura.
- HUD para recta, curva a izquierda/derecha y velocidad objetivo aproximada.
- Pendiente de validar posiciones y legibilidad durante carreras reales.

## Fase 5 — Más recorrido y circuitos realmente distintos
**Build 0.15: primera ampliación implementada.**

- Se amplía el repertorio de 10 a **12 circuitos**, con contador dinámico en la interfaz y cierre del campeonato en la última pista.
- Se suma **Coastline Run**, una ruta larga y fluida con cambios de ritmo, zonas anchas y una identidad costera.
- Se suma **Rally Canyon**, un trazado más técnico y sinuoso, con muchas transiciones y superficie de tierra.
- Se diferencian arte ambiental y material de pista entre costa y rally.
- Siguiente revisión: probar todas las vueltas, verificar que no existan cruces ambiguos y ajustar el ancho de cada tramo.

## Fase 6 — Terreno y superficies
**Primera capa en build 0.13; la pista de rally se amplía en build 0.15.**

- Hierba, tierra suelta, piedras y superficies más fáciles de distinguir.
- Polvo marrón o partículas verdes al salir de la pista.
- Diferentes penalizaciones de agarre y velocidad según el terreno.
- Próximo ajuste: unificar las reglas visuales y físicas de cada tipo de superficie.

## Fase 7 — Derrapes y marcas de neumáticos
**Primera capa en build 0.13.**

- Marcas temporales debajo de las ruedas al derrapar.
- Polvo o humo de corta duración.
- Límites de partículas y marcas para cuidar el rendimiento.
- Refinar agarre, contra-volante y recuperación de un derrape.

## Fase 8 — CPU picante y adelantamientos
**Primera capa en build 0.13.**

- Mejor anticipación de curvas y elección de línea.
- Intentos de buscar una trayectoria lateral cuando el jugador está cerca.
- Diferencias de comportamiento entre fácil, normal y difícil.
- Próximo ajuste: evitar contactos innecesarios y añadir recuperación tras errores.

## Fase 9 — Física, daños y choques
- Afinar aceleración, frenado, inercia y agarre de los cuatro coches.
- Reducir los rebotes exagerados y los autos atrapados en barreras.
- Hacer que tocar tierra sea un error recuperable, no una condena automática.
- Evaluar daños visuales sencillos sin volver injusta la carrera.

## Fase 10 — Mecánicas propias de los circuitos
- Añadir boosts, pavimento resbaladizo, obstáculos móviles y zonas técnicas.
- Dar aviso visible antes de cada peligro.
- No permitir que un obstáculo decida una carrera al azar.
- Mantener checkpoints secuenciales para que las vueltas sean válidas.

## Fase 11 — Arte de coches y escenografía
- Mejorar silueta, ruedas, cristales, luces, sombras y animaciones de los coches.
- Agregar pianos, carteles, banderas, gradas y objetos de ambiente con identidad propia.
- Mejorar el contraste entre asfalto, tierra, hierba y barreras.
- Mantener un modo retro y uno ligero para computadoras menos potentes.

## Fase 12 — HUD, cámara y comodidad
- Mejor jerarquía para velocidad, vueltas, checkpoints, récord, minimapa y derrape.
- Asegurar legibilidad en pantalla completa, portátil y móvil.
- Pulir pausa, reinicio y salida al menú.
- Opciones para reducir efectos visuales.

## Fase 13 — Audio y feedback
- Diferenciar motor, freno, derrape, choque, checkpoint, salida y meta.
- Hacer que el motor cambie de tono gradualmente con la velocidad.
- Equilibrar volúmenes y respetar el interruptor de sonido.
- Feedback visual breve para récords y resultados.

## Fase 14 — Campeonato y progreso persistente
- Estadísticas y victorias guardadas localmente.
- Contrarreloj, récords por coche y retos por circuito.
- Recompensas cosméticas que se obtienen jugando.
- Resultados claros sin interrumpir el acceso a una carrera rápida.

## Fase 15 — Editor de circuitos y variantes
- Diseñar un editor de trazados que permita crear y guardar circuitos personalizados.
- Previsualizar recorrido, anchura de pista, tipo de superficie y barreras antes de conducir.
- Validar circuitos para evitar cruces ambiguos, curvas imposibles o checkpoints inaccesibles.
- Separar las pistas originales de las pistas creadas por el jugador.

## Fase 16 — Balance final, pruebas y publicación
- Correr en los 12 circuitos con distintos coches y dificultades.
- Probar barreras completas y parciales, checkpoints, salidas, colisiones, pausa y modo de dos jugadores.
- Medir rendimiento en gráficos detallados, retro y ligero.
- Corregir problemas observados en el navegador y publicar una versión estable.

## Estado de validación

El JavaScript se revisa por sintaxis e integración de elementos. Eso no sustituye pruebas reales de conducción: antes de dar por terminada una fase hay que jugar vueltas completas, revisar colisiones y observar la legibilidad de la pista en pantalla completa.
