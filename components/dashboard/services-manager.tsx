"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"

import { createService, deleteService } from "@/app/dashboard/settings/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DURATION_PRESETS, formatDuration } from "@/lib/duration"

type ProfessionalType = { id: string; name: string }
type ServiceItem = {
  id: string
  name: string
  durationMinutes: number
  professionalType: { name: string } | null
}

export function ServicesManager({
  services,
  professionalTypes,
}: {
  services: ServiceItem[]
  professionalTypes: ProfessionalType[]
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [duration, setDuration] = useState("60")
  const [professionalTypeId, setProfessionalTypeId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await createService({
          name,
          durationMinutes: Number(duration),
          professionalTypeId: professionalTypeId || null,
        })
        setName("")
        setDuration("60")
        setProfessionalTypeId("")
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo agregar")
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteService(id)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {services.length > 0 && (
        <ul className="divide-y divide-border">
          {services.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(s.durationMinutes)}
                  {s.professionalType && ` · ${s.professionalType.name}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(s.id)}
                disabled={isPending}
                className="shrink-0 text-muted-foreground hover:text-destructive"
                aria-label={`Eliminar ${s.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto]">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del servicio"
        />
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          {DURATION_PRESETS.map((minutes) => (
            <option key={minutes} value={minutes}>
              {formatDuration(minutes)}
            </option>
          ))}
        </select>
        <select
          value={professionalTypeId}
          onChange={(e) => setProfessionalTypeId(e.target.value)}
          className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">Cualquier tipo</option>
          {professionalTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <Button type="submit" size="icon" disabled={isPending || !name.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
