import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
      <div>
        <h1 className="text-xl font-bold">Proyecto MVP</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar tickets..." 
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-slate-900 dark:text-slate-100"
          />
        </div>
        <button className="relative text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
          + Nuevo Ticket
        </button>
      </div>
    </header>
  );
}
