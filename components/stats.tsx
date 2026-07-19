const stats = [
  { value: "1 lugar", label: "Para ver la agenda completa" },
  { value: "3 pasos", label: "Para crear un turno" },
  { value: "0", label: "Planillas ni grupos de WhatsApp" },
  { value: "100%", label: "Pensado para tu equipo" },
]

export function Stats() {
  return (
    <section className="bg-dark py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${i > 0 ? "lg:pl-8" : ""}`}
            >
              <p className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-white/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
