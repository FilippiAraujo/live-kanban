"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Folder, Plus, Trash2, Settings, ChevronsUpDown } from "lucide-react"
import { useBoard } from "@/contexts/BoardContext"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface RecentProject {
  path: string;
  name: string;
  lastAccessed: string;
}

export function ProjectSwitcher() {
  const { isMobile } = useSidebar()
  const { boardData, loadProject, loading } = useBoard()
  const [recentProjects, setRecentProjects] = React.useState<RecentProject[]>([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [projectPathInput, setProjectPathInput] = React.useState('')
  const [settingUp, setSettingUp] = React.useState(false)

  // Load recent projects on mount
  React.useEffect(() => {
    loadRecentProjects()
  }, [])

  const loadRecentProjects = async () => {
    try {
      const projects = await api.getRecentProjects()
      setRecentProjects(projects)
    } catch (err) {
      console.error('Failed to load recent projects', err)
    }
  }

  const handleLoadProject = async (path: string) => {
    if (!path.trim()) return

    try {
      const data = await loadProject(path)
      const isValidProject = !data.status.includes('(Arquivo não encontrado')
      
      if (isValidProject) {
        await api.addRecentProject(data.projectPath)
        await loadRecentProjects()
        setIsDialogOpen(false)
        setProjectPathInput('')
      } else {
         // Even if invalid structure, add to recents so we can setup it? 
         // Logic from Header says: only add if valid. But we might want to setup.
         // For now, adhere to previous logic but maybe allow setup if loaded.
      }
    } catch (err) {
      console.error(err)
      toast.error("Erro ao carregar projeto")
    }
  }

  const handleRemoveRecent = async (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    try {
      await api.removeRecentProject(path)
      await loadRecentProjects()
      toast.success("Projeto removido dos recentes")
    } catch (err) {
      toast.error("Erro ao remover projeto")
    }
  }

  const handleSetupProject = async () => {
    if (!boardData?.projectPath) return

    setSettingUp(true)
    try {
      const result = await api.setupProject(boardData.projectPath)
      toast.success(`✅ ${result.message}`)
      
      // Reload after setup
      await loadProject(boardData.projectPath)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar estrutura')
    } finally {
      setSettingUp(false)
    }
  }

  const activeProjectName = boardData ? boardData.projectPath.split('/').pop() : "Selecione um projeto"
  const needsSetup = boardData && boardData.status.includes('(Arquivo não encontrado)')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Folder className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeProjectName}
                </span>
                <span className="truncate text-xs">{boardData?.projectPath || "Nenhum projeto"}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projetos Recentes
            </DropdownMenuLabel>
            {recentProjects.map((project) => (
              <DropdownMenuItem
                key={project.path}
                onClick={() => handleLoadProject(project.path)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Folder className="size-4 shrink-0" />
                </div>
                <div className="flex-1 truncate">
                    {project.name}
                </div>
                <Button
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => handleRemoveRecent(e, project.path)}
                >
                    <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <DropdownMenuItem 
                        className="gap-2 p-2 cursor-pointer"
                        onSelect={(e) => e.preventDefault()} // Prevent closing dropdown immediately
                    >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                        <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">Abrir outro projeto...</div>
                    </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Abrir Projeto</DialogTitle>
                        <DialogDescription>
                            Insira o caminho absoluto do diretório do projeto.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="/Users/seu-nome/projeto"
                            value={projectPathInput}
                            onChange={(e) => setProjectPathInput(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') handleLoadProject(projectPathInput)
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => handleLoadProject(projectPathInput)} disabled={loading}>
                            {loading ? 'Carregando...' : 'Carregar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {needsSetup && (
                 <DropdownMenuItem 
                    className="gap-2 p-2 cursor-pointer text-blue-600 focus:text-blue-700"
                    onClick={handleSetupProject}
                    disabled={settingUp}
                 >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-blue-100">
                        <Settings className={`size-4 ${settingUp ? 'animate-spin' : ''}`} />
                    </div>
                    <div className="font-medium">
                        {settingUp ? 'Configurando...' : 'Configurar Projeto'}
                    </div>
                </DropdownMenuItem>
            )}

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
