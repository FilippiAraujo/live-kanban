// ========================================
// Explore Codebase Tool
// Permite agente navegar e explorar o codebase
// ========================================

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

const MAX_FILE_SIZE = 100000; // 100KB
const MAX_LINES = 500;

export const exploreCodebase = createTool({
  id: 'explore-codebase',
  description: `Explora o codebase do projeto.

IMPORTANTE: projectPath SEMPRE deve ser o caminho COMPLETO da raiz do projeto (ex: /Users/.../kanban-live).
Outros paths (filePath, directory) são RELATIVOS à raiz.

Exemplos:
- List: { projectPath: "/full/path/project", action: "list", directory: "src/components" }
- Read: { projectPath: "/full/path/project", action: "read", filePath: "src/App.tsx" }
- Search: { projectPath: "/full/path/project", action: "search", pattern: "**/*.tsx", grep: "Button" }`,

  // Schema enxuto: só exigimos projectPath e action; o resto é livre para evitar falhas de validação do runner.
  inputSchema: z.object({
    projectPath: z.string().describe('CAMINHO COMPLETO da raiz do projeto (ex: /Users/.../kanban-live) - NUNCA mude isso!'),
    action: z.enum(['list', 'read', 'search']).describe('list=listar arquivos | read=ler arquivo | search=buscar código'),
  }).passthrough(),
  outputSchema: z.object({
    success: z.boolean(),
    result: z.string(),
    error: z.string().optional(),
  }),

  execute: async ({ context }) => {
    const clean = value => (value === null || value === undefined ? undefined : value);
    const projectPath = context.projectPath;
    const action = context.action;
    const directory = clean(context.directory);
    const filePath = clean(context.filePath);
    const startLine = clean(context.startLine);
    const endLine = clean(context.endLine);
    const pattern = clean(context.pattern);
    const grep = clean(context.grep);

    console.log(`\n🔍 [exploreCodebase] Executando...`);
    console.log(`   Action: ${action}`);
    console.log(`   ProjectPath: ${projectPath}`);
    console.log(`   FilePath: ${filePath || 'N/A'}`);
    console.log(`   Directory: ${directory || 'N/A'}`);

    try {
      // Remove /kanban-live se existir
      const basePath = projectPath.replace(/\/kanban-live\/?$/, '');
      console.log(`   BasePath resolvido: ${basePath}`);

      // ========================================
      // ACTION: LIST - Lista arquivos/pastas
      // ========================================
      if (action === 'list') {
        const targetDir = directory ? path.join(basePath, directory) : basePath;

        try {
          const items = await fs.readdir(targetDir, { withFileTypes: true });
          const formatted = items
            .filter(item => {
              // Ignora pastas comuns
              const ignore = ['node_modules', '.git', 'dist', 'build', '.next', 'kanban-live'];
              return !ignore.includes(item.name);
            })
            .map(item => {
              const type = item.isDirectory() ? '📁' : '📄';
              return `${type} ${item.name}`;
            })
            .join('\n');

          const response = {
            success: true,
            result: `Conteúdo de ${directory || '.'}:\n\n${formatted}`
          };
          console.log(`   ✅ Retornando ${items.length} items`);
          return response;
        } catch (err) {
          return {
            success: false,
            result: '',
            error: `Diretório não encontrado: ${directory}`
          };
        }
      }

      // ========================================
      // ACTION: READ - Lê conteúdo de arquivo
      // ========================================
      if (action === 'read') {
        if (!filePath) {
          return {
            success: false,
            result: '',
            error: 'filePath é obrigatório para action: read'
          };
        }

        const targetFile = path.join(basePath, filePath);

        try {
          // Verifica tamanho do arquivo
          const stats = await fs.stat(targetFile);
          if (stats.size > MAX_FILE_SIZE) {
            return {
              success: false,
              result: '',
              error: `Arquivo muito grande (${Math.round(stats.size / 1024)}KB). Use startLine e endLine para ler partes específicas.`
            };
          }

          const content = await fs.readFile(targetFile, 'utf-8');
          const lines = content.split('\n');

          // Se especificou range de linhas
          if (startLine !== undefined || endLine !== undefined) {
            const start = startLine || 1;
            const end = endLine || lines.length;
            const selectedLines = lines.slice(start - 1, end);

            // Adiciona números de linha
            const numbered = selectedLines
              .map((line, idx) => `${start + idx}: ${line}`)
              .join('\n');

            const response = {
              success: true,
              result: `${filePath} (linhas ${start}-${end}):\n\n${numbered}`
            };
            console.log(`   ✅ Retornando ${selectedLines.length} linhas`);
            return response;
          }

          // Arquivo completo (se não for muito grande)
          if (lines.length > MAX_LINES) {
            return {
              success: false,
              result: '',
              error: `Arquivo tem ${lines.length} linhas. Use startLine e endLine para ler partes específicas (max ${MAX_LINES} linhas por vez).`
            };
          }

          // Adiciona números de linha
          const numbered = lines
            .map((line, idx) => `${idx + 1}: ${line}`)
            .join('\n');

          const response = {
            success: true,
            result: `${filePath}:\n\n${numbered}`
          };
          console.log(`   ✅ Retornando arquivo completo (${lines.length} linhas)`);
          return response;
        } catch (err) {
          return {
            success: false,
            result: '',
            error: `Arquivo não encontrado: ${filePath}`
          };
        }
      }

      // ========================================
      // ACTION: SEARCH - Busca por padrão glob ou grep
      // ========================================
      if (action === 'search') {
        if (!pattern && !grep) {
          return {
            success: false,
            result: '',
            error: 'Especifique pattern (glob) ou grep (texto a buscar)'
          };
        }

        // Busca por glob pattern
        if (pattern) {
          const files = await glob(pattern, {
            cwd: basePath,
            ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**', '.next/**', 'kanban-live/**'],
            nodir: true,
          });

          if (files.length === 0) {
            return {
              success: true,
              result: `Nenhum arquivo encontrado para: ${pattern}`
            };
          }

          // Limita a 50 arquivos
          const limited = files.slice(0, 50);
          const formatted = limited.map(f => `📄 ${f}`).join('\n');
          const more = files.length > 50 ? `\n\n... e mais ${files.length - 50} arquivos` : '';

          return {
            success: true,
            result: `Encontrados ${files.length} arquivo(s) para "${pattern}":\n\n${formatted}${more}`
          };
        }

        // Busca por texto (grep)
        if (grep) {
          // Busca em todos os arquivos relevantes
          const searchPattern = pattern || '**/*.{js,jsx,ts,tsx,json,md}';
          const files = await glob(searchPattern, {
            cwd: basePath,
            ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**', '.next/**', 'kanban-live/**'],
            nodir: true,
          });

          const matches = [];

          for (const file of files.slice(0, 100)) { // Limita busca a 100 arquivos
            try {
              const content = await fs.readFile(path.join(basePath, file), 'utf-8');
              const lines = content.split('\n');

              lines.forEach((line, idx) => {
                if (line.toLowerCase().includes(grep.toLowerCase())) {
                  matches.push({
                    file,
                    line: idx + 1,
                    content: line.trim()
                  });
                }
              });

              // Limita a 30 matches
              if (matches.length >= 30) break;
            } catch (err) {
              // Ignora arquivos binários ou ilegíveis
            }
          }

          if (matches.length === 0) {
            return {
              success: true,
              result: `Nenhuma ocorrência encontrada para: "${grep}"`
            };
          }

          const formatted = matches
            .map(m => `📄 ${m.file}:${m.line}\n   ${m.content}`)
            .join('\n\n');

          return {
            success: true,
            result: `Encontradas ${matches.length} ocorrência(s) de "${grep}":\n\n${formatted}`
          };
        }
      }

      return {
        success: false,
        result: '',
        error: 'Action inválida'
      };

    } catch (error) {
      return {
        success: false,
        result: '',
        error: error.message
      };
    }
  }
});

console.log('🔍 Explore Codebase Tool carregada');
