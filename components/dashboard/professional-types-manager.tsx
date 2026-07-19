"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"

import { createProfessionalType, deleteProfessionalType } from "@/app/dashboard/settings/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ProfessionalType = { id: string; name: string }

export function ProfessionalTypesManager({
  professionalTypes,
}: {
  professionalTypes: ProfessionalType[]
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await createProfessionalType(name)
        setName("")
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo agregar")
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProfessionalType(id)
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      {professionalTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {professionalTypes.map((t) => (
            <Badge key={t.id} variant="secondary" className="gap-1 py-1.5 pr-1.5 pl-3">
              {t.name}
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                disabled={isPending}
                className="rounded-full p-0.5 hover:bg-black/10"
                aria-label={`Eliminar ${t.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Masajista"
        />
        <Button type="submit" size="icon" disabled={isPending || !name.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
