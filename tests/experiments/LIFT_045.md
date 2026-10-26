# Comparación 0.45

Base real 0.44 `2409e5c`, curvas/anchos existentes. Política de dirección del rival Normal, Balanced, solo y sin tráfico, paso 1/60, una vuelta o 75 s. Se compara planificación normal frente a acelerador siempre pulsado/freno y freno de mano desactivados. Es un experimento de controles, no una prueba humana ni la trazada óptima.

Las variantes conservan aceleración/volante. Reducen fuerza lateral gradualmente solo sobre el 58 % de la máxima, eliminan la desaceleración automática según la próxima curva y aumentan retención de 20 a 30 unidades/s al soltar.

| Reducción lateral en máxima | Sunset normal/gas continuo | Neon normal/gas continuo | Dusty normal/gas continuo |
|---|---|---|---|
| 0, base sin cambios | 37,42 / 37,47 | 23,27 / 20,50 | 21,57 / 28,13 |
| 16 %, elegida | 37,72 / 45,90 | 23,38 / 20,75 | 21,83 / 27,07 |
| 24 %, descartada | 37,92 / sin vuelta válida en 75 s | 23,53 / 20,67 | 21,98 / sin vuelta válida en 75 s |

Con 16 %, el control planificado no sale del ancho legal. Gas continuo pasa 11,62 s fuera en Sunset y 6,88 en Dusty; Neon permite gas continuo y la política conservadora pierde 2,63 s. No se ajusta todo el juego hasta que cada curva exija freno: ese caso deja abierta una oportunidad de mejorar la trazada/ritmo del rival en una pista rápida. El 24 % se descarta porque penaliza demasiado esta política de conducción continua en dos pistas. La respuesta inicial del volante y aceleración no cambian.

Para repetir: `git show 2409e5c:script.js > /tmp/script-044.js` y `node tests/experiments/compare-lift.mjs /tmp/script-044.js`. Los récords nuevos usan `:p5`, preservando `:p4` y anteriores. `validate-lift-demand.mjs` comprueba la retención, frenado y penalización de gas continuo con el código vigente.

## Crucero de audio

`browser-engine-cruise.cjs` renderiza seis segundos al máximo en cada modelo mediante OfflineAudioContext; mide los dos finales. El régimen queda estable en sexta, sin alternar marchas. Filtro pasa-altos de 3 kHz: fracción de energía Balanced 0,03182 → 0,000572; Speed 0,11504 → 0,003333. Es energía filtrada, no un corte espectral ideal ni un juicio de calidad. No se detectó recorte en las muestras. Con `ENGINE_AUDIO_BASELINE` se puede comparar el `engine-audio.js` conservado de 0.44.

La revisión reduce armónicos, baja el tono fundamental del escape y atenúa brillo/volumen al acercarse a máxima. También evita ruido de derrape basado solo en el valor de drift cuando no hay giro ni freno de mano. Escucha humana, parlantes/auriculares y móvil siguen pendientes.
