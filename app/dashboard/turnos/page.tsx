import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { BookingProfessionalAssign } from "@/components/dashboard/booking-professional-assign"
import { BookingStatusSelect } from "@/components/dashboard/booking-status-select"
import { Card, CardContent } from "@/components/ui/card"
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon"
import { BOOKING_STATUSES, STATUS_LABELS } from "@/lib/booking-status"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"
import { cn } from "@/lib/utils"
import { buildWhatsAppLink } from "@/lib/whatsapp"

export default async function TurnosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const spa = await requireCurrentSpa()
  const { status } = await searchParams
  const activeStatus = BOOKING_STATUSES.includes(status as (typeof BOOKING_STATUSES)[number])
    ? status
    : undefined

  const [bookings, professionals] = await Promise.all([
    prisma.booking.findMany({
      where: { spaId: spa.id, ...(activeStatus ? { status: activeStatus } : {}) },
      orderBy: { date: "asc" },
      include: {
        professional: { select: { name: true } },
        service: { select: { name: true } },
      },
    }),
    prisma.professional.findMany({
      where: { spaId: spa.id, active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, services: { select: { id: true } } },
    }),
  ])

  const filters = [{ value: undefined, label: "Todos" }, ...BOOKING_STATUSES.map((s) => ({
    value: s,
    label: STATUS_LABELS[s],
  }))]

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Turnos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Solicitudes de turno hechas desde tu página pública.
          </p>
        </div>
        <Link
          href={`/${spa.slug}/reservar`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
        >
          Ver página pública <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-1 rounded-full bg-muted p-1 sm:inline-flex">
        {filters.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `/dashboard/turnos?status=${f.value}` : "/dashboard/turnos"}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              activeStatus === f.value
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent>
          {bookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {activeStatus
                ? `No hay turnos con estado "${STATUS_LABELS[activeStatus]}".`
                : "Todavía no hay solicitudes de turno."}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {bookings.map((booking) => {
                const eligibleProfessionals = professionals
                  .filter((p) => p.services.some((s) => s.id === booking.serviceId))
                  .map((p) => ({ id: p.id, name: p.name }))

                const whatsappLink = buildWhatsAppLink(
                  booking.clientPhone,
                  `Hola ${booking.clientName.split(" ")[0]}, te escribimos de ${spa.salonName} por tu turno${booking.service ? ` de ${booking.service.name}` : ""}.`
                )

                return (
                  <li
                    key={booking.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">
                          {booking.clientName}{" "}
                          <span className="font-normal text-muted-foreground">
                            · {booking.clientPhone}
                          </span>
                        </p>
                        {whatsappLink && (
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#25D366]/10 px-2.5 py-1 text-xs font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
                          >
                            <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                            WhatsApp
                          </a>
                        )}
                      </div>
                      {booking.service && (
                        <p className="text-sm font-medium text-secondary">
                          {booking.service.name}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {booking.date.toLocaleDateString("es-CO", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        ·{" "}
                        {booking.date.toLocaleTimeString("es-CO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {booking.professional && ` · ${booking.professional.name}`}
                      </p>
                      {booking.notes && (
                        <p className="mt-0.5 text-sm text-muted-foreground italic">
                          “{booking.notes}”
                        </p>
                      )}
                      {!booking.professional && booking.status !== "cancelado" && (
                        <div className="mt-2">
                          <BookingProfessionalAssign
                            bookingId={booking.id}
                            professionals={eligibleProfessionals}
                          />
                        </div>
                      )}
                    </div>
                    <BookingStatusSelect id={booking.id} status={booking.status} />
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
