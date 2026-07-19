"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { toggleProfessionalActive } from "@/app/dashboard/professionals/actions"
import { Switch } from "@/components/ui/switch"

export function ProfessionalActiveToggle({
  id,
  active,
}: {
  id: string
  active: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Switch
      checked={active}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startTransition(async () => {
          await toggleProfessionalActive(id, checked)
          router.refresh()
        })
      }}
    />
  )
}
