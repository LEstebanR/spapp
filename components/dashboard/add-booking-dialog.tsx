"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { createManualBooking } from "@/app/dashboard/agenda/actions"
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
import { formatDuration } from "@/lib/duration"

type Service = { id: string; name: string; durationMinutes: number }
type Professional = { id: string; name: string; serviceIds: string[] }

export function AddBookingDialog({
  services,
  professionals,
  defaultDate,
}: {
  services: Service[]
  professionals: Professional[]
  defaultDate?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [professionalId, setProfessionalId] = useState("")
  const [date, setDate] = useState(defaultDate ?? "")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const eligibleProfessionals = useMemo(
    () =>
      serviceId ? professionals.filter((p) => p.serviceIds.includes(serviceId)) : professionals,
    [professionals, serviceId]
  )

  function reset() {
    setClientName("")
    setClientPhone("")
    setServiceId("")
    setProfessionalId("")
    setDate(defaultDate ?? "")
    setTime("")
    setNotes("")
    setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await createManualBooking({
          clientName,
          clientPhone,
          serviceId,
          professionalId: professionalId || null,
          date,
          time,
          notes,
        })
        reset()
        setOpen(false)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo agendar")
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
        <Button>
          <Plus className="h-4 w-4" /> Agendar turno
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo turno</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="mb-name">Cliente</Label>
                <Input
                  id="mb-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mb-phone">Teléfono</Label>
                <Input
                  id="mb-phone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mb-service">Servicio</Label>
              <select
                id="mb-service"
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value)
                  setProfessionalId("")
                }}
                required
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="" disabled>
                  Elige un servicio…
                </option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatDuration(s.durationMinutes)}
                  </option>
                ))}
              </select>
            </div>

            {eligibleProfessionals.length > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="mb-professional">Profesional (opcional)</Label>
                <select
                  id="mb-professional"
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">Sin asignar</option>
                  {eligibleProfessionals.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="mb-date">Fecha</Label>
                <Input
                  id="mb-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mb-time">Hora</Label>
                <Input
                  id="mb-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mb-notes">Notas (opcional)</Label>
              <Input
                id="mb-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={isPending || !serviceId}>
              {isPending ? "Guardando…" : "Guardar turno"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
