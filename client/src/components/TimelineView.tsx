import { useMemo, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import type { Task, TaskList } from '../types';
import { formatDistanceToNow, format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineViewProps {
  tasks: TaskList;
  milestones: Array<{ id: string; titulo: string; cor: string }>;
}

type PeriodFilter = 'today' | 'week' | 'month' | 'all';
type ColumnFilter = 'all' | 'backlog' | 'todo' | 'doing' | 'done';

interface TimelineEntry {
  task: Task;
  timestamp: string;
  coluna: string;
  milestone?: { titulo: string; cor: string };
}

export function TimelineView({ tasks, milestones }: TimelineViewProps) {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('week');
  const [columnFilter, setColumnFilter] = useState<ColumnFilter>('all');

  // Coleta todas as entradas de timeline de todas as tasks
  const timelineEntries = useMemo(() => {
    const entries: TimelineEntry[] = [];

    Object.entries(tasks).forEach(([coluna, taskList]) => {
      taskList.forEach((task) => {
        if (task.timeline && task.timeline.length > 0) {
          task.timeline.forEach((entry) => {
            const milestone = milestones.find(m => m.id === task.milestone);
            entries.push({
              task,
              timestamp: entry.timestamp,
              coluna: entry.coluna,
              milestone
            });
          });
        }
      });
    });

    // Ordena por data mais recente primeiro
    return entries.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [tasks, milestones]);

  // Aplica filtros
  const filteredEntries = useMemo(() => {
    return timelineEntries.filter((entry) => {
      const date = parseISO(entry.timestamp);

      // Filtro de período
      if (periodFilter === 'today' && !isToday(date)) return false;
      if (periodFilter === 'week' && !isThisWeek(date, { locale: ptBR })) return false;
      if (periodFilter === 'month' && !isThisMonth(date)) return false;

      // Filtro de coluna
      if (columnFilter !== 'all' && entry.coluna !== columnFilter) return false;

      return true;
    });
  }, [timelineEntries, periodFilter, columnFilter]);

  // Agrupa por data
  const groupedByDate = useMemo(() => {
    const groups = new Map<string, TimelineEntry[]>();

    filteredEntries.forEach((entry) => {
      const date = format(parseISO(entry.timestamp), 'yyyy-MM-dd');
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push(entry);
    });

    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredEntries]);

  const getColumnLabel = (coluna: string) => {
    const labels: Record<string, string> = {
      backlog: 'Backlog',
      todo: 'To Do',
      doing: 'Doing',
      done: 'Done'
    };
    return labels[coluna] || coluna;
  };

  const getColumnColor = (coluna: string) => {
    const colors: Record<string, string> = {
      backlog: 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
      todo: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      doing: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
      done: 'bg-green-500/10 text-green-700 dark:text-green-300'
    };
    return colors[coluna] || 'bg-gray-500/10 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={periodFilter === 'today' ? 'default' : 'outline'}
            onClick={() => setPeriodFilter('today')}
          >
            Hoje
          </Button>
          <Button
            size="sm"
            variant={periodFilter === 'week' ? 'default' : 'outline'}
            onClick={() => setPeriodFilter('week')}
          >
            Esta Semana
          </Button>
          <Button
            size="sm"
            variant={periodFilter === 'month' ? 'default' : 'outline'}
            onClick={() => setPeriodFilter('month')}
          >
            Este Mês
          </Button>
          <Button
            size="sm"
            variant={periodFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setPeriodFilter('all')}
          >
            Tudo
          </Button>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button
            size="sm"
            variant={columnFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setColumnFilter('all')}
          >
            Todas
          </Button>
          <Button
            size="sm"
            variant={columnFilter === 'backlog' ? 'default' : 'outline'}
            onClick={() => setColumnFilter('backlog')}
          >
            Backlog
          </Button>
          <Button
            size="sm"
            variant={columnFilter === 'todo' ? 'default' : 'outline'}
            onClick={() => setColumnFilter('todo')}
          >
            To Do
          </Button>
          <Button
            size="sm"
            variant={columnFilter === 'doing' ? 'default' : 'outline'}
            onClick={() => setColumnFilter('doing')}
          >
            Doing
          </Button>
          <Button
            size="sm"
            variant={columnFilter === 'done' ? 'default' : 'outline'}
            onClick={() => setColumnFilter('done')}
          >
            Done
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total de Eventos</p>
              <p className="text-2xl font-bold">{filteredEntries.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tasks Únicas</p>
              <p className="text-2xl font-bold">
                {new Set(filteredEntries.map(e => e.task.id)).size}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Período</p>
              <p className="text-lg font-semibold capitalize">{
                periodFilter === 'today' ? 'Hoje' :
                periodFilter === 'week' ? 'Esta Semana' :
                periodFilter === 'month' ? 'Este Mês' :
                'Todos'
              }</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Timeline */}
      {groupedByDate.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Nenhum evento encontrado para os filtros selecionados
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedByDate.map(([date, entries]) => (
            <div key={date} className="space-y-3">
              {/* Data Header */}
              <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">
                    {format(parseISO(date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </h3>
                  <Badge variant="secondary" className="ml-auto">
                    {entries.length} evento{entries.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>

              {/* Eventos do dia */}
              <div className="space-y-2 pl-7">
                {entries.map((entry, idx) => (
                  <Card key={`${entry.task.id}-${entry.timestamp}-${idx}`} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center pt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="w-px h-full bg-border mt-2" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getColumnColor(entry.coluna)}>
                              {getColumnLabel(entry.coluna)}
                            </Badge>
                            {entry.milestone && (
                              <Badge
                                style={{
                                  backgroundColor: `${entry.milestone.cor}20`,
                                  color: entry.milestone.cor,
                                  borderColor: entry.milestone.cor
                                }}
                                className="border"
                              >
                                {entry.milestone.titulo}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(parseISO(entry.timestamp), 'HH:mm')}
                          </span>
                        </div>

                        <p className="text-sm font-medium mb-1">
                          {entry.task.descricao}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(parseISO(entry.timestamp), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
