# Auditoría 0.83 — paisajes y legibilidad

Base real main `7311b4353e89c9d2d255cc5e67fe32e47c5584e3`, build 0.82, árbol limpio y remoto comprobado antes de crear `work/scenery-landmarks-083`. Revisados renderer, colocación/cachés, HTML/estilos/recursos, materiales/geometría compartidos, pruebas y plan/notas. Se continúa 36.3, recomendado por la entrega anterior para alternar tras el trabajo online.

## Cinco oportunidades priorizadas

1. Los objetos pequeños distinguen los temas, pero los espacios grandes contienen principalmente textura repetida. Se implementan referencias ambientales de escala en cinco temas; no se afirma que los catorce escenarios estén rediseñados.
2. Una decoración grande colocada con el radio de un árbol invade el corredor o tapa otras piezas. La reserva ahora contiene todo el dibujo y su sombra, margen adicional de recuperación y separación de objetos pequeños. Se comprueban huellas y píxeles protegidos.
3. Los fondos ya están cacheados; añadir un renderizador o capas por frame sería un coste innecesario para elementos estáticos. Se conserva ese sistema y el presupuesto de decoración, sin assets/dependencias nuevas.
4. La variedad de paisajes no reemplaza la variedad jugable: siguen tres pistas de ancho uniforme y la sensación de frenada/derrape necesita aceptación humana. Esta entrega no retoca fuerzas ni promete mejores tiempos de vuelta.
5. La presentación online propia de 0.82 requiere pruebas humanas y públicas, y replay completo exige ampliar el contrato de entradas. No se presenta ese trabajo como terminado ni se cambia el servidor por una entrega de escenarios.

## Resultado y límites

Trece elementos en Neon Harbor, Dusty Mesa, Volcano Ring, Coastline Run y Rally Canyon; Detallado/Retro. Rendimiento y nueve temas conservados. Capturas de los cinco paisajes revisadas en Chromium; prueba de cámara enfocada es instrumentación, no una vuelta humana. Las carreras/regresiones automatizadas se documentan por separado en `tests/experiments/LANDMARKS_083.md`.

Física p6/b1/s1, catorce trazados, cuatro coches, CPU, audio, récords, modos y huella del servidor conservados. Sin despliegue de Render ni verificación del sitio público en esta entrega. Siguiente recomendado: fase 25, comparación de conducción en curva y recuperación sobre el motor compartido, alternando después con iluminación/audio/pistas.
