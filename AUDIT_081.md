# Auditoría 0.81 — URL de servidor y fiabilidad del cliente

Base real: main `422cd52b08684505e5cce8b9ef0ee205f2fe477a`, build 0.80, árbol limpio y remoto confirmado antes de crear `work/online-connection-081`. Revisados transporte/adaptador/HTML, manifiesto, roadmap/documentación de hosting y pruebas existentes. Se conserva el servidor y la simulación; no se necesita una física paralela.

## Prioridad contrastada

- URL aportada por el usuario faltaba en la configuración predeterminada; se incorpora sin borrar elecciones de servidor guardadas.
- Timeout inicial fijo de cinco segundos y ausencia de reintentos pre-handshake no atendían el arranque suspendido de Free. Nuevo presupuesto de 90 s, cancelación visible y protección frente a repetir una creación incierta; plazo de reconexión activa separado.
- El timeline de interpolación se reconstruía desde cada recepción: una entrega tardía podía hacer retroceder el render. Comparación con módulo auténtico de `422cd52`: **11 retrocesos frente a 0** con los mismos 31 snapshots y muestras visuales cada 10 ms. No implica mejor ping ni conducción humana aprobada.
- La reconexión necesitaba conservar límite también después de welcome si no llega session. Prueba específica y cierre acotado añadidos.
- Hosting público, predicción/reconciliación y sensaciones de conducción siguen sin aceptación humana. El proxy devolvió CONNECT 403 antes de Render, incluso después de que el usuario confirmara que podía abrir el servicio. No se interpreta como fallo de su servidor ni se elude la restricción.

Build/recursos 0.81, protocolo y huella física conservados. Cuatro navegadores completan vueltas con el backend local, teclado mantiene 3552 pasos/96 estados idénticos frente a 0.80, local 2–4 y récord/fantasma se conservan. Detalle reproducible y límites en `tests/experiments/CONNECTION_081.md`. El primer tramo 33.2 queda integrado, sin cerrar predicción, latencia pública ni las fases de manejo/audio/pistas/gráficos.
