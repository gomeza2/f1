# Auditoría 0.84 — práctica y control medible

Main real `52b7300bab035335111136f1ce1bbf00179db08d` / build 0.83, limpio y coincidente con origin/main antes de crear `work/sector-practice-084`. Revisados HTML/CSS/script, conducción/geometría/reglas/sesión, audio/interfaz de entradas, historial/roadmap y pruebas de manejo/local/táctil/online. Se continúa el frente de conducción recomendado en 0.83.

## Cinco oportunidades confirmadas

1. No existía una forma de repetir una curva desde una entrada comparable: reiniciar empezaba toda la vuelta. Se entrega un modo de sectores para practicar conducción real, sin CPU ni reconstrucción de fondos por intento.
2. El coche se desplaza según heading: el campo escalar drift no es una simulación de velocidad lateral. El ensayo 0.63 fue rechazado por ritmo/contactos; no se reactiva ni se presenta como física aprobada. Una sustitución necesita comparar planificación/tráfico además del giro aislado.
3. Aplicar la función normal de guardar vueltas a un tramo con progreso sembrado crea un récord parcial falso. El modo bloquea el guardado global/fantasma/puntos y mantiene sus mejores exclusivamente en memoria, por sector y velocidad de entrada.
4. Reutilizar la pausa como final de intento puede dejar botones/táctil deshabilitados en el siguiente. Se corrigió el restablecimiento en repetición y transiciones a otros modos; se verifican entradas CDP y controles reales de teclado.
5. El primer panel de práctica ocupaba demasiado alto en horizontal. Capturas revisadas llevaron a una cuadrícula compacta y texto activo más breve; sigue fuera del lienzo. No se declara cómodo en teléfonos físicos solo por comprobar geometría.

## Decisión y límites

La nueva entrega añade una forma jugable de aprender y comparar, sin retocar coeficientes a ciegas. Catorce pistas y cuatro coches usan el mismo núcleo que CPU/online; 48 maniobras vuelven a confirmar que frenar/soltar/mano tienen costes distintos. Eso no invalida el feedback humano ni aprueba por sí solo la diversión.

Núcleo físico y huella online intactos, sin cambios de backend/hosting ni despliegue público. Evidencia y límites en `tests/experiments/PRACTICE_084.md`. Próximo: entrada/salida de curva y recuperación con estos escenarios, manteniendo abiertas audio, pistas, gráficos y sincronización pública.
