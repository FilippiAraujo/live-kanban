// ========================================
// App Principal - Live Kanban
// ========================================

import { useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { MarkdownViewer } from './components/MarkdownViewer';
import { CopyButton } from './components/CopyButton';
import { MilestoneProgress } from './components/MilestoneProgress';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
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
import { Plus, FolderOpen } from 'lucide-react';
import { BoardProvider, useBoard } from './contexts/BoardContext';
import { api } from './lib/api';
import type { Milestone } from './types.js';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { AppSidebar } from './components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from './components/ui/sidebar';

function AppContent() {
  const { boardData, loadProject } = useBoard();
  const { activeView, selectedMilestones, searchQuery } = useNavigation();
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

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!boardData) return;

    try {
      await api.deleteMilestone(boardData.projectPath, milestoneId);
      await loadProject(boardData.projectPath);
      toast.success('Milestone removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover milestone', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted p-4">
        <div className="flex flex-col h-full bg-background rounded-xl border shadow-sm overflow-hidden">
          <header className="flex h-10 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 sticky top-0 z-10">
            <SidebarTrigger className="-ml-1 h-8 w-8" />
            
            <div className="ml-auto flex items-center gap-2">
              {/* Roadmap Actions */}
              {activeView === 'roadmap' && boardData && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2 h-8 text-xs">
                        <Plus className="h-3.5 w-3.5" />
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
              )}
            </div>
          </header>

          <div className={`flex flex-1 flex-col gap-4 p-4 min-h-0 ${activeView === 'kanban' ? 'overflow-hidden' : 'overflow-auto'}`}>
            
            {!boardData ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-muted/30 p-8 rounded-full mb-4">
                  <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Nenhum projeto carregado</h2>
                <p className="text-muted-foreground max-w-sm mb-6 text-sm">
                  Utilize o menu lateral para selecionar ou carregar um novo projeto.
                </p>
              </div>
            ) : (
              <>
                {activeView === 'kanban' && (
                  <KanbanBoard
                    selectedMilestones={selectedMilestones}
                    searchQuery={searchQuery}
                  />
                )}

                {activeView === 'roadmap' && (
                  <div className="space-y-6">
                    <p className="text-muted-foreground text-sm">
                      Acompanhe o progresso de cada milestone do projeto
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {boardData.milestones.map(milestone => (
                        <MilestoneProgress
                          key={milestone.id}
                          milestone={milestone}
                          tasks={boardData.tasks}
                          onDelete={handleDeleteMilestone}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeView === 'metadata' && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
                )}

                {activeView === 'guide' && (
                  <Card className="p-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Guia LLM</h2>
                      <CopyButton content={boardData.llmGuide} projectPath={boardData.projectPath} />
                    </div>
                    <MarkdownViewer content={boardData.llmGuide} />
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <BoardProvider>
      <NavigationProvider>
        <AppContent />
        <Toaster />
      </NavigationProvider>
    </BoardProvider>
  );
}