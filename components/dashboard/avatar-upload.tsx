"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2 } from "lucide-react"

import { updateAvatar } from "@/app/dashboard/profile/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function AvatarUpload({
  name,
  image,
}: {
  name?: string | null
  image?: string | null
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null | undefined>(image)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setIsUploading(true)
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      await updateAvatar(url)
      setPreview(url)
      router.refresh()
    } catch {
      setError("No se pudo subir la imagen. Intenta de nuevo.")
      setPreview(image)
    } finally {
      setIsUploading(false)
      URL.revokeObjectURL(objectUrl)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="h-24 w-24 border border-border">
          <AvatarImage src={preview ?? ""} alt={name ?? ""} />
          <AvatarFallback className="text-2xl">
            {name?.charAt(0).toUpperCase() ?? ""}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white shadow-md transition-transform hover:scale-105",
            isUploading && "pointer-events-none opacity-70"
          )}
          aria-label="Cambiar foto de perfil"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>

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
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
