# Contrato de API - Mini Jira

## Estándares Globales
- **Rutas base:** `/api/[recurso]`
- **Envelope de Respuesta:** `{ "data": <payload>, "error": <mensaje_o_nulo> }`
- **Paginación:** Limit y Offset.
- **Errores HTTP:** Códigos estándar (400, 401, 403, 404, 500, 409 para conflictos).

## Endpoints Prioridad 0 (P0) - Core Kanban
Bloqueadores directos del tablero.

### 1. Obtener Sprints / Tableros
- **Método:** `GET`
- **Ruta:** `/api/projects/[id]`
- **Response Data:** Objeto Project con listas de tickets.

### 2. Listar Tickets
- **Método:** `GET`
- **Ruta:** `/api/tickets`
- **QueryParams:** `?project_id=...&status=...`
- **Response Data:** Array de Tickets.

### 3. Crear Ticket
- **Método:** `POST`
- **Ruta:** `/api/tickets`
- **Payload:** `{ title, priority, project_id }`
- **Response Data:** Ticket creado.

### 4. Actualizar Estado (Mover Ticket)
- **Método:** `PATCH`
- **Ruta:** `/api/tickets/[id]`
- **Payload:** `{ status }`
- **Response Data:** Ticket actualizado.

## Endpoints Prioridad 1 (P1) - Lógica Especial

### 5. Adquirir Lock Pesimista
- **Método:** `POST`
- **Ruta:** `/api/tickets/[id]/lock`
- **Payload:** Ninguno.
- **Regla:** Si `expires_at > now()` y es de otro usuario → 409 Conflict. Si es del mismo usuario, renovar timeout (15 min).

### 6. Liberar Lock
- **Método:** `DELETE`
- **Ruta:** `/api/tickets/[id]/lock`
- **Regla:** Eliminar registro solo si `locked_by = usuario_actual`.

### 7. Consultar Audit Log
- **Método:** `GET`
- **Ruta:** `/api/audit/[ticketId]`
- **Response Data:** Array de logs inmutables para ese ticket.
