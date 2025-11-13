// ========================================
// Task Card Component
// ========================================

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import type { Task, Column } from '@/types.js';

interface TaskCardProps {
  task: Task;
  column: Column;
  onUpdateDescription: (id: string, newDescription: string) => void;
}

export function TaskCard({ task, column, onUpdateDescription }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.descricao);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (description.trim() && description !== task.descricao) {
      onUpdateDescription(task.id, description.trim());
    } else {
      setDescription(task.descricao);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setDescription(task.descricao);
      setIsEditing(false);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceColumn', column);
  };

  return (
    <Card
      className="p-3 cursor-move hover:border-primary transition-colors"
      draggable={!isEditing}
      onDragStart={handleDragStart}
    >
      <div className="text-xs text-muted-foreground mb-1 font-mono">
        #{task.id}
      </div>
      {isEditing ? (
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full text-sm border-none outline-none focus:ring-2 focus:ring-primary rounded px-1"
          autoFocus
          onFocus={(e) => e.target.select()}
        />
      ) : (
        <div
          className="text-sm"
          onDoubleClick={handleDoubleClick}
        >
          {task.descricao}
        </div>
      )}
    </Card>
  );
}
