import { useState } from "react"
import { Check, Mic, Square } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScreenHeader } from "@/components/screen-header"
import { SpeakButton } from "@/components/speak-button"
import { canListen, listenOnce } from "@/lib/voice"
import { formatWhen } from "@/lib/format"
import { cn } from "@/lib/utils"

type Props = { onCancel: () => void; onSave: (text: string, whenIso: string) => void }
type Day = "hoy" | "manana"

function buildDate(day: Day, time: string) {
  const [h, m] = time.split(":").map(Number)
  const d = new Date()
  if (day === "manana") d.setDate(d.getDate() + 1)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}
const nextHour = () => `${String((new Date().getHours() + 1) % 24).padStart(2, "0")}:00`

export function NewReminderScreen({ onCancel, onSave }: Props) {
  const [step, setStep] = useState<"dictar" | "confirmar">("dictar")
  const [text, setText] = useState("")
  const [listening, setListening] = useState(false)
  const [day, setDay] = useState<Day>("hoy")
  const [time, setTime] = useState(nextHour)
  const [inOneMinute, setInOneMinute] = useState(false)
  const voiceOk = canListen()

  async function dictate() {
    if (listening) return
    setListening(true)
    try {
      const heard = await listenOnce()
      if (heard) setText(heard.charAt(0).toUpperCase() + heard.slice(1))
      else toast("No escuché nada. Toca el micrófono otra vez.")
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setListening(false)
    }
  }

  const whenIso = inOneMinute ? new Date(Date.now() + 60_000).toISOString() : buildDate(day, time)
  const summary = `Te avisaré ${formatWhen(whenIso).toLowerCase()}: ${text}`

  if (step === "dictar") {
    return (
      <div className="flex flex-col gap-7">
        <ScreenHeader onBack={onCancel} helpText="Toca el círculo verde y di lo que quieres recordar. Por ejemplo: llamar al médico. Luego toca Siguiente." />
        <section>
          <h1 className="text-4xl font-bold">Di tu aviso</h1>
          <p className="mt-2 text-xl">
            {voiceOk ? "Toca el micrófono y habla. Por ejemplo: “llamar al médico”." : "Escribe lo que quieres recordar."}
          </p>
        </section>

        {voiceOk && (
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={dictate}
              aria-label={listening ? "Escuchando" : "Tocar para hablar"}
              className={cn(
                "grid size-44 place-items-center rounded-full border-4 border-accion-borde bg-accion transition-transform active:scale-95",
                listening && "animate-pulse"
              )}
            >
              {listening ? <Square className="size-16" /> : <Mic className="size-20" />}
            </button>
            <p className="text-2xl font-semibold" aria-live="polite">
              {listening ? "Te escucho…" : "Tocar para hablar"}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="aviso">{voiceOk ? "Así lo entendí (puedes corregirlo):" : "Tu aviso:"}</Label>
          <Textarea id="aviso" value={text} onChange={(e) => setText(e.target.value)} placeholder="Llamar al médico" />
        </div>

        <Button size="xl" className="justify-center" disabled={!text.trim()} onClick={() => setStep("confirmar")}>
          Siguiente
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-7">
      <ScreenHeader onBack={() => setStep("dictar")} helpText="Elige si el aviso es hoy o mañana y la hora. Después toca Guardar aviso." />
      <section>
        <h1 className="text-4xl font-bold">¿Cuándo te aviso?</h1>
        <p className="mt-2 text-xl">Revisa el día y la hora.</p>
      </section>

      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Día">
        {(["hoy", "manana"] as const).map((d) => (
          <Button
            key={d}
            variant={day === d && !inOneMinute ? "default" : "outline"}
            aria-pressed={day === d && !inOneMinute}
            className="min-h-20 text-2xl"
            onClick={() => { setDay(d); setInOneMinute(false) }}
          >
            {day === d && !inOneMinute && <Check />}
            {d === "hoy" ? "Hoy" : "Mañana"}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="hora">Hora</Label>
        <Input id="hora" type="time" value={time} className="min-h-20 text-3xl" onChange={(e) => { setTime(e.target.value); setInOneMinute(false) }} />
      </div>

      <Button variant={inOneMinute ? "default" : "outline"} aria-pressed={inOneMinute} className="self-start" size="sm" onClick={() => setInOneMinute((v) => !v)}>
        {inOneMinute && <Check />} Probar: avisarme en 1 minuto
      </Button>

      <Card className="gap-3">
        <p className="text-xl leading-snug">{summary}</p>
        <SpeakButton text={summary} className="self-start" />
      </Card>

      <Button size="xl" className="justify-center" onClick={() => onSave(text.trim(), whenIso)}>
        <Check /> Guardar aviso
      </Button>
    </div>
  )
}
