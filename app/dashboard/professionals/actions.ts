"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

export async function createProfessional(data: {
  name: string
  professionalTypeId: string | null
}) {
  const spa = await requireCurrentSpa()

  const name = data.name.trim()
  if (!name) throw new Error("El nombre es obligatorio")

  await prisma.professional.create({
    data: {
      spaId: spa.id,
      name,
      professionalTypeId: data.professionalTypeId || null,
      // hours stays null: falls back to the spa's hours live (see
      // parseHours(p.hours ?? spa.hours) at query time) until the owner
      // sets custom hours on this professional's own detail page. Copying
      // a snapshot here would silently go stale the next time spa hours
      // are edited in Settings.
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/professionals")
  revalidatePath(`/${spa.slug}/reservar`)
}

export async function toggleProfessionalActive(id: string, active: boolean) {
  const spa = await requireCurrentSpa()

  await prisma.professional.update({
    where: { id, spaId: spa.id },
    data: { active },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/professionals")
  revalidatePath(`/${spa.slug}/reservar`)
}
