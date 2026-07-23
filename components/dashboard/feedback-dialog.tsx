"use client"

import { useState, useTransition } from "react"
import { Check, MessageSquare } from "lucide-react"

import { submitFeedback } from "@/app/dashboard/feedback/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { SidebarMenuButton } from "@/components/ui/sidebar"

export function FeedbackDialog() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [isPending, startTransition] = useTransition()

  function reset() {
    setMessage("")
    setError(null)
    setSent(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await submitFeedback(message)
        setMessage("")
        setSent(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo enviar")
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger asChild>
        <SidebarMenuButton className="cursor-pointer max-md:h-14 max-md:gap-3 max-md:text-base max-md:[&>svg]:size-5">
          <MessageSquare /> Feedback
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Danos tu opinión</DialogTitle>
            <DialogDescription>
              Leemos todos los mensajes. Si necesitas una respuesta puntual,
              déjanos un dato de contacto en el mensaje.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="feedback-message">Tu mensaje</Label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                setSent(false)
              }}
              maxLength={2000}
              rows={6}
              placeholder="Cuéntanos qué te gustaría que mejoráramos, qué te está costando trabajo, o cualquier idea…"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50 focus:outline-none"
              required
            />
          </div>

          <DialogFooter className="mt-6 items-center sm:justify-between">
            {sent ? (
              <p className="flex items-center gap-1.5 text-sm font-medium text-secondary">
                <Check className="h-4 w-4" /> ¡Gracias por tu mensaje!
              </p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={isPending || !message.trim()}>
              {isPending ? "Enviando…" : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
