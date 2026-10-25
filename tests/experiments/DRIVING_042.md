# Comparación de conducción 0.42

Base: commit `1df936d` (0.41). Variante elegida y segunda alternativa ejecutadas con el código real en el harness, sin cambiar pistas, máximas ni resistencia del terreno. `node tests/experiments/compare-driving.mjs` repite el experimento leyendo la base desde Git; necesita permitir procesos locales de Git.

## Medidas de respuesta

| Condición | 0.41 | Elegida | Permisiva descartada |
|---|---:|---:|---:|
| Balanced 0–100 | 1,59 s | 1,28 s | 1,14 s |
| Balanced 95 % de máxima | 4,40 s | 3,32 s | 2,86 s |
| Giro de entrada a máxima en 0,3 s | 0,140 rad | 0,241 rad | 0,303 rad |
| Radio efectivo de esa prueba corta | 417,5 | 242,1 | 192,2 |

La prueba corta incluye la entrada progresiva del volante y la inercia: esos radios no son radios de giro estabilizados. El cambio elegido aumenta el ángulo inicial un 72 % y conserva frenado útil, límites de giro y máximas. La aceleración se integra a 120 Hz; la trayectoria se mide con `physics`, sin una fórmula de resultado preescrita.

## Primera vuelta con una política de dirección común, 60 Hz

| Perfil | Sunset con frenado | Sunset siempre acelerando | Dusty con frenado | Dusty siempre acelerando |
|---|---:|---:|---:|---|
| 0.41 | 40,72 s | 57,55 s / 19,03 s fuera | 23,93 s | Sin vuelta válida en 90 s |
| Elegido | 37,42 s | 38,45 s / 4,27 s fuera | 21,57 s | Sin vuelta válida en 90 s |
| Permisivo | 36,22 s | 34,38 s / 1,78 s fuera | 20,55 s | Sin vuelta válida en 90 s |

El controlador de dirección es el mismo; el experimento sustituye solo los controles devueltos por la CPU para la condición de acelerador permanente, sin freno ni freno de mano. No es un jugador humano ni una demostración de trazada óptima. En Dusty el acelerador permanente se sale y pierde gates: no se inventa un tiempo de vuelta para esa condición.

La opción más permisiva se descarta porque la condición de acelerador permanente gana a la de frenado en Sunset. La elegida reduce la rigidez anterior y mantiene una ventaja del frenado en esta referencia. La decisión sigue abierta a la sensación humana.

## Error de checkpoint confirmado durante la prueba de grupo

En Dusty, TRAZO cruzó CP3 con centro lateral 46,37 y parte del coche todavía dentro de la franja de ancho 84. El test de centro anterior lo rechazó: primera vuelta 44,33 s. Con intersección exacta y huella lateral común de diez unidades: 23,17 s; media de carrera 28,73→21,79 s. No se cambia potencia ni se regalan gates distantes. `validate-gate-contact.mjs` reproduce el caso y rechaza un cruce entero por fuera, el sentido incorrecto y los premios repetidos.
