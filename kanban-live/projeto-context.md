# 🏗️ Contexto Completo do Projeto - Live Kanban

> **Para LLMs:** Este documento contém TODA informação essencial sobre a arquitetura, stack e funcionamento deste projeto. Leia ANTES de fazer qualquer modificação.

---

## 🚀 TL;DR para LLMs (Leia Primeiro!)

Este é um **Kanban file-based** onde:
- ✅ Tasks vivem em `tasks.json` (4 colunas: backlog/todo/doing/done)
- ✅ Milestones organizam tasks por objetivo macro
- ✅ Interface React renderiza em tempo real
- ✅ Você pode editar `tasks.json` diretamente - o frontend atualiza via polling

**Arquivos-chave:**
- `kanban-live/tasks.json` - Board completo (tasks + milestones)
- `client/src/types.ts` - TypeScript interfaces
- `backend/server.js` - API REST (Express)
- `client/src/lib/api.ts` - Cliente HTTP

**Stack:** React 19 + TypeScript + Tailwind v4 + shadcn/ui + Express

---

## 🗺️ Mapa Mental: Como Navegar no Código

Quer adicionar uma feature? Siga este fluxo:

```
1. TYPES (types.ts)
   └─> Define interface TypeScript
        └─> Exemplo: interface Milestone { ... }

2. BACKEND (server.js)
   └─> Cria endpoint REST
        └─> Exemplo: POST /api/board/milestones

3. API CLIENT (lib/api.ts)
   └─> Adiciona função que chama o endpoint
        └─> Exemplo: async saveMilestones()

4. CONTEXT (BoardContext.tsx - SE NECESSÁRIO)
   └─> Atualiza estado global
        └─> Exemplo: const [milestones, setMilestones] = useState()

5. COMPONENTE (components/)
   └─> Usa a API e renderiza UI
        └─> Exemplo: MilestoneProgress.tsx
```

**Atalhos úteis:**
- Quer mexer em tasks? → `tasks.json` + `KanbanBoard.tsx`
- Quer mexer em milestones? → `tasks.json` (campo milestones) + `MilestoneProgress.tsx`
- Quer adicionar endpoint? → `backend/server.js`
- Quer adicionar componente UI? → `npx shadcn@latest add [nome]`

---

## 📝 Padrões para Edição de Arquivos

### ✅ SEMPRE Faça Isso:

**Ao editar `tasks.json`:**
```typescript
// 1. Leia ANTES de editar
const content = await Read('tasks.json')

// 2. Parse e valide
const data = JSON.parse(content)

// 3. Preserve a estrutura
const updated = {
  milestones: data.milestones || [],  // ✅ Sempre preserve
  backlog: data.backlog || [],
  todo: data.todo || [],
  doing: data.doing || [],
  done: data.done || []
}

// 4. Adicione sua mudança
updated.backlog.push({
  id: `t${Date.now().toString().slice(-4)}`,
  descricao: "Nova task",
  milestone: "m1"  // Opcional
})

// 5. Salve com indentação
await Write('tasks.json', JSON.stringify(updated, null, 2))
```

**Ao adicionar componente React:**
```bash
# 1. Use shadcn CLI (NÃO crie manualmente)
npx shadcn@latest add dialog

# 2. Import do jeito certo
import { Dialog } from '@/components/ui/dialog'  // ✅ Correto
import { Dialog } from './ui/dialog'             // ❌ Errado

# 3. Use types explícitos
import type { Task, Milestone } from '@/types.js'  // ✅ Com .js
```

### ❌ NUNCA Faça Isso:

```typescript
// ❌ Não adicione vírgulas trailing
{
  "tasks": [
    { "id": "t1" },  // ← vírgula aqui está OK
  ]  // ← esta vírgula quebra!
}

// ❌ Não modifique IDs existentes
task.id = "nova-id"  // NUNCA! IDs são imutáveis

// ❌ Não remova campos obrigatórios
delete data.milestones  // tasks.json sempre tem milestones (mesmo que [])

// ❌ Não use componentes shadcn sem instalar
import { NewComponent } from '@/components/ui/new'  // Se não rodou CLI, vai quebrar
```

---

## 🐛 Troubleshooting Comum

### Frontend não atualiza após editar `tasks.json`?

**Causa:** O polling (2s) ainda não rodou, ou o arquivo não foi salvo corretamente.

**Solução:**
```bash
# 1. Valide o JSON
cat kanban-live/tasks.json | jq

# 2. Verifique se o backend está rodando
curl http://localhost:7842/api/board?path=/caminho/projeto

# 3. Force reload no browser (Cmd+Shift+R)
```

