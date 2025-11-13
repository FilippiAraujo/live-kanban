// ========================================
// Kanban Column Component
// ========================================

import { Droppable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { TaskCard } from './TaskCard';
import type { Task, Column } from '@/types.js';

interface KanbanColumnProps {
  title: string;
  column: Column;
  tasks: Task[];
  onUpdateDescription: (id: string, newDescription: string) => void;
}

export function KanbanColumn({ title, column, tasks, onUpdateDescription }: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-semibold uppercase tracking-wide mb-3 pb-2 border-b">
        {title}
      </h2>
      <Droppable droppableId={column}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 min-h-[400px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-accent' : ''
            }`}
          >
            <div className="flex flex-col gap-2">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onUpdateDescription={onUpdateDescription}
                />
              ))}
              {provided.placeholder}
            </div>
          </Card>
        )}
      </Droppable>
    </div>
  );
}
