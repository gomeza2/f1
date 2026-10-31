# Catálogo 0.70 — fase 38 y continuidad online/3D

Base auditada: main `6dec7162d3bd08dd098d89ac775942167191e010` / 0.69, publicado y verificado antes de continuar. Rama `work/catalogue-070`. Se revisan paddock, garaje, selección, previews, estilos, funciones de carrera, pruebas y estado real de fases online.

## Integrado

Botón EXPLORAR COCHES Y CIRCUITOS, diálogo nativo y dos secciones conectadas a los selectores existentes. No hay una segunda configuración de carrera ni una lista de opciones aparentes.

- Cuatro siluetas de coches originales, seis pinturas y velocidad máxima real. Giro/frenada/agarre desde `CAR_MODELS`, respecto a Balanced (100 %), coherentes con el agarre del garaje; no cifras de rendimiento inventadas. Elección de coche/pintura P1; P2–P4 conservan su parrilla individual.
- Catorce fichas de circuito con trazado, color por superficie, recorrido corto/medio/largo, checkpoints, ancho fijo/variable y configuración predeterminada de barreras. No se presentan tiempos humanos estimados como mediciones.
- Búsqueda por nombre/superficie, sin distinguir mayúsculas ni tildes; resultado vacío explícito. Pistas conservan su orden de registro.
- Estado seleccionado, resumen vivo, selección retenida al cerrar/reabrir, navegación por teclado con ciclo de foco contenido y retorno al botón. Cabecera/cierre persistentes al desplazar, fichas adaptadas a escritorio/tablet/móvil.
- Miniaturas generadas con geometría/materiales reales y almacenadas una vez por pista en WeakMap. Solo se generan al abrir su sección; no hay animación nueva, imágenes ajenas ni trabajo de catálogo por fotograma de carrera. No se promete FPS en un dispositivo por esto.

Física, CPU, fuerza/velocidad, pistas, superficies, audio, controles y récords de 0.69 permanecen. Quitar únicamente las funciones y handlers del catálogo reconstruye el `script.js` auténtico de 0.69 byte a byte. La selección en menú no modifica los coches/posiciones de la carrera anterior.

## Verificación

- Sintaxis de script/prueba y diff sin errores.
- `validate-integration`: IDs/archivos/versiones, diez circuitos originales, 70 configuraciones de barreras y checkpoints.
- `validate-menu`: 14 previews, 24 combinaciones de modelo/pintura, selección de pista/barreras/dificultad y pureza del estado activo.
- `browser-catalogue`: Chromium a 1440×1000, 1366×768, 768×1024, 390×844 y 2560×1080. Cuatro fichas/12 medidores/seis pinturas, selección Speed/cian, datos de agarre Balanced 100/Corner 115, catorce mapas cacheados, filtros hielo/volcanico, resultado vacío, ARIA, Tab/Escape/cierre/foco, reabrir, ausencia de desbordamiento horizontal y cero errores JS.
- Carrera real desde el catálogo: Coastline/Speed/cian y rival elegido; cuenta regresiva de producción, teclado, movimiento, pausa y menú. Se verifica que cambiar luego a Rally en el catálogo no modifica el modelo/color/posición de los coches que quedaron de esa carrera. Esto no es una carrera humana completa.
- `browser-paddock`: inicio rápido y coche en primera ventana de escritorio, cinco tamaños, foco, local desplegable/ARIA/valores retenidos y comienzo por teclado.
- `browser-release`: archivos reales bajo `/f1/`, caché anterior precargada, CSS/JS 0.70 coherentes, selección/cuenta regresiva/teclado/pausa/reinicio/menú sin errores JS. No acredita el despliegue público de Pages.
- Capturas de coches y circuitos revisadas en escritorio y móvil. Se corrige el ciclo de Tab al detectar un salto fuera del contenido y se mantiene el encabezado legible al desplazar. No se amplían tolerancias de las pruebas para ocultarlo.

```sh
node tests/browser-catalogue.cjs
node tests/validate-menu.mjs
node tests/browser-paddock.cjs
node tests/browser-release.cjs
```

`CATALOGUE_SCREENSHOTS` exporta capturas. Playwright/Chromium son herramientas del entorno; no son dependencias del juego.

## Lo que sigue

El usuario pide seguir conducción/CPU, motor gráfico, audio, pistas y profundidad del catálogo, y avanzar a online real. Se amplía el plan con 37 (vista 3D inclinada opcional, después) y 38 (catálogo/presentación, parcial). No existen aún 3D, servidor ni salas online y no se añaden selectores vacíos.

`ONLINE_DESIGN.md` concreta el primer online privado de 2–4, autoridad, inputs/snapshots, estado por sala, reconexión, seguridad básica, pruebas de latencia y selección de alojamiento con costes medidos. Próximo trabajo: núcleo compartido sin DOM, paridad con el juego y aislamiento de dos carreras; después salas/sincronización/despliegue. No se contrata hosting ni se publican credenciales.

Pendientes humanos: comodidad de catálogo, teclado/mandos físicos y sensación de conducción/audio. Pages público sigue sin verificarse desde el entorno. La planificación no sustituye la implementación online futura.
