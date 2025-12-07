// ========================================
// Read Task Tool
// Lê uma task específica do tasks.json e retorna tasks relacionadas
// ========================================

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

export const readTask = createTool({
  id: 'read-task',
  description: `Lê uma task específica do tasks.json OU busca tasks por grep.
    Útil para entender o contexto de uma task e ver tasks similares.
    Se passar taskId: retorna task específica + tasks relacionadas (mesmo milestone).
    Se passar grep: retorna todas as tasks que contenham o termo buscado.`,
  inputSchema: z.object({
    projectPath: z.string().describe('Caminho completo do projeto (deve incluir /kanban-live/)'),
    taskId: z.string().optional().describe('ID da task a ser lida (ex: t1234)'),
    grep: z.string().optional().describe('Termo para buscar em tasks (busca em descrição e detalhes)'),
  }).refine(data => data.taskId || data.grep, {
    message: "Deve fornecer taskId OU grep"
  }),
  outputSchema: z.object({
    task: z.object({
      id: z.string(),
      descricao: z.string(),
      detalhes: z.string().optional(),
      resultado: z.string().optional(),
      milestone: z.string().optional(),
      todos: z.array(z.object({
        id: z.string(),
        texto: z.string(),
        concluido: z.boolean(),
      })).optional(),
      dataCriacao: z.string().optional(),
      dataInicio: z.string().optional(),
      dataFinalizacao: z.string().optional(),
      timeline: z.array(z.object({
        coluna: z.string(),
        timestamp: z.string(),
      })).optional(),
    }).describe('Task encontrada'),
    relatedTasks: z.array(z.object({
      id: z.string(),
      descricao: z.string(),
      milestone: z.string().optional(),
    })).describe('Tasks relacionadas (mesmo milestone)'),
  }),
  execute: async ({ context }) => {
    const { projectPath, taskId, grep } = context;

    try {
      // Lê tasks.json
      const tasksFile = await fs.readFile(path.join(projectPath, 'tasks.json'), 'utf8');
      const tasksData = JSON.parse(tasksFile);

      // Modo GREP: busca tasks por termo
      if (grep && !taskId) {
        const matchedTasks = [];
        const searchTerm = grep.toLowerCase();

        for (const column of ['backlog', 'todo', 'doing', 'done']) {
          const tasks = tasksData[column]?.filter(t => {
            const matchDesc = t.descricao?.toLowerCase().includes(searchTerm);
            const matchDetails = t.detalhes?.toLowerCase().includes(searchTerm);
            return matchDesc || matchDetails;
          }) || [];
          matchedTasks.push(...tasks);
        }

        // Retorna primeira task encontrada + outras como relacionadas
        if (matchedTasks.length === 0) {
          return {
            task: {
              id: 'none',
              descricao: `Nenhuma task encontrada com termo "${grep}"`,
            },
            relatedTasks: []
          };
        }

        return {
          task: matchedTasks[0],
          relatedTasks: matchedTasks.slice(1, 6).map(t => ({
            id: t.id,
            descricao: t.descricao,
            milestone: t.milestone
          }))
        };
      }

      // Modo TASK_ID: busca task específica
      let task = null;
      let taskMilestone = null;

      for (const column of ['backlog', 'todo', 'doing', 'done']) {
        const found = tasksData[column]?.find(t => t.id === taskId);
        if (found) {
          task = found;
          taskMilestone = found.milestone;
          break;
        }
      }

      if (!task) {
        throw new Error(`Task ${taskId} não encontrada`);
      }

      // Busca tasks relacionadas (mesmo milestone)
      const relatedTasks = [];
      if (taskMilestone) {
        for (const column of ['backlog', 'todo', 'doing', 'done']) {
          const tasks = tasksData[column]?.filter(t =>
            t.milestone === taskMilestone && t.id !== taskId
          ) || [];
          relatedTasks.push(...tasks.map(t => ({
            id: t.id,
            descricao: t.descricao,
            milestone: t.milestone,
          })));
        }
      }

      return {
        task,
        relatedTasks,
      };
    } catch (error) {
      throw new Error(`Erro ao ler task: ${error.message}`);
    }
  },
});
