// ========================================
// MÓDULO: Editor
// Responsável pela edição inline de Objetivo e Status
// ========================================

import { State } from './state.js';
import { API } from './api.js';
import { UI } from './ui.js';

export const Editor = {
  init() {
    // Objetivo
    document.getElementById('edit-objetivo-btn').addEventListener('click', () => {
      this.enterEditMode('objetivo');
    });

    document.getElementById('save-objetivo-btn').addEventListener('click', async () => {
      await this.saveEdit('objetivo');
    });

    document.getElementById('cancel-objetivo-btn').addEventListener('click', () => {
      this.cancelEdit('objetivo');
    });

    // Status
    document.getElementById('edit-status-btn').addEventListener('click', () => {
      this.enterEditMode('status');
    });

    document.getElementById('save-status-btn').addEventListener('click', async () => {
      await this.saveEdit('status');
    });

    document.getElementById('cancel-status-btn').addEventListener('click', () => {
      this.cancelEdit('status');
    });
  },

  enterEditMode(type) {
    const content = type === 'objetivo' ? State.objetivo : State.status;
    const editor = document.getElementById(`${type}-editor`);
    const contentDiv = document.getElementById(`${type}-content`);
    const actions = document.getElementById(`${type}-actions`);
    const editBtn = document.getElementById(`edit-${type}-btn`);

    editor.value = content;
    editor.classList.remove('hidden');
    actions.classList.remove('hidden');
    contentDiv.classList.add('hidden');
    editBtn.classList.add('hidden');
  },

  async saveEdit(type) {
    const editor = document.getElementById(`${type}-editor`);
    const newContent = editor.value.trim();

    if (!newContent) {
      UI.showError('Conteúdo não pode estar vazio');
      return;
    }

    try {
      if (type === 'objetivo') {
        await API.saveObjetivo(State.projectPath, newContent);
        State.objetivo = newContent;
      } else {
        await API.saveStatus(State.projectPath, newContent);
        State.status = newContent;
      }

      UI.renderMetadata();
      this.exitEditMode(type);
      UI.showSuccess(`${type === 'objetivo' ? 'Objetivo' : 'Status'} salvo com sucesso`);
    } catch (error) {
      UI.showError(error.message);
    }
  },

  cancelEdit(type) {
    this.exitEditMode(type);
  },

  exitEditMode(type) {
    const editor = document.getElementById(`${type}-editor`);
    const contentDiv = document.getElementById(`${type}-content`);
    const actions = document.getElementById(`${type}-actions`);
    const editBtn = document.getElementById(`edit-${type}-btn`);

    editor.classList.add('hidden');
    actions.classList.add('hidden');
    contentDiv.classList.remove('hidden');
    editBtn.classList.remove('hidden');
  }
};
