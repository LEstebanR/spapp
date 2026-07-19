import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/ui/app-sidebar"
import { Header } from "@/components/ui/header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getCurrentSpa } from "@/lib/spa"
import { getServerSession } from "@/lib/session"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
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
