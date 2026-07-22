import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { BLOG_POSTS } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guías prácticas sobre gestión de spas: agenda, equipo, reservas online y cómo reducir inasistencias.",
  alternates: { canonical: "/blog" },
}

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <span className="text-xs font-semibold tracking-[0.18em] text-secondary uppercase">
        Blog de Spapp
      </span>
      <h1 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">
        Guías para administrar tu spa
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        Ideas prácticas sobre agenda, equipo y reservas para spas y centros
        de bienestar.
      </p>

      <div className="mt-12 divide-y divide-border border-t border-border">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-2 py-8 first:pt-8"
          >
            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <span aria-hidden>·</span>
              <span>{post.readingTime} de lectura</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground transition-colors group-hover:text-secondary">
              {post.title}
            </h2>
            <p className="text-muted-foreground">{post.excerpt}</p>
            <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
              Leer más <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
