// ========================================
// Kanban Board Component - 4 colunas com Backlog
// ========================================

import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Archive, ClipboardList, Settings, CheckCircle2 } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { useBoard } from '@/contexts/BoardContext';
import { api } from '@/lib/api';
import type { Task, Column, TasksData } from '@/types.js';

interface KanbanBoardProps {
  selectedMilestones: string[];
  searchQuery: string;
  onOpenAIDialog?: () => void;
}

export function KanbanBoard({ selectedMilestones, searchQuery, onOpenAIDialog }: KanbanBoardProps) {
  const { boardData, updateTasks, loadProject } = useBoard();

  if (!boardData) return null;

  // Filtra tasks por milestone selecionada
  const filterTasksByMilestone = (tasks: Task[]) => {
    if (selectedMilestones.length === 0) return tasks;
    return tasks.filter(task => task.milestone && selectedMilestones.includes(task.milestone));
  };

  // Filtra tasks por busca (descrição, detalhes ou to-dos)
  const filterTasksBySearch = (tasks: Task[]) => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(task => {
      // Busca na descrição
      if (task.descricao?.toLowerCase().includes(query)) return true;
      // Busca nos detalhes (verifica se é string)
      if (typeof task.detalhes === 'string' && task.detalhes.toLowerCase().includes(query)) return true;
      // Busca nos to-dos
      if (task.todos?.some(todo => todo?.texto && typeof todo.texto === 'string' && todo.texto.toLowerCase().includes(query))) return true;
      // Busca no ID
      if (task.id?.toLowerCase().includes(query)) return true;
      return false;
    });
  };

  // Aplica ambos os filtros
  const applyFilters = (tasks: Task[]) => {
    let filtered = filterTasksByMilestone(tasks);
    filtered = filterTasksBySearch(filtered);
    return filtered;
  };

  const filteredTasks = {
    backlog: applyFilters(boardData.tasks.backlog),
    todo: applyFilters(boardData.tasks.todo),
    doing: applyFilters(boardData.tasks.doing),
    done: applyFilters(boardData.tasks.done)
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // Dropped in the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumnId = source.droppableId as Column;
    const destColumnId = destination.droppableId as Column;

    // 1. Get the full list of tasks for source and dest
    // We clone to avoid mutation
    const allSourceTasks = [...boardData.tasks[sourceColumnId]];
    const allDestTasks = sourceColumnId === destColumnId ? allSourceTasks : [...boardData.tasks[destColumnId]];

    // 2. Find the moved task in the FULL source list using ID (safe against filtering)
    const movedTaskIndex = allSourceTasks.findIndex(t => t.id === draggableId);
    if (movedTaskIndex === -1) {
      console.error('Erro: Task movida não encontrada na coluna de origem (pode estar filtrada ou desincronizada)');
      return;
    }

    const [movedTask] = allSourceTasks.splice(movedTaskIndex, 1);

    // 3. Update task metadata optimistically
    const now = new Date();
    // ISO 8601 with -03:00 (São Paulo) approximation for optimistic UI
    // Note: Server handles the official timestamp, this is for immediate UI feedback
    const timestamp = now.toISOString().replace('Z', '-03:00');

    if (sourceColumnId !== destColumnId) {
      // Add to timeline
      if (!movedTask.timeline) movedTask.timeline = [];
      movedTask.timeline.push({
        coluna: destColumnId,
        timestamp
      });

      // Set dataInicio if first time in doing
      if (destColumnId === 'doing' && !movedTask.dataInicio) {
        movedTask.dataInicio = timestamp;
      }

      // Set dataFinalizacao if first time in done
      if (destColumnId === 'done' && !movedTask.dataFinalizacao) {
        movedTask.dataFinalizacao = timestamp;
      }
    }

    // 4. Calculate insertion index in the FULL destination list
    // We rely on the 'filteredTasks' which is what the user sees/interacted with.
    const destColumnVisibleTasks = filteredTasks[destColumnId];

    // If we are moving within the same column, we need to consider that 'destColumnVisibleTasks'
    // STILL contains the moved task at the old position because we haven't re-rendered yet.
    // So we should temporarily remove it from the visible list to calculate the correct insertion point.
    const visibleTasksWithoutMoved = destColumnVisibleTasks.filter(t => t.id !== draggableId);

    let insertAtIndex = 0;

    if (destination.index === 0) {
      // Insert before the first visible task
      if (visibleTasksWithoutMoved.length > 0) {
        const firstVisibleTask = visibleTasksWithoutMoved[0];
        // Find where this visible task is in the FULL list
        const indexInFullList = allDestTasks.findIndex(t => t.id === firstVisibleTask.id);
        // If found, insert before it; otherwise fallback to 0
        insertAtIndex = indexInFullList !== -1 ? indexInFullList : 0;
      } else {
        // No other visible tasks, append to end of list (or start if list empty)
        // Usually appending to end of the list is safer if we don't know where to put it relative to hidden items
        insertAtIndex = allDestTasks.length;
      }
    } else {
      // Insert after the task that is at (destination.index - 1) in the visible list
      // Note: destination.index is based on the list *after* the drop conceptually
      const predecessorTask = visibleTasksWithoutMoved[destination.index - 1];

      if (predecessorTask) {
        const indexInFullList = allDestTasks.findIndex(t => t.id === predecessorTask.id);
        insertAtIndex = indexInFullList !== -1 ? indexInFullList + 1 : allDestTasks.length;
      } else {
        // Fallback
        insertAtIndex = allDestTasks.length;
      }
    }

    // Insert at the calculated position
    allDestTasks.splice(insertAtIndex, 0, movedTask);

    const newTasks: TasksData = {
      ...boardData.tasks,
      [sourceColumnId]: allSourceTasks,
      [destColumnId]: allDestTasks
    };

    try {
      await updateTasks(newTasks);
    } catch (err) {
      console.error('Erro ao mover task:', err);
      // Rollback: reload project data
      loadProject(boardData.projectPath);
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

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(boardData.projectPath, taskId);
      // Recarrega o board após excluir
      await loadProject(boardData.projectPath);
    } catch (err) {
      console.error('Erro ao excluir task:', err);
      throw err;
    }
  };

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4 h-full">
          <KanbanColumn
            title="Backlog"
            icon={<Archive className="h-4 w-4" />}
            column="backlog"
            tasks={filteredTasks.backlog}
            projectPath={boardData.projectPath}
            milestones={boardData.milestones}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onOpenAIDialog={onOpenAIDialog}
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
            onDeleteTask={handleDeleteTask}
            onOpenAIDialog={onOpenAIDialog}
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
            onDeleteTask={handleDeleteTask}
            onOpenAIDialog={onOpenAIDialog}
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
            onDeleteTask={handleDeleteTask}
            onOpenAIDialog={onOpenAIDialog}
          />
        </div>
      </DragDropContext>
    </div>
  );
}
