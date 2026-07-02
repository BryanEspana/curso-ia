# Referencia de API

## Autenticación
La API utiliza JSON Web Tokens (JWT) para la autenticación de usuarios. El flujo de autenticación es el siguiente:
1. **Login**: El usuario envía sus credenciales. Si son válidas, el servidor responde con un token de acceso y un token de refresco.
2. **Token**: El token de acceso se debe incluir en todas las peticiones a los endpoints protegidos mediante el header: `Authorization: Bearer {token}`.
3. **Refresh**: Cuando el token de acceso expira, el cliente utiliza el token de refresco para obtener un nuevo token de acceso de forma transparente.

## Tabla de Endpoints

| Método | Ruta | Auth | Body | Response | Status Codes |
|---|---|---|---|---|---|
| GET | `/api/projects/[id]` | JWT | N/A | Objeto Project con listas de tickets | 200, 401, 403, 404, 500 |
| GET | `/api/tickets` | JWT | N/A (Params: `project_id`, `status`) | Array de Tickets | 200, 400, 401, 403, 500 |
| POST | `/api/tickets` | JWT | `{ "title": "...", "priority": "...", "project_id": "..." }` | Ticket creado | 200, 400, 401, 403, 500 |
| PATCH | `/api/tickets/[id]` | JWT | `{ "status": "..." }` | Ticket actualizado | 200, 400, 401, 403, 404, 500 |
| POST | `/api/tickets/[id]/lock` | JWT | N/A | Éxito o error de conflicto | 200, 401, 403, 404, 409, 500 |
| DELETE | `/api/tickets/[id]/lock` | JWT | N/A | Éxito de liberación | 200, 401, 403, 404, 500 |
| GET | `/api/audit/[ticketId]` | JWT | N/A | Array de logs inmutables | 200, 401, 403, 404, 500 |

*Nota: Todas las respuestas siguen el formato Envelope: `{ "data": <payload>, "error": <mensaje_o_nulo> }`.*

## Ejemplos cURL (Prioridad 0)

### 1. Obtener Sprints / Tableros
```bash
curl -X GET "http://localhost:3000/api/projects/123" \
  -H "Authorization: Bearer {token}"
```

### 2. Listar Tickets
```bash
curl -X GET "http://localhost:3000/api/tickets?project_id=123&status=TODO" \
  -H "Authorization: Bearer {token}"
```

### 3. Crear Ticket
```bash
curl -X POST "http://localhost:3000/api/tickets" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nuevo problema en backend",
    "priority": "HIGH",
    "project_id": "123"
  }'
```

### 4. Actualizar Estado (Mover Ticket)
```bash
curl -X PATCH "http://localhost:3000/api/tickets/456" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```
