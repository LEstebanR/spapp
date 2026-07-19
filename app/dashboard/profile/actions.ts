"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function updateAvatar(imageUrl: string) {
  const session = await getServerSession()
  if (!session) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/profile")
}

export async function savePushSubscription(subscription: {
  endpoint: string
  keys: { p256dh: string; auth: string }
}) {
  const session = await getServerSession()
  if (!session) throw new Error("Unauthorized")

  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      userId: session.user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    update: {
      userId: session.user.id,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  })
}

export async function removePushSubscription(endpoint: string) {
  const session = await getServerSession()
  if (!session) throw new Error("Unauthorized")

  await prisma.pushSubscription
    .delete({ where: { endpoint, userId: session.user.id } })
    .catch(() => {})
}

export async function updateName(name: string) {
  const session = await getServerSession()
  if (!session) throw new Error("Unauthorized")

  const trimmed = name.trim()
  if (!trimmed) throw new Error("El nombre no puede estar vacío")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: trimmed },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/profile")
}
