// ========================================
// Kanban Board Component - 4 colunas com Backlog
// ========================================

import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Archive, ClipboardList, Settings, CheckCircle2 } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { useBoard } from '@/contexts/BoardContext';
import type { Task, Column, TasksData } from '@/types.js';

export function KanbanBoard() {
  const { boardData, updateTasks } = useBoard();

  if (!boardData) return null;

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

  const handleAddTask = async (column: Column, descricao: string, detalhes?: string) => {
    // Gera ID único usando timestamp
    const newId = `t${Date.now().toString().slice(-4)}`;

    const newTask: Task = {
      id: newId,
      descricao,
      ...(detalhes && { detalhes })
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-4">
        <KanbanColumn
          title="Backlog"
          icon={<Archive className="h-4 w-4" />}
          column="backlog"
          tasks={boardData.tasks.backlog}
          projectPath={boardData.projectPath}
          onUpdateTask={handleUpdateTask}
          onAddTask={handleAddTask}
        />
        <KanbanColumn
          title="To Do"
          icon={<ClipboardList className="h-4 w-4" />}
          column="todo"
          tasks={boardData.tasks.todo}
          projectPath={boardData.projectPath}
          onUpdateTask={handleUpdateTask}
          onAddTask={handleAddTask}
        />
        <KanbanColumn
          title="Doing"
          icon={<Settings className="h-4 w-4" />}
          column="doing"
          tasks={boardData.tasks.doing}
          projectPath={boardData.projectPath}
          onUpdateTask={handleUpdateTask}
          onAddTask={handleAddTask}
        />
        <KanbanColumn
          title="Done"
          icon={<CheckCircle2 className="h-4 w-4" />}
          column="done"
          tasks={boardData.tasks.done}
          projectPath={boardData.projectPath}
          onUpdateTask={handleUpdateTask}
          onAddTask={handleAddTask}
        />
      </div>
    </DragDropContext>
  );
}
