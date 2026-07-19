"use client"

import { useRouter } from "next/navigation"

type Service = { id: string; name: string }

export function ProfessionalServiceFilter({
  services,
  activeServiceId,
}: {
  services: Service[]
  activeServiceId?: string
}) {
  const router = useRouter()

  return (
    <select
      value={activeServiceId ?? ""}
      onChange={(e) => {
        const value = e.target.value
        router.push(value ? `/dashboard/professionals?service=${value}` : "/dashboard/professionals")
      }}
      className="h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 text-sm"
    >
      <option value="">Todos los servicios</option>
      {services.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  )
}
