"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { DAY_LABELS, DayHours } from "@/lib/hours"

export function BusinessHoursForm({
  initialHours,
  onSave,
  label = "Guardar horario",
}: {
  initialHours: DayHours[]
  onSave: (hours: DayHours[]) => Promise<void>
  label?: string
}) {
  const router = useRouter()
  const [hours, setHours] = useState(initialHours)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function update(day: number, patch: Partial<DayHours>) {
    setHours((prev) => prev.map((d) => (d.day === day ? { ...d, ...patch } : d)))
    setSaved(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await onSave(hours)
      setSaved(true)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="divide-y divide-border">
        {hours.map((d) => (
          <div
            key={d.day}
            className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-3"
          >
            <div className="flex min-w-0 items-center gap-3 sm:w-32 sm:shrink-0">
              <Switch
                checked={d.open}
                onCheckedChange={(open) => update(d.day, { open })}
              />
              <span className="truncate text-sm font-medium text-foreground">
                {DAY_LABELS[d.day]}
              </span>
            </div>
            {d.open ? (
              <div className="flex min-w-0 flex-wrap items-center gap-2 pl-[3.25rem] sm:flex-1 sm:pl-0">
                <input
                  type="time"
                  value={d.from}
                  onChange={(e) => update(d.day, { from: e.target.value })}
                  className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2 text-sm"
                />
                <span className="shrink-0 text-muted-foreground">a</span>
                <input
                  type="time"
                  value={d.to}
                  onChange={(e) => update(d.day, { to: e.target.value })}
                  className="h-9 min-w-0 rounded-md border border-input bg-transparent px-2 text-sm"
                />
              </div>
            ) : (
              <span className="pl-[3.25rem] text-sm text-muted-foreground sm:pl-0">
                Cerrado
              </span>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isPending}>
        {saved ? <Check className="h-4 w-4" /> : isPending ? "Guardando…" : label}
      </Button>
    </form>
  )
}