---

### Erro "Milestone não aparece nos cards"?

**Causa:** Milestone não está no array `milestones` no topo do `tasks.json`.

**Solução:**
```json
{
  "milestones": [
    { "id": "m1", "titulo": "MVP", "cor": "#3b82f6" }  // ✅ Tem que estar aqui
  ],
  "backlog": [
    { "id": "t1", "descricao": "Task", "milestone": "m1" }  // Agora funciona
  ]
}
```

---

### Erro "Cannot find module '@/components/ui/X'"?

**Causa:** Componente shadcn não foi instalado.

**Solução:**
```bash
# Liste componentes instalados
ls client/src/components/ui/

# Instale o que falta
npx shadcn@latest add [nome-do-componente]
```

---

### Tasks não salvam ao arrastar?

**Causa:** Drag está desabilitado (modo edição ativo) ou erro no backend.

**Solução:**
```typescript
// Verifique se não está editando
const isEditing = isEditing || isEditingDetails  // Se true, drag desabilitado

// Verifique logs do backend
// Backend deve mostrar: "Tasks salvos com sucesso"
```

---

### Build quebrou após atualizar dependências?

**Causa:** Tailwind v4 é incompatível com alguns plugins.

**Solução:**
```bash
# Use APENAS dependências listadas no projeto-context.md
# NÃO instale:
# - tailwindcss-animate (use tw-animate-css)
# - @tailwindcss/typography (ainda não compatível v4)
# - plugins antigos do Tailwind v3
```

---

## 📦 1. O Que é Este Projeto?

**Nome:** Live Kanban
**Objetivo:** Sistema de gerenciamento de projetos com Kanban visual, otimizado para colaboração com LLMs (Claude, ChatGPT, etc.)

**Proposta de Valor:**
- Permite que desenvolvedores gerenciem projetos usando um Kanban drag-and-drop
- LLMs podem ler e modificar tasks através de arquivos JSON
- Mantém histórico completo do trabalho em cada task
- Interface web atualiza em tempo real
- Sistema de Milestones/Epics para organização macro de tasks
- Filtros e visualização de progresso por milestone

---

## 🛠️ 2. Stack Tecnológica

### Frontend
- **Framework:** React 19.2.0 com TypeScript
- **Build Tool:** Vite 7.2.2
- **Styling:**
  - Tailwind CSS v4 (`@tailwindcss/vite`)
  - shadcn/ui (componentes)
- **UI Components:**
  - `@radix-ui/*` (primitivos acessíveis)
  - `lucide-react` (ícones)
  - `sonner` (toast notifications)
- **Drag & Drop:** `@hello-pangea/dnd`
- **State Management:** React Context API
- **Themes:** `next-themes` (suporte dark mode)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Arquitetura:** REST API
- **Storage:** File-based (JSON files)

### Estrutura de Pastas
```
live-kanban/
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   │   └── ui/       # Componentes shadcn/ui
│   │   ├── contexts/     # Context API
│   │   ├── lib/          # Utilitários (utils.ts)
│   │   └── types.ts      # TypeScript types
│   └── package.json
├── backend/              # Backend Node/Express
│   └── server.js
└── kanban-live/          # Projeto padrão com arquivos de exemplo
    ├── tasks.json        # Kanban board (4 colunas)
    ├── utils.json        # Últimos projetos e configurações úteis
    ├── llm-guide.md      # Guia para LLMs
    ├── projeto-context.md # Este arquivo (contexto da stack)
    ├── objetivo.md       # Objetivo do projeto
    └── status.md         # Status atual
```

---

## 🔄 3. Como Funciona

### Fluxo de Dados

```
1. Usuário abre interface web (React)
   ↓
2. Frontend carrega projeto via API (/api/board)
   ↓
3. Backend lê tasks.json do filesystem
   ↓
4. Frontend renderiza Kanban com 4 colunas
   ↓
5. Usuário move cards (drag-and-drop)
   ↓
6. Frontend envia PUT /api/board
   ↓
7. Backend salva tasks.json
   ↓
8. LLM pode ler/editar tasks.json diretamente
```

