// Colombian mobile numbers: 10 digits starting with 3 (e.g. 300 123 4567),
// written plain or with a +57/57 country code prefix and any formatting
// characters (spaces, dashes, parentheses). Matches the assumption already
// baked into buildWhatsAppLink (see lib/whatsapp.ts).
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")
  const local = digits.length === 12 && digits.startsWith("57") ? digits.slice(2) : digits
  return /^3\d{9}$/.test(local)
}
