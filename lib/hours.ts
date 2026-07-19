export type DayHours = {
  day: number // 0 = domingo … 6 = sábado (Date.getDay())
  open: boolean
  from: string // "HH:mm"
  to: string // "HH:mm"
}

export const DAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
]

export const DEFAULT_HOURS: DayHours[] = Array.from({ length: 7 }, (_, day) => ({
  day,
  open: day !== 0,
  from: "09:00",
  to: "19:00",
}))

export function parseHours(value: unknown): DayHours[] {
  if (!Array.isArray(value)) return DEFAULT_HOURS
  return DEFAULT_HOURS.map((fallback) => {
    const match = value.find(
      (d): d is DayHours => typeof d === "object" && d !== null && d.day === fallback.day
    )
    return match ?? fallback
  })
}

export function isWithinOpenHours(hours: DayHours[], date: Date, time: string) {
  const dayHours = hours.find((d) => d.day === date.getDay())
  if (!dayHours || !dayHours.open) return false
  return time >= dayHours.from && time <= dayHours.to
}

export function isDayOpen(hours: DayHours[], date: Date) {
  const dayHours = hours.find((d) => d.day === date.getDay())
  return Boolean(dayHours?.open)
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function toTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0")
  const m = (minutes % 60).toString().padStart(2, "0")
  return `${h}:${m}`
}

// Discrete bookable start times for a day, spaced every `stepMinutes`, each
// with enough room before closing to fit `durationMinutes`.
export function generateSlots(
  hours: DayHours[],
  date: Date,
  durationMinutes: number,
  stepMinutes = 30
): string[] {
  const dayHours = hours.find((d) => d.day === date.getDay())
  if (!dayHours || !dayHours.open) return []

  const start = toMinutes(dayHours.from)
  const end = toMinutes(dayHours.to)
  const slots: string[] = []
  for (let t = start; t + durationMinutes <= end; t += stepMinutes) {
    slots.push(toTimeString(t))
  }
  return slots
}
