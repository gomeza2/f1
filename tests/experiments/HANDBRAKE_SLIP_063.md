# 0.63 — ensayo lateral rechazado y corrección de tráfico integrada

**La entrega conserva la física de 0.62. El deslizamiento lateral experimental no está activo.**

## Estado real y objetivo

Main limpio `874fba2` (0.62), remoto coincidente. Revisados historial, HTML/CSS/script, motor, README, ambos planes y pruebas. Catorce rutas, modelos/balance b1 (Speed 260), reloj s1 y física p6. Prioridad: conducción divertida/recuperación sin perjudicar la competición CPU. No hay backend online.

Confirmado: `drift` no produce por sí solo separación entre orientación y viaje; el coche se desplaza según `heading`. Se ensayó deslizamiento cinemático acotado al freno de mano, compartido con CPU, con recuperación por agarre y previsión/contactos según dirección de viaje. No era simulación completa de neumáticos.

## Comparación inicial

Cuatro variantes, mismo controlador, dos vueltas libres en Sunset, Dusty, Frost y Jungle: **32 vueltas exploratorias**, sin salidas. Pulso Balanced a 180, gas/derecha/mano 0,30 s en recta real Champion:

| Intensidad | Separación orientación/viaje al acabar | Desplazamiento lateral del pulso | Frost, vuelta lanzada |
|---|---:|---:|---:|
| 0 | 0° | 6,63 unidades | 35,85 s |
| 0,10 | −4,96° | 4,50 | 36,37 s |
| 0,18 | −8,94° | 2,78 | 37,15 s |
| 0,28 | −13,90° | 0,61 | 38,10 s |

Las opciones grandes retrasaban la trayectoria y pesaban las curvas. La suave conservaba velocidad/giro del pulso (159,40 / 0,41146 rad), cambiando solo el desplazamiento. Se comprobó en VM/Chromium: doce maniobras normales iguales, ocho pulsos reflejados, recuperación, material, fuerza longitudinal y guardado p6/p7 aislado en navegador. **Estos resultados pertenecen al prototipo, no a una función publicada.**

## Por qué se retira

La comparación amplia no confirmó la mejora. Surgieron contactos nuevos en Night; leer el deslizamiento en dirección CPU dejó dos pasos de contacto. La corrección radial descrita abajo resolvió ese caso, pero sostener mano ralentizaba Meadow más del presupuesto anterior del 2 %. Una variante de pulsos redujo esa pérdida, con **9 pasos de contacto Meadow y 3 Industrial**, referencias previas 0/0, sin salidas. Esa matriz exploratoria completó 120 vueltas, pero **falló los límites**: no se cuenta como validación superada.

También se descartaron prohibición global de mano alrededor de otro coche (Night 3 pasos), margen angular ampliado a 30 (2) e intensidad 0,06 (5), en ese escenario. No garantizan seguridad en otros. No se publican pulsos, nueva física p7 ni migración de récords, y no se amplían tolerancias para dar el ensayo por aprobado.

El diff completo del candidato se conserva en [HANDBRAKE_CANDIDATE_063.patch](HANDBRAKE_CANDIDATE_063.patch), relativo **solo a `script.js` de `874fba2`**. Es material experimental no cargado por HTML; no debe aplicarse sobre main como actualización aprobada. Necesita una revisión conjunta de control, planificación y predicción antes de retomarlo.

## Defecto real encontrado y corrección publicada

En un cruce de Night: coche 134,05, rival 180,59, rumbos diferentes y separación 23,70. La previsión advertía contacto en 0,125 s con distancia 22,11 (contacto físico 23). Sin embargo, el plan pedía límite **153,16** y continuaba acelerando: el rival era longitudinalmente más rápido y el cálculo ignoraba **46,09 de cierre radial**.

Se añade lectura de velocidad relativa hacia la línea que une los coches. Solo cuando el cierre longitudinal es cero y existe convergencia inminente (<0,55 s, umbral de separación previo), con cierre radial >18, se solicita velocidad menor mediante **freno normal**. En el snapshot: límite **99,48**, frenada real **4,33 en 1/60 s**, máximo normal `(230+30)/60`. No mueve coches en la planificación ni aumenta fuerza, giro, agarre o velocidad. Convergencia/fricción/contactos y los demás criterios previos siguen activos. Ir paralelo a igual velocidad sigue libre.

