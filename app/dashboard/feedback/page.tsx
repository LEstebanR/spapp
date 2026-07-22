import { FeedbackForm } from "@/components/dashboard/feedback-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-foreground">
        Feedback
      </h1>
      <p className="mt-1 text-muted-foreground">
        Ayúdanos a mejorar Spapp contándonos tu experiencia.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Danos tu opinión</CardTitle>
          <CardDescription>
            Leemos todos los mensajes. Si necesitas una respuesta puntual,
            déjanos un dato de contacto en el mensaje.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackForm />
        </CardContent>
      </Card>
    </div>
  )
}
