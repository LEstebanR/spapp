import { H2, P, Strong, UL } from "@/components/blog/prose"

export function ComoOrganizarLaAgendaDeTuSpa() {
  return (
    <>
      <P>
        Cuando un spa tiene un solo profesional, la agenda es simple: hay
        una persona y un horario. El problema empieza en el momento en que
        contratas a la segunda: ahora hay dos horarios, dos disponibilidades,
        y servicios que solo algunas personas del equipo saben hacer. Sin
        una estructura clara, la agenda deja de vivir en la cabeza de una
        sola persona y empieza a fallar.
      </P>

      <H2>Los tres cruces más comunes</H2>
      <UL>
        <li>
          <Strong>Doble reserva.</Strong> Dos clientes agendados con el mismo
          profesional a la misma hora, casi siempre porque el turno se
          escribió a mano en dos lugares distintos (un cuaderno y un chat de
          WhatsApp, por ejemplo).
        </li>
        <li>
          <Strong>Servicio mal asignado.</Strong> Un cliente reserva un
          tratamiento que en realidad solo hace una persona del equipo, pero
          termina asignado a alguien que nunca lo ha hecho.
        </li>
        <li>
          <Strong>Horario fuera de horario.</Strong> Un turno agendado a una
          hora en la que ese profesional específico no trabaja, aunque el
          spa en general sí esté abierto.
        </li>
      </UL>

      <H2>La base: separar el horario del spa del horario de cada profesional</H2>
      <P>
        El horario general de tu spa (por ejemplo, lunes a sábado de 9am a
        7pm) es el punto de partida, pero no siempre coincide con el de cada
        persona del equipo. Alguien puede trabajar solo medio tiempo, o no
        atender los lunes. Cuando el sistema deja que cada profesional tenga
        su propio horario —y por defecto use el del spa si no ha definido
        uno propio— evitas ofrecer turnos que en la práctica nadie puede
        cumplir.
      </P>

      <H2>Asignar servicios, no solo personas</H2>
      <P>
        Cada profesional debería tener una lista clara de qué servicios
        puede realizar. Así, cuando alguien reserva un “masaje con piedras
        calientes”, el sistema solo ofrece como opción a quien de verdad lo
        hace — en vez de mostrar a todo el equipo y confiar en que alguien
        se dé cuenta del error después.
      </P>

      <H2>Dejar que el sistema cruce la disponibilidad por ti</H2>
      <P>
        La forma más confiable de evitar cruces no es tener cuidado — es
        que sea imposible reservar un horario que ya está ocupado. Eso pasa
        cuando la disponibilidad se calcula en tiempo real, combinando el
        horario del profesional, los servicios que puede hacer y los turnos
        que ya tiene, en vez de mostrar un calendario genérico y confiar en
        que nadie se equivoque.
      </P>

      <H2>Una agenda por estado, no solo por hora</H2>
      <P>
        Pendiente, confirmado, cancelado: tener el estado de cada turno
        visible de un vistazo te deja actuar rápido cuando algo cambia — por
        ejemplo, liberar un espacio apenas se cancela, en vez de que quede
        “ocupado” en el papel mientras en la práctica está libre.
      </P>

      <P>
        Ordenar la agenda no es un lujo de spas grandes. Es lo que te
        permite crecer de uno a varios profesionales sin que la experiencia
        de tus clientes empeore en el camino.
      </P>
    </>
  )
}
