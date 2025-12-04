## 🎯 O Que Muda?

Descrição clara e concisa das mudanças.

## 📋 Tipo de Mudança

Selecione o tipo principal:

- [ ] 🐛 Bug fix (mudança que corrige um problema)
- [ ] ✨ Nova feature (mudança que adiciona funcionalidade)
- [ ] 💥 Breaking change (mudança que quebra compatibilidade)
- [ ] 📚 Documentação (mudanças apenas em docs)
- [ ] 🎨 Style (formatação, sem mudança de lógica)
- [ ] ♻️ Refactor (mudança de código sem alterar comportamento)
- [ ] ⚡ Performance (melhoria de performance)
- [ ] 🧪 Tests (adição ou correção de testes)

## 🔗 Issue Relacionada

Fixes #(número da issue)

## 🧪 Como Testar?

Descreva os passos para testar suas mudanças:

1. Clone a branch `git checkout [nome-da-branch]`
2. Instale dependências `npm install`
3. Rode o projeto `npm run dev`
4. Teste fazendo [X, Y, Z]
5. Verifique que [comportamento esperado]

## 📸 Screenshots (se aplicável)

Adicione screenshots mostrando antes/depois (especialmente para mudanças visuais).

**Antes:**
[screenshot ou "N/A"]

**Depois:**
[screenshot ou "N/A"]

## 📝 Checklist

Antes de abrir o PR, verifique:

### Código
- [ ] Testei localmente (frontend + backend)
- [ ] Rodei `npm run build` sem erros
- [ ] Não há console.logs ou debuggers esquecidos
- [ ] Segui os padrões de código do projeto
- [ ] Adicionei comentários em código complexo

### Documentação
- [ ] Atualizei `projeto-context.md` (se adicionei features)
- [ ] Atualizei `llm-guide.md` (se mudei estrutura de dados)
- [ ] Atualizei `CONTRIBUTING.md` (se mudei workflow)
- [ ] Adicionei JSDoc/comentários nos tipos novos

### Git
- [ ] Usei conventional commits (`feat:`, `fix:`, `docs:`, etc)
- [ ] Commit messages são claros e descritivos
- [ ] Branch está atualizada com `main`

### Testes (quando implementados)
- [ ] Adicionei testes para nova funcionalidade
- [ ] Todos os testes passam
- [ ] Cobertura de testes não diminuiu

## 🤔 Questões em Aberto (Opcional)

Há algo que você não tem certeza e gostaria de feedback?

- [ ] [Questão 1]
- [ ] [Questão 2]

## 📚 Referências (Opcional)

Links para documentação, discussões, ou contexto adicional:

- [Link 1]
- [Link 2]

---

**Para Revisores:**

Ao revisar, verifique:
- [ ] Código segue padrões do `CONTRIBUTING.md`
- [ ] Documentação está atualizada
- [ ] Mudanças fazem sentido arquiteturalmente
- [ ] Testei localmente (se possível)
