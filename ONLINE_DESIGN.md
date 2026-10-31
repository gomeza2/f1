# PIXEL GRAND PRIX — diseño de online privado

**Estado en 0.70: diseño, sin servidor ni carreras online disponibles.** La simulación todavía depende de variables de carrera/DOM dentro de `script.js`. El catálogo 0.70 y la recuperación 0.69 sí están integrados; este documento no los convierte en online.

## Primera entrega completa que se busca

Salas privadas de 2–4 personas: crear, compartir código, unirse, elegir coche/pintura, confirmar listo y correr tres vueltas. Cuenta regresiva y resultados decididos por un servidor. El anfitrión configura la sala, pero no controla las posiciones ni valida sus propios tiempos. Sin ranking público ni cuentas en el primer hito. El juego local sigue funcionando sin red.

Pages puede seguir sirviendo el cliente. Las salas necesitan un proceso separado con HTTPS/WSS; Pages por sí solo no ejecuta ese servidor persistente. No se añade un botón ONLINE que no pueda completar una partida.

## Dependencia técnica inmediata — fase 30

Extraer una única simulación compartida, sin mantener dos físicas distintas:

- `createRace(config)` produce un estado por sala, con coches, vueltas, gates, reloj, planes CPU y configuración bloqueada.
- `stepRace(state, inputs, 1/60)` avanza el mismo núcleo en cliente/Node y devuelve eventos numerados de checkpoint, vuelta, impacto y final.
- Geometría de pistas/barreras y especificaciones son datos compartidos inmutables; estado de cada carrera es independiente. Ni `stage`, ni `cars`, ni temporizadores globales pueden compartirse entre salas.
- El cliente identifica su coche por `selfPilotId`; cámara, HUD y controles no deben asumir que su asiento de servidor es el índice cero.
- Canvas, audio, partículas decorativas y localStorage quedan en el adaptador del navegador. No se ejecutará un DOM falso o un navegador en el servidor.
- Intención de conducción y física se separan: el servidor calcula el retardo de reversa. Un freno de emergencia de red no puede activar marcha atrás automáticamente.
- Formato preferido: módulos ES compartidos sin bundler obligatorio. La migración debe probar rutas/versionado de todos los módulos bajo `/f1/`, además de apertura y carga del cliente.

Criterio de salida: con las mismas entradas, el adaptador actual y el núcleo extraído producen posiciones/velocidades, contactos, gates, vueltas y tiempos iguales. Dos carreras simultáneas no deben contaminar estado. La extracción no es permiso para cambiar el balance sin medirlo.

## Transporte y autoridad — fase 32

Node con una biblioteca WebSocket pequeña y mantenida. El cliente transmite controles; el servidor simula todos los coches y devuelve snapshots. WebRTC no elimina señalización, NAT ni confianza en el anfitrión; por eso no es la primera opción para competición validada.

Contrato propuesto, no API existente:

| Mensaje | Contenido y reglas |
|---|---|
| `hello` | Versión de protocolo y hash de simulación; rechazar incompatibles antes de entrar. p6/b1/s1 por sí solos no identifican revisiones de controles/recuperación. |
| `create` / `join` | Nombre limitado, código de sala y selección entre modelos/pinturas conocidos. El servidor asigna piloto e identidad de sesión. |
| `configure` | Solo anfitrión y solo en lobby: pista, perfil de barreras y vueltas permitidas. Configuración y geometría versionadas se bloquean al iniciar. |
| `ready` | Estado por piloto; cualquier cambio de configuración invalida confirmaciones previas. |
| `input` | Secuencia y controles `{throttle, brake, steering, hand}`; no posiciones, dt elegido por cliente, vuelta ni tiempo final. |
| `snapshot` | Tick del servidor, último input reconocido por piloto, poses/velocidades firmadas, estado de vuelta/gates/clasificación y eventos numerados. |
| `resume` | Credencial de sesión para recuperar el mismo coche dentro del plazo; se rota al usarla. |
| `results` | Clasificación, vueltas válidas, llegada/DNF y tiempos calculados por el servidor. |

Entradas numéricas finitas, throttle/brake en [0,1], steering en [-1,1], hand booleano. Piloto asociado al socket, no a un ID arbitrario aceptado desde el mensaje. Rechazar secuencias repetidas/antiguas, objetos/campos inesperados, mensajes excesivos y modelos/configuraciones inexistentes. Nombres como texto, nunca HTML.

