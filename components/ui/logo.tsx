import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

export function Logo({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark"
  className?: string
}) {
  const textColor = variant === "light" ? "text-white" : "text-dark"

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-bold tracking-wide",
            textColor
          )}
        >
          Spapp
        </span>
        <span className="mt-0.5 text-[9px] font-semibold tracking-[0.18em] text-secondary uppercase">
          Gestión de spa
        </span>
      </span>
    </div>
  )
}
