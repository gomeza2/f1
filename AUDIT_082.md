# Auditoría 0.82 — respuesta propia online

Base real main `627fe622a996410aff8c7d253dffd9f00c9a48f6`, build 0.81 y árbol limpio. Remoto confirmado y rama `work/local-response-082`. Leídos transporte/adaptador, conducción/geometría/reglas/sesión, UI, pruebas y documentación vigente. La siguiente entrega recomendada de red era reducir la respuesta retardada sin crear otra física.

## Oportunidades verificadas

1. El coche propio usaba la interpolación retrasada de los rivales. Comparar anticipación acotada sobre el núcleo real frente a la presentación clásica dio menor espera de giro y menor error medio de pose en siete streams controlados. No demuestra comodidad humana ni ping real.
2. Los mensajes actuales reconocen la secuencia recibida pero no dicen el tick exacto donde se aplicó cada control. No se puede afirmar replay determinista con ese contrato. Se entrega anticipación/reconciliación visual conservadora y se mantiene ese límite explícito.
3. Freno de seguridad sostenido sin mano, al ser un input fresco, podía activar reversa después del retardo original. Se reprodujo en los cuatro modelos y se corrige con freno + mano. La ausencia de mando entra en esa misma protección.
4. La anticipación de un solo coche no resuelve contactos conjuntos. Guards conservadores de tráfico/impactos/barreras, fallback clásico y revisión de geometría tras corrección evitan prometer contactos futuros fiables. No se debilitan para pasar pruebas.
5. Polvo/marcas online usaban coordenadas autoritativas pese a dibujar otras poses; feedback ahora se calcula con la pose presentada sin cambiar campos físicos/temporales del coche recibido. Gráficos de escenarios, audio y aceptación del manejo siguen abiertos.

Backend/protocolo/huella y p6/b1/s1 conservados, sin despliegue de Render desde aquí. Validación pública sigue pendiente por el bloqueo CONNECT del proxy observado anteriormente; las pruebas son locales/simuladas. Evidencia: `tests/experiments/RESPONSE_082.md`. Próximo recomendado: alternar con presentación/escenarios de fase 36, manteniendo guardas y recogiendo prueba humana de respuesta.
