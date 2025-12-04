// ========================================
// App Principal - Live Kanban
// ========================================

import { useState } from 'react';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { MarkdownViewer } from './components/MarkdownViewer';
import { CopyButton } from './components/CopyButton';
import { MilestoneProgress } from './components/MilestoneProgress';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { Kanban, FileText, BookOpen, Target, Plus } from 'lucide-react';
import { BoardProvider, useBoard } from './contexts/BoardContext';
import { api } from './lib/api';
import type { Milestone } from './types.js';

function AppContent() {
  const { boardData, loadProject } = useBoard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    titulo: '',
    descricao: '',
    cor: '#3b82f6'
  });

  const handleCreateMilestone = async () => {
    if (!newMilestone.titulo.trim() || !boardData) return;

    try {
      const newId = `m${Date.now().toString().slice(-4)}`;
      const milestone: Milestone = {
        id: newId,
        titulo: newMilestone.titulo.trim(),
        descricao: newMilestone.descricao.trim() || undefined,
        cor: newMilestone.cor
      };

      const updatedMilestones = [...boardData.milestones, milestone];
      await api.saveMilestones(boardData.projectPath, updatedMilestones);

      // Recarrega o projeto para atualizar os milestones
      await loadProject(boardData.projectPath);

      toast.success('Milestone criado com sucesso!');
      setNewMilestone({ titulo: '', descricao: '', cor: '#3b82f6' });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao criar milestone', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  if (!boardData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Header />
          <Card className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-3">👋 Bem-vindo ao Live Kanban!</h2>
            <p className="text-muted-foreground mb-2">Cole o caminho do seu projeto acima para começar.</p>
            <p className="text-sm text-muted-foreground">
              O projeto deve conter os arquivos: <code className="bg-muted px-2 py-1 rounded">tasks.json</code>,{' '}
              <code className="bg-muted px-2 py-1 rounded">status.md</code>,{' '}
              <code className="bg-muted px-2 py-1 rounded">projeto-context.md</code> e{' '}
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
            <TabsTrigger value="roadmap" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Roteiro
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

          <TabsContent value="roadmap">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Roteiro de Desenvolvimento</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Novo Milestone
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Milestone</DialogTitle>
                      <DialogDescription>
                        Adicione um novo milestone para organizar suas tasks
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="titulo" className="text-sm font-medium">
                          Título *
                        </label>
                        <Input
                          id="titulo"
                          placeholder="Ex: MVP, Refatoração, etc."
                          value={newMilestone.titulo}
                          onChange={(e) => setNewMilestone({ ...newMilestone, titulo: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="descricao" className="text-sm font-medium">
                          Descrição (opcional)
                        </label>
                        <Textarea
                          id="descricao"
                          placeholder="Descreva o objetivo deste milestone..."
                          value={newMilestone.descricao}
                          onChange={(e) => setNewMilestone({ ...newMilestone, descricao: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="cor" className="text-sm font-medium">
                          Cor
                        </label>
                        <div className="flex gap-2">
                          <Input
                            id="cor"
                            type="color"
                            value={newMilestone.cor}
                            onChange={(e) => setNewMilestone({ ...newMilestone, cor: e.target.value })}
                            className="w-20 h-10 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={newMilestone.cor}
                            onChange={(e) => setNewMilestone({ ...newMilestone, cor: e.target.value })}
                            placeholder="#3b82f6"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateMilestone} disabled={!newMilestone.titulo.trim()}>
                        Criar Milestone
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-muted-foreground mb-6">
                Acompanhe o progresso de cada milestone do projeto
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {boardData.milestones.map(milestone => (
                  <MilestoneProgress
                    key={milestone.id}
                    milestone={milestone}
                    tasks={boardData.tasks}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="metadata">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Status</h2>
                  <CopyButton content={boardData.status} projectPath={boardData.projectPath} />
                </div>
                <MarkdownViewer content={boardData.status} />
              </Card>
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Contexto do Projeto</h2>
                  <CopyButton content={boardData.projetoContext} projectPath={boardData.projectPath} />
                </div>
                <MarkdownViewer content={boardData.projetoContext} />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guide">
            <Card className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Guia LLM</h2>
                <CopyButton content={boardData.llmGuide} projectPath={boardData.projectPath} />
              </div>
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
