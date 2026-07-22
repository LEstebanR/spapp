import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { BLOG_POST_CONTENT } from "@/components/blog/post-content"
import { BLOG_POSTS, getBlogPost } from "@/lib/blog"
import { getSiteUrl } from "@/lib/site"

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      url: `/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const Content = BLOG_POST_CONTENT[slug]
  const siteUrl = getSiteUrl()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Organization", name: "Spapp" },
    publisher: { "@type": "Organization", name: "Spapp" },
  }

  return (
    <article className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="mb-8 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Blog
      </Link>

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

      <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>

      <div className="mt-10">
        <Content />
      </div>

      <div className="mt-14 rounded-2xl bg-muted p-6 text-center sm:p-8">
        <p className="font-display text-xl font-bold text-foreground">
          ¿Listo para organizar tu spa?
        </p>
        <p className="mt-2 text-muted-foreground">
          Spapp organiza tu agenda, tu equipo y tus reservas online en un
          solo lugar.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_4px_16px_rgba(244,132,110,0.35)] transition-all hover:bg-primary/90"
        >
          Empieza gratis
        </Link>
      </div>
    </article>
  )
}
