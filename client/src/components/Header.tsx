// ========================================
// Header Component
// ========================================

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Kanban } from 'lucide-react';
import { useBoard } from '@/contexts/BoardContext';

export function Header() {
  const { loadProject, loading } = useBoard();
  const [projectPath, setProjectPath] = useState('');

  useEffect(() => {
    const savedPath = localStorage.getItem('lastProjectPath');
    if (savedPath) {
      setProjectPath(savedPath);
    }
  }, []);

  const handleLoad = async () => {
    if (!projectPath.trim()) {
      alert('Por favor, insira o caminho do projeto');
      return;
    }

    try {
      await loadProject(projectPath);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoad();
    }
  };

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
        <Button onClick={handleLoad} disabled={loading}>
          {loading ? 'Carregando...' : 'Carregar Projeto'}
        </Button>
      </div>
    </Card>
  );
}
