"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { assignBookingProfessional } from "@/app/dashboard/turnos/actions"

type Professional = { id: string; name: string }

export function BookingProfessionalAssign({
  bookingId,
  professionals,
}: {
  bookingId: string
  professionals: Professional[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  if (professionals.length === 0) {
    return (
      <p className="text-xs text-destructive">
        Nadie de tu equipo hace este servicio todavía.
      </p>
    )
  }

  return (
    <div className="space-y-1">
      <select
        defaultValue=""
        disabled={isPending}
        onChange={(e) => {
          const professionalId = e.target.value
          if (!professionalId) return
          setError(null)
          startTransition(async () => {
            try {
              await assignBookingProfessional(bookingId, professionalId)
              router.refresh()
            } catch (err) {
              setError(err instanceof Error ? err.message : "No se pudo asignar")
            }
          })
        }}
        className="h-8 rounded-md border border-primary/30 bg-primary/10 px-2 text-xs font-medium text-primary"
      >
        <option value="" disabled>
          Asignar profesional…
        </option>
        {professionals.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
