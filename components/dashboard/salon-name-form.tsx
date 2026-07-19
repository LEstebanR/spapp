"use client"

import { useState, useTransition } from "react"
import { Check } from "lucide-react"

import { updateSalonName } from "@/app/dashboard/settings/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SalonNameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(false)
    startTransition(async () => {
      await updateSalonName(name)
      setSaved(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1 space-y-1.5">
        <label htmlFor="salonName" className="text-sm font-medium text-foreground">
          Nombre del spa
        </label>
        <Input
          id="salonName"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setSaved(false)
          }}
          placeholder="Nombre de tu spa"
          maxLength={80}
          required
        />
      </div>
      <Button type="submit" disabled={isPending || !name.trim()}>
        {saved ? <Check className="h-4 w-4" /> : isPending ? "Guardando…" : "Guardar"}
      </Button>
    </form>
  )
}
