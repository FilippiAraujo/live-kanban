// ========================================
// Milestone Progress - Exibe progresso de milestones
// ========================================

import type { Milestone, TasksData } from '../types.js';
import { Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
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

  // Agrupa tasks por coluna
  const tasksByColumn = {
    backlog: tasks.backlog.filter(t => t.milestone === milestone.id),
    todo: tasks.todo.filter(t => t.milestone === milestone.id),
    doing: tasks.doing.filter(t => t.milestone === milestone.id),
    done: tasks.done.filter(t => t.milestone === milestone.id),
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(milestone.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getColumnIcon = (column: string) => {
    switch (column) {
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'doing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getColumnLabel = (column: string) => {
    const labels: Record<string, string> = {
      backlog: 'Backlog',
      todo: 'To Do',
      doing: 'Doing',
      done: 'Done'
    };
    return labels[column] || column;
  };

  const getColumnColor = (column: string) => {
    const colors: Record<string, string> = {
      backlog: 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
      todo: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      doing: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
      done: 'bg-green-500/10 text-green-700 dark:text-green-300'
    };
    return colors[column] || 'bg-gray-500/10';
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={milestone.id} className="border rounded-lg px-4 bg-card shadow-sm">
        <div className="flex items-center justify-between pr-4 group">
          <AccordionTrigger className="hover:no-underline flex-1">
            <div className="flex items-center gap-3 flex-1">
              {/* Cor do milestone */}
              <div
                className="w-3 h-3 rounded-full shadow-sm shrink-0"
                style={{ backgroundColor: milestone.cor }}
              />

              {/* Título e descrição */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{milestone.titulo}</h3>
                  <span className="text-xs text-muted-foreground font-medium">
                    {completed}/{total}
                  </span>
                </div>
                {milestone.descricao && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{milestone.descricao}</p>
                )}
              </div>

              {/* Barra de progresso compacta */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      backgroundColor: milestone.cor,
                      width: `${percentage}%`
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold w-10 text-right"
                  style={{ color: milestone.cor }}
                >
                  {percentage}%
                </span>
              </div>
            </div>
          </AccordionTrigger>

          {/* Botão deletar */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
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

        <AccordionContent>
          <div className="space-y-4 pt-2">
            {total === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma task neste milestone ainda
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(tasksByColumn).map(([column, columnTasks]) => (
                  columnTasks.length > 0 && (
                    <div key={column} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getColumnIcon(column)}
                        <h4 className="text-sm font-semibold">{getColumnLabel(column)}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {columnTasks.length}
                        </Badge>
                      </div>
                      <div className="space-y-1.5 pl-6">
                        {columnTasks.map((task) => (
                          <div
                            key={task.id}
                            className="text-sm p-2 rounded-md border bg-background/50 hover:bg-accent transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <Badge className={`${getColumnColor(column)} text-[10px] px-1.5 py-0 shrink-0`}>
                                {task.id}
                              </Badge>
                              <p className="flex-1 line-clamp-2">{task.descricao}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
