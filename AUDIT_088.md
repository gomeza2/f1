# Auditoría 0.88 — primera rivalidad

## Problemas observados antes de editar

Recorrido nativo con Playwright y capturas 1440×1000 / 390×844. El inicio normal ofrecía campeonato, tres rivales Normal y controles de gas/giro plegados; botón principal cerca de y=650 en móvil. GO tras ~3,9 s del clic, pero seis modalidades y configuración competían antes de explicar la conducción. Sin tutorial de acciones ni progresión por maniobras. Las capturas no sustituyen una sesión humana ni prueban diversión.

## Entrega

Portada con arte original CSS, coches/diagonal de carrera y CORRER AHORA visible cerca de y=280 en teléfono. Un clic selecciona Neon Harbor, Corner King, Fácil y un rival. Introducción de una vuelta usando la configuración de vueltas del motor existente; modos normales siguen con tres. El rival de aprendizaje afloja acelerador/frena normalmente alrededor de 100 km/h, sin cambiar fuerzas o prestaciones; el resto de la IA no cambia. La ventaja pedagógica se explica en la ayuda, no se presenta como victoria garantizada. El test inicial de tres vueltas cerraba con DNF mientras el conductor aprendía: se redujo la introducción y se moderó el rival antes de aceptar la entrega.

Tutorial omisible que avanza por velocidad, dirección en movimiento, frenado y checkpoint real; ayuda de recuperación fuera de pista. Mensajes de teclado/táctil según entrada. Fallback táctil para pantallas pequeñas con maxTouchPoints cuando el navegador no declara pointer:coarse. Medallas locales por tres gates limpios, adelantamiento sostenido y derrape seguido de recuperación. Se observan estados/eventos canónicos; no hay impulso, nuevas fuerzas, falsos resultados ni premios por derrapar parado. Golpes/salidas cortan las rachas; solo finalizar conserva medallas. Una medalla de cada tipo por pista/revisión, 42 posibles; persistencia versionada y fallo de almacenamiento comunicado. No se bloquean coches ni pistas.

Ocho trazos periféricos de velocidad por vista, ligados a velocidad real, desactivados en Rendimiento/reduced-motion. Señales breves reutilizan el bus Efectos y su presupuesto existente. No se añaden música externa, ajustes duplicados ni cambios al motor 0.87.

## Pruebas

`node tests/browser-first-drive.cjs`: un clic, teclado nativo y tres carreras completas con controles normalizados automatizados sobre la simulación real; vueltas válidas, resultados, revancha y perfil tras recargar. Tiempos finales del ensayo ~47,35 / 45,85 / 45,85 s; una medalla limpia almacenada, no victorias inventadas. Contexto táctil real, GAS, omitir tutorial y sin desborde horizontal. Capturas en /workspace/artifacts/first-drive (fuera del repositorio).

`node tests/validate-drive-coach.mjs`: requisitos de acciones, no premio parado, choque interrumpe racha, derrape requiere recuperación, abandono no guarda, final único, aislamiento trial/local y JSON inválido. Escenas unitarias instrumentadas.

Regresiones aprobadas: validate-menu, validate-events, validate-results, validate-audio, validate-shared-driving (140 casos), validate-race-session (24 vueltas), browser-release, browser-local (2/3/4, cinco resoluciones), browser-touch (multitouch), browser-trial (30 vueltas/fantasmas), browser-audio, browser-audio-mix y browser-online-game (cuatro perfiles, reconexión/resultados/revancha). Servidor: 14 tests y chequeo de manifiesto aprobados. Las referencias históricas normalizan únicamente los nuevos hooks observadores/introducción y el botón de arranque; no se modifican fixtures ni aserciones físicas.

Núcleos driving-core.js/track-core.js/race-rules.js/race-session.js intactos y huella física conservada. Cliente 0.88, servidor 0.87.0, protocolo 1: son versiones distintas por responsabilidad, no un error. Se preservan cambios previos de audio/Render. Publicación y despliegue no se deducen de estas pruebas.

## Pendientes y siguiente fase

Probar con personas nuevas la comprensión de la primera curva, satisfacción del derrape, tolerancia de las medallas y ritmo del rival; comprobar teléfono físico/latencia y rendimiento sostenido. Esta entrega transforma entrada/feedback/progresión inicial, no redibuja catorce circuitos ni completa garaje cosmético, atajos/boosts, música, campañas, IA nueva ni toda la dirección artística. No introducir boosts/atajos sin reglas compartidas y pruebas coordinadas de servidor. Siguiente: recoger esa prueba humana, revisar dificultad guiada y calidad de coches/escenarios con comparativas visuales y presupuesto medido.
