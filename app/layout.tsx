import type { Metadata, Viewport } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import { getSiteUrl } from "@/lib/site"
import "./globals.css"

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const siteUrl = getSiteUrl()
const title = "Spapp — Gestión de spa"
const description =
  "Spapp es la app para administrar tu spa: turnos, equipo y agenda en un solo lugar. Reservas online, recordatorios automáticos y control de tu equipo de profesionales."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s — Spapp" },
  description,
  keywords: [
    "software para spa",
    "gestión de spa",
    "agenda para spa",
    "reservas online spa",
    "software para centros de estética",
  ],
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Spapp",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Spapp",
    title,
    description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
