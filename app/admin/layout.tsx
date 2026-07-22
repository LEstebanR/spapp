import Link from "next/link"

import { Logo } from "@/components/ui/logo"
import { requireAdmin } from "@/lib/roles"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="bg-dark">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/dashboard">
            <Logo variant="light" />
          </Link>
          <span className="text-xs font-semibold tracking-wide text-white/60 uppercase">
            Admin
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  )
}
