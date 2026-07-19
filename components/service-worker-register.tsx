"use client"

import { useEffect } from "react"

// Registered unconditionally (not just when push is enabled) so the app
// qualifies for "Add to Home Screen" / install prompts on Android and,
// once installed, opens as a standalone PWA on both Android and iOS.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {})
    }
  }, [])

  return null
}
