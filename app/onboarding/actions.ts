"use server"

import { redirect } from "next/navigation"

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

  const slug = await generateUniqueSlug(trimmed)

  await prisma.spa.create({
    data: { ownerId: session.user.id, salonName: trimmed, slug },
  })

  redirect("/dashboard")
}
