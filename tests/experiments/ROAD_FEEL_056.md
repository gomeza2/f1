# Conducción/lectura y primer material gráfico — 0.56

## Base y objetivo

Main real `b34df3a35290d188f0cd7d37f1e7e9ee90e6c433` / 0.55, árbol limpio y remoto revisados; rama `work/road-detail-056`. Inspeccionados conducción, control CPU a baja velocidad, audio/efectos, secciones/materiales, render/cachés, pruebas y planificación. El usuario pide continuar las fases y sumar una mejora gráfica profunda con realismo estilizado y toque retro.

Se añade fase **36** con cinco tramos verificables: materiales/lectura; coches/sombras; escala y escenarios temáticos; iluminación/ambiente; calidad/rendimiento. Conserva colores y siluetas originales, lectura de curvas, geometría compartida con colisiones, recursos propios y evaluación humana. Canvas 2D continúa mientras permita los objetivos medidos. 0.56 inicia 36.1 y corrige problemas concretos de fase 25; no cierra manejo ni anuncia un rediseño gráfico completo.

## Errores confirmados y solución

1. **Pivote estacionado:** a velocidad cero, mantener dirección hacía girar el chasis sin desplazamiento. Chromium antes: 0,837 rad (~48°) en un segundo, distancia cero. Ahora conserva posición/rumbo y pone yaw a cero; las ruedas siguen orientándose y el coche gira al avanzar. Se prueba a 30/60/120 Hz. No cambia fuerza, giro máximo, aceleración/frenado en movimiento ni modelos; es corrección del reposo, con récords/física p5 preservados.
2. **Indicador de velocidad interpretado como derrape visual:** un valor de drift alto podía dibujar neumáticos/humo aun circulando recto. Audio ya distinguía giro/rotación; ahora ambos consumen `drivingSlip`. En recta, sin freno de mano ni rotación, deja cero marcas; giro/rotación residual/freno de mano conservan marcas en las dos ruedas traseras y sus materiales.
3. **Recuperación CPU dependiente del pivote:** al quitar el giro estacionado, apareció un atasco a 30 unidades. El caso a 25 ya quedaba trabado antes del cambio. Se permite un objetivo mínimo de avance 3 solo con rival lento, maniobra de paso/solapamiento, proximidad física y espacio lateral solicitado suficiente. Bajo velocidad 8 se usa un objetivo de dirección muy cercano. Acelera/frena/gira con las reglas comunes; colisiones y borde siguen activos. No se reubican coches ni se añade agarre.

## Comparación de recuperación

Un humano estacionado y una CPU inicialmente parada en una recta de Sunset, misma física y dt 1/60. Se considera recuperación pasar cuarenta unidades de progreso por delante del obstáculo; no son vueltas completas.

| Variante | Obstáculo a 25 | Pasos con contacto | Resultado |
|---|---:|---:|---|
| 0.55 | No pasa en 20 s | 0 | Atasco previo |
| Sin pivote, sin avance de recuperación | No pasa en 20 s | 0 | También atasca el caso a 30 |
| Objetivo 4, distancia mínima 24 | No pasa en 20 s | 0 | Solo avanza una unidad antes de quedar detenido |
| Objetivo 3, margen 22,9, objetivo de dirección anterior | 18,38 s | 17 | Demasiados roces |
| Objetivo 4, margen 22,9, dirección anterior | 12,08 s | 67 | Contacto prolongado; descartada |
| Objetivo 4 + dirección cercana | 8,97 s | 22 | Más rápida pero peor contacto; descartada |
| **Objetivo 3 + dirección cercana** | **11,93 s** | **0** | **Elegida** |

El margen 22,9 permite solicitar avance junto al radio de contacto 23 con tolerancia pequeña; **no elimina la resolución física del contacto**. Las restricciones de espacio y las decisiones de frenado ante otros rivales se mantienen.

| Paso de simulación | Distancia 25 | Distancia 30 | Distancia 40 | Contacto |
|---|---:|---:|---:|---:|
| 30 Hz | 10,47 s | 4,50 s | 4,53 s | 0 en los tres |
| 60 Hz | 11,93 s | 4,60 s | 4,32 s | 0 en los tres |
| 120 Hz | 12,97 s | 4,64 s | 4,38 s | 0 en los tres |

