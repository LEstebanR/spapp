import { redirect } from "next/navigation"

import { OnboardingForm } from "@/app/onboarding/onboarding-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { getCurrentSpa } from "@/lib/spa"

export default async function OnboardingPage() {
  const spa = await getCurrentSpa()
  if (spa) redirect("/dashboard")

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-dark px-4 py-16">
      <Logo variant="light" />
      <Card className="w-full md:w-4/12">
        <CardHeader>
          <CardTitle className="text-center font-display text-2xl font-bold">
            Crea tu spa
          </CardTitle>
          <CardDescription className="text-center text-base">
            Este será el nombre de tu página pública y de tu panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  )
}
