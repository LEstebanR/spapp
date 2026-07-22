export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 mb-4 font-display text-2xl font-bold text-foreground first:mt-0">
      {children}
    </h2>
  )
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mb-4 ml-5 list-disc space-y-2 leading-relaxed text-muted-foreground">
      {children}
    </ul>
  )
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>
}
