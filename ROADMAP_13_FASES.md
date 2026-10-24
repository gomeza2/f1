# PIXEL GRAND PRIX — Roadmap de 13 fases

## Objetivo

Llevar el arcade retro existente a una versión más grande, competitiva y con más personalidad, sin perder sus diez circuitos, el modo local para dos jugadores, sus coches ni el campeonato. Las pistas mantienen la vista desde arriba, pero aprovechan mejor la pantalla con una lectura clara del asfalto, el pasto y los límites.

## Reglas de desarrollo

- Cada fase se construye encima de la anterior y mantiene el juego jugable.
- No dar por verificada una mejora solo porque compile: conducir y mirar las colisiones en un navegador real sigue siendo obligatorio.
- La dificultad debe depender de la habilidad, no de trampas invisibles de la CPU.
- Los efectos se limitan y se limpian para cuidar el rendimiento.

## Fase 1 — Salida, controles y récords
**Implementada en build 0.12.**

- Cuenta regresiva de tres segundos.
- Cronómetro que empieza con la salida.
- Récord personal por circuito guardado en el navegador.
- HUD con progreso de checkpoints y mejor vuelta.
- Respuesta de giro mejorada al usar el freno de mano.

## Fase 2 — Pista más grande y pantalla completa
**Implementada inicialmente en build 0.13; falta probar la sensación visual manualmente.**

- Escalar las trazadas para que ocupen mejor el lienzo.
- En pantalla completa, dar prioridad al área de carrera y esconder elementos secundarios que quitan altura.
- Redimensionar el canvas y sus cachés al cambiar el tamaño de ventana.
- Ajustar el diseño para escritorio y móvil.

## Fase 3 — Dos perfiles de barreras
**Implementada inicialmente en build 0.13.**

- Selector entre vallas metálicas en ambos lados durante toda la pista y una variante mixta con vallas en la primera mitad y neumáticos en curvas seleccionadas de la segunda.
- Dibujar las vallas con estructura, postes y bandas de alta visibilidad.
- Hacer coincidir el límite físico de choque con los tramos donde la barrera es visible.
- Dejar más espacio de recuperación en el tramo sin vallas, sin permitir escapar indefinidamente del circuito.

## Fase 4 — Pistas y escenarios con identidad
**Primera capa implementada en build 0.14; falta probar su legibilidad visual en el navegador.**
- Carteles de frenado "100" y "50" situados antes de curvas pronunciadas.
- Marcas verdes de zona de adelantamiento en rectas con baja curvatura.
- HUD con aviso de curva izquierda/derecha o recta, distancia aproximada y orientación de frenado.
- Diferenciar mejor los diez circuitos con personalidad ambiental; la siguiente pasada debe revisar trazados, señales y posiciones para evitar repeticiones o solapamientos.
- Validar que los carteles no distraigan ni oculten límites, checkpoints o coches.

## Fase 5 — Tierra, pasto y superficie
**Primera capa implementada en build 0.13.**

- Añadir textura procedural al terreno: hierba, pequeñas piedras y tierra suelta.
- Mostrar polvo marrón o partículas verdes al salir del asfalto según el escenario.
- Diferenciar visual y físicamente asfalto, pianos, tierra y pasto.
- Pulir la penalización de velocidad según la superficie y el coche elegido.

## Fase 6 — Derrapes y marcas de neumáticos
**Primera capa implementada en build 0.13.**

- Crear marcas temporales debajo de las ruedas traseras al derrapar o usar el freno de mano a velocidad.
- Generar humo/polvo cerca del coche sin tapar el circuito.
- Limitar la cantidad de marcas y partículas para evitar degradación de rendimiento.
- Afinar el balance entre controlar un derrape, recuperar agarre y perder velocidad.

## Fase 7 — CPU más picante y adelantamientos
**Primera capa implementada en build 0.13.**

- Mejorar la anticipación de curvas y la velocidad objetivo del rival.
- Añadir una línea lateral de ataque cuando el jugador está cerca.
- Subir la agresividad de normal y difícil, manteniendo un modo fácil más accesible.
- Siguiente mejora: evitar contactos excesivos y diseñar maniobras de defensa y recuperación tras errores.

## Fase 8 — Física, choques y recuperación
- Afinar aceleración, frenado, inercia y agarre de los cuatro coches.
- Mejorar los rebotes contra barreras y reducir los choques que dejan un auto trabado.
- Hacer que tocar tierra sea una consecuencia controlable, no una sentencia automática.
- Balancear los coches de velocidad, agarre y rally con ventajas y desventajas reales.

## Fase 9 — Mecánicas especiales de circuito
- Añadir boosts, zonas resbaladizas y obstáculos móviles en puntos concretos.
- Marcar peligros de manera visible antes de llegar a ellos.
- Evitar que los obstáculos decidan una carrera al azar.
- Mantener los checkpoints en orden y evitar atajos que rompan las vueltas.

## Fase 10 — Arte de coches y detalles de pista
- Mejorar la silueta de los coches, cristales, luces, ruedas y sombras.
- Añadir pianos, pintura vial, señales, banderas, público y objetos de escenario.
- Dar feedback visual breve en impactos, nuevos récords y paso por meta.
- Mantener un modo retro y otro de rendimiento para computadoras menos potentes.

## Fase 11 — HUD y comodidad de manejo
- Ordenar velocímetro, vueltas, checkpoints, récord, minimapa y estado del derrape.
- Hacer que las señales sean legibles en pantallas anchas, portátiles y móviles.
- Afinar pantalla completa, pausa, reinicio y regreso al menú.
- Añadir opciones para reducir efectos y mejorar accesibilidad.

## Fase 12 — Sonido, campeonato y progreso
- Mejorar sonido del motor, frenado, derrape, choques y salida.
- Guardar estadísticas, victorias y mejores vueltas con persistencia local.
- Incorporar contrarreloj y desafíos breves, sin interrumpir el acceso a una carrera.
- Hacer que las recompensas sean claras y cosméticas.

## Fase 13 — Balance, pruebas y publicación
- Completar carreras en las diez pistas con cada coche y dificultad.
- Probar los dos perfiles de barreras, los checkpoints, la pausa, los reinicios y el modo de dos jugadores.
- Revisar rendimiento con detalles altos, retro y modo ligero.
- Corregir errores observados en navegador y actualizar las instrucciones de publicación en GitHub Pages.

## Estado actual

Los commits de build 0.13 añaden la base para trazadas más grandes, dos perfiles de barreras, colisiones alineadas con los tramos de vallas, un rival más rápido que busca una línea lateral al acercarse, textura de terreno y efectos de derrape. Estos cambios están en etapa de comprobación manual; no se debe confundir la revisión de sintaxis con una prueba completa de jugabilidad.
