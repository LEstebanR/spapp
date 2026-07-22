"use server"

import { revalidatePath } from "next/cache"

import { findOrCreateClient } from "@/lib/clients"
import { isValidPhone } from "@/lib/phone"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

export type ManualBookingInput = {
  clientName: string
  clientPhone: string
  serviceId: string
  professionalId: string | null
  date: string // "YYYY-MM-DD"
  time: string // "HH:mm"
  notes: string
}

export async function createManualBooking(input: ManualBookingInput) {
  const spa = await requireCurrentSpa()

  const clientName = input.clientName.trim()
  const clientPhone = input.clientPhone.trim()

  if (!clientName) throw new Error("Escribe el nombre del cliente")
  if (!clientPhone) throw new Error("Escribe el teléfono del cliente")
  if (!isValidPhone(clientPhone)) {
    throw new Error("Escribe un número de celular colombiano válido (10 dígitos)")
  }
  if (!input.serviceId) throw new Error("Elige un servicio")
  if (!input.date || !input.time) throw new Error("Elige una fecha y hora")

  const date = new Date(`${input.date}T${input.time}:00`)
  if (Number.isNaN(date.getTime())) throw new Error("Fecha u hora inválida")

  const service = await prisma.service.findUnique({
    where: { id: input.serviceId, spaId: spa.id },
  })
  if (!service) throw new Error("Ese servicio ya no está disponible")

  let professionalId: string | null = null
  if (input.professionalId) {
    const professional = await prisma.professional.findUnique({
      where: { id: input.professionalId, spaId: spa.id },
    })
    if (!professional) throw new Error("Ese profesional ya no está disponible")
    professionalId = professional.id
  }

  const clientId = await findOrCreateClient(spa.id, clientPhone, clientName)

  await prisma.booking.create({
    data: {
      spaId: spa.id,
      clientName,
      clientPhone,
      clientId,
      serviceId: service.id,
      professionalId,
      date,
      status: "confirmado",
      notes: input.notes.trim() || null,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/agenda")
  revalidatePath("/dashboard/turnos")
  revalidatePath("/dashboard/clients")
}
