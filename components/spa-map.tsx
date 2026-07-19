"use client"

import "leaflet/dist/leaflet.css"
import { useState } from "react"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import L from "leaflet"

export default function SpaMap({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) {
  const [pinIcon] = useState<L.DivIcon>(() =>
    L.divIcon({
      className: "",
      html: `<div style="
        width:28px;height:28px;
        background:#2BBCB3;border:3px solid #fff;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg) translate(-4px,-4px);
        box-shadow:0 2px 8px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 20],
    })
  )

  return (
    <div className="h-full min-h-[260px]">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude]} icon={pinIcon} />
      </MapContainer>
    </div>
  )
}
