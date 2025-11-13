// ========================================
// MÓDULO: Drag and Drop
// Responsável pela funcionalidade de arrastar e soltar tasks
// ========================================

import { State } from './state.js';
import { API } from './api.js';
import { UI } from './ui.js';

export const DragDrop = {
  draggedElement: null,
  sourceColumn: null,

  init() {
    const containers = document.querySelectorAll('.tasks-container');

    containers.forEach(container => {
      container.addEventListener('dragover', this.handleDragOver.bind(this));
      container.addEventListener('drop', this.handleDrop.bind(this));
      container.addEventListener('dragleave', this.handleDragLeave.bind(this));
    });

    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('task-card')) {
        this.handleDragStart(e);
      }
    });

    document.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('task-card')) {
        this.handleDragEnd(e);
      }
    });
  },

  handleDragStart(e) {
    this.draggedElement = e.target;
    this.sourceColumn = e.target.closest('.tasks-container').id.replace('-tasks', '');
    e.target.classList.add('dragging');
  },

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.tasks-container').forEach(container => {
      container.classList.remove('drag-over');
    });
  },

  handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  },

  handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  },

  async handleDrop(e) {
    e.preventDefault();
    const container = e.currentTarget;
    container.classList.remove('drag-over');

    if (!this.draggedElement) return;

    const targetColumn = container.id.replace('-tasks', '');
    const taskId = this.draggedElement.dataset.taskId;

    if (this.sourceColumn === targetColumn) return;

    // Atualiza o state
    const task = State.tasks[this.sourceColumn].find(t => t && t.id === taskId);

    if (!task) {
      console.error('Task não encontrada:', taskId);
      return;
    }

    State.tasks[this.sourceColumn] = State.tasks[this.sourceColumn].filter(t => t && t.id !== taskId);
    State.tasks[targetColumn].push(task);

    // Salva no backend
    try {
      await API.saveTasks(State.projectPath, State.tasks);
      UI.showSuccess('Task movida com sucesso');
      UI.renderTasks();
      this.init(); // Re-inicializa os event listeners
    } catch (error) {
      UI.showError(error.message);
      // Reverte mudança
      State.tasks[targetColumn] = State.tasks[targetColumn].filter(t => t && t.id !== taskId);
      State.tasks[this.sourceColumn].push(task);
      UI.renderTasks();
      this.init();
    }
  }
};
