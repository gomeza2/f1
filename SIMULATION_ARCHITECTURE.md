# Simulación compartida — estado 0.71

`driving-core.js` es el primer bloque extraído del motor real. Lo usa `script.js` para conducir en el navegador y puede importarse directamente en Node. No necesita DOM, Canvas, audio, almacenamiento, reloj externo ni dependencias de npm.

**Todavía no es una carrera completa ni un servidor.** Geometría/barreras, consultas de terreno, colisiones, checkpoints/vueltas, reloj de carrera y eventos permanecen en el adaptador actual. No hay salas online disponibles.

## Una implementación de conducción

El módulo contiene los modelos, parámetros de conducción/recuperación y materiales canónicos. Las superficies conservan apariencia y respuesta en una definición común. El navegador mantiene alias a esas reglas y funciones; no conserva una segunda fórmula de aceleración, giro o frenado.

API versión 1, distinta de la versión física p6/balance b1/reloj s1 del juego. Reglas por instancia copiadas y congeladas; cada coche tiene su propio estado mutable serializable. Intercalar dos motores/coches no comparte steer, velocidad, temporizador de reversa ni posición.

| API | Responsabilidad |
|---|---|
| `create()` | Motor independiente con reglas inmutables. |
| `createState(model)` | Estado de movimiento nuevo; rechaza modelos desconocidos. |
| `humanControls(state, input, dt, allowReverse=true)` | Filtro de dirección, intención/retardo de reversa y comandos de pedales. `false` impide reversa por un freno de seguridad. |
| `stepVehicle(state, controls, model, surface, safeSpeed, dt)` | Velocidad firmada, manejo/yaw, derrape escalar previo, ruedas y posición. |
| `accelerationAtSpeed`, `vehicleHandling` | Consultas compartidas usadas también por la planificación CPU actual. |
| `applyGroundDrag` | Resistencia firmada; el adaptador consulta primero la geometría real del terreno. |

Las funciones de bajo nivel reciben estado/contexto e inputs completos y validados. No son un parser de mensajes de red; modelos, terreno, velocidad de curva y dt no deben aceptarse del cliente como autoridad.

```js
const {create} = require('./driving-core.js');
const engine = create();
const car = engine.createState('speed');
const dt = 1 / 60;
for (let tick = 0; tick < 300; tick++) {
  const command = engine.humanControls(car, {
    throttle: 1, brake: 0, steering: 0, hand: false
  }, dt);
  engine.stepVehicle(car, command, engine.rules.models[car.model],
    'asphalt', 220, dt);
}
console.log(car.speed); // 260: recta abstracta, sin carrera ni colisiones.
```

El formato clásico/CJS se elige para conservar los scripts estáticos de Pages y permitir `require` sin bundler. No obliga a mantener ese formato si la próxima extracción necesita una alternativa mejor.

## Orden conservado en el cliente

El controlador genera comandos; la geometría aporta material/curva; el módulo avanza el vehículo; el adaptador aplica terreno/barreras y progreso; los contactos entre coches se resuelven después del grupo, manteniendo el orden existente. La CPU usa la misma conducción compartida.

No se cambian fuerzas, topes, agarre, trayectoria, reglas de reversa, pistas ni récords p6/b1/s1. No hay un derrape lateral nuevo. Las seis funciones matemáticas trasladadas conservan su cuerpo original y las pruebas comparan además la ejecución real, no solo sus textos.

## Carga y pruebas

HTML carga `driving-core.js` antes de `script.js`, con la misma consulta de versión de recursos. Si un HTML previo en caché omite la nueva etiqueta pero obtiene el main nuevo, el arranque carga la dependencia relativa a ese script y espera antes de habilitar la carrera. Si falla, muestra recarga necesaria y bloquea iniciar. No se incluye otra copia de la física como fallback.

Al cambiar versión de entrega, revisar las URLs del HTML y la versión de dependencia del bootstrap; `browser-release` comprueba su coherencia, el HTML anterior y el fallo de carga. Esto no fuerza renovar todos los HTML ya cacheados ni prueba Pages público.

`validate-shared-driving` compara 140 casos/3.164 pasos de cuatro modelos, siete rutas y cinco secuencias contra la física 0.70 real; además grip/resistencia de los siete materiales y estados aislados, con acceso a DOM/almacenamiento/reloj prohibido al módulo. `browser-core-vectors` compara 28 vectores/140 snapshots entre Node y Chromium: velocidad/timers/flags exactos, y redondeo de posición/ángulos acotado a 1e-10 (máximo observado 1,42e-14). No se promete igualdad binaria universal entre runtimes. `browser-shared-driving` comprueba 16 escenarios de teclado, 96 snapshots y 3.552 llamadas observadas al paso compartido, frente a cero del motor anterior.

## Próximos bloques para online

1. **30.1 — vehículos compartidos: integrado.** Paridad de este componente, sin declarar cerrado el núcleo de carreras.
2. **30.2 — pistas/geometría: pendiente.** Datos de 14 pistas, secciones/materiales, consultas espaciales y barreras sin Canvas/DOM; geometría inmutable compartible entre carreras.
3. **30.3 — carrera y eventos: pendiente.** Contactos, gates/vueltas, resultados, reloj y eventos numerados. Mantener el orden de decisiones/pasos de cada coche al adaptar los rivales existentes.
4. **30.4 — aislamiento de carreras: pendiente.** Dos `RaceState` completos sin globals compartidos, replay/paridad con el juego y pruebas de ciclo de vida. Dos vehículos aislados no acreditan dos salas completas.
5. **32/33 — salas, sincronización y despliegue: pendiente.** El primer online privado puede empezar con humanos 2–4; los controladores CPU offline pueden seguir como adaptadores sobre la misma física, sin bloquear toda la red por rehacer la IA.

Contratos de red y criterios de publicación en [ONLINE_DESIGN.md](ONLINE_DESIGN.md). Ningún ranking local se presenta como resultado online validado.
