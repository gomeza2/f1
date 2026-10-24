# PIXEL GRAND PRIX — Hoja de ruta de 24 fases

## Objetivo de diseño

Crear un arcade de carreras 2D con circuitos originales, recorridos más variados y largos, física expresiva, una CPU competitiva pero justa, distintos terrenos y una interfaz que no tape la pista. La referencia general es el género de carreras desde arriba; el arte, los trazados y la personalidad del juego deben seguir siendo propios.

## Estado real de la versión

La interfaz identifica la build como 0.16. El código registra **14 circuitos**, tiene modos de un jugador y dos jugadores local, perfiles de barreras, una primera capa de superficies, derrapes, checkpoints, récords locales, telemetría exterior y reglas de ataque/defensa para CPU.

**Importante:** “Implementado” significa presente en el código; no implica que se haya comprobado visualmente una carrera en navegador. Las fases que afectan la sensación de manejo siguen necesitando pruebas de juego reales.

### Fase 1 — Auditoría y estabilidad
**En curso continuo.**

- Revisar el código actual antes de cada cambio.
- Conservar las funciones que ya están presentes.
- Mantener comprobaciones de sintaxis, identificadores HTML y referencias entre archivos.
- Corregir regresiones sin rehacer innecesariamente el proyecto.

### Fase 2 — Pantalla completa y espacio de conducción
**Primera capa implementada; probar en navegador.**

- El lienzo utiliza una relación de aspecto fija.
- El botón de pantalla completa ajusta el contenedor principal.
- La telemetría principal se trasladó fuera del lienzo.
- Pendiente: observar el tamaño real del circuito y la altura útil en distintas pantallas.

### Fase 3 — Barreras por circuito
**Primera capa implementada; pendiente de pruebas de colisión.**

- Perfil automático según la pista.
- Vallas completas, media pista con neumáticos, barreras en curvas y configuración abierta.
- Las colisiones consultan los tramos de barrera configurados.
- Comprobar que no aparezcan huecos o colisiones invisibles en las transiciones.

### Fase 4 — Señales de curva y zonas de adelantamiento
**Primera capa implementada.**

- Carteles 100/50 antes de curvas seleccionadas.
- Zonas marcadas para intentar adelantar.
- Indicador de curva siguiente y velocidad objetivo.
- Ajustar legibilidad y posiciones tras probar una vuelta completa.

### Fase 5 — Geometría y longitud de las pistas
**14 circuitos registrados; calidad del recorrido pendiente de juego real.**

- Diez circuitos iniciales conservados.
- Coastline Run y Rally Canyon tienen trazados más largos.
- Meadow Run e Industrial Mix incorporan otras formas y ambientes.
- La inspección geométrica automática de esta revisión no detectó cruces de línea central en los circuitos muestreados.
- Pendiente: revisar anchura de pista, dificultad, sectores repetitivos y posibles atajos explotables.

### Fase 6 — Superficies mixtas
**Primera capa implementada y corregida en build 0.16.**

- Superficies de asfalto, tierra, pasto, hielo y volcánico.
- Los sectores de tierra de circuitos mixtos aplican una adherencia específica.
- El HUD cambia la etiqueta según el sector.
- El minimapa indica los segmentos visuales de tierra.
- Pendiente: probar el agarre y la salida de pista jugando.

### Fase 7 — Derrape y respuesta física
**Primera capa implementada; calibración pendiente.**

- Marcas de neumáticos y partículas temporales.
- El freno de mano modifica la respuesta de giro.
- La pérdida de agarre depende del exceso de velocidad y del derrape.
- Pendiente: evitar tanto el giro instantáneo como el derrape irrecuperable.

### Fase 8 — Trazada ideal de CPU
**Primera capa implementada.**

- Anticipación de curvas y velocidad objetivo.
- Corrección de trayectoria cuando el rival se aleja del centro de la pista.
- Pendiente: medir tiempos por vuelta y comprobar todos los circuitos y perfiles de dificultad.

### Fase 9 — Adelantamientos y defensa
**Primera capa implementada; requiere ajuste.**

- Intención de buscar una línea lateral cuando hay un rival cerca.
- Intención de defender una posición.
- La revisión eliminó el ajuste circular incorrecto de la distancia de carrera cuando esta ya incluye vueltas.
- Pendiente: probar situaciones de doblaje, contacto y coches muy próximos a la meta.

### Fase 10 — Dificultades y personalidades de CPU
**Pendiente.**

- Diferenciar mejor fácil, normal y difícil mediante toma de decisiones, no solo velocidad.
- Añadir perfiles defensivo, agresivo, consistente y especialista en rectas.
- Evitar ventajas invisibles, choques injustos y teletransporte de recuperación.

### Fase 11 — Choques y recuperación
**Primera capa implementada; pendiente de pruebas.**

