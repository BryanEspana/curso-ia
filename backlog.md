# Backlog Principal — Mini Jira MVP

## Historia de Usuario 1 — Creación de Ticket
```gherkin
Feature: Creación de tickets en el tablero
  Como usuario autenticado
  Quiero poder crear un ticket nuevo con título, descripción y prioridad
  Para registrar tareas pendientes en el sistema

  Scenario: Creación exitosa de un ticket
    Given que estoy en el tablero principal
    When hago clic en el botón "Nuevo Ticket"
    And lleno el formulario con datos válidos
    And presiono "Guardar"
    Then el ticket debe aparecer en la columna "Por Hacer"
    And se debe enviar una notificación si asigné a alguien
```

## Historia de Usuario 2 — Gestión de Estados (Kanban)
```gherkin
Feature: Flujo Kanban de tickets
  Como usuario del sistema
  Quiero mover tickets entre las columnas "Por hacer", "En progreso" y "Listo"
  Para mantener actualizado el estado del trabajo

  Scenario: Mover ticket a "En progreso"
    Given que un ticket se encuentra en la columna "Por hacer"
    When arrastro el ticket a la columna "En progreso"
    Then el sistema actualiza el estado del ticket en la base de datos
    And el ticket permanece visible en la nueva columna
```

## Historia de Usuario 3 — Visualización de Métricas (Dashboard)
```gherkin
Feature: Dashboard de productividad
  Como Administrador
  Quiero ver gráficas de tickets cerrados en el mes
  Para evaluar el rendimiento del equipo

  Scenario: Carga de métricas mensuales
    Given que soy un Administrador autenticado
    When navego a la vista de "Dashboard"
    Then el sistema carga un gráfico de barras con los tickets en estado "Listo"
    And muestra el total acumulado del mes en curso
```

---

# Backlog — Edge Cases Mini Jira MVP

## Edge Case 1 — Creación de ticket con campos requeridos ausentes

**Deducción:** El PRD exige título, descripción, prioridad y usuario asignado como campos mínimos.
Si el backend no valida explícitamente, un ticket incompleto puede persistir y romper
las métricas del dashboard, la auditoría y las vistas de filtrado.

```gherkin
Feature: Validación de campos requeridos al crear un ticket

  Como sistema
  Quiero rechazar tickets con datos incompletos
  Para garantizar la integridad de la información y la coherencia de las métricas

  Scenario: Rechazo de ticket sin título
    Given un usuario autenticado con permiso para crear tickets
    When el usuario intenta registrar un ticket sin título
    Then el sistema rechaza la operación
    And devuelve un error indicando que el título es obligatorio
    And no se crea ningún registro en la base de datos

  Scenario: Rechazo de ticket sin usuario asignado
    Given un usuario autenticado con permiso para crear tickets
    When el usuario intenta registrar un ticket sin especificar un asignado
    Then el sistema rechaza la operación
    And devuelve un error indicando que el asignado es obligatorio
    And no se genera entrada en el historial de auditoría

  Scenario: Rechazo de ticket con prioridad fuera de los valores permitidos
    Given un usuario autenticado con permiso para crear tickets
    When el usuario envía una solicitud con un valor de prioridad no reconocido por el sistema
    Then el sistema rechaza la operación
    And devuelve un error indicando los valores de prioridad válidos
    And el estado del sistema no se ve afectado
```

---

## Edge Case 2 — Transición de estado fuera del flujo permitido

**Deducción:** El PRD define un flujo de estados explícito (`Por hacer → En progreso → Bloqueado →
Review → Listo`). No existe una regla que impida saltos arbitrarios (ej: `Por hacer → Listo`)
salvo que el backend los valide. Un salto indebido rompe las métricas de tiempo por estado
y oculta cuellos de botella identificados como riesgo en la sección 9 del PRD.

```gherkin
Feature: Validación de transiciones de estado en tickets

  Como sistema
  Quiero que los cambios de estado respeten el flujo definido
  Para garantizar la trazabilidad y la coherencia de las métricas operativas

  Scenario: Rechazo de salto de estado no permitido
    Given un ticket en estado "Por hacer"
    When un usuario intenta cambiar el estado directamente a "Listo"
    Then el sistema rechaza la transición
    And devuelve un error indicando que la transición no es válida
    And el ticket permanece en su estado original

  Scenario: Rechazo de reapertura de ticket cerrado sin privilegios
    Given un ticket en estado "Listo"
    When un usuario estándar intenta cambiar el estado a "En progreso"
    Then el sistema rechaza la operación
    And notifica que la reapertura requiere permisos de administrador

  Scenario: Reapertura auditada por un administrador
    Given un ticket en estado "Listo"
    When un administrador reabre el ticket cambiando su estado a "En progreso"
    Then el sistema acepta la transición
    And registra en auditoría el evento de reapertura con el usuario, fecha y estados anterior y nuevo
```
