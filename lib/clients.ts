import { prisma } from "@/lib/prisma"

// One Client per (spaId, phone). Upserts on every booking so the client's
// name always reflects what was most recently entered for that phone.
export async function findOrCreateClient(spaId: string, phone: string, name: string) {
  const client = await prisma.client.upsert({
    where: { spaId_phone: { spaId, phone } },
    update: { name },
    create: { spaId, phone, name },
  })
  return client.id
}

export async function findClientByPhone(spaId: string, phone: string) {
  return prisma.client.findUnique({
    where: { spaId_phone: { spaId, phone: phone.trim() } },
    select: { name: true },
  })
}
