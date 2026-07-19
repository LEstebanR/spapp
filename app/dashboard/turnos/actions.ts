"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

function revalidateTurnos() {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/turnos")
  revalidatePath("/dashboard/agenda")
  revalidatePath("/dashboard/clients")
}

export async function updateBookingStatus(id: string, status: string) {
  const spa = await requireCurrentSpa()

  const booking = await prisma.booking.findUnique({ where: { id, spaId: spa.id } })
  if (!booking) throw new Error("Turno no encontrado")

  if (status === "confirmado" && !booking.professionalId) {
    throw new Error("Asigna un profesional antes de confirmar este turno")
  }

  await prisma.booking.update({
    where: { id, spaId: spa.id },
    data: { status },
  })

  revalidateTurnos()
}

export async function assignBookingProfessional(id: string, professionalId: string) {
  const spa = await requireCurrentSpa()

  const professional = await prisma.professional.findUnique({
    where: { id: professionalId, spaId: spa.id },
  })
  if (!professional) throw new Error("Ese profesional no existe")

  await prisma.booking.update({
    where: { id, spaId: spa.id },
    data: { professionalId },
  })

  revalidateTurnos()
}
