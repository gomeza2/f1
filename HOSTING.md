# Render: despliegue y diagnóstico de salas privadas — 0.87

## Causa confirmada del mensaje anterior

La ruta `/` del commit `39b31db5ddc5f03d0b3f0b5aa950814d932bdb22` (main 0.86 al comprobarlo) devolvía literalmente «Servidor local de desarrollo». No consultaba NODE_ENV ni activaba otro motor: el mismo `server/index.cjs` contiene HTTP, WebSocket y simulación autoritativa. Ese texto no demuestra por sí solo una configuración incorrecta o fallo de WSS.

Esta corrección incluye servidor 0.87.0 y frontend 0.89; el commit debe estar publicado en main antes del despliegue. `autoDeploy: false` exige además desplegar manualmente. No se puede demostrar desde este entorno qué commit/configuración tiene la cuenta de Render: las solicitudes externas de /health, Pages y Upgrade /ws reciben CONNECT 403 del proxy antes de alcanzar el destino. No se ha confirmado el servicio público ni su TLS, ni se ha cambiado su URL.

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
| Auto Deploy | Desactivado (`autoDeploy: false`), despliegue manual |

Los orígenes son exactos, sin `/f1/`, rutas, slash final ni comodines. Si hay dominio personalizado, agregar su origen HTTPS real. El código valida esta sintaxis al arrancar. NODE_ENV no selecciona un servidor distinto y no hace falta inventar una variable de modo. La CLI prioriza PORT sobre PGP_PORT y escucha en 0.0.0.0 aun si PGP_HOST está ausente. PGP_HOST conserva su override explícito para desarrollo.

`render.yaml` es una receta: editarlo no modifica automáticamente un servicio manual existente. La asociación Git, tipo, rama, variables y commit desplegado solo se pueden comprobar en la cuenta. La raíz puede servir ahora también el juego como comodidad, pero Pages sigue siendo el frontend estático independiente y `/ws` sigue siendo el servidor autoritativo de salas. Mostrar HTML no certifica una partida funcional.

## Aplicar la corrección

1. Publicar estos cambios en `main`; mientras no estén allí, Deploy latest commit seguirá usando el código anterior.
2. En el servicio existente `pixel-grand-prix-rooms`, revisar Settings y Environment con la tabla. Conservar la URL pública existente; comprobar que ese dominio figure en el panel. Si usa otro, verificarlo antes de editar el cliente.
3. Si el servicio fue creado manualmente, corregir los campos directamente. Si está gestionado por Blueprint, sincronizar la receta y revisar los valores efectivos.
4. Elegir **Manual Deploy → Deploy latest commit** y esperar el resultado. Si el build falla, leer el primer error; no desactivar el chequeo de huella ni editar checksums para permitir versiones distintas.
5. Comprobar que el commit del deploy corresponda a la actualización, y que los logs incluyan `Pixel GP rooms 0.87.0 listening on 0.0.0.0:<puerto> (protocol 1, client 0.89)`.
6. Publicar/actualizar Pages por el flujo habitual de la cuenta si se desea el frontend 0.87 allí. Este repositorio no contiene un workflow de Pages que podamos dar por ejecutado. La disponibilidad de Pages con un repositorio privado depende de la cuenta/configuración; no se presupone.

## Diagnóstico comprobable

Abrir (o ejecutar curl) sin credenciales:

```sh
curl --fail-with-body https://pixel-grand-prix-rooms.onrender.com/health
curl --fail-with-body https://pixel-grand-prix-rooms.onrender.com/protocol
curl --fail-with-body https://gomeza2.github.io/f1/online-config.json
```

`/health`: `ok:true`, `serverVersion:"0.87.0"`, `clientBuild:"0.89"`, `protocol:1`. `revision` informa RENDER_GIT_COMMIT cuando la plataforma lo proporciona con formato válido; null significa no disponible, no un commit inventado. `/protocol` comparte versión/huella y expone catorce pistas y cuatro modelos. Ambos usan `Cache-Control: no-store`. La huella debe coincidir con `online-config.json.simulation`:

`ad20dd46ef387058811cdd3072626a264f39238ab9141d9a9c044ff99042c8f0`

Versión de frontend, servidor y protocolo son conceptos diferentes: 0.89/0.87.0/1. La compatibilidad física se verifica por huella, no por igualar esos números a mano. Un servidor 0.86 que realmente tiene esta misma huella puede ser compatible con el audio 0.87, aunque todavía carece de las mejoras de despliegue/diagnóstico.

El cliente estático conserva la URL pública informada: `https://pixel-grand-prix-rooms.onrender.com`. La transforma a `wss://pixel-grand-prix-rooms.onrender.com/ws` desde HTTPS. Una dirección guardada local/inválida/insegura deja de imponerse a Pages; una dirección pública segura elegida expresamente se conserva y puede editarse en SERVIDOR. El juego servido por el propio backend elige su mismo origen. No hay credenciales ni tokens de reanudación en URLs.

## Prueba pública necesaria después del despliegue

Desde Pages, abrir ONLINE PRIVADO en dos perfiles/dispositivos, verificar SERVIDOR, crear sala y unirse por código. En herramientas de red, `/ws` debe tener Upgrade **101** y recibir hello/welcome/session/room. Un 403 de Upgrade puede indicar Origin no permitido; un error de versión exige comparar huellas/commit. Confirmar LISTO, largar, completar vueltas, comprobar resultados iguales, reconexión en menos de diez segundos y revancha. Usar dos dispositivos/redes reales antes de afirmar que funciona por Internet.

Render termina HTTPS/TLS y reenvía HTTP/Upgrade al proceso Node; no se debe cambiar a un servidor Node TLS con certificados inventados. Free puede dormir y tardar en despertar; el cliente espera hasta 90 segundos para conectar inicialmente. Las salas están en memoria: un reinicio/deploy las elimina. No es persistencia ni disponibilidad continua.

## Evidencia local

Build exacto de la receta y 14 tests del servidor aprobados: carreras WebSocket 2/4, reconexión, autoridad, límites, comando CLI real con PORT, health/protocol/versiones y cierre SIGTERM. Prueba WSS con proxy TLS local y certificado confiado explícitamente: acepta ambos orígenes y rechaza terceros, crea/une salas sin desactivar la verificación TLS. No equivale a Render público. Pruebas de navegador: release/cache, conexión/cancelación/arranque frío, hosting unificado y carrera UI de cuatro perfiles con reconexión/resultados/revancha.
