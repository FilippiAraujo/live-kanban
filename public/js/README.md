# 📦 Estrutura Modular do Frontend

Este diretório contém toda a lógica do frontend organizada em módulos ES6 independentes.

## 📁 Estrutura de Arquivos

```
js/
├── app.js                      # Arquivo principal (orquestrador)
└── modules/
    ├── api.js                  # Comunicação com backend
    ├── state.js                # Gerenciamento de estado
    ├── markdown-parser.js      # Parser de Markdown
    ├── ui.js                   # Manipulação da interface
    ├── editor.js               # Edição de Objetivo e Status
    ├── drag-drop.js            # Drag and drop de tasks
    └── live-reload.js          # Polling e atualização automática
```

## 🎯 Responsabilidades de Cada Módulo

### `app.js` (Orquestrador Principal)
**Responsabilidade:** Inicialização e coordenação geral
- Importa todos os módulos
- Inicializa event listeners globais
- Coordena o carregamento do projeto
- Gerencia localStorage

**Dependências:** Todos os módulos

---

### `modules/api.js` (API Client)
**Responsabilidade:** Comunicação com o backend
- `loadBoard(projectPath)` - Carrega os 4 arquivos do projeto
- `saveTasks(projectPath, tasks)` - Salva tasks.json
- `saveObjetivo(projectPath, content)` - Salva objetivo.md
- `saveStatus(projectPath, content)` - Salva status.md

**Dependências:** Nenhuma

**Exemplo de uso:**
```javascript
import { API } from './modules/api.js';

const data = await API.loadBoard('/caminho/projeto');
await API.saveTasks('/caminho/projeto', tasks);
```

---

### `modules/state.js` (State Management)
**Responsabilidade:** Gerenciar estado global da aplicação
- Armazena projectPath, tasks, objetivo, status, llmGuide
- `setProjectPath(path)` - Define o caminho do projeto
- `setData(data)` - Atualiza todos os dados de uma vez
- `updateTasks(tasks)` - Atualiza apenas as tasks

**Dependências:** Nenhuma

**Exemplo de uso:**
```javascript
import { State } from './modules/state.js';

State.setData(data);
console.log(State.tasks.todo);
```

---

### `modules/markdown-parser.js` (Markdown Parser)
**Responsabilidade:** Converter Markdown para HTML
- `parse(markdown)` - Converte string Markdown em HTML

**Dependências:** Nenhuma

