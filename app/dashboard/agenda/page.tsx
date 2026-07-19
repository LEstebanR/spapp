import { AddBookingDialog } from "@/components/dashboard/add-booking-dialog"
import { AgendaCalendar, type AgendaBooking } from "@/components/dashboard/agenda-calendar"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const spa = await requireCurrentSpa()
  const { view } = await searchParams
  const initialView = view === "day" || view === "week" ? view : "month"

  const [bookings, services, professionals] = await Promise.all([
    prisma.booking.findMany({
      where: { spaId: spa.id, status: { not: "cancelado" } },
      include: {
        service: { select: { name: true } },
        professional: { select: { name: true } },
      },
    }),
    prisma.service.findMany({
      where: { spaId: spa.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true, durationMinutes: true },
    }),
    prisma.professional.findMany({
      where: { spaId: spa.id, active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, services: { select: { id: true } } },
    }),
  ])

  const agendaBookings: AgendaBooking[] = bookings.map((b) => ({
    id: b.id,
    clientName: b.clientName,
    clientPhone: b.clientPhone,
    date: b.date.toISOString(),
    status: b.status,
    serviceName: b.service?.name ?? null,
    professionalName: b.professional?.name ?? null,
  }))

  const professionalsWithServiceIds = professionals.map((p) => ({
    id: p.id,
    name: p.name,
    serviceIds: p.services.map((s) => s.id),
  }))

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Agenda
          </h1>
          <p className="mt-1 text-muted-foreground">
            Todos los turnos confirmados y por confirmar.
          </p>
        </div>
        <AddBookingDialog services={services} professionals={professionalsWithServiceIds} />
      </div>

      <div className="mt-8">
        <AgendaCalendar bookings={agendaBookings} initialView={initialView} />
      </div>
    </div>
  )
}
