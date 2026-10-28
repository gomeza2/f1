# Coastline 0.67 — fase 27

Base auditada: `main` / `878d9866a4b8082122f7777a9c8c3347009f94bc` (0.66), remoto igual y árbol limpio. Rama `work/coast-067`. Se revisan trazado, consultas de sección/material, raster mixto, barreras, preview/minimapa, pruebas y hojas de ruta.

## Integración

Coastline Run conserva nombre, índice 10, tema/paleta costera y perfil automático abierto. Recorrido anterior 4.261,11 → 7.142,93 unidades (+67,6 %), mundo 2000×1280. Recta superior amplia, arco exterior rápido, sector de tierra y regreso interior con curvas enlazadas/retornos más cerrados. Ancho 72–116, con y sin pianos, diez checkpoints ordenados; no se añaden atajos sin validar ni cruces de trazada.

Geometría independiente del ancho: margen al mundo 66,21, separación libre entre ramales 35,57. Diferencia de silueta anterior 0,432; la más cercana es Sunset, distancia 0,305 (normalizada, no unidades ni porcentaje). Las trece rutas restantes quedan congeladas con la nueva fixture `coast-0.66.json`, incluyendo modelos, materiales y hash del núcleo de conducción/CPU/contactos.

Se generaliza el raster de Thunder para las carreteras costeras variables. La franja de tierra 31–37 % utiliza su ancho real y consultas físicas para decidir cada celda. Preview, fondo de pista y minimapa muestran la misma geometría; la pintura central se cachea antes de la tierra para no reaparecer encima. El raster tiene 8.572 celdas de dos unidades y se reutiliza entre calidades/perfiles.

**Defecto detectado y corregido:** la primera prueba de continuidad falló (`Mixed transition jumps a barrier`). Al entrar en tierra, el radio de valla tomaba la referencia nativa de 42 en vez de 48 y saltaba seis unidades. Coastline variable ahora mantiene la referencia costera también en tierra, sin modificar las otras trece pistas. Se repiten geometría, barreras y pruebas Canvas afectadas después de corregirlo.

Récord nuevo `COASTLINE RUN@3:p6:r1:s1:b1`, anterior `COASTLINE RUN@2:p6:s1:b1` conservado. Física p6, balance b1 y simulación s1 permanecen. No se cambian conducción, velocidades, frenada, IA, coches ni sonido. Los contactos se mantienen activos.

## Evidencia automática

- Sintaxis y diff: sin errores en los JS modificados.
- `validate-coast.mjs`: geometría/forma/materiales/continuidad/caché, diez gates con separación ≤650, meta sin gates rechazada, claves de récord, trece rutas y núcleo de conducción preservados. Matriz de **34 vueltas válidas**:
  - Cinco perfiles × dos vueltas: Normal libre 39,90/38,83 s, cero pasos fuera de pista.
  - Cuatro modelos × dos: Balanced 40,32/38,80; Corner 42,12/40,62; Speed 40,17/38,80; Rally 41,55/40,13 s. Sin superar topes ni teletransportes.
  - Fácil 46,50/45,78; Difícil 38,98/37,83 s.
  - Parrilla Normal, cuatro coches × tres: medias 40,17/39,83/38,42/39,02 s; seis pasos con contacto, cero salidas, todos terminan dentro del plazo normal de resultados.
- `validate-road-sectors`: 40.886 probes de las nueve rutas variables previas, y 5.577 adicionales de Coastline con el selector nuevo. Anchuras, continuidad periódica, gates, terrenos, pianos y márgenes. El modo predeterminado actualizado recorre las diez rutas variables.
- `validate-barriers`, Coastline: dos contornos cerrados, 1.584 probes, cinco perfiles, contacto con geometría visible y respuesta del coche detenido.
- `validate-scenery`, Coastline: 176 colocaciones/tres calidades, huella/límites/recuperación/separación/caché; 76 Detallado y 39 Rendimiento.
- Integración: IDs/rutas/versiones, diez originales, 70 perfiles y checkpoints. Menú: 14 previews, 24 combinaciones y selección/estado activo conservados.
- Conservación geométrica/material de Thunder y propiedades focales de tráfico de grupo; no se repite la matriz completa de IA porque su código no cambia. Las fixtures históricas no se sobrescriben: reconocen explícitamente Coastline @3, cuya nueva fixture congela el resto del juego.

## Chromium real

- `browser-road-sectors`, Coastline final: **7.679 probes** de borde/material/pianos en cinco perfiles y tres calidades, transparencia fuera de pista, sin vallas en abierto ni errores JS. Tres vueltas mediante el reloj físico de producción: **39,90/38,83/38,83 s**, llegada 117,57 s. La batería conserva además su control Night/split.
- Comparador de material, tres calidades: **8.001 probes de color/terreno** (156 tierra + 2.511 asfalto costero por calidad), caché compartida, preview sin mutar la pista activa y récords viejo/nuevo conservados al recargar. Las capturas generales y cercanas (18/34/60 % de vuelta) se revisan visualmente; el encuadre cercano reubica el coche mediante un puente de prueba.
- Comparación con 0.66: **39 imágenes byte a byte idénticas** en las otras trece carreteras/tres calidades, cero errores JS.
- Local 2–4 en Coastline: teclado simultáneo, coches elegidos, cámaras/HUD independientes, pausa/reinicio/resultados, pantalla completa y cinco resoluciones. Mandos emulados, no hardware físico.
- Entrega real de archivos bajo `/f1/`, caché antigua precargada, recursos 0.67 coherentes, selección/cuenta regresiva/teclado/pausa/reinicio/menú y cero errores JS. Esto no acredita publicación pública de Pages.

Reproducción principal:

```sh
node tests/validate-coast.mjs
TEST_TRACKS=10 node tests/validate-road-sectors.mjs
TEST_TRACKS=10 node tests/validate-barriers.mjs
ROAD_STAGES=10 node tests/browser-road-sectors.cjs
MIXED_STAGE=10 MIXED_SCREENSHOTS=/tmp/pixelgp-coast node tests/browser-thunder-material.cjs
LOCAL_STAGE=10 node tests/browser-local.cjs
git show 878d986:script.js > /tmp/pixelgp-before-067.js
PARITY_STAGES=0,1,2,3,4,5,6,7,8,9,11,12,13 ROAD_SOURCE_BASELINE=/tmp/pixelgp-before-067.js node tests/browser-material-parity.cjs
```

Playwright/Chromium son herramientas del entorno; no se agregan dependencias al juego.

## Límites y siguiente tramo

Los tiempos provienen de controladores automáticos; no demuestran diversión, balance humano, conducción de Speed al límite ni que una vuelta humana dure exactamente 40 s. Sigue pendiente evaluación humana de curvas/derrape, audio y hardware/rendimiento real. El sitio público continúa sin verificarse desde este entorno por el bloqueo 403 conocido del proxy; push verificado y despliegue son estados distintos.

Diez rutas variables y cuatro uniformes: Champion, Rally, Meadow e Industrial. La fase 27 permanece abierta. Siguiente foco recomendado: fase 25, comparación controlada de acelerador/frenada/mano y recuperación sobre el reloj estable; conservar pruebas de tráfico antes de integrar cualquier derrape lateral nuevo. No reactivar el ensayo descartado de 0.63 por defecto, ni concentrar todas las entregas en CPU.
