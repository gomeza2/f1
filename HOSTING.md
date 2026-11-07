# Render: despliegue y diagnóstico de salas privadas — 0.89.1

## Si queda esperando sin conectar — corrección 0.89.1

Se comprobaron dos fragilidades del código/configuración: faltaba un origen por defecto si no se cargaba PGP_ALLOWED_ORIGINS, y la receta desactivaba actualizaciones automáticas. No se atribuye el incidente público a estas causas sin leer el proceso desplegado: el proxy del entorno sigue rechazando CONNECT al dominio de Render antes de alcanzarlo.

Ahora, sin override, la CLI permite los dos orígenes exactos de este proyecto (Pages y Render). Si Render proporciona RENDER_EXTERNAL_URL, incorpora ese origen HTTPS de forma segura; no hay que inventar ni cargar esa variable manualmente. Las URLs pegadas como https://gomeza2.github.io/f1/ se normalizan al origen sin ruta. Overrides explícitos válidos se conservan; no se permite comodín ni credenciales/query/fragmento. Health expone la lista no secreta allowedBrowserOrigins y admite lectura CORS solo desde orígenes permitidos.

**Acción en la cuenta existente:** Settings → Build & Deploy → Auto-Deploy → On Commit, rama main, raíz del repositorio y comandos de la tabla. Guardar y hacer Manual Deploy → Deploy latest commit una vez. Si el servicio fue creado mediante Blueprint, sincronizar la receta. Editar YAML no actualiza por sí solo un servicio manual ni demuestra que un deploy haya terminado.

En el juego actualizado, ONLINE PRIVADO → COMPROBAR SERVIDOR prueba /health y hello/welcome de WebSocket sin crear sala. No confundir «WebSocket confirmado» con una carrera WAN completa. Si /health no puede leerse pero WSS confirma, el servicio puede ser compatible aunque el diagnóstico HTTP sea viejo/no permita CORS; actualizar el despliegue para obtener el diagnóstico completo. Cancelar/cerrar interrumpe la comprobación.

## Verificación pública en GitHub

Actions → **Online server and public Render check**. Se ejecuta al publicar en main o con Run workflow. El primer job instala y ejecuta las pruebas locales. El segundo espera hasta seis minutos a que /health reporte el SHA de ese push, comprueba /protocol, handshake WSS con Origin de Pages y crea/une dos clientes temporales; luego abandona y elimina su sala. No inicia una carrera ni toca salas de jugadores. Sin secretos nuevos.

El job público es una comprobación externa real solo cuando se ejecuta y concluye; su archivo no prueba un resultado. Puede quedar rojo si Render sigue en otro commit, hay denegación de origen, fallo de TLS/red, o Actions está deshabilitado en la cuenta. Revisar su log para el motivo. Ejecución equivalente desde una máquina con acceso normal: `node server/scripts/verify-online.cjs`. Si hay proxy configurado, el checker exige una ruta WebSocket compatible y no lo evade. El checker completo se validó aquí contra el proceso CLI local; su ejecución pública se debe confirmar en Actions.


## Causa confirmada del mensaje anterior

La ruta `/` del commit `39b31db5ddc5f03d0b3f0b5aa950814d932bdb22` (main 0.86 al comprobarlo) devolvía literalmente «Servidor local de desarrollo». No consultaba NODE_ENV ni activaba otro motor: el mismo `server/index.cjs` contiene HTTP, WebSocket y simulación autoritativa. Ese texto no demuestra por sí solo una configuración incorrecta o fallo de WSS.

Esta corrección incluye servidor 0.89.1 y frontend 0.89.1; el commit debe estar publicado en main antes del despliegue. La corrección ahora propone `autoDeploy: true`; hay que activarlo también en los servicios manuales existentes. No se puede demostrar desde este entorno qué commit/configuración tiene la cuenta de Render: las solicitudes externas de /health, Pages y Upgrade /ws reciben CONNECT 403 del proxy antes de alcanzar el destino. No se ha confirmado el servicio público ni su TLS, ni se ha cambiado su URL.

## Configuración requerida en la cuenta

| Campo | Valor |
|---|---|
| Tipo | **Web Service**, runtime Node; no Static Site |
| Repositorio | `gomeza2/f1`, con acceso de Render al repositorio privado |
| Rama | `main` |
| Root Directory | Raíz del repositorio: vacío en el panel; `.` en el Blueprint. No `server/`: necesita módulos físicos del padre. |
| Build Command | `node server/scripts/client-config.cjs --check && npm ci --prefix server --omit=dev` |
| Start Command | `node server/index.cjs` |
| Health Check Path | `/health` |
| NODE_VERSION | `24.19.0` (Node >=22 requerido) |
| PGP_HOST | `0.0.0.0` |
| PGP_ALLOWED_ORIGINS | `https://gomeza2.github.io,https://pixel-grand-prix-rooms.onrender.com` |
| PORT | Lo proporciona Render. No inventar un valor ni fijar PGP_PORT. |
| Plan e instancias | Free, una instancia; no cambiar a un plan pago para esta corrección |
| Auto Deploy | Activado (`autoDeploy: true`), On Commit |

