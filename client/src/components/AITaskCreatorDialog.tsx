// ========================================
// AI Task Creator Dialog - Chat conversacional pra criar tasks
// ========================================

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Sparkles, CheckCircle2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { AgentMessage } from '@/components/AgentMessage';
import { TaskPreview } from '@/components/TaskPreview';
import { useBoard } from '@/contexts/BoardContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  steps?: Array<{ type: string; tool: string; args: any }>;
}

interface AITaskCreatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectPath: string;
  onTaskCreated: (task: {
    descricao: string;
    detalhes?: string;
    todos?: Array<{ texto: string }>;
    milestone?: string;
  }) => void;
}

export function AITaskCreatorDialog({
  open,
  onOpenChange,
  projectPath,
  onTaskCreated
}: AITaskCreatorDialogProps) {
  const { selectedMilestone } = useBoard();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [isFinalized, setIsFinalized] = useState(false);
  const [createdTask, setCreatedTask] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll pra última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset ao abrir
  useEffect(() => {
    if (open) {
      setMessages([{
        role: 'assistant',
        content: 'Olá! Sou seu Tech Lead IA. 🤖\n\nMe diga o que precisamos construir, e eu vou explorar o projeto e estruturar a task ideal para você.'
      }]);
      setInput('');
      setConversationHistory([]);
      setIsFinalized(false);
      setCreatedTask(null);
    }
  }, [open]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.chatCreateTask(projectPath, userMessage, conversationHistory);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        steps: response.steps || []
      }]);
      setConversationHistory(response.conversationHistory);
    } catch (error) {
      toast.error('Erro no chat', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, houve um erro ao processar sua mensagem. Pode tentar novamente?'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (conversationHistory.length === 0) {
      toast.error('Nenhuma conversa iniciada');
      return;
    }

    setIsLoading(true);
    try {
      const task = await api.finalizeCreateTask(projectPath, conversationHistory);

      // Adiciona o milestone selecionado à task, se houver
      if (selectedMilestone) {
        task.milestone = selectedMilestone;
      }

      setCreatedTask(task);
      setIsFinalized(true);

      // Adiciona uma mensagem final do assistente com a task
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Pronto! Aqui está a task estruturada com base na nossa conversa. Revise e confirme abaixo. 👇'
      }]);

      toast.success('✨ Task estruturada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar task', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTask = () => {
    if (createdTask) {
      onTaskCreated(createdTask);
      onOpenChange(false);
      toast.success('🎉 Task adicionada ao backlog!');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-muted/20">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Criar Task com IA
          </DialogTitle>
          <DialogDescription>
            Consultor técnico para definição e arquitetura de tarefas
          </DialogDescription>
        </DialogHeader>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/20">
          {messages.map((message, index) => (
            <AgentMessage 
              key={index}
              role={message.role} 
              content={message.content} 
              steps={message.steps} 
            />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm animate-pulse ml-12">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Pensando e explorando o código...</span>
            </div>
          )}
          
          {/* Task Preview na área de chat quando finalizado */}
          {isFinalized && createdTask && (
            <div className="ml-11 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TaskPreview task={createdTask} className="shadow-lg" />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Input Area */}
        <div className="p-4 bg-background border-t space-y-4">
          {!isFinalized ? (
            <>
              <div className="relative">
                <Textarea
                  placeholder="Ex: Adicionar botão de exportar no header..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="min-h-[80px] pr-12 resize-none shadow-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="absolute bottom-3 right-3 h-8 w-8"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                {messages.length >= 3 && (
                  <Button
                    onClick={handleFinalize}
                    disabled={isLoading}
                    variant="secondary"
                    size="sm"
                    className="text-purple-700 bg-purple-100 hover:bg-purple-200"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    Gerar Task Final
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsFinalized(false);
                  setCreatedTask(null);
                  setMessages(prev => [...prev, { role: 'user', content: 'Quero ajustar algumas coisas...' }]);
                }}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Ajustar
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmTask} size="lg" className="px-8">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Confirmar Task
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
