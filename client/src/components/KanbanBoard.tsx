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
}

export function KanbanBoard({ selectedMilestones, searchQuery }: KanbanBoardProps) {
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
      if (task.descricao.toLowerCase().includes(query)) return true;
      // Busca nos detalhes
      if (task.detalhes?.toLowerCase().includes(query)) return true;
      // Busca nos to-dos
      if (task.todos?.some(todo => todo.texto.toLowerCase().includes(query))) return true;
      // Busca no ID
      if (task.id.toLowerCase().includes(query)) return true;
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
          />
        </div>
      </DragDropContext>
    </div>
  );
}
