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
  initialCity,
  initialDepartment,
  initialLatitude,
  initialLongitude,
}: {
  initialAddress: string
  initialCity: string
  initialDepartment: string
  initialLatitude: number | null
  initialLongitude: number | null
}) {
  const router = useRouter()
  const [address, setAddress] = useState(initialAddress)
  const [city, setCity] = useState(initialCity)
  const [department, setDepartment] = useState(initialDepartment)
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
      await updateLocation({
        address,
        city,
        department,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
      })
      setSaved(true)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <MapPicker
        latitude={coords?.lat}
        longitude={coords?.lng}
        onChange={(lat, lng, place) => {
          setCoords({ lat, lng })
          if (place?.city) setCity(place.city)
          if (place?.department) setDepartment(place.department)
          setSaved(false)
        }}
      />

      <div className="space-y-1.5">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
            setSaved(false)
          }}
          placeholder="Ej. Cra 70 #45-12"
        />
        <p className="text-xs text-muted-foreground">
          Escríbela tú — el mapa solo ubica el punto y llena ciudad/departamento.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              setSaved(false)
            }}
            placeholder="Ej. Medellín"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="department">Departamento</Label>
          <Input
            id="department"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value)
              setSaved(false)
            }}
            placeholder="Ej. Antioquia"
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {saved ? <Check className="h-4 w-4" /> : isPending ? "Guardando…" : "Guardar ubicación"}
      </Button>
    </form>
  )
}
