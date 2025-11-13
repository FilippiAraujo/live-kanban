// ========================================
// Task Card Component
// ========================================

import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import type { Task } from '@/types.js';

interface TaskCardProps {
  task: Task;
  index: number;
  onUpdateDescription: (id: string, newDescription: string) => void;
}

export function TaskCard({ task, index, onUpdateDescription }: TaskCardProps) {
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

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={isEditing}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 transition-colors ${
            snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:border-primary'
          } ${!isEditing ? 'cursor-move' : ''}`}
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
      )}
    </Draggable>
  );
}
