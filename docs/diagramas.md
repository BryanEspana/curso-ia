# Diagramas del Sistema Mini Jira

## 1. Flujo de Autenticación JWT

Este diagrama de secuencia muestra el proceso de inicio de sesión mediante credenciales y el uso posterior del JSON Web Token (JWT) para acceder a recursos protegidos.

```mermaid
sequenceDiagram
    participant Cliente
    participant API
    participant BaseDatos as Base de Datos

    Cliente->>API: POST /login (usuario, contraseña)
    API->>BaseDatos: Verificar credenciales
    BaseDatos-->>API: Usuario válido
    API->>API: Generar JWT
    API-->>Cliente: 200 OK (Retorna JWT)

    Note over Cliente,API: Petición a recurso protegido
    Cliente->>API: GET /recurso (Authorization: Bearer JWT)
    API->>API: Validar JWT
    
    alt JWT Válido
        API->>BaseDatos: Consultar datos requeridos
        BaseDatos-->>API: Datos
        API-->>Cliente: 200 OK (Retorna datos)
    else JWT Inválido / Expirado
        API-->>Cliente: 401 Unauthorized
    end
```

## 2. Movimiento de Ticket con Lock Pesimista y Registro en AuditLog

Este diagrama de secuencia ilustra cómo un ticket es movido entre columnas, asegurando la consistencia transaccional mediante un bloqueo pesimista (Pessimistic Lock) y dejando un rastro en el registro de auditoría (`AuditLog`).

```mermaid
sequenceDiagram
    participant Cliente
    participant API
    participant DB as Base de Datos
    participant Audit as Audit Log

    Cliente->>API: PATCH /tickets/{id}/move (nuevo estado)
    API->>DB: Iniciar Transacción (BEGIN)
    
    Note over API,DB: Bloqueo para evitar concurrencia<br/>(SELECT ... FOR UPDATE)
    API->>DB: Adquirir Pessimistic Lock del Ticket
    DB-->>API: Lock obtenido exitosamente
    
    API->>API: Validar transición de estado
    
    alt Transición válida
        API->>DB: Actualizar estado del Ticket (UPDATE)
        API->>Audit: Registrar evento (INSERT: ticket_id, old_status, new_status)
        API->>DB: Confirmar Transacción (COMMIT)
        Note over DB: El Lock es liberado
        API-->>Cliente: 200 OK (Ticket actualizado)
    else Transición inválida / Error
        API->>DB: Revertir Transacción (ROLLBACK)
        Note over DB: El Lock es liberado
        API-->>Cliente: 400 Bad Request
    end
```

## 3. Ciclo de Vida de un Ticket

El siguiente diagrama de flujo muestra los posibles estados de un ticket (TODO, IN_PROGRESS, DONE) y los nodos intermedios que representan el intento de adquirir un Lock Pesimista durante la transición.

```mermaid
flowchart LR
    Start([Creación]) --> TODO[Por Hacer (TODO)]

    TODO --> TryLock1{Pessimistic<br/>Lock}
    TryLock1 -- "Éxito" --> IN_PROGRESS[En Progreso (IN_PROGRESS)]
    TryLock1 -- "Fallo/Ocupado" --> TODO

    IN_PROGRESS --> TryLock2{Pessimistic<br/>Lock}
    TryLock2 -- "Éxito" --> DONE[Listo (DONE)]
    TryLock2 -- "Fallo/Ocupado" --> IN_PROGRESS
    
    IN_PROGRESS --> TryLock3{Pessimistic<br/>Lock}
    TryLock3 -- "Éxito" --> TODO
    TryLock3 -- "Fallo/Ocupado" --> IN_PROGRESS

    DONE --> TryLock4{Pessimistic<br/>Lock}
    TryLock4 -- "Éxito" --> IN_PROGRESS
    TryLock4 -- "Fallo/Ocupado" --> DONE
```
