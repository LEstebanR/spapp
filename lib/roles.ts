import { notFound, redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

// "owner" runs a spa, "admin" is Spapp staff, "professional" works at a spa.
export const ROLES = ["owner", "admin", "professional"] as const
export type Role = (typeof ROLES)[number]

export async function getCurrentUserRole(): Promise<Role | null> {
  const session = await getServerSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  return (user?.role as Role | undefined) ?? null
}

// Gate for the /admin views: unauthenticated users go to login, anyone
// logged in without the admin role gets a 404 instead of a redirect that
// would reveal the route exists.
export async function requireAdmin() {
  const session = await getServerSession()
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (user?.role !== "admin") notFound()

  return session
}
