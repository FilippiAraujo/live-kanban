// ========================================
// LIVE KANBAN - Main Application
// ========================================
// Arquivo principal que importa e orquestra todos os módulos

import { API } from './modules/api.js';
import { State } from './modules/state.js';
import { UI } from './modules/ui.js';
import { Editor } from './modules/editor.js';
import { DragDrop } from './modules/drag-drop.js';
import { LiveReload } from './modules/live-reload.js';

// ========================================
// MÓDULO: App Controller
// Responsável por inicializar e coordenar toda a aplicação
// ========================================
const App = {
  init() {
    this.attachEventListeners();
    this.loadSavedPath();
  },

  attachEventListeners() {
    UI.elements.loadBtn.addEventListener('click', () => this.loadProject());

    UI.elements.projectPath.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.loadProject();
      }
    });

    UI.elements.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        UI.switchTab(btn.dataset.tab);
      });
    });
  },

  async loadProject() {
    const path = UI.elements.projectPath.value.trim();

    if (!path) {
      UI.showError('Por favor, insira o caminho do projeto');
      return;
    }

    try {
      UI.elements.loadBtn.textContent = 'Carregando...';
      UI.elements.loadBtn.disabled = true;

      const data = await API.loadBoard(path);
      State.setData(data);

      UI.renderTasks();
      UI.renderMetadata();
      UI.renderGuide();
      UI.showMainContent();

      DragDrop.init();
      Editor.init();
      LiveReload.start();

      localStorage.setItem('lastProjectPath', path);
      UI.showSuccess('Projeto carregado com sucesso');

    } catch (error) {
      UI.showError(error.message);
    } finally {
      UI.elements.loadBtn.textContent = 'Carregar Projeto';
      UI.elements.loadBtn.disabled = false;
    }
  },

  loadSavedPath() {
    const savedPath = localStorage.getItem('lastProjectPath');
    if (savedPath) {
      UI.elements.projectPath.value = savedPath;
    }
  }
};

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
