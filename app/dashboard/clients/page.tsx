import Link from "next/link"
import { ChevronLeft, ChevronRight, Users2 } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { STATUS_BADGE_STYLES, STATUS_LABELS } from "@/lib/booking-status"
import { prisma } from "@/lib/prisma"
import { requireCurrentSpa } from "@/lib/spa"
import { cn } from "@/lib/utils"

// Rows per page tuned so a full page fits one desktop viewport with no
// vertical scroll (header + this many rows + pagination bar).
const PAGE_SIZE = 8

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const spa = await requireCurrentSpa()
  const { page: pageParam } = await searchParams

  const totalCount = await prisma.booking.count({ where: { spaId: spa.id } })
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages)

  const bookings = await prisma.booking.findMany({
    where: { spaId: spa.id },
    orderBy: { date: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      service: { select: { name: true } },
      professional: { select: { name: true } },
    },
  })

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-foreground">
        Clientes
      </h1>
      <p className="mt-1 text-muted-foreground">
        Las personas que han agendado un turno en tu spa.
      </p>

      {bookings.length === 0 ? (
        <Card className="mt-8 border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <Users2 className="h-7 w-7 text-accent-foreground" strokeWidth={1.75} />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display text-xl font-bold text-foreground">
                Todavía no tienes clientes
              </h2>
              <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                Cuando alguien agende un turno desde tu página pública, va a
                aparecer aquí con su servicio, profesional y estado.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-0 bg-muted hover:bg-muted">
                  <TableHead className="h-11 pl-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Cliente
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Servicio
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Profesional
                  </TableHead>
                  <TableHead className="h-11 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Fecha
                  </TableHead>
                  <TableHead className="h-11 pr-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Estado
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="border-border">
                    <TableCell className="py-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-accent text-sm text-accent-foreground">
                            {booking.clientName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {booking.clientName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {booking.clientPhone}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {booking.service?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {booking.professional?.name ?? "Cualquiera"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {booking.date.toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      ·{" "}
                      {booking.date.toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="pr-5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          STATUS_BADGE_STYLES[booking.status] ?? STATUS_BADGE_STYLES.pendiente
                        )}
                      >
                        {STATUS_LABELS[booking.status] ?? booking.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3">
            <p className="text-sm text-muted-foreground">
              Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} de{" "}
              {totalCount} clientes
            </p>
            <div className="flex items-center gap-1">
              <PageLink
                page={page - 1}
                disabled={page <= 1}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </PageLink>
              <span className="px-2 text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <PageLink
                page={page + 1}
                disabled={page >= totalPages}
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </PageLink>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PageLink({
  page,
  disabled,
  "aria-label": ariaLabel,
  children,
}: {
  page: number
  disabled: boolean
  "aria-label": string
  children: React.ReactNode
}) {
  if (disabled) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/40">
        {children}
      </span>
    )
  }

  return (
    <Link
      href={`/dashboard/clients?page=${page}`}
      aria-label={ariaLabel}
      className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
    >
      {children}
    </Link>
  )
}
