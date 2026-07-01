import React from 'react';
import { LayoutDashboard, CheckSquare, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      <div className="p-6 font-bold text-2xl tracking-wider border-b border-slate-800">
        Mini Jira
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <a href="#" className="flex items-center gap-3 bg-blue-600 px-4 py-3 rounded-lg text-white font-medium">
          <LayoutDashboard size={20} />
          Kanban Board
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <CheckSquare size={20} />
          Mis Tareas
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Settings size={20} />
          Configuración
        </a>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">JD</div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-400">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
