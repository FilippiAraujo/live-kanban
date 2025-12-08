#!/usr/bin/env node

// ========================================
// Generate Project Map
// Gera projeto-map.json com estrutura e metadados do projeto
// ========================================

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do projeto (raiz do live-kanban)
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'kanban-live', 'projeto-map.json');

// Função auxiliar: lista arquivos de um diretório
async function listFiles(dir, basePath = PROJECT_ROOT) {
  try {
    const fullPath = path.join(basePath, dir);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });

    return entries
      .filter(entry => {
        // Ignora node_modules, .git, dist, etc
        const ignored = ['node_modules', '.git', 'dist', 'build', '.next', '.vite'];
        return !ignored.includes(entry.name);
      })
      .map(entry => entry.name);
  } catch (error) {
    return [];
  }
}

// Função auxiliar: lê package.json e extrai deps principais
async function getPackageInfo(packagePath) {
  try {
    const content = await fs.readFile(packagePath, 'utf8');
    const pkg = JSON.parse(content);

    return {
      dependencies: Object.keys(pkg.dependencies || {}).filter(dep => {
        // Filtra só deps principais (não @radix-ui/*, etc)
        return !dep.startsWith('@radix-ui') && !dep.startsWith('@types');
      }),
      devDependencies: Object.keys(pkg.devDependencies || {}).filter(dep => {
        return !dep.startsWith('@types') && !dep.startsWith('eslint');
      })
    };
  } catch (error) {
    return { dependencies: [], devDependencies: [] };
  }
}

// Função principal: gera o mapa
async function generateProjectMap() {
  console.log('🗺️  Gerando projeto-map.json...\n');

  // 1. Estrutura de pastas
  console.log('📁 Listando estrutura...');
  const structure = {
    'client/src/components/': await listFiles('client/src/components'),
    'client/src/components/ui/': await listFiles('client/src/components/ui'),
    'client/src/contexts/': await listFiles('client/src/contexts'),
    'client/src/lib/': await listFiles('client/src/lib'),
    'mastra/agents/': await listFiles('mastra/agents'),
    'mastra/tools/': await listFiles('mastra/tools'),
    'backend/': await listFiles('backend'),
  };

  // 2. Dependencies
  console.log('📦 Lendo dependências...');
  const clientPkg = await getPackageInfo(path.join(PROJECT_ROOT, 'client/package.json'));
  const backendPkg = await getPackageInfo(path.join(PROJECT_ROOT, 'backend/package.json'));

  // 3. Componentes shadcn instalados
  console.log('🎨 Detectando componentes shadcn/ui...');
  const uiComponents = await listFiles('client/src/components/ui');
  const shadcnInstalled = uiComponents
    .filter(f => f.endsWith('.tsx'))
    .map(f => f.replace('.tsx', ''))
    .map(name => {
      // Capitaliza primeira letra (button -> Button)
      return name.charAt(0).toUpperCase() + name.slice(1);
    });

  // 4. Monta o objeto final
  const projectMap = {
    generatedAt: new Date().toISOString(),
    version: '1.0.0',

    quickReference: {
      uiComponents: 'client/src/components/ - Ver TaskCard.tsx, Header.tsx como exemplos',
      api: 'backend/server.js + client/src/lib/api.ts',
      agents: 'mastra/agents/ - Ver task-creator-agent.js como padrão',
      tools: 'mastra/tools/ - exploreCodebase, readTask, readMilestones, etc',
      contexts: 'client/src/contexts/BoardContext.tsx - Estado global do app'
    },

    structure,

    dependencies: {
      frontend: clientPkg.dependencies,
      backend: backendPkg.dependencies,
      ai: clientPkg.dependencies.filter(dep =>
        dep.includes('mastra') || dep.includes('ai-sdk') || dep.includes('openai')
      )
    },

    shadcnInstalled,

    commonQueries: {
      verModais: "exploreCodebase({ action: 'search', grep: 'Dialog', pattern: '**/*.tsx' })",
      verEndpoints: "exploreCodebase({ action: 'search', grep: 'app.post', pattern: 'backend/**/*.js' })",
      verAgentes: "exploreCodebase({ action: 'list', directory: 'mastra/agents' })",
      verComponentesUI: "exploreCodebase({ action: 'list', directory: 'client/src/components/ui' })",
      verAPIClient: "exploreCodebase({ action: 'read', filePath: 'client/src/lib/api.ts' })",
      verBoardContext: "exploreCodebase({ action: 'read', filePath: 'client/src/contexts/BoardContext.tsx' })"
    },

    patterns: {
      botaoNoHeader: {
        descricao: 'Adicionar botão no Header.tsx',
        arquivo: 'client/src/components/Header.tsx',
        exemplo: "Ver botões existentes (linhas 95-120), adicionar handler no topo e botão em <div className='flex gap-2'>"
      },
      novoEndpoint: {
        descricao: 'Criar endpoint REST',
        arquivo: 'backend/server.js',
        exemplo: "app.post('/api/rota', async (req, res) => { ... res.json({ success: true, data }) })"
      },
      chamarAPI: {
        descricao: 'Adicionar chamada de API',
        arquivo: 'client/src/lib/api.ts',
        exemplo: "export async function minhaFuncao() { const res = await fetch(...); return res.json() }"
      },
      novoAgente: {
        descricao: 'Criar agente Mastra',
        arquivo: 'mastra/agents/',
        exemplo: 'Ver task-creator-agent.js como template completo'
      }
    }
  };

  // 5. Salva o arquivo
  console.log('💾 Salvando projeto-map.json...');
  await fs.writeFile(
    OUTPUT_PATH,
    JSON.stringify(projectMap, null, 2),
    'utf8'
  );

  console.log(`\n✅ projeto-map.json gerado com sucesso!`);
  console.log(`📍 Localização: ${OUTPUT_PATH}`);
  console.log(`\n📊 Resumo:`);
  console.log(`   - ${Object.keys(structure).length} diretórios mapeados`);
  console.log(`   - ${shadcnInstalled.length} componentes shadcn/ui instalados`);
  console.log(`   - ${projectMap.dependencies.frontend.length} dependências frontend`);
  console.log(`   - ${projectMap.dependencies.backend.length} dependências backend`);
}

// Executa
generateProjectMap().catch(error => {
  console.error('❌ Erro ao gerar projeto-map.json:', error);
  process.exit(1);
});
