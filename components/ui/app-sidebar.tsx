"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarClock,
  CalendarDays,
  ExternalLink,
  Home,
  MessageSquare,
  Settings,
  User,
  Users,
  Users2,
} from "lucide-react"

import { Logo } from "@/components/ui/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const menu = [
  { icon: <Home />, label: "Inicio", href: "/dashboard" },
  { icon: <CalendarDays />, label: "Agenda", href: "/dashboard/agenda" },
  { icon: <CalendarClock />, label: "Turnos", href: "/dashboard/turnos" },
  { icon: <Users />, label: "Profesionales", href: "/dashboard/professionals" },
  { icon: <Users2 />, label: "Clientes", href: "/dashboard/clients" },
  { icon: <MessageSquare />, label: "Feedback", href: "/dashboard/feedback" },
]

const settingsMenu = [
  { icon: <User />, label: "Perfil", href: "/dashboard/profile" },
  { icon: <Settings />, label: "Configuración", href: "/dashboard/settings" },
]

export function AppSidebar({ spa }: { spa: { slug: string } }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const pathname = usePathname()

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false)
  }

  const renderItem = (option: (typeof menu)[number]) => {
    const isActive =
      option.href === "/dashboard"
        ? pathname === option.href
        : pathname.startsWith(option.href)

    return (
      <SidebarMenuItem key={option.href}>
        <SidebarMenuButton
          isActive={isActive}
          className="cursor-pointer max-md:h-14 max-md:gap-3 max-md:text-base max-md:[&>svg]:size-5"
          asChild
        >
          <Link href={option.href} onClick={closeOnMobile}>
            {option.icon} {option.label}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo variant="dark" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{menu.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenu.map(renderItem)}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="cursor-pointer max-md:h-14 max-md:gap-3 max-md:text-base max-md:[&>svg]:size-5"
                  asChild
                >
                  <Link href={`/${spa.slug}`} target="_blank" onClick={closeOnMobile}>
                    <ExternalLink /> Ver mi spa
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
