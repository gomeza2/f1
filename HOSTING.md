# Alojamiento propuesto para salas privadas

## Elección para la primera prueba con amigos

**Render · Web Service Node en plan sin suspensión**, y frontend estático en **GitHub Pages**. Es una propuesta lista para configurar, no un servicio contratado ni desplegado. WebSocket requiere un proceso persistente: GitHub Pages por sí solo no puede ejecutar las salas. Evitar un plan que duerma la instancia mientras se esperan participantes.

La receta `render.yaml` propone Starter/Virginia, Node 24.19.0, health check y despliegue automático desactivado. La región es una propuesta, no una medición de ping desde Argentina. Confirmar en el panel los planes/regiones/precios vigentes antes de crear el servicio; no se fija un precio mensual ni se garantiza ese catálogo. Si la latencia resulta molesta, evaluar una instancia cercana a los jugadores (por ejemplo Fly.io en São Paulo, sujeto a disponibilidad) después de medir. No hay cuentas, base de datos ni pagos incorporados al juego.

## Datos de configuración

En [Render Dashboard](https://dashboard.render.com/), conectar el repositorio `gomeza2/f1` y crear un Web Service o revisar el Blueprint incluido:

| Opción | Valor |
|---|---|
| Rama | `main` |
| Directorio raíz | Raíz del repositorio; **no `server/`**, porque importa los módulos físicos del padre. |
| Runtime | Node >=22 (receta: 24.19.0) |
| Build | `node server/scripts/client-config.cjs --check && npm ci --prefix server --omit=dev` |
| Start | `node server/index.cjs` |
| Host | Variable `PGP_HOST=0.0.0.0` |
| Puerto | Lo asigna Render en `PORT`; no fijar `PGP_PORT` salvo necesidad concreta. |
| Origen del juego | `PGP_ALLOWED_ORIGINS=https://gomeza2.github.io` (origen sin `/f1/`). |
| Health check | `/health` |
| Despliegue automático | Desactivado durante esta primera validación. |
| Instancias | Una sola; salas en memoria, sin escalado horizontal automático. |

Si se usa otro dominio para el juego, cambiar/agregar su origen exacto en `PGP_ALLOWED_ORIGINS` (separar por coma, sin rutas). El filtro no acepta comodines. Un proxy debe dejar pasar Upgrade/WebSocket y HTTPS/WSS. No poner credenciales o tokens en la URL del servicio.

Una vez creado, hace falta **la URL pública del servicio**, por ejemplo `https://pixel-grand-prix-rooms.onrender.com`. Podés pegarla directamente en **ONLINE PRIVADO → SERVIDOR**: el juego la recuerda solo en ese navegador. Para que todos entren sin configurarla, se guarda esa dirección pública en `online-config.json.serverUrl` en una entrega posterior. No hacen falta contraseñas ni claves privadas en el frontend.

## Validación antes de anunciar disponibilidad

1. Confirmar `/health` con `ok:true`, mismo protocolo/huella que `online-config.json` y la versión correcta del proceso desplegado.
2. Desde el juego en Pages, crear y unir 2–4 navegadores/dispositivos. Comprobar que WSS funciona y el origen está admitido; comparar resultados reales tras una carrera completa.
3. Medir ping, variación, tráfico y tiempo de paso con jugadores reales. El cliente 0.80 interpola con unos 100 ms de margen y todavía no predice al piloto local: no prometer baja latencia competitiva sin medir.
4. Comprobar pérdida/retorno de red, DNF, anfitrión que se va y revancha. Reiniciar el servidor pierde salas/resultados: son memoria temporal.
5. Observar carga antes de aumentar las ocho carreras activas configuradas. Son topes de protección, no capacidad de hosting demostrada. Detrás del proxy, el límite de 16 conexiones por IP puede agrupar usuarios; revisar esto antes de ampliar el servicio.

## Qué está comprobado aquí

Servidor local, clientes independientes WebSocket y cuatro navegadores con la interfaz del juego. También arranque CLI mediante `PORT` y `PGP_HOST`, health y cierre. **No se creó el servicio externo ni se comprobó Render, ping real, coste o GitHub Pages publicado en esta entrega.** El usuario puede crear el servicio cuando quiera y compartir la URL pública para configurar y validar la conexión final.
