# Product Requirements Document (PRD): Mini Jira

## 1. Objetivos del Proyecto
Desarrollar un sistema interno de gestión de tickets ("Mini Jira") para un equipo de 10 personas, que sea altamente intuitivo, visualmente atractivo (estilo limpio/moderno) y esté listo para producción en 3 semanas.

## 2. In-Scope (Qué hacer)
- **Gestión de Tickets:** Crear, editar, archivar (eliminación lógica), y asignar.
- **Campos del Ticket:** Título, Descripción, Prioridad, y Usuario asignado.
- **Roles:** Administrador (gestión total) y Usuario Estándar (creación y trabajo propio).
- **Tablero Kanban:** 3 columnas fijas (Por Hacer, En Progreso, Listo).
- **Colaboración:** Sección de comentarios en cada ticket.
- **Notificaciones:** Alertas por email para menciones o asignaciones.
- **Dashboard:** Gráficas de métricas mensuales (tickets cerrados).
- **UI/UX:** Diseño minimalista tipo "Apple", sombras suaves, y soporte para Modo Oscuro.

## 3. Out-Scope (Qué NO hacer)
- Creación de estados de ticket dinámicos o columnas adicionales (ej. "Review", "Blocked").
- Eliminación física (Hard delete) de tickets de la base de datos.
- Aplicación móvil nativa (solo web responsive).

## 4. Stack Tecnológico
- **Frontend:** Next.js (App Router), React, TailwindCSS, shadcn/ui.
- **Backend:** Next.js Server Actions / API Routes.
- **Base de Datos:** Supabase (PostgreSQL) con Row Level Security (RLS).
