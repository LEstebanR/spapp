"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

import { sendProfessionalProfileCreatedEmail } from "@/lib/email"
import { linkProfessionalToExistingUser } from "@/lib/professional-link"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

export async function createProfessional(data: {
  name: string
  professionalTypeId: string | null
  email: string
}) {
  const spa = await requireCurrentSpa()

  const name = data.name.trim()
  if (!name) throw new Error("El nombre es obligatorio")
  const email = data.email.trim().toLowerCase()
  if (!email) throw new Error("El correo es obligatorio")

  let professional: { id: string }
  try {
    professional = await prisma.professional.create({
      data: {
        spaId: spa.id,
        name,
        professionalTypeId: data.professionalTypeId || null,
        email,
        // hours stays null: falls back to the spa's hours live (see
        // parseHours(p.hours ?? spa.hours) at query time) until the owner
        // sets custom hours on this professional's own detail page. Copying
        // a snapshot here would silently go stale the next time spa hours
        // are edited in Settings.
      },
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error("Ya tienes otro profesional con ese correo")
    }
    throw err
  }

  await linkProfessionalToExistingUser(professional.id, email)
  await sendProfessionalProfileCreatedEmail(email, {
    professionalName: name,
    spaName: spa.salonName,
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
