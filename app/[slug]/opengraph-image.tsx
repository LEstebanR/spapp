import { ImageResponse } from "next/og"

import { prisma } from "@/lib/prisma"

export const alt = "Reserva tu turno"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const spa = await prisma.spa.findUnique({ where: { slug } })
  const salonName = spa?.salonName ?? "Spapp"

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
        {spa?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={spa.logoUrl}
            width={140}
            height={140}
            style={{ borderRadius: 70, background: "#fff", objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              width: 120,
              height: 120,
              borderRadius: 60,
              background: "#2BBCB3",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="64" height="64" viewBox="0 0 100 100">
              <path
                d="M50 10 L58 42 L90 50 L58 58 L50 90 L42 58 L10 50 L42 42 Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
        )}
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 700,
            color: "#FFFFFF",
            marginTop: 36,
            textAlign: "center",
            maxWidth: 1000,
          }}
        >
          {salonName}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "rgba(255,255,255,0.75)",
            marginTop: 16,
          }}
        >
          Reserva tu turno online
        </div>
      </div>
    ),
    { ...size }
  )
}
