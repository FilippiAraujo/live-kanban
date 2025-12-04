# 🤝 Contributing to Live Kanban

Obrigado por considerar contribuir com o Live Kanban! Este guia ajudará você a entender como o projeto funciona e como contribuir de forma efetiva.

---

## 📋 Índice

1. [Como Começar](#-como-começar)
2. [Estrutura de Documentação](#-estrutura-de-documentação)
3. [Padrões de Código](#-padrões-de-código)
4. [Workflow de Contribuição](#-workflow-de-contribuição)
5. [Criando Issues](#-criando-issues)
6. [Pull Requests](#-pull-requests)
7. [Documentação para LLMs](#-documentação-para-llms)

---

## 🚀 Como Começar

### 1. Fork e Clone

```bash
# Fork no GitHub, depois:
git clone https://github.com/SEU-USUARIO/live-kanban.git
cd live-kanban
```

### 2. Instale Dependências

```bash
# Frontend
cd client
npm install

# Backend
cd ../backend
npm install
```

### 3. Rode Localmente

```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd client
npm run dev
```

### 4. Leia a Documentação

**ANTES** de contribuir, leia:
- `kanban-live/projeto-context.md` - Contexto completo do projeto
- `kanban-live/llm-guide.md` - Guia para LLMs (útil para humanos também!)

---

## 📚 Estrutura de Documentação

Este projeto usa uma **arquitetura de documentação LLM-friendly**. Cada projeto que usa Live Kanban deve ter:

### Arquivos Obrigatórios (pasta `kanban-live/`)

| Arquivo | Propósito | Template |
|---------|-----------|----------|
| `projeto-context.md` | Stack completa, arquitetura, decisões | [DOC-TEMPLATE.md](./DOC-TEMPLATE.md) |
| `llm-guide.md` | Instruções para LLMs modificarem o projeto | Gerado automaticamente |
| `tasks.json` | Kanban board (tasks + milestones) | `{ milestones: [], backlog: [], todo: [], doing: [], done: [] }` |
| `status.md` | Status atual e progresso | Livre (Markdown) |
| `utils.json` | Projetos recentes e configs | Gerado automaticamente |

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
interface Props {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
}

// ✅ Import types com 'type'
import type { Task, Milestone } from '@/types.js'

// ❌ Não use 'any'
const data: any = {}  // ❌ Errado
```

### React

```tsx
// ✅ Componentes funcionais com tipos
export function TaskCard({ task, onUpdate }: TaskCardProps) {
  // ...
}

// ✅ Use hooks do React
const [isEditing, setIsEditing] = useState(false)

// ✅ Destructure props
const { boardData, loading } = useBoard()
```

### Tailwind CSS

```tsx
// ✅ Use cn() para merge de classes
import { cn } from '@/lib/utils'

<div className={cn("base-classes", customClass)} />

// ✅ Tailwind v4 - use data attributes
data-[state=open]:opacity-100

// ❌ Não use @apply em excesso (só para base styles)
```

### Naming Conventions

```
Componentes React:  PascalCase.tsx   (TaskCard.tsx)
Funções:           camelCase        (handleUpdate)
Constantes:        UPPER_SNAKE_CASE (API_BASE_URL)
Arquivos CSS:      kebab-case.css   (index.css)
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
```

### 2. Faça Suas Mudanças

**Regras importantes:**
- ✅ Leia `projeto-context.md` antes de mexer
- ✅ Siga o fluxo: Types → Backend → API → Component
- ✅ Teste localmente antes de commitar
- ✅ Rode `npm run build` para validar

### 3. Commit Semântico

```bash
# Use conventional commits
git commit -m "feat: adiciona filtros por milestone no Kanban"
git commit -m "fix: corrige bug de drag-and-drop ao editar"
git commit -m "docs: atualiza projeto-context.md com milestones"
git commit -m "refactor: extrai lógica de filtros para hook"
```

**Prefixos:**
- `feat:` - Nova feature
- `fix:` - Bug fix
- `docs:` - Documentação
- `style:` - Formatação (não muda lógica)
- `refactor:` - Refatoração (não adiciona feature nem fix)
- `test:` - Adiciona testes
- `chore:` - Manutenção (deps, configs)

### 4. Push e Pull Request

```bash
git push origin feature/nome-da-feature

# Depois crie PR no GitHub
```

---

## 🐛 Criando Issues

### Tipos de Issues

Use os templates em `.github/ISSUE_TEMPLATE/`:

1. **🐛 Bug Report** - Algo quebrado
2. **✨ Feature Request** - Ideia de nova funcionalidade
3. **📚 Documentation** - Melhorias na documentação
4. **❓ Question** - Dúvidas sobre o projeto

### Boas Práticas

**Para Bugs:**
```markdown
**Descrição:** O que está quebrado?
**Passos para reproduzir:** 1, 2, 3...
**Comportamento esperado:** O que deveria acontecer
**Screenshots:** Se aplicável
**Ambiente:** SO, browser, versão Node
```

**Para Features:**
```markdown
**Problema:** Qual problema isso resolve?
**Solução proposta:** Como você imagina funcionando?
**Alternativas:** Outras formas de resolver?
**Contexto adicional:** Por que é importante?
```

---

## 🎯 Pull Requests

### Checklist Antes de Abrir PR

- [ ] Li `projeto-context.md` e segui os padrões
- [ ] Atualizei `projeto-context.md` se adicionei features
- [ ] Testei localmente (frontend + backend)
- [ ] Rodei `npm run build` sem erros
- [ ] Segui conventional commits
- [ ] Adicionei comentários em código complexo
- [ ] Atualizei `llm-guide.md` se necessário

### Template de PR

```markdown
## 🎯 O Que Muda?

Descrição clara e concisa.

## 📋 Tipo de Mudança

- [ ] 🐛 Bug fix
- [ ] ✨ Nova feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentação

## 🧪 Como Testar?

1. Passo a passo para testar
2. ...

## 📸 Screenshots (se aplicável)

(Cole aqui)

## 📝 Checklist

- [ ] Segui os padrões do CONTRIBUTING.md
- [ ] Atualizei documentação
- [ ] Testei localmente
```

---

## 🤖 Documentação para LLMs

### Por Que Isso Importa?

Live Kanban é **otimizado para colaboração humano-LLM**. A documentação deve ser:

1. **Estruturada:** Fácil de parsear (Markdown com headers claros)
2. **Completa:** LLMs não adivinham, precisam de contexto explícito
3. **Com Exemplos:** JSON, código, comandos reais
4. **Com Padrões:** ✅ Faça / ❌ Nunca (sem ambiguidade)

### Template de Contexto

Ao criar um **novo projeto** que usa Live Kanban:

1. Copie `DOC-TEMPLATE.md` → `seu-projeto/kanban-live/projeto-context.md`
2. Preencha as seções conforme seu projeto
3. Mantenha a estrutura (TL;DR, Mapa Mental, Padrões, Troubleshooting)
4. Adicione seções específicas se necessário

### Mantendo Documentação Atualizada

**Regra de ouro:**
> Se você adiciona uma feature, ATUALIZE `projeto-context.md` no mesmo commit.

**Seções a atualizar:**
- TL;DR - Se mudou algo fundamental
- Estrutura de Dados - Se adicionou campos em types
- Endpoints API - Se criou novos endpoints
- Componentes Principais - Se adicionou componentes
- Roadmap - Se implementou algo planejado

---

## 🎓 Recursos Úteis

### Documentação Oficial
- [React 19](https://react.dev)
- [TypeScript](https://typescriptlang.org)
- [Tailwind v4](https://tailwindcss.com/docs/v4-beta)
- [shadcn/ui](https://ui.shadcn.com)
- [Express](https://expressjs.com)

### Ferramentas
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)

---

## ❓ Dúvidas?

- 💬 Abra uma [Discussion](https://github.com/SEU-USER/live-kanban/discussions)
- 🐛 Reporte bugs via [Issues](https://github.com/SEU-USER/live-kanban/issues)
- 📧 Email: seu-email@exemplo.com

---

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).

---

**Obrigado por contribuir! 🎉**

Cada PR, issue e discussão ajuda a tornar Live Kanban melhor para toda a comunidade.