La trayectoria/tiempo de recuperación todavía depende del paso; no se afirma equivalencia temporal del controlador entero. Es evidencia para la futura simulación fija de fase 30. Tampoco demuestra recuperación universal con paredes, varias filas o todas las anchuras. Las carreras de regresión conservan sus métricas/budgets anteriores.

## Primera mejora gráfica

Asfalto con agregado fino original de bajo contraste, dos tiles deterministas: detallado 48×48 (400 texeles/operaciones), retro 24×24 (64). Se rellena únicamente el interior del corredor definido por la sección común, antes de las zonas de tierra de pistas mixtas/costeras. No cubre pianos, límites ni escapatorias; no introduce lluvia/grip nuevo. Textura y carretera quedan en caché: no se genera una capa de ruido por frame. Modo rendimiento no añade textura; nativos tierra/hielo/pasto/volcánico conservan sus superficies.

Comparación Chromium de catorce pistas × tres calidades contra 0.55: **16 imágenes cambian intencionadamente** (ocho superficies asfaltadas/mixtas/costeras × detallado/retro), **26 imágenes son byte idénticas** (todos los modos rendimiento y materiales nativos). **71.706 sondas de borde/piano/exterior** preservadas. Máximo dos tiles y misma superficie reutilizada tras dibujar frames. Capturas cercanas antes/después revisadas: agregado visible, coches y pintura legibles. No se extrapola una imagen a una aprobación del arte final o del rendimiento del usuario.

## Comprobaciones

- `validate-road-feedback.mjs`: reposo/dirección a tres frecuencias, salida rodando, señal inmutable de deslizamiento, recta sin marca falsa, marcas dobles al girar/freno de mano, cachés acotadas y preservación de nativos/lite; nueve recuperaciones (tres distancias × tres frecuencias).
- `browser-road-detail.cjs`, con `ROAD_SOURCE_BASELINE`: comparación de superficies/bordes/cachés, pivote antes/después, dos marcas falsas anteriores frente a cero, recuperación desde parado en Chromium a 60 Hz. Fuente de prueba inyectada solo en el servidor de test; no se exportan controles internos en producción.
- Batería final Node: veinte parrillas/240 vueltas, diez referencias de grupos/120, tres de borde/36, dos de carril/24 y cinco de ritmo libre/diez: **430 vueltas válidas** entre suites, con escenarios compartidos. Excluye candidatos, repeticiones y maniobras parciales. Fuerzas/modelos/rutas/personalidades y límites de contacto anteriores preservados; no se ajustan presupuestos para aprobar.
- Manejo/frenado, inercia, contactos/recuperación, CPU y tráfico focalizados, audio y terreno/grava. Integración setenta perfiles/IDs/recursos, geometría catorce pistas, local veintiuna configuraciones y contacto de gates.
- Chromium cinco parrillas/60 vueltas con límite de llegada y métricas de contacto anteriores; suite general/14 pistas, local 2–4 y entrega sin puente `/f1/`. Sintaxis/diff revisados.

Incidencias de pruebas corregidas: el primer escenario del navegador dejaba otros dos rivales del valor predeterminado al comparar un caso de dos coches; se fija explícitamente un rival y se repite. La prueba de contravolante del smoke soltaba gas sin garantizar movimiento; ahora exige velocidad y mantiene gas durante el ensayo, coherente con la eliminación del pivote. Los ensayos de respuesta de inercia con tiempo de simulación fijo se conservan. No se presentan fallos de preparación del test como errores nuevos del juego.

## Pendiente y siguiente

Falta conducir y valorar curvas/derrape/recuperación humanamente, revisar imagen en hardware real y medir costes sostenidos con cuatro cámaras. El audio 0.55 y su timbre pendiente se conservan. GitHub Pages público ha recibido 403 del proxy; push y entrega local no prueban despliegue.

Continuar fase 25 con comparaciones de conducción, y fase 36.2 con coches/luz/sombras coherentes. Siete trazados uniformes, otros terrenos/ambientación, CPU, modos/progresión y online real continúan en la hoja abierta. No hay límite artificial de fases ni aceptación automática de diversión por pasar geometría o sintaxis.
