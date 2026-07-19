"use client"

import { useState, useTransition } from "react"

import { createSpa } from "@/app/onboarding/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function OnboardingForm() {
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await createSpa(name)
      } catch (err) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          setError(err.message)
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="salonName">Nombre de tu spa</Label>
        <Input
          id="salonName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Varuá Spa"
          autoFocus
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isPending || !name.trim()}>
        {isPending ? "Creando…" : "Crear mi spa"}
      </Button>
    </form>
  )
}
