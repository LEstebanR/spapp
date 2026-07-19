"use server"

import { revalidatePath } from "next/cache"

import { generateSlots, isWithinOpenHours, parseHours } from "@/lib/hours"
import { createNotification } from "@/lib/notifications"
import { prisma } from "@/lib/prisma"
import { sendPushToUser } from "@/lib/push"

export type BookingInput = {
  slug: string
  clientName: string
  clientPhone: string
  serviceId: string
  professionalId: string | null
  date: string // "YYYY-MM-DD"
  time: string // "HH:mm"
  notes: string
}

// A slot only counts if it hasn't already passed today — keeps this in sync
// with getAvailableSlots below, so a professional is never listed as
// available when they actually have zero bookable times left that day.
function dropPastSlots(slots: string[], date: Date): string[] {
  const now = new Date()
  if (date.toDateString() !== now.toDateString()) return slots
  const nowStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  return slots.filter((s) => s > nowStr)
}

export async function getAvailableProfessionals(input: {
  slug: string
  serviceId: string
  date: string
}) {
  const spa = await prisma.spa.findUnique({ where: { slug: input.slug } })
  if (!spa) return []

  const service = await prisma.service.findUnique({ where: { id: input.serviceId } })
  if (!service || service.spaId !== spa.id) return []

  const date = new Date(`${input.date}T00:00:00`)
  if (Number.isNaN(date.getTime())) return []

  const professionals = await prisma.professional.findMany({
    where: {
      spaId: spa.id,
      active: true,
      services: { some: { id: input.serviceId } },
    },
    select: { id: true, name: true, hours: true },
  })

  return professionals
    .filter((p) => {
      const slots = generateSlots(parseHours(p.hours ?? spa.hours), date, service.durationMinutes)
      return dropPastSlots(slots, date).length > 0
    })
    .map((p) => ({ id: p.id, name: p.name }))
}

export async function getAvailableSlots(input: {
  slug: string
  serviceId: string
  professionalId: string | null
  date: string
}) {
  const spa = await prisma.spa.findUnique({ where: { slug: input.slug } })
  if (!spa) return []

  const service = await prisma.service.findUnique({ where: { id: input.serviceId } })
  if (!service || service.spaId !== spa.id) return []

  const date = new Date(`${input.date}T00:00:00`)
  if (Number.isNaN(date.getTime())) return []

  let slots: string[]

  if (input.professionalId) {
    const professional = await prisma.professional.findUnique({
      where: { id: input.professionalId, spaId: spa.id, active: true },
      select: { hours: true },
    })
    if (!professional) return []
    slots = generateSlots(parseHours(professional.hours ?? spa.hours), date, service.durationMinutes)
  } else {
    const professionals = await prisma.professional.findMany({
      where: { spaId: spa.id, active: true, services: { some: { id: service.id } } },
      select: { hours: true },
    })
    // A slot counts if at least one eligible professional is free then —
    // no need to also intersect with the spa's own hours, since each
    // professional's hours already fall back to the spa's live hours
    // whenever they haven't set their own.
    const union = new Set(
      professionals.flatMap((p) =>
        generateSlots(parseHours(p.hours ?? spa.hours), date, service.durationMinutes)
      )
    )
    slots = Array.from(union).sort()
  }

  return dropPastSlots(slots, date)
}

export async function createBooking(input: BookingInput) {
  const spa = await prisma.spa.findUnique({ where: { slug: input.slug } })
  if (!spa) throw new Error("Spa no encontrado")

  const clientName = input.clientName.trim()
  const clientPhone = input.clientPhone.trim()

  if (!clientName) throw new Error("Escribe tu nombre")
  if (!clientPhone) throw new Error("Escribe tu teléfono")
  if (!input.serviceId) throw new Error("Elige un servicio")
  if (!input.date || !input.time) throw new Error("Elige una fecha y hora")

  const date = new Date(`${input.date}T${input.time}:00`)
  if (Number.isNaN(date.getTime())) throw new Error("Fecha u hora inválida")
  if (date.getTime() < Date.now()) {
    throw new Error("Elige una fecha y hora futuras")
  }

  if (spa.hours && !isWithinOpenHours(parseHours(spa.hours), date, input.time)) {
    throw new Error("Elige un horario dentro del horario de atención del spa")
  }

  const service = await prisma.service.findUnique({ where: { id: input.serviceId } })
  if (!service || service.spaId !== spa.id) {
    throw new Error("Ese servicio ya no está disponible")
  }

  const eligibleProfessionals = await prisma.professional.findMany({
    where: {
      spaId: spa.id,
      active: true,
      services: { some: { id: service.id } },
    },
    select: { id: true, hours: true },
  })

  let professionalId: string | null = null
  if (input.professionalId) {
    const professional = eligibleProfessionals.find((p) => p.id === input.professionalId)
    if (!professional) {
      throw new Error("Ese profesional ya no está disponible para este servicio")
    }
    if (!isWithinOpenHours(parseHours(professional.hours ?? spa.hours), date, input.time)) {
      throw new Error("Ese profesional no atiende en ese horario")
    }
    professionalId = professional.id
  } else {
    const someoneAvailable = eligibleProfessionals.some((p) =>
      isWithinOpenHours(parseHours(p.hours ?? spa.hours), date, input.time)
    )
    if (eligibleProfessionals.length > 0 && !someoneAvailable) {
      throw new Error(
        "No hay profesionales disponibles para este servicio en ese horario"
      )
    }
  }

  await prisma.booking.create({
    data: {
      spaId: spa.id,
      clientName,
      clientPhone,
      serviceId: service.id,
      professionalId,
      date,
      notes: input.notes.trim() || null,
    },
  })

  revalidatePath("/dashboard/turnos")
  revalidatePath("/dashboard/clients")

  const notificationPayload = {
    title: "Nueva solicitud de turno",
    body: `${clientName} — ${service.name}, ${input.date} ${input.time}`,
    url: "/dashboard/turnos",
  }

  // In-app notification always gets created — push is a best-effort extra
  // for whoever has enabled browser notifications.
  await createNotification(spa.ownerId, notificationPayload)
  sendPushToUser(spa.ownerId, notificationPayload).catch((err) =>
    console.error("[push] sendPushToUser failed:", err)
  )
}
