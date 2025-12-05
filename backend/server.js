const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

// Importa Mastra (dinâmico para ES modules)
let mastra;
import('../mastra/index.js').then(module => {
  mastra = module.mastra;
  console.log('✨ Mastra agents loaded');
}).catch(err => {
  console.warn('⚠️  Mastra not available:', err.message);
});

const app = express();
const PORT = 7842;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// GET /api/board - Lê os 4 arquivos do projeto
app.get('/api/board', async (req, res) => {
  const projectPath = req.query.path;

  if (!projectPath) {
    return res.status(400).json({ error: 'Path do projeto é obrigatório' });
  }

  try {
    // Se o path já termina com /kanban-live, usa direto. Senão, adiciona /kanban-live
    let basePath = projectPath;
    if (!projectPath.endsWith('kanban-live')) {
      basePath = path.join(projectPath, 'kanban-live');
    }

    // Verifica se a pasta kanban-live existe
    try {
      await fs.access(basePath);
    } catch {
      // Pasta não existe - retorna estrutura vazia para mostrar botão Setup
      return res.json({
        status: '# Status\n\n(Arquivo não encontrado - clique em "Setup Projeto")',
        tasks: { backlog: [], todo: [], doing: [], done: [] },
        llmGuide: '# Guia LLM\n\n(Arquivo não encontrado - clique em "Setup Projeto")',
        projetoContext: '# Contexto do Projeto\n\n(Arquivo não encontrado - clique em "Setup Projeto")',
        projectPath: basePath // Retorna o path que DEVERIA ser usado
      });
    }

    // Lê os 4 arquivos
    const files = {
      status: path.join(basePath, 'status.md'),
      tasks: path.join(basePath, 'tasks.json'),
      llmGuide: path.join(basePath, 'llm-guide.md'),
      projetoContext: path.join(basePath, 'projeto-context.md')
    };

    const [status, tasks, llmGuide, projetoContext] = await Promise.all([
      fs.readFile(files.status, 'utf8').catch(() => '# Status\n\n(Arquivo não encontrado)'),
      fs.readFile(files.tasks, 'utf8').catch(() => JSON.stringify({ backlog: [], todo: [], doing: [], done: [] })),
      fs.readFile(files.llmGuide, 'utf8').catch(() => '# Guia LLM\n\n(Arquivo não encontrado)'),
      fs.readFile(files.projetoContext, 'utf8').catch(() => '# Contexto do Projeto\n\n(Arquivo não encontrado)')
    ]);

    // Parse tasks.json
    let tasksData;
    let milestones = [];
    try {
      tasksData = JSON.parse(tasks);
      // Extrai milestones
      milestones = tasksData.milestones || [];
      // Filtra valores nulos ou inválidos - agora com 4 colunas (backlog incluído)
      tasksData.backlog = (tasksData.backlog || []).filter(t => t && t.id && t.descricao);
      tasksData.todo = (tasksData.todo || []).filter(t => t && t.id && t.descricao);
      tasksData.doing = (tasksData.doing || []).filter(t => t && t.id && t.descricao);
      tasksData.done = (tasksData.done || []).filter(t => t && t.id && t.descricao);
    } catch (e) {
      tasksData = { backlog: [], todo: [], doing: [], done: [] };
      milestones = [];
    }

    res.json({
      status,
      tasks: tasksData,
      milestones,
      llmGuide,
      projetoContext,
      projectPath: basePath  // Retorna o path real usado (com /kanban-live/ se existe)
    });

  } catch (error) {
    console.error('Erro ao ler arquivos:', error);
    res.status(500).json({ error: 'Erro ao ler arquivos do projeto', details: error.message });
  }
});

