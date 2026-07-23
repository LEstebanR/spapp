import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function getCurrentSpa() {
  const session = await getServerSession()
  if (!session) return null

  return prisma.spa.findUnique({ where: { ownerId: session.user.id } })
}

export async function requireCurrentSpa() {
  const spa = await getCurrentSpa()
  if (!spa) throw new Error("No spa found for the current user")
  return spa
}

// The professional profile a "professional"-role user has claimed (see
// lib/professional-link.ts) — this is how they reach the spa they work at,
// since they don't own it.
export async function getCurrentProfessional() {
  const session = await getServerSession()
  if (!session) return null

  return prisma.professional.findFirst({
    where: { userId: session.user.id },
    include: { spa: true },
  })
}
