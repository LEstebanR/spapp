import { Resend } from "resend"

import { getSiteUrl } from "@/lib/site"

const resend = new Resend(process.env.RESEND_API_KEY)

// Resend's shared sandbox sender — works with no domain verification.
// Set RESEND_FROM_EMAIL once spapp.com (or whichever domain) is verified in Resend.
const from = process.env.RESEND_FROM_EMAIL ?? "Spapp <onboarding@resend.dev>"

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from,
      to,
      subject: "Bienvenido a Spapp",
      html: `
        <p>Hola ${name},</p>
        <p>Gracias por crear tu cuenta en Spapp. Ya puedes configurar tu spa, tu equipo de profesionales y empezar a recibir reservas.</p>
        <p><a href="${getSiteUrl()}/dashboard">Ir a mi panel</a></p>
      `,
    })
  } catch (err) {
    console.error("[email] sendWelcomeEmail failed:", err)
  }
}

export async function sendProfessionalProfileCreatedEmail(
  to: string,
  data: { professionalName: string; spaName: string }
) {
  try {
    await resend.emails.send({
      from,
      to,
      subject: `${data.spaName} te agregó a su equipo en Spapp`,
      html: `
        <p>Hola ${data.professionalName},</p>
        <p><strong>${data.spaName}</strong> te agregó como profesional en Spapp. Inicia sesión con este mismo correo para ver tu agenda.</p>
        <p><a href="${getSiteUrl()}/login">Iniciar sesión</a></p>
      `,
    })
  } catch (err) {
    console.error("[email] sendProfessionalProfileCreatedEmail failed:", err)
  }
}
