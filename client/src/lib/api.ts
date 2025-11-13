// ========================================
// API Client - Comunicação com backend
// ========================================

import type { BoardData, TasksData } from '@/types.js';

const API_BASE_URL = 'http://localhost:3000/api';

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
  }
};
