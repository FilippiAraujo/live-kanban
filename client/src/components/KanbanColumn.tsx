// ========================================
// Kanban Column Component
// ========================================

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TaskCard } from './TaskCard';
import type { Task, Column } from '@/types.js';

interface KanbanColumnProps {
  title: string;
  column: Column;
  tasks: Task[];
  onDrop: (taskId: string, sourceColumn: Column, targetColumn: Column) => void;
  onUpdateDescription: (id: string, newDescription: string) => void;
}

export function KanbanColumn({ title, column, tasks, onDrop, onUpdateDescription }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn') as Column;

    if (sourceColumn !== column) {
      onDrop(taskId, sourceColumn, column);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-semibold uppercase tracking-wide mb-3 pb-2 border-b">
        {title}
      </h2>
      <Card
        className={`flex-1 p-3 min-h-[400px] transition-colors ${
          isDragOver ? 'bg-accent' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              column={column}
              onUpdateDescription={onUpdateDescription}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
