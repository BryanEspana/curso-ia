-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'User' CHECK (role IN ('Admin', 'User')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Tickets
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'To-Do' CHECK (status IN ('To-Do', 'In-Progress', 'Done')),
    priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Comentarios
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (Ejemplo simple: Todos leen, pero Admin puede borrar)
CREATE POLICY "Public read tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Admin delete tickets" ON tickets FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
);

-- Datos Mockeados (Seed Data)
INSERT INTO users (id, email, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin@minijira.com', 'Admin'),
('22222222-2222-2222-2222-222222222222', 'user1@minijira.com', 'User'),
('33333333-3333-3333-3333-333333333333', 'user2@minijira.com', 'User');

INSERT INTO tickets (id, title, description, status, priority, assigned_to, created_by) VALUES 
('44444444-4444-4444-4444-444444444441', 'Configurar Supabase', 'Setup de la BD y RLS', 'Done', 'High', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
('44444444-4444-4444-4444-444444444442', 'Crear UI del Tablero', 'Kanban board con React y Tailwind', 'In-Progress', 'High', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
('44444444-4444-4444-4444-444444444443', 'Implementar Drag and Drop', 'Permitir mover tarjetas', 'To-Do', 'Medium', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
('44444444-4444-4444-4444-444444444444', 'Gráficas en el Dashboard', 'Usar chart.js para métricas', 'To-Do', 'Low', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
('44444444-4444-4444-4444-444444444445', 'Pruebas E2E', 'Configurar Cypress o Playwright', 'To-Do', 'Medium', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111');
