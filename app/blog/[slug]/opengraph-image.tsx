import { ImageResponse } from "next/og"

import { getBlogPost } from "@/lib/blog"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  const title = post?.title ?? "Spapp"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #1a1a1a 0%, #1a1a1a 55%, #2bbcb3 130%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 48,
              height: 48,
              borderRadius: 24,
              background: "#2BBCB3",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 100 100">
              <path
                d="M50 10 L58 42 L90 50 L58 58 L50 90 L42 58 L10 50 L42 42 Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#FFFFFF" }}>
            Spapp — Blog
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#FFFFFF",
            maxWidth: 980,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  )
}
