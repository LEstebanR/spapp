import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-dark py-24">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Organiza los turnos de tu spa hoy
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
          Inicia sesión con tu cuenta de Google y crea tu primer turno en
          minutos.
        </p>
        <div className="mt-10">
          <Button size="lg" className="h-14 px-8" asChild>
            <Link href="/login">
              Iniciar sesión con Google <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
