// ========================================
// Kanban Column Component
// ========================================

import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
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
import type { Task, Column } from '@/types.js';

interface KanbanColumnProps {
  title: string;
  icon?: React.ReactNode;
  column: Column;
  tasks: Task[];
  projectPath: string;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onAddTask: (column: Column, descricao: string, detalhes?: string) => void;
}

export function KanbanColumn({ title, icon, column, tasks, projectPath, onUpdateTask, onAddTask }: KanbanColumnProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');

  const handleAddTask = () => {
    if (newTaskDesc.trim()) {
      onAddTask(column, newTaskDesc.trim(), newTaskDetails.trim() || undefined);
      setNewTaskDesc('');
      setNewTaskDetails('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 pb-2 border-b">
        <h2 className="text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
          {icon}
          {title}
        </h2>
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
      <Droppable droppableId={column}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 min-h-[400px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-accent' : ''
            }`}
          >
            <div className="flex flex-col gap-2">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  projectPath={projectPath}
                  onUpdateTask={onUpdateTask}
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
