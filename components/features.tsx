import { CalendarClock, Users, BarChart3, Bell } from "lucide-react"

import { Reveal } from "@/components/reveal"

const features = [
  {
    icon: CalendarClock,
    title: "Turnos en un solo calendario",
    description:
      "Agenda cada cita con su terapeuta, servicio y duración. Se acabaron las planillas y los cruces de horario.",
    available: true,
  },
  {
    icon: Users,
    title: "Tu equipo, organizado",
    description:
      "Asigna terapeutas a cada turno y ve la carga de trabajo de todo el equipo de un vistazo.",
    available: false,
  },
  {
    icon: Bell,
    title: "Recordatorios automáticos",
    description:
      "Reduce las ausencias con recordatorios antes de cada cita, sin tener que escribir a cada cliente.",
    available: false,
  },
  {
    icon: BarChart3,
    title: "Reportes del negocio",
    description:
      "Entiende qué servicios y qué horarios se llenan más para tomar mejores decisiones.",
    available: false,
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
                {!feature.available && (
                  <span className="mt-4 inline-block rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    Próximamente
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