### Endpoints API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/board?path=/caminho/projeto` | Retorna tasks.json + milestones do projeto |
| `POST` | `/api/board/tasks` | Salva tasks.json com timestamps automáticos |
| `POST` | `/api/board/status` | Salva status.md |
| `POST` | `/api/board/milestones` | Salva milestones no tasks.json |
| `DELETE` | `/api/board/task` | Deleta uma task específica |
| `DELETE` | `/api/board/milestones/:id` | Remove um milestone específico |
| `GET` | `/api/utils/recent-projects` | Lista projetos recentes |
| `POST` | `/api/utils/add-recent-project` | Adiciona projeto aos recentes |
| `DELETE` | `/api/utils/remove-recent-project` | Remove projeto dos recentes |
| `POST` | `/api/setup-project` | Cria estrutura kanban-live em novo projeto |
| `POST` | `/api/agents/enhance-task` | Melhora descrição de task com IA (legado) |
| `POST` | `/api/agents/generate-prompt` | Gera prompt completo para continuar task |
| `POST` | `/api/agents/enrich-task` | Reestrutura task existente com contexto |
| `POST` | `/api/agents/create-task/chat` | Chat conversacional para criar task |
| `POST` | `/api/agents/create-task/finalize` | Finaliza conversa e retorna task estruturada |

---

## 📋 4. Estrutura de Dados

### Schema `tasks.json`
```typescript
interface Milestone {
  id: string          // Formato: "m1234"
  titulo: string      // Nome do milestone
  descricao?: string  // Descrição do objetivo (opcional)
  cor: string         // Cor em hex (ex: "#3b82f6")
}

interface TodoItem {
  id: string          // Formato: "td1234"
  texto: string       // Descrição da sub-tarefa
  concluido: boolean  // Status de conclusão
}

interface TimelineEvent {
  coluna: Column      // Coluna de destino (backlog/todo/doing/done)
  timestamp: string   // ISO 8601 com timezone -03:00
}

interface Task {
  id: string              // Formato: "t1234"
  descricao: string       // Título da task
  detalhes?: string       // O que precisa ser feito (orientação) - opcional
  resultado?: string      // O que foi feito (preencher ao finalizar) - opcional
  milestone?: string      // ID do milestone (ex: "m1")
  todos?: TodoItem[]      // Lista de sub-tarefas (opcional)
  dataCriacao?: string    // ISO 8601 - quando foi criada (automático)
  dataInicio?: string     // ISO 8601 - primeira vez em "doing" (automático)
  dataFinalizacao?: string // ISO 8601 - primeira vez em "done" (automático)
  timeline?: TimelineEvent[] // Histórico completo de movimentações (automático)
}

interface TasksData {
  milestones: Milestone[]  // Lista de milestones do projeto
  backlog: Task[]          // Tasks futuras
  todo: Task[]             // A fazer
  doing: Task[]            // Em progresso
  done: Task[]             // Concluídas
}
```

### Exemplo de Milestone
```json
{
  "id": "m1",
  "titulo": "MVP",
  "descricao": "Funcionalidades essenciais do Kanban",
  "cor": "#3b82f6"
}
```

### Exemplo de Task Completa com Milestone, To-dos e Timeline
```json
{
  "id": "t1006",
  "descricao": "Implementar autenticação completa",
  "milestone": "m1",
  "detalhes": "O que precisa ser feito:\n- Sistema de autenticação com JWT\n- Validação de senha segura\n- Testes unitários",
  "resultado": "✅ Sistema completo implementado\n✅ Testes passando\n\nArquivos modificados:\n- backend/auth.js\n- client/src/lib/api.ts",
  "todos": [
    { "id": "td5678", "texto": "Criar endpoint POST /api/login", "concluido": true },
    { "id": "td5679", "texto": "Implementar geração de JWT", "concluido": true },
    { "id": "td5680", "texto": "Adicionar validação de senha", "concluido": true },
    { "id": "td5681", "texto": "Escrever testes unitários", "concluido": true }
  ],
  "dataCriacao": "2025-12-04T10:30:00-03:00",
  "dataInicio": "2025-12-04T14:15:30-03:00",
  "dataFinalizacao": "2025-12-04T18:45:00-03:00",
  "timeline": [
    { "coluna": "todo", "timestamp": "2025-12-04T10:30:00-03:00" },
    { "coluna": "doing", "timestamp": "2025-12-04T14:15:30-03:00" },
    { "coluna": "done", "timestamp": "2025-12-04T18:45:00-03:00" }
  ]
}
```

**Campos de Conteúdo:**
- `detalhes` (opcional) - O que precisa ser feito, orientação para quem vai fazer
- `resultado` (opcional) - O que foi feito, preencher quando finalizar a task

