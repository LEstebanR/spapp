import type { MetadataRoute } from "next"

import { BLOG_POSTS } from "@/lib/blog"
import { getSiteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...BLOG_POSTS.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
