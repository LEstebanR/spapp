---
version: alpha
name: varua-inspired-spa-design
description: Sistema de diseño para Spapp (app de administración de spa), inspirado en el sitio público de Varuá Relaxing Spa (varuaspa.co/sede-laureles) — un lenguaje visual cálido, elegante y oscuro para un negocio de bienestar, con un toque propio orientado a producto/SaaS (no a un sitio de reservas de cliente final).
source: https://varuaspa.co/sede-laureles/ — tokens extraídos directamente de la hoja de estilos pública del sitio (landing-laureles.css, prefijo .vr-).

colors:
  teal: "#2BBCB3"
  teal-dark: "#229e96"
  teal-light: "rgba(43, 188, 179, 0.10)"
  salmon: "#F4846E"
  salmon-dark: "#e06a52"
  dark: "#1A1A1A"
  darker: "#111111"
  white: "#FFFFFF"
  gray-light: "#F7F7F7"
  text-dark: "#333333"
  text-mid: "#555555"
  text-light: "#666666"
  border: "#E8E8E8"

typography:
  font-display: "'Playfair Display', Georgia, serif"
  font-body: "'DM Sans', system-ui, -apple-system, sans-serif"
  hero-title:
    fontFamily: "{typography.font-display}"
    fontSize: "clamp(36px, 5.5vw, 64px)"
    fontWeight: 700
    lineHeight: 1.15
  section-title:
    fontFamily: "{typography.font-display}"
    fontSize: "clamp(28px, 3.5vw, 42px)"
    fontWeight: 700
    lineHeight: 1.2
  section-label:
    fontFamily: "{typography.font-body}"
    fontSize: 12px
    fontWeight: 600
    letterSpacing: 0.18em
    textTransform: uppercase
    color: "{colors.teal}"
  body:
    fontFamily: "{typography.font-body}"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "{typography.font-body}"
    fontSize: 15px
    fontWeight: 600

radius:
  sm: 8px
  md: 16px
  lg: 24px
  pill: 999px

spacing:
  section-py: 96px
  container: 1280px
  gap: 32px

shadows:
  sm: "0 2px 8px rgba(0,0,0,0.06)"
  md: "0 8px 24px rgba(0,0,0,0.10)"
  lg: "0 16px 48px rgba(0,0,0,0.14)"
  card: "0 4px 20px rgba(0,0,0,0.08)"

transitions:
  default: "0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  slow: "0.5s cubic-bezier(0.4, 0, 0.2, 1)"

components:
  header:
    backgroundColor: "{colors.dark}"
    height: 76px
    position: fixed
    scrolled: "rgba(26,26,26,0.95) + backdrop-blur(20px)"
  logo:
    icon: "circle {colors.teal}, 36px, white glyph centered"
    text: "{typography.font-display} 20px/700, white, letter-spacing 0.05em"
    sub-label: "{typography.font-body} 9px/600 uppercase, color {colors.teal}"
  nav-link:
    textColor: "rgba(255,255,255,0.85)"
    hover: "white text + rgba(255,255,255,0.1) background"
    radius: "{radius.sm}"
  button-primary-salmon:
    backgroundColor: "{colors.salmon}"
    textColor: "{colors.white}"
    radius: "{radius.pill}"
    padding: "14px 28px"
    shadow: "0 4px 16px rgba(244,132,110,0.35)"
    hover: "background {colors.salmon-dark}, shadow más fuerte, translateY(-2px)"
  button-primary-teal:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.white}"
    radius: "{radius.pill}"
    padding: "14px 28px"
    shadow: "0 4px 16px rgba(43,188,179,0.30)"
  button-outline-white:
    backgroundColor: transparent
    textColor: "{colors.white}"
    border: "2px solid rgba(255,255,255,0.6)"
    radius: "{radius.pill}"
  button-outline-teal:
    backgroundColor: transparent
    textColor: "{colors.teal}"
    border: "2px solid {colors.teal}"
    radius: "{radius.pill}"
    hover: "fill {colors.teal}, texto blanco"
  badge:
    radius: "{radius.pill}"
    padding: "6px 14px"
    fontSize: 11px
    fontWeight: 700
    letterSpacing: 0.14em
    textTransform: uppercase
  badge-teal:
    backgroundColor: "rgba(43,188,179,0.15)"
    textColor: "{colors.teal}"
    border: "1px solid rgba(43,188,179,0.30)"
  card:
    backgroundColor: "{colors.white}"
    radius: "{radius.md}"
    shadow: "{shadows.card}"
    hover: "translateY(-6px) + shadow {shadows.lg}"
  hero:
    minHeight: 100vh
    background: "foto/gradiente oscuro (linear-gradient 135deg, {colors.dark} 88% → {colors.dark} 70% → {colors.teal} 15% de opacidad)"
    overlay-bottom: "gradiente hacia {colors.dark} para fundir con la siguiente sección"
    content: "centrado, max-width 860px"
  hero-title-em:
    fontStyle: italic
    color: "{colors.teal}"
  trust-dot:
    size: 6px
    backgroundColor: "{colors.teal}"
    animation: "pulse-ring 2s infinite (anillo expandiéndose)"

animations:
  fade-in-up: "opacity 0→1, translateY(32px)→0, 0.7s cubic-bezier(0.4,0,0.2,1), disparado on-scroll con clase is-visible"
  fade-in-left / fade-in-right: "misma curva, eje X"
  float: "translateY loop suave (badges/indicadores)"
  pulse-ring: "scale(1)→scale(1.6) + fade, para puntos de estado 'en vivo'"

---

## Overview

