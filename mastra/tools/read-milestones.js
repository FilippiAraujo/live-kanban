// ========================================
// Read Milestones Tool
// Lista todos milestones disponíveis no projeto
// ========================================

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

export const readMilestones = createTool({
  id: 'read-milestones',
  description: `Lista todos os milestones disponíveis no projeto.
    Milestones são agrupamentos de tasks por objetivo macro (ex: MVP, Melhorias UX, Integração IA).`,
  inputSchema: z.object({
    projectPath: z.string().describe('Caminho completo do projeto (deve incluir /kanban-live/)'),
  }),
  outputSchema: z.object({
    milestones: z.array(z.object({
      id: z.string(),
      titulo: z.string(),
      descricao: z.string().optional(),
      cor: z.string(),
    })).describe('Lista de milestones disponíveis'),
  }),
  execute: async ({ context }) => {
    const { projectPath } = context;

    try {
      // Lê tasks.json
      const tasksFile = await fs.readFile(path.join(projectPath, 'tasks.json'), 'utf8');
      const tasksData = JSON.parse(tasksFile);

      // Extrai milestones
      const milestones = tasksData.milestones || [];

      return {
        milestones,
      };
    } catch (error) {
      throw new Error(`Erro ao ler milestones: ${error.message}`);
    }
  },
});
