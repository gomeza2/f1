# Escenarios 0.66 — arquitectura, fase 36.3

Base auditada: `main` / `e7503c22f5a9dd19159e78f9b78afc1bdeb56cea` (0.65), igual a origin y árbol limpio. Rama de trabajo `work/scenery-066`.

## Cambio integrado

El contraste y volumen de los edificios/tribunas eran limitados frente a la vegetación revisada en 0.61. Se incorpora `drawArchitecture` para siete tipos, usando primitivas Canvas propias y las paletas existentes. Tribunas con cuatro niveles, espectadores con huecos y distribución por variante, pasillo/escalones, marquesina y soportes. Edificios urbanos con fachada, cara lateral sombreada, techo/equipamiento, ventanas encendidas/apagadas; cabañas con troncos y nieve; depósitos con persiana; contenedores con nervaduras/cerrojos; tanques con cuerpo/escala y carpas con paneles/banderín.

Detallado añade elementos pequeños; Retro conserva volúmenes/materiales; Rendimiento usa las siluetas previas. Luz superior izquierda compartida con coches/árboles. Sin animaciones ni más objetos. Se dibuja solo al construir el fondo estático existente, no en cada actualización de física. No añade imágenes, recursos ajenos ni dependencias.

Los tipos, posiciones, tamaños, huellas y presupuestos permanecen. Todo el nuevo dibujo cabe en la huella reservada de cada objeto, más allá de la franja de recuperación. No se introducen colisiones para decoración. No cambian carretera, superficies, barreras, audio, fuerzas, CPU, HUD ni récords p6/b1/s1. Una comparación de código quitando solo el helper y el despacho nuevos reproduce exactamente el script de 0.65.

## Comprobaciones

- `node --check script.js` y `node --check tests/browser-vegetation.cjs`; diff sin errores de formato.
- `node tests/validate-scenery.mjs`: 1.829 colocaciones / 14 pistas / tres calidades, huella visible incluyendo sombras, distancia a la pista, límites, separación, generación determinista y reutilización de caché. 759 objetos en Detallado y 464 en Rendimiento.
- Chromium, comparación de fondos reales con 0.65: 21 fondos cambian y 21 permanecen idénticos; las 42 imágenes de carretera y los metadatos de colocación permanecen byte a byte. Caché reutilizada y cero errores JS.
- Capturas antes/después generales y cercanas en Sunset, Neon, Night, Frost, Pixel, Champion e Industrial. Se revisan visualmente tribunas, fachadas, cabañas e industria. Las tomas cercanas reubican el coche mediante un puente de prueba para encuadrar los objetos; no representan una vuelta ni un incidente real.
- Prueba local Chromium en Champion: flujo de 2/3/4 jugadores, entradas simultáneas de teclado, cámaras/HUD, pausa/reinicio/resultados, pantalla completa y cinco resoluciones. Mandos emulados; hardware real pendiente.

Reproducción de comparación (Playwright y Chromium instalados externamente, no dependencias del juego):

```sh
git show e7503c2:script.js > /tmp/pixelgp-before-066.js
SCENERY_FOCUS=architecture SCENERY_SOURCE_BASELINE=/tmp/pixelgp-before-066.js SCENERY_SCREENSHOTS=/tmp/pixelgp-scenery-066 node tests/browser-vegetation.cjs
```

La prueba de fondos existente admite ahora elegir el grupo de arquitectura, evitando duplicar su servidor/comparador. Para el histórico de vegetación se conserva el grupo predeterminado y se necesita su base correspondiente.

Comprobaciones de cierre superadas: `validate-integration.mjs` (IDs/rutas/versiones, diez pistas originales, 70 configuraciones y checkpoints), `validate-menu.mjs` (14 previews, 24 combinaciones, selección/temporada) y `browser-release.cjs` (archivos reales bajo `/f1/`, caché anterior, recursos versionados, cuenta regresiva, teclado, pausa/reinicio/menú, cero errores JavaScript). No se repiten matrices de tiempos de CPU porque no cambió la simulación.

Se intentó consultar el sitio público: el proxy del entorno rechazó CONNECT a `gomeza2.github.io` con HTTP 403. La prueba local no confirma el despliegue de Pages.

## Límites y continuidad

No demuestra FPS en equipos modestos, aceptación humana de la estética/manejo ni publicación efectiva de GitHub Pages. No se declara terminado el frente gráfico: rocas, nuevas variantes, ambientación e iluminación siguen pendientes. Audio de 0.65 permanece abierto a escucha humana; no se modifica otra vez sin evidencia nueva. Próximo candidato: Coastline, una de las cinco pistas aún uniformes, con secciones y ritmo propios.
