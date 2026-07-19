// clientPhone is free text (no format enforced anywhere it's collected), so
// this is defensive: strips everything but digits and assumes a bare
// 10-digit number is a Colombian mobile missing its country code.
export function buildWhatsAppLink(phone: string, message?: string): string | null {
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 7) return null

  const withCountryCode = digits.length === 10 ? `57${digits}` : digits
  const query = message ? `?text=${encodeURIComponent(message)}` : ""
  return `https://wa.me/${withCountryCode}${query}`
}
