import { ImageResponse } from "next/og"

export const alt = "Spapp — Gestión de spa"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1a1a1a 0%, #1a1a1a 55%, #2bbcb3 130%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 120,
            borderRadius: 32,
            background: "#2BBCB3",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg width="64" height="64" viewBox="0 0 100 100">
            <path
              d="M50 10 L58 42 L90 50 L58 58 L50 90 L42 58 L10 50 L42 42 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: -2,
          }}
        >
          Spapp
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "rgba(255,255,255,0.75)",
            marginTop: 16,
          }}
        >
          Los turnos de tu spa, sin enredos
        </div>
      </div>
    ),
    { ...size }
  )
}
