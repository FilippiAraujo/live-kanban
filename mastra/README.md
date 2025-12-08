# 🤖 Mastra AI Agents - Live Kanban

Sistema de agentes AI integrado ao Live Kanban para automatizar tarefas como melhorar descrições de tasks, gerar prompts contextualizados e atualizar documentação.

## 📋 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o `.env` e configure:

```env
OPENAI_API_KEY=sk-sua-chave-aqui
OPENAI_MODEL=gpt-4o-mini
```

### Modelos Disponíveis

Você pode usar qualquer modelo OpenAI alterando a variável `OPENAI_MODEL`:

- `gpt-4o-mini` - Rápido e econômico (padrão)
- `gpt-4o` - Mais poderoso
- `gpt-4o-2024-11-20` - Versão específica
- `gpt-4-turbo` - GPT-4 Turbo

**OpenRouter (Claude, Llama, etc.)**
- Configure `OPENROUTER_API_KEY` e `OPENROUTER_MODEL` (ex: `anthropic/claude-3.5-sonnet`).
- Opcional: `OPENROUTER_BASE_URL` (default `https://openrouter.ai/api/v1`), `OPENROUTER_HTTP_REFERER`, `OPENROUTER_APP_TITLE`.
- Se `OPENROUTER_*` estiverem definidos, os agentes usarão OpenRouter automaticamente.

**Outros providers futuros:**
- Anthropic Claude
- Google Gemini
- Groq
- Ollama (local)

## 🤖 Agentes Disponíveis

### Task Enhancer

**Função**: Melhora descrições simples de tasks, adicionando estrutura e detalhes técnicos.

**Como usar**: Clique no ícone ✨ (Sparkles) em qualquer card de task no Kanban.

**Entrada**: Descrição da task (string)

**Saída**:
```json
{
  "descricao": "Versão melhorada e concisa da descrição",
  "detalhes": "Seção detalhada em markdown com:\n## O que fazer\n## Como fazer\n## Arquivos afetados\n## Considerações"
}
```

## 🔧 Estrutura de Arquivos

```
mastra/
├── README.md              # Esta documentação
├── index.js              # Config principal do Mastra
├── agents/               # Agentes AI
│   └── task-enhancer.js  # Agente para melhorar tasks
└── tools/                # Tools customizadas (futuro)
```

## 🚀 Como Adicionar Novos Agentes

### 1. Criar o arquivo do agente

```javascript
// mastra/agents/meu-agente.js
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

export const meuAgente = new Agent({
  name: 'Meu Agente',
  instructions: 'Instruções detalhadas do que o agente deve fazer...',
  model: openai(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
});
```

### 2. Registrar no Mastra

```javascript
// mastra/index.js
import { meuAgente } from './agents/meu-agente.js';

export const mastra = new Mastra({
  agents: {
    taskEnhancer: taskEnhancerAgent,
    meuAgente: meuAgente, // Adicione aqui
  },
  logger: new ConsoleLogger(),
});
```

### 3. Criar endpoint no backend

```javascript
// backend/server.js
app.post('/api/agents/meu-agente', async (req, res) => {
  const agent = mastra.getAgent('meuAgente');
  const response = await agent.generate(req.body.prompt);
  res.json({ result: response.text });
});
```

### 4. Adicionar função na API do client

```typescript
// client/src/lib/api.ts
async meuAgente(input: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/agents/meu-agente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: input })
  });
  const data = await response.json();
  return data.result;
}
```

## 📚 Recursos

- [Mastra Docs](https://mastra.ai/docs)
- [Mastra GitHub](https://github.com/mastra-ai/mastra)
- [OpenAI Models](https://platform.openai.com/docs/models)
- [AI SDK](https://sdk.vercel.ai/docs)

## 🔮 Roadmap

Próximos agentes a serem implementados:

- [ ] **Prompt Generator** - Gera prompts contextualizados para continuar tasks
- [ ] **Doc Updater** - Atualiza status.md e projeto-context.md automaticamente
- [ ] **Code Reviewer** - Revisa código e sugere melhorias
- [ ] **Test Generator** - Gera testes baseados na task
- [ ] **Commit Message Generator** - Gera mensagens de commit descritivas

## 🐛 Troubleshooting

### Erro: "Mastra agents não disponíveis"

- Verifique se a `OPENAI_API_KEY` está configurada no `.env`
- Reinicie o servidor backend
- Verifique os logs do console para erros de importação

### Erro: "API key inválida"

- Confirme que sua chave OpenAI está correta
- Verifique se há créditos disponíveis na conta OpenAI

### Erro ao importar módulos ES

- Certifique-se que `"type": "module"` está no `package.json` raiz
- Use extensões `.js` nas importações
