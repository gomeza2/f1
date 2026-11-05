# Auditoría 0.79 — siguiente entrega después de sesión compartida

Base real: main `3ecaa678587162b9cb7bfc00e68dd51dcfb62639` / build 0.78, árbol limpio al iniciar, rama `work/private-rooms-079`. Historial reciente: sesión compartida, Rally Canyon, contrarreloj/fantasma, táctil y reglas de contactos. No se parte de la antigua build 0.40. README/roadmaps/notas/diseño online/arquitectura contrastados con módulos y pruebas; HTML, estilos, adaptador principal, núcleo compartido y recursos actuales revisados. Sin workflow de publicación en el árbol inspeccionado. Frontend estático conservado.

## Cinco oportunidades y decisión

1. **Online sin transporte:** confirmado: 0.78 ejecutaba carreras independientes en Node, pero carecía de servidor/salas. Implementar 32.1 con la simulación existente tiene contrato comprobable y prepara la petición reiterada de online.
2. **Abandono ausente en núcleo:** no había retiro separado de llegada; marcar `done` por pérdida de red inventaría tiempos/puntos y dejar un coche inmóvil bloquearía contactos. Añadido retiro DNF y pruebas específicas.
3. **Sincronización visual:** snapshot disponible, pero sin cliente conectado/cámara por identidad/interpolación/corrección. Se conserva pendiente 33; no poner botón vacío ni llamar terminado al online.
4. **Conducción y audio:** aceptación humana sigue abierta; el test físico no prueba diversión/timbre. No cambiar fuerzas o motor a ciegas mientras se integra red. Derrape lateral completo sigue pendiente; esta entrega conserva el modelo probado p6/b1/s1.
5. **Variedad/claridad gráfica:** 14 pistas conservadas, 11 con ancho variable; Champion Road, Meadow Run e Industrial Mix aún uniformes. Ya existe trabajo real de Rally 0.77. Seguir alternando pistas/gráficos con red, sin concentrar el proyecto solo en CPU.

## Riesgos tratados

Autoridad del cliente sobre reloj/posición/resultado, mensajes malformados/duplicados/antiguos, listos ante cambios de configuración, entrada congelada que retrocedería por frenado de seguridad, credenciales compartidas/antiguas, carreras concurrentes mezcladas, DNF con puntos, sobrecarga que falsearía tiempos. Esquemas, revisión, watchdog sin reversa, token privado rotatorio, sesiones propias y cancelación cubren esos casos comprobados; no constituyen una garantía absoluta de seguridad.

La versión local conserva modos/carreras reales, pantalla completa, controles y rutas /f1/. Cuatro navegadores usan el servidor por WebSocket y completan vueltas, **con clientes de protocolo instrumentados, no el renderer/UI de carreras online**. Ver `tests/experiments/ROOMS_079.md`. No se afirma inspección humana del manejo ni despliegue en GitHub Pages o de un servicio público.
