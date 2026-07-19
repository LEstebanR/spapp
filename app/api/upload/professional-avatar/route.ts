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
  const jpeg = await sharp(buffer)
    .rotate()
    .resize({ width: 256, height: 256, fit: "cover" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer()

  const filename = `professionals/${Date.now()}.jpg`
  const blob = await put(filename, jpeg, {
    access: "public",
    contentType: "image/jpeg",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })

  return NextResponse.json({ url: blob.url })
}
