# Reporte de Auditoría de Testing: Backlog vs Código

## 1. Tabla de Historias del Backlog vs Estado de Tests

| Historia / Escenario | Estado | Observaciones |
|----------------------|--------|---------------|
| **HU 1: Creación de Ticket** - Creación exitosa | ⚠️ Parcial | Existe test de "Happy Path" para `POST`, pero no verifica notificaciones al asignar usuario ni valores por defecto ("Por Hacer"). |
| **HU 2: Gestión de Estados** - Mover ticket a "En progreso" | ⚠️ Parcial | Existe test de `PATCH` para cambiar estado, pero no valida las reglas de la columna inicial ni persistencia visual. |
| **HU 3: Métricas (Dashboard)** - Carga mensual | ❌ Sin test | No existe ningún test relacionado a la obtención de métricas o dashboards. |
| **Edge Case 1:** Rechazo sin título | ❌ Sin test | Solo se valida JSON malformado (HTTP 400), no la ausencia del campo `title`. |
| **Edge Case 1:** Rechazo sin usuario asignado | ❌ Sin test | No hay cobertura para validación de este campo obligatorio de negocio. |
| **Edge Case 1:** Rechazo prioridad inválida | ❌ Sin test | No se verifica que la prioridad esté dentro de los valores permitidos. |
| **Edge Case 2:** Rechazo de salto de estado | ⚠️ Parcial | El test simula un error de DB genérico (HTTP 500) en lugar de validar la lógica del flujo Kanban y retornar HTTP 400. |
| **Edge Case 2:** Rechazo reapertura sin privilegios | ❌ Sin test | No hay pruebas sobre control de acceso (RBAC) por roles. |
| **Edge Case 2:** Reapertura auditada por admin | ❌ Sin test | No se valida el registro de eventos en el historial de auditoría. |

## 2. Casos Borde (Edge Cases) del Gherkin sin Cobertura

Basado en la lectura de `backend/tests/tickets.test.ts`, los siguientes escenarios Gherkin no están siendo verificados en el código:

- **Validación de Completitud:** Creación de ticket sin título.
- **Validación de Asignación:** Creación de ticket sin especificar un usuario asignado.
- **Límites de Dominio:** Envío de un valor de prioridad no reconocido por el sistema.
- **Privilegios de Transición (RBAC):** Intento de reapertura de un ticket ("Listo" a "En progreso") por un usuario con rol estándar.
- **Trazabilidad:** Inserción del log de auditoría (usuario, fecha, estados) al realizar una reapertura de ticket forzada por un administrador.

## 3. Top 3 de Deuda Técnica de Testing (Por Criticidad de Negocio)

1. **Ausencia de validaciones de dominio en la creación de tickets (Criticidad: ALTA)**
   - **Impacto:** Actualmente la API (según sus tests) solo rechaza JSON malformados. La falta de validación de campos vitales (título, responsable) introducirá "basura" en la base de datos. Esto arruina las métricas, impide un correcto seguimiento y rompe la interfaz de usuario que espera esta data.
2. **Falta de cobertura en reglas de estado, flujo Kanban y roles (Criticidad: ALTA)**
   - **Impacto:** Las reglas del negocio que controlan el flujo (`Por hacer → En progreso → ...`) no se están probando activamente en la API. El único test asociado solo asume que la Base de Datos "hará el trabajo de rechazar" mediante un error 500. Esto oculta fallos de lógica y expone riesgos de seguridad al no verificar permisos de administrador para reaperturas de tickets cerrados.
3. **Nula cobertura para el módulo de Métricas/Dashboard (Criticidad: MEDIA-ALTA)**
   - **Impacto:** No hay ni un solo test que cubra la HU 3 (métrica de tickets en "Listo" acumulados del mes). Al ser el panel de evaluación gerencial, cualquier regresión o cálculo erróneo afectará la toma de decisiones basada en rendimiento del equipo.