Varuá es un spa de bienestar en Medellín (Laureles) cuya identidad visual es **cálida pero editorial**: fondo casi negro (`#1A1A1A`) en header y hero, tipografía serif (`Playfair Display`) para titulares con un énfasis en cursiva color teal, y un cuerpo de texto en `DM Sans` sans-serif limpio. El acento de marca es un **teal/turquesa** (`#2BBCB3`) — evoca agua, calma, spa — combinado con un **salmón cálido** (`#F4846E`) reservado para los CTAs de conversión más directos ("Reserva ahora"). Todo elemento interactivo es una **píldora** (`border-radius: 999px`); las tarjetas de servicio usan `16px`. Las sombras son suaves y cálidas (nunca duras), y el scroll dispara animaciones `fade-in-up` en cascada — el sitio se siente vivo sin ser ruidoso.

## Nuestro toque (adaptaciones para Spapp)

Spapp no es el sitio público de un spa para que clientes reserven — es una landing de **producto/software** para quien administra el spa (dueño/staff), en la línea de conexory: Hero → Features → Cómo funciona → Stats → FAQ → CTA final → Footer. Tomamos el lenguaje visual de Varuá casi literal (paleta, tipografía, píldoras, sombras cálidas) pero lo aplicamos a un patrón de composición de SaaS:

- **Hero**: fondo oscuro + gradiente teal de Varuá, pero en vez de una foto de tratamiento, flota una **tarjeta de producto** (mockup de la agenda de turnos) — el mismo recurso que usa conexory en su hero (`BrowserMock`), re-skinned con estos colores y con `Playfair Display` en los títulos de la tarjeta.
- **CTA principal**: "Iniciar sesión con Google" (no "Regístrate" tipo SaaS multi-tenant) — coherente con que la autenticación es exactamente la de personal-finances: un único método (Google OAuth), pensado para el equipo del spa, no para registro público masivo.
- **Tipografía display**: cambiamos `Playfair Display` (clásica, muy "editorial de revista") por **Fraunces** — un serif variable más contemporáneo (optical sizing + soft axis), que mantiene el carácter elegante/spa pero se siente más moderno y menos "sitio de bodas". `DM Sans` se mantiene igual para cuerpo/botones/nav.
- **Sin catálogo de servicios/precios de spa**: el contenido de "Features" describe funcionalidades de la app (gestión de turnos, y lo que se vaya agregando), no masajes ni faciales.
- Mantenemos el teal como color primario de marca y el salmón como acento secundario para variar CTAs, igual que en el original.

## Colors

- **Teal** (`#2BBCB3`) — color de marca primario. Section labels, badges, íconos de estado, énfasis en cursiva dentro de titulares, botón primario alternativo.
- **Teal Dark** (`#229e96`) — hover de elementos teal.
- **Salmón** (`#F4846E`) — acento de conversión (CTA principal), evita que todo el sitio dependa de un solo color.
- **Dark** (`#1A1A1A`) / **Darker** (`#111111`) — fondo de header y hero; sensación editorial/spa nocturno.
- **White** (`#FFFFFF`) — fondo del resto de secciones (Features, FAQ, etc.).
- **Gray Light** (`#F7F7F7`) — fondos de sub-superficies suaves (alterna con blanco entre secciones).
- **Text Dark/Mid/Light** (`#333`/`#555`/`#666`) — jerarquía de texto sobre fondo claro.
- **Border** (`#E8E8E8`) — hairlines sutiles sobre fondo claro.

## Typography

Dos familias, igual que el original:

1. **Playfair Display** (serif, 700) — todo titular (`hero-title`, `section-title`). Tamaños con `clamp()` para fluidez: hero 36–64px, secciones 28–42px. El énfasis dentro de un titular (`<em>`) va en cursiva y color teal.
2. **DM Sans** (sans, 400/500/600/700) — cuerpo, botones, nav, labels. Los "eyebrows" de sección van en `DM Sans` 12px/600, mayúsculas, tracking 0.18em, color teal.

Nunca usar Playfair Display para párrafos de cuerpo ni DM Sans para titulares grandes — misma separación de roles que Varuá.

## Shapes & Elevation

- **Píldora (`999px`)** en todo botón e insignia — la firma geométrica del sitio.
- **`16px`** en tarjetas de contenido (features, mockup de producto).
- **`24px`** disponible para tarjetas más grandes/hero-cards.
- Sombras cálidas y difusas (`rgba(0,0,0,0.06–0.14)`), nunca duras ni frías; hover de tarjeta = `translateY(-6px)` + sombra más grande.

## Layout

- Contenedor máx. `1280px`; padding de sección `96px` vertical.
- Header fijo de `76px`, fondo oscuro; se vuelve semitransparente con blur al hacer scroll.
- Animaciones de entrada en scroll (`fade-in-up`, con `delay-1…8` escalonados) para toda sección — usar con moderación para no saturar.

## Do's and Don'ts

### Do
- Mantener el teal como identidad primaria; usar salmón solo para CTAs de conversión, no como color de fondo general.
- Titulares siempre en `Playfair Display` 700, con la palabra clave en cursiva teal cuando aporte énfasis.
- Botones e insignias siempre en píldora.
- Header y hero en fondo oscuro (`#1A1A1A`); el resto de secciones alternan blanco / `#F7F7F7`.

### Don't
- No introducir un tercer acento de color fuera de teal/salmón/escala de grises.
- No usar Playfair Display en párrafos largos — solo titulares y logo.
- No convertir la landing en un catálogo de servicios de spa (masajes, precios, sedes) — esto es la landing del software de administración, no el sitio público del spa físico.
- No perder el fondo oscuro del hero por un hero completamente blanco — es parte central de la identidad tomada de Varuá.
