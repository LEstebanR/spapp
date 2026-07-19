import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react"

import { SpaNav } from "@/app/[slug]/spa-nav"
import { Reveal } from "@/components/reveal"
import SpaMap from "@/components/spa-map-client"
import { Button } from "@/components/ui/button"
import { formatDuration } from "@/lib/duration"
import { DAY_LABELS, parseHours } from "@/lib/hours"
import { prisma } from "@/lib/prisma"

export default async function SpaPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const spa = await prisma.spa.findUnique({ where: { slug } })
  if (!spa) notFound()

  const services = await prisma.service.findMany({
    where: { spaId: spa.id },
    orderBy: { name: "asc" },
    include: { professionalType: { select: { name: true } } },
  })

  const hours = parseHours(spa.hours)
  const hasLocation = spa.latitude != null && spa.longitude != null
  const todayHours = hours.find((d) => d.day === new Date().getDay())

  return (
    <main className="min-h-screen bg-white">
      <SpaNav slug={spa.slug} salonName={spa.salonName} logoUrl={spa.logoUrl} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark pt-16">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.85) 55%, rgba(43,188,179,0.2) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-6 sm:py-28">
          {spa.logoUrl ? (
            <Image
              src={spa.logoUrl}
              alt={spa.salonName}
              width={88}
              height={88}
              className="mx-auto mb-6 rounded-full bg-white object-contain p-1.5 shadow-lg"
            />
          ) : (
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          )}

          {todayHours && (
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/80 uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-1.5 w-1.5 animate-pulse-ring rounded-full bg-secondary" />
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              </span>
              {todayHours.open
                ? `Hoy abrimos ${todayHours.from} – ${todayHours.to}`
                : "Hoy cerrado"}
            </span>
          )}

          <h1 className="font-display text-4xl leading-[1.1] font-bold text-white sm:text-6xl">
            {spa.salonName}
          </h1>

          {spa.description && (
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/75">
              {spa.description}
            </p>
          )}

          {spa.address && (
            <p className="mt-5 flex items-center justify-center gap-1.5 text-sm text-white/55">
              <MapPin className="h-4 w-4" /> {spa.address}
            </p>
          )}

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" className="h-14 px-8" asChild>
              <Link href={`/${spa.slug}/reservar`}>
                Reservar un turno <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            {services.length > 0 && (
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-white/30 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <a href="#servicios">Ver servicios</a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section id="servicios" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <Reveal className="mx-auto max-w-xl text-center">
              <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
                Servicios
              </p>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                Lo que hacemos
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.id} delay={i * 60}>
                  <Link
                    href={`/${spa.slug}/reservar?service=${s.id}`}
                    className="group block h-full rounded-2xl border border-border bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-secondary">
                      <Sparkles
                        className="h-5 w-5 text-accent-foreground transition-colors group-hover:text-white"
                        strokeWidth={1.75}
                      />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{s.name}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {formatDuration(s.durationMinutes)}
                      {s.professionalType && ` · ${s.professionalType.name}`}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary opacity-0 transition-opacity group-hover:opacity-100">
                      Reservar <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hours + location */}
      <section className="bg-muted/40 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <Reveal className="mx-auto mb-12 max-w-xl text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
              Visítanos
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Horario y ubicación
            </h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-border bg-white p-6">
                <h3 className="flex items-center gap-2 font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-secondary" /> Horario
                </h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {hours.map((d) => (
                    <li
                      key={d.day}
                      className="flex justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-muted-foreground">{DAY_LABELS[d.day]}</span>
                      <span
                        className={d.open ? "font-medium text-foreground" : "text-muted-foreground"}
                      >
                        {d.open ? `${d.from} – ${d.to}` : "Cerrado"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100}>
              {hasLocation ? (
                <div className="h-full overflow-hidden rounded-2xl border border-border">
                  <SpaMap latitude={spa.latitude!} longitude={spa.longitude!} />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Todavía no hay una ubicación registrada.
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-dark py-20 text-center sm:py-24">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <Reveal className="relative mx-auto max-w-lg px-5 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            ¿Lista para tu próxima cita?
          </h2>
          <div className="mt-8">
            <Button size="lg" className="h-14 px-8" asChild>
              <Link href={`/${spa.slug}/reservar`}>
                Reservar un turno <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      <footer className="bg-dark py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {spa.salonName}
      </footer>
    </main>
  )
}
