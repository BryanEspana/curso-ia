import React, { useOptimistic, startTransition } from 'react';
import { useKanbanStore } from '../../store/kanbanStore';
import type { Task, Status } from '../../store/kanbanStore';
import KanbanColumn from '../organisms/KanbanColumn';

export default function KanbanBoard() {
  const { tasks, updateTaskStatus } = useKanbanStore();
  const columns: Status[] = ['To-Do', 'In-Progress', 'Done'];

  // React 19 useOptimistic para la UI predictiva
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state: Task[], update: { id: string; newStatus: Status }) => {
      return state.map((t) => t.id === update.id ? { ...t, status: update.newStatus } : t);
    }
  );

  const handleMoveTask = async (id: string, newStatus: Status) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.status === newStatus) return;

    // 1. Proyectar el estado visual instantáneo (0ms)
    startTransition(() => {
      addOptimisticTask({ id, newStatus });
    });

    try {
      // 2. Ejecutar llamada al Backend (tarda 1s)
      await updateTaskStatus(id, newStatus);
    } catch (error) {
      // 3. Rollback Automático: Si falla, useOptimistic revierte solo
      alert((error as Error).message);
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-full">
      {columns.map((col) => (
        <KanbanColumn 
          key={col} 
          title={col} 
          tasks={optimisticTasks.filter(t => t.status === col)} 
          onMoveTask={handleMoveTask}
        />
      ))}
    </div>
  );
}
