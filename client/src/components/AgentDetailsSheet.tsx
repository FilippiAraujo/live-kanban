// ========================================
// Agent Details Sheet - Painel lateral com detalhes
// ========================================

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, Wrench, Cpu, FileCode } from 'lucide-react';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import type { AgentInfo, ToolInfo } from '@/types.js';

interface AgentDetailsSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agent?: AgentInfo;
    tool?: ToolInfo;
}

export function AgentDetailsSheet({
    open,
    onOpenChange,
    agent,
    tool
}: AgentDetailsSheetProps) {
    const isAgent = !!agent;
    const item = agent || tool;

    if (!item) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${isAgent
                                ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
                                : 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
                            }`}>
                            {isAgent ? (
                                <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            ) : (
                                <Wrench className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            )}
                        </div>
                        <div>
                            <SheetTitle className="text-left">
                                {isAgent ? agent.name : tool?.name}
                            </SheetTitle>
                            <SheetDescription className="text-left">
                                {isAgent ? 'Agente de IA' : 'Ferramenta'}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
                    {/* Description */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <FileCode className="h-4 w-4" />
                                Descrição
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {isAgent ? agent.description : tool?.description}
                            </p>
                        </div>

                        <Separator />

                        {/* Agent-specific info */}
                        {isAgent && agent && (
                            <>
                                {/* Model */}
                                <div>
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <Cpu className="h-4 w-4" />
                                        Modelo
                                    </h4>
                                    <Badge variant="secondary">{agent.model}</Badge>
                                </div>

                                <Separator />

                                {/* Tools */}
                                <div>
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <Wrench className="h-4 w-4" />
                                        Tools Disponíveis ({agent.tools.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {agent.tools.length > 0 ? (
                                            agent.tools.map((toolName) => (
                                                <Badge key={toolName} variant="outline">
                                                    {toolName}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                Nenhuma tool disponível
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Instructions */}
                                {agent.instructions && (
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">
                                            📝 Instruções do Agente
                                        </h4>
                                        <div className="bg-muted/50 rounded-lg p-4 text-sm">
                                            <MarkdownViewer content={agent.instructions} />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Tool-specific info */}
                        {!isAgent && tool && (
                            <>
                                {/* Used by agents */}
                                <div>
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <Bot className="h-4 w-4" />
                                        Usado por ({tool.usedBy.length} agente{tool.usedBy.length !== 1 ? 's' : ''})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tool.usedBy.length > 0 ? (
                                            tool.usedBy.map((agentName) => (
                                                <Badge key={agentName} variant="secondary">
                                                    {agentName}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                Nenhum agente usa esta tool
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Input Schema */}
                                {tool.inputSchema && Object.keys(tool.inputSchema).length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">
                                            📥 Input Schema
                                        </h4>
                                        <div className="bg-muted/50 rounded-lg p-4">
                                            <pre className="text-xs overflow-x-auto">
                                                {JSON.stringify(tool.inputSchema, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* Output Schema */}
                                {tool.outputSchema && Object.keys(tool.outputSchema).length > 0 && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">
                                                📤 Output Schema
                                            </h4>
                                            <div className="bg-muted/50 rounded-lg p-4">
                                                <pre className="text-xs overflow-x-auto">
                                                    {JSON.stringify(tool.outputSchema, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
