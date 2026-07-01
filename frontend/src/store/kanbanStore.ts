import { create } from 'zustand';

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
    // Simulando una llamada al backend que tarda 1 segundo (Latencia de red)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulamos un fallo aleatorio (20% de probabilidad) para demostrar el Rollback automático
        if (Math.random() < 0.2) {
          reject(new Error('❌ Error de Red: Fallo al actualizar la tarea en BD'));
        } else {
          set((state) => ({
            tasks: state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t)
          }));
          resolve();
        }
      }, 1000);
    });
  }
}));
