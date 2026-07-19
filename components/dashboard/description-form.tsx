"use client"

import { useState, useTransition } from "react"
import { Check } from "lucide-react"

import { updateDescription } from "@/app/dashboard/settings/actions"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function DescriptionForm({ initialDescription }: { initialDescription: string }) {
  const [description, setDescription] = useState(initialDescription)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(false)
    startTransition(async () => {
      await updateDescription(description)
      setSaved(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor="description">Descripción</Label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value)
          setSaved(false)
        }}
        maxLength={600}
        rows={4}
        placeholder="Cuéntale a tus clientes qué hace especial a tu spa…"
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50 focus:outline-none"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Aparece en la página pública de tu spa. {description.length}/600
        </p>
        <Button type="submit" size="sm" disabled={isPending}>
          {saved ? <Check className="h-4 w-4" /> : isPending ? "Guardando…" : "Guardar"}
        </Button>
      </div>
    </form>
  )
}