// Helper: Gera timestamp no timezone de São Paulo
function getSaoPauloTimestamp() {
  const now = new Date();
  // Converte para São Paulo (UTC-3)
  const saoPauloTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  // Formata como ISO 8601 com timezone -03:00
  const year = saoPauloTime.getFullYear();
  const month = String(saoPauloTime.getMonth() + 1).padStart(2, '0');
  const day = String(saoPauloTime.getDate()).padStart(2, '0');
  const hours = String(saoPauloTime.getHours()).padStart(2, '0');
  const minutes = String(saoPauloTime.getMinutes()).padStart(2, '0');
  const seconds = String(saoPauloTime.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-03:00`;
}

// Helper: Adiciona timestamps automáticos nas tasks
function addTimestampsToTasks(newTasks, oldTasks) {
  const timestamp = getSaoPauloTimestamp();
  const columns = ['backlog', 'todo', 'doing', 'done'];

  // Cria um mapa das tasks antigas por ID para comparação
  const oldTasksMap = {};
  columns.forEach(col => {
    (oldTasks[col] || []).forEach(task => {
      oldTasksMap[task.id] = { ...task, coluna: col };
    });
  });

  // Processa cada coluna
  columns.forEach(coluna => {
    if (!newTasks[coluna]) return;

    newTasks[coluna] = newTasks[coluna].map(task => {
      const oldTask = oldTasksMap[task.id];

      // Task nova - adiciona dataCriacao e timeline inicial
      if (!oldTask) {
        return {
          ...task,
          dataCriacao: task.dataCriacao || timestamp,
          timeline: task.timeline || [{ coluna, timestamp }]
        };
      }

      // Task existente - verifica se mudou de coluna
      if (oldTask.coluna !== coluna) {
        // Preserva dados existentes
        const updatedTask = {
          ...task,
          dataCriacao: task.dataCriacao || oldTask.dataCriacao,
          timeline: task.timeline || oldTask.timeline || []
        };

        // Adiciona novo evento à timeline
        const timelineExists = updatedTask.timeline.some(
          event => event.coluna === coluna && event.timestamp === timestamp
        );
        if (!timelineExists) {
          updatedTask.timeline = [...updatedTask.timeline, { coluna, timestamp }];
        }

        // Define dataInicio se entrou em "doing" pela primeira vez
        if (coluna === 'doing' && !task.dataInicio && !oldTask.dataInicio) {
          updatedTask.dataInicio = timestamp;
        } else if (oldTask.dataInicio) {
          updatedTask.dataInicio = task.dataInicio || oldTask.dataInicio;
        }

        // Define dataFinalizacao se entrou em "done" pela primeira vez
        if (coluna === 'done' && !task.dataFinalizacao && !oldTask.dataFinalizacao) {
          updatedTask.dataFinalizacao = timestamp;
        } else if (oldTask.dataFinalizacao) {
          updatedTask.dataFinalizacao = task.dataFinalizacao || oldTask.dataFinalizacao;
        }

        return updatedTask;
      }

      // Task na mesma coluna - preserva dados existentes
      return {
        ...task,
        dataCriacao: task.dataCriacao || oldTask.dataCriacao,
        dataInicio: task.dataInicio || oldTask.dataInicio,
        dataFinalizacao: task.dataFinalizacao || oldTask.dataFinalizacao,
        timeline: task.timeline || oldTask.timeline
      };
    });
  });

  return newTasks;
}

// POST /api/board/tasks - Salva tasks.json
app.post('/api/board/tasks', async (req, res) => {
  const { projectPath, tasks } = req.body;

  if (!projectPath || !tasks) {
    return res.status(400).json({ error: 'projectPath e tasks são obrigatórios' });
  }

  try {
    // Lê tasks antigas para comparação
    const tasksFile = path.join(projectPath, 'tasks.json');
    let oldTasks = { backlog: [], todo: [], doing: [], done: [] };
    try {
      const oldContent = await fs.readFile(tasksFile, 'utf8');
      oldTasks = JSON.parse(oldContent);
    } catch (e) {
      // Arquivo não existe ou JSON inválido - usa estrutura vazia
    }

    // Adiciona timestamps automáticos
    const tasksWithTimestamps = addTimestampsToTasks(tasks, oldTasks);

    // Salva com os timestamps
    await fs.writeFile(tasksFile, JSON.stringify(tasksWithTimestamps, null, 2), 'utf8');
    res.json({ success: true, message: 'Tasks salvos com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar tasks:', error);
    res.status(500).json({ error: 'Erro ao salvar tasks', details: error.message });
  }
});

// POST /api/board/status - Salva status.md
app.post('/api/board/status', async (req, res) => {
  const { projectPath, content } = req.body;

  if (!projectPath || content === undefined) {
    return res.status(400).json({ error: 'projectPath e content são obrigatórios' });
  }

  try {
    // projectPath já vem com /kanban-live/ do frontend
    const statusFile = path.join(projectPath, 'status.md');
    await fs.writeFile(statusFile, content, 'utf8');
    res.json({ success: true, message: 'Status salvo com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar status:', error);
    res.status(500).json({ error: 'Erro ao salvar status', details: error.message });
  }
});

// POST /api/board/milestones - Salva milestones no tasks.json
app.post('/api/board/milestones', async (req, res) => {
  const { projectPath, milestones } = req.body;

  if (!projectPath || !milestones) {
    return res.status(400).json({ error: 'projectPath e milestones são obrigatórios' });
  }

  try {
    // Lê o tasks.json atual
    const tasksFile = path.join(projectPath, 'tasks.json');
    const tasksContent = await fs.readFile(tasksFile, 'utf8');
    const tasksData = JSON.parse(tasksContent);

    // Atualiza apenas os milestones
    tasksData.milestones = milestones;

    // Salva de volta
    await fs.writeFile(tasksFile, JSON.stringify(tasksData, null, 2), 'utf8');
    res.json({ success: true, message: 'Milestones salvos com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar milestones:', error);
    res.status(500).json({ error: 'Erro ao salvar milestones', details: error.message });
  }
});

// DELETE /api/board/milestones/:id - Remove milestone
app.delete('/api/board/milestones/:id', async (req, res) => {
  const { projectPath } = req.body;
  const { id } = req.params;

  if (!projectPath) {
    return res.status(400).json({ error: 'projectPath é obrigatório' });
  }

  try {
    const tasksFile = path.join(projectPath, 'tasks.json');
    const tasksContent = await fs.readFile(tasksFile, 'utf8');
    const tasksData = JSON.parse(tasksContent);

    // Remove milestone
    tasksData.milestones = (tasksData.milestones || []).filter(m => m.id !== id);

    // Remove milestone reference from tasks
    const columns = ['backlog', 'todo', 'doing', 'done'];
    columns.forEach(col => {
      if (tasksData[col]) {
        tasksData[col] = tasksData[col].map(task => {
          if (task.milestone === id) {
            const { milestone, ...rest } = task; // Remove milestone field
            return rest;
          }
          return task;
        });
      }
    });

    await fs.writeFile(tasksFile, JSON.stringify(tasksData, null, 2), 'utf8');
    res.json({ success: true, message: 'Milestone removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover milestone:', error);
    res.status(500).json({ error: 'Erro ao remover milestone', details: error.message });
  }
});

// ========================================
// UTILS ENDPOINTS
// ========================================

const KANBAN_LIVE_PATH = path.join(__dirname, '..', 'kanban-live');
const UTILS_FILE = path.join(KANBAN_LIVE_PATH, 'utils.json');

// GET /api/utils/recent-projects - Retorna lista de projetos recentes
app.get('/api/utils/recent-projects', async (req, res) => {
  try {
    const utilsData = await fs.readFile(UTILS_FILE, 'utf8');
    const utils = JSON.parse(utilsData);
    res.json({ recentProjects: utils.recentProjects || [] });
  } catch (error) {
    // Se o arquivo não existe ou está corrompido, retorna array vazio
    res.json({ recentProjects: [] });
  }
});

// POST /api/utils/add-recent-project - Adiciona projeto à lista de recentes
app.post('/api/utils/add-recent-project', async (req, res) => {
  const { projectPath, projectName } = req.body;

  if (!projectPath) {
    return res.status(400).json({ error: 'projectPath é obrigatório' });
  }

  try {
    // Lê utils.json atual
    let utils;
    try {
      const utilsData = await fs.readFile(UTILS_FILE, 'utf8');
      utils = JSON.parse(utilsData);
    } catch {
      // Se não existe, cria estrutura inicial
      utils = { recentProjects: [], settings: { maxRecentProjects: 5 } };
    }

    // Remove projeto se já existe (para atualizar lastAccessed)
    utils.recentProjects = utils.recentProjects.filter(p => p.path !== projectPath);

    // Extrai o nome do projeto (se termina com /kanban-live, pega o nome da pasta pai)
    let finalProjectName = projectName;
    if (!finalProjectName) {
      if (projectPath.endsWith('kanban-live')) {
        // Pega o nome da pasta pai (ex: /path/to/test-llm/kanban-live → test-llm)
        finalProjectName = path.basename(path.dirname(projectPath));
      } else {
        finalProjectName = path.basename(projectPath);
      }
    }

    // Adiciona no início da lista
    utils.recentProjects.unshift({
      path: projectPath,
      name: finalProjectName,
      lastAccessed: new Date().toISOString()
    });

    // Limita ao máximo configurado
    const maxProjects = utils.settings?.maxRecentProjects || 5;
    utils.recentProjects = utils.recentProjects.slice(0, maxProjects);

    // Salva de volta
    await fs.writeFile(UTILS_FILE, JSON.stringify(utils, null, 2), 'utf8');

    res.json({ success: true, recentProjects: utils.recentProjects });
  } catch (error) {
    console.error('Erro ao salvar projeto recente:', error);
    res.status(500).json({ error: 'Erro ao salvar projeto recente', details: error.message });
  }
});

// DELETE /api/utils/remove-recent-project - Remove projeto da lista de recentes
app.delete('/api/utils/remove-recent-project', async (req, res) => {
  const { projectPath } = req.body;

  if (!projectPath) {
    return res.status(400).json({ error: 'projectPath é obrigatório' });
  }

  try {
    // Lê utils.json atual
    let utils;
    try {
      const utilsData = await fs.readFile(UTILS_FILE, 'utf8');
      utils = JSON.parse(utilsData);
    } catch {
      return res.status(404).json({ error: 'Arquivo utils.json não encontrado' });
    }

    // Remove o projeto da lista
    utils.recentProjects = utils.recentProjects.filter(p => p.path !== projectPath);

    // Salva de volta
    await fs.writeFile(UTILS_FILE, JSON.stringify(utils, null, 2), 'utf8');

    res.json({ success: true, recentProjects: utils.recentProjects });
  } catch (error) {
    console.error('Erro ao remover projeto recente:', error);
    res.status(500).json({ error: 'Erro ao remover projeto recente', details: error.message });
  }
});

// ========================================
// PROJECT SETUP ENDPOINT
// ========================================

// POST /api/setup-project - Cria estrutura kanban-live/ em um projeto
app.post('/api/setup-project', async (req, res) => {
  const { projectPath } = req.body;

  if (!projectPath) {
    return res.status(400).json({ error: 'projectPath é obrigatório' });
  }

  try {
    const kanbanPath = path.join(projectPath, 'kanban-live');

    // Verifica se já existe
    try {
      await fs.access(kanbanPath);
      return res.status(400).json({ error: 'Estrutura kanban-live já existe neste projeto' });
    } catch {
      // Não existe, vamos criar
    }

    // Cria pasta kanban-live/
    await fs.mkdir(kanbanPath, { recursive: true });

    // 1. Cria tasks.json
    const tasksTemplate = {
      backlog: [],
      todo: [],
      doing: [],
      done: []
    };
    await fs.writeFile(
      path.join(kanbanPath, 'tasks.json'),
      JSON.stringify(tasksTemplate, null, 2),
      'utf8'
    );

    // 2. Cria status.md vazio
    const statusTemplate = `# Status do Projeto

**Última atualização:** ${new Date().toISOString().split('T')[0]}

## O Que Foi Feito
- 🚀 Estrutura kanban-live inicializada

## Em Progresso
-

## Próximos Passos
1.

## Observações
`;
    await fs.writeFile(path.join(kanbanPath, 'status.md'), statusTemplate, 'utf8');

    // 3. Cria projeto-context.md vazio
    const projetoContextTemplate = `# Contexto do Projeto

> Documento vivo que descreve a arquitetura, stack e decisões técnicas do projeto.

## Stack Tecnológica

### Frontend
-

### Backend
-

### Banco de Dados
-

## Estrutura do Projeto

\`\`\`
/
├──
\`\`\`

## Regras de Negócio

## Padrões de Código

## Observações Técnicas
`;
    await fs.writeFile(path.join(kanbanPath, 'projeto-context.md'), projetoContextTemplate, 'utf8');

    // 4. Cria utils.json
    const utilsTemplate = {
      recentProjects: [],
      settings: {
        maxRecentProjects: 5
      }
    };
    await fs.writeFile(
      path.join(kanbanPath, 'utils.json'),
      JSON.stringify(utilsTemplate, null, 2),
      'utf8'
    );

    // 5. Copia llm-guide.md do template
    const templateLlmGuide = path.join(__dirname, '..', 'kanban-live', 'llm-guide.md');
    const targetLlmGuide = path.join(kanbanPath, 'llm-guide.md');

    try {
      const llmGuideContent = await fs.readFile(templateLlmGuide, 'utf8');
      await fs.writeFile(targetLlmGuide, llmGuideContent, 'utf8');
    } catch (error) {
      // Se não conseguir copiar, cria um básico
      const basicLlmGuide = `# Guia LLM

> Instruções para LLMs gerenciarem este projeto via arquivos.

Consulte o template completo em: https://github.com/seu-repo/live-kanban
`;
      await fs.writeFile(targetLlmGuide, basicLlmGuide, 'utf8');
    }

    res.json({
      success: true,
      message: 'Estrutura kanban-live criada com sucesso',
      path: kanbanPath,
      files: ['tasks.json', 'status.md', 'projeto-context.md', 'utils.json', 'llm-guide.md']
    });

  } catch (error) {
    console.error('Erro ao criar estrutura kanban-live:', error);
    res.status(500).json({ error: 'Erro ao criar estrutura', details: error.message });
  }
});

// ========================================
// MASTRA AGENTS ENDPOINTS
// ========================================

// POST /api/agents/enhance-task - Melhora descrição de uma task
app.post('/api/agents/enhance-task', async (req, res) => {
  const { taskDescription } = req.body;

  if (!taskDescription) {
    return res.status(400).json({ error: 'taskDescription é obrigatório' });
  }

  if (!mastra) {
    return res.status(503).json({ error: 'Mastra agents não disponíveis' });
  }

  try {
    const agent = mastra.getAgent('taskEnhancer');

    const prompt = `Melhore esta descrição de task: "${taskDescription}"`;

    const response = await agent.generate(prompt);

    res.json({
      success: true,
      descricao: response.text
    });
  } catch (error) {
    console.error('Erro ao melhorar task:', error);
    res.status(500).json({
      error: 'Erro ao processar com agente',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Acesse o Kanban no navegador`);
});
