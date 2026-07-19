import { ArrowRight, Sparkles } from "lucide-react"

import { Reveal } from "@/components/reveal"

function BrowserMock() {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-black/10">
      <div className="flex h-10 items-center gap-3 border-b border-border bg-muted px-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <div className="flex flex-1 justify-center">
          <div className="flex w-full max-w-[200px] items-center justify-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            spapp.com/tu-spa
          </div>
        </div>
      </div>

      <div className="relative bg-dark px-6 py-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <p className="font-display text-xl font-bold text-white">Tu Spa</p>
        <p className="mx-auto mt-2 max-w-[220px] text-xs text-white/60">
          Tu descripción, servicios, horario y ubicación en un solo lugar.
        </p>
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
          Reservar un turno <ArrowRight className="h-3 w-3" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4">
        {["Masajes", "Faciales", "Spa día"].map((label) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-muted/60 py-2 text-center text-[11px] font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

export function WebsiteShowcase() {
  return (
    <section className="bg-muted/40 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
            Tu página web
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Tu spa también se lleva su propia página
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            Al crear tu cuenta, Spapp genera automáticamente una página
            pública para tu negocio: logo, nombre, descripción, servicios,
            horario y ubicación con mapa — con un botón de reservar listo
            para compartir por WhatsApp, Instagram o Google.
          </p>
          <p className="mt-4 max-w-md text-muted-foreground">
            No tienes que construir nada. Se actualiza sola cada vez que
            cambias algo en Configuración.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <BrowserMock />
        </Reveal>
      </div>
    </section>
  )
}
