import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import sharp from "sharp"

import { auth } from "@/lib/auth"

const MAX_SIZE_BYTES = 8 * 1024 * 1024

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const form = await request.formData()
  const file = form.get("file") as File | null

  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Archivo inválido" }, { status: 400 })
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Máximo 8 MB por imagen" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  // cover (not contain): the logo always renders inside a circle across the
  // app, so a non-square upload (e.g. a phone photo) should crop to fill
  // that circle rather than letterbox with empty padding around it.
  const png = await sharp(buffer)
    .rotate()
    .resize({ width: 512, height: 512, fit: "cover" })
    .png()
    .toBuffer()

  const filename = `logos/${Date.now()}.png`
  const blob = await put(filename, png, {
    access: "public",
    contentType: "image/png",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })

  return NextResponse.json({ url: blob.url })
}
