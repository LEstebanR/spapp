export type BlogPost = {
  slug: string
  title: string
  description: string
  keywords: string[]
  publishedAt: string // ISO date
  readingTime: string
  excerpt: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "como-elegir-software-para-tu-spa",
    title: "Cómo elegir un software para gestionar tu spa",
    description:
      "Las funciones que de verdad importan al elegir un sistema de gestión para tu spa o centro de bienestar: agenda, equipo, reservas online y más.",
    keywords: [
      "software para spa",
      "sistema de gestión para spa",
      "programa para administrar un spa",
      "software para centros de estética",
    ],
    publishedAt: "2026-06-02",
    readingTime: "6 min",
    excerpt:
      "Planillas, grupos de WhatsApp y cuadernos funcionan hasta que el spa crece. Esto es lo que debe tener un software de gestión antes de que decidas pagar por él.",
  },
  {
    slug: "como-reducir-inasistencias-en-tu-spa",
    title: "Cómo reducir las inasistencias (no-shows) en tu spa",
    description:
      "Estrategias prácticas y recordatorios automáticos por WhatsApp para que menos clientes falten a su turno sin avisar.",
    keywords: [
      "reducir inasistencias spa",
      "no-shows spa",
      "recordatorios de citas whatsapp",
      "clientes que no llegan a la cita",
    ],
    publishedAt: "2026-06-16",
    readingTime: "5 min",
    excerpt:
      "Un turno vacío es un espacio que ya no puedes vender ese día. Así reducen las inasistencias los spas que mejor cuidan su agenda.",
  },
  {
    slug: "como-organizar-la-agenda-de-tu-spa",
    title: "Cómo organizar la agenda de tu spa y evitar cruces de turnos",
    description:
      "Cómo estructurar horarios, profesionales y servicios para que la agenda de tu spa no dependa de la memoria de nadie.",
    keywords: [
      "agenda para spa",
      "organizar turnos spa",
      "evitar cruces de citas",
      "horarios de profesionales spa",
    ],
    publishedAt: "2026-06-30",
    readingTime: "6 min",
    excerpt:
      "Dos clientes en la misma silla a la misma hora, o una masajista con la agenda llena y otra sin nada que hacer. Así se evita.",
  },
  {
    slug: "beneficios-de-reservas-online-para-tu-spa",
    title: "Beneficios de tener una página de reservas online para tu spa",
    description:
      "Por qué dejar que tus clientes agenden solos desde una página propia reduce mensajes, ausencias y trabajo administrativo.",
    keywords: [
      "reservas online para spa",
      "página web para spa",
      "agendar citas online",
      "reservar turno por internet",
    ],
    publishedAt: "2026-07-07",
    readingTime: "5 min",
    excerpt:
      "Cada vez que alguien tiene que escribirte para preguntar disponibilidad, pierdes tiempo tú y lo pierde tu cliente. Hay una forma más simple.",
  },
  {
    slug: "como-estructurar-tu-equipo-de-profesionales",
    title: "Cómo estructurar tu equipo de profesionales para escalar tu spa",
    description:
      "Roles, tipos de profesional, horarios individuales y servicios asignados: la base para crecer tu spa sin perder el control.",
    keywords: [
      "equipo de trabajo para spa",
      "gestionar terapeutas spa",
      "escalar un spa",
      "administrar personal de spa",
    ],
    publishedAt: "2026-07-14",
    readingTime: "6 min",
    excerpt:
      "Contratar a la primera masajista es fácil. El problema llega con la tercera, la cuarta, y la agenda que ya no cuadra en tu cabeza.",
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
