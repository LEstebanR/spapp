import Link from "next/link"

import { Logo } from "@/components/ui/logo"

const productLinks = [
  { label: "Funciones", href: "/#funciones" },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Preguntas frecuentes", href: "/#faq" },
]

const resourceLinks = [{ label: "Blog", href: "/blog" }]

export function Footer() {
  return (
    <footer className="bg-dark py-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link href="/">
              <Logo variant="light" />
            </Link>
            <p className="mt-4 text-sm text-white/50">
              Software de agenda y reservas para spas y centros de belleza.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div>
              <h3 className="text-sm font-semibold text-white">Producto</h3>
              <ul className="mt-4 space-y-3">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Recursos</h3>
              <ul className="mt-4 space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-sm text-white/50">
          © {new Date().getFullYear()} Spapp. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
