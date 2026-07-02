# Documentación de la Base de Datos

## Diagrama Entidad-Relación (ERD)

```mermaid
erDiagram
    users ||--o{ projects : "creates"
    users ||--o{ project_members : "is member"
    projects ||--o{ project_members : "has"
    projects ||--o{ tickets : "contains"
    users ||--o{ tickets : "creates"
    tickets ||--o{ ticket_assignees : "assigned to"
    users ||--o{ ticket_assignees : "assigned to"
    tickets ||--o{ ticket_tags : "has"
    tags ||--o{ ticket_tags : "tagged"
    tickets ||--o{ comments : "has"
    users ||--o{ comments : "authors"
    tickets ||--o| ticket_locks : "locked by"
    users ||--o{ ticket_locks : "locks"
    tickets ||--o{ audit_log : "tracked"
    users ||--o{ audit_log : "caused by"

    users {
        uuid id PK
        text email UK "NOT NULL"
        text name "NOT NULL"
        text avatar_url
        timestamptz created_at
    }
    
    projects {
        uuid id PK
        text name "NOT NULL"
        uuid created_by FK
        timestamptz created_at
    }
    
    project_members {
        uuid project_id PK, FK
        uuid user_id PK, FK
        enum role
    }

    tags {
        uuid id PK
        text name UK "NOT NULL"
        text color
    }
    
    tickets {
        uuid id PK
        text title "NOT NULL"
        text description
        enum status
        enum priority
        uuid project_id FK
        uuid created_by FK
        timestamptz archived_at
        timestamptz created_at
    }

    ticket_assignees {
        uuid ticket_id PK, FK
        uuid user_id PK, FK
    }

    ticket_tags {
        uuid ticket_id PK, FK
        uuid tag_id PK, FK
    }

    comments {
        uuid id PK
        uuid ticket_id FK
        uuid user_id FK
        text content "NOT NULL"
        timestamptz created_at
    }

    ticket_locks {
        uuid ticket_id PK, FK
        uuid locked_by FK
        timestamptz locked_at "NOT NULL"
        timestamptz expires_at "NOT NULL"
    }
    
    audit_log {
        uuid id PK
        uuid ticket_id FK
        uuid user_id FK
        text field "NOT NULL"
        text old_value
        text new_value
        timestamptz changed_at
    }
```

## Columnas Clave y Restricciones

| Tabla | Columna | Tipo | Restricción | Descripción |
| --- | --- | --- | --- | --- |
| `users` | `id` | uuid | PK | Identificador único del usuario. |
| `users` | `email` | text | NOT NULL, UNIQUE | Correo electrónico, debe ser único. |
| `projects` | `id` | uuid | PK | Identificador del proyecto. |
| `projects` | `created_by` | uuid | FK (`users.id`) | Relaciona al usuario creador. |
| `project_members` | `project_id`, `user_id` | uuid | PK, FK | Relación muchos a muchos para miembros del proyecto. |
| `tickets` | `id` | uuid | PK | Identificador único del ticket. |
| `tickets` | `title` | text | NOT NULL (MAX 255) | Título principal. |
| `tickets` | `project_id` | uuid | FK (`projects.id`) | Proyecto al que pertenece. |
| `ticket_locks` | `ticket_id` | uuid | PK, FK | Ticket bloqueado actualmente. |
| `audit_log` | `id` | uuid | PK | Registro de la auditoría. |

## Decisiones de Diseño

1. **Soft Delete (`archived_at` en `tickets`)**:
   Los tickets no se eliminan físicamente (hard delete) para mantener consistencia histórica, sino que se marcan con una marca de tiempo en `archived_at`.

2. **Pessimistic Lock (`ticket_locks`)**:
   Se utiliza para la edición colaborativa o concurrente de tickets. Permite bloquear un ticket por un usuario específico (registrado en `locked_by`). El bloqueo expira automáticamente (`expires_at`), lo que evita interbloqueos si el usuario abandona la sesión (tiempo de expiración: 15 mins).

3. **AuditLog Inmutable (`audit_log`)**:
   Tabla de solo inserción (append-only) que rastrea de manera estricta los cambios de estado y campos específicos. Esto asegura un historial confiable a nivel de modificaciones sin la posibilidad de alterar dichos registros pasados.
