import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-[calc(76px+env(safe-area-inset-top))]">{children}</main>
      <Footer />
    </div>
  )
}
