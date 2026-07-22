import { BeneficiosDeReservasOnlineParaTuSpa } from "@/components/blog/posts/beneficios-de-reservas-online-para-tu-spa"
import { ComoElegirSoftwareParaTuSpa } from "@/components/blog/posts/como-elegir-software-para-tu-spa"
import { ComoEstructurarTuEquipoDeProfesionales } from "@/components/blog/posts/como-estructurar-tu-equipo-de-profesionales"
import { ComoOrganizarLaAgendaDeTuSpa } from "@/components/blog/posts/como-organizar-la-agenda-de-tu-spa"
import { ComoReducirInasistenciasEnTuSpa } from "@/components/blog/posts/como-reducir-inasistencias-en-tu-spa"

export const BLOG_POST_CONTENT: Record<string, React.ComponentType> = {
  "como-elegir-software-para-tu-spa": ComoElegirSoftwareParaTuSpa,
  "como-reducir-inasistencias-en-tu-spa": ComoReducirInasistenciasEnTuSpa,
  "como-organizar-la-agenda-de-tu-spa": ComoOrganizarLaAgendaDeTuSpa,
  "beneficios-de-reservas-online-para-tu-spa": BeneficiosDeReservasOnlineParaTuSpa,
  "como-estructurar-tu-equipo-de-profesionales": ComoEstructurarTuEquipoDeProfesionales,
}
