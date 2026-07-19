"use client"

import { useMemo, useState } from "react"
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { STATUS_BADGE_STYLES, STATUS_LABELS } from "@/lib/booking-status"
import { cn } from "@/lib/utils"

export type AgendaBooking = {
  id: string
  clientName: string
  clientPhone: string
  date: string // ISO
  status: string
  serviceName: string | null
  professionalName: string | null
}

type View = "month" | "week" | "day"

const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export function AgendaCalendar({
  bookings,
  initialView = "month",
}: {
  bookings: AgendaBooking[]
  initialView?: View
}) {
  const [view, setView] = useState<View>(initialView)
  const [current, setCurrent] = useState(() => new Date())

  const parsed = useMemo(
    () => bookings.map((b) => ({ ...b, dateObj: new Date(b.date) })),
    [bookings]
  )

  function bookingsOn(day: Date) {
    return parsed
      .filter((b) => isSameDay(b.dateObj, day))
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
  }

  function navigate(direction: 1 | -1) {
    if (view === "month") setCurrent((d) => addMonths(d, direction))
    else if (view === "week") setCurrent((d) => addWeeks(d, direction))
    else setCurrent((d) => addDays(d, direction))
  }

  const periodLabel = useMemo(() => {
    if (view === "month") return format(current, "MMMM yyyy", { locale: es })
    if (view === "day") return format(current, "EEEE d 'de' MMMM", { locale: es })
    const start = startOfWeek(current)
    const end = endOfWeek(current)
    return `${format(start, "d MMM", { locale: es })} – ${format(end, "d MMM", { locale: es })}`
  }, [view, current])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} aria-label="Anterior">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrent(new Date())}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigate(1)} aria-label="Siguiente">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="ml-2 font-display text-lg font-bold text-foreground capitalize">
            {periodLabel}
          </h2>
        </div>

        <div className="flex gap-1 rounded-full bg-muted p-1">
          {(["month", "week", "day"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                view === v
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v === "month" ? "Mes" : v === "week" ? "Semana" : "Día"}
            </button>
          ))}
        </div>
      </div>

      {view === "month" && (
        <MonthView current={current} bookingsOn={bookingsOn} onSelectDay={(d) => {
          setCurrent(d)
          setView("day")
        }} />
      )}
      {view === "week" && <WeekView current={current} bookingsOn={bookingsOn} />}
      {view === "day" && <DayView current={current} bookingsOn={bookingsOn} />}
    </div>
  )
}

function MonthView({
  current,
  bookingsOn,
  onSelectDay,
}: {
  current: Date
  bookingsOn: (day: Date) => ReturnType<typeof Array.prototype.filter>
  onSelectDay: (day: Date) => void
}) {
  const gridStart = startOfWeek(startOfMonth(current))
  const gridEnd = endOfWeek(endOfMonth(current))
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="grid grid-cols-7 border-b border-border bg-muted">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-2 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayBookings = bookingsOn(day) as unknown as (AgendaBooking & {
            dateObj: Date
          })[]
          const visible = dayBookings.slice(0, 3)
          const overflow = dayBookings.length - visible.length

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDay(day)}
              className={cn(
                "min-h-24 border-r border-b border-border p-1.5 text-left align-top last:border-r-0 hover:bg-muted/50 sm:p-2",
                !isSameMonth(day, current) && "bg-muted/30"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday(day)
                    ? "bg-secondary text-white"
                    : isSameMonth(day, current)
                      ? "text-foreground"
                      : "text-muted-foreground/50"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="mt-1 space-y-1">
                {visible.map((b) => (
                  <div
                    key={b.id}
                    className={cn(
                      "truncate rounded px-1.5 py-0.5 text-[11px] font-medium",
                      STATUS_BADGE_STYLES[b.status] ?? STATUS_BADGE_STYLES.pendiente
                    )}
                  >
                    {format(b.dateObj, "HH:mm")} {b.clientName}
                  </div>
                ))}
                {overflow > 0 && (
                  <p className="px-1.5 text-[11px] text-muted-foreground">
                    +{overflow} más
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({
  current,
  bookingsOn,
}: {
  current: Date
  bookingsOn: (day: Date) => ReturnType<typeof Array.prototype.filter>
}) {
  const days = eachDayOfInterval({ start: startOfWeek(current), end: endOfWeek(current) })

  return (
    <div className="grid gap-3 sm:grid-cols-7">
      {days.map((day) => {
        const dayBookings = bookingsOn(day) as unknown as (AgendaBooking & {
          dateObj: Date
        })[]
        return (
          <div key={day.toISOString()} className="rounded-2xl border border-border bg-white p-3">
            <p
              className={cn(
                "mb-2 text-center text-sm font-semibold",
                isToday(day) ? "text-secondary" : "text-foreground"
              )}
            >
              {format(day, "EEE d", { locale: es })}
            </p>
            <div className="space-y-1.5">
              {dayBookings.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground">—</p>
              ) : (
                dayBookings.map((b) => (
                  <div
                    key={b.id}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-xs",
                      STATUS_BADGE_STYLES[b.status] ?? STATUS_BADGE_STYLES.pendiente
                    )}
                  >
                    <p className="font-semibold">{format(b.dateObj, "HH:mm")}</p>
                    <p className="truncate">{b.clientName}</p>
                    {b.serviceName && <p className="truncate opacity-80">{b.serviceName}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DayView({
  current,
  bookingsOn,
}: {
  current: Date
  bookingsOn: (day: Date) => ReturnType<typeof Array.prototype.filter>
}) {
  const dayBookings = bookingsOn(current) as unknown as (AgendaBooking & { dateObj: Date })[]

  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      {dayBookings.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No hay turnos este día.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {dayBookings.map((b) => (
            <li key={b.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-sm font-semibold text-foreground">
                  {format(b.dateObj, "HH:mm")}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{b.clientName}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {[b.serviceName, b.professionalName].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                  STATUS_BADGE_STYLES[b.status] ?? STATUS_BADGE_STYLES.pendiente
                )}
              >
                {STATUS_LABELS[b.status] ?? b.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
