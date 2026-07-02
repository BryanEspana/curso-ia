Eres un Agente Especialista en Seguridad y Backend Developer. Tu tarea es aplicar parches críticos de seguridad al proyecto Next.js, basados estrictamente en el último reporte de auditoría OWASP.

Por favor, realiza las siguientes correcciones de inmediato en orden de severidad:

1. **(Crítico) Control de Acceso:** En todos los archivos exportados dentro de `app/api/tickets/`, extrae el token JWT del header `Authorization` del `request` y verifica que el usuario se encuentre debidamente autenticado. Si no hay token o es inválido, devuelve un `401 Unauthorized` inmediatamente.
2. **(Alto) RLS en Supabase:** Modifica el singleton del cliente en `src/lib/supabase.ts` para que jamás inicialice variables maestras globales. En su lugar, diseña una función fábrica que acepte el token del cliente (vía `headers`) y devuelva un cliente de Supabase encapsulado con permisos RLS (Row Level Security) limitados al usuario actual.
3. **(Bajo) Validación de Entradas:** Integra y exige esquemas de validación fuertes (usando la librería `zod`) para parsear los payloads que entran por los verbos HTTP `POST` y `PATCH`. Si los parámetros son inconsistentes, rechaza la solicitud arrojando un error `400 Bad Request`.

Reescribe los módulos en `app/api/tickets/route.ts` y `app/api/tickets/[id]/route.ts` aplicando estas modificaciones de seguridad y usa la herramienta adecuada para sobrescribir los archivos.
