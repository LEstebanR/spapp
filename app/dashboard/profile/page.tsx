import { AvatarUpload } from "@/components/dashboard/avatar-upload"
import { NameForm } from "@/components/dashboard/name-form"
import { NotificationSettings } from "@/components/dashboard/notification-settings"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getServerSession } from "@/lib/session"

export default async function ProfilePage() {
  const session = await getServerSession()

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-foreground">
        Perfil
      </h1>
      <p className="mt-1 text-muted-foreground">Tu cuenta en Spapp.</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tu cuenta</CardTitle>
          <CardDescription>
            Esta foto y nombre se ven en el encabezado del panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <AvatarUpload
              name={session?.user.name}
              image={session?.user.image}
            />
            <div className="w-full space-y-1 text-center sm:text-left">
              <p className="text-sm text-muted-foreground">{session?.user.email}</p>
            </div>
          </div>

          <Separator />

          <NameForm initialName={session?.user.name ?? ""} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>
            Recibe un aviso cuando llegue una nueva solicitud de turno.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationSettings />
        </CardContent>
      </Card>
    </div>
  )
}
