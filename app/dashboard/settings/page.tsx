import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { updateHours } from "@/app/dashboard/settings/actions"
import { BusinessHoursForm } from "@/components/dashboard/business-hours-form"
import { DescriptionForm } from "@/components/dashboard/description-form"
import { LogoUpload } from "@/components/dashboard/logo-upload"
import { ProfessionalTypesManager } from "@/components/dashboard/professional-types-manager"
import { SalonNameForm } from "@/components/dashboard/salon-name-form"
import { ServicesManager } from "@/components/dashboard/services-manager"
import { SlugForm } from "@/components/dashboard/slug-form"
import { SpaLocationForm } from "@/components/dashboard/spa-location-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { parseHours } from "@/lib/hours"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

export default async function SettingsPage() {
  const spa = await requireCurrentSpa()
  const [professionalTypes, services] = await Promise.all([
    prisma.professionalType.findMany({
      where: { spaId: spa.id },
      orderBy: { name: "asc" },
    }),
    prisma.service.findMany({
      where: { spaId: spa.id },
      orderBy: { name: "asc" },
      include: { professionalType: { select: { name: true } } },
    }),
  ])

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Configuración
          </h1>
          <p className="mt-1 text-muted-foreground">
            Información general de tu spa.
          </p>
        </div>
        <Link
          href={`/${spa.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
        >
          Ver página pública <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Nombre, logo y URL</CardTitle>
          <CardDescription>
            Se ven en toda la app y en la página pública de tu spa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LogoUpload logoUrl={spa.logoUrl} />
          <Separator />
          <SalonNameForm initialName={spa.salonName} />
          <Separator />
          <SlugForm initialSlug={spa.slug} />
          <Separator />
          <DescriptionForm initialDescription={spa.description ?? ""} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ubicación</CardTitle>
          <CardDescription>
            Se muestra en la página pública para que tus clientes te encuentren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SpaLocationForm
            initialAddress={spa.address ?? ""}
            initialCity={spa.city ?? ""}
            initialDepartment={spa.department ?? ""}
            initialLatitude={spa.latitude}
            initialLongitude={spa.longitude}
          />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Horario de servicio</CardTitle>
          <CardDescription>
            Define los días y horas en que tu spa atiende.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessHoursForm initialHours={parseHours(spa.hours)} onSave={updateHours} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tipos de profesional</CardTitle>
          <CardDescription>
            Los roles de tu equipo (ej. Masajista, Esteticista). Se usan para
            asignarlos a profesionales y servicios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfessionalTypesManager professionalTypes={professionalTypes} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Servicios</CardTitle>
          <CardDescription>
            Lo que tu spa ofrece, con su duración y el tipo de profesional que lo hace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServicesManager services={services} professionalTypes={professionalTypes} />
        </CardContent>
      </Card>
    </div>
  )
}