**Campos de Data/Timeline (Automáticos - gerenciados pelo backend):**
- `dataCriacao` - Adicionado automaticamente quando a task é criada
- `dataInicio` - Adicionado na primeira vez que a task vai para "doing"
- `dataFinalizacao` - Adicionado na primeira vez que a task vai para "done"
- `timeline` - Array com TODAS as movimentações entre colunas (nunca é apagado)
- **Timezone:** Todas as datas usam São Paulo (-03:00) no formato ISO 8601
- **Lock de escrita:** Backend usa lock simples para evitar race conditions
- **Escrita atômica:** Usa temp file + rename para garantir integridade
- **Deduplicação:** Evita eventos duplicados na timeline (optimistic UI + 5s window)

---

## 🎨 5. Componentes Principais

### Frontend

| Componente | Responsabilidade | Localização |
|------------|------------------|-------------|
| `App.tsx` | Root, routing, providers, tabs (Kanban/Roteiro/Status/Guia) | `src/App.tsx` |
| `Header.tsx` | Input path do projeto, projetos recentes, setup | `src/components/Header.tsx` |
| `KanbanBoard.tsx` | Container do board, drag-drop context, filtros | `src/components/KanbanBoard.tsx` |
| `KanbanColumn.tsx` | Coluna individual (Backlog/To Do/Doing/Done) | `src/components/KanbanColumn.tsx` |
| `TaskCard.tsx` | Card individual com edição inline, milestone badge, to-dos | `src/components/TaskCard.tsx` |
| `MilestoneProgress.tsx` | Exibe progresso de milestone com barra visual | `src/components/MilestoneProgress.tsx` |
| `BoardContext.tsx` | Context API para estado global | `src/contexts/BoardContext.tsx` |

### Componentes shadcn/ui Usados
- `Dialog` - Modal para adicionar tasks e milestones
- `Card` - Container dos cards e colunas
- `Button` - Botões da interface
- `Input` / `Textarea` - Formulários
- `Toast` (Sonner) - Notificações
- `Tabs` - Navegação entre Kanban/Roteiro/Status/Guia
- `DropdownMenu` - Menu de filtros por milestone

---

## 🔑 6. Regras de Negócio

### Gerenciamento de Tasks

1. **IDs únicos:** Sempre use `"t" + Date.now().toString().slice(-4)`
2. **4 Colunas obrigatórias:** backlog, todo, doing, done
3. **Detalhes estruturados:** Use formato Markdown padrão (veja llm-guide.md)
4. **Drag-and-drop:** Só funciona se não estiver editando
5. **Copiar path:** Formato `/path/to/project/tasks.json#taskId`
6. **Milestone opcional:** Task pode ter ou não ter milestone associado

### Edição de Tasks

- **Double-click:** Edita descrição ou detalhes
- **Botão "Ver detalhes":** Abre modal (aparece se task tem detalhes OU to-dos)
- **Botão "+ Adicionar detalhes":** Abre modal (aparece se task não tem detalhes nem to-dos)
- **Botão "📋":** Copia path completo da task
- **Botão "✨":** Melhora descrição com IA (Mastra)
- **Modal de detalhes:** Permite editar milestone, detalhes e to-dos
- **ESC:** Cancela edição
- **Enter:** Salva (só no input, não textarea)

### Gerenciamento de To-dos (Sub-tarefas)

1. **IDs únicos:** Sempre use `"td" + Date.now().toString().slice(-4)`
2. **Checkbox interativo:** Marcar/desmarcar to-dos no modal
3. **Adicionar to-do:** Input + botão "+" no modal de detalhes
4. **Remover to-do:** Ícone de lixeira (aparece ao hover)
5. **Indicador visual:** Badge no card mostra "X/Y" (concluídos/total)
6. **Persistência:** To-dos são salvos automaticamente no tasks.json
7. **Quando usar:** Tasks com múltiplas etapas ou que não serão finalizadas em uma sessão

### Gerenciamento de Milestones

1. **IDs únicos:** Sempre use `"m" + Date.now().toString().slice(-4)`
2. **Título obrigatório:** Descrição e cor são opcionais
3. **Cor padrão:** `#3b82f6` (azul)
4. **Criação:** Via botão "Novo Milestone" na aba Roteiro
5. **Progresso:** Calculado automaticamente (tasks done / tasks totais)
6. **Filtros:** Podem ser aplicados no Kanban para focar em milestone específico

### Filtros de Milestone

- **Dropdown no Kanban:** Permite selecionar múltiplos milestones
- **Badge contador:** Mostra quantos filtros estão ativos
- **Limpar filtros:** Botão para remover todos os filtros
- **Visual:** Cards mostram badge colorido do milestone

