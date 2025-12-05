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
  description: `Lê uma task específica do tasks.json e retorna também tasks relacionadas (mesmo milestone).
    Útil para entender o contexto de uma task e ver tasks similares.`,
  inputSchema: z.object({
    projectPath: z.string().describe('Caminho completo do projeto (deve incluir /kanban-live/)'),
    taskId: z.string().describe('ID da task a ser lida (ex: t1234)'),
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
    const { projectPath, taskId } = context;

    try {
      // Lê tasks.json
      const tasksFile = await fs.readFile(path.join(projectPath, 'tasks.json'), 'utf8');
      const tasksData = JSON.parse(tasksFile);

      // Busca a task em todas as colunas
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
