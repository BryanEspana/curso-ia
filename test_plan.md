# Plan de Pruebas BDD y Edge Cases

## 1. Criterios de Aceptación (Gherkin Base)
Se validarán las historias de usuario críticas (Creación de tickets, Tablero Kanban, y Dashboard) utilizando el estándar BDD (Given-When-Then).

## 2. Matriz de Priorización de Edge Cases

| Impacto de Negocio | Probabilidad de Ocurrencia | Descripción del Edge Case | Prioridad QA |
| :--- | :--- | :--- | :--- |
| **Alto** | Alta | Fallo de red justo en el momento de guardar o cambiar estado del ticket. | **Crítica** |
| **Alto** | Baja | Edición concurrente extrema (dos usuarios editando el mismo ticket al mismo tiempo). | **Alta** |
| **Medio** | Alta | Envío de ticket con entradas nulas o inyección de código (XSS) en la descripción. | **Media** |
| **Medio** | Baja | Sobrecarga de notificaciones de email (SPAM) si se hacen múltiples cambios rápidos. | **Baja** |
| **Bajo** | Alta | Fallos estéticos al alternar repetidamente entre modo claro y oscuro. | **Baja** |

## 3. Estrategia de Testing (Shift-Left)
- **Unit Tests:** Pruebas de la lógica de roles (Admin vs Usuario).
- **E2E Tests:** Flujo completo de "Crear -> Mover a Listo -> Ver en Dashboard".
