"use server"

import { revalidatePath } from "next/cache"

import type { DayHours } from "@/lib/hours"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"
import { isValidSlugFormat, RESERVED_SLUGS } from "@/lib/slug"

function revalidateSettings(slug: string) {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/settings")
  revalidatePath(`/${slug}`)
  revalidatePath(`/${slug}/reservar`)
}

export async function updateSalonName(name: string) {
  const spa = await requireCurrentSpa()

  const trimmed = name.trim()
  if (!trimmed) throw new Error("El nombre del spa no puede estar vacío")

  await prisma.spa.update({ where: { id: spa.id }, data: { salonName: trimmed } })
  revalidateSettings(spa.slug)
}

export async function updateDescription(description: string) {
  const spa = await requireCurrentSpa()
  await prisma.spa.update({
    where: { id: spa.id },
    data: { description: description.trim() || null },
  })
  revalidateSettings(spa.slug)
}

export async function updateSlug(slug: string) {
  const spa = await requireCurrentSpa()

  const trimmed = slug.trim().toLowerCase()
  if (!isValidSlugFormat(trimmed)) {
    throw new Error("Usa solo minúsculas, números y guiones, sin espacios")
  }
  if (RESERVED_SLUGS.has(trimmed)) {
    throw new Error("Esa URL está reservada, elige otra")
  }

  const existing = await prisma.spa.findUnique({ where: { slug: trimmed } })
  if (existing && existing.id !== spa.id) {
    throw new Error("Esa URL ya está en uso")
  }

  await prisma.spa.update({ where: { id: spa.id }, data: { slug: trimmed } })
  revalidateSettings(spa.slug)
  revalidateSettings(trimmed)
}

export async function updateLogo(logoUrl: string) {
  const spa = await requireCurrentSpa()
  await prisma.spa.update({ where: { id: spa.id }, data: { logoUrl } })
  revalidateSettings(spa.slug)
}

export async function updateLocation(
  address: string,
  latitude: number | null,
  longitude: number | null
) {
  const spa = await requireCurrentSpa()
  await prisma.spa.update({
    where: { id: spa.id },
    data: { address, latitude, longitude },
  })
  revalidateSettings(spa.slug)
}

export async function updateHours(hours: DayHours[]) {
  const spa = await requireCurrentSpa()
  await prisma.spa.update({ where: { id: spa.id }, data: { hours } })
  revalidateSettings(spa.slug)
}

export async function createProfessionalType(name: string) {
  const spa = await requireCurrentSpa()

  const trimmed = name.trim()
  if (!trimmed) throw new Error("El nombre es obligatorio")

  const professionalType = await prisma.professionalType.create({
    data: { spaId: spa.id, name: trimmed },
  })
  revalidateSettings(spa.slug)
  return professionalType
}

export async function deleteProfessionalType(id: string) {
  const spa = await requireCurrentSpa()
  await prisma.professionalType.delete({ where: { id, spaId: spa.id } })
  revalidateSettings(spa.slug)
}

export async function createService(data: {
  name: string
  durationMinutes: number
  professionalTypeId: string | null
}) {
  const spa = await requireCurrentSpa()

  const name = data.name.trim()
  if (!name) throw new Error("El nombre es obligatorio")
  if (!Number.isFinite(data.durationMinutes) || data.durationMinutes <= 0) {
    throw new Error("La duración debe ser un número de minutos mayor a cero")
  }

  const service = await prisma.service.create({
    data: {
      spaId: spa.id,
      name,
      durationMinutes: data.durationMinutes,
      professionalTypeId: data.professionalTypeId || null,
    },
  })
  revalidateSettings(spa.slug)
  return service
}

export async function deleteService(id: string) {
  const spa = await requireCurrentSpa()
  await prisma.service.delete({ where: { id, spaId: spa.id } })
  revalidateSettings(spa.slug)
}
