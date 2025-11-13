// ========================================
// MÓDULO: API Client
// ========================================
const API = {
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
  }
};

// ========================================
// MÓDULO: Markdown Parser
// ========================================
const MarkdownParser = {
  parse(markdown) {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Lists
    html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');

    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (para.trim() &&
          !para.startsWith('<h') &&
          !para.startsWith('<ul') &&
          !para.startsWith('<ol') &&
          !para.startsWith('<pre') &&
          !para.startsWith('<blockquote')) {
        return `<p>${para}</p>`;
      }
      return para;
    }).join('\n');

    return html;
  }
};

// ========================================
// MÓDULO: State Management
// ========================================
const State = {
  projectPath: null,
  tasks: { todo: [], doing: [], done: [] },
  objetivo: '',
  status: '',
  llmGuide: '',

  setProjectPath(path) {
    this.projectPath = path;
  },

  setData(data) {
    this.projectPath = data.projectPath;
    this.tasks = data.tasks;
    this.objetivo = data.objetivo;
    this.status = data.status;
    this.llmGuide = data.llmGuide;
  },

  updateTasks(tasks) {
    this.tasks = tasks;
  }
};

// ========================================
// MÓDULO: UI Manager
// ========================================
const UI = {
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
      <div class="task-description">${task.descricao}</div>
    `;

    return card;
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

// ========================================
// MÓDULO: Drag and Drop
// ========================================
const DragDrop = {
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

// ========================================
// MÓDULO: App Controller
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
