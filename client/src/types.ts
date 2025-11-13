// ========================================
// TYPES - Definições de tipos da aplicação
// ========================================

export interface Task {
  id: string;
  descricao: string;
  detalhes?: string; // O que está sendo feito e como
}

export interface TasksData {
  backlog: Task[];
  todo: Task[];
  doing: Task[];
  done: Task[];
}

export interface BoardData {
  status: string;
  tasks: TasksData;
  llmGuide: string;
  projetoContext: string;
  projectPath: string;
}

export type Column = 'backlog' | 'todo' | 'doing' | 'done';
