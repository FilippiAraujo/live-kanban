// ========================================
// App Principal - Live Kanban
// ========================================

import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { MarkdownViewer } from './components/MarkdownViewer';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { Kanban, FileText, BookOpen } from 'lucide-react';
import { BoardProvider, useBoard } from './contexts/BoardContext';

function AppContent() {
  const { boardData } = useBoard();

  if (!boardData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Header />
          <Card className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-3">👋 Bem-vindo ao Live Kanban!</h2>
            <p className="text-muted-foreground mb-2">Cole o caminho do seu projeto acima para começar.</p>
            <p className="text-sm text-muted-foreground">
              O projeto deve conter os arquivos: <code className="bg-muted px-2 py-1 rounded">objetivo.md</code>,{' '}
              <code className="bg-muted px-2 py-1 rounded">status.md</code>,{' '}
              <code className="bg-muted px-2 py-1 rounded">tasks.json</code> e{' '}
              <code className="bg-muted px-2 py-1 rounded">llm-guide.md</code>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto">
        <Header />

        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <Kanban className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Objetivo & Status
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Guia LLM
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <KanbanBoard />
          </TabsContent>

          <TabsContent value="metadata">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <MarkdownViewer content={boardData.objetivo} />
              </Card>
              <Card className="p-6">
                <MarkdownViewer content={boardData.status} />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guide">
            <Card className="p-8">
              <MarkdownViewer content={boardData.llmGuide} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BoardProvider>
      <AppContent />
      <Toaster />
    </BoardProvider>
  );
}
