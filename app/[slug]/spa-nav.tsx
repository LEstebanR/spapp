"use client"

import Link from "next/link"
import Image from "next/image"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SpaNav({
  slug,
  salonName,
  logoUrl,
}: {
  slug: string
  salonName: string
  logoUrl: string | null
}) {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 h-16 bg-dark/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-5 sm:px-6">
        <Link href={`/${slug}`} className="flex min-w-0 items-center gap-2.5">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={salonName}
              width={32}
              height={32}
              className="shrink-0 rounded-full bg-white object-contain p-0.5"
            />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </span>
          )}
          <span className="truncate font-display text-lg font-bold text-white">
            {salonName}
          </span>
        </Link>
        <Button size="sm" asChild>
          <Link href={`/${slug}/reservar`}>Reservar</Link>
        </Button>
      </div>
    </nav>
  )
}