---

## 🚨 7. Pontos de Atenção

### Para LLMs que Vão Modificar Código

⚠️ **Tailwind v4:** Este projeto usa Tailwind CSS v4 (`@tailwindcss/vite`), NÃO v3!
- ✅ Use `@import "tailwindcss"` no CSS
- ✅ Use `@layer base` e `@theme` no CSS
- ✅ Animações via `tw-animate-css`, não `tailwindcss-animate`
- ❌ NÃO use `tailwind.config.js` com `plugins: []`
- ❌ NÃO use `@layer utilities` ou `@apply` em excesso

⚠️ **shadcn/ui:** Componentes instalados via CLI
- ✅ Use `npx shadcn@latest add [component]` para novos componentes
- ✅ Componentes ficam em `src/components/ui/`
- ✅ Sempre use o código EXATO que o CLI gera
- ❌ NÃO modifique manualmente os componentes do shadcn
- ❌ NÃO tente "melhorar" as animações - use o padrão

⚠️ **JSON Validation:**
- ✅ SEMPRE use `Read` antes de `Edit` em tasks.json
- ✅ Valide que não há vírgulas extras
- ❌ NUNCA adicione `null` ou `undefined`
- ❌ NUNCA deixe arrays vazios com vírgula trailing

---

## 📝 8. Padrões de Código

### TypeScript
```typescript
// ✅ Use tipos explícitos
interface Props {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
}

// ✅ Use optional chaining
const detalhes = task.detalhes ?? ''

// ✅ Import types corretamente
import type { Task, Column } from '@/types'
```

### React
```tsx
// ✅ Use React.forwardRef quando necessário (shadcn/ui)
const Component = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("base-classes", className)} {...props} />
  )
)

// ✅ Use Context API para estado global
const { boardData, updateTasks } = useBoard()
```

### Tailwind CSS
```tsx
// ✅ Use cn() para merge de classes
className={cn("fixed inset-0", customClass)}

// ✅ Use data attributes para estados
data-[state=open]:opacity-100

// ✅ Use translate ao invés de transform
translate-x-[-50%] translate-y-[-50%]
```

---

## 🎯 9. Decisões Arquiteturais

### Por que File-based ao invés de DB?
- ✅ Simplicidade para LLMs (podem editar diretamente)
- ✅ Git-friendly (versionamento automático)
- ✅ Portabilidade (sem setup de DB)
- ⚠️ Limitação: Não escala para múltiplos usuários simultâneos

### Por que Context API ao invés de Redux?
- ✅ Menos boilerplate
- ✅ Suficiente para este escopo
- ✅ Built-in do React

### Por que shadcn/ui?
- ✅ Copy-paste architecture (código no projeto)
- ✅ Totalmente customizável
- ✅ Acessibilidade built-in (Radix UI)
- ✅ Tailwind-based
- ✅ TypeScript first

### Por que Tailwind v4?
- ✅ Performance superior
- ✅ Menor bundle size
- ✅ Sintaxe CSS moderna
- ⚠️ Ainda em beta, alguns plugins não compatíveis

---

## 🔄 10. Próximos Passos (Roadmap)

Veja `tasks.json` para o backlog completo. Principais features:

### ✅ Implementado
1. Interface Kanban com drag-and-drop (4 colunas)
2. Campo de detalhes editável nas tasks
3. Botão de copiar path da task
4. Setup automático em novos projetos
5. **Sistema de Milestones/Epics** com criação, edição e filtros
6. **Aba Roteiro** com progresso visual de cada milestone
7. **Filtros por milestone** no Kanban
8. **Badge visual** nos cards mostrando milestone
9. Projetos recentes com dropdown
10. **Sistema completo de Agentes IA (Mastra):**
    - 🚀 Prompt Generator: Gera prompts completos para continuar tasks
    - 🪄 Task Enricher: Reestrutura tasks com contexto do projeto
    - ✨ Task Creator: Cria tasks via chat conversacional
    - 🔍 Explore Codebase: Tool para agentes investigarem código
11. **Timeline automática:** Rastreamento completo de movimentações
12. **Timestamps automáticos:** dataCriacao, dataInicio, dataFinalizacao
13. **Lock de escrita:** Proteção contra race conditions
14. **Aba Timeline:** Visualização temporal das tasks

