# 📋 Live Kanban - Visualizador Local de Projetos

Uma ferramenta simples e eficiente para visualizar e gerenciar projetos através de um quadro Kanban em localhost.

## 🎯 O Que Faz

Live Kanban lê 4 arquivos específicos de qualquer pasta de projeto no seu Mac e exibe:
- **Kanban Board**: Visualização com 3 colunas (To Do, Doing, Done) com drag-and-drop
- **Objetivo & Status**: Metadados do projeto com edição inline
- **Guia LLM**: Instruções para IAs auxiliarem no gerenciamento
- **Live Reload**: Atualização automática quando arquivos são modificados (polling a cada 2s)

## 🚀 Como Usar

### 1. Instalação

```bash
npm install
```

### 2. Iniciar o Servidor

```bash
npm start
```

O servidor rodará em `http://localhost:3000`

### 3. Preparar Seu Projeto

Crie 4 arquivos na raiz do seu projeto:

- **`objetivo.md`**: Objetivo final e definição de pronto
- **`status.md`**: Status atual do projeto
- **`tasks.json`**: Quadro Kanban (formato específico)
- **`llm-guide.md`**: Guia para IAs interagirem com os arquivos

### 4. Carregar Projeto

1. Abra `http://localhost:3000` no navegador
2. Cole o caminho absoluto do seu projeto
3. Clique em "Carregar Projeto"

## 📁 Estrutura dos Arquivos

### tasks.json (Schema)

```json
{
  "todo": [
    { "id": "t1001", "descricao": "Tarefa a fazer" }
  ],
  "doing": [
    { "id": "t1002", "descricao": "Tarefa em progresso" }
  ],
  "done": [
    { "id": "t1003", "descricao": "Tarefa concluída" }
  ]
}
```

### objetivo.md e status.md

Use Markdown livre para descrever o objetivo e status do projeto.

### llm-guide.md

Veja o exemplo em `example-project/llm-guide.md` para um template completo.

## 🧩 Arquitetura (Frontend Modular)

O código JavaScript está organizado em módulos independentes:

- **API**: Comunicação com o backend
- **MarkdownParser**: Conversão de Markdown para HTML
- **State**: Gerenciamento de estado global
- **UI**: Manipulação da interface
- **DragDrop**: Lógica de drag-and-drop
- **App**: Controller principal

## 🛠️ Stack Técnica

- **Backend**: Node.js + Express
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Persistência**: Arquivos locais (.md e .json)

## 📦 Exemplo de Projeto

Um projeto de exemplo está incluído em `example-project/` com todos os 4 arquivos configurados.

Para testá-lo:
1. Inicie o servidor: `npm start`
2. Acesse: `http://localhost:3000`
3. Cole o caminho: `/Users/seu-usuario/Documents/Projetos/live-kanban/example-project`
4. Clique em "Carregar Projeto"

## ✨ Funcionalidades

### 🔄 Live Reload (Automático)
A interface atualiza automaticamente a cada 2 segundos quando:
- Uma LLM modifica `tasks.json`, `objetivo.md` ou `status.md`
- Você edita os arquivos manualmente em outro editor
- Novos arquivos são detectados

### ✏️ Edição Inline
- **Tasks**: Duplo clique na descrição para editar
  - Enter para salvar
  - Esc para cancelar
- **Objetivo e Status**: Botão "✏️ Editar" para abrir editor Markdown
  - Editor com preview
  - Salvar ou Cancelar

### 🎯 Drag and Drop
- Arraste tasks entre colunas (To Do → Doing → Done)
- Salvamento automático ao soltar

## 🔧 API Endpoints

### GET /api/board?path={projectPath}
Retorna os 4 arquivos do projeto em JSON.

### POST /api/board/tasks
Salva alterações no `tasks.json`.

### POST /api/board/objetivo
Salva alterações no `objetivo.md`.

### POST /api/board/status
Salva alterações no `status.md`.

**Body exemplo:**
```json
{
  "projectPath": "/caminho/do/projeto",
  "tasks": { "todo": [], "doing": [], "done": [] }
}
```

## 📝 Notas

- O caminho deve ser absoluto (ex: `/Users/nome/projeto`)
- As mudanças são salvas automaticamente
- O último caminho usado é salvo no localStorage
- Live reload detecta mudanças externas a cada 2 segundos

## 🤝 Uso com IAs

O arquivo `llm-guide.md` serve como documentação para IAs (como Claude ou ChatGPT) entenderem como modificar os arquivos do projeto. Isso permite que você peça à IA para:

- Adicionar tarefas ao Kanban
- Mover tarefas entre colunas
- Atualizar o status do projeto
- Modificar o objetivo

Exemplo: *"Claude, adiciona uma tarefa para implementar testes no backend"*

A IA lerá o guia e editará o `tasks.json` seguindo o schema correto.

---

**Desenvolvido para simplicidade e eficiência no gerenciamento de projetos locais.**
