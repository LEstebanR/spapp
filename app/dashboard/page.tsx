import Link from "next/link"
import { CalendarClock, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"
import { requireCurrentSpa } from "@/lib/spa"

export default async function DashboardPage() {
  const session = await getServerSession()
  const spa = await requireCurrentSpa()

  const [professionalCount, pendingCount] = await Promise.all([
    prisma.professional.count({ where: { spaId: spa.id, active: true } }),
    prisma.booking.count({ where: { spaId: spa.id, status: "pendiente" } }),
  ])

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-foreground">
        Hola, {session?.user.name?.split(" ")[0]}
      </h1>
      <p className="mt-1 text-muted-foreground">
        Este es el resumen de {spa.salonName}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/turnos">
          <Card className="transition-colors hover:bg-muted/60">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <CalendarClock className="h-5 w-5 text-accent-foreground" />
              </div>
              <CardTitle>Turnos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {pendingCount === 0
                ? "No hay solicitudes pendientes."
                : `${pendingCount} solicitud${pendingCount === 1 ? "" : "es"} pendiente${pendingCount === 1 ? "" : "s"}.`}
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/professionals">
          <Card className="transition-colors hover:bg-muted/60">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <CardTitle>Profesionales</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {professionalCount === 0
                ? "Todavía no has agregado a nadie."
                : `${professionalCount} activo${professionalCount === 1 ? "" : "s"}.`}
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
