// ========================================
// Task Card Component
// ========================================

import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Sparkles, Loader2, FileText, Plus, Trash2, Check, ListTodo, Clock, Calendar, ChevronDown, ChevronRight, Save, X as XIcon, ClipboardCopy, Rocket, Wand2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { api } from '@/lib/api';
import type { Task, Milestone, TodoItem } from '@/types.js';

interface TaskCardProps {
  task: Task;
  index: number;
  projectPath: string;
  milestones: Milestone[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
}

// Helper: Formata data ISO para exibição amigável
function formatDate(isoDate: string | undefined): string {
  if (!isoDate) return '-';
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  } catch {
    return '-';
  }
}

// Helper: Nome amigável da coluna
function getColumnName(coluna: string): string {
  const names: Record<string, string> = {
    backlog: 'Backlog',
    todo: 'To Do',
    doing: 'Doing',
    done: 'Done'
  };
  return names[coluna] || coluna;
}

export function TaskCard({ task, index, projectPath, milestones, onUpdateTask, onDeleteTask }: TaskCardProps) {
  // Encontra o milestone da task
  const taskMilestone = milestones.find(m => m.id === task.milestone);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [description, setDescription] = useState(task.descricao);
  const [isDeleting, setIsDeleting] = useState(false);
  const [detalhes, setDetalhes] = useState(task.detalhes || '');
  const [selectedMilestone, setSelectedMilestone] = useState(task.milestone || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>(task.todos || []);
  const [newTodoText, setNewTodoText] = useState('');
  const [resultado, setResultado] = useState(task.resultado || '');
  const [isResultadoOpen, setIsResultadoOpen] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isEnrichingTask, setIsEnrichingTask] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (description.trim() && description !== task.descricao) {
      onUpdateTask(task.id, { descricao: description.trim() });
    } else {
      setDescription(task.descricao);
    }
  };

  // Verifica se há mudanças não salvas
  const hasUnsavedChanges = () => {
    if (detalhes !== (task.detalhes || '')) return true;
    if (resultado !== (task.resultado || '')) return true;
    if (selectedMilestone !== (task.milestone || '')) return true;
    const todosChanged = JSON.stringify(todos) !== JSON.stringify(task.todos || []);
    if (todosChanged) return true;
    return false;
  };

  const handleSaveDetails = () => {
    const updates: Partial<Task> = {};

    if (detalhes !== task.detalhes) {
      updates.detalhes = detalhes;
    }

    if (resultado !== task.resultado) {
      updates.resultado = resultado || undefined;
    }

    if (selectedMilestone !== task.milestone) {
      updates.milestone = selectedMilestone || undefined;
    }

    // Compara arrays de todos
    const todosChanged = JSON.stringify(todos) !== JSON.stringify(task.todos || []);
    if (todosChanged) {
      updates.todos = todos.length > 0 ? todos : undefined;
    }

    if (Object.keys(updates).length > 0) {
      onUpdateTask(task.id, updates);
      toast.success('Task atualizada!');
    }

    setIsDialogOpen(false);
    setIsEditingDetails(false);
  };

  const handleCloseDialog = () => {
    if (hasUnsavedChanges()) {
      toast.warning('Você tem alterações não salvas!', {
        description: 'Clique em Salvar para não perder as mudanças.'
      });
      return;
    }
    setIsDialogOpen(false);
    setIsEditingDetails(false);
  };

  const handleCancelDialog = () => {
    // Reseta os valores
    setDetalhes(task.detalhes || '');
    setResultado(task.resultado || '');
    setSelectedMilestone(task.milestone || '');
    setTodos(task.todos || []);
    setIsDialogOpen(false);
    setIsEditingDetails(false);
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    const newTodo: TodoItem = {
      id: `td${Date.now().toString().slice(-4)}`,
      texto: newTodoText.trim(),
      concluido: false
    };

    setTodos([...todos, newTodo]);
    setNewTodoText('');
  };

  const handleToggleTodo = (todoId: string) => {
    setTodos(todos.map(todo =>
      todo.id === todoId ? { ...todo, concluido: !todo.concluido } : todo
    ));
  };

  const handleDeleteTodo = (todoId: string) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setDescription(task.descricao);
      setIsEditing(false);
    }
  };

  const handleCopyPath = async () => {
    try {
      const path = `${projectPath}/tasks.json#${task.id}`;
      await navigator.clipboard.writeText(path);
      toast.success('Path copiado!', {
        description: path,
        duration: 2000,
      });
    } catch (error) {
      toast.error('Erro ao copiar path');
    }
  };

  const handleCopyFullContext = async () => {
    try {
      // Busca o contexto completo do projeto
      const boardData = await api.loadBoard(projectPath);

      // Encontra o milestone da task
      const milestone = milestones.find(m => m.id === task.milestone);

      // Monta o template completo
      const template = `# 📋 Task: ${task.descricao}

**Path da Task:** \`${projectPath}/tasks.json#${task.id}\`

---

## 📦 Contexto do Projeto

**Projeto:** ${projectPath}

### Status Atual
${boardData.status}

---

### Contexto Técnico
${boardData.projetoContext}

---

## 🎯 Detalhes da Task

**ID:** ${task.id}
**Milestone:** ${milestone ? `${milestone.titulo} (${milestone.id})` : 'Sem milestone'}
**Status:** ${task.milestone ? 'Em andamento' : 'Pendente'}
${task.dataCriacao ? `**Data de Criação:** ${formatDate(task.dataCriacao)}` : ''}
${task.dataInicio ? `**Data de Início:** ${formatDate(task.dataInicio)}` : ''}
${task.dataFinalizacao ? `**Data de Finalização:** ${formatDate(task.dataFinalizacao)}` : ''}

### Descrição
${task.descricao}

${task.detalhes ? `### Detalhes
${task.detalhes}` : ''}

${task.todos && task.todos.length > 0 ? `### To-Dos (${task.todos.filter(t => t.concluido).length}/${task.todos.length} concluídos)
${task.todos.map(todo => `- [${todo.concluido ? 'x' : ' '}] ${todo.texto}`).join('\n')}` : ''}

${task.resultado ? `### Resultado Anterior
${task.resultado}` : ''}

---

## ✅ Instruções ao Finalizar

Ao concluir esta task, você deve:

1. **Marcar a task como Done:**
   - Mova o card para a coluna "Done" no Kanban
   - Isso atualiza automaticamente a \`dataFinalizacao\` e adiciona entrada na timeline

2. **Atualizar o campo "Resultado":**
   - Abra o modal de detalhes da task
   - Preencha a seção "Resultado" com:
     - ✅ O que foi feito
     - 📁 Arquivos criados/modificados
     - 🔧 Tecnologias/bibliotecas instaladas (se houver)
     - 🎯 Problemas resolvidos
     - 📝 Observações importantes

3. **Criar commit Git (se aplicável):**
   - Use o formato: \`git commit -m "[${task.id}] Sua mensagem"\`
   - Exemplo: \`git commit -m "[${task.id}] Implementa timeline de tasks"\`
   - Isso vincula o commit à task para rastreabilidade

4. **Atualizar contexto do projeto (opcional):**
   - Se a task adiciona algo importante ao projeto, atualize:
     - \`status.md\` - Status atual e progresso
     - \`projeto-context.md\` - Stack técnica ou arquitetura (se mudou)
     - \`llm-guide.md\` - Regras para LLMs (se necessário)

---

## 📚 Recursos

- **Guia LLM completo:** Use o botão "Copiar" na aba "Guia LLM" para ter todas as regras
- **Tasks.json:** \`${projectPath}/tasks.json\`
- **Documentação:** Veja as abas "Objetivo & Status" e "Guia LLM" no app

---

**Gerado automaticamente pelo Live Kanban** 🚀
`;

      await navigator.clipboard.writeText(template);

      // Calcula tokens aproximados (1 token ≈ 4 caracteres)
      const approxTokens = Math.ceil(template.length / 4);
      const formattedTokens = approxTokens.toLocaleString('pt-BR');

      toast.success('Contexto completo copiado!', {
        description: `Task com contexto do projeto (~${formattedTokens} tokens)`,
        duration: 3000,
      });
    } catch (error) {
      // Fallback para path simples se der erro
      const path = `${projectPath}/tasks.json#${task.id}`;
      await navigator.clipboard.writeText(path);
      toast.warning('Path copiado (sem contexto)', {
        description: 'Erro ao buscar contexto completo',
        duration: 2000,
      });
    }
  };

  const handleEnhanceTask = async () => {
    setIsEnhancing(true);
    try {
      const enhancedDescription = await api.enhanceTask(task.descricao);
      onUpdateTask(task.id, { descricao: enhancedDescription });
      setDescription(enhancedDescription);
      toast.success('Task melhorada com sucesso! ✨');
    } catch (error) {
      toast.error('Erro ao melhorar task', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // NOVOS HANDLERS

  // Gera prompt completo pra continuar task
  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      const prompt = await api.generatePrompt(projectPath, task.id);
      await navigator.clipboard.writeText(prompt);
      toast.success('🚀 Prompt copiado!', {
        description: 'Cole no Claude/ChatGPT pra continuar essa task'
      });
    } catch (error) {
      toast.error('Erro ao gerar prompt', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  // Enriquece task existente (descrição, detalhes, to-dos, milestone)
  const handleEnrichTask = async () => {
    setIsEnrichingTask(true);
    try {
      const enriched = await api.enrichTask(projectPath, task.id);

      // Gera IDs pra novos to-dos
      const todosWithIds = enriched.todos?.map(t => ({
        id: `td${Date.now().toString().slice(-4)}${Math.random().toString().slice(2, 6)}`,
        texto: t.texto,
        concluido: false
      })) || [];

      onUpdateTask(task.id, {
        descricao: enriched.descricao,
        detalhes: enriched.detalhes,
        todos: todosWithIds,
        milestone: enriched.milestone
      });

      // Atualiza estados locais
      setDescription(enriched.descricao);
      setDetalhes(enriched.detalhes || '');
      setTodos(todosWithIds);
      setSelectedMilestone(enriched.milestone || '');

      toast.success('✨ Task enriquecida com sucesso!', {
        description: 'Descrição, detalhes e to-dos foram melhorados'
      });
    } catch (error) {
      toast.error('Erro ao enriquecer task', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsEnrichingTask(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteTask(task.id);
      toast.success('Task excluída com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir task', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isAnyEditing = isEditing || isEditingDetails;

  // Calcula progresso dos to-dos
  const totalTodos = task.todos?.length || 0;
  const completedTodos = task.todos?.filter(t => t.concluido).length || 0;
  const hasTodos = totalTodos > 0;

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={isAnyEditing}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 transition-colors group ${
            snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:border-primary'
          } ${!isAnyEditing ? 'cursor-move' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center gap-1 shrink-0">
                <div className="text-xs text-muted-foreground font-mono">
                  #{task.id}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      title="Excluir task"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Task?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a task "{task.descricao}"?
                        <br /><br />
                        Esta ação <strong>não pode ser desfeita</strong>. A task será permanentemente removida.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                {taskMilestone && (
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs truncate max-w-[120px]"
                    style={{
                      backgroundColor: `${taskMilestone.cor}20`,
                      color: taskMilestone.cor,
                      border: `1px solid ${taskMilestone.cor}40`
                    }}
                    title={taskMilestone.titulo}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: taskMilestone.cor }}
                    />
                    <span className="truncate">{taskMilestone.titulo}</span>
                  </div>
                )}
                {hasTodos && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">
                    <ListTodo className="h-3 w-3" />
                    <span className="font-medium">{completedTodos}/{totalTodos}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full text-sm border-none outline-none focus:ring-2 focus:ring-primary rounded px-1 mb-2"
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          ) : (
            <div
              className="text-sm mb-2 font-medium line-clamp-3 break-words overflow-hidden text-ellipsis"
              title={task.descricao}
              onDoubleClick={handleDoubleClick}
            >
              {task.descricao}
            </div>
          )}

          <div className="mt-2 pt-2 border-t flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              {(task.detalhes || hasTodos) ? (
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-primary truncate"
                  >
                    Ver detalhes
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsDialogOpen(true);
                    setIsEditingDetails(true);
                  }}
                  className="h-6 text-xs px-2 -ml-2 text-muted-foreground hover:text-primary"
                >
                  + Adicionar detalhes
                </Button>
              )}
            </div>

            <div className="flex gap-0.5 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGeneratePrompt}
                disabled={isGeneratingPrompt}
                className="h-6 w-6 p-0 cursor-pointer text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                title="Gerar prompt pra continuar task"
              >
                {isGeneratingPrompt ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Rocket className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEnrichTask}
                disabled={isEnrichingTask}
                className="h-6 w-6 p-0 cursor-pointer text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                title="Enriquecer task com contexto do projeto"
              >
                {isEnrichingTask ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Wand2 className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEnhanceTask}
                disabled={isEnhancing}
                className="h-6 w-6 p-0 cursor-pointer hover:bg-muted"
                title="Melhorar descrição (rápido)"
              >
                {isEnhancing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPath}
                className="h-6 w-6 p-0 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Copiar path da task"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyFullContext}
                className="h-6 w-6 p-0 cursor-pointer hover:bg-muted"
                title="Copiar contexto completo da task"
              >
                <ClipboardCopy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0" hideCloseButton>
              <DialogHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <DialogTitle className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        #{task.id}
                      </span>
                      <span>{task.descricao}</span>
                    </DialogTitle>
                    <DialogDescription>
                      O que está sendo feito e como
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelDialog}
                      className="h-8 w-8 p-0"
                      title="Cancelar (ESC)"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSaveDetails}
                      className="h-8 px-3 gap-1"
                      title="Salvar alterações"
                    >
                      <Save className="h-4 w-4" />
                      <span className="text-xs">Salvar</span>
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 px-6 py-4 overflow-y-auto flex-1">
                {/* Seletor de Milestone */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Milestone
                  </label>
                  <select
                    value={selectedMilestone}
                    onChange={(e) => setSelectedMilestone(e.target.value)}
                    className="w-full text-sm border rounded p-2 focus:ring-2 focus:ring-primary bg-background"
                  >
                    <option value="">Nenhum milestone</option>
                    {milestones.map(milestone => (
                      <option key={milestone.id} value={milestone.id}>
                        {milestone.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Detalhes */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Detalhes
                  </label>
                  <textarea
                    value={detalhes}
                    onChange={(e) => setDetalhes(e.target.value)}
                    className="w-full text-sm border rounded p-3 focus:ring-2 focus:ring-primary min-h-[200px] bg-background"
                    placeholder="Descreva o que está sendo feito e como..."
                    autoFocus={!task.detalhes}
                  />
                </div>

                {/* To-dos (Checklist) */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    To-dos
                  </label>
                  <div className="space-y-2">
                    {/* Lista de to-dos existentes */}
                    {todos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-2 group p-2 rounded hover:bg-muted/50"
                      >
                        <button
                          onClick={() => handleToggleTodo(todo.id)}
                          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            todo.concluido
                              ? 'bg-green-500 border-green-500'
                              : 'border-muted-foreground hover:border-primary'
                          }`}
                        >
                          {todo.concluido && <Check className="h-3 w-3 text-white" />}
                        </button>
                        <span
                          className={`flex-1 text-sm ${
                            todo.concluido
                              ? 'line-through text-muted-foreground'
                              : ''
                          }`}
                        >
                          {todo.texto}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}

                    {/* Input para adicionar novo to-do */}
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTodo();
                          }
                        }}
                        placeholder="Adicionar novo to-do..."
                        className="flex-1 text-sm border rounded px-3 py-2 focus:ring-2 focus:ring-primary bg-background"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddTodo}
                        disabled={!newTodoText.trim()}
                        className="h-auto px-3"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Resultado (Collapse) */}
                <Collapsible open={isResultadoOpen} onOpenChange={setIsResultadoOpen} className="border-t pt-4">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                    >
                      <label className="text-sm font-medium cursor-pointer">
                        O que foi feito (Resultado)
                      </label>
                      {isResultadoOpen ? (
                        <ChevronDown className="h-4 w-4 transition-transform" />
                      ) : (
                        <ChevronRight className="h-4 w-4 transition-transform" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <textarea
                      value={resultado}
                      onChange={(e) => setResultado(e.target.value)}
                      className="w-full text-sm border rounded p-3 focus:ring-2 focus:ring-primary min-h-[150px] bg-background"
                      placeholder="Preencha quando finalizar a task...&#10;&#10;Exemplo:&#10;✅ Sistema implementado&#10;✅ Testes passando&#10;&#10;Arquivos modificados:&#10;- backend/auth.js&#10;- client/src/lib/api.ts"
                    />
                  </CollapsibleContent>
                </Collapsible>

                {/* Timeline e Datas */}
                {(task.dataCriacao || task.dataInicio || task.dataFinalizacao || task.timeline) && (
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Histórico de Movimentações
                    </label>

                    {/* Datas Importantes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {task.dataCriacao && (
                        <div className="flex items-start gap-2 text-xs">
                          <Calendar className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-muted-foreground">Criada em</div>
                            <div className="text-foreground">{formatDate(task.dataCriacao)}</div>
                          </div>
                        </div>
                      )}
                      {task.dataInicio && (
                        <div className="flex items-start gap-2 text-xs">
                          <Calendar className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-muted-foreground">Iniciada em</div>
                            <div className="text-foreground">{formatDate(task.dataInicio)}</div>
                          </div>
                        </div>
                      )}
                      {task.dataFinalizacao && (
                        <div className="flex items-start gap-2 text-xs">
                          <Calendar className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-muted-foreground">Finalizada em</div>
                            <div className="text-foreground">{formatDate(task.dataFinalizacao)}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timeline de Movimentações */}
                    {task.timeline && task.timeline.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Movimentações ({task.timeline.length})
                        </div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {task.timeline.map((event, index) => (
                            <div
                              key={`${event.coluna}-${event.timestamp}-${index}`}
                              className="flex items-start gap-3 text-xs p-2 rounded bg-muted/30"
                            >
                              <div className="flex-shrink-0 w-1 h-1 rounded-full bg-primary mt-1.5" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">
                                  {getColumnName(event.coluna)}
                                </div>
                                <div className="text-muted-foreground">
                                  {formatDate(event.timestamp)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      )}
    </Draggable>
  );
}
