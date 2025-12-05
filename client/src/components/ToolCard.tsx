// ========================================
// Tool Card - Card individual de tool
// ========================================

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Bot } from 'lucide-react';
import type { ToolInfo } from '@/types.js';

interface ToolCardProps {
    tool: ToolInfo;
    onClick: () => void;
    isSelected?: boolean;
}

export function ToolCard({ tool, onClick, isSelected }: ToolCardProps) {
    return (
        <Card
            className={`p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${isSelected ? 'ring-2 ring-primary border-primary' : ''
                }`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                    <Wrench className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {tool.description}
                    </p>
                </div>
            </div>

            {tool.usedBy.length > 0 && (
                <div className="mt-3">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                        <Bot className="h-3 w-3" />
                        <span>Usado por:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {tool.usedBy.map((agentName) => (
                            <Badge
                                key={agentName}
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0"
                            >
                                {agentName}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {tool.usedBy.length === 0 && (
                <div className="mt-3">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                        Não usado por nenhum agente
                    </Badge>
                </div>
            )}
        </Card>
    );
}
