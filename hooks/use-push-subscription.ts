"use client"

import { useEffect, useState } from "react"

import { removePushSubscription, savePushSubscription } from "@/app/dashboard/profile/actions"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export type PushStatus = "checking" | "unsupported" | "denied" | "enabled" | "disabled"

export function usePushSubscription() {
  const [status, setStatus] = useState<PushStatus>("checking")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function check() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported")
        return
      }
      if (Notification.permission === "denied") {
        setStatus("denied")
        return
      }
      const registration = await navigator.serviceWorker.getRegistration()
      const subscription = await registration?.pushManager.getSubscription()
      setStatus(subscription ? "enabled" : "disabled")
    }
    check()
  }, [])

  async function enable() {
    setError(null)
    setIsLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        setStatus("denied")
        return
      }

      const registration = await navigator.serviceWorker.register("/sw.js")
      await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string
        ),
      })

      await savePushSubscription(
        subscription.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } }
      )
      setStatus("enabled")
    } catch (err) {
      console.error("[push] enable failed:", err)
      setError("No se pudo activar las notificaciones. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  async function disable() {
    setError(null)
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      const subscription = await registration?.pushManager.getSubscription()
      if (subscription) {
        await removePushSubscription(subscription.endpoint)
        await subscription.unsubscribe()
      }
      setStatus("disabled")
    } catch {
      setError("No se pudo desactivar las notificaciones.")
    } finally {
      setIsLoading(false)
    }
  }

  return { status, isLoading, error, enable, disable }
}
