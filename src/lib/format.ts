const dayFmt = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long" })
const timeFmt = new Intl.DateTimeFormat("es-MX", { hour: "numeric", minute: "2-digit", hour12: true })

export const formatToday = (d = new Date()) => {
  const s = dayFmt.format(d)
  return s.charAt(0).toUpperCase() + s.slice(1)
}
export const formatTime = (iso: string) => timeFmt.format(new Date(iso))

export function formatWhen(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString()
  const day = same(d, today) ? "Hoy" : same(d, tomorrow) ? "Mañana" : formatToday(d)
  return `${day}, ${formatTime(iso)}`
}

/** La frase que la app lee en voz alta cuando llega un aviso (diapositiva 4). */
export const reminderPhrase = (text: string) =>
  `Teníamos anotado: ${text.charAt(0).toLowerCase() + text.slice(1)}. ¿Ya lo hiciste?`
