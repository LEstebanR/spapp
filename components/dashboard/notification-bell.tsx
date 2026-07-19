"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Bell, BellRing } from "lucide-react"

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/dashboard/notifications/actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Notification = {
  id: string
  title: string
  body: string
  url: string | null
  read: boolean
  createdAt: string
}

export function NotificationBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  async function refresh() {
    const data = await getNotifications()
    setNotifications(data.notifications)
    setUnreadCount(data.unreadCount)
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 30_000)
    return () => clearInterval(interval)
  }, [])

  async function handleClick(notification: Notification) {
    if (!notification.read) {
      await markNotificationRead(notification.id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      )
      setUnreadCount((c) => Math.max(0, c - 1))
    }
    setOpen(false)
    // Defer navigation a tick so Radix finishes closing the dropdown (and
    // releasing its scroll lock) before Next.js swaps the page out from
    // under it — otherwise the body can get stuck non-scrollable.
    if (notification.url) {
      const url = notification.url
      setTimeout(() => router.push(url), 0)
    }
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <DropdownMenu
      modal={false}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) refresh()
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-9 sm:w-9"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 sm:h-[18px] sm:w-[18px]" />
          ) : (
            <Bell className="h-5 w-5 sm:h-[18px] sm:w-[18px]" />
          )}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <p className="font-semibold text-foreground">Notificaciones</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs font-medium text-secondary hover:underline"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto border-t border-border">
          {notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No tienes notificaciones todavía.
            </p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleClick(n)}
                className={cn(
                  "block w-full border-b border-border px-3 py-2.5 text-left last:border-0 hover:bg-muted",
                  !n.read && "bg-accent/40"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  {!n.read && (
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </button>
            ))
          )}
        </div>
        <Link
          href="/dashboard/profile"
          onClick={() => setOpen(false)}
          className="block border-t border-border px-3 py-2.5 text-center text-xs font-medium text-secondary hover:underline"
        >
          Activar notificaciones push
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
