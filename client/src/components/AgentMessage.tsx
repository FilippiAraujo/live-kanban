import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Bot, User, Wrench } from 'lucide-react';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { TaskPreview } from '@/components/TaskPreview';

interface AgentMessageProps {
  role: 'user' | 'assistant';
  content: string;
  steps?: Array<{ type: string; tool: string; args: any }>;
}

export function AgentMessage({ role, content, steps }: AgentMessageProps) {
  const [showSteps, setShowSteps] = useState(false);
  const isAssistant = role === 'assistant';

  // Tenta extrair JSON de task do conteúdo (para preview inline se o backend mandar)
  // O backend atual manda separado, mas isso prepara o terreno
  const extractTask = (text: string) => {
    try {
      // Procura bloco de código JSON
      const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.descricao) return parsed;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const taskPreview = extractTask(content);
  
  // Se tiver preview, remove o bloco JSON do texto para não duplicar
  const displayContent = taskPreview 
    ? content.replace(/```json\s*[\s\S]*?```/, '') 
    : content;

  return (
    <div className={`flex gap-3 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
      <Avatar className="h-8 w-8 shrink-0">
        {isAssistant ? (
          <>
            <AvatarImage src="/bot-avatar.png" />
            <AvatarFallback className="bg-purple-100 text-purple-600">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/user-avatar.png" />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={`flex flex-col gap-2 max-w-[85%] ${isAssistant ? 'items-start' : 'items-end'}`}>
        {/* Tool Steps (Collapsible) */}
        {isAssistant && steps && steps.length > 0 && (
          <div className="flex flex-col items-start">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs text-muted-foreground hover:bg-muted"
              onClick={() => setShowSteps(!showSteps)}
            >
              <Wrench className="h-3 w-3 mr-1.5" />
              {steps.length} ferramenta{steps.length !== 1 && 's'} usada{steps.length !== 1 && 's'}
              {showSteps ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
            
            {showSteps && (
              <div className="mt-1 ml-2 space-y-1 border-l-2 border-muted pl-2 py-1">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                    <span className="text-purple-600 font-semibold">{step.tool}</span>
                    <span className="truncate max-w-[200px] opacity-70">
                      {JSON.stringify(step.args).replace(/^\{|\}$/g, '')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <Card className={`p-4 shadow-sm ${
          isAssistant 
            ? 'bg-background border-border' 
            : 'bg-primary text-primary-foreground'
        }`}>
          {isAssistant ? (
            <MarkdownViewer content={displayContent} className="text-sm" />
          ) : (
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          )}
        </Card>

        {/* Task Preview (se detectado no texto) */}
        {isAssistant && taskPreview && (
          <TaskPreview task={taskPreview} className="w-full mt-2" />
        )}
      </div>
    </div>
  );
}
