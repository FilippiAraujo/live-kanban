// ========================================
// AI Task Creator Dialog - Chat conversacional pra criar tasks
// ========================================

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
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
        content: 'Olá! 👋 Vou te ajudar a criar uma task bem estruturada. O que você quer implementar?'
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

      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
      setConversationHistory(response.conversationHistory);
    } catch (error) {
      toast.error('Erro no chat', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, houve um erro. Pode tentar novamente?'
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
      setCreatedTask(task);
      setIsFinalized(true);

      toast.success('✨ Task criada com sucesso!', {
        description: 'Revise os detalhes e confirme'
      });
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
      toast.success('🎉 Task adicionada ao kanban!');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Criar Task com IA
          </DialogTitle>
          <DialogDescription>
            Converse com o agente para criar uma task bem estruturada
          </DialogDescription>
        </DialogHeader>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 min-h-[300px] max-h-[400px]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-[80%] p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </Card>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-[80%] p-3 bg-muted">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Pensando...</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preview da Task Criada */}
        {isFinalized && createdTask && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-2">Task Criada:</h4>
                <p className="text-sm font-medium mb-1">{createdTask.descricao}</p>
                {createdTask.detalhes && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {createdTask.detalhes}
                  </p>
                )}
                {createdTask.todos && createdTask.todos.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {createdTask.todos.length} to-dos criados
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Input Area */}
        {!isFinalized && (
          <div className="flex gap-2 pt-2 border-t">
            <Input
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-2 border-t">
          {!isFinalized ? (
            <>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleFinalize}
                disabled={isLoading || messages.length < 3}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Criar Task
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => {
                setIsFinalized(false);
                setCreatedTask(null);
              }}>
                Voltar
              </Button>
              <Button onClick={handleConfirmTask}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirmar e Adicionar
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
