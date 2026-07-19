import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BarChart3 } from "lucide-react"

import { updateProfessionalHours } from "@/app/dashboard/professionals/[id]/actions"
import { ProfessionalAvatarUpload } from "@/components/dashboard/professional-avatar-upload"
import { BusinessHoursForm } from "@/components/dashboard/business-hours-form"
import { ProfessionalServicesForm } from "@/components/dashboard/professional-services-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { parseHours } from "@/lib/hours"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

export default async function ProfessionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const spa = await requireCurrentSpa()
  const [professional, services] = await Promise.all([
    prisma.professional.findUnique({
      where: { id, spaId: spa.id },
      include: {
        professionalType: { select: { name: true } },
        services: { select: { id: true } },
      },
    }),
    prisma.service.findMany({
      where: { spaId: spa.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true, durationMinutes: true },
    }),
  ])
  if (!professional) notFound()

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/dashboard/professionals"
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Profesionales
      </Link>

      <h1 className="font-display text-3xl font-bold text-foreground">
        {professional.name}
      </h1>
      {professional.professionalType && (
        <p className="mt-1 text-muted-foreground">
          {professional.professionalType.name}
        </p>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Foto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfessionalAvatarUpload
            professionalId={professional.id}
            name={professional.name}
            avatarUrl={professional.avatarUrl}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Servicios que realiza</CardTitle>
          <CardDescription>
            Solo estos servicios se le podrán asignar al reservar un turno.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfessionalServicesForm
            professionalId={professional.id}
            services={services}
            initialServiceIds={professional.services.map((s) => s.id)}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Horarios disponibles</CardTitle>
          <CardDescription>
            Los días y horas en que {professional.name.split(" ")[0]} atiende.
            Si no se define, se asume el horario general del spa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessHoursForm
            initialHours={parseHours(professional.hours)}
            onSave={updateProfessionalHours.bind(null, professional.id)}
            label="Guardar horario"
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-secondary" /> Analytics
          </CardTitle>
          <CardDescription>
            Próximamente: turnos atendidos, servicios más pedidos y más.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
