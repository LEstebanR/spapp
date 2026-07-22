"use client"

import { useState, useTransition } from "react"
import { Check } from "lucide-react"

import { submitFeedback } from "@/app/dashboard/feedback/actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function FeedbackForm() {
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [isPending, startTransition] = useTransition()

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
    <form onSubmit={handleSubmit} className="space-y-2">
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
      <div className="flex items-center justify-between">
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
      </div>
    </form>
  )
}
