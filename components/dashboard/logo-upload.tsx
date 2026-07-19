"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"

import { updateLogo } from "@/app/dashboard/settings/actions"
import { cn } from "@/lib/utils"

export function LogoUpload({ logoUrl }: { logoUrl?: string | null }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null | undefined>(logoUrl)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload/logo", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      await updateLogo(url)
      setPreview(url)
      router.refresh()
    } catch {
      setError("No se pudo subir el logo. Intenta de nuevo.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className={cn(
          "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-border bg-muted transition-colors hover:border-secondary",
          isUploading && "pointer-events-none opacity-70"
        )}
      >
        {preview ? (
          <Image src={preview} alt="Logo" fill sizes="80px" className="object-cover" />
        ) : (
          <ImagePlus className="h-6 w-6 text-muted-foreground" strokeWidth={1.75} />
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
      </button>

      <div className="text-sm">
        <p className="font-medium text-foreground">Logo del spa</p>
        <p className="text-muted-foreground">
          PNG o JPG. Se recorta a un círculo, así que una foto cuadrada y
          centrada se ve mejor.
        </p>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}
