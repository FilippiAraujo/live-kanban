# 🤝 Contributing to LiveKanban

Thank you for considering contributing to LiveKanban! This guide will help you understand how the project works and how to contribute effectively.

[![Website](https://img.shields.io/badge/Website-livekanban.dev-blue)](https://livekanban.dev)
[![GitHub](https://img.shields.io/badge/GitHub-live--kanban-black)](https://github.com/filippiaraujo/live-kanban)

---

## 📋 Table of Contents

1. [Getting Started](#-getting-started)
2. [Configuring AI Agents](#-configuring-ai-agents)
3. [Documentation Structure](#-documentation-structure)
4. [Code Standards](#-code-standards)
5. [Contribution Workflow](#-contribution-workflow)
6. [Creating Issues](#-creating-issues)
7. [Pull Requests](#-pull-requests)
8. [Documentation for LLMs](#-documentation-for-llms)

---

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork on GitHub (click "Fork" button at the top of the page), then:
git clone https://github.com/YOUR-USERNAME/live-kanban.git
cd live-kanban
```

### 2. Install Dependencies

```bash
# Install backend + frontend + mastra all at once
npm run install:all

# OR manually (if you prefer):
cd backend && npm install
cd ../client && npm install
cd ../mastra && npm install
```

### 3. Run Locally

```bash
# Go back to root
cd ..

# Start backend + frontend simultaneously
npm start
```

This will automatically open:
- ✅ **Backend**: `http://localhost:3001`
- ✅ **Frontend**: `http://localhost:5173`

### 4. Read the Documentation

**BEFORE** contributing, read:
- `kanban-live/projeto-context.md` - Complete project context
- `kanban-live/llm-guide.md` - Guide for LLMs (useful for humans too!)
- `README.md` - General project overview

---

## 🤖 Configuring AI Agents

AI agents are **optional**, but if you want to test them:

### 1. Create .env in /mastra

```bash
cd mastra
touch .env
```

### 2. Add Your API Key

Choose one of the options:

```bash
# Option 1: OpenAI (recommended)
OPENAI_API_KEY=sk-your-key-here

# Option 2: OpenRouter (alternative)
OPENROUTER_API_KEY=your-key-here
MODEL_NAME=openai/gpt-4o  # specific OpenRouter model
```

### 3. Test the Agents

Open the interface (`http://localhost:5173`) and test:

- **Task Creator**: Conversational chat to create tasks
- **Task Enricher**: Improves vague tasks into technical specs
- **Prompt Generator**: Generates complete context for LLMs

> 💡 **Note**: Without configuring .env, LiveKanban works normally, but agents will be disabled.

---

## 📚 Documentation Structure

This project uses an **LLM-friendly documentation architecture**. Each project using LiveKanban should have:

### Required Files (`kanban-live/` folder)

| File | Purpose | Format |
|------|---------|--------|
| `tasks.json` | Kanban board (tasks + milestones + cloudSync) | Structured JSON |
| `projeto-context.md` | Complete stack, architecture, technical decisions | Markdown |
| `llm-guide.md` | Instructions for LLMs to modify the project | Markdown (generated) |
| `status.md` | Current status and progress | Free Markdown |

### Documentation Principles

1. **TL;DR First:** LLMs should understand the project in 30 seconds
2. **Mental Map:** Clear flow of where to make changes to add features
3. **Explicit Patterns:** ✅ Do this / ❌ Never do this
4. **Troubleshooting:** Common problems with ready solutions
5. **Practical Examples:** JSON, code, commands - not just theory

---

## 🎨 Code Standards

### TypeScript

```typescript
// ✅ Use explicit interfaces
interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
}

// ✅ Import types with 'type'
import type { Task, Milestone } from '@/types'

// ❌ Don't use 'any'
const data: any = {}  // ❌ Wrong
const data: Task = {} // ✅ Correct
```

### React

```tsx
// ✅ Functional components with types
export function TaskCard({ task, onUpdate }: TaskCardProps) {
  // ...
}

// ✅ Use React hooks
const [isEditing, setIsEditing] = useState(false)

// ✅ Destructure props and state
const { boardData, loading } = useBoard()
```

### Tailwind CSS

```tsx
// ✅ Use cn() for class merging
import { cn } from '@/lib/utils'

<div className={cn("base-classes", customClass)} />

// ✅ Tailwind v4 - use data attributes
<div data-[state=open]:opacity-100>...</div>

// ❌ Don't overuse @apply (only for base styles)
// ❌ Avoid using @layer utilities { ... } unnecessarily
```

### Naming Conventions

```
React Components:  PascalCase.tsx   (TaskCard.tsx)
Functions:         camelCase        (handleUpdate, fetchTasks)
Constants:         UPPER_SNAKE_CASE (API_BASE_URL, MAX_TASKS)
CSS Files:         kebab-case.css   (index.css, app-sidebar.css)
Types/Interfaces:  PascalCase       (Task, Milestone, BoardData)
```

---

## 🔄 Contribution Workflow

### 1. Create a Branch

```bash
# Feature
git checkout -b feature/feature-name

# Bug fix
git checkout -b fix/bug-name

# Documentation
git checkout -b docs/what-changed

# Refactor
git checkout -b refactor/what-refactored
```

### 2. Make Your Changes

**Important rules:**
- ✅ Read `projeto-context.md` before making changes
- ✅ Follow the flow: Types → Backend → API → Component
- ✅ Test locally before committing
- ✅ Run `npm run build` (in /client) to validate TypeScript
- ✅ Make sure backend and frontend work together

### 3. Semantic Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add milestone filters to Kanban"
git commit -m "fix: fix drag-and-drop bug when editing"
git commit -m "docs: update projeto-context.md with milestones"
git commit -m "refactor: extract filter logic to custom hook"
git commit -m "style: format code with prettier"
```

**Prefixes:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting (doesn't change logic)
- `refactor:` - Refactoring (doesn't add feature or fix)
- `test:` - Add or fix tests
- `chore:` - Maintenance (deps, configs)
- `perf:` - Performance improvements

### 4. Push and Pull Request

```bash
git push origin feature/feature-name

# Then create PR on GitHub
```

---

## 🐛 Creating Issues

### Types of Issues

Use appropriate templates:

1. **🐛 Bug Report** - Something broken
2. **✨ Feature Request** - New functionality idea
3. **📚 Documentation** - Documentation improvements
4. **❓ Question** - Questions about the project

### Best Practices

**For Bugs:**

```markdown
**Description:** What's broken?

**Steps to reproduce:**
1. Log in
2. Create a task
3. Drag to Done
4. Error appears

**Expected behavior:** Should move without error

**Screenshots:** (if applicable)

**Environment:**
- OS: macOS 14.1
- Browser: Chrome 120
- Node: v20.10.0
```

**For Features:**

```markdown
**Problem:** What problem does this solve?

**Proposed solution:** How do you imagine it working?

**Alternatives:** Other ways to solve it?

**Additional context:** Why is it important?

**Mockups/Examples:** (if applicable)
```

---

## 🎯 Pull Requests

### Checklist Before Opening PR

- [ ] Read `projeto-context.md` and followed standards
- [ ] Updated `projeto-context.md` if I added important features
- [ ] Tested locally (frontend + backend working together)
- [ ] Ran `npm run build` in /client without TypeScript errors
- [ ] Followed conventional commits
- [ ] Added comments on complex code
- [ ] Updated `llm-guide.md` if I changed file structure/APIs
- [ ] Tested with and without API keys configured (if touched agents)

### PR Template

```markdown
## 🎯 What Changes?

Clear and concise description of what this PR does.

## 📋 Type of Change

- [ ] 🐛 Bug fix (non-breaking)
- [ ] ✨ New feature (non-breaking)
- [ ] 💥 Breaking change (breaks compatibility)
- [ ] 📚 Documentation
- [ ] 🎨 UI/UX (visual improvements)
- [ ] ⚡️ Performance
- [ ] ♻️ Refactor

## 🧪 How to Test?

1. Clone the branch
2. Run `npm start`
3. Do X, Y, Z
4. Verify that A happens

## 📸 Screenshots (if applicable)

(Paste screenshots here)

## 📝 Additional Notes

Any extra context reviewers should know.

## ✅ Checklist

- [ ] Followed CONTRIBUTING.md standards
- [ ] Updated relevant documentation
- [ ] Tested locally
- [ ] Build passed without errors
- [ ] Commits follow conventional commits
```

---

## 🤖 Documentation for LLMs

### Why This Matters?

LiveKanban is **optimized for human-LLM collaboration**. Documentation should be:

1. **Structured:** Easy to parse (Markdown with clear headers)
2. **Complete:** LLMs don't guess, need explicit context
3. **With Examples:** JSON, code, real commands
4. **With Patterns:** ✅ Do / ❌ Never (no ambiguity)

### When Creating a New Project

When you create a new project using LiveKanban:

1. The system automatically generates `/kanban-live/` with base files
2. Fill in `projeto-context.md` with:
   - YOUR project's tech stack
   - Architecture and folder structure
   - Specific code patterns
   - Roadmap and goals
3. `llm-guide.md` is generated automatically
4. Keep both updated as the project evolves

### Keeping Documentation Updated

**Golden rule:**
> If you add a feature, UPDATE `projeto-context.md` in the same commit.

**Sections to update:**

- **TL;DR** - If something fundamental changed
- **Data Structure** - If you added fields to types
- **API Endpoints** - If you created new endpoints
- **Main Components** - If you added important components
- **Roadmap** - If you implemented something planned or planned something new

---

## 🎓 Useful Resources

### Official Documentation

- [React 19](https://react.dev)
- [TypeScript](https://typescriptlang.org)
- [Tailwind v4](https://tailwindcss.com/docs/v4-beta)
- [shadcn/ui](https://ui.shadcn.com)
- [Express.js](https://expressjs.com)
- [Mastra](https://mastra.ai)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

### Development Tools

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Vite](https://vitejs.dev)

### LiveKanban Community

- 🌐 **Website**: [livekanban.dev](https://livekanban.dev)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/filippiaraujo/live-kanban/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/filippiaraujo/live-kanban/issues)
- 📚 **Wiki**: [GitHub Wiki](https://github.com/filippiaraujo/live-kanban/wiki)

---

## 💡 Tips for Contributors

### First Contribution?

- Look for issues with `good first issue` label
- Read README.md and projeto-context.md completely
- Test the project locally before making changes
- Don't be afraid to ask in Discussions!

### Want to Contribute But Don't Know How?

Here are some ideas:

- 📝 Improve documentation (always welcome!)
- 🐛 Report bugs you found
- ✨ Suggest new features in Discussions
- 🎨 Improve UI/UX with designs/mockups
- 🧪 Add tests (we don't have many yet!)
- 🌍 Translate documentation to other languages
- 📹 Create video tutorials
- 🎤 Share the project on social media

### Working with Agents

If you're developing features related to Mastra agents:

1. Always test with and without API keys configured
2. Document the tools the agent uses well
3. Add useful logs for debugging
4. Think about rate limits and API costs
5. Test with different models (GPT-4o, GPT-4o-mini)

---

## ❓ Questions?

- 💬 Open a [Discussion](https://github.com/filippiaraujo/live-kanban/discussions)
- 🐛 Report bugs via [Issues](https://github.com/filippiaraujo/live-kanban/issues)
- 🌐 Visit [livekanban.dev](https://livekanban.dev)

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project ([MIT License](./LICENSE)).

---

## 🙏 Acknowledgments

Every PR, issue, and discussion helps make LiveKanban better for the entire community of developers working with AIs.

**Thank you for contributing! 🎉**

---

**Made with ❤️ by the community**

**Start contributing:** [github.com/filippiaraujo/live-kanban](https://github.com/filippiaraujo/live-kanban)
