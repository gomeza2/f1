# 0.75 — móvil jugable, fase 42.1

## Base y decisión

Base publicada/revisada: 0.74 `705aaece817b4de3662ec2dc4de83648937b1fe1`. Primero se cerró y publicó el bloque de reglas compartidas; después se crea esta entrega separada para el bloqueo móvil confirmado en `AUDIT_074.md`.

Se eligen botones por correspondencia con los comandos del arcade y espacio de pulgares: dos de dirección y tres de pedales/mano, con captura independiente de cada puntero. No se implementó ni comparó humanamente un joystick; queda como alternativa futura si aporta más precisión. No se altera el motor para que el táctil parezca funcionar.

## Implementado y alcance

P1 táctil en individual o en local asignado a teclado. P2–P4 siguen teclado/mandos; un mando asignado a P1 en local oculta el panel. Gas/freno se combinan con el teclado por máximo, dirección se acota a −1..1 y mano es booleana; después se usa el mismo `humanControls` y las reglas compartidas. Preferencias auto/on/off, tamaños 56/72/88 limitados al espacio y disposición izquierda/derecha. Persistencia versionada/validada y restauración; errores de storage no impiden jugar durante la sesión.

Pointer Events con captura, varios dedos, dos dedos sobre el mismo botón y arrastre fuera. Limpieza en up/cancel/lostcapture, blur, pausa, resize/fullscreen, cambio de preferencias, menú y reinicio. Gestos bloqueados únicamente sobre los botones; la página y el HUD no reciben un preventDefault global. Ajustes se abren en pausa y requieren SEGUIR manual.

Panel separado del lienzo y telemetría. Cámara individual táctil usa el rectángulo real en vertical/horizontal, escala 1,15 y anticipación 28–90 según velocidad (−28 en reversa), manteniendo el coche legible. Cercana/panorámica conservadas. Buffer máximo por eje 2560, DPR ≤2/calidad conservados. Teclado/escritorio siguen sus dimensiones/encuadre anteriores.

No hay posiciones libres/drag de botones, dirección analógica, varios asientos táctiles ni promesa de comodidad para cuatro personas en teléfono pequeño. El modo local sigue admitiendo 2–4 y combinación de fuentes.

## Pruebas superadas

- `browser-touch.cjs`: Chrome DevTools Protocol `Input.dispatchTouchEvent` con múltiples puntos genera los Pointer Events reales. Los comandos no se sustituyen por teclado ni por llamadas directas al motor. Solo la preparación de escena/reloj se instrumenta para repetir maniobras.
- Tres dedos simultáneos: gas + giro + mano, dirección filtrada y movimiento; cancelación a cero. Mano+gas desde reposo mantiene velocidad cero. Gas+freno prioriza freno. Freno sostenido parado alcanza reversa −28 y HUD R.
- Dos dedos en el mismo acelerador: soltar uno conserva el otro. Captura al arrastrar hacia el lienzo, release fuera y touchCancel liberan correctamente. Pausa/foco/resize/reinicio/menú limpian entradas y retardo de reversa; no se mueve el coche durante pausa.
- Pantallas 844×390, 390×844, 320×568 y 1280×720: lienzo ocupa el panel, no invade controles/HUD y no hay scroll de carrera. Coche visible a escala táctil y anticipación comprobada en movimiento. Vista alta adicional conserva ambos ejes del buffer ≤2560.
- Activar/ocultar, tamaño/disposición invertida, reload y datos corruptos: valores conocidos y controles presentes según fuente. Ajustes no reinician al pulsar R; cierre/manual resume y foco. Fullscreen y Escape del diálogo conservan la pantalla completa hasta salir explícitamente.
- Local: P1 gas táctil y P2 teclado simultáneos, otros dos asientos neutrales; movimiento de ambos. P1 con mando estándar emulado oculta panel y conserva gatillo analógico 0,8.
- `browser-shared-driving`: 16 escenarios / 96 snapshots, cuatro modelos/cuatro pistas y 3.552 pasos, idénticos a 0.74 para entrada de teclado. No se otorga una nueva fuerza ni ventaja al táctil; son comandos existentes.
- `browser-local`: 2–4 teclados, modelos/cámaras/HUD, pausa/reinicio/resultados/siguiente, fullscreen/cinco resoluciones y cuatro mandos emulados con desconexión/reconexión/asignación exclusiva, conservados.
- `browser-paddock`: cinco tamaños, correr y elegir coche en primer viewport de escritorio, menús/foco/local sin desbordes.
- `validate-events`, `validate-integration` (IDs/recursos/versiones, diez originales y 70 perfiles) y `validate-countersteer` (doce casos, hash histórico/30–120 Hz) superados. La última prueba preserva la mejora anterior, no introduce un contravolante nuevo.
- `browser-release`: recursos reales de 0.75 bajo `/f1/`, carga/caché/HTML anterior/módulos faltantes, teclado/cuenta regresiva/pausa/reinicio/menú y P3 local. No confirma Pages público.
- Capturas revisadas en vertical y horizontal: pista/coches legibles, botones fuera del área de conducción y telemetría sin cubrir.

Los módulos `driving-core.js`, `track-core.js`, `race-rules.js` y `engine-audio.js` no cambian. El tramo entre `const AI_DRIVERS=` y `function getTrackPath` conserva SHA256 `44a446af69efc9e9695df654cadc4be29c243f217068bf099b39c7ae340d40f1` de 0.74. Física p6/b1/s1 y récords conservados. No se repiten ni se vuelven a contar como nuevas las carreras emparejadas de 0.74.

## Fallos de prueba corregidos

El primer escenario pretendía acelerar desde parado con mano sostenida: la regla existente disipa más fuerza de la que aporta el motor y mantiene cero. Se cambió la escena de derrape a un coche en movimiento y se añadió la comprobación explícita de reposo; se conservó el freno de mano.

El observador de regresión suponía que un script sin `drivingCore.stepVehicle` directo era anterior al módulo. Desde 0.74 la llamada está delegada a reglas, aunque sigue ejecutando 3.552 pasos compartidos. Se identifica la factoría compartida en el baseline y se verifica esa cuenta; la comparación de estados sigue exacta.

## Pendiente

No se ha conducido humanamente en un teléfono ni probado mandos físicos. Emulación de toque no valida latencia, ergonomía o FPS de hardware/iOS/Android concretos. Alternativas analógicas, calibración más libre y accesibilidad adicional siguen abiertas en 41/42.

Continúan manejo/derrape físico, cuatro pistas uniformes, más CPU, audio/gráficos y modos/progresión. Online necesita 30.4 RaceState/reloj/resultados aislados antes de salas/sincronización; 3D sigue opcional futura. La versión conserva la identidad superior 2D.

Comando (Playwright/Chromium de desarrollo):

```sh
node tests/browser-touch.cjs
```
