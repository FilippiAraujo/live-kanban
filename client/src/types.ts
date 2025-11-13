// ========================================
// TYPES - Definições de tipos da aplicação
// ========================================

export interface Task {
  id: string;
  descricao: string;
}

export interface TasksData {
  backlog: Task[];
  todo: Task[];
  doing: Task[];
  done: Task[];
}

export interface BoardData {
  objetivo: string;
  status: string;
  tasks: TasksData;
  llmGuide: string;
  projectPath: string;
}

export type Column = 'backlog' | 'todo' | 'doing' | 'done';