### ⏳ Planejado
1. Sistema de sub-tasks (to-dos dentro de tasks)
2. Agente de "continuação" de tasks
3. Auto-update de objetivo/status
4. Biblioteca de patterns/boas práticas
5. Edição de milestones existentes (atualmente só criação)
6. Exclusão de milestones
7. Reordenação de milestones
8. Datas de início/fim em milestones
9. Integração Notion

---

## 📚 11. Recursos Adicionais

### Documentação Oficial
- **Tailwind v4:** https://tailwindcss.com/docs/v4-beta
- **shadcn/ui:** https://ui.shadcn.com
- **Radix UI:** https://radix-ui.com
- **React DnD:** https://github.com/hello-pangea/dnd
- **Vite:** https://vitejs.dev

### Ferramentas de Desenvolvimento
- **TypeScript:** https://typescriptlang.org
- **ESLint:** Configurado para React + TypeScript
- **npm scripts:**
  - `npm run dev` - Inicia dev server (frontend)
  - `npm run build` - Build para produção
  - `node backend/server.js` - Inicia backend

---

## 🗂️ 12. Arquivos de Configuração Importantes

| Arquivo | Propósito | Localização |
|---------|-----------|-------------|
| `vite.config.ts` | Config do Vite + Tailwind | `client/vite.config.ts` |
| `tailwind.config.ts` | Config mínima do Tailwind v4 | `client/tailwind.config.ts` |
| `tsconfig.json` | TypeScript config | `client/tsconfig.json` |
| `index.css` | CSS global + Tailwind imports | `client/src/index.css` |
| `package.json` | Dependências do projeto | `client/package.json` |

### Dependências Críticas
```json
{
  "@hello-pangea/dnd": "^18.0.1",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.29",
  "@radix-ui/react-tabs": "^1.1.27",
  "@tailwindcss/vite": "^4.1.17",
  "react": "^19.2.0",
  "sonner": "^2.0.7",
  "tailwindcss": "^4.1.17",
  "tw-animate-css": "^1.0.7",
  "@mastra/core": "^0.24.0",
  "@ai-sdk/openai": "^2.0.65"
}
```

---

## ⚙️ 13. Variáveis de Ambiente

**Nenhuma** por enquanto. O projeto funciona out-of-the-box sem configuração adicional.

Futuro:
- `PORT` - Porta do backend (default: 5000)
- `FRONTEND_URL` - URL do frontend (default: http://localhost:5173)

---

## 🧪 14. Testing (Futuro)

Atualmente **não há testes automatizados**. Roadmap:
- Vitest para unit tests
- React Testing Library para component tests
- Playwright para E2E tests

---

## 📖 15. Convenções de Nomenclatura

### Arquivos
- Componentes React: `PascalCase.tsx` (ex: `KanbanBoard.tsx`)
- Utilitários: `camelCase.ts` (ex: `utils.ts`)
- Tipos: `types.ts` (centralizado)
- Estilos: `kebab-case.css` (ex: `index.css`)

### Código
- Componentes: `PascalCase` (ex: `KanbanColumn`)
- Funções: `camelCase` (ex: `handleUpdateTask`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `API_BASE_URL`)
- Interfaces: `PascalCase` (ex: `Task`, `BoardData`)

### Git
- Commits: Mensagens descritivas em português
- Branches: `feature/nome-da-feature`, `fix/nome-do-bug`

---

## 🎓 16. Conceitos Importantes

### Drag and Drop com @hello-pangea/dnd
```tsx
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="todo">
    {(provided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps}>
                <TaskCard task={task} />
              </div>
            )}
          </Draggable>
        ))}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

### Context API Pattern
```tsx
// contexts/BoardContext.tsx
const BoardContext = createContext<BoardContextType | undefined>(undefined)

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boardData, setBoardData] = useState<BoardData | null>(null)

  return (
    <BoardContext.Provider value={{ boardData, updateTasks }}>
      {children}
    </BoardContext.Provider>
  )
}

