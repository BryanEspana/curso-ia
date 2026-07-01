import React from 'react';
import type { Task, Status } from '../../store/kanbanStore';
import TaskCard from '../molecules/TaskCard';

interface KanbanColumnProps {
  title: Status;
  tasks: Task[];
  onMoveTask: (id: string, newStatus: Status) => void;
}

export default function KanbanColumn({ title, tasks, onMoveTask }: KanbanColumnProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onMoveTask(taskId, title);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necesario para permitir el drop
  };

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex-shrink-0 w-80 flex flex-col bg-slate-100 dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 min-h-[500px]"
    >
      <h2 className="font-semibold text-lg mb-4 flex justify-between items-center">
        {title}
        <span className="bg-slate-200 dark:bg-slate-700 text-sm px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </h2>
      
      <div className="flex flex-col gap-3 flex-grow">
        {tasks.map((ticket) => (
          <TaskCard key={ticket.id} task={ticket} />
        ))}
      </div>
    </div>
  );
}
