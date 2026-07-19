"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { NotificationBell } from "@/components/dashboard/notification-bell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { Loader2, LogOut } from "lucide-react"

type HeaderUser = {
  name: string
  email: string
  image?: string | null
}

export function Header({ user }: { user?: HeaderUser | null }) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="pt-safe sticky top-0 z-50 flex min-h-14 w-full items-center justify-between border-b bg-background px-4">
      <SidebarTrigger />

      <div className="flex items-center gap-1">
        <NotificationBell />

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.image ?? ""} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() ?? ""}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-2">
            <DropdownMenuLabel className="py-0 font-bold">
              {user?.name}
            </DropdownMenuLabel>
            <DropdownMenuLabel className="py-0 text-muted-foreground">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                if (isLoggingOut) {
                  e.preventDefault()
                  return
                }
                e.preventDefault()
                handleLogout()
              }}
              disabled={isLoggingOut}
              className="gap-2"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              {isLoggingOut ? "Cerrando sesión…" : "Cerrar sesión"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
