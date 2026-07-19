import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { AddProfessionalDialog } from "@/components/dashboard/add-professional-dialog"
import { ProfessionalActiveToggle } from "@/components/dashboard/professional-active-toggle"
import { ProfessionalServiceFilter } from "@/components/dashboard/professional-service-filter"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

export default async function ProfessionalsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const spa = await requireCurrentSpa()
  const { service } = await searchParams

  const [professionals, professionalTypes, services] = await Promise.all([
    prisma.professional.findMany({
      where: {
        spaId: spa.id,
        ...(service ? { services: { some: { id: service } } } : {}),
      },
      orderBy: { createdAt: "asc" },
      include: { professionalType: { select: { name: true } } },
    }),
    prisma.professionalType.findMany({
      where: { spaId: spa.id },
      orderBy: { name: "asc" },
    }),
    prisma.service.findMany({
      where: { spaId: spa.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Profesionales
          </h1>
          <p className="mt-1 text-muted-foreground">
            El equipo que atiende en tu spa.
          </p>
        </div>
        <AddProfessionalDialog professionalTypes={professionalTypes} />
      </div>

      {services.length > 0 && (
        <div className="mt-6">
          <ProfessionalServiceFilter services={services} activeServiceId={service} />
        </div>
      )}

      <Card className="mt-6">
        <CardContent>
          {professionals.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {service
                ? "Ningún profesional presta ese servicio todavía."
                : "Todavía no has agregado profesionales."}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {professionals.map((pro) => (
                <li
                  key={pro.id}
                  className="relative flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/dashboard/professionals/${pro.id}`}
                    className="absolute inset-0 rounded-md transition-colors hover:bg-muted/60"
                    aria-label={pro.name}
                  />
                  <div className="pointer-events-none relative flex min-w-0 flex-1 items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={pro.avatarUrl ?? ""} alt={pro.name} />
                      <AvatarFallback>
                        {pro.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {pro.name}
                      </p>
                      {pro.professionalType && (
                        <p className="truncate text-sm text-muted-foreground">
                          {pro.professionalType.name}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                  <div className="relative">
                    <ProfessionalActiveToggle id={pro.id} active={pro.active} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
