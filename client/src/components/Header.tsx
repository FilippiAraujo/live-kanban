// ========================================
// Header Component
// ========================================

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Kanban, Clock, Trash2, Settings } from 'lucide-react';
import { useBoard } from '@/contexts/BoardContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface RecentProject {
  path: string;
  name: string;
  lastAccessed: string;
}

export function Header() {
  const { loadProject, loading, boardData } = useBoard();
  const [projectPath, setProjectPath] = useState('');
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [showRecents, setShowRecents] = useState(false);
  const [settingUp, setSettingUp] = useState(false);

  useEffect(() => {
    const savedPath = localStorage.getItem('lastProjectPath');
    if (savedPath) {
      setProjectPath(savedPath);
    }
    loadRecentProjects();
  }, []);

  const loadRecentProjects = async () => {
    const projects = await api.getRecentProjects();
    setRecentProjects(projects);
  };

  const handleRemoveRecent = async (projectPath: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique abra o projeto
    try {
      await api.removeRecentProject(projectPath);
      await loadRecentProjects();
    } catch (err) {
      console.error('Erro ao remover projeto:', err);
    }
  };

  const handleLoad = async (pathToLoad?: string) => {
    const finalPath = pathToLoad || projectPath;

    if (!finalPath.trim()) {
      alert('Por favor, insira o caminho do projeto');
      return;
    }

    try {
      const data = await loadProject(finalPath);
      // Salva nos projetos recentes usando o path REAL retornado pelo backend
      await api.addRecentProject(data.projectPath);
      await loadRecentProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoad();
    }
  };

  const handleSetupProject = async () => {
    if (!projectPath.trim()) {
      toast.error('Insira o caminho do projeto primeiro');
      return;
    }

    setSettingUp(true);
    try {
      const result = await api.setupProject(projectPath);
      toast.success(`✅ ${result.message}`);
      toast.info(`Arquivos criados: ${result.files.join(', ')}`);

      // Carrega o projeto após criar a estrutura
      setTimeout(() => {
        handleLoad();
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar estrutura');
    } finally {
      setSettingUp(false);
    }
  };

  // Verifica se o projeto atual não tem estrutura kanban-live
  const needsSetup = boardData && boardData.status.includes('(Arquivo não encontrado)');

  return (
    <Card className="p-6 mb-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Kanban className="h-6 w-6" />
        Live Kanban
      </h1>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Cole o caminho do projeto (ex: /Users/seu-nome/projeto)"
          value={projectPath}
          onChange={(e) => setProjectPath(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />

        {recentProjects.length > 0 && (
          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowRecents(!showRecents)}
            >
              <Clock className="h-4 w-4" />
              Recentes ({recentProjects.length})
            </Button>

            {showRecents && (
              <div className="absolute right-0 mt-2 w-96 bg-background border rounded-lg shadow-lg z-50">
                <div className="p-2 border-b">
                  <h3 className="text-sm font-semibold">Projetos Recentes</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recentProjects.map((project) => (
                    <div
                      key={project.path}
                      className="flex items-start gap-2 p-3 hover:bg-accent transition-colors group"
                    >
                      <button
                        onClick={() => {
                          setProjectPath(project.path);
                          handleLoad(project.path);
                          setShowRecents(false);
                        }}
                        className="flex-1 text-left"
                      >
                        <div className="font-medium text-sm">{project.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {project.path}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(project.lastAccessed).toLocaleDateString('pt-BR')}
                        </div>
                      </button>
                      <button
                        onClick={(e) => handleRemoveRecent(project.path, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                        title="Remover dos recentes"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Button onClick={() => handleLoad()} disabled={loading}>
          {loading ? 'Carregando...' : 'Carregar Projeto'}
        </Button>

        {needsSetup && (
          <Button
            variant="default"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={handleSetupProject}
            disabled={settingUp}
          >
            <Settings className="h-4 w-4" />
            {settingUp ? 'Criando...' : 'Setup Projeto'}
          </Button>
        )}
      </div>

      {/* Overlay para fechar o dropdown ao clicar fora */}
      {showRecents && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowRecents(false)}
        />
      )}
    </Card>
  );
}
