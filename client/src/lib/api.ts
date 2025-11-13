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

  async saveObjetivo(projectPath: string, content: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/board/objetivo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, content })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar objetivo');
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
  }
};
