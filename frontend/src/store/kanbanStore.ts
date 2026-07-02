import { create } from 'zustand';
import { updateTicketStatusApi } from '../lib/api';

export type Status = 'To-Do' | 'In-Progress' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
}

interface KanbanState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (id: string, newStatus: Status) => Promise<void>;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Implementar Drag and Drop', status: 'To-Do', priority: 'Medium' },
  { id: '2', title: 'Gráficas en el Dashboard', status: 'To-Do', priority: 'Low' },
  { id: '3', title: 'Pruebas E2E', status: 'To-Do', priority: 'Medium' },
  { id: '4', title: 'Crear UI del Tablero', status: 'In-Progress', priority: 'High' },
  { id: '5', title: 'Configurar Supabase', status: 'Done', priority: 'High' }
];

export const useKanbanStore = create<KanbanState>((set, get) => ({
  tasks: mockTasks,
  setTasks: (tasks) => set({ tasks }),
  updateTaskStatus: async (id, newStatus) => {
    // 1. Llamada a la API real (Backend Next.js)
    await updateTicketStatusApi(id, newStatus);
    
    // 2. Si es exitoso, actualizar el store local (Optimistic UI ya ocurrió en KanbanBoard)
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t)
    }));
  }
}));
