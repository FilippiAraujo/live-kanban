// ========================================
// MÓDULO: UI Manager
// Responsável por toda manipulação da interface
// ========================================

import { State } from './state.js';
import { API } from './api.js';
import { MarkdownParser } from './markdown-parser.js';

export const UI = {
  elements: {
    projectPath: document.getElementById('projectPath'),
    loadBtn: document.getElementById('loadBtn'),
    mainContent: document.getElementById('mainContent'),
    emptyState: document.getElementById('emptyState'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    todoTasks: document.getElementById('todo-tasks'),
    doingTasks: document.getElementById('doing-tasks'),
    doneTasks: document.getElementById('done-tasks'),
    objetivoContent: document.getElementById('objetivo-content'),
    statusContent: document.getElementById('status-content'),
    guideContent: document.getElementById('guide-content')
  },

  showMainContent() {
    this.elements.emptyState.classList.add('hidden');
    this.elements.mainContent.classList.remove('hidden');
  },

  hideMainContent() {
    this.elements.emptyState.classList.remove('hidden');
    this.elements.mainContent.classList.add('hidden');
  },

  switchTab(tabName) {
    this.elements.tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    this.elements.tabContents.forEach(content => {
      const contentId = `${content.id.split('-')[0]}-tab`;
      content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
  },

  renderTasks() {
    this.elements.todoTasks.innerHTML = '';
    this.elements.doingTasks.innerHTML = '';
    this.elements.doneTasks.innerHTML = '';

    State.tasks.todo.forEach(task => {
      this.elements.todoTasks.appendChild(this.createTaskCard(task));
    });

    State.tasks.doing.forEach(task => {
      this.elements.doingTasks.appendChild(this.createTaskCard(task));
    });

    State.tasks.done.forEach(task => {
      this.elements.doneTasks.appendChild(this.createTaskCard(task));
    });
  },

  createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.taskId = task.id;

    card.innerHTML = `
      <div class="task-id">#${task.id}</div>
      <div class="task-description" contenteditable="false">${task.descricao}</div>
    `;

    const descriptionEl = card.querySelector('.task-description');

    // Duplo clique para editar
    descriptionEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      descriptionEl.contentEditable = 'true';
      descriptionEl.focus();
      card.draggable = false;

      // Seleciona todo o texto
      const range = document.createRange();
      range.selectNodeContents(descriptionEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });

    // Salva ao perder foco
    descriptionEl.addEventListener('blur', async () => {
      descriptionEl.contentEditable = 'false';
      card.draggable = true;

      const newDescription = descriptionEl.textContent.trim();
      if (newDescription && newDescription !== task.descricao) {
        await this.updateTaskDescription(task.id, newDescription);
      } else {
        descriptionEl.textContent = task.descricao; // Reverte se vazio
      }
    });

    // Salva com Enter
    descriptionEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        descriptionEl.blur();
      }
      if (e.key === 'Escape') {
        descriptionEl.textContent = task.descricao;
        descriptionEl.blur();
      }
    });

    return card;
  },

  async updateTaskDescription(taskId, newDescription) {
    // Encontra em qual coluna está a task
    let column = null;
    let task = null;

    ['todo', 'doing', 'done'].forEach(col => {
      const found = State.tasks[col].find(t => t && t.id === taskId);
      if (found) {
        column = col;
        task = found;
      }
    });

    if (!task) return;

    task.descricao = newDescription;

    try {
      await API.saveTasks(State.projectPath, State.tasks);
      this.showSuccess('Descrição atualizada');
    } catch (error) {
      this.showError(error.message);
    }
  },

  renderMetadata() {
    this.elements.objetivoContent.innerHTML = MarkdownParser.parse(State.objetivo);
    this.elements.statusContent.innerHTML = MarkdownParser.parse(State.status);
  },

  renderGuide() {
    this.elements.guideContent.innerHTML = MarkdownParser.parse(State.llmGuide);
  },

  showError(message) {
    alert(`❌ Erro: ${message}`);
  },

  showSuccess(message) {
    console.log(`✅ ${message}`);
  }
};
