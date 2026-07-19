"use client"

import { Bell, BellOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { usePushSubscription } from "@/hooks/use-push-subscription"

export function NotificationSettings() {
  const { status, isLoading, error, enable, disable } = usePushSubscription()

  if (status === "checking") return null

  if (status === "unsupported") {
    return (
      <p className="text-sm text-muted-foreground">
        Tu navegador no soporta notificaciones push.
      </p>
    )
  }

  if (status === "denied") {
    return (
      <p className="text-sm text-muted-foreground">
        Bloqueaste las notificaciones para este sitio. Actívalas desde los
        ajustes de tu navegador para recibir avisos de nuevos turnos.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {status === "enabled" ? (
          <Button variant="outline" size="sm" onClick={disable} disabled={isLoading}>
            <BellOff className="h-4 w-4" /> Desactivar notificaciones
          </Button>
        ) : (
          <Button size="sm" onClick={enable} disabled={isLoading}>
            <Bell className="h-4 w-4" /> Activar notificaciones de turnos
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {status === "enabled"
          ? "Te avisaremos en este navegador cuando llegue una nueva solicitud de turno."
          : "Recibe un aviso en este navegador cada vez que alguien pida un turno."}
      </p>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
