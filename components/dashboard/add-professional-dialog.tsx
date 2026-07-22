"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { createProfessional } from "@/app/dashboard/professionals/actions"
import { createProfessionalType } from "@/app/dashboard/settings/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ProfessionalType = { id: string; name: string }

const NEW_TYPE_VALUE = "__new__"

export function AddProfessionalDialog({
  professionalTypes,
}: {
  professionalTypes: ProfessionalType[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [professionalTypeId, setProfessionalTypeId] = useState("")
  const [newTypeName, setNewTypeName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isCreatingType = professionalTypeId === NEW_TYPE_VALUE

  function reset() {
    setName("")
    setEmail("")
    setProfessionalTypeId("")
    setNewTypeName("")
    setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        let typeId = professionalTypeId
        if (isCreatingType) {
          const created = await createProfessionalType(newTypeName)
          typeId = created.id
        }
        await createProfessional({ name, professionalTypeId: typeId || null, email })
        reset()
        setOpen(false)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo guardar")
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
        <Button>Agregar profesional</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo profesional</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="prof-name">Nombre</Label>
              <Input
                id="prof-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Mariana Gómez"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prof-email">Correo (opcional)</Label>
              <Input
                id="prof-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Para que pueda iniciar sesión más adelante"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prof-type">Tipo de profesional (opcional)</Label>
              <select
                id="prof-type"
                value={professionalTypeId}
                onChange={(e) => setProfessionalTypeId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">Sin especificar</option>
                {professionalTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
                <option value={NEW_TYPE_VALUE}>+ Crear nuevo tipo…</option>
              </select>
              {isCreatingType && (
                <Input
                  autoFocus
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="Ej. Masajista"
                  className="mt-2"
                  required
                />
              )}
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <DialogFooter className="mt-6">
            <Button
              type="submit"
              disabled={
                isPending || !name.trim() || (isCreatingType && !newTypeName.trim())
              }
            >
              {isPending ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
