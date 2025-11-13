// ========================================
// MÓDULO: Live Reload
// Responsável por fazer polling e atualizar a interface automaticamente
// ========================================

import { API } from './api.js';
import { State } from './state.js';
import { UI } from './ui.js';
import { DragDrop } from './drag-drop.js';

export const LiveReload = {
  intervalId: null,
  pollingInterval: 2000, // 2 segundos
  isPolling: false,

  start() {
    if (this.isPolling) return;

    this.isPolling = true;
    this.intervalId = setInterval(async () => {
      if (State.projectPath) {
        try {
          const data = await API.loadBoard(State.projectPath);

          // Verifica se houve mudanças
          const hasChanges =
            JSON.stringify(State.tasks) !== JSON.stringify(data.tasks) ||
            State.objetivo !== data.objetivo ||
            State.status !== data.status ||
            State.llmGuide !== data.llmGuide;

          if (hasChanges) {
            console.log('🔄 Mudanças detectadas, atualizando...');
            State.setData(data);
            UI.renderTasks();
            UI.renderMetadata();
            UI.renderGuide();
            DragDrop.init();
          }
        } catch (error) {
          console.error('Erro no polling:', error);
        }
      }
    }, this.pollingInterval);
  },

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isPolling = false;
    }
  }
};