- Colisiones entre vehículos.
- Rebote y penalización de velocidad en vallas.
- Recuperación automática en zonas abiertas.
- Mejorar separación de coches y control después de impactos.

### Fase 12 — Escenarios y objetos ambientales
**Primera capa implementada.**

- Decoraciones temáticas generadas según el circuito.
- Elementos costeros, rocas, vegetación y estructuras.
- Mejorar sombras, escalas, variedad y colocación sin obstruir la pista.

### Fase 13 — Efectos de terreno
**Primera capa implementada y revisada.**

- Partículas de derrape y salida de pista.
- Marcas de neumáticos limitadas para mantener el rendimiento.
- Textura volcánica con piedras oscuras y destellos de calor.
- Pendiente: validar densidad, colores y rendimiento en máquinas lentas.

### Fase 14 — Coches y animación
**Base implementada; mejora visual pendiente.**

- Modelos seleccionables y seis pinturas.
- Sprites sencillos de carrocería, ruedas, ventanas y luces.
- Mejorar siluetas, animación, diferencias entre modelos y lectura en movimiento.

### Fase 15 — Audio
**Primera capa implementada.**

- Sonido de motor, cuenta regresiva y choques.
- Interruptor de sonido.
- Pendiente: probar en distintos navegadores y equilibrar volumen, variedad y latencia.

### Fase 16 — HUD y minimapa
**Primera capa implementada en build 0.16.**

- Velocidad, velocidad objetivo, sector siguiente, checkpoints, mejor vuelta y terreno.
- Minimap independiente del área de conducción.
- Pendiente: comprobar la distribución responsive y el modo de pantalla completa.

### Fase 17 — Modos de carrera
**Base implementada; expansión pendiente.**

- Carrera contra CPU.
- Dos jugadores en el mismo dispositivo.
- Campeonato por puntos.
- Añadir contrarreloj, carreras personalizadas y retos de circuito.

### Fase 18 — Progreso persistente
**Récords locales implementados; expansión pendiente.**

- Mejor vuelta por pista guardada en el navegador.
- Extender estadísticas, victorias, tiempos por coche y objetivos.
- Añadir controles claros para exportar, borrar o reiniciar el progreso, si se incorpora esa función.

### Fase 19 — Mecánicas especiales
**Pendiente.**

- Boosts limitados, obstáculos móviles y zonas de baja adherencia.
- Señales previas y reglas que se puedan aprender.
- Evitar que una mecánica aleatoria decida la carrera.

### Fase 20 — Editor de circuitos
**Pendiente.**

- Editor para diseñar puntos, anchura, terreno y barreras.
- Previsualización inmediata.
- Guardado local de pistas y validación antes de jugar.

### Fase 21 — Validación de circuitos
**Pruebas geométricas parciales realizadas manualmente; herramienta persistente pendiente.**

- Convertir la comprobación de cruces en una prueba reproducible.
- Detectar segmentos cercanos, curvas agudas, anchuras insuficientes y checkpoints mal ubicados.
- Validar que cada barrera tenga colisión correspondiente.

### Fase 22 — Rendimiento y accesibilidad
**Primera capa implementada; pendiente de medir.**

- Caché del fondo y del asfalto.
- Modos detallado, retro y rendimiento.
- Mantener la carga de partículas acotada.
- Añadir controles y ajustes útiles para distintas pantallas y preferencias visuales.

### Fase 23 — Balance y pruebas completas
**Pendiente de validación en navegador.**

- Completar carreras en cada pista y dificultad.
- Probar perfiles de barreras y coches.
- Verificar salida, checkpoints, meta, récords, pausa y reinicio.
- Corregir errores de conducción y CPU basados en resultados reales.

### Fase 24 — Pulido y publicación
**Pendiente.**

- Limpiar código duplicado y nombres inconsistentes.
- Actualizar README y documentación.
- Comprobar que la versión de GitHub Pages carga todos los archivos.
- Declarar una versión estable solo después de las pruebas completas.

## Registro de auditoría — build 0.16

- JavaScript: comprobación de sintaxis superada.
- Integración de interfaz: no se encontraron referencias de JavaScript a IDs inexistentes en el HTML en la inspección estática.
- Circuitos: 14 registros.
- Geometría: el muestreo de segmentos no detectó intersecciones de línea central en los 14 circuitos.
- Superficies: arreglada la selección de agarre por sector en pistas mixtas.
- CPU: corregida la comparación circular de la distancia de carrera que podía confundir coches separados por una vuelta.
- HUD: los indicadores se dibujan fuera del lienzo principal.

Esta lista es una comprobación estática. No afirma que el juego haya sido probado en un navegador ni que todas las colisiones y decisiones de CPU estén perfectamente equilibradas.
