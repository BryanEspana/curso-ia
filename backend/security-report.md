# Reporte de Auditoría de Seguridad (OWASP Top 10)

**Componentes Auditados:** `@app/api/`, `@src/lib/supabase.ts`, `@next.config.mjs`

## Hallazgos

### 1. [CRÍTICO] A01:2021 - Broken Access Control
- **Archivo:** `app/api/tickets/route.ts` y `app/api/tickets/[id]/route.ts`
- **Evidencia:** Los endpoints no verifican ninguna cabecera de autorización (`Authorization: Bearer <token>`) antes de llamar a Supabase.
- **Impacto:** Cualquier usuario no autenticado puede consultar (`GET`), crear (`POST`) o modificar (`PATCH`) tickets en la aplicación sin restricción alguna.

### 2. [ALTO] A07:2021 - Identification and Authentication Failures
- **Archivo:** `src/lib/supabase.ts`
- **Evidencia:** Se está instanciando el cliente de Supabase asumiendo que eventualmente se usaría un `SERVICE_ROLE_KEY` o ignorando el contexto de la petición actual.
- **Impacto:** En el futuro, si se usan variables de entorno estáticas, el backend pasará por alto las políticas Row Level Security (RLS) en la base de datos de Supabase. Esto permite el acceso de superusuario a datos sensibles de otras empresas o proyectos.

### 3. [MEDIO] A05:2021 - Security Misconfiguration
- **Archivo:** `next.config.mjs`
- **Evidencia:** La cabecera CORS estipula explícitamente `Access-Control-Allow-Origin: "http://localhost:5173"`.
- **Impacto:** Es completamente seguro en entornos locales de desarrollo, pero en un entorno de producción bloquearía los requests legítimos desde tu propio dominio, o si se modifica a `*`, permitiría Cross-Site Request Forgery y robo de datos. Requiere manejar orígenes por variables de entorno según el stage (Dev/Prod).

### 4. [BAJO] A04:2021 - Insecure Design (Validación de Input)
- **Archivo:** `app/api/tickets/route.ts`
- **Evidencia:** El request asíncrono se extrae con `await request.json()` y su payload resultante se inserta a la base de datos sin filtrado previo: `insert([body])`.
- **Impacto:** No hay una capa estricta de validación y limpieza de payloads (por ejemplo usando librerías como Zod). Esto abre una potencial inyección en el nivel de base de datos o permite guardar registros inconsistentes que rompan la UI (ej. status no permitidos).
