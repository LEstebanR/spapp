import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

// Everything is public by default (spa marketing pages live at arbitrary
// /[slug] routes) — only the authenticated app itself requires a session.
const PROTECTED_PREFIXES = ["/dashboard", "/onboarding"]

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  )

  if (!sessionCookie && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
