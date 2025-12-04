// ========================================
// TYPES - Definições de tipos da aplicação
// ========================================

export interface Milestone {
  id: string;
  titulo: string;
  descricao?: string;
  cor: string; // hex color
}

export interface TodoItem {
  id: string;
  texto: string;
  concluido: boolean;
}

export interface TimelineEvent {
  coluna: Column;
  timestamp: string; // ISO 8601 format
}

export interface Task {
  id: string;
  descricao: string;
  detalhes?: string; // O que precisa ser feito (orientação)
  resultado?: string; // O que foi feito (preencher quando finalizar)
  milestone?: string; // ID do milestone
  todos?: TodoItem[]; // Lista de sub-tarefas
  timeline?: TimelineEvent[]; // Histórico de movimentações
  dataCriacao?: string; // ISO 8601 - quando a task foi criada
  dataInicio?: string; // ISO 8601 - quando entrou em "doing" pela primeira vez
  dataFinalizacao?: string; // ISO 8601 - quando entrou em "done" pela primeira vez
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
