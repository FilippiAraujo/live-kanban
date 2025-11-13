// ========================================
// Kanban Board Component - 4 colunas com Backlog
// ========================================

import { KanbanColumn } from './KanbanColumn';
import { useBoard } from '@/contexts/BoardContext';
import type { Column, TasksData } from '@/types.js';

export function KanbanBoard() {
  const { boardData, updateTasks } = useBoard();

  if (!boardData) return null;

  const handleDrop = async (taskId: string, sourceColumn: Column, targetColumn: Column) => {
    const task = boardData.tasks[sourceColumn].find((t) => t.id === taskId);
    if (!task) return;

    const newTasks: TasksData = {
      ...boardData.tasks,
      [sourceColumn]: boardData.tasks[sourceColumn].filter((t) => t.id !== taskId),
      [targetColumn]: [...boardData.tasks[targetColumn], task]
    };

    try {
      await updateTasks(newTasks);
    } catch (err) {
      console.error('Erro ao mover task:', err);
    }
  };

  const handleUpdateDescription = async (id: string, newDescription: string) => {
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
        t.id === id ? { ...t, descricao: newDescription } : t
      )
    };

    try {
      await updateTasks(newTasks);
    } catch (err) {
      console.error('Erro ao atualizar descrição:', err);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <KanbanColumn
        title="📋 Backlog"
        column="backlog"
        tasks={boardData.tasks.backlog}
        onDrop={handleDrop}
        onUpdateDescription={handleUpdateDescription}
      />
      <KanbanColumn
        title="📝 To Do"
        column="todo"
        tasks={boardData.tasks.todo}
        onDrop={handleDrop}
        onUpdateDescription={handleUpdateDescription}
      />
      <KanbanColumn
        title="⚙️ Doing"
        column="doing"
        tasks={boardData.tasks.doing}
        onDrop={handleDrop}
        onUpdateDescription={handleUpdateDescription}
      />
      <KanbanColumn
        title="✅ Done"
        column="done"
        tasks={boardData.tasks.done}
        onDrop={handleDrop}
        onUpdateDescription={handleUpdateDescription}
      />
    </div>
  );
}
