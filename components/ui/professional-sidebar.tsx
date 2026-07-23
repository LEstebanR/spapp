"use client"

import Link from "next/link"
import { ExternalLink, Home } from "lucide-react"

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

export function ProfessionalSidebar({ spa }: { spa: { slug: string } }) {
  const { isMobile, setOpenMobile } = useSidebar()

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false)
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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive
                  className="cursor-pointer max-md:h-14 max-md:gap-3 max-md:text-base max-md:[&>svg]:size-5"
                  asChild
                >
                  <Link href="/dashboard" onClick={closeOnMobile}>
                    <Home /> Mi agenda
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
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
