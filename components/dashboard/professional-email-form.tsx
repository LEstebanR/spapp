"use client"

import { useState, useTransition } from "react"
import { Check } from "lucide-react"

import { updateProfessionalEmail } from "@/app/dashboard/professionals/[id]/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfessionalEmailForm({
  professionalId,
  initialEmail,
  linked,
}: {
  professionalId: string
  initialEmail: string
  linked: boolean
}) {
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    startTransition(async () => {
      try {
        await updateProfessionalEmail(professionalId, email)
        setSaved(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo guardar")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor="prof-email">Correo</Label>
      <div className="flex items-end gap-3">
        <Input
          id="prof-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setSaved(false)
            setError(null)
          }}
          placeholder="Para que pueda iniciar sesión más adelante"
          className="flex-1"
        />
        <Button type="submit" disabled={isPending}>
          {saved ? <Check className="h-4 w-4" /> : isPending ? "Guardando…" : "Guardar"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {linked && !error && (
        <p className="text-sm text-secondary">
          Ya vinculó su cuenta con este correo.
        </p>
      )}
    </form>
  )
}
