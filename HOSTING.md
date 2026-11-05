# Alojamiento propuesto para salas privadas

## Dirección configurada en 0.81

El usuario informó que creó el servicio y proporcionó **https://pixel-grand-prix-rooms.onrender.com**. Se guarda como `online-config.json.serverUrl` predeterminado; la UI conserva una dirección personalizada ya guardada. Abrir esa raíz muestra el backend de salas; el juego se abre por separado en Pages y conecta por `/ws` usando WSS.

La comprobación externa desde este entorno falló antes de alcanzar Render: `CONNECT tunnel failed, response 403`, proxy Envoy. No demuestra fallo del servicio ni confirma su salud. Queda pendiente verificar `/health`, handshake y una carrera pública desde un entorno con acceso autorizado. Los módulos físicos/protocolo del servidor no cambian en 0.81; las mejoras son de cliente.

La conexión inicial puede esperar/reintentar hasta 90 s, con cancelación; no es una garantía del tiempo que tarda Render Free en despertar. La reconexión de una carrera activa conserva su plazo corto porque las reglas de abandono del servidor siguen vigentes.

## Elección para la primera prueba con amigos

**Render · Web Service Node con plan Free**, y frontend estático en **GitHub Pages**. La receta solicita el plan gratuito para las primeras pruebas; no selecciona Starter ni otros recursos pagos. No se contrató ni desplegó un servicio desde aquí. GitHub Pages por sí solo no puede ejecutar las salas.

`render.yaml` propone Free/Virginia, Node 24.19.0, health check y despliegue automático desactivado. Free puede suspenderse por inactividad y tardar en arrancar de nuevo; si el proceso se reinicia se pierden las salas en memoria. Es apropiado para probar, sin prometer disponibilidad continua. La región no implica un ping medido desde Argentina. La disponibilidad de Free, sus límites y cualquier verificación de tarjeta dependen de Render y de la cuenta; cambiar el YAML no elimina requisitos propios del proveedor.

Si ya existe un servicio creado manualmente con Starter, cambiar este archivo no cambia automáticamente su plan. Revisar **Instance Type → Free** en el panel, o volver a crear/sincronizar el Blueprint desde `main` y comprobar que indique **Free** antes de continuar. No aceptar una opción paga para realizar esta prueba.

## Datos de configuración

En [Render Dashboard](https://dashboard.render.com/), conectar el repositorio `gomeza2/f1` y crear un Web Service o revisar el Blueprint incluido:

| Opción | Valor |
|---|---|
| Rama | `main` |
| Directorio raíz | Raíz del repositorio; **no `server/`**, porque importa los módulos físicos del padre. |
| Plan / Instance Type | **Free** |
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
3. Medir ping, variación, tráfico y tiempo de paso con jugadores reales. El cliente 0.81 interpola con unos 100 ms de margen y todavía no predice al piloto local: no prometer baja latencia competitiva sin medir.
4. Comprobar pérdida/retorno de red, DNF, anfitrión que se va y revancha. Reiniciar el servidor pierde salas/resultados: son memoria temporal.
5. Observar carga antes de aumentar las ocho carreras activas configuradas. Son topes de protección, no capacidad de hosting demostrada. Detrás del proxy, el límite de 16 conexiones por IP puede agrupar usuarios; revisar esto antes de ampliar el servicio.

## Qué está comprobado aquí

Servidor local, clientes independientes WebSocket y cuatro navegadores con la interfaz del juego. También arranque CLI mediante `PORT` y `PGP_HOST`, health y cierre. **El servicio externo fue informado por el usuario; este entorno no comprobó Render, ping real, coste o GitHub Pages publicado.** La URL ya está configurada. La validación pública sigue pendiente por la restricción de red indicada arriba.
