// ========================================
// Agent Card - Card individual de agente
// ========================================

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Wrench } from 'lucide-react';
import type { AgentInfo } from '@/types.js';

interface AgentCardProps {
    agent: AgentInfo;
    onClick: () => void;
    isSelected?: boolean;
}

export function AgentCard({ agent, onClick, isSelected }: AgentCardProps) {
    return (
        <Card
            className={`p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${isSelected ? 'ring-2 ring-primary border-primary' : ''
                }`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {agent.description}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {agent.model}
                </Badge>
                {agent.tools.length > 0 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1">
                        <Wrench className="h-2.5 w-2.5" />
                        {agent.tools.length} tool{agent.tools.length !== 1 ? 's' : ''}
                    </Badge>
                )}
            </div>

            {agent.tools.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {agent.tools.slice(0, 3).map((tool) => (
                        <span
                            key={tool}
                            className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                        >
                            {tool}
                        </span>
                    ))}
                    {agent.tools.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                            +{agent.tools.length - 3}
                        </span>
                    )}
                </div>
            )}
        </Card>
    );
}
