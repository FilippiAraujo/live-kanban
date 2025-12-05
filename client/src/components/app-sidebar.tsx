"use client"

import * as React from "react"
import {
  BookOpen,
  FileText,
  Kanban,
  Target,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useNavigation } from "@/contexts/NavigationContext"
import type { ViewType } from "@/types"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeView, setActiveView } = useNavigation()

  const navItems = [
    {
      title: "Kanban",
      view: "kanban" as ViewType,
      icon: Kanban,
    },
    {
      title: "Roteiro",
      view: "roadmap" as ViewType,
      icon: Target,
    },
    {
      title: "Objetivo & Status",
      view: "metadata" as ViewType,
      icon: FileText,
    },
    {
      title: "Guia LLM",
      view: "guide" as ViewType,
      icon: BookOpen,
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Kanban className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Live Kanban</span>
            <span className="truncate text-xs">Project Board</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    isActive={activeView === item.view}
                    onClick={() => setActiveView(item.view)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
