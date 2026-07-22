import { prisma } from "@/lib/prisma"

// Only promotes the default "owner" role, and only if this account hasn't
// already claimed a spa of its own — never downgrades an existing owner/admin.
async function promoteToProfessionalIfUnclaimed(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (user?.role !== "owner") return

  const ownsASpa = await prisma.spa.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  })
  if (ownsASpa) return

  await prisma.user.update({ where: { id: userId }, data: { role: "professional" } })
}

// Called right after a new User row is created (first Google sign-in) —
// claims any professional profiles waiting for this email.
export async function linkProfessionalsToNewUser(user: { id: string; email: string }) {
  const result = await prisma.professional.updateMany({
    where: { email: user.email, userId: null },
    data: { userId: user.id },
  })
  if (result.count > 0) await promoteToProfessionalIfUnclaimed(user.id)
}

// Called when a spa owner sets/changes a professional's email — links it
// immediately if that person already has a Spapp account.
export async function linkProfessionalToExistingUser(professionalId: string, email: string) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (!user) return

  await prisma.professional.update({ where: { id: professionalId }, data: { userId: user.id } })
  await promoteToProfessionalIfUnclaimed(user.id)
}
