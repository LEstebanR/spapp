"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, Plus } from "lucide-react"

import { updateProfessionalServices } from "@/app/dashboard/professionals/[id]/actions"
import { createService } from "@/app/dashboard/settings/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DURATION_PRESETS, formatDuration } from "@/lib/duration"

type Service = { id: string; name: string; durationMinutes: number }

export function ProfessionalServicesForm({
  professionalId,
  services: initialServices,
  initialServiceIds,
}: {
  professionalId: string
  services: Service[]
  initialServiceIds: string[]
}) {
  const router = useRouter()
  const [services, setServices] = useState(initialServices)
  const [selected, setSelected] = useState(new Set(initialServiceIds))
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDuration, setNewDuration] = useState("60")
  const [addError, setAddError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setSaved(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await updateProfessionalServices(professionalId, Array.from(selected))
      setSaved(true)
      router.refresh()
    })
  }

  function handleCreateService(e: React.FormEvent) {
    e.preventDefault()
    setAddError(null)
    setIsCreating(true)
    startTransition(async () => {
      try {
        const service = await createService({
          name: newName,
          durationMinutes: Number(newDuration),
          professionalTypeId: null,
        })
        setServices((prev) => [...prev, service].sort((a, b) => a.name.localeCompare(b.name)))
        const nextSelected = new Set(selected)
        nextSelected.add(service.id)
        setSelected(nextSelected)
        await updateProfessionalServices(professionalId, Array.from(nextSelected))
        setNewName("")
        setNewDuration("60")
        setIsAdding(false)
        router.refresh()
      } catch (err) {
        setAddError(err instanceof Error ? err.message : "No se pudo crear el servicio")
      } finally {
        setIsCreating(false)
      }
    })
  }

  return (
    <div className="space-y-4">
      {services.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {services.map((service) => (
              <label
                key={service.id}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2.5 hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={selected.has(service.id)}
                  onChange={() => toggle(service.id)}
                  className="h-4 w-4 shrink-0 accent-secondary"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {service.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(service.durationMinutes)}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <Button type="submit" disabled={isPending}>
            {saved ? <Check className="h-4 w-4" /> : isPending ? "Guardando…" : "Guardar servicios"}
          </Button>
        </form>
      )}

      {isAdding ? (
        <form
          onSubmit={handleCreateService}
          className="space-y-3 rounded-md border border-dashed border-border p-3"
        >
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre del servicio nuevo"
              autoFocus
            />
            <select
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {DURATION_PRESETS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {formatDuration(minutes)}
                </option>
              ))}
            </select>
          </div>
          {addError && <p className="text-sm text-destructive">{addError}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isCreating || !newName.trim()}>
              {isCreating ? "Creando…" : "Crear y asignar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAdding(false)
                setAddError(null)
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Crear servicio nuevo
        </button>
      )}

      {services.length === 0 && !isAdding && (
        <p className="text-sm text-muted-foreground">
          Todavía no has creado servicios.
        </p>
      )}
    </div>
  )
}
