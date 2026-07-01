# ADR 001: Selección de Base de Datos para el MVP

## Contexto (Problema)
Necesitamos una base de datos para el proyecto "Mini Jira" que debe completarse en 3 semanas. El sistema requiere relaciones claras (Usuarios, Tickets, Comentarios), soporte para notificaciones, y debe ser altamente rápido para implementar.

## Opciones Consideradas
1. **Firebase / NoSQL:** Muy rápido de implementar, pero difícil de manejar relaciones complejas de estados e historiales a largo plazo.
2. **PostgreSQL puro en AWS/Azure:** Robusto, pero requiere mucha configuración de infraestructura que consume tiempo del MVP.
3. **Supabase (Backend-as-a-Service con PostgreSQL):** Ofrece Postgres relacional completo, APIs instantáneas y autenticación integrada.

## Decisión Tomada
✅ **Supabase (PostgreSQL)**

## Consecuencias (Impacto)
- **Positivo:** Acelerará el desarrollo drásticamente. Las Row Level Security (RLS) manejarán los permisos de Admin vs User sin código extra en el backend.
- **Deuda Técnica:** Acoplamiento temprano a los servicios específicos de Supabase (ej. Auth), lo que dificultaría una migración futura si el equipo crece masivamente.
