import React from 'react';
import Layout from './components/templates/Layout';
import KanbanBoard from './components/templates/KanbanBoard';

function App() {
  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Sprints Activos</h2>
        <p className="text-slate-500 dark:text-slate-400">Mueve las tarjetas para actualizar su estado (Prueba el Optimistic UI). Arrastra una tarjeta a otra columna.</p>
      </div>
      <KanbanBoard />
    </Layout>
  );
}

export default App;
