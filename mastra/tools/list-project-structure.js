// ========================================
// List Project Structure Tool
// Lista estrutura de pastas/arquivos do projeto
// ========================================

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

// Helper: Lista arquivos recursivamente
async function listFilesRecursive(dirPath, basePath, maxDepth = 3, currentDepth = 0) {
  if (currentDepth >= maxDepth) return [];

  const files = [];

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(basePath, fullPath);

      // Ignora node_modules, .git, dist, build, etc
      if (entry.name.startsWith('.') ||
          entry.name === 'node_modules' ||
          entry.name === 'dist' ||
          entry.name === 'build' ||
          entry.name === 'coverage') {
        continue;
      }

      if (entry.isDirectory()) {
        files.push(`${relativePath}/`);
        const subFiles = await listFilesRecursive(fullPath, basePath, maxDepth, currentDepth + 1);
        files.push(...subFiles);
      } else {
        // Só inclui arquivos relevantes (código, config, etc)
        const ext = path.extname(entry.name);
        const relevantExts = ['.js', '.ts', '.jsx', '.tsx', '.json', '.md', '.css', '.html', '.env'];
        if (relevantExts.includes(ext) || entry.name === 'package.json') {
          files.push(relativePath);
        }
      }
    }
  } catch (error) {
    // Ignora erros de permissão
  }

  return files;
}

export const listProjectStructure = createTool({
  id: 'list-project-structure',
  description: `Lista a estrutura de pastas e arquivos do projeto.
    Útil para entender onde estão os componentes, APIs, configurações, etc.
    Retorna apenas arquivos relevantes (código-fonte, configs, docs).`,
  inputSchema: z.object({
    projectPath: z.string().describe('Caminho completo do projeto (raiz do projeto, não /kanban-live/)'),
  }),
  outputSchema: z.object({
    structure: z.string().describe('Estrutura de pastas/arquivos em formato texto'),
    mainFolders: z.object({
      client: z.boolean(),
      backend: z.boolean(),
      mastra: z.boolean(),
    }).describe('Pastas principais encontradas'),
  }),
  execute: async ({ context }) => {
    const { projectPath } = context;

    try {
      // Remove /kanban-live/ do path se tiver (queremos a raiz do projeto)
      const rootPath = projectPath.replace(/\/kanban-live\/?$/, '');

      // Lista arquivos
      const files = await listFilesRecursive(rootPath, rootPath);

      // Formata em árvore de texto
      const structure = files.join('\n');

      // Detecta pastas principais
      const mainFolders = {
        client: files.some(f => f.startsWith('client/')),
        backend: files.some(f => f.startsWith('backend/')),
        mastra: files.some(f => f.startsWith('mastra/')),
      };

      return {
        structure,
        mainFolders,
      };
    } catch (error) {
      throw new Error(`Erro ao listar estrutura do projeto: ${error.message}`);
    }
  },
});
