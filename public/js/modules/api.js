// ========================================
// MÓDULO: API Client
// Responsável por toda comunicação com o backend
// ========================================

export const API = {
  BASE_URL: 'http://localhost:3000/api',

  async loadBoard(projectPath) {
    const response = await fetch(`${this.BASE_URL}/board?path=${encodeURIComponent(projectPath)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar projeto');
    }
    return response.json();
  },

  async saveTasks(projectPath, tasks) {
    const response = await fetch(`${this.BASE_URL}/board/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, tasks })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar tasks');
    }
    return response.json();
  },

  async saveObjetivo(projectPath, content) {
    const response = await fetch(`${this.BASE_URL}/board/objetivo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, content })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar objetivo');
    }
    return response.json();
  },

  async saveStatus(projectPath, content) {
    const response = await fetch(`${this.BASE_URL}/board/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectPath, content })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao salvar status');
    }
    return response.json();
  }
};
