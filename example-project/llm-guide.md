# 📋 Guia Completo de Interação para LLM

> **Para IAs (Claude, ChatGPT, etc.):** Este documento contém instruções COMPLETAS sobre como você deve gerenciar este projeto através de 3 arquivos. Leia com atenção e siga EXATAMENTE.

---

## 🎯 1. Visão Geral dos Arquivos

Este projeto é gerenciado por **3 arquivos principais**:

| Arquivo | Propósito | Frequência de Edição |
|---------|-----------|---------------------|
| **`objetivo.md`** | Objetivo final do projeto | Raramente (só se o usuário pedir) |
| **`status.md`** | Status atual e progresso | Frequentemente (quando houver atualizações) |
| **`tasks.json`** | Quadro Kanban (To Do, Doing, Done) | Muito frequente (a cada nova tarefa) |

---

## 📝 2. Como Editar Cada Arquivo

### 📄 `objetivo.md`

**O que é:**
Define a visão, missão e "definição de pronto" do projeto.

**Quando editar:**
- ❌ **NÃO edite** a menos que o usuário peça explicitamente
- ✅ **Edite somente** se houver mudança fundamental na direção do projeto

**Como editar:**
Use a ferramenta `Edit` para modificar o conteúdo em Markdown.

**Exemplo:**
```markdown
# Objetivo do Projeto

Criar um sistema de autenticação com login social.

## Definição de Pronto
- ✅ Login com Google funcionando
- ⏳ Login com GitHub em desenvolvimento
```

---

### 📊 `status.md`

**O que é:**
Um relatório de progresso de alto nível sobre o que está acontecendo **agora**.

**Quando editar:**
- ✅ Quando o usuário pedir para "atualizar o status"
- ✅ Quando completar uma etapa importante
- ✅ Quando houver mudanças significativas no projeto

**Como editar:**
Use a ferramenta `Edit` para adicionar ou reescrever seções em Markdown.

**Estrutura recomendada:**
```markdown
# Status Atual

**Última atualização:** YYYY-MM-DD

## O Que Foi Feito
- ✅ Item concluído 1
- ✅ Item concluído 2

## Em Progresso
- ⏳ Item em desenvolvimento

## Próximos Passos
1. Próxima tarefa prioritária
2. Segunda tarefa

## Observações
Notas importantes sobre o progresso.
```

**Exemplo de comando do usuário:**
> "Atualiza o status dizendo que terminei o backend"

**Sua ação:**
```markdown
## O Que Foi Feito
- ✅ Backend implementado com Express
- ✅ Endpoints de API criados e testados
```

---

### 🎯 `tasks.json` (O MAIS IMPORTANTE)

**O que é:**
O quadro Kanban com todas as tarefas do projeto.

**Schema OBRIGATÓRIO:**
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

**REGRAS CRÍTICAS:**
1. ⚠️ **SEMPRE** use a ferramenta `Read` ANTES de editar
2. ⚠️ **SEMPRE** valide que o JSON está correto após editar
3. ⚠️ **NUNCA** deixe vírgulas extras ou faltando
4. ⚠️ **NUNCA** adicione valores `null` ou `undefined`
5. ⚠️ **SEMPRE** gere IDs únicos para novas tarefas

---

## 🔧 3. Operações no `tasks.json`

### ➕ ADICIONAR uma Nova Tarefa

**Comando do usuário:**
> "Adiciona uma tarefa para implementar testes"

**Passo a passo:**
1. Use `Read` para ler `tasks.json` completo
2. Gere um ID único (ex: `"t" + Date.now().toString().slice(-4)`)
3. Use `Edit` para adicionar ao array `todo`

**Exemplo ANTES:**
```json
{
  "todo": [
    { "id": "t1001", "descricao": "Tarefa existente" }
  ],
  "doing": [],
  "done": []
}
```

**Exemplo DEPOIS:**
```json
{
  "todo": [
    { "id": "t1001", "descricao": "Tarefa existente" },
    { "id": "t5678", "descricao": "Implementar testes unitários" }
  ],
  "doing": [],
  "done": []
}
```

---

### 🔀 MOVER uma Tarefa Entre Colunas

