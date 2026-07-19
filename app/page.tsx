import { redirect } from "next/navigation"

import { CTA } from "@/components/cta"
import { FAQ } from "@/components/faq"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Navbar } from "@/components/navbar"
import { Stats } from "@/components/stats"
import { WebsiteShowcase } from "@/components/website-showcase"
import { getServerSession } from "@/lib/session"

export default async function Home() {
  const session = await getServerSession()
  if (session) redirect("/dashboard")

  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />
      <Hero />
      <Features />
      <WebsiteShowcase />
      <HowItWorks />
      <Stats />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