export function useBoard() {
  const context = useContext(BoardContext)
  if (!context) throw new Error('useBoard must be used within BoardProvider')
  return context
}
```

---

## 🔐 17. Segurança

**Considerações atuais:**
- ⚠️ Sem autenticação (local only)
- ⚠️ Sem validação de paths (aceita qualquer caminho)
- ⚠️ Sem sanitização de inputs

**Para produção seria necessário:**
- Autenticação/autorização
- Validação de paths (evitar path traversal)
- Sanitização de inputs HTML
- CORS configurado corretamente
- Rate limiting

---

## 📊 18. Performance

**Otimizações atuais:**
- React 19 com automatic batching
- Vite para build rápido
- Tailwind CSS v4 (bundle menor)
- Code splitting automático (Vite)

**Futuras otimizações:**
- React.memo para componentes pesados
- useMemo/useCallback onde necessário
- Virtual scrolling para muitas tasks
- Service Worker para offline

---

## 🤖 19. Sistema de Agentes IA (Mastra)

O projeto integra **3 agentes especializados** usando Mastra framework para auxiliar no gerenciamento de tasks:

### Agentes Disponíveis

#### 1. 🚀 Prompt Generator Agent
**Localização:** `mastra/agents/prompt-generator-agent.js`
**Endpoint:** `POST /api/agents/generate-prompt`
**Botão UI:** 🚀 (azul) no TaskCard

**O que faz:**
- Gera prompt markdown completo para continuar trabalho em uma task
- Inclui contexto do projeto, task atual, progresso, próximos passos
- Output pode ser copiado e usado em outra LLM

**Tools usadas:**
- `readProjectFiles` - Lê projeto-context.md, status.md, llm-guide.md
- `readTask` - Lê task específica + tasks relacionadas
- `readMilestones` - Lista milestones disponíveis
- `listProjectStructure` - Estrutura de pastas do projeto
- `exploreCodebase` - Investiga código quando necessário (max 2-3 calls)

**Limite:** maxSteps: 8

---

#### 2. 🪄 Task Enricher Agent
**Localização:** `mastra/agents/task-enricher-agent.js`
**Endpoint:** `POST /api/agents/enrich-task`
**Botão UI:** 🪄 (roxo) no TaskCard

**O que faz:**
- Pega task existente (possivelmente vaga) e melhora com contexto do projeto
- Melhora descrição, estrutura detalhes, cria to-dos, sugere milestone
- Retorna JSON estruturado

**Tools usadas:**
- `readProjectFiles` - Contexto + guia de estilo de tasks
- `readTask` - Task atual + tasks similares (aprende padrão)
- `readMilestones` - Milestones para sugestão
- `exploreCodebase` - Investiga código SE task mencionar arquivo específico (max 1-2 calls)

**Output schema:**
```typescript
{
  descricao: string        // Descrição melhorada (1 linha, <100 chars)
  detalhes?: string        // Markdown estruturado
  todos?: Array<{texto}>   // 3-7 to-dos
  milestone?: string       // ID do milestone sugerido
}
```

**Limite:** maxSteps: 6

---

#### 3. ✨ Task Creator Agent
**Localização:** `mastra/agents/task-creator-agent.js`
**Endpoints:**
- `POST /api/agents/create-task/chat` - Conversa
- `POST /api/agents/create-task/finalize` - Finaliza e gera task

**Botão UI:** ✨ "Criar com IA" (roxo) no header

**O que faz:**
- Chat conversacional para criar task do zero
- Faz 2-4 perguntas estratégicas para entender o que criar
- Sem memória persistente (histórico gerenciado no frontend)
- Finalização gera task estruturada

**Fluxo:**
1. Primeira mensagem: carrega projeto-context.md + milestones
2. Conversa: 2-4 perguntas (escopo, implementação, milestone, detalhes)
3. Finalização: gera JSON estruturado da task

**Tools usadas:**
- `readProjectFiles` - Contexto (só na primeira mensagem)
- `readMilestones` - Milestones disponíveis (só na primeira mensagem)
- `exploreCodebase` - APENAS em último caso (max 1 call por conversa)

**Instruções especiais:**
- PRIORIZA conversar ao invés de investigar código
- Usa tool só se usuário mencionar arquivo específico
- Máximo 4 steps (chat precisa ser rápido)

---

### 🔧 Tool Compartilhada: Explore Codebase

**Localização:** `mastra/tools/explore-codebase.js`

**Capabilities:**

| Action | Input | Output | Uso |
|--------|-------|--------|-----|
| `list` | `directory: 'src/components'` | Lista arquivos/pastas | Explorar estrutura |
| `read` | `filePath: 'src/App.tsx'` | Conteúdo com line numbers | Ler código |
| `read` | `filePath, startLine, endLine` | Range de linhas | Arquivos grandes |
| `search` | `pattern: '**/*.tsx'` | Lista de arquivos | Buscar por glob |
| `search` | `grep: 'useState'` | Ocorrências + contexto | Buscar texto |

**Limites de segurança:**
- Max file size: 100KB (senão pede range de linhas)
- Max lines: 500 por leitura
- Max glob results: 50 arquivos
- Max grep matches: 30 ocorrências
- Max grep files: 100 arquivos pesquisados
- Ignora: node_modules, .git, dist, build, .next, kanban-live

**Filosofia de uso:**
- Agentes são **instruídos** a ser cirúrgicos e econômicos
- Prompt Generator: "Use quando necessário, mas seja cirúrgico (2-3 max)"
- Task Enricher: "Use APENAS se task mencionar arquivo específico (1-2 max)"
- Task Creator: "PRIORIDADE: conversar. Use em último caso (1 max)"

---

### 📊 Fluxo Completo: Criar Task com IA

```
1. Usuário clica "✨ Criar com IA"
   ↓