Este snapshot es una situación física reproducible en la carretera real, descubierta al ensayar otra trayectoria. No se afirma que hubiera ocurrido en todas las carreras deterministas de 0.62.

La versión publicada mantiene **p6 / b1 / s1**, Speed 260, parámetros de modelos/dificultades, ruta, barreras, audio, gráficos y local 2–4. No cambia claves ni elimina récords.

## Pruebas

- `validate-angled-traffic`: primero reproduce el fallo de control con el cálculo anterior; después verifica solicitud de freno normal, planificación sin teletransporte ni fuerza, y libertad de correr en paralelo.
- `validate-countersteer`: el hash del núcleo histórico sigue comprobándose tras revertir explícitamente la pequeña corrección de tráfico y las migraciones anteriores; no se reescribe el fixture.
- `validate-group-traffic`: mantiene los presupuestos previos de contactos/salidas/ritmo. Mejora el informe: recoge las diferencias al finalizar los escenarios, conservando los límites y el fallo si hay regresión.
- `browser-angled-traffic`: CPU/physics/Canvas reales en Chromium, comparación contra script auténtico 0.62, planificación inmutable, aceleración errónea anterior frente a frenada normal y misma serie de récords. No sustituye una carrera humana.

Los resultados finales de la versión estable se detallan debajo. Las capturas del ensayo, con reloj controlado y cuenta regresiva saltada, no son prueba de carrera humana ni de timbre de motor. La escucha, el manejo humano, mandos físicos, FPS del dispositivo y GitHub Pages público permanecen pendientes según acceso.

## Resultado final de la entrega estable

- **120 vueltas válidas**, diez escenarios de cuatro coches, tres vueltas por coche. Ningún paso-coche fuera de pista, todos terminan dentro del plazo normal. Presupuestos anteriores de contacto y ritmo (≤2 % de pérdida media por escenario) intactos. No se suman las carreras del prototipo ni las del smoke.

| Escenario | Pasos con contacto, fixture histórico 0.53 | 0.63 estable |
|---|---:|---:|
| Sunset Normal 30 Hz | 13 | 0 |
| Night Normal | 0 | 0 |
| Meadow Normal | 0 | 0 |
| Industrial Normal | 0 | 0 |
| Dusty Fácil | 1 | 0 |
| Volcano Normal | 0 | 0 |
| Rally Normal | 4 | 0 |
| Frost Difícil | 4 | 4 |
| Pixel Normal | 0 | 0 |
| Sunset Normal 60 Hz | 6 | 2 |

Esta tabla usa el fixture conservado de 0.53, no atribuye todos los avances acumulados a esta entrega ni representa número de choques distintos. Frost aún tiene contactos residuales. La matriz confirma ausencia de regresión respecto de sus límites, no todas las situaciones posibles.

- Sintaxis de JavaScript y diff sin errores; IDs/recursos/build coherentes, diez originales/catorce pistas y 70 perfiles/gates. Geometría de las catorce comprobada; no se rediseñó ningún trazado.
- Speed real/garaje/HUD a 260, aceleración/frenada/mano/recuperación anteriores conservadas; doce maniobras de contravolante y doce casos modelo/material a 20/30/60/120/144 Hz+jitter mantienen reloj/interpolación/pausa/registros.
- Chromium: snapshot CPU antes/ahora, captura revisada, smoke de las 14 pistas y flujos, local 2–4/cinco resoluciones/teclado/mandos emulados/fullscreen, entrega sin puente en `/f1/`. Sin errores JS en estos recorridos; mandos físicos, conducción humana, audio y FPS del dispositivo no certificados.
- `git apply --check` del candidato archivado pasa contra copia aislada de `script.js` 0.62; esto comprueba recuperación del experimento, no su calidad ni aprobación.
- GitHub Pages público devuelve 403 del proxy al CONNECT; solo se verifica la entrega local y el estado Git remoto al publicar.

Siguiente: variedad/secciones de Thunder (fase 27). Antes de retomar el derrape lateral, revisar control y planificación conjuntamente y compararlo contra esta base estable; no reintroducir el candidato rechazado como una mejora ya terminada.
