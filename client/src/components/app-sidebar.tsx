"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  FileText,
  Kanban,
  Target,
  Search,
  ChevronRight,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { useNavigation } from "@/contexts/NavigationContext"
import { useBoard } from "@/contexts/BoardContext"
import { ProjectSwitcher } from "@/components/project-switcher"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    selectedMilestones,
    setSelectedMilestones
  } = useNavigation()
  const { boardData } = useBoard()

  const handleKanbanClick = (milestoneId?: string) => {
    setActiveView('kanban')
    if (milestoneId) {
      setSelectedMilestones([milestoneId])
    } else {
      setSelectedMilestones([])
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Kanban Collapsible Menu */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Kanban"
                      isActive={activeView === 'kanban'}
                    >
                      <Kanban />
                      <span>Kanban</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={activeView === 'kanban' && selectedMilestones.length === 0}
                          onClick={() => handleKanbanClick()}
                        >
                          <span>Todos</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {boardData?.milestones.map((milestone) => (
                        <SidebarMenuSubItem key={milestone.id}>
                          <SidebarMenuSubButton
                            isActive={activeView === 'kanban' && selectedMilestones.includes(milestone.id)}
                            onClick={() => handleKanbanClick(milestone.id)}
                          >
                            <div
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: milestone.cor }}
                            />
                            <span className="truncate">{milestone.titulo}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Other Menu Items */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === 'roadmap'}
                  onClick={() => setActiveView('roadmap')}
                  tooltip="Roteiro"
                >
                  <Target />
                  <span>Roteiro</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === 'metadata'}
                  onClick={() => setActiveView('metadata')}
                  tooltip="Objetivo & Status"
                >
                  <FileText />
                  <span>Objetivo & Status</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === 'guide'}
                  onClick={() => setActiveView('guide')}
                  tooltip="Guia LLM"
                >
                  <BookOpen />
                  <span>Guia LLM</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === 'agents'}
                  onClick={() => setActiveView('agents')}
                  tooltip="Agentes IA"
                >
                  <Bot />
                  <span>Agentes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <div className="px-2 pb-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Buscar tasks..."
                  className="pl-8 h-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter>
        <ProjectSwitcher />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
