import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ViewType } from '../types';

interface NavigationContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  selectedMilestones: string[];
  setSelectedMilestones: React.Dispatch<React.SetStateAction<string[]>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewType>('kanban');
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <NavigationContext.Provider value={{ 
      activeView, 
      setActiveView,
      selectedMilestones,
      setSelectedMilestones,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
