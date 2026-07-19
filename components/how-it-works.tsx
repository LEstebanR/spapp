import { Reveal } from "@/components/reveal"

const steps = [
  {
    number: "01",
    title: "Inicia sesión con Google",
    description: "Sin formularios ni contraseñas nuevas que recordar.",
  },
  {
    number: "02",
    title: "Crea un turno",
    description:
      "Elige la hora, el servicio y quién de tu equipo lo atiende.",
  },
  {
    number: "03",
    title: "Tu equipo ve la agenda del día",
    description:
      "Todos saben qué sigue, sin preguntar ni escribir por WhatsApp.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-muted py-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
            Cómo funciona
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            De cero a tu agenda del día en un minuto
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 100}>
              <div className="text-center sm:text-left">
                <span className="font-display text-4xl font-bold text-secondary/30">
                  {step.number}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
