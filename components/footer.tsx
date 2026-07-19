import Link from "next/link"

import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="bg-dark py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <Link href="/">
          <Logo variant="light" />
        </Link>
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} Spapp. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
