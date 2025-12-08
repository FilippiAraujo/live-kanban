// ========================================
// Generate Project Map Utility
// Função reutilizável para gerar projeto-map.json
// ========================================

import fs from 'fs/promises';
import path from 'path';

// Lista arquivos de um diretório
async function listFiles(dir, basePath) {
  try {
    const fullPath = path.join(basePath, dir);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });

    return entries
      .filter(entry => {
        const ignored = ['node_modules', '.git', 'dist', 'build', '.next', '.vite', 'kanban-live'];
        return !ignored.includes(entry.name);
      })
      .map(entry => entry.name);
  } catch (error) {
    return [];
  }
}

// Lê package.json e extrai deps principais
async function getPackageInfo(packagePath) {
  try {
    const content = await fs.readFile(packagePath, 'utf8');
    const pkg = JSON.parse(content);

    return {
      dependencies: Object.keys(pkg.dependencies || {}).filter(dep => {
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

// Detecta componentes UI (shadcn, chakra, etc)
async function detectUIComponents(projectRoot) {
  const uiPaths = [
    'src/components/ui',
    'client/src/components/ui',
    'app/components/ui',
    'components/ui'
  ];

  for (const uiPath of uiPaths) {
    try {
      const fullPath = path.join(projectRoot, uiPath);
      const files = await fs.readdir(fullPath);

      return files
        .filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'))
        .map(f => f.replace(/\.(tsx|jsx)$/, ''))
        .map(name => name.charAt(0).toUpperCase() + name.slice(1));
    } catch {
      // Tenta próximo path
    }
  }

  return [];
}

// Detecta estrutura comum do projeto
async function detectStructure(projectRoot) {
  const commonPaths = [
    'src/',
    'client/src/',
    'app/',
    'components/',
    'lib/',
    'utils/',
    'backend/',
    'server/',
    'api/',
    'mastra/agents/',
    'mastra/tools/'
  ];

  const structure = {};

  for (const dir of commonPaths) {
    const files = await listFiles(dir, projectRoot);
    if (files.length > 0) {
      structure[dir] = files;
    }
  }

  return structure;
}

// Função principal exportável
export async function generateProjectMap(projectRoot) {
  console.log('🗺️  Gerando projeto-map.json...');

  // 1. Estrutura
  const structure = await detectStructure(projectRoot);

  // 2. Dependencies
  const packagePaths = [
    'package.json',
    'client/package.json',
    'backend/package.json',
    'server/package.json'
  ];

  let allDeps = { frontend: [], backend: [], ai: [] };

  for (const pkgPath of packagePaths) {
    const info = await getPackageInfo(path.join(projectRoot, pkgPath));

    // Classifica deps
    const aiDeps = info.dependencies.filter(dep =>
      dep.includes('mastra') || dep.includes('ai-sdk') || dep.includes('openai') || dep.includes('@anthropic')
    );

    if (pkgPath.includes('client') || pkgPath.includes('app')) {
      allDeps.frontend.push(...info.dependencies);
    } else if (pkgPath.includes('backend') || pkgPath.includes('server')) {
      allDeps.backend.push(...info.dependencies);
    } else {
      // package.json raiz - tenta inferir
      allDeps.frontend.push(...info.dependencies.filter(d =>
        d.includes('react') || d.includes('vue') || d.includes('svelte') || d.includes('next')
      ));
      allDeps.backend.push(...info.dependencies.filter(d =>
        d.includes('express') || d.includes('fastify') || d.includes('koa')
      ));
    }

    allDeps.ai.push(...aiDeps);
  }

  // Remove duplicados
  allDeps.frontend = [...new Set(allDeps.frontend)];
  allDeps.backend = [...new Set(allDeps.backend)];
  allDeps.ai = [...new Set(allDeps.ai)];

  // 3. UI Components
  const uiComponents = await detectUIComponents(projectRoot);

  // 4. Common queries baseadas na estrutura detectada
  const commonQueries = {};

  // Adiciona queries relevantes baseado no que existe
  const firstComponentDir = Object.keys(structure).find(k => k.includes('component'));
  if (firstComponentDir) {
    commonQueries.listComponents = `exploreCodebase({ action: 'list', directory: '${firstComponentDir}' })`;
  }

  // Detecta extensões principais
  const hasTS = Object.values(structure).flat().some(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  const hasJS = Object.values(structure).flat().some(f => f.endsWith('.js') || f.endsWith('.jsx'));
  const mainExt = hasTS ? 'ts' : 'js';
  const mainPattern = hasTS ? '**/*.{ts,tsx}' : '**/*.{js,jsx}';

  commonQueries.searchInCode = `exploreCodebase({ action: 'search', grep: 'seu-termo', pattern: '${mainPattern}' })`;

  // Sugere leitura de arquivos comuns
  const commonFiles = ['App', 'index', 'main', 'server'];
  for (const fileName of commonFiles) {
    for (const [dir, files] of Object.entries(structure)) {
      const match = files.find(f =>
        f.toLowerCase().includes(fileName.toLowerCase()) &&
        (f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.tsx') || f.endsWith('.jsx'))
      );
      if (match) {
        commonQueries[`read${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`] =
          `exploreCodebase({ action: 'read', filePath: '${dir}${match}' })`;
        break;
      }
    }
  }

  // 5. Monta o mapa
  const projectMap = {
    generatedAt: new Date().toISOString(),
    version: '1.0.0',

    quickReference: {
      description: 'Referência rápida da estrutura do projeto',
      generatedAutomatically: true,
      mainLanguage: hasTS ? 'TypeScript' : 'JavaScript',
      hasUI: uiComponents.length > 0,
      hasBackend: allDeps.backend.length > 0,
      hasAI: allDeps.ai.length > 0
    },

    structure,
    dependencies: allDeps,
    uiComponents,
    commonQueries
  };

  console.log('✅ Mapa gerado!');
  console.log(`   - ${Object.keys(structure).length} diretórios`);
  console.log(`   - ${uiComponents.length} componentes UI`);
  console.log(`   - ${allDeps.frontend.length + allDeps.backend.length + allDeps.ai.length} deps\n`);

  return projectMap;
}
