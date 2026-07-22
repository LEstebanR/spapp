"use server"

import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"

import { generateUniqueSlug } from "@/lib/slug"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function createSpa(salonName: string) {
  const session = await getServerSession()
  if (!session) throw new Error("Unauthorized")

  const trimmed = salonName.trim()
  if (!trimmed) throw new Error("El nombre del spa no puede estar vacío")

  const existing = await prisma.spa.findUnique({
    where: { ownerId: session.user.id },
  })
  if (existing) redirect("/dashboard")

  // Retries guard against a race where two spas generate the same candidate
  // slug at once — the DB's unique constraint is the final word.
  const maxAttempts = 3
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const slug = await generateUniqueSlug(trimmed)
    try {
      await prisma.spa.create({
        data: { ownerId: session.user.id, salonName: trimmed, slug },
      })
      break
    } catch (err) {
      const isSlugConflict =
        err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
      if (!isSlugConflict || attempt === maxAttempts) throw err
    }
  }

  redirect("/dashboard")
}
