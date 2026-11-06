# Auditoría 0.86 — Champion Road

Base main `82c10d3635e01cfa1f9161b63f2be81f553021b1` / 0.85, limpia y remoto coincidente; rama `work/champion-sections-086`. Revisados datos/algoritmos de pistas, secciones, barreras/gates/superficies, controles, sesión, renderer, archivo de récords, pruebas/fixtures, manifiesto/protocolo y operación Render. Se aplica la guía del entorno sin eludir la política de red.

## Cinco oportunidades confirmadas

1. Champion seguía con ancho uniforme y vuelta relativamente corta. Recorrido revisado, ancho 72–120, pianos presentes/ausentes, recta amplia e interior técnico; mantiene nombre/material/tema.
2. La primera propuesta de retorno este se acercaba demasiado al ramal inferior. En escala 1,9 el corredor se superponía ~12,1 unidades; incluso escalar a 2,1 dejaba ~2,7 de superposición. Se separaron los ramales en los datos antes de aceptar una escala, en vez de esconder el defecto con colores.
3. Los tiempos del recorrido antiguo no pueden competir con el nuevo. Layout @3/road r1, archivo de tiempos antiguo preservado y fantasma viejo fuera de la nueva identidad.
4. Algunos adaptadores históricos estaban desfasados desde práctica/online. Se normalizan sus hooks opcionales de UI y audio remoto al reconstruir referencias offline, sin tocar físicas/fixtures históricos. Revisiones de pista aceptadas solo por hash explícito; pruebas dedicadas fijan trece rutas restantes y la geometría original.
5. El servidor comparte el archivo completo de pistas: un cambio de datos altera su huella aunque las fuerzas sean iguales. Backend/manifest alineados; usuario debe desplegar el commit en Render. No se presenta un push de Git como despliegue público ni se elude la incompatibilidad.

## Resultado y límites

Champion 8.158,07 unidades, 12 gates y cinco perfiles; dos pistas uniformes pendientes. Conducción/modelos/IA/audio/controles y modos conservados. Referencia CPU Normal ~44 s, sin prometer ese tiempo humano. Evidencia completa en `tests/experiments/CHAMPION_086.md`.

Sin acceso al panel de Render ni prueba pública de su despliegue. Siguiente recomendado: audio de fase 26, alternando con las dos pistas uniformes y gráficos; manejo lateral y aceptación humana siguen abiertos.
