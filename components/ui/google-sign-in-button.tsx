"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })
  }

  return (
    <Button className="w-full" size="lg" onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Redirigiendo a Google…" : "Continuar con Google"}
    </Button>
  )
}