**Comando do usuário:**
> "Move a tarefa t1001 para doing"

**Passo a passo:**
1. Use `Read` para ler `tasks.json` completo
2. Encontre a tarefa com `"id": "t1001"` (pode estar em `todo`, `doing` ou `done`)
3. Use `Edit` para:
   - Remover a tarefa do array atual
   - Adicionar a tarefa ao array de destino

**Exemplo ANTES:**
```json
{
  "todo": [
    { "id": "t1001", "descricao": "Implementar login" },
    { "id": "t1002", "descricao": "Criar testes" }
  ],
  "doing": [],
  "done": []
}
```

**Exemplo DEPOIS:**
```json
{
  "todo": [
    { "id": "t1002", "descricao": "Criar testes" }
  ],
  "doing": [
    { "id": "t1001", "descricao": "Implementar login" }
  ],
  "done": []
}
```

---

### ✅ CONCLUIR uma Tarefa

**Comando do usuário:**
> "Marca a tarefa t1001 como concluída"

**Passo a passo:**
1. Use `Read` para ler `tasks.json` completo
2. Encontre a tarefa (geralmente em `doing`)
3. Use `Edit` para movê-la para `done`

---

### ✏️ EDITAR Descrição de uma Tarefa

**Comando do usuário:**
> "Muda a descrição da tarefa t1001 para 'Implementar login com Google'"

**Passo a passo:**
1. Use `Read` para ler `tasks.json` completo
2. Encontre a tarefa com `"id": "t1001"`
3. Use `Edit` para alterar APENAS o campo `"descricao"`

**Exemplo:**
```json
// ANTES
{ "id": "t1001", "descricao": "Implementar login" }

// DEPOIS
{ "id": "t1001", "descricao": "Implementar login com Google" }
```

---

### 🗑️ REMOVER uma Tarefa

**Comando do usuário:**
> "Remove a tarefa t1001"

**Passo a passo:**
1. Use `Read` para ler `tasks.json` completo
2. Encontre a tarefa em qualquer array
3. Use `Edit` para removê-la completamente

⚠️ **IMPORTANTE:** Só remova se o usuário pedir EXPLICITAMENTE. Caso contrário, mova para `done`.

---

## 📋 4. Exemplos Práticos Completos

### Exemplo 1: Adicionar 3 Tarefas

**Comando:**
> "Adiciona 3 tarefas: implementar login, criar dashboard, adicionar notificações"

**Ação:**
```json
{
  "todo": [
    { "id": "t7891", "descricao": "Implementar login" },
    { "id": "t7892", "descricao": "Criar dashboard" },
    { "id": "t7893", "descricao": "Adicionar notificações" }
  ],
  "doing": [],
  "done": []
}
```

---

### Exemplo 2: Mover Tarefa em Progresso

**Comando:**
> "Comecei a trabalhar na tarefa t7891"

**Ação:** Mova de `todo` para `doing`

---

### Exemplo 3: Concluir e Adicionar Nova

**Comando:**
> "Terminei a tarefa t7891 e agora vou criar testes"

**Ação:**
1. Mova t7891 para `done`
2. Adicione nova tarefa "Criar testes" em `todo`

---

## ⚠️ 5. Erros Comuns a EVITAR

### ❌ ERRO 1: JSON Inválido
```json
{
  "todo": [
    { "id": "t1001", "descricao": "Tarefa" }, // ❌ Vírgula extra
  ],
}
```

### ✅ CORRETO:
```json
{
  "todo": [
    { "id": "t1001", "descricao": "Tarefa" }
  ]
}
```

---

### ❌ ERRO 2: IDs Duplicados
```json
{
  "todo": [
    { "id": "t1001", "descricao": "Tarefa 1" },
    { "id": "t1001", "descricao": "Tarefa 2" } // ❌ ID repetido
  ]
}
```

### ✅ CORRETO: IDs únicos sempre

---

### ❌ ERRO 3: Valores Null
```json
{
  "todo": [
    { "id": "t1001", "descricao": "Tarefa" },
    null // ❌ Nunca adicione null
  ]
}
```

---

## 🎯 6. Fluxo de Trabalho Recomendado

