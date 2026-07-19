"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"

export async function updateBookingStatus(id: string, status: string) {
  const spa = await requireCurrentSpa()

  await prisma.booking.update({
    where: { id, spaId: spa.id },
    data: { status },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/turnos")
}
