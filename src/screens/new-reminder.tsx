import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScreenHeader } from "@/components/screen-header"
import { SpeakButton } from "@/components/speak-button"
import { VoiceCommand } from "@/components/voice-command"
import { durationMinutes, localDateInput, normalize, numbers, parseSpokenDate } from "@/lib/reminders"
import { formatWhen } from "@/lib/format"
import type { Reminder } from "@/data/demo"

type Props = { initial?: Reminder; onCancel: () => void; onSave: (reminder: Reminder) => void }
export function NewReminderScreen({ initial, onCancel, onSave }: Props) {
  const [step, setStep] = useState<"dictar" | "confirmar">("dictar")
  const [text, setText] = useState(initial?.text ?? "")
  const [date, setDate] = useState(() => localDateInput(initial ? new Date(initial.when) : new Date(Date.now() + 3600000)))
  const [advance, setAdvance] = useState(initial?.advanceMinutes ?? 0)
  const [recurrence, setRecurrence] = useState<NonNullable<Reminder["recurrence"]>>(initial?.recurrence ?? "once")
  const [repeats, setRepeats] = useState(initial?.repeats ?? 3)
  const [snooze, setSnooze] = useState(initial?.snoozeMinutes ?? 10)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const parsed = new Date(date)
  const valid = Number.isFinite(parsed.getTime()) && parsed.getTime() > Date.now()
  const summary = `${text || "Tu aviso"}. ${valid ? formatWhen(parsed.toISOString()) : "Elige una fecha futura"}. ${advance ? `También avisaré ${advance} minutos antes` : "Sin anticipación"}. ${recurrence === "daily" ? "Todos los días" : recurrence === "weekly" ? "Cada semana" : "Una sola fecha"}. Repetiré el mensaje ${repeats} veces, cada 30 segundos, mientras la aplicación esté abierta.`
  function save() {
    if (!text.trim() || !valid || parsed.getTime() <= Date.now() || !Number.isInteger(advance) || advance < 0 || advance > 10080 || !Number.isInteger(snooze) || snooze < 1 || snooze > 10080) {
      toast.error("Revisa el texto, la fecha futura y los minutos (máximo 10080).")
      return
    }
    onSave({ id: initial?.id ?? crypto.randomUUID(), text: text.trim(), when: parsed.toISOString(), done: false, advanceMinutes: advance, recurrence, repeats, repeatSeconds: 30, snoozeMinutes: snooze })
  }
  function command(raw: string) {
    const s = normalize(raw)
    if (s === "cancelar" || s === "salir") { setConfirmCancel(true); return }
    if (confirmCancel) {
      if (s === "si" || s === "si salir") onCancel()
      else if (s === "no" || s === "continuar") setConfirmCancel(false)
      else throw new Error("Di sí para salir sin guardar, o no para continuar.")
      return
    }
    if (s === "siguiente" || s === "confirmar") { if (text.trim()) setStep("confirmar"); else throw new Error("Primero di el contenido del aviso."); return }
    if (s === "guardar" || s === "guardar aviso" || s === "si guardar") {
      if (step !== "confirmar") { setStep("confirmar"); toast("Revisa el resumen y vuelve a decir guardar."); return }
      save(); return
    }
    if (s === "atras") { setStep("dictar"); return }
    if (s === "sin anticipacion" || s === "a la hora exacta") { setAdvance(0); return }
    if (s.includes("antes") || s.includes("anticipacion")) {
      const minutes = durationMinutes(s)
      if (minutes === null) throw new Error("Di: avísame quince minutos antes, o sin anticipación.")
      setAdvance(minutes); return
    }
    if (s.startsWith("posponer")) { const minutes = durationMinutes(s); if (!minutes) throw new Error("Di: posponer diez minutos."); setSnooze(minutes); return }
    if (s === "todos los dias" || s === "cada dia") { setRecurrence("daily"); return }
    if (s === "cada semana") { setRecurrence("weekly"); return }
    if (s === "una sola vez") { setRecurrence("once"); return }
    const count = numbers(s).match(/^repetir ([1-5]) veces?$/)
    if (count) { setRepeats(Number(count[1])); return }
    const datePhrase = s.replace(/^(?:cambiar fecha a|cambiar hora a|fecha|hora) /, "")
    if (/^(hoy|manana|pasado manana|en |dentro de)/.test(datePhrase)) { setDate(localDateInput(parseSpokenDate(datePhrase))); return }
    if (/^(texto|cambiar texto a) /.test(s)) { setText(raw.replace(/^(texto|cambiar texto a) /i, "")); return }
    if (step === "dictar") { setText(raw); return }
    throw new Error("No cambié el aviso. Di una fecha, anticipación, guardar o atrás.")
  }
  return <div className="flex flex-col gap-6">
    <ScreenHeader onBack={() => step === "confirmar" ? setStep("dictar") : setConfirmCancel(true)} helpText="Dicta primero el contenido. Después indica fecha y anticipación. Revisa el resumen antes de guardar." />
    <h1 className="text-4xl font-bold">{initial ? "Modificar aviso" : "Crear un aviso"}</h1>
    <VoiceCommand onCommand={command} hint={step === "dictar" ? 'Di el contenido, por ejemplo “Llamar a mi hija”. Después di “siguiente”.' : 'Di “mañana a las diez de la mañana”, “quince minutos antes”, “sin anticipación” o “guardar”.'} />
    {confirmCancel && <Card role="alert"><p>¿Salir sin guardar los cambios? Puedes decir sí o no.</p><Button onClick={onCancel}>Sí, salir</Button><Button variant="outline" onClick={() => setConfirmCancel(false)}>No, continuar</Button></Card>}
    {step === "dictar" ? <>
      <Label htmlFor="aviso">Contenido del aviso</Label>
      <Textarea id="aviso" value={text} onChange={e => setText(e.target.value)} placeholder="Llamar a mi hija" />
      <Button size="xl" disabled={!text.trim()} onClick={() => setStep("confirmar")}>Siguiente</Button>
    </> : <>
      <Label htmlFor="fecha">Fecha y hora</Label>
      <Input id="fecha" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
      {!valid && <p role="alert">Elige una fecha y hora futuras.</p>}
      <Button variant="outline" onClick={() => setDate(localDateInput(new Date(Date.now() + 120000)))}>Probar: avisarme en aproximadamente 2 minutos</Button>
      <Label htmlFor="anticipacion">Minutos de anticipación (0 = hora exacta)</Label>
      <Input id="anticipacion" type="number" min="0" max="10080" value={advance} onChange={e => setAdvance(Number(e.target.value))} />
      <Label htmlFor="frecuencia">Frecuencia</Label>
      <select id="frecuencia" className="min-h-14 rounded-xl border-2 bg-card p-3" value={recurrence} onChange={e => setRecurrence(e.target.value as typeof recurrence)}><option value="once">Una sola vez</option><option value="daily">Todos los días</option><option value="weekly">Cada semana</option></select>
      <Label htmlFor="repeticiones">Repeticiones de voz, cada 30 segundos</Label>
      <select id="repeticiones" className="min-h-14 rounded-xl border-2 bg-card p-3" value={repeats} onChange={e => setRepeats(Number(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select>
      <Label htmlFor="posponer">Minutos al elegir Más tarde</Label><Input id="posponer" type="number" min="1" max="10080" value={snooze} onChange={e => setSnooze(Number(e.target.value))} />
      <Card><p>{summary}</p><SpeakButton text={summary} /></Card>
      <Button size="xl" disabled={!valid} onClick={save}>Guardar aviso</Button>
    </>}
  </div>
}
