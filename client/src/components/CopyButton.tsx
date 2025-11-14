// ========================================
// Copy Button - Botão para copiar texto com contagem de tokens
// ========================================

import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

interface CopyButtonProps {
  content: string;
  label?: string;
  projectPath?: string; // Path do projeto para incluir no início
}

export function CopyButton({ content, label = 'Copiar', projectPath }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  // Calcula tokens aproximados: 1 token ≈ 4 caracteres
  const calculateTokens = (text: string): number => {
    return Math.ceil(text.length / 4);
  };

  const handleCopy = async () => {
    try {
      // Se tem projectPath, adiciona no início do conteúdo
      const finalContent = projectPath
        ? `Projeto: ${projectPath}\n\n---\n\n${content}`
        : content;

      await navigator.clipboard.writeText(finalContent);
      const tokens = calculateTokens(finalContent);
      setCopied(true);
      toast.success(`Copiado! ~${tokens.toLocaleString('pt-BR')} tokens`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  // Calcula tokens do conteúdo final (com projectPath se existir)
  const finalContent = projectPath
    ? `Projeto: ${projectPath}\n\n---\n\n${content}`
    : content;
  const tokens = calculateTokens(finalContent);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-2"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {label} <span className="text-muted-foreground">~{tokens.toLocaleString('pt-BR')} tokens</span>
    </Button>
  );
}