Los orígenes son exactos, sin `/f1/`, rutas, slash final ni comodines. Si hay dominio personalizado, agregar su origen HTTPS real. El código valida esta sintaxis al arrancar. NODE_ENV no selecciona un servidor distinto y no hace falta inventar una variable de modo. La CLI prioriza PORT sobre PGP_PORT y escucha en 0.0.0.0 aun si PGP_HOST está ausente. PGP_HOST conserva su override explícito para desarrollo.

`render.yaml` es una receta: editarlo no modifica automáticamente un servicio manual existente. La asociación Git, tipo, rama, variables y commit desplegado solo se pueden comprobar en la cuenta. La raíz puede servir ahora también el juego como comodidad, pero Pages sigue siendo el frontend estático independiente y `/ws` sigue siendo el servidor autoritativo de salas. Mostrar HTML no certifica una partida funcional.

## Aplicar la corrección

1. Publicar estos cambios en `main`; mientras no estén allí, Deploy latest commit seguirá usando el código anterior.
2. En el servicio existente `pixel-grand-prix-rooms`, revisar Settings y Environment con la tabla. Conservar la URL pública existente; comprobar que ese dominio figure en el panel. Si usa otro, verificarlo antes de editar el cliente.
3. Si el servicio fue creado manualmente, corregir los campos directamente. Si está gestionado por Blueprint, sincronizar la receta y revisar los valores efectivos.
4. Elegir **Manual Deploy → Deploy latest commit** y esperar el resultado. Si el build falla, leer el primer error; no desactivar el chequeo de huella ni editar checksums para permitir versiones distintas.
5. Comprobar que el commit del deploy corresponda a la actualización, y que los logs incluyan `Pixel GP rooms 0.89.1 listening on 0.0.0.0:<puerto> (protocol 1, client 0.89.1)`.
6. Publicar/actualizar Pages por el flujo habitual de la cuenta si se desea el frontend 0.87 allí. Este repositorio no contiene un workflow de Pages que podamos dar por ejecutado. La disponibilidad de Pages con un repositorio privado depende de la cuenta/configuración; no se presupone.

## Diagnóstico comprobable

Abrir (o ejecutar curl) sin credenciales:

```sh
curl --fail-with-body https://pixel-grand-prix-rooms.onrender.com/health
curl --fail-with-body https://pixel-grand-prix-rooms.onrender.com/protocol
curl --fail-with-body https://gomeza2.github.io/f1/online-config.json
```

`/health`: `ok:true`, `serverVersion:"0.89.1"`, `clientBuild:"0.89.1"`, `protocol:1`. `revision` informa RENDER_GIT_COMMIT cuando la plataforma lo proporciona con formato válido; null significa no disponible, no un commit inventado. `/protocol` comparte versión/huella y expone catorce pistas y cuatro modelos. Ambos usan `Cache-Control: no-store`. La huella debe coincidir con `online-config.json.simulation`:

`ad20dd46ef387058811cdd3072626a264f39238ab9141d9a9c044ff99042c8f0`

Versión de frontend, servidor y protocolo son conceptos diferentes: 0.89.1/0.89.1/1. La compatibilidad física se verifica por huella, no por igualar esos números a mano. Un servidor 0.86 que realmente tiene esta misma huella puede ser compatible con el audio 0.87, aunque todavía carece de las mejoras de despliegue/diagnóstico.

El cliente estático conserva la URL pública informada: `https://pixel-grand-prix-rooms.onrender.com`. La transforma a `wss://pixel-grand-prix-rooms.onrender.com/ws` desde HTTPS. Una dirección guardada local/inválida/insegura deja de imponerse a Pages; una dirección pública segura elegida expresamente se conserva y puede editarse en SERVIDOR. El juego servido por el propio backend elige su mismo origen. No hay credenciales ni tokens de reanudación en URLs.

## Prueba pública necesaria después del despliegue

Desde Pages, abrir ONLINE PRIVADO en dos perfiles/dispositivos, verificar SERVIDOR, crear sala y unirse por código. En herramientas de red, `/ws` debe tener Upgrade **101** y recibir hello/welcome/session/room. Un 403 de Upgrade puede indicar Origin no permitido; un error de versión exige comparar huellas/commit. Confirmar LISTO, largar, completar vueltas, comprobar resultados iguales, reconexión en menos de diez segundos y revancha. Usar dos dispositivos/redes reales antes de afirmar que funciona por Internet.

Render termina HTTPS/TLS y reenvía HTTP/Upgrade al proceso Node; no se debe cambiar a un servidor Node TLS con certificados inventados. Free puede dormir y tardar en despertar; el cliente espera hasta 90 segundos para conectar inicialmente. Las salas están en memoria: un reinicio/deploy las elimina. No es persistencia ni disponibilidad continua.

## Evidencia local

Build exacto de la receta y 17 tests del servidor aprobados: carreras WebSocket 2/4, reconexión, autoridad, límites, comando CLI real con PORT, health/protocol/versiones y cierre SIGTERM. Prueba WSS con proxy TLS local y certificado confiado explícitamente: acepta ambos orígenes y rechaza terceros, crea/une salas sin desactivar la verificación TLS. No equivale a Render público. Pruebas de navegador: release/cache, conexión/cancelación/arranque frío, hosting unificado y carrera UI de cuatro perfiles con reconexión/resultados/revancha.
