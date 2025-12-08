import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Calendar } from 'lucide-react';
import { MarkdownViewer } from '@/components/MarkdownViewer';

interface TaskPreviewProps {
  task: {
    descricao?: string;
    detalhes?: string;
    milestone?: string;
    todos?: { texto: string }[];
  };
  className?: string;
}

export function TaskPreview({ task, className }: TaskPreviewProps) {
  if (!task) return null;

  return (
    <Card className={`border-2 border-primary/20 bg-muted/30 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Preview da Task
            </span>
            <CardTitle className="text-lg font-semibold leading-tight">
              {task.descricao || 'Sem descrição'}
            </CardTitle>
          </div>
          {task.milestone && (
            <Badge variant="outline" className="shrink-0">
              <Calendar className="w-3 h-3 mr-1" />
              {task.milestone}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detalhes */}
        {task.detalhes && (
          <div className="text-sm text-muted-foreground bg-background p-3 rounded-md border">
            <MarkdownViewer content={task.detalhes} />
          </div>
        )}

        {/* To-dos */}
        {task.todos && task.todos.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Checklist Sugerido
            </span>
            <ul className="space-y-2">
              {task.todos.map((todo, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{todo.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
