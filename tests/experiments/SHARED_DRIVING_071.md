# 0.71 — primer bloque de conducción compartida

Base auditada: main `d417b94b8bbd19d3bf65a3749aa436ae9c6d900c` / 0.70, remoto igual y árbol limpio. Rama `work/shared-driving-071`. Objetivo: preparar el online con código utilizado por el producto, sin copiar otra física ni simular un DOM en un servidor.

## Integrado

`driving-core.js` contiene los modelos/materiales y las reglas reales de aceleración, agarre, filtro de dirección, yaw, frenado/reversa, resistencia firmada y paso de movimiento. `script.js` usa directamente el módulo y conserva geometría, contactos, progreso, reloj de carrera, render y audio. Los datos de materiales siguen unificando apariencia y comportamiento.

Reglas propias e inmutables por motor, estados de coche separados. Node importa el mismo archivo con `require`, sin npm, DOM, Canvas, audio, localStorage o reloj externo. La intención de reversa puede prohibirse explícitamente a un controlador de seguridad; la física no distingue por piloto humano/CPU.

Se conserva p6/b1/s1, Speed 260 y registros existentes. No se retoca el manejo ni se publica deriva lateral. El reversor de extracción reconstruye exactamente el script 0.70; los datos/reglas reales del nuevo módulo se comprueban por separado contra la referencia. No se sobrescriben fixtures ni se sustituyen hashes por otros nuevos para esconder cambios.

HTML carga la dependencia versionada antes del main. El bootstrap resuelve el caso de HTML 0.70 cacheado que obtiene el main nuevo sin tener la nueva etiqueta: carga el archivo relativo al script, espera y habilita la carrera. Si no puede cargarlo, muestra recarga necesaria y deshabilita iniciar. No se mantiene una copia alternativa de la física en el fallback. Se actualizan las listas de recursos de los servidores de pruebas y se eliminan dos lecturas de modelos mediante eval de texto del main en los tests de audio.

El comparador de parámetros histórico adapta su override al módulo, preservando campos más recientes; esa matriz de investigación no se ejecuta ni se cuenta como validación de esta entrega.

## Evidencia

- `validate-shared-driving`: **140 casos / 3.164 pasos**, cuatro modelos × siete rutas × cinco secuencias (curva, pedal parcial, freno, mano y reversa), usando contexto real de terreno/curva y comparación exacta contra la física 0.70. Se mantienen los casos dentro de pista para comprobar el bloque extraído sin confundirlo con geometría todavía externa.
- Siete materiales: grip y resistencia firmada comparados con la referencia para cuatro modelos y seis velocidades, incluida grava. Reglas de datos iguales, cuerpos de las seis funciones trasladadas iguales; motores/coches intercalados y aislados, configuración inmutable, modelo inválido rechazado y freno de seguridad sin activar reversa.
- Carga real del módulo en Node con getters que prohíben DOM/storage/audio/reloj: alcanza 260 sin navegador ni mocks de juego. El VM con DOM de pruebas solo se usa como referencia del código anterior, no como servidor.
- `browser-shared-driving`: **16 escenas / 96 snapshots**, cuatro modelos sobre asfalto/tierra/hielo/costa, teclado real, aceleración/freno/mano/reversa/retorno y render real. Estados, progreso, tiempo y HUD exactamente iguales a 0.70. Se observan **3.552 llamadas** al paso compartido y cero en la referencia anterior. Sin errores JS.
- `browser-core-vectors`: **28 vectores / 140 snapshots** del módulo standalone entre Node y Chromium. Velocidad/timers/flags exactos; máximo error de posición/ángulos/filtros **1,4210854715202004e-14**, inferior a la cota de comparación 1e-10.
- La primera exigencia de igualdad binaria entre esos runtimes falló por redondeo en funciones trascendentales. Se corrige el contrato de esa prueba nueva para medirlo y acotarlo; no se cambia el producto para forzar el resultado ni se relajan comparaciones exactas con la física anterior dentro de cada entorno. No se promete lockstep binario universal. La arquitectura online mantiene autoridad/reconciliación.
- **36 vueltas actuales + 36 de referencia 0.70**: Sunset Normal, Coastline Normal y Frost Hard, cuatro coches/tres vueltas, poses/velocidades/dirección/contactos/gates/progreso/clasificación/tiempos exactos. Presupuestos históricos no ampliados.
- El lector histórico de tuning esperaba el literal dentro de `script.js`; se adapta a la restauración explícita y se comprueban también los datos reales del módulo. Se conserva el hash de referencia, sin sustituirlo por el alias nuevo.
- Speed 260, pedales, reversa y doce maniobras de contravolante; geometría/materiales/otras rutas en Coastline preservados. Reloj fijo a 20/30/60/120/144 FPS y jitter, doce escenarios, ciclo de vida e interpolación sin cambios.
- Chromium: catálogo/paddock en cinco tamaños, carrera elegida, local 2–4/cámaras/HUD/mandos emulados, reversa, audio real y mezcla/silencio/ciclo de vida. Tests de tono usan ahora los modelos canónicos del módulo y conservan sus límites.
- Integración: IDs/recursos/versiones, diez originales, 70 configuraciones/checkpoints. Entrega real bajo `/f1/`: caché anterior, cuatro recursos coherentes, teclado/cuenta regresiva/pausa/reinicio/menú, más HTML auténtico 0.70 sin dependencia y fallo de carga simulado sin excepción no controlada.

## Reproducción

```sh
node tests/validate-shared-driving.mjs
node tests/browser-core-vectors.cjs
git show d417b94:script.js > /tmp/pixelgp-before-071.js
RACE_SOURCE_BASELINE=/tmp/pixelgp-before-071.js node tests/validate-pedal-races.mjs
DRIVING_SOURCE_BASELINE=/tmp/pixelgp-before-071.js node tests/browser-shared-driving.cjs
git show d417b94:index.html > /tmp/pixelgp-before-071.html
DRIVING_HTML_BASELINE=/tmp/pixelgp-before-071.html node tests/browser-release.cjs
```

Todas las comprobaciones nativas usan Playwright/Chromium como herramientas de desarrollo, no dependencias del juego.

## Límites y próximo trabajo

Esto es 30.1: componente de vehículo compartido, no una carrera completa headless, dos salas aisladas, servidor WebSocket ni online publicado. Geometría/contactos/progreso/eventos y RaceState todavía están por extraer. Próximo tramo 30.2: datos/consultas de las catorce pistas sin render, antes de cerrar la carrera compartida y construir salas.

La aceptación humana del manejo/audio, mandos físicos, latencia/reconciliación, hardware modesto y Pages público siguen pendientes. Las pruebas locales y el push no acreditan despliegue de Pages; el acceso público se encontraba bloqueado por el proxy del entorno.
