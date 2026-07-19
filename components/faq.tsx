import { ChevronDown } from "lucide-react"

import { Reveal } from "@/components/reveal"

const faqs = [
  {
    q: "¿Necesito instalar algo?",
    a: "No. Spapp funciona desde el navegador, en el computador o el celular.",
  },
  {
    q: "¿Cómo inicio sesión?",
    a: "Con tu cuenta de Google — no hay contraseñas nuevas que crear ni recordar.",
  },
  {
    q: "¿Varias personas del equipo pueden ver la agenda?",
    a: "Esa es justamente la idea: todo el equipo ve los mismos turnos, actualizados en tiempo real.",
  },
  {
    q: "¿Qué sigue después de los turnos?",
    a: "Estamos construyendo Spapp junto con quienes lo usan. Gestión de equipo, clientes y reportes son los siguientes pasos.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
            Preguntas frecuentes
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Resolvemos tus dudas
          </h2>
        </Reveal>

        <div className="divide-y divide-border">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="text-base font-semibold text-foreground sm:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-secondary transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
