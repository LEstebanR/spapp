"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"
import { Search, X, MapPin } from "lucide-react"

const COLOMBIA_CENTER: [number, number] = [4.711, -74.0721]
const DEFAULT_ZOOM = 5
const PICKED_ZOOM = 15

function createPinIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;
      background:#2BBCB3;
      border:3px solid #fff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg) translate(-4px,-4px);
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  })
}

type NominatimAddress = {
  city?: string
  town?: string
  village?: string
  municipality?: string
  county?: string
  state?: string
}

type NominatimResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address?: NominatimAddress
}

export type Place = { city?: string; department?: string }

function toPlace(address?: NominatimAddress): Place {
  return {
    city: address?.city || address?.town || address?.village || address?.municipality || address?.county,
    department: address?.state,
  }
}

function parseDisplayName(raw: string): { main: string; context: string } {
  const parts = raw.split(", ")
  const main = parts[0] ?? raw
  const context = parts
    .slice(1)
    .filter((p) => p.toLowerCase() !== "colombia")
    .join(", ")
  return { main, context }
}

function ClickHandler({ onClickPick }: { onClickPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onClickPick(e.latlng.lat, e.latlng.lng) } })
  return null
}

function FlyTo({ coords, zoom }: { coords: [number, number] | null; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    if (coords) map.flyTo(coords, zoom, { duration: 0.8 })
  }, [coords, zoom, map])
  return null
}

async function reverseGeocode(lat: number, lng: number): Promise<Place | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { "Accept-Language": "es" } }
    )
    const data: { address?: NominatimAddress } = await res.json()
    return toPlace(data.address)
  } catch {
    return null
  }
}

type Props = {
  latitude?: number | null
  longitude?: number | null
  onChange: (lat: number, lng: number, place?: Place) => void
}

export default function MapPicker({ latitude, longitude, onChange }: Props) {
  const hasInitial = latitude != null && longitude != null
  const [position, setPosition] = useState<[number, number] | null>(
    hasInitial ? [latitude!, longitude!] : null
  )
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(
    hasInitial ? [latitude!, longitude!] : null
  )
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<NominatimResult[]>([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pinIcon] = useState<L.DivIcon>(() => createPinIcon())
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setResults([])
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  function place(lat: number, lng: number, fly: boolean, knownPlace?: Place) {
    setPosition([lat, lng])
    onChange(lat, lng, knownPlace)
    if (fly) setFlyTarget([lat, lng])

    if (!knownPlace) {
      reverseGeocode(lat, lng).then((resolved) => {
        if (resolved) onChange(lat, lng, resolved)
      })
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setResults([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&countrycodes=co&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "es" } }
        )
        const data: NominatimResult[] = await res.json()
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 500)
  }

  function selectResult(r: NominatimResult) {
    setQuery(r.display_name.split(",")[0])
    setResults([])
    place(parseFloat(r.lat), parseFloat(r.lon), true, toPlace(r.address))
  }

  function handleClear() {
    setPosition(null)
  }

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar ciudad o lugar…"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-transparent pr-4 pl-9 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50 focus:outline-none"
        />
        {searching && (
          <div className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
        )}
        {results.length > 0 && (
          <ul className="absolute top-full right-0 left-0 z-[1000] mt-1 overflow-hidden rounded-xl border border-border bg-white shadow-xl">
            {results.map((r, i) => {
              const { main, context } = parseDisplayName(r.display_name)
              return (
                <li key={r.place_id} className={i > 0 ? "border-t border-border" : ""}>
                  <button
                    type="button"
                    onClick={() => selectResult(r)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <p className="truncate text-sm leading-tight font-semibold text-foreground">
                      {main}
                    </p>
                    {context && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {context}
                      </p>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div
        className="relative isolate overflow-hidden rounded-xl border border-border"
        style={{ height: 300 }}
      >
        <MapContainer
          center={flyTarget ?? COLOMBIA_CENTER}
          zoom={flyTarget ? PICKED_ZOOM : DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ClickHandler onClickPick={(lat, lng) => place(lat, lng, false)} />
          <FlyTo coords={flyTarget} zoom={PICKED_ZOOM} />
          {position && (
            <Marker
              position={position}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend(e) {
                  const { lat, lng } = (e.target as L.Marker).getLatLng()
                  place(lat, lng, false)
                },
              }}
            />
          )}
        </MapContainer>

        {!position && (
          <div className="pointer-events-none absolute inset-0 z-[500] flex items-end justify-center pb-4">
            <div className="rounded-full bg-dark/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              Toca el mapa para fijar la ubicación
            </div>
          </div>
        )}
      </div>

      {position && (
        <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Quitar
          </button>
        </div>
      )}
    </div>
  )
}
