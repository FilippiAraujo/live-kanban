# 🏗️ Contexto Completo do Projeto - Live Kanban

> **Para LLMs:** Este documento contém TODA informação essencial sobre a arquitetura, stack e funcionamento deste projeto. Leia ANTES de fazer qualquer modificação.

---

## 📦 1. O Que é Este Projeto?

**Nome:** Live Kanban
**Objetivo:** Sistema de gerenciamento de projetos com Kanban visual, otimizado para colaboração com LLMs (Claude, ChatGPT, etc.)

**Proposta de Valor:**
- Permite que desenvolvedores gerenciem projetos usando um Kanban drag-and-drop
- LLMs podem ler e modificar tasks através de arquivos JSON
- Mantém histórico completo do trabalho em cada task
- Interface web atualiza em tempo real

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
└── example-project/      # Projeto de exemplo
    ├── tasks.json        # Kanban board (4 colunas)
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
| `GET` | `/api/board?path=/caminho/projeto` | Retorna tasks.json do projeto |
| `PUT` | `/api/board` | Atualiza tasks.json com novas tasks |

---

## 📋 4. Estrutura de Dados

### Schema `tasks.json`
```typescript
interface Task {
  id: string          // Formato: "t1234"
  descricao: string   // Título da task
  detalhes?: string   // Markdown com histórico (opcional)
}

interface TasksData {
  backlog: Task[]     // Tasks futuras
  todo: Task[]        // A fazer
  doing: Task[]       // Em progresso
  done: Task[]        // Concluídas
}
```

### Exemplo de Task Completa
```json
{
  "id": "t1006",
  "descricao": "Adicionar campo de detalhes nos cards",
  "detalhes": "## O que era pra ser feito:\n- Cards editáveis\n\n## O que foi feito:\n✅ Implementado\n\n## Arquivos modificados:\n- TaskCard.tsx"
}
```

---

## 🎨 5. Componentes Principais

### Frontend

| Componente | Responsabilidade | Localização |
|------------|------------------|-------------|
| `App.tsx` | Root, routing, providers | `src/App.tsx` |
| `Header.tsx` | Input path do projeto | `src/components/Header.tsx` |
| `KanbanBoard.tsx` | Container do board, drag-drop context | `src/components/KanbanBoard.tsx` |
| `KanbanColumn.tsx` | Coluna individual (Backlog/To Do/Doing/Done) | `src/components/KanbanColumn.tsx` |
| `TaskCard.tsx` | Card individual com edição inline | `src/components/TaskCard.tsx` |
| `BoardContext.tsx` | Context API para estado global | `src/contexts/BoardContext.tsx` |

### Componentes shadcn/ui Usados
- `Dialog` - Modal para adicionar tasks
- `Card` - Container dos cards e colunas
- `Button` - Botões da interface
- `Input` / `Textarea` - Formulários
- `Toast` (Sonner) - Notificações

---

## 🔑 6. Regras de Negócio

### Gerenciamento de Tasks

1. **IDs únicos:** Sempre use `"t" + Date.now().toString().slice(-4)`
2. **4 Colunas obrigatórias:** backlog, todo, doing, done
3. **Detalhes estruturados:** Use formato Markdown padrão (veja llm-guide.md)
4. **Drag-and-drop:** Só funciona se não estiver editando
5. **Copiar path:** Formato `/path/to/project/tasks.json#taskId`

### Edição de Tasks

- **Double-click:** Edita descrição ou detalhes
- **Botão "+":** Adiciona detalhes se não existir
- **Botão "📋":** Copia path completo da task
- **ESC:** Cancela edição
- **Enter:** Salva (só no input, não textarea)

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

Veja `tasks.json` para o backlog completo. Principais features planejadas:

1. ✅ **DONE:** Interface Kanban com drag-and-drop
2. ✅ **DONE:** Campo de detalhes editável nas tasks
3. ✅ **DONE:** Botão de copiar path da task
4. ⏳ **TODO:** Agente para setup automático em novos projetos
5. ⏳ **TODO:** Sistema de sub-tasks (to-dos dentro de tasks)
6. ⏳ **TODO:** Agente de "continuação" de tasks
7. ⏳ **BACKLOG:** Auto-update de objetivo/status
8. ⏳ **BACKLOG:** Biblioteca de patterns/boas práticas
9. ⏳ **BACKLOG:** Orquestração com Mastra

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
  "@tailwindcss/vite": "^4.1.17",
  "react": "^19.2.0",
  "sonner": "^2.0.7",
  "tailwindcss": "^4.1.17",
  "tw-animate-css": "^1.0.7"
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

## ✨ Resumo Final

Este é um **sistema Kanban file-based** otimizado para **colaboração humano-LLM**:

- 🎨 **Stack moderna:** React 19, Tailwind v4, shadcn/ui, TypeScript
- 📁 **File-based:** Tasks em JSON, fácil de versionar e editar
- 🤖 **LLM-friendly:** Guia estruturado para IAs entenderem o projeto
- 🎯 **Simples:** Sem DB, sem auth, funciona out-of-the-box
- 🔄 **Real-time:** Interface atualiza ao mover cards
- 📝 **Documentado:** Histórico completo em cada task

**Para começar:**
1. `cd client && npm install`
2. `npm run dev` (frontend em :5173)
3. `cd ../backend && node server.js` (backend em :5000)
4. Abra http://localhost:5173
5. Cole o path do seu projeto
6. Comece a gerenciar tasks!
