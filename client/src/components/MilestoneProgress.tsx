// ========================================
// Milestone Progress - Exibe progresso de milestones
// ========================================

import type { Milestone, TasksData } from '../types.js';

interface MilestoneProgressProps {
  milestone: Milestone;
  tasks: TasksData;
}

export function MilestoneProgress({ milestone, tasks }: MilestoneProgressProps) {
  // Conta tasks desse milestone em cada coluna
  const allTasks = [...tasks.backlog, ...tasks.todo, ...tasks.doing, ...tasks.done];
  const milestoneTasks = allTasks.filter(t => t.milestone === milestone.id);
  const completedTasks = tasks.done.filter(t => t.milestone === milestone.id);

  const total = milestoneTasks.length;
  const completed = completedTasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors shadow-sm">
      {/* Header com título e contagem */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: milestone.cor }}
          />
          <h3 className="font-semibold text-foreground">{milestone.titulo}</h3>
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {completed}/{total} tasks
        </span>
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
