# 🤝 Contributing to LiveKanban

Obrigado por considerar contribuir com o LiveKanban! Este guia ajudará você a entender como o projeto funciona e como contribuir de forma efetiva.

[![Website](https://img.shields.io/badge/Website-livekanban.dev-blue)](https://livekanban.dev)
[![GitHub](https://img.shields.io/badge/GitHub-live--kanban-black)](https://github.com/filippiaraujo/live-kanban)

---

## 📋 Índice

1. [Como Começar](#-como-começar)
2. [Configurando Agentes IA](#-configurando-agentes-ia)
3. [Estrutura de Documentação](#-estrutura-de-documentação)
4. [Padrões de Código](#-padrões-de-código)
5. [Workflow de Contribuição](#-workflow-de-contribuição)
6. [Criando Issues](#-criando-issues)
7. [Pull Requests](#-pull-requests)
8. [Documentação para LLMs](#-documentação-para-llms)

---

## 🚀 Como Começar

### 1. Fork e Clone

```bash
# Fork no GitHub (botão "Fork" no topo da página), depois:
git clone https://github.com/SEU-USUARIO/live-kanban.git
cd live-kanban
```

### 2. Instale Dependências

```bash
# Instala backend + frontend + mastra de uma vez
npm run install:all

# OU manualmente (se preferir):
cd backend && npm install
cd ../client && npm install
cd ../mastra && npm install
```

### 3. Rode Localmente

```bash
# Volta para a raiz
cd ..

# Terminal 1 - Inicia backend + frontend simultaneamente
npm start
```

Isso vai abrir automaticamente:
- ✅ **Backend**: `http://localhost:3001`
- ✅ **Frontend**: `http://localhost:5173`

### 4. Leia a Documentação

**ANTES** de contribuir, leia:
- `kanban-live/projeto-context.md` - Contexto completo do projeto
- `kanban-live/llm-guide.md` - Guia para LLMs (útil para humanos também!)
- `README.md` - Overview geral do projeto

---

## 🤖 Configurando Agentes IA

Os agentes de IA são **opcionais**, mas se quiser testá-los:

### 1. Crie .env no /mastra

```bash
cd mastra
touch .env
```

### 2. Adicione sua API Key

Escolha uma das opções:

```bash
# Opção 1: OpenAI (recomendado)
OPENAI_API_KEY=sk-sua-chave-aqui

# Opção 2: OpenRouter (alternativa)
OPENROUTER_API_KEY=sua-chave-aqui
MODEL_NAME=openai/gpt-4o  # modelo específico do OpenRouter
```

### 3. Teste os Agentes

Abra a interface (`http://localhost:5173`) e teste:

- **Task Creator**: Chat conversacional para criar tasks
- **Task Enricher**: Melhora tasks vagas em specs técnicas
- **Prompt Generator**: Gera contexto completo para LLMs

> 💡 **Nota**: Sem configurar .env, o LiveKanban funciona normalmente, mas os agentes ficarão desabilitados.

---

## 📚 Estrutura de Documentação

Este projeto usa uma **arquitetura de documentação LLM-friendly**. Cada projeto que usa LiveKanban deve ter:

### Arquivos Obrigatórios (pasta `kanban-live/`)

| Arquivo | Propósito | Formato |
|---------|-----------|---------|
| `tasks.json` | Kanban board (tasks + milestones + cloudSync) | JSON estruturado |
| `projeto-context.md` | Stack completa, arquitetura, decisões técnicas | Markdown |
| `llm-guide.md` | Instruções para LLMs modificarem o projeto | Markdown (gerado) |
| `status.md` | Status atual e progresso | Markdown livre |

### Princípios da Documentação

1. **TL;DR First:** LLMs devem entender o projeto em 30 segundos
2. **Mapa Mental:** Fluxo claro de onde mexer para adicionar features
3. **Padrões Explícitos:** ✅ Faça isso / ❌ Nunca faça isso
4. **Troubleshooting:** Problemas comuns com soluções prontas
5. **Exemplos Práticos:** JSON, código, comandos - não apenas teoria

---

## 🎨 Padrões de Código

### TypeScript

```typescript
// ✅ Use interfaces explícitas
interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
}

// ✅ Import types com 'type'
import type { Task, Milestone } from '@/types'

// ❌ Não use 'any'
const data: any = {}  // ❌ Errado
const data: Task = {} // ✅ Correto
```

### React

```tsx
// ✅ Componentes funcionais com tipos
export function TaskCard({ task, onUpdate }: TaskCardProps) {
  // ...
}

// ✅ Use hooks do React
const [isEditing, setIsEditing] = useState(false)

// ✅ Destructure props e state
const { boardData, loading } = useBoard()
```

### Tailwind CSS

```tsx
// ✅ Use cn() para merge de classes
import { cn } from '@/lib/utils'

<div className={cn("base-classes", customClass)} />

// ✅ Tailwind v4 - use data attributes
<div data-[state=open]:opacity-100>...</div>

// ❌ Não use @apply em excesso (só para base styles)
// ❌ Evite usar @layer utilities { ... } sem necessidade
```

### Naming Conventions

```
Componentes React:  PascalCase.tsx   (TaskCard.tsx)
Funções:           camelCase        (handleUpdate, fetchTasks)
Constantes:        UPPER_SNAKE_CASE (API_BASE_URL, MAX_TASKS)
Arquivos CSS:      kebab-case.css   (index.css, app-sidebar.css)
Types/Interfaces:  PascalCase       (Task, Milestone, BoardData)
```

---

## 🔄 Workflow de Contribuição

### 1. Crie uma Branch

```bash
# Feature
git checkout -b feature/nome-da-feature

# Bug fix
git checkout -b fix/nome-do-bug

# Documentação
git checkout -b docs/o-que-mudou

# Refactor
git checkout -b refactor/o-que-refatorou
```

### 2. Faça Suas Mudanças

**Regras importantes:**
- ✅ Leia `projeto-context.md` antes de mexer
- ✅ Siga o fluxo: Types → Backend → API → Component
- ✅ Teste localmente antes de commitar
- ✅ Rode `npm run build` (no /client) para validar TypeScript
- ✅ Certifique-se de que backend e frontend funcionam juntos

### 3. Commit Semântico

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: adiciona filtros por milestone no Kanban"
git commit -m "fix: corrige bug de drag-and-drop ao editar"
git commit -m "docs: atualiza projeto-context.md com milestones"
git commit -m "refactor: extrai lógica de filtros para hook customizado"
git commit -m "style: formata código com prettier"
```

**Prefixos:**
- `feat:` - Nova feature
- `fix:` - Bug fix
- `docs:` - Documentação
- `style:` - Formatação (não muda lógica)
- `refactor:` - Refatoração (não adiciona feature nem fix)
- `test:` - Adiciona ou corrige testes
- `chore:` - Manutenção (deps, configs)
- `perf:` - Melhorias de performance

### 4. Push e Pull Request

```bash
git push origin feature/nome-da-feature

# Depois crie PR no GitHub
```

---

## 🐛 Criando Issues

### Tipos de Issues

Use os templates apropriados:

1. **🐛 Bug Report** - Algo quebrado
2. **✨ Feature Request** - Ideia de nova funcionalidade
3. **📚 Documentation** - Melhorias na documentação
4. **❓ Question** - Dúvidas sobre o projeto

### Boas Práticas

**Para Bugs:**

```markdown
**Descrição:** O que está quebrado?

**Passos para reproduzir:**
1. Faça login
2. Crie uma task
3. Arraste para Done
4. Erro aparece

**Comportamento esperado:** Deveria mover sem erro

**Screenshots:** (se aplicável)

**Ambiente:**
- OS: macOS 14.1
- Browser: Chrome 120
- Node: v20.10.0
```

**Para Features:**

```markdown
**Problema:** Qual problema isso resolve?

**Solução proposta:** Como você imagina funcionando?

**Alternativas:** Outras formas de resolver?

**Contexto adicional:** Por que é importante?

**Mockups/Exemplos:** (se aplicável)
```

---

## 🎯 Pull Requests

### Checklist Antes de Abrir PR

- [ ] Li `projeto-context.md` e segui os padrões
- [ ] Atualizei `projeto-context.md` se adicionei features importantes
- [ ] Testei localmente (frontend + backend funcionando juntos)
- [ ] Rodei `npm run build` no /client sem erros TypeScript
- [ ] Segui conventional commits
- [ ] Adicionei comentários em código complexo
- [ ] Atualizei `llm-guide.md` se mudei estrutura de arquivos/APIs
- [ ] Testei com e sem API keys configuradas (se mexeu em agentes)

### Template de PR

```markdown
## 🎯 O Que Muda?

Descrição clara e concisa do que este PR faz.

## 📋 Tipo de Mudança

- [ ] 🐛 Bug fix (non-breaking)
- [ ] ✨ Nova feature (non-breaking)
- [ ] 💥 Breaking change (quebra compatibilidade)
- [ ] 📚 Documentação
- [ ] 🎨 UI/UX (melhorias visuais)
- [ ] ⚡️ Performance
- [ ] ♻️ Refactor

## 🧪 Como Testar?

1. Clone a branch
2. Rode `npm start`
3. Faça X, Y, Z
4. Verifique que A acontece

## 📸 Screenshots (se aplicável)

(Cole prints aqui)

## 📝 Notas Adicionais

Qualquer contexto extra que revisores devem saber.

## ✅ Checklist

- [ ] Segui os padrões do CONTRIBUTING.md
- [ ] Atualizei documentação relevante
- [ ] Testei localmente
- [ ] Build passou sem erros
- [ ] Commits seguem conventional commits
```

---

## 🤖 Documentação para LLMs

### Por Que Isso Importa?

LiveKanban é **otimizado para colaboração humano-LLM**. A documentação deve ser:

1. **Estruturada:** Fácil de parsear (Markdown com headers claros)
2. **Completa:** LLMs não adivinham, precisam de contexto explícito
3. **Com Exemplos:** JSON, código, comandos reais
4. **Com Padrões:** ✅ Faça / ❌ Nunca (sem ambiguidade)

### Ao Criar Um Novo Projeto

Quando você cria um novo projeto que usa LiveKanban:

1. O sistema gera automaticamente `/kanban-live/` com arquivos base
2. Preencha `projeto-context.md` com:
   - Stack técnica do SEU projeto
   - Arquitetura e estrutura de pastas
   - Padrões de código específicos
   - Roadmap e objetivos
3. O `llm-guide.md` é gerado automaticamente
4. Mantenha ambos atualizados conforme o projeto evolui

### Mantendo Documentação Atualizada

**Regra de ouro:**
> Se você adiciona uma feature, ATUALIZE `projeto-context.md` no mesmo commit.

**Seções a atualizar:**

- **TL;DR** - Se mudou algo fundamental
- **Estrutura de Dados** - Se adicionou campos em types
- **Endpoints API** - Se criou novos endpoints
- **Componentes Principais** - Se adicionou componentes importantes
- **Roadmap** - Se implementou algo planejado ou planejou algo novo

---

## 🎓 Recursos Úteis

### Documentação Oficial

- [React 19](https://react.dev)
- [TypeScript](https://typescriptlang.org)
- [Tailwind v4](https://tailwindcss.com/docs/v4-beta)
- [shadcn/ui](https://ui.shadcn.com)
- [Express.js](https://expressjs.com)
- [Mastra](https://mastra.ai)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

### Ferramentas de Desenvolvimento

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Vite](https://vitejs.dev)

### Comunidade LiveKanban

- 🌐 **Website**: [livekanban.dev](https://livekanban.dev)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/filippiaraujo/live-kanban/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/filippiaraujo/live-kanban/issues)
- 📚 **Wiki**: [GitHub Wiki](https://github.com/filippiaraujo/live-kanban/wiki)

---

## 💡 Dicas para Contribuidores

### Primeira Contribuição?

- Procure issues com label `good first issue`
- Leia o README.md e projeto-context.md completamente
- Teste o projeto localmente antes de fazer mudanças
- Não tenha medo de perguntar nas Discussions!

### Quer Contribuir Mas Não Sabe Como?

Aqui estão algumas ideias:

- 📝 Melhorar documentação (sempre bem-vinda!)
- 🐛 Reportar bugs que você encontrou
- ✨ Sugerir novas features nas Discussions
- 🎨 Melhorar UI/UX com designs/mockups
- 🧪 Adicionar testes (ainda não temos muitos!)
- 🌍 Traduzir documentação para outras línguas
- 📹 Criar tutoriais em vídeo
- 🎤 Compartilhar o projeto nas redes sociais

### Trabalhando com Agentes

Se você está desenvolvendo features relacionadas aos agentes Mastra:

1. Sempre teste com e sem API keys configuradas
2. Documente bem os tools que o agente usa
3. Adicione logs úteis para debug
4. Pense em rate limits e custos de API
5. Teste com diferentes modelos (GPT-4o, GPT-4o-mini)

---

## ❓ Dúvidas?

- 💬 Abra uma [Discussion](https://github.com/filippiaraujo/live-kanban/discussions)
- 🐛 Reporte bugs via [Issues](https://github.com/filippiaraujo/live-kanban/issues)
- 🌐 Visite [livekanban.dev](https://livekanban.dev)

---

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto ([MIT License](./LICENSE)).

---

## 🙏 Agradecimentos

Cada PR, issue e discussão ajuda a tornar LiveKanban melhor para toda a comunidade de desenvolvedores que trabalham com IAs.

**Obrigado por contribuir! 🎉**

---

**Feito com ❤️ pela comunidade**

**Comece a contribuir:** [github.com/filippiaraujo/live-kanban](https://github.com/filippiaraujo/live-kanban)
