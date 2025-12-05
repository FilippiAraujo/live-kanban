// ========================================
// API Client - Comunicação com backend
// ========================================

import type { BoardData, TasksData, Milestone } from '@/types.js';

const API_BASE_URL = 'http://localhost:7842/api';

export const api = {
  async loadBoard(projectPath: string): Promise<BoardData> {
    const response = await fetch(`${API_BASE_URL}/board?path=${encodeURIComponent(projectPath)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar projeto');
    }
    return response.json();
  },

  async saveTasks(projectPath: string, tasks: TasksData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/board/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, tasks })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar tasks');
    }
  },

  async deleteTask(projectPath: string, taskId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/board/task`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, taskId })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao excluir task');
    }
  },

  async saveStatus(projectPath: string, content: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/board/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, content })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar status');
    }
  },

  async saveMilestones(projectPath: string, milestones: Milestone[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/board/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, milestones })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar milestones');
    }
  },

  async deleteMilestone(projectPath: string, milestoneId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/board/milestones/${milestoneId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao remover milestone');
    }
  },

  // ========================================
  // UTILS
  // ========================================

  async getRecentProjects(): Promise<Array<{ path: string; name: string; lastAccessed: string }>> {
    const response = await fetch(`${API_BASE_URL}/utils/recent-projects`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.recentProjects || [];
  },

  async addRecentProject(projectPath: string, projectName?: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/utils/add-recent-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, projectName })
    });
    if (!response.ok) {
      console.warn('Falha ao salvar projeto recente');
    }
  },

  async removeRecentProject(projectPath: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/utils/remove-recent-project`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath })
    });
    if (!response.ok) {
      throw new Error('Erro ao remover projeto recente');
    }
  },

  // ========================================
  // PROJECT SETUP
  // ========================================

  async setupProject(projectPath: string): Promise<{ success: boolean; message: string; files: string[] }> {
    const response = await fetch(`${API_BASE_URL}/setup-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar estrutura kanban-live');
    }
    return response.json();
  },

  // ========================================
  // MASTRA AGENTS
  // ========================================

  // LEGADO - ainda em uso (botão ✨ nos cards)
  async enhanceTask(taskDescription: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/agents/enhance-task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskDescription })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao melhorar task');
    }
    const data = await response.json();
    return data.descricao;
  },

  // NOVOS AGENTES

  // Gera prompt completo pra continuar task
  async generatePrompt(projectPath: string, taskId: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/agents/generate-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, taskId })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao gerar prompt');
    }
    const data = await response.json();
    return data.prompt;
  },

  // Reestrutura task existente (descrição, detalhes, to-dos, milestone)
  async enrichTask(projectPath: string, taskId: string): Promise<{
    descricao: string;
    detalhes?: string;
    todos?: Array<{ texto: string }>;
    milestone?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/agents/enrich-task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, taskId })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao enriquecer task');
    }
    const data = await response.json();
    return data.enriched;
  },

  // Chat conversacional pra criar task
  async chatCreateTask(
    projectPath: string,
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<{ message: string; conversationHistory: Array<{ role: string; content: string }> }> {
    const response = await fetch(`${API_BASE_URL}/agents/create-task/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, message, conversationHistory })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro no chat');
    }
    return response.json();
  },

  // Finaliza conversa e retorna task estruturada
  async finalizeCreateTask(
    projectPath: string,
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<{
    descricao: string;
    detalhes?: string;
    todos?: Array<{ texto: string }>;
    milestone?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/agents/create-task/finalize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, conversationHistory })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao finalizar task');
    }
    const data = await response.json();
    return data.task;
  },

  // ========================================
  // AGENT MANAGEMENT
  // ========================================

  // Lista todos os agentes disponíveis
  async getAgents(): Promise<Array<{
    name: string;
    description: string;
    model: string;
    tools: string[];
    instructions?: string;
  }>> {
    const response = await fetch(`${API_BASE_URL}/agents`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao buscar agentes');
    }
    const data = await response.json();
    return data.agents;
  },

  // Lista todas as tools disponíveis
  async getTools(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    inputSchema?: Record<string, unknown>;
    outputSchema?: Record<string, unknown>;
    usedBy: string[];
  }>> {
    const response = await fetch(`${API_BASE_URL}/tools`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao buscar tools');
    }
    const data = await response.json();
    return data.tools;
  },

  // Status do sistema de agentes
  async getAgentsStatus(): Promise<{
    available: boolean;
    model: string;
    agentCount: number;
    toolCount: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/agents/status`);
    if (!response.ok) {
      return { available: false, model: 'N/A', agentCount: 0, toolCount: 0 };
    }
    return response.json();
  }
};
