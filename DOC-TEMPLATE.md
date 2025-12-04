# 🏗️ Contexto Completo do Projeto - [NOME DO SEU PROJETO]

> **Para LLMs:** Este documento contém TODA informação essencial sobre a arquitetura, stack e funcionamento deste projeto. Leia ANTES de fazer qualquer modificação.

---

## 🚀 TL;DR para LLMs (Leia Primeiro!)

[DESCREVA SEU PROJETO EM 3-4 BULLETS]

Exemplo:
- ✅ Este é um [tipo de aplicação] que [faz o que]
- ✅ Dados vivem em [onde/como] (ex: Postgres, Firebase, JSON files)
- ✅ Stack principal: [React/Vue/Angular] + [Node/Python/Go] + [banco]
- ✅ LLMs podem [o que as IAs podem fazer neste projeto]

**Arquivos-chave:**
- `[caminho/arquivo1]` - [O que faz]
- `[caminho/arquivo2]` - [O que faz]
- `[caminho/arquivo3]` - [O que faz]

**Stack:** [Framework Frontend] + [Linguagem] + [Framework Backend] + [Banco] + [Outros]

---

## 🗺️ Mapa Mental: Como Navegar no Código

Quer adicionar uma feature? Siga este fluxo:

```
1. [PRIMEIRO PASSO - ex: TYPES]
   └─> [O que fazer]
        └─> Exemplo: [código de exemplo]

2. [SEGUNDO PASSO - ex: DATABASE]
   └─> [O que fazer]
        └─> Exemplo: [código de exemplo]

3. [TERCEIRO PASSO - ex: BACKEND]
   └─> [O que fazer]
        └─> Exemplo: [código de exemplo]

4. [QUARTO PASSO - ex: FRONTEND]
   └─> [O que fazer]
        └─> Exemplo: [código de exemplo]
```

**Atalhos úteis:**
- Quer mexer em [feature X]? → `[arquivo Y]` + `[arquivo Z]`
- Quer mexer em [feature A]? → `[arquivo B]`
- Quer adicionar [tipo de coisa]? → `[comando ou padrão]`

---

## 📝 Padrões para Edição de Arquivos

### ✅ SEMPRE Faça Isso:

**Ao editar [arquivo crítico 1]:**
```[linguagem]
// 1. [Passo obrigatório 1]
[código de exemplo]

// 2. [Passo obrigatório 2]
[código de exemplo]

// 3. [Passo obrigatório 3]
[código de exemplo]
```

**Ao editar [arquivo crítico 2]:**
```[linguagem]
// Padrão para este tipo de arquivo
[código de exemplo]
```

### ❌ NUNCA Faça Isso:

```[linguagem]
// ❌ [Erro comum 1 - por que é erro]
[código de exemplo do erro]

// ❌ [Erro comum 2 - por que é erro]
[código de exemplo do erro]

// ❌ [Erro comum 3 - por que é erro]
[código de exemplo do erro]
```

---

## 🐛 Troubleshooting Comum

### [Problema Comum 1]?

**Causa:** [Por que acontece]

**Solução:**
```bash
# [Comandos ou passos para resolver]
```

---

### [Problema Comum 2]?

**Causa:** [Por que acontece]

**Solução:**
```[linguagem]
// [Código ou configuração correta]
```

---

### [Problema Comum 3]?

**Causa:** [Por que acontece]

**Solução:**
```bash
# [Comandos ou passos para resolver]
```

---

## 📦 1. O Que é Este Projeto?

**Nome:** [Nome do Projeto]
**Objetivo:** [1-2 sentenças descrevendo o propósito]

**Proposta de Valor:**
- [Bullet point 1]
- [Bullet point 2]
- [Bullet point 3]

---

## 🛠️ 2. Stack Tecnológica

### Frontend
- **Framework:** [React/Vue/Angular] [versão]
- **Build Tool:** [Vite/Webpack/Parcel] [versão]
- **Styling:** [Tailwind/CSS-in-JS/SCSS]
- **UI Components:** [shadcn/Chakra/MUI]
- **State Management:** [Context/Redux/Zustand/Recoil]

### Backend
- **Runtime:** [Node/Python/Go/Ruby]
- **Framework:** [Express/FastAPI/Gin/Rails]
- **Arquitetura:** [REST/GraphQL/gRPC]
- **Banco de Dados:** [Postgres/MongoDB/Firebase]

### Estrutura de Pastas
```
seu-projeto/
├── [pasta1]/
│   ├── [subpasta]/
│   └── [arquivos importantes]
└── [pasta2]/
    └── [arquivos importantes]
```

