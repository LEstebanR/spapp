import { H2, P, Strong, UL } from "@/components/blog/prose"

export function ComoEstructurarTuEquipoDeProfesionales() {
  return (
    <>
      <P>
        Contratar a la primera persona para que te ayude es relativamente
        simple: le cuentas cómo trabajas y ya. El problema aparece con la
        tercera o cuarta contratación, cuando ya no es una sola agenda
        compartida sino varias personas, cada una con su propio horario, sus
        propios servicios, y clientes que esperan que todo cuadre sin
        errores.
      </P>

      <H2>Define tipos de profesional, no solo nombres</H2>
      <P>
        Antes de pensar en personas individuales, vale la pena definir los
        roles: masajista, esteticista, manicurista — lo que aplique a tu
        spa. Tener el tipo de profesional como una categoría propia (y no
        solo un texto libre en cada perfil) te deja filtrar servicios y
        horarios de forma consistente a medida que el equipo crece, en vez
        de reinventar la organización cada vez que contratas a alguien
        nuevo.
      </P>

      <H2>Servicios asignados, no supuestos</H2>
      <P>
        Cada profesional debería tener explícito qué servicios puede
        realizar. Parece obvio cuando hay dos personas en el equipo; deja de
        serlo cuando hay seis, y alguien nuevo se une sin saber exactamente
        qué le corresponde ofrecer todavía. Definirlo desde el sistema evita
        que un cliente reserve un servicio con la persona equivocada.
      </P>

      <H2>Horarios individuales sobre un horario base</H2>
      <P>
        Lo más simple es asumir que todo el equipo trabaja el horario del
        spa. En la práctica, alguien trabaja medio tiempo, otro no atiende
        los fines de semana, otro tiene un horario completamente distinto.
        La estructura que mejor escala es un horario general del spa que
        sirve de <Strong>valor por defecto</Strong>, y horarios individuales
        que lo sobreescriben solo cuando hace falta.
      </P>

      <H2>Piensa en cuentas propias desde ahora</H2>
      <P>
        A medida que el equipo crece, tiene sentido que cada profesional
        eventualmente vea su propia agenda sin depender de que el dueño del
        spa le pase la información. No hace falta resolverlo todo el primer
        día, pero sí vale la pena guardar desde el inicio datos como el
        correo de cada persona — es la base para que, más adelante, cada
        quien pueda entrar a ver únicamente lo que le corresponde.
      </P>

      <H2>Mide lo que cada persona aporta</H2>
      <P>
        Con el tiempo, vas a querer saber qué profesional atiende más
        turnos, qué servicios son los más solicitados por persona, y quién
        tiene margen para tomar más clientes. Esa visibilidad solo es
        posible si los turnos ya están asociados a un profesional y un
        servicio específicos desde que se agendan — no si hay que
        reconstruirlo después a mano.
      </P>

      <UL>
        <li>Define los tipos de profesional de tu spa antes de crecer.</li>
        <li>Asigna servicios explícitos a cada persona del equipo.</li>
        <li>Deja que los horarios individuales hereden del horario del spa.</li>
        <li>Guarda el correo de cada profesional desde que lo contratas.</li>
      </UL>

      <P>
        Un equipo bien estructurado no es más burocracia — es lo que te
        permite pasar de recordar todo tú mismo a confiar en que el sistema
        sostiene la organización por ti, sin importar cuánto crezca el
        equipo.
      </P>
    </>
  )
}
