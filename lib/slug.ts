import { prisma } from "@/lib/prisma"

// Real app routes at the root level — a spa can never claim these as its slug.
export const RESERVED_SLUGS = new Set([
  "login",
  "dashboard",
  "onboarding",
  "api",
  "reservar",
  "admin",
  "app",
  "www",
])

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 60)
}

export async function generateUniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "spa"
  let candidate = root
  let suffix = 2

  while (
    RESERVED_SLUGS.has(candidate) ||
    (await prisma.spa.findUnique({ where: { slug: candidate } }))
  ) {
    candidate = `${root}-${suffix}`
    suffix += 1
  }

  return candidate
}

export function isValidSlugFormat(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length >= 2 && slug.length <= 60
}
