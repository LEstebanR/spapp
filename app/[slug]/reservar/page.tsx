import { notFound } from "next/navigation"

import { BookingForm } from "@/app/[slug]/reservar/booking-form"
import { SpaNav } from "@/app/[slug]/spa-nav"
import { prisma } from "@/lib/prisma"

export default async function ReservarPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ service?: string }>
}) {
  const { slug } = await params
  const { service } = await searchParams
  const spa = await prisma.spa.findUnique({ where: { slug } })
  if (!spa) notFound()

  const [services, professionals] = await Promise.all([
    prisma.service.findMany({
      where: { spaId: spa.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true, durationMinutes: true },
    }),
    prisma.professional.findMany({
      where: { spaId: spa.id, active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])

  const initialServiceId = services.some((s) => s.id === service) ? service : undefined

  return (
    <main className="min-h-screen bg-muted/40">
      <SpaNav slug={spa.slug} salonName={spa.salonName} logoUrl={spa.logoUrl} />
      <div className="px-5 pt-[calc(6rem+env(safe-area-inset-top))] pb-12 sm:px-6">
        <div className="mx-auto max-w-lg">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Reserva en {spa.salonName}
          </h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            Te confirmamos por teléfono. No necesitas crear una cuenta.
          </p>
          <BookingForm
            slug={spa.slug}
            services={services}
            professionals={professionals}
            initialServiceId={initialServiceId}
          />
        </div>
      </div>
    </main>
  )
}
