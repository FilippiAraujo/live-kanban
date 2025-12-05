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
import { Plus, Filter, Search, X } from 'lucide-react';
import { BoardProvider, useBoard } from './contexts/BoardContext';
import { api } from './lib/api';
import type { Milestone } from './types.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from './components/ui/dropdown-menu';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { AppSidebar } from './components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Separator } from './components/ui/separator';

function AppContent() {
  const { boardData, loadProject } = useBoard();
  const { activeView } = useNavigation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    titulo: '',
    descricao: '',
    cor: '#3b82f6'
  });
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMilestone = (milestoneId: string) => {
    setSelectedMilestones(prev =>
      prev.includes(milestoneId)
        ? prev.filter(id => id !== milestoneId)
        : [...prev, milestoneId]
    );
  };

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

  const getViewTitle = () => {
    switch (activeView) {
      case 'kanban': return 'Kanban Board';
      case 'roadmap': return 'Roteiro de Desenvolvimento';
      case 'metadata': return 'Objetivo & Status';
      case 'guide': return 'Guia LLM';
      default: return 'Live Kanban';
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="font-semibold">{getViewTitle()}</div>

          <div className="ml-auto flex items-center gap-2">
            {/* Controls for Kanban View */}
            {activeView === 'kanban' && (
              <>
                 {/* Filtro de Milestones */}
              {boardData.milestones.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filtrar</span>
                      {selectedMilestones.length > 0 && (
                        <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          {selectedMilestones.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Milestones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {boardData.milestones.map(milestone => (
                      <DropdownMenuCheckboxItem
                        key={milestone.id}
                        checked={selectedMilestones.includes(milestone.id)}
                        onCheckedChange={() => toggleMilestone(milestone.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: milestone.cor }}
                          />
                          {milestone.titulo}
                        </div>
                      </DropdownMenuCheckboxItem>
                    ))}
                    {selectedMilestones.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedMilestones([])}
                        >
                          Limpar filtros
                        </Button>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Busca */}
              <div className="relative">
                {!isSearchOpen ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSearchOpen(true)}
                    className="gap-2"
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Buscar</span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar tasks..."
                        className="w-48 sm:w-64 pl-8 pr-3 py-1.5 text-sm border rounded focus:ring-2 focus:ring-primary bg-background"
                        autoFocus
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              </>
            )}
            
            {/* Roadmap Actions */}
            {activeView === 'roadmap' && (
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
            )}
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Header />
          
          {activeView === 'kanban' && (
            <KanbanBoard
              selectedMilestones={selectedMilestones}
              searchQuery={searchQuery}
            />
          )}

          {activeView === 'roadmap' && (
            <div className="space-y-6">
              <p className="text-muted-foreground">
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
