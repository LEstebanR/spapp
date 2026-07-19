"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function getNotifications() {
  const session = await getServerSession()
  if (!session) return { notifications: [], unreadCount: 0 }

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
    prisma.notification.count({
      where: { userId: session.user.id, read: false },
    }),
  ])

  return {
    notifications: notifications.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() })),
    unreadCount,
  }
}

export async function markNotificationRead(id: string) {
  const session = await getServerSession()
  if (!session) throw new Error("Unauthorized")

  await prisma.notification.update({
    where: { id, userId: session.user.id },
    data: { read: true },
  })
  revalidatePath("/dashboard")
}

export async function markAllNotificationsRead() {
  const session = await getServerSession()
  if (!session) throw new Error("Unauthorized")

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  })
  revalidatePath("/dashboard")
}
