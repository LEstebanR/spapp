"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

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

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        startTransition(async () => {
          await updateBookingStatus(id, e.target.value)
          router.refresh()
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
  )
}
