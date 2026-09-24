import { BookOpen, ChevronRight, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScreenHeader } from "@/components/screen-header"
import { SpeakButton } from "@/components/speak-button"
import { formatToday, formatWhen } from "@/lib/format"
import { userName, type Reminder } from "@/data/demo"

type Props = {
  next?: Reminder
  pendingCount: number
  dailyQuestion: boolean
  onDailyQuestion: (v: boolean) => void
  onNewReminder: () => void
  onGuide: () => void
  onList: () => void
}

export function HomeScreen({ next, pendingCount, dailyQuestion, onDailyQuestion, onNewReminder, onGuide, onList }: Props) {
  return (
    <div className="flex flex-col gap-7">
      <ScreenHeader helpText="Toca el botón verde de arriba para decir un aviso con tu voz. Toca el de abajo para seguir aprendiendo donde te quedaste." />

      <section>
        <h1 className="text-5xl font-bold tracking-tight">Hola, {userName}</h1>
        <p className="mt-1 text-xl text-muted-foreground">{formatToday()}</p>
      </section>

      {next && (
        <Card className="gap-3">
          <p className="text-lg text-muted-foreground">Tu próximo aviso</p>
          <p className="text-2xl font-bold leading-snug">{next.text}</p>
          <p className="text-xl">{formatWhen(next.when)}</p>
          <SpeakButton text={`Tu próximo aviso es: ${next.text}. ${formatWhen(next.when)}.`} className="self-start" />
        </Card>
      )}

      <section className="flex flex-col gap-4" aria-labelledby="que-hacer">
        <h2 id="que-hacer" className="text-3xl font-bold">¿Qué quieres hacer?</h2>
        <Button size="xl" onClick={onNewReminder}>
          <span className="grid size-13 shrink-0 place-items-center rounded-full border-2 border-accion-borde bg-card">
            <Mic />
          </span>
          Decir un aviso
        </Button>
        <Button size="xl" onClick={onGuide}>
          <span className="grid size-13 shrink-0 place-items-center rounded-full border-2 border-accion-borde bg-card">
            <BookOpen />
          </span>
          Continuar mi guía
        </Button>
        <Button variant="link" className="self-start px-0 text-xl" onClick={onList}>
          Ver mis avisos ({pendingCount}) <ChevronRight />
        </Button>
      </section>

      <Card className="flex-row items-center justify-between gap-4">
        <Label htmlFor="daily" className="text-lg leading-snug font-normal">
          Preguntarme cada mañana:
          <br />
          <strong>“¿Algo que recordar hoy?”</strong>
        </Label>
        <Switch id="daily" checked={dailyQuestion} onCheckedChange={onDailyQuestion} />
      </Card>
    </div>
  )
}