**Suporta:**
- Headers (# ## ###)
- Bold (**texto**)
- Italic (*texto*)
- Code blocks (\`\`\`)
- Inline code (\`)
- Links ([texto](url))
- Blockquotes (>)
- Listas (* e números)

**Exemplo de uso:**
```javascript
import { MarkdownParser } from './modules/markdown-parser.js';

const html = MarkdownParser.parse('# Título\n\n**Negrito**');
```

---

### `modules/ui.js` (UI Manager)
**Responsabilidade:** Manipulação da interface
- Gerencia todos os elementos do DOM
- `renderTasks()` - Renderiza o Kanban
- `renderMetadata()` - Renderiza Objetivo e Status
- `renderGuide()` - Renderiza Guia LLM
- `createTaskCard(task)` - Cria card de task com edição inline
- `showError(message)` / `showSuccess(message)` - Feedback

**Dependências:** State, API, MarkdownParser

**Exemplo de uso:**
```javascript
import { UI } from './modules/ui.js';

UI.renderTasks();
UI.showSuccess('Operação concluída');
```

---

### `modules/editor.js` (Editor)
**Responsabilidade:** Edição inline de Objetivo e Status
- `init()` - Inicializa event listeners
- `enterEditMode(type)` - Entra em modo de edição
- `saveEdit(type)` - Salva alterações
- `cancelEdit(type)` - Cancela edição
- `exitEditMode(type)` - Sai do modo de edição

**Dependências:** State, API, UI

**Exemplo de uso:**
```javascript
import { Editor } from './modules/editor.js';

Editor.init(); // Inicializa os event listeners
```

---

### `modules/drag-drop.js` (Drag and Drop)
**Responsabilidade:** Funcionalidade de arrastar e soltar tasks
- `init()` - Inicializa event listeners
- `handleDragStart(e)` - Inicia drag
- `handleDragEnd(e)` - Finaliza drag
- `handleDragOver(e)` - Passa sobre área válida
- `handleDrop(e)` - Solta task (salva automaticamente)

**Dependências:** State, API, UI

**Fluxo:**
1. Usuário arrasta task
2. Task é movida entre colunas no State
3. API salva automaticamente
4. UI re-renderiza

**Exemplo de uso:**
```javascript
import { DragDrop } from './modules/drag-drop.js';

DragDrop.init(); // Inicializa os event listeners
```

---

### `modules/live-reload.js` (Live Reload)
**Responsabilidade:** Polling e atualização automática
- `start()` - Inicia polling (2 segundos)
- `stop()` - Para polling
- Detecta mudanças nos arquivos
- Atualiza UI automaticamente

**Dependências:** API, State, UI, DragDrop

**Como funciona:**
1. Faz polling a cada 2 segundos
2. Compara dados novos com State atual
3. Se houver mudanças, atualiza State e UI
4. Re-inicializa DragDrop

**Exemplo de uso:**
```javascript
import { LiveReload } from './modules/live-reload.js';

LiveReload.start(); // Inicia polling
LiveReload.stop();  // Para polling
```

---

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   app.js    │ ◄── Orquestra tudo
└──────┬──────┘
       │
       ├──► API ◄──► Backend (Express)
       │
       ├──► State ◄── Armazena dados
       │       ▲
       │       │
       ├──► UI ├──► Renderiza interface
       │       │
       ├──► Editor ─┤
       │            │
       ├──► DragDrop┤
       │            │
       └──► LiveReload
```

## 📝 Como Adicionar um Novo Módulo

1. **Crie o arquivo em `modules/`:**
   ```javascript
   // modules/meu-modulo.js
   export const MeuModulo = {
     init() {
       // Inicialização
     },

     minhaFuncao() {
       // Lógica
     }
   };
   ```

2. **Importe em `app.js`:**
   ```javascript
   import { MeuModulo } from './modules/meu-modulo.js';

   // Use no App.init() ou onde necessário
   MeuModulo.init();
   ```

3. **Se precisar de outros módulos:**
   ```javascript
   import { State } from './state.js';
   import { UI } from './ui.js';

   export const MeuModulo = {
     minhaFuncao() {
       console.log(State.projectPath);
       UI.showSuccess('Sucesso!');
     }
   };
   ```

## 🛠️ Boas Práticas

### ✅ Faça
- Mantenha cada módulo com **uma única responsabilidade**
- Use **imports explícitos** (não importe tudo)
- Documente a **responsabilidade** de cada função
- Mantenha módulos **pequenos e focados**
- Use **nomes descritivos** para funções

### ❌ Não Faça
- Criar dependências circulares (A importa B, B importa A)
- Colocar lógica de UI no módulo API
- Misturar responsabilidades (ex: DragDrop fazendo parsing de Markdown)
- Acessar State diretamente de módulos sem necessidade
- Criar módulos gigantes com múltiplas responsabilidades

## 🔍 Debugging

### Ver estado atual:
```javascript
console.log(State);
```

### Ver dados carregados:
```javascript
const data = await API.loadBoard('/caminho');
console.log(data);
```

### Verificar se módulo foi carregado:
```javascript
import { UI } from './modules/ui.js';
console.log(UI); // Deve mostrar o objeto
```

## 📚 Vantagens da Estrutura Modular

1. **Manutenção facilitada** - Cada módulo pode ser editado independentemente
2. **Testabilidade** - Módulos podem ser testados isoladamente
3. **Reusabilidade** - Módulos podem ser reaproveitados
4. **Clareza** - Responsabilidades bem definidas
5. **Escalabilidade** - Fácil adicionar novos módulos
6. **Colaboração** - Vários desenvolvedores podem trabalhar em módulos diferentes

---

**Estrutura criada para máxima modularidade e facilidade de manutenção** 🚀
