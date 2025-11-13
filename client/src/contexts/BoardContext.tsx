// ========================================
// Board Context - Estado global do board
// ========================================

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { BoardData, TasksData } from '@/types.js';
import { api } from '@/lib/api';

interface BoardContextType {
  boardData: BoardData | null;
  loading: boolean;
  error: string | null;
  loadProject: (path: string) => Promise<void>;
  updateTasks: (tasks: TasksData) => Promise<void>;
  updateObjetivo: (content: string) => Promise<void>;
  updateStatus: (content: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live reload - polling a cada 2 segundos
  useEffect(() => {
    if (!boardData?.projectPath) return;

    const interval = setInterval(async () => {
      try {
        const data = await api.loadBoard(boardData.projectPath);

        // Verifica se houve mudanças
        const hasChanges = JSON.stringify(boardData.tasks) !== JSON.stringify(data.tasks) ||
          boardData.objetivo !== data.objetivo ||
          boardData.status !== data.status ||
          boardData.llmGuide !== data.llmGuide;

        if (hasChanges) {
          console.log('🔄 Mudanças detectadas, atualizando...');
          setBoardData(data);
        }
      } catch (err) {
        console.error('Erro no polling:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [boardData]);

  const loadProject = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.loadBoard(path);
      setBoardData(data);
      localStorage.setItem('lastProjectPath', path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTasks = async (tasks: TasksData) => {
    if (!boardData) return;

    try {
      await api.saveTasks(boardData.projectPath, tasks);
      setBoardData({ ...boardData, tasks });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar tasks');
      throw err;
    }
  };

  const updateObjetivo = async (content: string) => {
    if (!boardData) return;

    try {
      await api.saveObjetivo(boardData.projectPath, content);
      setBoardData({ ...boardData, objetivo: content });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar objetivo');
      throw err;
    }
  };

  const updateStatus = async (content: string) => {
    if (!boardData) return;

    try {
      await api.saveStatus(boardData.projectPath, content);
      setBoardData({ ...boardData, status: content });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar status');
      throw err;
    }
  };

  return (
    <BoardContext.Provider
      value={{
        boardData,
        loading,
        error,
        loadProject,
        updateTasks,
        updateObjetivo,
        updateStatus
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within BoardProvider');
  }
  return context;
}
