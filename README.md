# 📋 LiveKanban - O Kanban Nativo para Desenvolvedores e IAs

Uma ferramenta completa de gerenciamento de projetos que vive dentro do seu código, conversa fluentemente com IAs e oferece sincronização cloud opcional.

[![Website](https://img.shields.io/badge/Website-livekanban.dev-blue)](https://livekanban.dev)
[![GitHub](https://img.shields.io/badge/GitHub-live--kanban-black)](https://github.com/filippiaraujo/live-kanban)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

---

## 🎯 O Que Faz

O LiveKanban é um sistema completo de gerenciamento de projetos com diferenciais únicos:

- **🎨 Kanban Board**: 4 colunas (Backlog, To Do, Doing, Done) com drag-and-drop
- **🤖 Agentes IA**: Task Creator, Task Enricher e Prompt Generator (Mastra)
- **🎯 Milestones & Roadmap**: Organize tasks em épicos com progresso visual e timeline
- **☁️ Cloud Sync**: Publique seu roadmap online em [livekanban.dev](https://livekanban.dev) (opcional)
- **🔄 Live Reload**: Sincronização automática a cada 2s
- **📝 LLM-Friendly**: Documentação otimizada para Claude, ChatGPT, Cursor, Copilot
- **📂 Local First**: Seus dados em arquivos JSON/Markdown versionáveis no Git
- **✅ Sub-tarefas**: Checklist dentro de cada task com progresso

---

## 🚀 Instalação Rápida (3 minutos)

### 1. Clone e Instale

```bash
# Clone o repositório
git clone https://github.com/filippiaraujo/live-kanban.git
cd live-kanban

# Instale todas as dependências (backend + frontend + mastra)
npm run install:all
```

### 2. Configure os Agentes IA (Opcional)

Crie um arquivo `.env` dentro da pasta `/mastra`:

```bash
cd mastra
touch .env
```

Adicione sua chave API:

```bash
# Opção 1: OpenAI (recomendado)
OPENAI_API_KEY=sk-sua-chave-aqui

# Opção 2: OpenRouter (alternativa)
OPENROUTER_API_KEY=sua-chave-aqui
```

> 💡 **Nota**: O LiveKanban funciona perfeitamente sem IA! Os agentes são opcionais. Sem eles, você só não terá o Task Creator e Task Enricher.

### 3. Rode o Servidor

```bash
# Volta para a raiz
cd ..

# Inicia backend + frontend simultaneamente
npm start
```

Isso vai abrir automaticamente:
- ✅ **Backend**: `http://localhost:3001`
- ✅ **Frontend**: `http://localhost:5173`

---

## 📁 Como Funciona

### Estrutura de Arquivos

Ao carregar um projeto, o LiveKanban cria uma pasta `/kanban-live/` na raiz com:

```
seu-projeto/
├── kanban-live/
│   ├── tasks.json           # Kanban board + milestones + cloudSync
│   ├── status.md            # Status atual do projeto
│   ├── projeto-context.md   # Documentação técnica e arquitetura
│   └── llm-guide.md         # Guia para IAs modificarem o projeto
└── [seu código aqui]
```

### Schema do tasks.json

```json
{
  "backlog": [
    {
      "id": "t1001",
      "descricao": "Implementar autenticação JWT",
      "detalhes": "## Requisitos\n- Login social\n- Refresh token",
      "milestone": "m1",
      "resultado": "Autenticação implementada com sucesso",
      "todos": [
        { "id": "td1", "texto": "Criar rota /api/login", "concluido": true },
        { "id": "td2", "texto": "Validar token no front", "concluido": false }
      ],
      "dataCriacao": "2025-12-04T10:00:00-03:00",
      "dataInicio": "2025-12-04T14:00:00-03:00",
      "dataFinalizacao": "2025-12-05T16:30:00-03:00",
      "timeline": [
        { "coluna": "doing", "timestamp": "2025-12-04T14:00:00-03:00" },
        { "coluna": "done", "timestamp": "2025-12-05T16:30:00-03:00" }
      ]
    }
  ],
  "todo": [],
  "doing": [],
  "done": [],
  "milestones": [
    {
      "id": "m1",
      "titulo": "MVP",
      "descricao": "Versão mínima viável do produto",
      "cor": "#3b82f6"
    }
  ],
  "cloudSync": {
    "enabled": false,
    "slug": "",
    "url": "",
    "token": ""
  }
}
```

---

## ✨ Funcionalidades Principais

### 🎨 Kanban Board

- **4 Colunas**: Backlog → To Do → Doing → Done
- **Drag & Drop**: Arraste tasks entre colunas
- **Edição Inline**: Duplo-clique na descrição para editar
- **Filtros**: Por milestone ou busca em tempo real
- **Contadores**: Badges mostrando quantidade de tasks por coluna
- **Timeline**: Histórico completo de movimentações

### 🤖 Agentes de IA (Mastra)

#### **Task Creator** - Chat Conversacional
- Converse naturalmente para criar tasks
- Agente explora seu código automaticamente
- Sugere milestone apropriado
- Gera task estruturada com detalhes técnicos

#### **Task Enricher** - Reestruturação Inteligente
- Transforma tasks vagas em especificações técnicas
- Explora arquivos relevantes do projeto
- Adiciona to-dos específicos e contexto

#### **Prompt Generator** - Contexto Completo
- Gera prompt pronto para Claude/ChatGPT
- Inclui status do projeto, tasks relacionadas
- Perfeito para continuar implementação com outra IA

### 🎯 Milestones & Roadmap

- **Crie Milestones**: Agrupe tasks em épicos (MVP, V2, etc.)
- **Progresso Visual**: Barra colorida com percentual de conclusão
- **Filtrar por Milestone**: Foque apenas em um objetivo
- **Timeline Completa**: Visualize evolução cronológica de todas as tasks
- **Filtros Temporais**: Hoje, Esta Semana, Este Mês, Todos

### ☁️ Cloud Sync (Opcional)

- **Toggle On/Off**: Habilite com um clique
- **URL Compartilhável**: `livekanban.dev/p/seu-projeto`
- **Sincronização Automática**: A cada mudança local
- **Privacidade**: Você escolhe o que sincronizar

### 🔄 Live Reload

A interface atualiza automaticamente a cada 2 segundos quando:
- Uma LLM modifica arquivos do projeto
- Você edita arquivos manualmente em outro editor
- Tasks são movidas ou editadas

Perfeito para trabalho colaborativo **humano + IA**!

### ✏️ Edição Avançada

- **Descrição**: Duplo-clique para editar inline
- **Detalhes**: Modal com editor Markdown + preview
- **Sub-tarefas**: Adicionar, marcar completo, deletar to-dos
- **Resultado**: Campo específico ao finalizar task (o que foi feito)
- **Milestone**: Dropdown para reatribuir

### 📊 Metadados do Projeto

- **Status.md**: Markdown livre para status atual
- **Projeto-context.md**: Documentação de arquitetura
- **LLM-guide.md**: Instruções para IAs interagirem
- **Editor com Preview**: Visualização em tempo real

---

## 🛠️ Stack Técnica

### Frontend
- **React 19** + TypeScript
- **Tailwind CSS v4** (design moderno)
- **shadcn/ui** (componentes)
- **Vite** (bundler rápido)
- **@hello-pangea/dnd** (drag-and-drop)
- **Lucide React** (ícones)
- **date-fns** (datas PT-BR)

### Backend (Local)
- **Node.js** + Express
- **Mastra Framework** (agentes IA)
- **File System** (JSON + Markdown)
- **Promises & async/await**

### Backend (Cloud)
- **Cloudflare Workers** (serverless)
- **Cloudflare KV** (key-value storage)
- **Cloudflare Pages** (frontend hosting)

### Agentes IA
- **Mastra Core** (framework)
- **OpenAI API** (GPT-4o, GPT-4o-mini)
- **OpenRouter** (fallback compatível)

---

## 🔧 API Endpoints

### Board Management
- `GET /api/board?path={projectPath}` - Carrega projeto completo
- `POST /api/board/tasks` - Salva tasks.json
- `DELETE /api/board/task` - Deleta uma task
- `POST /api/board/status` - Salva status.md
- `POST /api/board/milestones` - Salva milestones
- `DELETE /api/board/milestones/:id` - Remove milestone

### Setup
- `POST /api/setup-project` - Cria estrutura kanban-live/ em projeto

### Agents
- `POST /api/agents/enhance-task` - Melhora descrição rápida
- `POST /api/agents/enrich-task` - Reestrutura task completa
- `POST /api/agents/generate-prompt` - Gera contexto para LLM
- `POST /api/agents/create-task/chat` - Chat conversacional
- `POST /api/agents/create-task/finalize` - Finaliza task criada
- `GET /api/agents` - Lista agentes disponíveis
- `GET /api/tools` - Lista tools disponíveis
- `GET /api/agents/status` - Status do sistema

### Cloud
- `GET /api/cloud/status` - Status de publicação
- `POST /api/cloud/publish` - Publica projeto online
- `POST /api/cloud/unpublish` - Desabilita sincronização
- `POST /api/cloud/sync` - Força sincronização manual

### Utils
- `GET /api/utils/recent-projects` - Projetos recentes
- `POST /api/utils/add-recent-project` - Adiciona à lista
- `DELETE /api/utils/remove-recent-project` - Remove de recentes

---

## 🤖 Trabalhando com IAs

### Como Usar com Claude/ChatGPT

1. **Cole o conteúdo do `llm-guide.md`** no contexto da IA
2. **Peça naturalmente**:
   > "Adiciona uma task para implementar autenticação JWT no milestone MVP"
3. **A IA vai**:
   - Ler o arquivo tasks.json
   - Entender a estrutura
   - Adicionar corretamente
4. **Live Reload detecta** e atualiza a interface automaticamente! 🎉

### Exemplo de Comandos

```
"Cria uma task para adicionar dark mode no milestone V2"
"Move a task t1005 para Done e adiciona resultado"
"Lista todas as tasks do milestone MVP"
"Atualiza o status.md com o progresso desta semana"
```

---

## 📝 Notas Importantes

- ✅ **Git Friendly**: Adicione `/kanban-live/` ao `.gitignore` ou versione junto
- ✅ **Multi-Projeto**: Alterne entre vários projetos pelo seletor lateral
- ✅ **Markdown Everywhere**: Status, contexto e guia suportam Markdown completo
- ✅ **Zero Lock-in**: Tudo são arquivos JSON/Markdown. Migre quando quiser
- ✅ **Offline First**: Funciona 100% local sem internet
- ✅ **Timestamps**: Datas no timezone de São Paulo (ISO 8601 com -03:00)

---

## 🎓 Recursos Úteis

- 🌐 **Website**: [livekanban.dev](https://livekanban.dev)
- 📚 **Documentação**: [GitHub Wiki](https://github.com/filippiaraujo/live-kanban/wiki)
- 🐛 **Issues**: [GitHub Issues](https://github.com/filippiaraujo/live-kanban/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/filippiaraujo/live-kanban/discussions)
- 🤝 **Contribuir**: Veja [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📦 Exemplo de Uso

Um projeto de exemplo completo está incluído em `/kanban-live/` com todos os arquivos configurados.

**Para testá-lo:**

1. Inicie o servidor: `npm start`
2. Acesse: `http://localhost:5173`
3. Use o seletor de projeto e navegue até a pasta `live-kanban/kanban-live`
4. Explore o Kanban, Roadmap, Agents e Metadata!

---

## 🌟 Por Que LiveKanban?

### Problema que Resolve

Desenvolvedores precisam de ferramentas que:
- ✅ Não quebrem o fluxo de desenvolvimento
- ✅ Sejam compatíveis com IAs modernas
- ✅ Mantenham dados localmente e versionados
- ✅ Permitam compartilhamento opcional

**LiveKanban resolve tudo isso.**

### Comparação

| Feature | LiveKanban | Trello | Linear | Jira |
|---------|------------|--------|--------|------|
| Local First | ✅ | ❌ | ❌ | ❌ |
| Git Versionado | ✅ | ❌ | ❌ | ❌ |
| Agentes IA Integrados | ✅ | ❌ | ❌ | ❌ |
| Markdown Nativo | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Open Source | ✅ | ❌ | ❌ | ❌ |
| Cloud Opcional | ✅ | ❌ | ❌ | ❌ |
| Zero Lock-in | ✅ | ❌ | ❌ | ❌ |

---

## 📜 Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).

---

## 🛠️ Construído Com

- [React 19](https://react.dev) - Framework UI
- [TypeScript](https://typescriptlang.org) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI
- [Mastra](https://mastra.ai) - Framework de agentes IA
- [Vite](https://vitejs.dev) - Build tool
- [Express.js](https://expressjs.com) - Backend
- [Cloudflare Workers](https://workers.cloudflare.com) - Cloud sync (opcional)

---

## ☁️ Cloud Sync

O LiveKanban é **local-first**, mas oferece sincronização cloud **opcional** para compartilhar seu roadmap publicamente.

Quando você habilita o Cloud Sync:
- ✅ Seu projeto ganha uma URL pública: `livekanban.dev/p/seu-projeto`
- ✅ Sincronização automática a cada mudança local
- ✅ Roadmap acessível online para clientes/time
- ✅ Dados continuam locais, você escolhe o que compartilhar

> 💡 **Nota**: O backend cloud roda em Cloudflare Workers + KV. Não há "deploy" do projeto local - você continua rodando em localhost e apenas sincroniza quando quiser.

---

**Feito com ❤️ por [@filippiaraujo](https://github.com/filippiaraujo)**

**Comece agora:** [livekanban.dev](https://livekanban.dev)