Los snapshots incluyen reversa (velocidad hasta −28 en la base actual), `raceOffset` y temporizadores necesarios para predecir/reconciliar. El servidor decide vueltas y checkpoints por geometría/orden. Un valor de localStorage no se acepta como resultado online.

## Ciclo de sala

`lobby → countdown → running → results → lobby`.

- Inicio con al menos dos pilotos listos. Una desconexión durante countdown cancela esa salida y devuelve la sala al lobby.
- No se admite incorporar un coche nuevo a una carrera en curso. Reconexión al coche existente es otra operación.
- Plazo inicial propuesto de reconexión: 10 s; después, DNF. No es un temporizador ya implementado.
- Al perder inputs, retirar acelerador y frenar con comando de seguridad sin reversa; limpiar la intención retenida de marcha. No conservar indefinidamente la última pulsación.
- La salida del anfitrión no detiene una carrera autoritativa; el servidor conserva la carrera y reasigna la administración del lobby.
- ESC no pausa globalmente una carrera online. El menú personal debe explicar que el coche sigue en carrera y usar un control seguro; la pausa local actual conserva su comportamiento.
- Limpieza de salas vacías/inactivas, límites por instancia y aviso claro al reiniciar un servidor. La primera versión puede guardar salas solo en memoria; no prometer persistencia/reconexión tras reinicio.

## Sincronización jugable

Simulación fija inicial a 60 Hz. Comparar snapshots de 15 y 20 Hz con carga medida antes de fijar el envío. Inputs al cambiar y un pulso periódico limitado; no se permite simular más tiempo por enviar más paquetes.

Predicción del coche propio con el mismo núcleo; reconciliación desde snapshot reconocido y repetición de inputs pendientes. Interpolación de rivales separada de la simulación. Las correcciones visuales no conceden velocidad al estado autorizado. Los eventos llevan ID para no repetir audio/puntos al reconciliar.

Si el servidor no sostiene el reloj, debe detectar sobrecarga y suspender/cerrar la sesión de forma explícita; no esconder tiempo perdido ni validar récords como si fuera una carrera normal. El cliente no puede decidir el avance del reloj de la sala.

## Pruebas que habilitan publicación

1. Paridad de simulación y dos salas aisladas; reglas de reversa/terreno/contactos/gates incluidas.
2. Dos y cuatro clientes reales crean/unifican lobby, cambian modelos, confirman y terminan carreras con el mismo resultado.
3. Retraso/jitter de 0/50/100/200 ms, pérdida/corte/reconexión, inputs duplicados/reordenados y navegadores a frecuencias distintas.
4. Desconexión de anfitrión, caída durante countdown/última vuelta, piloto detenido, DNF y limpieza de salas.
5. Rechazo de posiciones/resultados falsos, controles fuera de rango, exceso de frecuencia y sesiones ajenas. Esto es prevención básica, no garantía contra todo ataque.
6. Medir CPU/memoria/bytes y salas por instancia; revisar movimiento/predicción humanamente. Abrir dos pestañas y conectar un socket no completa el hito.

## Alojamiento y costes — fase 33

Elegir proveedor solo cuando exista servidor medido y una versión concreta para desplegar. Comparar en ese momento precios y límites vigentes de un servicio Node o contenedor con WSS permanente; no se ha contratado ni elegido hosting.

Presupuesto = horas de cómputo + salida de datos + almacenamiento + dominio/servicios que se decidan. Tráfico de una sala = tamaño medido de snapshot × frecuencia × clientes × duración, más protocolo/inputs. No se presupuestan salas ilimitadas ni un plan gratuito permanente sin medir sus condiciones.

TLS, orígenes permitidos, sesiones impredecibles, límites de conexiones/salas/mensajes y logs sin credenciales. Tokens de reanudación cortos y con alcance por sala/piloto; ninguna clave privada en el frontend. El ranking persistente necesitará validación y almacenamiento de resultados del servidor como hito posterior.

## Orden inmediato

0.70 completa el primer catálogo visual. Próximo paso online: extraer la simulación compartida y demostrar paridad/aislamiento (30/32.1). Después, servidor/salas y prueba local integral; luego reconciliación/latencia; finalmente despliegue revisable. La vista 3D inclinada queda en fase 37 como opción de render que consumirá la misma simulación, sin cambiar la autoridad ni duplicar la física.
