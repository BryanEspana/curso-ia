import React from 'react';

const mockTickets = [
  { id: 1, title: 'Implementar Drag and Drop', status: 'To-Do', priority: 'Medium' },
  { id: 2, title: 'Gráficas en el Dashboard', status: 'To-Do', priority: 'Low' },
  { id: 3, title: 'Pruebas E2E', status: 'To-Do', priority: 'Medium' },
  { id: 4, title: 'Crear UI del Tablero', status: 'In-Progress', priority: 'High' },
  { id: 5, title: 'Configurar Supabase', status: 'Done', priority: 'High' }
];

export default function KanbanBoard() {
  const columns = ['To-Do', 'In-Progress', 'Done'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 font-sans text-slate-900 dark:text-slate-100">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mini Jira</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestión de Tareas MVP</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
          + Nuevo Ticket
        </button>
      </header>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col} className="flex-shrink-0 w-80 flex flex-col bg-slate-100 dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-lg mb-4 flex justify-between items-center">
              {col}
              <span className="bg-slate-200 dark:bg-slate-700 text-sm px-2 py-0.5 rounded-full">
                {mockTickets.filter((t) => t.status === col).length}
              </span>
            </h2>
            
            <div className="flex flex-col gap-3 flex-grow">
              {mockTickets
                .filter((t) => t.status === col)
                .map((ticket) => (
                  <div key={ticket.id} className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 cursor-grab hover:shadow-md transition-shadow">
                    <h3 className="font-medium mb-2">{ticket.title}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {ticket.priority}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                        U
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
