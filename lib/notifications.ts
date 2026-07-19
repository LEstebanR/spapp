import { prisma } from "@/lib/prisma"

export async function createNotification(
  userId: string,
  data: { title: string; body: string; url?: string }
) {
  await prisma.notification.create({
    data: { userId, title: data.title, body: data.body, url: data.url },
  })
}
