import Link from "next/link"
import { ArrowRight, Check, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"

const TURNOS = [
  { time: "10:00", client: "Mariana G.", service: "Masaje relajante", status: "Confirmado" },
  { time: "11:30", client: "Camilo R.", service: "Facial hidratante", status: "Confirmado" },
  { time: "13:00", client: "Laura P.", service: "Piedras volcánicas", status: "Pendiente" },
]

function TurnosMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <p className="font-display text-lg font-bold text-foreground">
              Turnos de hoy
            </p>
            <p className="text-xs text-muted-foreground">Jueves, 18 de julio</p>
          </div>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            3 reservas
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {TURNOS.map((turno) => (
            <div
              key={turno.time}
              className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2.5"
            >
              <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Clock className="h-3.5 w-3.5 text-secondary" strokeWidth={2} />
                {turno.time}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {turno.client}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {turno.service}
                </p>
              </div>
              <span
                className={
                  turno.status === "Confirmado"
                    ? "rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] font-semibold text-accent-foreground"
                    : "rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary"
                }
              >
                {turno.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -top-4 -left-5 hidden animate-fade-up items-center gap-2 rounded-full border border-border bg-white px-4 py-2 shadow-lg sm:flex">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary">
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </div>
        <span className="text-xs font-bold text-foreground">Turno confirmado</span>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-dark pt-[76px]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.85) 50%, rgba(43,188,179,0.18) 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-6 md:grid-cols-2 md:items-center md:py-28 lg:px-8">
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/80 uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-1.5 w-1.5 animate-pulse-ring rounded-full bg-secondary" />
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            </span>
            Para spas y centros de bienestar
          </span>

          <h1 className="font-display text-4xl leading-[1.15] font-bold text-white sm:text-5xl lg:text-6xl">
            Los turnos de tu spa,{" "}
            <em className="text-secondary italic">sin enredos</em>.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
            Spapp organiza la agenda de tu equipo y tus clientes en un solo
            lugar: quién atiende, a qué hora y qué servicio, sin planillas ni
            grupos de WhatsApp.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-14 px-8" asChild>
              <Link href="/login">
                Iniciar sesión con Google <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 border-white/30 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <a href="#como-funciona">Ver cómo funciona</a>
            </Button>
          </div>
        </div>

        <TurnosMockup />
      </div>
    </section>
  )
}
