# Audio de carrera 0.87 — evidencia y límites

## Auditoría previa

Leídos código de audio/integración, RELEASE_NOTES.md, ROADMAP_EVOLUCION.md y AUDIT_086.md antes de editar. Fase 26 ya incluía síntesis original de dos osciladores, cuatro perfiles, seis marchas/histéresis, carga/crucero y reversa adaptada, ruido de deslizamiento/terreno, señales de salida/checkpoint/vuelta/récord/llegada/resultados, ocho voces transitorias, compresor y volúmenes general/motores/efectos persistidos. No se reconstruyen esas funciones. Faltaban ambiente temático, materiales más diferenciados, presencia CPU y separación de roce/golpe.

## Implementación

- Se conserva el motor: retención añade cuerpo y color, carga durante frenado se atenúa; pausa borra solo la muestra previa de velocidad para evitar un falso salto de aceleración al regresar. Marchas son presentación sonora, no caja física.
- Seis perfiles de rodadura/deslizamiento: frecuencia, Q, nivel, velocidad de reproducción y squeal según material real, velocidad y drivingSlip existente. Asfalto tiene rodadura suave, tierra granular, pasto oscuro e hielo agudo y tenue; grava/volcánico conservan identidad. Parado no rueda; recta sin giro/mano no inventa derrape.
- Catorce perfiles ambientales de ruido filtrado/modulado: una sola capa por carrera, con reducción al 30% durante voces de eventos. Son texturas sintéticas, no grabaciones de fauna, público o ciudad.
- Un motor CPU cercano, compartido entre oyentes locales, radio 300 unidades, nivel máximo 22% antes de normalización. Carga aproximada a partir de velocidad/freno disponibles, no telemetría de acelerador CPU. No aumenta voces por cantidad de rivales; no altera sus controles.
- Contacto de intensidad inferior a .3: ruido breve de roce; fuerte: transitorio y cuerpo grave según energía emitida por simulación. No se inventan impactos por estar cerca de una barrera. No se añade roce tangencial continuo que la simulación no mide.
- Llegada humana con motivo de tres notas; tonos de vuelta distinguen P1–P4. Salida/récord existentes preservados. Ambiente y superficies usan Efectos; CPU usa Motores; sin controles nuevos.
- Blur silencia inmediatamente el master mediante rampa y libera transitorios; foco recupera únicamente si el estado de carrera permite audio. Ocultar pestaña mantiene la política previa de pausa. Menú, pausa, mute y voces no se reinician en bucle.

Presupuesto persistente máximo: 4 motores humanos + 1 CPU (dos osciladores cada uno), 8 bucles de textura humanos + 1 ambiental; ocho transitorios como antes. Contexto/grafos reutilizados. Sin archivos remotos, nuevas dependencias ni muestras con licencia externa.

## Pruebas ejecutadas

- `node tests/validate-audio.mjs`
- `node tests/validate-audio-mix.mjs`
- `node tests/validate-engine-timbre.mjs`
- `node tests/validate-audio-environment.mjs`
- `node tests/browser-audio.cjs`
- `node tests/browser-audio-mix.cjs`
- `node tests/browser-audio-environment.cjs`
- `node tests/browser-engine-cruise.cjs`
- `node tests/browser-release.cjs`
- `node tests/browser-online-game.cjs`
- `node server/scripts/client-config.cjs --check`

Chromium usa Web Audio real. Escenas de materiales fijan posición/velocidad y consultan terreno de producción: no son conducción humana. Medidos RMS de rodadura ~0,000139 asfalto / 0,000682 pasto / 0,000682 tierra / 0,000289 hielo; espectros/filtros distintos, no igualdad perceptiva prometida. Ambiente y derrape audibles en analizador. Escena de cuatro humanos a volumen máximo: pico muestreado ~0,094; pausa/OFF/menú RMS 0. No equivale a un límite absoluto de pico en toda carrera posible.

La prueba de mezcla anterior esperaba silencio total al poner Motores=0 sobre asfalto: ahora verifica Motores=0 y Efectos aún audibles, porque rodadura/ambiente son efectos reales. Efectos=0 y General=0 mantienen sus aserciones de silencio. La prueba antigua de dúo ahora espera terminar la carga antes de omitir la cuenta regresiva.

## Escucha humana pendiente y siguiente fase

Probar auriculares y altavoz de teléfono: acelerar/cambiar/retener/frenar con cada modelo; máxima sostenida 60 s; tierra/pasto/hielo; roce/golpe; vueltas/récord/llegada; cuatro humanos con CPU cercana; volumen bajo y alto. Valorar fatiga, legibilidad de señales, percepción de velocidad y balance ambiental. iOS/Safari, interrupciones del sistema y latencia física no comprobados. No se aprueba calidad sonora por RMS ni se cierra fase 26 por automatización.

Siguiente: ajustar timbre/balance con esa escucha y luego perfilar una sesión sostenida en móvil. Fuerzas, IA, trazados, modos, campeonato y claves de récord no cambian; manifiesto 0.87 conserva protocolo/huella física. El backend 0.86 compatible no necesita actualización física por este audio; el arreglo de alojamiento previo sigue requiriendo su propio despliegue. No se verificó publicación pública.
