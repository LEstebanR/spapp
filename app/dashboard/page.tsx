import Link from "next/link"
import { redirect } from "next/navigation"
import {
  CalendarClock,
  CalendarDays,
  ExternalLink,
  Settings,
  Sparkles,
  Users,
  Users2,
} from "lucide-react"
import { endOfDay, startOfDay } from "date-fns"

import { AgendaCalendar, type AgendaBooking } from "@/components/dashboard/agenda-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { getCurrentUserRole } from "@/lib/roles"
import { getServerSession } from "@/lib/session"
import { getCurrentProfessional, requireCurrentSpa } from "@/lib/spa"

export default async function DashboardPage() {
  const session = await getServerSession()
  const role = await getCurrentUserRole()

  if (role === "professional") {
    const professional = await getCurrentProfessional()
    if (!professional) redirect("/login")

    const bookings = await prisma.booking.findMany({
      where: { professionalId: professional.id, status: { not: "cancelado" } },
      include: { service: { select: { name: true } } },
    })

    const agendaBookings: AgendaBooking[] = bookings.map((b) => ({
      id: b.id,
      clientName: b.clientName,
      clientPhone: b.clientPhone,
      date: b.date.toISOString(),
      status: b.status,
      serviceName: b.service?.name ?? null,
      professionalName: professional.name,
    }))

    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Hola, {session?.user.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Esta es tu agenda en {professional.spa.salonName}.
        </p>

        <div className="mt-8">
          <AgendaCalendar bookings={agendaBookings} initialView="week" />
        </div>
      </div>
    )
  }

  const spa = await requireCurrentSpa()

  const now = new Date()
  const [todayCount, pendingCount, professionalCount, clientCount, serviceCount] =
    await Promise.all([
      prisma.booking.count({
        where: {
          spaId: spa.id,
          status: { not: "cancelado" },
          date: { gte: startOfDay(now), lte: endOfDay(now) },
        },
      }),
      prisma.booking.count({ where: { spaId: spa.id, status: "pendiente" } }),
      prisma.professional.count({ where: { spaId: spa.id, active: true } }),
      prisma.booking.count({ where: { spaId: spa.id } }),
      prisma.service.count({ where: { spaId: spa.id } }),
    ])

  const stats = [
    {
      icon: CalendarDays,
      title: "Agenda de hoy",
      href: "/dashboard/agenda?view=day",
      text:
        todayCount === 0
          ? "No hay turnos hoy."
          : `${todayCount} turno${todayCount === 1 ? "" : "s"} hoy.`,
    },
    {
      icon: CalendarClock,
      title: "Turnos",
      href: "/dashboard/turnos",
      text:
        pendingCount === 0
          ? "No hay solicitudes pendientes."
          : `${pendingCount} solicitud${pendingCount === 1 ? "" : "es"} pendiente${pendingCount === 1 ? "" : "s"}.`,
    },
    {
      icon: Users,
      title: "Profesionales",
      href: "/dashboard/professionals",
      text:
        professionalCount === 0
          ? "Todavía no has agregado a nadie."
          : `${professionalCount} activo${professionalCount === 1 ? "" : "s"}.`,
    },
    {
      icon: Users2,
      title: "Clientes",
      href: "/dashboard/clients",
      text:
        clientCount === 0
          ? "Todavía no tienes clientes."
          : `${clientCount} reserva${clientCount === 1 ? "" : "s"} en total.`,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-foreground">
        Hola, {session?.user.name?.split(" ")[0]}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Este es el resumen de {spa.salonName}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="h-full transition-colors hover:bg-muted/60">
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                  <stat.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <CardTitle>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {stat.text}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Settings className="h-4 w-4" />
          Configuración
          {serviceCount === 0 && (
            <span className="ml-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
              agrega tus servicios
            </span>
          )}
        </Link>
        <Link
          href={`/${spa.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Sparkles className="h-4 w-4" />
          Ver mi spa
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  )
}
