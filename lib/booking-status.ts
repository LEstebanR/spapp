export const BOOKING_STATUSES = ["pendiente", "confirmado", "cancelado"] as const

export const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
}

export const STATUS_BADGE_STYLES: Record<string, string> = {
  pendiente: "bg-primary/15 text-primary",
  confirmado: "bg-secondary/15 text-accent-foreground",
  cancelado: "bg-muted text-muted-foreground",
}