---

## 🔄 3. Como Funciona

### Fluxo de Dados

```
1. [Passo 1 do fluxo]
   ↓
2. [Passo 2 do fluxo]
   ↓
3. [Passo 3 do fluxo]
```

### Endpoints API (se aplicável)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `[rota]` | [O que faz] |
| `POST` | `[rota]` | [O que faz] |
| `PUT` | `[rota]` | [O que faz] |
| `DELETE` | `[rota]` | [O que faz] |

---

## 📋 4. Estrutura de Dados

### Schema Principal
```[linguagem]
interface [Nome] {
  campo1: tipo  // Descrição
  campo2: tipo  // Descrição
  campo3?: tipo // Opcional - descrição
}
```

### Exemplo Completo
```json
{
  "campo1": "valor",
  "campo2": 123,
  "campo3": {
    "nested": "valor"
  }
}
```

---

## 🎨 5. Componentes Principais

| Componente/Módulo | Responsabilidade | Localização |
|-------------------|------------------|-------------|
| `[Nome]` | [O que faz] | `[caminho]` |
| `[Nome]` | [O que faz] | `[caminho]` |
| `[Nome]` | [O que faz] | `[caminho]` |

---

## 🔑 6. Regras de Negócio

### [Categoria 1]

1. **[Regra 1]:** [Explicação]
2. **[Regra 2]:** [Explicação]
3. **[Regra 3]:** [Explicação]

### [Categoria 2]

- **[Ação X]:** [Como funciona]
- **[Ação Y]:** [Como funciona]
- **[Ação Z]:** [Como funciona]

---

## 🚨 7. Pontos de Atenção

### Para LLMs que Vão Modificar Código

⚠️ **[Tecnologia X]:** [Versão específica com peculiaridades]
- ✅ [O que fazer]
- ❌ [O que NÃO fazer]

⚠️ **[Padrão Importante]:**
- ✅ [Jeito certo]
- ❌ [Jeito errado]

---

## 📝 8. Padrões de Código

### [Linguagem Principal]
```[linguagem]
// ✅ Padrão correto
[código de exemplo]

// ❌ Não fazer assim
[código de exemplo]
```

### Naming Conventions
```
[Tipo]:        [Padrão]     (Exemplo)
[Tipo]:        [Padrão]     (Exemplo)
```

---

## 🎯 9. Decisões Arquiteturais

### Por que [Tecnologia/Padrão X]?
- ✅ [Motivo 1]
- ✅ [Motivo 2]
- ⚠️ [Limitação conhecida]

### Por que [Tecnologia/Padrão Y]?
- ✅ [Motivo 1]
- ✅ [Motivo 2]

---

## 🔄 10. Próximos Passos (Roadmap)

### ✅ Implementado
1. [Feature implementada 1]
2. [Feature implementada 2]

### ⏳ Planejado
1. [Feature planejada 1]
2. [Feature planejada 2]

---

## 📚 11. Recursos Adicionais

### Documentação Oficial
- **[Tecnologia 1]:** [link]
- **[Tecnologia 2]:** [link]

### Ferramentas de Desenvolvimento
```bash
# [Comando útil 1]
[comando]

# [Comando útil 2]
[comando]
```

---

## 🗂️ 12. Arquivos de Configuração

| Arquivo | Propósito | Localização |
|---------|-----------|-------------|
| `[config1]` | [O que faz] | `[caminho]` |
| `[config2]` | [O que faz] | `[caminho]` |

---

## ⚙️ 13. Variáveis de Ambiente

```bash
# [Descrição da var]
VAR_NAME=valor

# [Descrição da var]
ANOTHER_VAR=valor
```

---

## ✨ Resumo Final

[2-3 parágrafos resumindo o projeto, stack, e como começar]

**Para começar:**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

---

## 📄 Meta: Sobre Este Template

Este template segue as **boas práticas de documentação LLM-friendly** do [Live Kanban](https://github.com/SEU-USER/live-kanban).

**Princípios:**
- ✅ TL;DR First
- ✅ Mapa Mental Claro
- ✅ Padrões Explícitos (✅ / ❌)
- ✅ Troubleshooting Prático
- ✅ Exemplos de Código Reais

**Como usar:**
1. Copie este arquivo para seu projeto
2. Substitua TODOS os `[PLACEHOLDERS]`
3. Delete seções que não se aplicam
4. Adicione seções específicas do seu domínio
5. Mantenha atualizado a cada feature importante

**Veja exemplo completo em:** `live-kanban/kanban-live/projeto-context.md`
