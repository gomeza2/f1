# Auditoría 0.80 — cliente online integrado

Base real main `fb4db69164f2e325b5788036ecee4b52f3923ec4` / 0.79, árbol limpio, remoto confirmado con fetch. Rama `work/online-client-080`. Leídos adaptador/HTML/CSS, núcleos y API de sesión/reglas, servidor/protocolo, pruebas, README, notas, roadmap y diseños de simulación/online. No se sustituye la base por otro motor.

## Prioridades contrastadas

1. **Backend sin cliente del juego:** confirmado en 0.79. Mayor siguiente entrega del tramo online es conectar los modos existentes al servidor, no construir una segunda física.
2. **Identidad del piloto:** la cámara/HUD actuales asumían asiento cero. En una sala cada navegador debe usar el `pilotId` asignado; comprobados los cuatro asientos, incluido teclado del tercero.
3. **Presentación incompleta:** snapshots físicos no traen partículas. La primera carrera de prueba expuso `car.particles is not iterable`; ahora el adaptador crea/preserva propiedades visuales y reutiliza feedback/renderer sin mandarlas al servidor. Etiquetas cortas con número de piloto, nombres completos en sala/resultados.
4. **Reconexión con inputs anticipados:** prueba adversa confirmó controles enviados al abrir un socket nuevo, antes de completar resume. Se bloquea el envío hasta recibir `session` y se prueba explícitamente el orden hello/welcome/resume/session.
5. **Alojamiento y latencia:** no existe endpoint público predeterminado. Receta Render sin suspensión + Pages y soporte `PORT` preparados; no hay despliegue ni coste/ping medido. La interpolación inicial añade margen de presentación, sin predicción local; requiere siguiente fase y validación humana.

## Conservación y límites

Catorce pistas/cuatro modelos, CPU, físicas p6/b1/s1, temporada, récords, contrarreloj/fantasma, táctil y local 2–4 conservados. Comparativa nativa con script auténtico 0.79: mismos 3552 pasos, 96 estados y HUD. Núcleos físicos sin cambios. No se anuncian mejoras humanas de manejo/audio por incorporar online; siguen abiertas las fases correspondientes.

Nuevos archivos de producto: `online-client.js`, `online-config.json`, generador/verificador del manifiesto y `render.yaml`. Adaptador en `script.js`, entrada/sala en HTML y estilos. Guías y pruebas actualizadas; detalle reproducible en `tests/experiments/ONLINE_CLIENT_080.md`. Publicación del código en GitHub no equivale a desplegar el servidor.
