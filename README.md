# 📋 LiveKanban - The Native Kanban for Developers and AI

A complete project management tool that lives inside your code, speaks fluently with AI, and offers optional cloud sync.

[![Website](https://img.shields.io/badge/Website-livekanban.dev-blue)](https://livekanban.dev)
[![GitHub](https://img.shields.io/badge/GitHub-live--kanban-black)](https://github.com/filippiaraujo/live-kanban)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

---

## 🎯 What It Does

LiveKanban is a complete project management system with unique differentiators:

- **🎨 Kanban Board**: 4 columns (Backlog, To Do, Doing, Done) with drag-and-drop
- **🤖 AI Agents**: Task Creator, Task Enricher, and Prompt Generator (Mastra)
- **🎯 Milestones & Roadmap**: Organize tasks into epics with visual progress and timeline
- **☁️ Cloud Sync**: Publish your roadmap online at [livekanban.dev](https://livekanban.dev) (optional)
- **🔄 Live Reload**: Automatic sync every 2 seconds
- **📝 LLM-Friendly**: Documentation optimized for Claude, ChatGPT, Cursor, Copilot
- **📂 Local First**: Your data in versionable JSON/Markdown files in Git
- **✅ Subtasks**: Checklist inside each task with progress tracking

---

## 🚀 Quick Installation (3 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/filippiaraujo/live-kanban.git
cd live-kanban

# Install all dependencies (backend + frontend + mastra)
npm run install:all
```

### 2. Configure AI Agents (Optional)

Create a `.env` file inside the `/mastra` folder:

```bash
cd mastra
touch .env
```

Add your API key:

```bash
# Option 1: OpenAI (recommended)
OPENAI_API_KEY=sk-your-key-here

# Option 2: OpenRouter (alternative)
OPENROUTER_API_KEY=your-key-here
```

> 💡 **Note**: LiveKanban works perfectly without AI! Agents are optional. Without them, you just won't have Task Creator and Task Enricher.

### 3. Run the Server

```bash
# Go back to root
cd ..

# Start backend + frontend simultaneously
npm start
```

This will automatically open:
- ✅ **Backend**: `http://localhost:3001`
- ✅ **Frontend**: `http://localhost:5173`

---

## 📁 How It Works

### File Structure

When loading a project, LiveKanban creates a `/kanban-live/` folder at the root with:

```
your-project/
├── kanban-live/
│   ├── tasks.json           # Kanban board + milestones + cloudSync
│   ├── status.md            # Current project status
│   ├── projeto-context.md   # Technical documentation and architecture
│   └── llm-guide.md         # Guide for AIs to modify the project
└── [your code here]
```

### tasks.json Schema

```json
{
  "backlog": [
    {
      "id": "t1001",
      "descricao": "Implement JWT authentication",
      "detalhes": "## Requirements\n- Social login\n- Refresh token",
      "milestone": "m1",
      "resultado": "Authentication successfully implemented",
      "todos": [
        { "id": "td1", "texto": "Create /api/login route", "concluido": true },
        { "id": "td2", "texto": "Validate token on frontend", "concluido": false }
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
      "descricao": "Minimum viable product",
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

## ✨ Main Features

### 🎨 Kanban Board

- **4 Columns**: Backlog → To Do → Doing → Done
- **Drag & Drop**: Drag tasks between columns
- **Inline Editing**: Double-click on description to edit
- **Filters**: By milestone or real-time search
- **Counters**: Badges showing number of tasks per column
- **Timeline**: Complete movement history

### 🤖 AI Agents (Mastra)

#### **Task Creator** - Conversational Chat
- Talk naturally to create tasks
- Agent automatically explores your code
- Suggests appropriate milestone
- Generates structured task with technical details

#### **Task Enricher** - Intelligent Restructuring
- Transforms vague tasks into technical specifications
- Explores relevant project files
- Adds specific to-dos and context

#### **Prompt Generator** - Complete Context
- Generates ready-to-use prompt for Claude/ChatGPT
- Includes project status, related tasks
- Perfect for continuing implementation with another AI

### 🎯 Milestones & Roadmap

- **Create Milestones**: Group tasks into epics (MVP, V2, etc.)
- **Visual Progress**: Colored bar with completion percentage
- **Filter by Milestone**: Focus on just one goal
- **Complete Timeline**: Visualize chronological evolution of all tasks
- **Time Filters**: Today, This Week, This Month, All

### ☁️ Cloud Sync (Optional)

- **Toggle On/Off**: Enable with one click
- **Shareable URL**: `livekanban.dev/p/your-project`
- **Automatic Sync**: On every local change
- **Privacy**: You choose what to sync

### 🔄 Live Reload

The interface automatically updates every 2 seconds when:
- An LLM modifies project files
- You manually edit files in another editor
- Tasks are moved or edited

Perfect for collaborative work **human + AI**!

### ✏️ Advanced Editing

- **Description**: Double-click to edit inline
- **Details**: Modal with Markdown editor + preview
- **Subtasks**: Add, mark complete, delete to-dos
- **Result**: Specific field when completing task (what was done)
- **Milestone**: Dropdown to reassign

### 📊 Project Metadata

- **Status.md**: Free Markdown for current status
- **Projeto-context.md**: Architecture documentation
- **LLM-guide.md**: Instructions for AIs to interact
- **Editor with Preview**: Real-time visualization

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + TypeScript
- **Tailwind CSS v4** (modern design)
- **shadcn/ui** (components)
- **Vite** (fast bundler)
- **@hello-pangea/dnd** (drag-and-drop)
- **Lucide React** (icons)
- **date-fns** (dates PT-BR)

### Backend (Local)
- **Node.js** + Express
- **Mastra Framework** (AI agents)
- **File System** (JSON + Markdown)
- **Promises & async/await**

### Backend (Cloud)
- **Cloudflare Workers** (serverless)
- **Cloudflare KV** (key-value storage)
- **Cloudflare Pages** (frontend hosting)

### AI Agents
- **Mastra Core** (framework)
- **OpenAI API** (GPT-4o, GPT-4o-mini)
- **OpenRouter** (compatible fallback)

---

## 🔧 API Endpoints

### Board Management
- `GET /api/board?path={projectPath}` - Load complete project
- `POST /api/board/tasks` - Save tasks.json
- `DELETE /api/board/task` - Delete a task
- `POST /api/board/status` - Save status.md
- `POST /api/board/milestones` - Save milestones
- `DELETE /api/board/milestones/:id` - Remove milestone

### Setup
- `POST /api/setup-project` - Create kanban-live/ structure in project

### Agents
- `POST /api/agents/enhance-task` - Quick description improvement
- `POST /api/agents/enrich-task` - Complete task restructuring
- `POST /api/agents/generate-prompt` - Generate context for LLM
- `POST /api/agents/create-task/chat` - Conversational chat
- `POST /api/agents/create-task/finalize` - Finalize created task
- `GET /api/agents` - List available agents
- `GET /api/tools` - List available tools
- `GET /api/agents/status` - System status

### Cloud
- `GET /api/cloud/status` - Publication status
- `POST /api/cloud/publish` - Publish project online
- `POST /api/cloud/unpublish` - Disable sync
- `POST /api/cloud/sync` - Force manual sync

### Utils
- `GET /api/utils/recent-projects` - Recent projects
- `POST /api/utils/add-recent-project` - Add to list
- `DELETE /api/utils/remove-recent-project` - Remove from recent

---

## 🤖 Working with AIs

### How to Use with Claude/ChatGPT

1. **Paste the `llm-guide.md` content** into the AI context
2. **Ask naturally**:
   > "Add a task to implement JWT authentication in the MVP milestone"
3. **The AI will**:
   - Read the tasks.json file
   - Understand the structure
   - Add correctly
4. **Live Reload detects** and updates the interface automatically! 🎉

### Example Commands

```
"Create a task to add dark mode in the V2 milestone"
"Move task t1005 to Done and add result"
"List all tasks from the MVP milestone"
"Update status.md with this week's progress"
```

---

## 📝 Important Notes

- ✅ **Git Friendly**: Add `/kanban-live/` to `.gitignore` or version together
- ✅ **Multi-Project**: Switch between multiple projects via side selector
- ✅ **Markdown Everywhere**: Status, context and guide support full Markdown
- ✅ **Zero Lock-in**: Everything is JSON/Markdown files. Migrate whenever you want
- ✅ **Offline First**: Works 100% locally without internet
- ✅ **Timestamps**: Dates in São Paulo timezone (ISO 8601 with -03:00)

---

## 🎓 Useful Resources

- 🌐 **Website**: [livekanban.dev](https://livekanban.dev)
- 📚 **Documentation**: [GitHub Wiki](https://github.com/filippiaraujo/live-kanban/wiki)
- 🐛 **Issues**: [GitHub Issues](https://github.com/filippiaraujo/live-kanban/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/filippiaraujo/live-kanban/discussions)
- 🤝 **Contribute**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📦 Example Usage

A complete example project is included in `/kanban-live/` with all configured files.

**To test it:**

1. Start the server: `npm start`
2. Access: `http://localhost:5173`
3. Use the project selector and navigate to the `live-kanban/kanban-live` folder
4. Explore Kanban, Roadmap, Agents, and Metadata!

---

## 🌟 Why LiveKanban?

### Problem It Solves

Developers need tools that:
- ✅ Don't break development flow
- ✅ Are compatible with modern AIs
- ✅ Keep data locally and versioned
- ✅ Allow optional sharing

**LiveKanban solves all of this.**

### Comparison

| Feature | LiveKanban | Trello | Linear | Jira |
|---------|------------|--------|--------|------|
| Local First | ✅ | ❌ | ❌ | ❌ |
| Git Versioned | ✅ | ❌ | ❌ | ❌ |
| Integrated AI Agents | ✅ | ❌ | ❌ | ❌ |
| Native Markdown | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Open Source | ✅ | ❌ | ❌ | ❌ |
| Optional Cloud | ✅ | ❌ | ❌ | ❌ |
| Zero Lock-in | ✅ | ❌ | ❌ | ❌ |

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

## 🛠️ Built With

- [React 19](https://react.dev) - UI Framework
- [TypeScript](https://typescriptlang.org) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - UI Components
- [Mastra](https://mastra.ai) - AI agents framework
- [Vite](https://vitejs.dev) - Build tool
- [Express.js](https://expressjs.com) - Backend
- [Cloudflare Workers](https://workers.cloudflare.com) - Cloud sync (optional)

---

## ☁️ Cloud Sync

LiveKanban is **local-first**, but offers **optional** cloud sync to share your roadmap publicly.

When you enable Cloud Sync:
- ✅ Your project gets a public URL: `livekanban.dev/p/your-project`
- ✅ Automatic sync on every local change
- ✅ Roadmap accessible online for clients/team
- ✅ Data stays local, you choose what to share

> 💡 **Note**: The cloud backend runs on Cloudflare Workers + KV. There's no "deploy" of the local project - you keep running on localhost and only sync when you want.

---

**Made with ❤️ by [@filippiaraujo](https://github.com/filippiaraujo)**

**Get started now:** [livekanban.dev](https://livekanban.dev)
