"use server"

import { revalidatePath } from "next/cache"

import type { DayHours } from "@/lib/hours"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

function revalidateProfessional(id: string) {
  revalidatePath("/dashboard/professionals")
  revalidatePath(`/dashboard/professionals/${id}`)
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
