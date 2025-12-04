// ========================================
// Task Card Component
// ========================================

import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Sparkles, Loader2, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import type { Task, Milestone } from '@/types.js';

interface TaskCardProps {
  task: Task;
  index: number;
  projectPath: string;
  milestones: Milestone[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export function TaskCard({ task, index, projectPath, milestones, onUpdateTask }: TaskCardProps) {
  // Encontra o milestone da task
  const taskMilestone = milestones.find(m => m.id === task.milestone);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [description, setDescription] = useState(task.descricao);
  const [detalhes, setDetalhes] = useState(task.detalhes || '');
  const [selectedMilestone, setSelectedMilestone] = useState(task.milestone || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

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

  const handleSaveDetails = () => {
    const updates: Partial<Task> = {};

    if (detalhes !== task.detalhes) {
      updates.detalhes = detalhes;
    }

    if (selectedMilestone !== task.milestone) {
      updates.milestone = selectedMilestone || undefined;
    }

    if (Object.keys(updates).length > 0) {
      onUpdateTask(task.id, updates);
      toast.success('Task atualizada!');
    }

    setIsDialogOpen(false);
    setIsEditingDetails(false);
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

  const handleEnhanceTask = async () => {
    setIsEnhancing(true);
    try {
      const enhancedDescription = await api.enhanceTask(task.descricao);
      onUpdateTask(task.id, { descricao: enhancedDescription });
      setDescription(enhancedDescription);
      toast.success('Task melhorada com sucesso! ✨');
    } catch (error) {
      toast.error('Erro ao melhorar task', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsEnhancing(false);
    }
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
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground font-mono">
                #{task.id}
              </div>
              {taskMilestone && (
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                  style={{
                    backgroundColor: `${taskMilestone.cor}20`,
                    color: taskMilestone.cor,
                    border: `1px solid ${taskMilestone.cor}40`
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: taskMilestone.cor }}
                  />
                  {taskMilestone.titulo}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEnhanceTask}
                disabled={isEnhancing}
                className="h-6 w-6 p-0 cursor-pointer"
                title="Melhorar task com IA"
              >
                {isEnhancing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
              </Button>
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

          {task.detalhes && (
            <div className="mt-2 pt-2 border-t flex items-center gap-2">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
              >
                Ver detalhes
              </Button>
            </div>
          )}

          {!task.detalhes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsDialogOpen(true);
                setIsEditingDetails(true);
              }}
              className="h-6 text-xs mt-2 w-full"
            >
              + Adicionar detalhes
            </Button>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    #{task.id}
                  </span>
                  <span>{task.descricao}</span>
                </DialogTitle>
                <DialogDescription>
                  O que está sendo feito e como
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Seletor de Milestone */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Milestone
                  </label>
                  <select
                    value={selectedMilestone}
                    onChange={(e) => setSelectedMilestone(e.target.value)}
                    className="w-full text-sm border rounded p-2 focus:ring-2 focus:ring-primary bg-background"
                  >
                    <option value="">Nenhum milestone</option>
                    {milestones.map(milestone => (
                      <option key={milestone.id} value={milestone.id}>
                        {milestone.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Detalhes */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Detalhes
                  </label>
                  <textarea
                    value={detalhes}
                    onChange={(e) => setDetalhes(e.target.value)}
                    className="w-full text-sm border rounded p-3 focus:ring-2 focus:ring-primary min-h-[200px] bg-background"
                    placeholder="Descreva o que está sendo feito e como..."
                    autoFocus={!task.detalhes}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDetalhes(task.detalhes || '');
                    setIsDialogOpen(false);
                    setIsEditingDetails(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveDetails}>
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      )}
    </Draggable>
  );
}
