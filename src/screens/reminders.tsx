import { Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScreenHeader } from "@/components/screen-header"
import { SpeakButton } from "@/components/speak-button"
import { formatWhen, reminderPhrase } from "@/lib/format"
import type { Reminder } from "@/data/demo"

type Props = {
  reminders: Reminder[]
  onBack: () => void
  onDone: (id: string) => void
  onNew: () => void
  onResetDemo: () => void
}

export function RemindersScreen({ reminders, onBack, onDone, onNew, onResetDemo }: Props) {
  const pending = reminders.filter((r) => !r.done).sort((a, b) => a.when.localeCompare(b.when))
  const done = reminders.filter((r) => r.done)

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader onBack={onBack} helpText="Aquí están tus avisos. Toca Escuchar para oír uno, o Listo cuando ya lo hiciste." />
      <h1 className="text-4xl font-bold">Mis avisos</h1>

      {pending.length === 0 ? (
        <Card>
          <p className="text-xl">No tienes avisos pendientes.</p>
          <Button onClick={onNew} className="self-start"><Plus /> Decir un aviso</Button>
        </Card>
      ) : (
        <ul className="flex flex-col gap-4">
          {pending.map((r) => (
            <li key={r.id}>
              <Card className="gap-3">
                <p className="text-2xl font-bold leading-snug">{r.text}</p>
                <p className="text-xl">{formatWhen(r.when)}</p>
                <div className="grid grid-cols-2 gap-3">
                  <SpeakButton text={reminderPhrase(r.text)} />
                  <Button onClick={() => onDone(r.id)}><Check /> Listo</Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {done.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Ya hechos</h2>
          <ul className="flex flex-col gap-2">
            {done.map((r) => (
              <li key={r.id} className="flex items-center gap-3 text-xl text-muted-foreground">
                <Check className="size-6 shrink-0 text-accion-borde" /> <s>{r.text}</s>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Button variant="ghost" size="sm" className="mt-6 self-center text-muted-foreground" onClick={onResetDemo}>
        Restablecer datos de demostración
      </Button>
    </div>
  )
}
