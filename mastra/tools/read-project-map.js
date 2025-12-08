// ========================================
// Read Project Map Tool
// Lê o arquivo projeto-map.json gerado automaticamente
// ========================================

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

export const readProjectMap = createTool({
  id: 'read-project-map',
  description: `Lê o mapa do projeto (projeto-map.json) com estrutura de pastas, dependências, componentes shadcn instalados e queries comuns.
    Útil para entender rapidamente a organização do projeto sem precisar explorar.`,
  inputSchema: z.object({
    projectPath: z.string().describe('Caminho completo do projeto (deve incluir /kanban-live/)'),
  }),
  outputSchema: z.object({
    quickReference: z.object({
      uiComponents: z.string(),
      api: z.string(),
      agents: z.string(),
      tools: z.string(),
      contexts: z.string(),
    }).describe('Referência rápida de onde encontrar cada tipo de código'),
    structure: z.record(z.array(z.string())).describe('Estrutura de pastas do projeto'),
    dependencies: z.object({
      frontend: z.array(z.string()),
      backend: z.array(z.string()),
      ai: z.array(z.string()),
    }).describe('Dependências instaladas'),
    shadcnInstalled: z.array(z.string()).describe('Componentes shadcn/ui instalados'),
    commonQueries: z.record(z.string()).describe('Queries úteis para exploreCodebase'),
    patterns: z.record(z.object({
      descricao: z.string(),
      arquivo: z.string(),
      exemplo: z.string(),
    })).describe('Padrões comuns de código'),
    generatedAt: z.string().describe('Data de geração do mapa'),
  }),
  execute: async ({ context }) => {
    const { projectPath } = context;

    try {
      // Lê projeto-map.json
      const mapFile = await fs.readFile(path.join(projectPath, 'projeto-map.json'), 'utf8');
      const projectMap = JSON.parse(mapFile);

      return projectMap;
    } catch (error) {
      throw new Error(`Erro ao ler projeto-map.json: ${error.message}`);
    }
  },
});
