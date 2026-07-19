"use client"

import { useEffect, useState, useTransition } from "react"
import { AlertCircle, Check } from "lucide-react"

import {
  createBooking,
  getAvailableProfessionals,
  getAvailableSlots,
} from "@/app/[slug]/reservar/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDuration } from "@/lib/duration"

type Service = {
  id: string
  name: string
  durationMinutes: number
}
type Professional = { id: string; name: string }

export function BookingForm({
  slug,
  services,
  professionals,
  initialServiceId,
}: {
  slug: string
  services: Service[]
  professionals: Professional[]
  initialServiceId?: string
}) {
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [serviceId, setServiceId] = useState(initialServiceId ?? "")
  const [professionalId, setProfessionalId] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [availableProfessionals, setAvailableProfessionals] =
    useState<{ id: string; name: string }[]>(professionals)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)

  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  // When service or date changes: find which professionals can do it that day.
  useEffect(() => {
    if (!serviceId || !date) {
      setAvailabilityChecked(false)
      return
    }

    let cancelled = false
    setIsCheckingAvailability(true)
    setProfessionalId("")

    getAvailableProfessionals({ slug, serviceId, date }).then((result) => {
      if (cancelled) return
      setAvailableProfessionals(result)
      setIsCheckingAvailability(false)
      setAvailabilityChecked(true)
    })

    return () => {
      cancelled = true
    }
  }, [slug, serviceId, date])

  const noAvailability =
    availabilityChecked && !isCheckingAvailability && availableProfessionals.length === 0

  // When service, date, or the chosen professional changes: load real time slots.
  useEffect(() => {
    if (!serviceId || !date || noAvailability) {
      setAvailableSlots([])
      setTime("")
      return
    }

    let cancelled = false
    setIsLoadingSlots(true)
    setTime("")

    getAvailableSlots({ slug, serviceId, professionalId: professionalId || null, date }).then(
      (slots) => {
        if (cancelled) return
        setAvailableSlots(slots)
        setIsLoadingSlots(false)
      }
    )

    return () => {
      cancelled = true
    }
  }, [slug, serviceId, date, professionalId, noAvailability])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await createBooking({
          slug,
          clientName,
          clientPhone,
          serviceId,
          professionalId: professionalId || null,
          date,
          time,
          notes,
        })
        setSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Algo salió mal")
      }
    })
  }

  if (success) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15">
            <Check className="h-6 w-6 text-secondary" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">
            ¡Listo, {clientName.split(" ")[0]}!
          </h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Recibimos tu solicitud de turno. Te confirmaremos pronto por
            teléfono.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Este spa todavía no tiene servicios configurados para reservar.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="clientName">Nombre</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clientPhone">Teléfono</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="service">Servicio</Label>
            <select
              id="service"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
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

          <div className="space-y-1.5">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>

          {serviceId && date && noAvailability && (
            <div className="flex items-start gap-2 rounded-md bg-primary/10 px-3 py-2.5 text-sm text-primary">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                No hay profesionales disponibles para este servicio en esa
                fecha. Prueba con otro día.
              </span>
            </div>
          )}

          {!noAvailability && availableProfessionals.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="professional">Profesional (opcional)</Label>
              <select
                id="professional"
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
                disabled={isCheckingAvailability}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option value="">Cualquiera disponible</option>
                {availableProfessionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {date && !noAvailability && (
            <div className="space-y-1.5">
              <Label htmlFor="time">Hora</Label>
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={isLoadingSlots || availableSlots.length === 0}
                required
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm disabled:opacity-50"
              >
                <option value="" disabled>
                  {isLoadingSlots
                    ? "Buscando horas…"
                    : availableSlots.length === 0
                      ? "Sin horas disponibles ese día"
                      : "Elige una hora…"}
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. primera vez, alguna preferencia…"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending || !serviceId || !time || noAvailability}
          >
            {isPending ? "Enviando…" : "Solicitar turno"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