```
1. Usuário dá comando
   ↓
2. Você usa Read para ver estado atual
   ↓
3. Você usa Edit para modificar o arquivo
   ↓
4. Você confirma a ação para o usuário
   ↓
5. Usuário recarrega a interface web
```

---

## 💡 7. Dicas para Descrições de Tarefas

| ✅ BOM | ❌ RUIM |
|--------|---------|
| "Implementar endpoint /api/users" | "Fazer coisas no backend" |
| "Corrigir bug no drag-and-drop do Kanban" | "Consertar bug" |
| "Adicionar validação de email no formulário" | "URGENTE!!! FAZER AGORA!!!" |
| "Criar testes para a classe UserService" | "Testes" |

**Regra:** Seja específico, claro e objetivo. A descrição deve deixar claro O QUE fazer.

---

## 🚀 8. Checklist Antes de Editar

Antes de modificar `tasks.json`, certifique-se:

- [ ] Você leu o arquivo completo com `Read`
- [ ] Você entendeu qual operação fazer (adicionar/mover/editar/remover)
- [ ] Você gerou um ID único (se for adicionar)
- [ ] Você validou que o JSON está correto
- [ ] Você não deixou vírgulas extras ou `null` values

---

## 📚 9. Resumo Final

Você é um **assistente de gerenciamento de projetos** que:

1. **Lê** o estado atual dos arquivos
2. **Edita** conforme comandos do usuário
3. **Valida** que tudo está correto
4. **Confirma** as ações realizadas

**Arquivos principais:**
- `objetivo.md` → Edite raramente
- `status.md` → Edite quando houver atualizações
- `tasks.json` → Edite frequentemente (tarefas do Kanban)

**Ferramentas:**
- `Read` → Para ler arquivos
- `Edit` → Para modificar arquivos

**Lembre-se:** SEMPRE valide o JSON e seja preciso nas edições!

---

**✨ Pronto! Agora você sabe EXATAMENTE como gerenciar este projeto. Boa sorte!**

---

## 3. Exemplos de Comandos

### Comando: "Adiciona uma tarefa para implementar testes"
**Ação:**
```json
// Adicione ao array "todo" em tasks.json:
{
  "id": "t5678",
  "descricao": "Implementar testes unitários"
}
```

### Comando: "Move a tarefa t1001 para doing"
**Ação:**
1. Encontre o objeto com `"id": "t1001"` no array `todo`
2. Remova-o de `todo`
3. Adicione-o ao array `doing`

### Comando: "Atualiza o status dizendo que terminei o backend"
**Ação:**
Edite `status.md` adicionando ou atualizando a seção relevante:
```markdown
## O Que Foi Feito
- ✅ Backend implementado e testado
- ...
```

---

## 4. Regras Importantes

1. **Sempre valide o JSON:** Certifique-se de que `tasks.json` seja um JSON válido após qualquer edição.
2. **IDs únicos:** Nunca crie duas tarefas com o mesmo ID.
3. **Não delete tarefas:** A menos que eu peça explicitamente, nunca remova tarefas do JSON. Mova-as para `done` quando concluídas.
4. **Seja conciso:** Nas descrições das tarefas, use frases curtas e objetivas.

---

## 5. Fluxo de Trabalho Típico

1. **Eu te dou um comando** (ex: "adiciona tarefa X")
2. **Você edita o arquivo relevante** (tasks.json, status.md)
3. **Você me mostra o que mudou** (opcional, mas útil)
4. **Eu recarrego a interface** para ver as mudanças

---

## 6. Dicas para Descrições de Tarefas

- ✅ **Bom:** "Implementar endpoint /api/users"
- ✅ **Bom:** "Corrigir bug no drag-and-drop"
- ❌ **Ruim:** "Fazer coisas no backend" (muito vago)
- ❌ **Ruim:** "URGENTE!!!! PRECISA FAZER AGORA!!!!" (sem informação útil)

---

**Resumo:** Você é um assistente que ajuda a gerenciar este projeto editando 3 arquivos simples. Seja preciso, valide o JSON, e sempre confirme que entendeu o comando antes de agir.
