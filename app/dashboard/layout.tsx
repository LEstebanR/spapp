import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/ui/app-sidebar"
import { Header } from "@/components/ui/header"
import { ProfessionalSidebar } from "@/components/ui/professional-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentUserRole } from "@/lib/roles"
import { getServerSession } from "@/lib/session"
import { getCurrentProfessional, getCurrentSpa } from "@/lib/spa"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const role = await getCurrentUserRole()

  if (role === "professional") {
    const professional = await getCurrentProfessional()
    if (!professional) redirect("/login")

    return (
      <SidebarProvider>
        <ProfessionalSidebar spa={professional.spa} />
        <main className="flex min-h-svh w-full flex-col">
          <Header user={session?.user} />
          <div className="flex-1">{children}</div>
        </main>
      </SidebarProvider>
    )
  }

  const spa = await getCurrentSpa()
  if (!spa) redirect("/onboarding")

  return (
    <SidebarProvider>
      <AppSidebar spa={spa} />
      <main className="flex min-h-svh w-full flex-col">
        <Header user={session?.user} />
        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  )
}
