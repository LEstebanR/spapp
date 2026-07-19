import { CalendarDays, Globe, Users, Bell } from "lucide-react"

import { Reveal } from "@/components/reveal"

const features = [
  {
    icon: CalendarDays,
    title: "Agenda y turnos en un solo lugar",
    description:
      "Vista de mes, semana o día con todos los turnos confirmados y por confirmar. Agenda tú mismo o deja que lleguen desde tu página pública.",
  },
  {
    icon: Users,
    title: "Tu equipo, con su propio horario",
    description:
      "Cada profesional tiene su foto, sus servicios y su disponibilidad. Al reservar, solo aparece quien realmente puede atender ese servicio ese día.",
  },
  {
    icon: Globe,
    title: "Tu spa, con página propia",
    description:
      "Spapp genera una página pública con tu logo, servicios, horario y ubicación — lista para compartir en Instagram o Google, sin que sepas de tecnología.",
  },
  {
    icon: Bell,
    title: "Te enteras al instante",
    description:
      "Cada solicitud de turno llega a tu panel y, si quieres, como notificación push en tu navegador — sin refrescar la página para ver si hay algo nuevo.",
  },
]

export function Features() {
  return (
    <section id="funciones" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
            Funciones
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Todo lo que tu spa necesita para organizarse
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-border bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
                  <feature.icon
                    className="h-5 w-5 text-accent-foreground"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