2. AITaskCreatorDialog abre
   ↓
3. Usuário: "quero adicionar modo escuro"
   ↓
4. Frontend → POST /agents/create-task/chat
   ↓
5. Backend:
   - Carrega projeto-context.md
   - Carrega milestones
   - Adiciona como system message
   - Agente responde: "É pro frontend, backend, ou ambos?"
   ↓
6. Usuário: "frontend React"
   ↓
7. Frontend → POST /agents/create-task/chat (com histórico)
   ↓
8. Agente: "Quer usar Context API ou alguma lib?"
   ↓
9. Usuário: "Context API"
   ↓
10. Agente: "Em qual milestone?"
    ↓
11. Usuário: "MVP"
    ↓
12. Usuário clica "Criar Task"
    ↓
13. Frontend → POST /agents/create-task/finalize (com histórico completo)
    ↓
14. Backend:
    - Agente gera JSON estruturado
    - Retorna { descricao, detalhes, todos, milestone }
    ↓
15. Frontend mostra preview
    ↓
16. Usuário clica "Confirmar e Adicionar"
    ↓
17. Task adicionada ao backlog!
```

---

### ⚙️ Configuração Mastra

**Localização:** `mastra/index.js`

```javascript
export const mastra = new Mastra({
  agents: {
    taskEnhancer,      // Legado (ainda em uso)
    promptGenerator,
    taskEnricher,
    taskCreator,
  },
  tools: {
    readProjectFiles,
    readTask,
    readMilestones,
    listProjectStructure,
    exploreCodebase,
  },
  logger: new ConsoleLogger(),
});
```

**Sem memória persistente:** Zero dependências de banco (LibSQL removido)
**Sem storage:** Tudo é stateless ou gerenciado no frontend

---

### 🎯 Dependências do Sistema de Agentes

```json
{
  "@mastra/core": "^0.24.0",
  "@mastra/mcp": "^0.14.4",
  "@ai-sdk/openai": "^2.0.65",
  "zod": "^3.25.76",
  "glob": "^13.0.0"
}
```

**Variável de ambiente:**
```bash
OPENAI_MODEL=gpt-4o-mini  # Default, pode ser qualquer modelo OpenAI
```

---

## ✨ Resumo Final

Este é um **sistema Kanban file-based** otimizado para **colaboração humano-LLM**:

- 🎨 **Stack moderna:** React 19, Tailwind v4, shadcn/ui, TypeScript
- 📁 **File-based:** Tasks em JSON, fácil de versionar e editar
- 🤖 **LLM-friendly:** Guia estruturado para IAs entenderem o projeto
- 🎯 **Simples:** Sem DB, sem auth, funciona out-of-the-box
- 🔄 **Real-time:** Interface atualiza ao mover cards
- 📝 **Documentado:** Histórico completo em cada task
- 🎯 **Milestones:** Organização macro com progresso visual
- 🔍 **Filtros:** Foco em milestones específicos
- 🤖 **Sistema de Agentes IA completo:**
  - 🚀 Gerar prompts para continuar tasks
  - 🪄 Enriquecer tasks com contexto
  - ✨ Criar tasks via chat conversacional
  - 🔍 Explorar codebase dinamicamente
- ⏱️ **Timeline automática:** Rastreamento completo de movimentações
- 🔒 **Lock de escrita:** Proteção contra race conditions

**Para começar:**
1. `cd client && npm install`
2. `npm run dev` (frontend em :5173)
3. `cd ../backend && node server.js` (backend em :7842)
4. Abra http://localhost:5173
5. Cole o path do seu projeto (ou use "Recentes")
6. **Novo projeto?** Clique em "Setup Projeto"
7. **Organize com milestones:** Vá na aba "Roteiro" > "Novo Milestone"
8. **Gerencie tasks:** Crie, edite, mova e associe a milestones
9. **Use filtros:** Filtre por milestone no Kanban
10. **IA:** Clique em ✨ para melhorar descrições
