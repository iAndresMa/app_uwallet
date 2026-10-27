# Endpoint: `modules/bicicletero.php`

Integración de wallet con el **API de bicicletero**. Permite al frontend consultar rectorías, sedes y asignaciones, y crear una solicitud de cupo en el bicicletero, sin tener que manejar el token ni los ids internos de bicicletero: wallet se encarga de autenticarse contra bicicletero, buscar el rol, consultar/crear el usuario y armar los payloads que ese API espera.

| Operación | Método | `fn` |
|-----------|--------|------|
| [Consultar rectorías](#get-fnrectorias--consultar-rectorías) | `GET` | `rectorias` |
| [Consultar sedes de una rectoría](#get-fnsedes--consultar-sedes-de-una-rectoría) | `GET` | `sedes` |
| [Consultar asignaciones de un usuario](#get-fnasignaciones--consultar-asignaciones-de-un-usuario) | `GET` | `asignaciones` |
| [Crear solicitud de cupo](#post-fnsolicitud--crear-solicitud-de-cupo) | `POST` | `solicitud` |

---

## Autenticación

Todas las operaciones requieren **HTTP Basic Auth** con las credenciales de wallet (`AU_USER` / `AU_PASS` de `config/variables.php`), igual que `modules/politica.php` y `modules/usuario.php`.

```
Authorization: Basic <base64("usuario:clave")>
```

Sin credenciales o con credenciales incorrectas responde, antes de hacer cualquier otra cosa:

```json
// 401
{ "resp": false, "msg": "Error en la autenticación" }
```

El frontend **no** envía ni maneja el token de bicicletero; ver [Notas de implementación](#notas-de-implementación).

---

## Formato general de respuesta

**Éxito:**

```json
{
  "resp": true,
  "msg": "<mensaje devuelto por bicicletero>",
  "<llave>": "<datos de la operación>"
}
```

La `<llave>` depende de la operación: `rectorias`, `sedes`, `asignaciones` o `idsolicitud`.

**Error:**

```json
{ "resp": false, "msg": "<motivo>" }
```

| HTTP | Cuándo ocurre |
|------|---------------|
| 400  | Falta un parámetro o tiene formato inválido, o bicicletero rechazó los datos (el `msg` trae su motivo) |
| 401  | Basic Auth ausente o incorrecto |
| 404  | El usuario no existe en bicicletero (solo `asignaciones`) |
| 409  | Bicicletero indica que el registro ya existe (el `msg` trae su motivo) |
| 500  | `fn` ausente o desconocido, o método distinto de `GET`/`POST` (`"Error en la función"`) |
| 502  | Bicicletero no está disponible o respondió algo inesperado (ver abajo) |

Cuando bicicletero está caído, responde con error 5xx, o no se puede obtener el token, el `msg` siempre es:

```json
// 502
{ "resp": false, "msg": "El servicio de bicicletero no está disponible, intenta más tarde" }
```

El detalle técnico (endpoint de bicicletero, código y respuesta original) queda en el log de errores de PHP.

---

## GET `fn=rectorias` — Consultar rectorías

Lista las rectorías de bicicletero. Pensado para llenar el selector de **Rectoría** del formulario.

**Query params**

| Campo | Tipo   | Requerido | Descripción |
|-------|--------|-----------|-------------|
| `fn`  | string | Sí        | `rectorias` |

**Ejemplo**

```bash
curl -X GET 'https://<host>/modules/bicicletero.php?fn=rectorias' \
  -u '<AU_USER>:<AU_PASS>'
```

**Respuesta** (`200`)

```json
{
  "resp": true,
  "msg": "Rectorías obtenidas correctamente",
  "rectorias": [
    { "idrectoria": "RCO", "nombrerectoria": "R CENTRO OCCIDENTE" },
    { "idrectoria": "SIN", "nombrerectoria": "SERVICIOS INTEGRADOS" }
  ]
}
```

| Campo de `rectorias[]` | Tipo   | Descripción |
|------------------------|--------|-------------|
| `idrectoria`           | string | Código de la rectoría. Se envía como `rectoria` en `fn=sedes` |
| `nombrerectoria`       | string | Nombre para mostrar |

**Errores**: `401`, `502` (ver [formato general](#formato-general-de-respuesta)).

---

## GET `fn=sedes` — Consultar sedes de una rectoría

Lista las sedes de una rectoría. Pensado para llenar el selector de **Sede** una vez elegida la rectoría.

**Query params**

| Campo       | Tipo   | Requerido | Descripción |
|-------------|--------|-----------|-------------|
| `fn`        | string | Sí        | `sedes` |
| `rectoria`  | string | Sí        | `idrectoria` obtenido de `fn=rectorias` (ej. `RCO`) |

**Ejemplo**

```bash
curl -X GET 'https://<host>/modules/bicicletero.php?fn=sedes&rectoria=RCO' \
  -u '<AU_USER>:<AU_PASS>'
```

**Respuesta** (`200`)

```json
{
  "resp": true,
  "msg": "Sedes obtenidas correctamente",
  "sedes": [
    { "idsede": "CLA", "nombresede": "CU LADERA" },
    { "idsede": "CIN", "nombresede": "CU CALI" }
  ]
}
```

| Campo de `sedes[]` | Tipo   | Descripción |
|--------------------|--------|-------------|
| `idsede`           | string | Código de la sede. **Es el valor que se envía como `idsede` en `fn=solicitud`** |
| `nombresede`       | string | Nombre para mostrar |

Si la rectoría no existe o no tiene sedes, responde `200` con `"sedes": []`.

> Los nombres de bicicletero no coinciden con los que usa wallet en sus propias tablas (ej. wallet muestra "CERES LADERA" y bicicletero "CU LADERA"). Los selectores del formulario de bicicletero deben llenarse con estos endpoints, no con las tablas de wallet.

**Errores**

| HTTP | Body | Caso |
|------|------|------|
| 400  | `{"resp": false, "msg": "Falta rectoria"}` | No se envió `rectoria` o vino vacío |
| 401 / 502 | | Ver [formato general](#formato-general-de-respuesta) |

---

## GET `fn=asignaciones` — Consultar asignaciones de un usuario

Devuelve los cupos asignados a un usuario. El frontend solo envía el documento: wallet consulta el usuario en bicicletero para obtener su rol y con eso consulta las asignaciones.

**Query params**

| Campo       | Tipo   | Requerido | Descripción |
|-------------|--------|-----------|-------------|
| `fn`        | string | Sí        | `asignaciones` |
| `documento` | string | Sí        | Número de documento del usuario |

**Ejemplo**

```bash
curl -X GET 'https://<host>/modules/bicicletero.php?fn=asignaciones&documento=1024580021' \
  -u '<AU_USER>:<AU_PASS>'
```

**Respuesta** (`200`)

```json
{
  "resp": true,
  "msg": "Asignación consultada correctamente",
  "asignaciones": [
    {
      "jornada": "MAÑANA",
      "nombredia": "LUNES",
      "nombresede": "CU LADERA",
      "nombrelugar": "Bicicletero principal",
      "codigolugar": "B01",
      "estadoasignacion": "Activo",
      "detalleasignacion": "---"
    }
  ]
}
```

| Campo de `asignaciones[]` | Tipo   | Descripción |
|---------------------------|--------|-------------|
| `jornada`                 | string | Jornada de la asignación |
| `nombredia`               | string | Día de la semana |
| `nombresede`              | string | Nombre de la sede (`"Sin Asignación"` si no tiene) |
| `nombrelugar`             | string | Nombre del bicicletero o lugar (`"Sin Asignación"` si no tiene) |
| `codigolugar`             | string | Código del lugar (vacío si no tiene) |
| `estadoasignacion`        | string | Estado de la asignación (ej. `Activo`, `Inactivo`) |
| `detalleasignacion`       | string | Detalle o descripción |

**Errores**

| HTTP | Body | Caso |
|------|------|------|
| 400  | `{"resp": false, "msg": "Falta documento"}` | No se envió `documento` o vino vacío |
| 404  | `{"resp": false, "msg": "El usuario no existe en bicicletero"}` | El documento no está registrado en bicicletero |
| 502  | `{"resp": false, "msg": "Bicicletero no devolvió el idrol del usuario"}` | La consulta del usuario no trae su rol (ver [Pendientes](#pendientes)) |
| 401 / 502 | | Ver [formato general](#formato-general-de-respuesta) |

---

## POST `fn=solicitud` — Crear solicitud de cupo

Registra una solicitud de cupo en el bicicletero. Si el usuario no existe en bicicletero, wallet lo crea primero con los datos enviados.

**Body**: se acepta como **JSON** (`Content-Type: application/json`), `application/x-www-form-urlencoded` o `multipart/form-data`. Los valores numéricos en JSON (ej. `"documento": 1024580021`) se aceptan y se tratan como texto.

| Campo       | Tipo   | Requerido | Descripción | Dato del formulario |
|-------------|--------|-----------|-------------|---------------------|
| `fn`        | string | Sí        | `solicitud` | — |
| `documento` | string | Sí        | Número de documento | Documento |
| `correo`    | string | Sí        | Correo con formato válido; se guarda en minúsculas | Correo |
| `nombre`    | string | Sí        | Nombre del usuario (se usa si hay que crearlo) | **No existe aún en el formulario** |
| `apellido`  | string | No        | Apellido del usuario | **No existe aún en el formulario** |
| `cn`        | string | No        | Código CN del usuario | Id |
| `rol`       | string | Sí        | Descripción del rol: `ADMINISTRATIVO`, `DOCENTE` o `ESTUDIANTE` (sin importar mayúsculas) | Tipo |
| `idsede`    | string | Sí        | Código de la sede, obtenido de `fn=sedes` (ej. `CLA`) | Sede |

Los textos se recortan (`trim`). `apellido` y `cn` vacíos se envían a bicicletero como `null`.

**Ejemplo**

```bash
curl -X POST 'https://<host>/modules/bicicletero.php' \
  -u '<AU_USER>:<AU_PASS>' \
  -H 'Content-Type: application/json' \
  -d '{
    "fn": "solicitud",
    "documento": "1024580021",
    "correo": "andres.lopez.m@uniminuto.edu",
    "nombre": "Andres Felipe",
    "apellido": "Lopez Manrique",
    "cn": "1024580021",
    "rol": "ADMINISTRATIVO",
    "idsede": "CLA"
  }'
```

**Respuesta** (`201`)

```json
{
  "resp": true,
  "msg": "<mensaje devuelto por bicicletero>",
  "idsolicitud": 345
}
```

| Campo         | Tipo | Descripción |
|---------------|------|-------------|
| `idsolicitud` | int  | Id de la solicitud creada en bicicletero |

**Flujo interno**

1. Busca `rol` en `GET /api/roles` de bicicletero y obtiene su `idrol`. Si no existe → `400`.
2. Consulta el usuario con `GET /api/users/{documento}`.
   - **Si no existe**: lo crea con `POST /api/users` (con el `idrol` del paso 1 y los datos del body) y lo vuelve a consultar.
   - **Si existe**: continúa directamente.
3. Toma `idoculto_rolusuario` de la respuesta del usuario.
4. Crea la solicitud con `POST /api/solicitudes` enviando `idrolusuario = idoculto_rolusuario`, `idsede` del body e `idestado = PENDIENTE`.

**Errores**

| HTTP | Body | Caso |
|------|------|------|
| 400  | `{"resp": false, "msg": "Falta <campo>"}` | Falta `documento`, `correo`, `nombre`, `rol` o `idsede`, o vino vacío |
| 400  | `{"resp": false, "msg": "El correo no es válido"}` | `correo` sin formato de email |
| 400  | `{"resp": false, "msg": "El rol <rol> no existe en bicicletero"}` | `rol` no está en `GET /api/roles` |
| 400 / 409 | `{"resp": false, "msg": "<motivo de bicicletero>"}` | Bicicletero rechazó la creación del usuario o de la solicitud (regla de negocio, sede inexistente, registro duplicado, etc.) |
| 502  | `{"resp": false, "msg": "Bicicletero no devolvió el idoculto_rolusuario del usuario"}` | La consulta del usuario no trae ese campo |
| 502  | `{"resp": false, "msg": "El usuario no se encontró después de crearlo en bicicletero"}` | Se creó el usuario pero la consulta posterior no lo encuentra |
| 401 / 500 / 502 | | Ver [formato general](#formato-general-de-respuesta) |

---

## Flujo recomendado en el frontend

1. Al abrir el formulario, llamar `GET fn=rectorias` y llenar el selector de **Rectoría**.
2. Al elegir una rectoría, llamar `GET fn=sedes&rectoria=<idrectoria>` y llenar el selector de **Sede**.
3. Al enviar, llamar `POST fn=solicitud` con los datos del usuario, `rol` y el `idsede` elegido.
4. Para mostrar los cupos del usuario, llamar `GET fn=asignaciones&documento=<documento>`.
5. Si la respuesta es `502`, mostrar el `msg` y permitir reintentar más tarde.

---

## Notas de implementación

- **Archivos**: `modules/bicicletero.php` (dispatcher por `fn`) y `function/bicicletero.php` (clase `Bicicletero`, instanciada como `$classBicicletero` en `config/clases.php`).
- **Host de bicicletero**: constante `HOST_BICICLETERO` en `config/variables.php`.
- **Token de bicicletero**: wallet obtiene un JWT con `POST /api/auth/login-dev` y lo guarda en un archivo del directorio temporal del servidor (`bicicletero_token_<md5 del host>.json`, permisos `600`) hasta 60 segundos antes de su vencimiento (`exp` del JWT). Si bicicletero responde `401`, wallet pide un token nuevo y repite la llamada una sola vez. En producción el login será con Azure AD; solo cambia `Bicicletero::__token()`.
- **Nombres de campos de bicicletero**: están como constantes al inicio de la clase (`CAMPO_ROL_ID`, `CAMPO_ROL_DESCRIPCION`, `CAMPO_USUARIO_ID_ROL_USUARIO`, `CAMPO_USUARIO_ID_ROL`) para ajustarlos en un solo lugar si bicicletero los renombra.
- **Errores de bicicletero**: los `4xx` se reenvían al frontend con el mismo código y mensaje; los `5xx` y fallos de conexión se responden como `502` con mensaje genérico y el detalle se escribe con `error_log()`.

---

## Pendientes

- **`fn=asignaciones`**: `GET /api/users/{cedula}` de bicicletero todavía no devuelve el rol del usuario (`idrol`), por lo que esta operación responde `502` hasta que bicicletero lo agregue. Además, `/api/asignaciones/usuario` responde `500` cuando el `idrol` no corresponde al usuario, en lugar de una lista vacía.
- **Formulario**: faltan los campos `nombre` y `apellido`.
- **Producción**: definir `HOST_BICICLETERO` de producción y reemplazar `login-dev` por Azure AD.
