// ========================================
// Milestone Progress - Exibe progresso de milestones
// ========================================

import type { Milestone, TasksData } from '../types.js';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useState } from 'react';

interface MilestoneProgressProps {
  milestone: Milestone;
  tasks: TasksData;
  onDelete: (id: string) => Promise<void>;
}

export function MilestoneProgress({ milestone, tasks, onDelete }: MilestoneProgressProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Conta tasks desse milestone em cada coluna
  const allTasks = [...tasks.backlog, ...tasks.todo, ...tasks.doing, ...tasks.done];
  const milestoneTasks = allTasks.filter(t => t.milestone === milestone.id);
  const completedTasks = tasks.done.filter(t => t.milestone === milestone.id);

  const total = milestoneTasks.length;
  const completed = completedTasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(milestone.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors shadow-sm group relative">
      {/* Header com título e contagem */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: milestone.cor }}
          />
          <h3 className="font-semibold text-foreground">{milestone.titulo}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">
            {completed}/{total} tasks
          </span>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Milestone?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o milestone "{milestone.titulo}"?
                  <br /><br />
                  As tasks associadas <strong>NÃO</strong> serão excluídas, apenas desvinculadas deste milestone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Descrição */}
      {milestone.descricao && (
        <p className="text-sm text-muted-foreground mb-3">{milestone.descricao}</p>
      )}

      {/* Barra de progresso */}
      <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-300 rounded-full shadow-sm"
          style={{
            backgroundColor: milestone.cor,
            width: `${percentage}%`
          }}
        />
      </div>

      {/* Porcentagem */}
      <div className="mt-2 text-right">
        <span
          className="text-sm font-bold"
          style={{ color: milestone.cor }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}
