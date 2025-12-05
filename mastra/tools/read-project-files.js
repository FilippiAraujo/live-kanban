// ========================================
// Read Project Files Tool
// Lê arquivos de contexto do projeto (projeto-context.md, status.md, llm-guide.md)
// ========================================

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

export const readProjectFiles = createTool({
  id: 'read-project-files',
  description: `Lê os arquivos de contexto do projeto (projeto-context.md, status.md, llm-guide.md).
    Use esta tool para obter informações sobre:
    - Stack tecnológica e arquitetura do projeto
    - Status atual do projeto (o que foi feito)
    - Guia de como estruturar tasks e interagir com o projeto`,
  inputSchema: z.object({
    projectPath: z.string().describe('Caminho completo do projeto (deve incluir /kanban-live/)'),
  }),
  outputSchema: z.object({
    projetoContext: z.string().describe('Conteúdo do projeto-context.md'),
    status: z.string().describe('Conteúdo do status.md'),
    llmGuide: z.string().describe('Conteúdo do llm-guide.md'),
  }),
  execute: async ({ context }) => {
    const { projectPath } = context;

    try {
      // Lê os 3 arquivos
      const [projetoContext, status, llmGuide] = await Promise.all([
        fs.readFile(path.join(projectPath, 'projeto-context.md'), 'utf8')
          .catch(() => '# Contexto do Projeto\n\n(Arquivo não encontrado)'),
        fs.readFile(path.join(projectPath, 'status.md'), 'utf8')
          .catch(() => '# Status\n\n(Arquivo não encontrado)'),
        fs.readFile(path.join(projectPath, 'llm-guide.md'), 'utf8')
          .catch(() => '# Guia LLM\n\n(Arquivo não encontrado)'),
      ]);

      return {
        projetoContext,
        status,
        llmGuide,
      };
    } catch (error) {
      throw new Error(`Erro ao ler arquivos do projeto: ${error.message}`);
    }
  },
});
