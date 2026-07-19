import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

import { prisma } from "./prisma"

// Once deployed, set BETTER_AUTH_URL to the canonical prod URL and add every
// Vercel preview/alias domain to trustedOrigins (see personal-finances/lib/auth.ts).
const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"

export const auth = betterAuth({
  baseURL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  account: {
    modelName: "authAccount",
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
