"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudOff, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useBoard } from "@/contexts/BoardContext"

export function CloudSyncToggle() {
  const { boardData } = useBoard()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [cloudStatus, setCloudStatus] = useState<{
    enabled: boolean
    slug: string | null
    url: string | null
    publishedAt: string | null
  }>({ enabled: false, slug: null, url: null, publishedAt: null })

  // Carrega status quando abre o popover
  useEffect(() => {
    if (isOpen && boardData?.projectPath) {
      loadCloudStatus()
    }
  }, [isOpen, boardData?.projectPath])

  const loadCloudStatus = async () => {
    if (!boardData?.projectPath) return
    try {
      const status = await api.getCloudStatus(boardData.projectPath)
      setCloudStatus(status)
    } catch (err) {
      console.error("Erro ao carregar status cloud:", err)
    }
  }

  const handleToggle = async (enabled: boolean) => {
    if (!boardData?.projectPath) return

    setLoading(true)
    try {
      if (enabled) {
        const result = await api.publishToCloud(boardData.projectPath)
        setCloudStatus({
          enabled: true,
          slug: result.slug,
          url: result.url,
          publishedAt: new Date().toISOString(),
        })
        toast.success("Projeto publicado!", {
          description: "Seu kanban agora está disponível online.",
          action: {
            label: "Abrir",
            onClick: () => window.open(result.url, "_blank"),
          },
        })
      } else {
        await api.unpublishFromCloud(boardData.projectPath)
        setCloudStatus((prev) => ({ ...prev, enabled: false }))
        toast.info("Publicação desabilitada", {
          description: "O link ainda existe, mas não será mais atualizado.",
        })
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao alterar publicação")
    } finally {
      setLoading(false)
    }
  }

  const handleManualSync = async () => {
    if (!boardData?.projectPath) return

    setSyncing(true)
    try {
      const result = await api.syncToCloud(boardData.projectPath)
      toast.success("Sincronizado!", {
        description: "As mudanças foram enviadas para o cloud.",
      })
    } catch (err: any) {
      toast.error(err.message || "Erro ao sincronizar")
    } finally {
      setSyncing(false)
    }
  }

  if (!boardData) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 h-8 ${cloudStatus.enabled ? "text-green-600" : "text-muted-foreground"}`}
        >
          {cloudStatus.enabled ? (
            <Cloud className="h-4 w-4" />
          ) : (
            <CloudOff className="h-4 w-4" />
          )}
          <span className="hidden sm:inline text-xs">
            {cloudStatus.enabled ? "Online" : "Offline"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium text-sm">Compartilhar Online</h4>
              <p className="text-xs text-muted-foreground">
                Publique seu roadmap para outras pessoas verem
              </p>
            </div>
            <Switch
              checked={cloudStatus.enabled}
              onCheckedChange={handleToggle}
              disabled={loading}
            />
          </div>

          {cloudStatus.enabled && cloudStatus.url && (
            <>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">Link público:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-muted px-2 py-1.5 rounded truncate">
                    {cloudStatus.url}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => window.open(cloudStatus.url!, "_blank")}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Sync automático ativado
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1.5"
                  onClick={handleManualSync}
                  disabled={syncing}
                >
                  <RefreshCw className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Sincronizando..." : "Forçar Sync"}
                </Button>
              </div>

              {cloudStatus.publishedAt && (
                <p className="text-xs text-muted-foreground">
                  Publicado em:{" "}
                  {new Date(cloudStatus.publishedAt).toLocaleString("pt-BR")}
                </p>
              )}
            </>
          )}

          {!cloudStatus.enabled && (
            <p className="text-xs text-muted-foreground pt-2 border-t">
              Quando ativado, todas as mudanças serão sincronizadas automaticamente
              para um link público.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
