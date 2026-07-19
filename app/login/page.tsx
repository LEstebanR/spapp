import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GoogleSignInButton } from "@/components/ui/google-sign-in-button"
import { Logo } from "@/components/ui/logo"

export default function Login() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-dark px-4 py-16">
      <Link href="/" className="cursor-pointer">
        <Logo variant="light" />
      </Link>
      <Card className="w-full md:w-4/12">
        <CardHeader>
          <CardTitle className="text-center font-display text-2xl font-bold">
            Inicia sesión
          </CardTitle>
          <CardDescription className="text-center text-base">
            Entra a Spapp para gestionar los turnos de tu spa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleSignInButton />
        </CardContent>
      </Card>
    </div>
  )
}
