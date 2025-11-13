const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

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
    // Lê os 4 arquivos
    const files = {
      status: path.join(projectPath, 'status.md'),
      tasks: path.join(projectPath, 'tasks.json'),
      llmGuide: path.join(projectPath, 'llm-guide.md'),
      projetoContext: path.join(projectPath, 'projeto-context.md')
    };

    const [status, tasks, llmGuide, projetoContext] = await Promise.all([
      fs.readFile(files.status, 'utf8').catch(() => '# Status\n\n(Arquivo não encontrado)'),
      fs.readFile(files.tasks, 'utf8').catch(() => JSON.stringify({ backlog: [], todo: [], doing: [], done: [] })),
      fs.readFile(files.llmGuide, 'utf8').catch(() => '# Guia LLM\n\n(Arquivo não encontrado)'),
      fs.readFile(files.projetoContext, 'utf8').catch(() => '# Contexto do Projeto\n\n(Arquivo não encontrado)')
    ]);

    // Parse tasks.json
    let tasksData;
    try {
      tasksData = JSON.parse(tasks);
      // Filtra valores nulos ou inválidos - agora com 4 colunas (backlog incluído)
      tasksData.backlog = (tasksData.backlog || []).filter(t => t && t.id && t.descricao);
      tasksData.todo = (tasksData.todo || []).filter(t => t && t.id && t.descricao);
      tasksData.doing = (tasksData.doing || []).filter(t => t && t.id && t.descricao);
      tasksData.done = (tasksData.done || []).filter(t => t && t.id && t.descricao);
    } catch (e) {
      tasksData = { backlog: [], todo: [], doing: [], done: [] };
    }

    res.json({
      status,
      tasks: tasksData,
      llmGuide,
      projetoContext,
      projectPath
    });

  } catch (error) {
    console.error('Erro ao ler arquivos:', error);
    res.status(500).json({ error: 'Erro ao ler arquivos do projeto', details: error.message });
  }
});

// POST /api/board/tasks - Salva tasks.json
app.post('/api/board/tasks', async (req, res) => {
  const { projectPath, tasks } = req.body;

  if (!projectPath || !tasks) {
    return res.status(400).json({ error: 'projectPath e tasks são obrigatórios' });
  }

  try {
    const tasksFile = path.join(projectPath, 'tasks.json');
    await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), 'utf8');
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
    const statusFile = path.join(projectPath, 'status.md');
    await fs.writeFile(statusFile, content, 'utf8');
    res.json({ success: true, message: 'Status salvo com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar status:', error);
    res.status(500).json({ error: 'Erro ao salvar status', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Acesse o Kanban no navegador`);
});
