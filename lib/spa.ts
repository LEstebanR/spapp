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
