// ========================================
// Kanban Column Component
// ========================================

import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TaskCard } from './TaskCard';
import type { Task, Column, Milestone } from '@/types.js';

interface KanbanColumnProps {
  title: string;
  icon?: React.ReactNode;
  column: Column;
  tasks: Task[];
  projectPath: string;
  milestones: Milestone[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onAddTask: (column: Column, descricao: string, detalhes?: string, milestone?: string) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
  onOpenAIDialog?: () => void; // Callback para abrir dialog de criação com IA
}

export function KanbanColumn({ title, icon, column, tasks, projectPath, milestones, onUpdateTask, onAddTask, onDeleteTask, onOpenAIDialog }: KanbanColumnProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');
  const [newTaskMilestone, setNewTaskMilestone] = useState('');

  const handleAddTask = () => {
    if (newTaskDesc.trim()) {
      onAddTask(
        column,
        newTaskDesc.trim(),
        newTaskDetails.trim() || undefined,
        newTaskMilestone || undefined
      );
      setNewTaskDesc('');
      setNewTaskDetails('');
      setNewTaskMilestone('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-3 pb-2 border-b">
        <h2 className="text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <div className="flex items-center gap-1">
          {/* Botão Criar com IA */}
          {onOpenAIDialog && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-1.5 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-400"
              onClick={onOpenAIDialog}
              aria-label="Criar task com IA"
            >
              <div className="flex items-center gap-0.5">
                <Plus className="h-3 w-3 text-purple-600" />
                <Sparkles className="h-3 w-3 text-purple-600" />
              </div>
            </Button>
          )}
          {/* Botão Criar Normal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar nova task em {title}</DialogTitle>
                <DialogDescription>
                  Crie uma nova task nesta coluna. Preencha a descrição e opcionalmente adicione detalhes.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descrição *
                  </label>
                  <Input
                    id="description"
                    placeholder="Ex: Implementar endpoint /api/users"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddTask();
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="milestone" className="text-sm font-medium">
                    Milestone (opcional)
                  </label>
                  <select
                    id="milestone"
                    value={newTaskMilestone}
                    onChange={(e) => setNewTaskMilestone(e.target.value)}
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
                <div className="grid gap-2">
                  <label htmlFor="details" className="text-sm font-medium">
                    Detalhes (opcional)
                  </label>
                  <Textarea
                    id="details"
                    placeholder="O que precisa ser feito e como..."
                    value={newTaskDetails}
                    onChange={(e) => setNewTaskDetails(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddTask} disabled={!newTaskDesc.trim()}>
                  Adicionar Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Droppable droppableId={column}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 transition-colors bg-secondary/30 overflow-y-auto overflow-x-hidden min-h-0 scrollbar-hover ${snapshot.isDraggingOver ? 'bg-secondary/50' : ''
              }`}
          >
            <div className="flex flex-col gap-2">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  projectPath={projectPath}
                  milestones={milestones}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                />
              ))}
              {provided.placeholder}
            </div>
          </Card>
        )}
      </Droppable>
    </div>
  );
}
