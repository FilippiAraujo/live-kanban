// ========================================
// Task Card Component
// ========================================

import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import type { Task } from '@/types.js';

interface TaskCardProps {
  task: Task;
  index: number;
  projectPath: string;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export function TaskCard({ task, index, projectPath, onUpdateTask }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [description, setDescription] = useState(task.descricao);
  const [detalhes, setDetalhes] = useState(task.detalhes || '');
  const [showDetails, setShowDetails] = useState(!!task.detalhes);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (description.trim() && description !== task.descricao) {
      onUpdateTask(task.id, { descricao: description.trim() });
    } else {
      setDescription(task.descricao);
    }
  };

  const handleDetailsBlur = () => {
    setIsEditingDetails(false);
    if (detalhes !== task.detalhes) {
      onUpdateTask(task.id, { detalhes });
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

  const handleCopyPath = () => {
    const path = `${projectPath}/tasks.json#${task.id}`;
    navigator.clipboard.writeText(path);
    toast.success('Path copiado!', {
      description: path,
      duration: 2000,
    });
  };

  const isAnyEditing = isEditing || isEditingDetails;

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={isAnyEditing}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 transition-colors ${
            snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:border-primary'
          } ${!isAnyEditing ? 'cursor-move' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-muted-foreground font-mono">
              #{task.id}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyPath}
              className="h-6 w-6 p-0 cursor-pointer"
              title="Copiar path da task"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full text-sm border-none outline-none focus:ring-2 focus:ring-primary rounded px-1 mb-2"
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          ) : (
            <div
              className="text-sm mb-2 font-medium"
              onDoubleClick={handleDoubleClick}
            >
              {task.descricao}
            </div>
          )}

          {(showDetails || isEditingDetails) && (
            <div className="mt-2 pt-2 border-t">
              <div className="text-xs text-muted-foreground mb-1">
                O que está sendo feito:
              </div>
              {isEditingDetails ? (
                <textarea
                  value={detalhes}
                  onChange={(e) => setDetalhes(e.target.value)}
                  onBlur={handleDetailsBlur}
                  className="w-full text-xs border rounded p-2 focus:ring-2 focus:ring-primary"
                  rows={3}
                  autoFocus
                  placeholder="Descreva o que está sendo feito e como..."
                />
              ) : (
                <div
                  className="text-xs text-foreground whitespace-pre-wrap"
                  onDoubleClick={() => setIsEditingDetails(true)}
                >
                  {detalhes || 'Clique para adicionar detalhes...'}
                </div>
              )}
            </div>
          )}

          {!showDetails && !isEditingDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowDetails(true);
                setIsEditingDetails(true);
              }}
              className="h-6 text-xs mt-1 w-full"
            >
              + Adicionar detalhes
            </Button>
          )}
        </Card>
      )}
    </Draggable>
  );
}
