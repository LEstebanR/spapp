"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

import type { DayHours } from "@/lib/hours"
import { linkProfessionalToExistingUser } from "@/lib/professional-link"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

function revalidateProfessional(id: string) {
  revalidatePath("/dashboard/professionals")
  revalidatePath(`/dashboard/professionals/${id}`)
}

export async function updateProfessionalEmail(id: string, email: string) {
  const spa = await requireCurrentSpa()
  const trimmed = email.trim().toLowerCase()

  try {
    await prisma.professional.update({
      where: { id, spaId: spa.id },
      // Changing the email un-links any previous account claim — the new
      // address gets its own chance to link (or re-link) below.
      data: { email: trimmed || null, userId: null },
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error("Ya tienes otro profesional con ese correo")
    }
    throw err
  }

  if (trimmed) await linkProfessionalToExistingUser(id, trimmed)

  revalidateProfessional(id)
}

export async function updateProfessionalAvatar(id: string, avatarUrl: string) {
  const spa = await requireCurrentSpa()

  await prisma.professional.update({
    where: { id, spaId: spa.id },
    data: { avatarUrl },
  })

  revalidateProfessional(id)
}

export async function updateProfessionalHours(id: string, hours: DayHours[]) {
  const spa = await requireCurrentSpa()

  await prisma.professional.update({
    where: { id, spaId: spa.id },
    data: { hours },
  })

  revalidateProfessional(id)
}

export async function updateProfessionalServices(id: string, serviceIds: string[]) {
  const spa = await requireCurrentSpa()

  await prisma.professional.update({
    where: { id, spaId: spa.id },
    data: { services: { set: serviceIds.map((serviceId) => ({ id: serviceId })) } },
  })

  revalidateProfessional(id)
  revalidatePath(`/${spa.slug}/reservar`)
}
