# Especificaciones Frontend (Mini Jira)

## Stack Tecnológico
- **Framework:** React 18/19 (usando Vite para scaffolding).
- **Lenguaje:** TypeScript estricto.
- **Estilos:** Tailwind CSS.
- **Estado Global:** Zustand.
- **Iconos:** Lucide React.

## Estructura de Directorios (Atomic Design)
- `/src/components/atoms`: Botones, Badges.
- `/src/components/molecules`: `TaskCard`.
- `/src/components/organisms`: `KanbanColumn`, `Sidebar`, `Header`.
- `/src/components/templates`: `KanbanBoard` y `Layout`.
- `/src/store`: `kanbanStore.ts` (lógica de estado y optimistic updates).

## Reglas de Negocio Clave
- **Optimistic UI:** El movimiento de las tarjetas entre columnas debe reflejarse en la UI en 0ms.
- **Rollback:** Si la petición al backend falla (simulada con un `setTimeout`), la tarjeta debe volver a su posición original.
- **Renderizado Presentacional:** Los componentes UI no deben mezclar lógica compleja; delegan acciones al store.
