import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

export default async function AdminPage() {
  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">
        Feedback
      </h1>
      <p className="mt-1 text-muted-foreground">
        {feedback.length} {feedback.length === 1 ? "mensaje recibido" : "mensajes recibidos"}.
      </p>

      {feedback.length === 0 ? (
        <Card className="mt-8 border-dashed">
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Todavía no hay feedback.
          </CardContent>
        </Card>
      ) : (
        <ul className="mt-8 space-y-3">
          {feedback.map((f) => (
            <li key={f.id}>
              <Card>
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                          {f.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {f.user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {f.user.email}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {f.createdAt.toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="mt-3 text-sm whitespace-pre-wrap text-foreground">
                    {f.message}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
