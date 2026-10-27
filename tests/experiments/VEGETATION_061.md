# 0.61 — profundidad vegetal sin invadir conducción

## Base y alcance

Main revisado limpio en `d77285f` (0.60), historial, render de escenarios, colocación/huellas, cachés, pruebas y hoja abierta. Rama `work/forest-061`. Primer tramo de fase 36.3: mejorar lectura de especies, follaje/troncos y sombra en escenarios de bosque/nieve/desierto/costa, manteniendo identidad retro.

El usuario reafirma prioridad de conducción, derrape, pistas divertidas y velocidad cercana a 260. Se registra para la próxima revisión de manejo del modelo rápido con frenado/radio/CPU y récords versionados. **Esta entrega gráfica no implementa esa velocidad** ni altera los valores físicos para dar una impresión visual de rapidez.

## Implementación

- Nuevo helper de render `drawVegetation`: copas de árbol/canopy por lóbulos/capas, troncos y raíces, frondas de palmera, pinos por niveles con nieve cuando corresponde y nervaduras/detalles de cactus.
- Sombras con dirección de luz mundial compartida con coches, contacto corto y facetas de follaje contenidas. No hay filtros borrosos, luces intermitentes ni viento/animación nuevos.
- Detallado incorpora pequeñas capas de follaje/raíces; retro reduce esos detalles. **Lite conserva su renderer anterior**, sin llamar al nuevo helper.
- No aumenta cantidad, tamaño de colocación ni radio reservado de los objetos. No cambia semilla/variante, selección de especies por tema, separación entre objetos, presupuesto, carretera, barreras o escapatorias.
- Se dibuja una vez con el fondo en caché. Sin nuevos recursos externos/dependencias ni objetos físicos. Edificios, rocas y otros elementos no vegetales conservan su dibujo anterior.
- Física p6, reloj s1, rutas/14 registros, modelos/velocidades, CPU, audio, local, controles y récords conservados.

## Comprobación geométrica

`validate-scenery.mjs`: **1.700 colocaciones en catorce pistas/tres calidades**, geometría visible dentro de huella, separación exacta del corredor y otros objetos, límites de mundo, generación determinista y reutilización de caché. Total de la prueba: 704 objetos en high y 434 en lite, sin modificar presupuestos. Esos totales agrupan las pistas; no son objetos simultáneos de una carrera.

La huella incluye los nuevos lóbulos, frondas, troncos, raíces y sombras. No se reduce el margen de recuperación ni se aumenta la tolerancia de geometría para aprobar la apariencia. No hay decoración nueva con colisión invisible.

## Chromium antes/después

`browser-vegetation.cjs`, catorce pistas × tres calidades:

- **18 fondos** con vegetación detallada/retro cambian.
- **24 fondos** lite o sin vegetación quedan idénticos byte a byte.
- **42 carreteras** quedan idénticas byte a byte.
- Metadatos completos de colocación idénticos para las 42 combinaciones.
- Se reutilizan las mismas instancias de fondo y superficie al repetir cuadros; sin errores JavaScript.

Capturas antes/después revisadas en Jungle y costa, con más capas de copa y lectura de palmeras. También se guardan nieve/desierto y overview. Las capturas cercanas centran el escenario mediante un coche colocado por el test fuera del corredor: son muestras de arte, no una maniobra humana ni la cámara de una vuelta real. La fase sigue siendo realismo estilizado retro, no un acabado fotorrealista completo.

No se anuncia mejora de FPS por reutilizar caché. La carga de regenerar el fondo tiene más comandos de dibujo en detallado; percentiles de carga/frame y dispositivos modestos siguen pendientes en fase 35/36.5. El coste por cuadro de volver a dibujar árboles no se añade porque se conserva el fondo estático.

## Regresiones y límites

- Integración: identificadores HTML, archivos/versiones de recursos, diez nombres originales/catorce registros y 70 configuraciones de pista/barreras/checkpoints.
- Geometría de catorce pistas; Jungle congelado en 0.60: ancho/forma/puertas/modelos/material físico y otros trece trazados. No se reabren sus variantes rechazadas.
- Núcleo de conducción/IA/colisión y tuning comparados contra fixture; doce maniobras de contravolante conservadas.
- Reloj fijo: estados idénticos en doce combinaciones de modelos/materiales a 20/30/60/120/144 FPS y jitter; límite de stalls y ciclo de pausa/reinicio.
- CPU: reservas de grupos focalizadas y diez vueltas válidas de ritmo libre en cinco rutas, sin salidas y sin cambios de fuerza/velocidad. No se repite la matriz de Jungle por un cambio de vegetación: sus datos físicos y carretera son idénticos.
- Local: 21 parrillas con modelos/pinturas/control/HUD/cámaras; estándar de mandos emulado. Navegador general/local/entrega bajo `/f1/` pasaron: teclado, cámaras, pausa/reinicio/resultados, fullscreen, cinco resoluciones, cuatro mandos emulados y recursos coherentes sin puente de estado en la entrega. Sin errores JavaScript.

Aún pendientes: juego humano/comfort de controles, escucha de audio, mandos físicos, pruebas en dispositivo modesto y coherencia completa de luz/escala en todos los edificios/rocas/ambientes. El cambio de vegetación no resuelve esas áreas por sí solo.

## Plan restante y prioridad

La hoja activa enumera **12 frentes abiertos (25–36)**, varios parciales. No son doce actualizaciones restantes. Online requiere tres hitos (salas autoritativas, sincronización con latencia/reconexión, despliegue/resultados validados) con dependencia de extraer núcleo de simulación; no existen servidor/salas online hoy. No se añade botón ficticio ni se contrata alojamiento en esta entrega.

Próxima prioridad: manejo/aceleración/frenada/derrape y objetivo del coche rápido ~260 km/h, con comparaciones de tiempo/radio/recuperación y CPU justa. Seis pistas uniformes y otros escenarios permanecen en el plan.

## Reproducción

```sh
node tests/validate-scenery.mjs
git show d77285f:script.js > /tmp/pixelgp-before-061.js
SCENERY_SOURCE_BASELINE=/tmp/pixelgp-before-061.js node tests/browser-vegetation.cjs
```

Playwright/Chromium solo de desarrollo; `CHROMIUM_PATH` indica ejecutable alternativo y `SCENERY_SCREENSHOTS` guarda capturas. Sin dependencias de ejecución nuevas.

La consulta pública de Pages recibe `CONNECT tunnel failed, response 403` del proxy; entrega local comprobada, despliegue público sin confirmar.
