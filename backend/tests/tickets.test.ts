import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../app/api/tickets/route';
import { PATCH } from '../app/api/tickets/[id]/route';

// Mock Supabase
const { mockSupabase } = vi.hoisted(() => {
  return {
    mockSupabase: {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn()
    }
  }
});

vi.mock('@/src/lib/supabase', () => ({
  supabase: mockSupabase
}));

describe('Tickets API P0 Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/tickets', () => {
    it('Happy Path: Returns list of tickets', async () => {
      // Given: Supabase devuelve un array de tickets
      mockSupabase.select.mockResolvedValueOnce({ data: [{ id: '1', title: 'Test' }], error: null });

      // When: Llamamos al endpoint GET
      const response = await GET();
      const json = await response.json();

      // Then: Obtenemos status 200 y los datos correctos
      expect(response.status).toBe(200);
      expect(json.data).toHaveLength(1);
    });

    it('Error: Database returns error', async () => {
      // Given: Supabase falla
      mockSupabase.select.mockResolvedValueOnce({ data: null, error: 'DB Error' });

      // When
      const response = await GET();

      // Then: Retorna 500
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/tickets', () => {
    it('Happy Path: Creates a new ticket', async () => {
      // Given: Payload válido
      const payload = { title: 'Nuevo ticket', priority: 'High', project_id: '123' };
      const req = new Request('http://localhost/api/tickets', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      mockSupabase.single.mockResolvedValueOnce({ data: { id: 'new', ...payload }, error: null });

      // When
      const response = await POST(req);
      const json = await response.json();

      // Then: Status 201 y ticket devuelto
      expect(response.status).toBe(201);
      expect(json.data.id).toBe('new');
    });

    it('Validation Error: Invalid JSON payload', async () => {
      // Given: Un payload que no es JSON válido
      const req = new Request('http://localhost/api/tickets', {
        method: 'POST',
        body: 'not-a-json'
      });

      // When
      const response = await POST(req);

      // Then: Bad Request 400
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/tickets/[id]', () => {
    it('Happy Path: Updates ticket status', async () => {
      // Given: ID válido y payload de status
      const req = new Request('http://localhost/api/tickets/1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'DONE' })
      });
      const context = { params: Promise.resolve({ id: '1' }) };
      mockSupabase.single.mockResolvedValueOnce({ data: { id: '1', status: 'DONE' }, error: null });

      // When
      const response = await PATCH(req, context);
      const json = await response.json();

      // Then: Status 200 y ticket actualizado
      expect(response.status).toBe(200);
      expect(json.data.status).toBe('DONE');
    });

    it('Edge Case Crítico: Salto de estado no permitido (lógica delegada al backend/DB)', async () => {
      // Given: Un ticket que falla la validación en base de datos (por constraints o policy)
      const req = new Request('http://localhost/api/tickets/1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'DONE' })
      });
      const context = { params: Promise.resolve({ id: '1' }) };
      // Simulamos que la DB rechaza la operación
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: 'Transition not allowed' });

      // When
      const response = await PATCH(req, context);

      // Then: Retorna error 500 (o 400 si validamos en la API)
      expect(response.status).toBe(500);
    });
  });
});
