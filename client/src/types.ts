// ========================================
// TYPES - Definições de tipos da aplicação
// ========================================

export interface Milestone {
  id: string;
  titulo: string;
  descricao?: string;
  cor: string; // hex color
}

export interface Task {
  id: string;
  descricao: string;
  detalhes?: string; // O que está sendo feito e como
  milestone?: string; // ID do milestone
}

export interface TasksData {
  backlog: Task[];
  todo: Task[];
  doing: Task[];
  done: Task[];
}

export interface MilestonesData {
  milestones: Milestone[];
}

export interface BoardData {
  status: string;
  tasks: TasksData;
  milestones: Milestone[];
  llmGuide: string;
  projetoContext: string;
  projectPath: string;
}

export type Column = 'backlog' | 'todo' | 'doing' | 'done';
