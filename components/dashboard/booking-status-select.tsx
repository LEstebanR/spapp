"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { updateBookingStatus } from "@/app/dashboard/turnos/actions"
import { BOOKING_STATUSES, STATUS_BADGE_STYLES, STATUS_LABELS } from "@/lib/booking-status"
import { cn } from "@/lib/utils"

export function BookingStatusSelect({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => {
          const nextStatus = e.target.value
          setError(null)
          startTransition(async () => {
            try {
              await updateBookingStatus(id, nextStatus)
              router.refresh()
            } catch (err) {
              setError(err instanceof Error ? err.message : "No se pudo cambiar el estado")
            }
          })
        }}
        className={cn(
          "h-8 shrink-0 rounded-full border-0 px-3 text-xs font-semibold",
          STATUS_BADGE_STYLES[status] ?? STATUS_BADGE_STYLES.pendiente
        )}
      >
        {BOOKING_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {error && <p className="max-w-40 text-right text-xs text-destructive">{error}</p>}
    </div>
  )
}
