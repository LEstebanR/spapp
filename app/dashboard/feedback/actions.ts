"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function submitFeedback(message: string) {
  const session = await getServerSession()
  if (!session) throw new Error("Unauthorized")

  const trimmed = message.trim()
  if (!trimmed) throw new Error("Escribe un mensaje antes de enviar")

  await prisma.feedback.create({
    data: { userId: session.user.id, message: trimmed },
  })
}
