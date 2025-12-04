// ========================================
// Kanban Board Component - 4 colunas com Backlog
// ========================================

import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Archive, ClipboardList, Settings, CheckCircle2, Filter } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { useBoard } from '@/contexts/BoardContext';
import type { Task, Column, TasksData } from '@/types.js';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from './ui/dropdown-menu';

export function KanbanBoard() {
  const { boardData, updateTasks } = useBoard();
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);

  if (!boardData) return null;

  // Filtra tasks por milestone selecionada
  const filterTasksByMilestone = (tasks: Task[]) => {
    if (selectedMilestones.length === 0) return tasks;
    return tasks.filter(task => task.milestone && selectedMilestones.includes(task.milestone));
  };

  const filteredTasks = {
    backlog: filterTasksByMilestone(boardData.tasks.backlog),
    todo: filterTasksByMilestone(boardData.tasks.todo),
    doing: filterTasksByMilestone(boardData.tasks.doing),
    done: filterTasksByMilestone(boardData.tasks.done)
  };

  const toggleMilestone = (milestoneId: string) => {
    setSelectedMilestones(prev =>
      prev.includes(milestoneId)
        ? prev.filter(id => id !== milestoneId)
        : [...prev, milestoneId]
    );
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) return;

    // Dropped in the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumn = source.droppableId as Column;
    const destColumn = destination.droppableId as Column;

    const sourceTasks = Array.from(boardData.tasks[sourceColumn]);
    const destTasks = sourceColumn === destColumn ? sourceTasks : Array.from(boardData.tasks[destColumn]);

    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceColumn === destColumn) {
      sourceTasks.splice(destination.index, 0, movedTask);
      const newTasks: TasksData = {
        ...boardData.tasks,
        [sourceColumn]: sourceTasks
      };
      try {
        await updateTasks(newTasks);
      } catch (err) {
        console.error('Erro ao mover task:', err);
      }
    } else {
      destTasks.splice(destination.index, 0, movedTask);
      const newTasks: TasksData = {
        ...boardData.tasks,
        [sourceColumn]: sourceTasks,
        [destColumn]: destTasks
      };
      try {
        await updateTasks(newTasks);
      } catch (err) {
        console.error('Erro ao mover task:', err);
      }
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    // Encontra em qual coluna está a task
    let column: Column | null = null;
    for (const col of ['backlog', 'todo', 'doing', 'done'] as Column[]) {
      if (boardData.tasks[col].some((t) => t.id === id)) {
        column = col;
        break;
      }
    }

    if (!column) return;

    const newTasks: TasksData = {
      ...boardData.tasks,
      [column]: boardData.tasks[column].map((t) =>
        t.id === id ? { ...t, ...updates } : t
      )
    };

    try {
      await updateTasks(newTasks);
    } catch (err) {
      console.error('Erro ao atualizar task:', err);
    }
  };

  const handleAddTask = async (column: Column, descricao: string, detalhes?: string, milestone?: string) => {
    // Gera ID único usando timestamp
    const newId = `t${Date.now().toString().slice(-4)}`;

    const newTask: Task = {
      id: newId,
      descricao,
      ...(detalhes && { detalhes }),
      ...(milestone && { milestone })
    };

    const newTasks: TasksData = {
      ...boardData.tasks,
      [column]: [...boardData.tasks[column], newTask]
    };

    try {
      await updateTasks(newTasks);
    } catch (err) {
      console.error('Erro ao adicionar task:', err);
    }
  };

  return (
    <div>
      {/* Filtro de Milestones */}
      {boardData.milestones.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrar por Milestone
                {selectedMilestones.length > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {selectedMilestones.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Milestones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {boardData.milestones.map(milestone => (
                <DropdownMenuCheckboxItem
                  key={milestone.id}
                  checked={selectedMilestones.includes(milestone.id)}
                  onCheckedChange={() => toggleMilestone(milestone.id)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: milestone.cor }}
                    />
                    {milestone.titulo}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
              {selectedMilestones.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedMilestones([])}
                  >
                    Limpar filtros
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          <KanbanColumn
            title="Backlog"
            icon={<Archive className="h-4 w-4" />}
            column="backlog"
            tasks={filteredTasks.backlog}
            projectPath={boardData.projectPath}
            milestones={boardData.milestones}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
          />
          <KanbanColumn
            title="To Do"
            icon={<ClipboardList className="h-4 w-4" />}
            column="todo"
            tasks={filteredTasks.todo}
            projectPath={boardData.projectPath}
            milestones={boardData.milestones}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
          />
          <KanbanColumn
            title="Doing"
            icon={<Settings className="h-4 w-4" />}
            column="doing"
            tasks={filteredTasks.doing}
            projectPath={boardData.projectPath}
            milestones={boardData.milestones}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
          />
          <KanbanColumn
            title="Done"
            icon={<CheckCircle2 className="h-4 w-4" />}
            column="done"
            tasks={filteredTasks.done}
            projectPath={boardData.projectPath}
            milestones={boardData.milestones}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
          />
        </div>
      </DragDropContext>
    </div>
  );
}
