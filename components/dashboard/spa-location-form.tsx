"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Check } from "lucide-react"

import { updateLocation } from "@/app/dashboard/settings/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MapPicker = dynamic(() => import("@/components/dashboard/map-picker"), {
  ssr: false,
})

export function SpaLocationForm({
  initialAddress,
  initialLatitude,
  initialLongitude,
}: {
  initialAddress: string
  initialLatitude: number | null
  initialLongitude: number | null
}) {
  const router = useRouter()
  const [address, setAddress] = useState(initialAddress)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    initialLatitude != null && initialLongitude != null
      ? { lat: initialLatitude, lng: initialLongitude }
      : null
  )
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await updateLocation(address, coords?.lat ?? null, coords?.lng ?? null)
      setSaved(true)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
            setSaved(false)
          }}
          placeholder="Ej. Cra 70 #45-12, Laureles, Medellín"
        />
      </div>

      <MapPicker
        latitude={coords?.lat}
        longitude={coords?.lng}
        onChange={(lat, lng, resolvedAddress) => {
          setCoords({ lat, lng })
          if (resolvedAddress) setAddress(resolvedAddress)
          setSaved(false)
        }}
      />

      <Button type="submit" disabled={isPending}>
        {saved ? <Check className="h-4 w-4" /> : isPending ? "Guardando…" : "Guardar ubicación"}
      </Button>
    </form>
  )
}
