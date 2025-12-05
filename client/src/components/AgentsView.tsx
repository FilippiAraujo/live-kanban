// ========================================
// Agents View - View principal de gestão de agentes
// ========================================

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Wrench, Cpu, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { AgentCard } from '@/components/AgentCard';
import { ToolCard } from '@/components/ToolCard';
import { AgentDetailsSheet } from '@/components/AgentDetailsSheet';
import { api } from '@/lib/api';
import type { AgentInfo, ToolInfo, AgentsStatus } from '@/types.js';

export function AgentsView() {
    const [agents, setAgents] = useState<AgentInfo[]>([]);
    const [tools, setTools] = useState<ToolInfo[]>([]);
    const [status, setStatus] = useState<AgentsStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedAgent, setSelectedAgent] = useState<AgentInfo | undefined>();
    const [selectedTool, setSelectedTool] = useState<ToolInfo | undefined>();
    const [sheetOpen, setSheetOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [agentsData, toolsData, statusData] = await Promise.all([
                api.getAgents(),
                api.getTools(),
                api.getAgentsStatus()
            ]);

            setAgents(agentsData);
            setTools(toolsData);
            setStatus(statusData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const handleAgentClick = (agent: AgentInfo) => {
        setSelectedAgent(agent);
        setSelectedTool(undefined);
        setSheetOpen(true);
    };

    const handleToolClick = (tool: ToolInfo) => {
        setSelectedTool(tool);
        setSelectedAgent(undefined);
        setSheetOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Carregando agentes...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <Card className="p-6 text-center max-w-md">
                    <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Erro ao carregar agentes</h3>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={loadData}
                        className="text-sm text-primary hover:underline"
                    >
                        Tentar novamente
                    </button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Status Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        {status?.available ? (
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                        ) : (
                            <div className="p-2 rounded-lg bg-red-500/10">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-muted-foreground">Status</p>
                            <p className="font-semibold text-sm">
                                {status?.available ? 'Conectado' : 'Desconectado'}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <Cpu className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Modelo</p>
                            <p className="font-semibold text-sm truncate">{status?.model || 'N/A'}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Bot className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Agentes</p>
                            <p className="font-semibold text-sm">{agents.length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                            <Wrench className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Tools</p>
                            <p className="font-semibold text-sm">{tools.length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs for Agents and Tools */}
            <Tabs defaultValue="agents" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="agents" className="gap-2">
                        <Bot className="h-4 w-4" />
                        Agentes ({agents.length})
                    </TabsTrigger>
                    <TabsTrigger value="tools" className="gap-2">
                        <Wrench className="h-4 w-4" />
                        Tools ({tools.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="agents" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Agentes de IA disponíveis para auxiliar no gerenciamento de tasks
                    </p>

                    {agents.length === 0 ? (
                        <Card className="p-8 text-center">
                            <Bot className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Nenhum agente disponível</h3>
                            <p className="text-sm text-muted-foreground">
                                Verifique se o Mastra está configurado corretamente
                            </p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {agents.map((agent) => (
                                <AgentCard
                                    key={agent.name}
                                    agent={agent}
                                    onClick={() => handleAgentClick(agent)}
                                    isSelected={selectedAgent?.name === agent.name}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="tools" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Ferramentas disponíveis para os agentes executarem ações
                    </p>

                    {tools.length === 0 ? (
                        <Card className="p-8 text-center">
                            <Wrench className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Nenhuma tool disponível</h3>
                            <p className="text-sm text-muted-foreground">
                                Verifique se o Mastra está configurado corretamente
                            </p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {tools.map((tool) => (
                                <ToolCard
                                    key={tool.id}
                                    tool={tool}
                                    onClick={() => handleToolClick(tool)}
                                    isSelected={selectedTool?.id === tool.id}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Details Sheet */}
            <AgentDetailsSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                agent={selectedAgent}
                tool={selectedTool}
            />
        </div>
    );
}
