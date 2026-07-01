import React from 'react';
import type { Task } from '../../store/kanbanStore';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <h3 className="font-medium mb-2">{task.title}</h3>
      <div className="flex justify-between items-center mt-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
          task.priority === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
          'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
        }`}>
          {task.priority}
        </span>
        <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
          U
        </div>
      </div>
    </div>
  );
}
