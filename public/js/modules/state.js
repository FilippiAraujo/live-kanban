// ========================================
// MÓDULO: State Management
// Responsável por gerenciar o estado global da aplicação
// ========================================

export const State = {
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
