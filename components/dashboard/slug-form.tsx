"use client"

import { useState, useTransition } from "react"
import { Check } from "lucide-react"

import { updateSlug } from "@/app/dashboard/settings/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SlugForm({ initialSlug }: { initialSlug: string }) {
  const [slug, setSlug] = useState(initialSlug)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    startTransition(async () => {
      try {
        await updateSlug(slug)
        setSaved(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo guardar")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor="slug">URL pública</Label>
      <div className="flex items-end gap-3">
        <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-md border border-input">
          <span className="shrink-0 border-r border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
            spapp.com/
          </span>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value.toLowerCase())
              setSaved(false)
              setError(null)
            }}
            className="border-0"
            required
          />
        </div>
        <Button type="submit" disabled={isPending || !slug.trim()}>
          {saved ? <Check className="h-4 w-4" /> : isPending ? "Guardando…" : "Guardar"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  )
}
