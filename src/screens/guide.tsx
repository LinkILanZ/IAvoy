import { useEffect } from "react"
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScreenHeader } from "@/components/screen-header"
import { speak, stopSpeaking } from "@/lib/voice"
import { guides } from "@/data/demo"
import { VoiceCommand } from "@/components/voice-command"
import { normalize } from "@/lib/reminders"
import { load } from "@/lib/storage"
import { defaultProfile } from "@/lib/profile"

type GuideListProps = { progress: Record<string, number>; onBack: () => void; onOpen: (id: string) => void }

export function GuideListScreen({ progress, onBack, onOpen }: GuideListProps) {
  const profile = load("profile", defaultProfile)
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader onBack={onBack} helpText="Elige lo que quieres aprender. Te explico un paso a la vez." />
      <h1 className="text-4xl font-bold">Aprender paso a paso</h1>
      <p>Cada actividad conserva su avance. Puedes cambiar de guía y regresar después.</p>
      <p>Estas guías son ejemplos preparados. La generación con IA e internet se integrará después.</p>
      <VoiceCommand hint="Di el nombre completo de una guía para abrirla." onCommand={text => {
        const guide = guides.find(g => normalize(g.title) === normalize(text))
        if (!guide) throw new Error("No encontré esa guía. Di uno de los títulos del catálogo.")
        onOpen(guide.id)
      }} />
      <ul className="flex flex-col gap-4">
        {guides.map((g) => {
          const step = progress[g.id] ?? 0
          return (
            <li key={g.id}>
              <Card className="gap-3">
                <p className="text-2xl font-bold leading-snug">{g.title}</p>
                {profile.interests.includes(g.id) && <p className="font-semibold">Sugerida según tus intereses</p>}
                <p className="text-lg">{step > 0 ? `Vas en el paso ${step + 1} de ${g.steps.length}` : `${g.steps.length} pasos`}</p>
                <Button onClick={() => onOpen(g.id)} className="self-start">
                  {step > 0 ? "Continuar" : "Empezar"} <ArrowRight />
                </Button>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

type GuideProps = { guideId: string; step: number; onStep: (n: number) => void; onBack: () => void; onFinish: () => void }

export function GuideScreen({ guideId, step, onStep, onBack, onFinish }: GuideProps) {
  const guide = guides.find((g) => g.id === guideId)!
  step = Math.max(0, Math.min(step, guide.steps.length - 1))
  const current = guide.steps[step]
  const total = guide.steps.length
  const isLast = step === total - 1
  const spoken = `Paso ${step + 1}. ${current.title}. ${current.body}`

  // Cada vez que cambia el paso (por un toque de la persona), se lee en voz alta.
  useEffect(() => {
    speak(spoken).catch(() => {})
    return () => void stopSpeaking()
  }, [spoken])

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader onBack={onBack} helpText="Escucha el paso y hazlo en tu teléfono. Si no quedó claro, toca Repetir. Tu avance se guarda solo." />
      <VoiceCommand hint="Di siguiente, atrás, repite, más despacio o pausar." onCommand={async text => {
        const command = normalize(text)
        if (["siguiente", "avanzar"].includes(command)) { if (isLast) onFinish(); else onStep(step + 1) }
        else if (["atras", "anterior"].includes(command)) onStep(Math.max(0, step - 1))
        else if (["repite", "repetir", "mas despacio"].includes(command)) await speak(spoken, { rate: command === "mas despacio" ? 0.75 : 0.9 })
        else if (["pausar", "salir", "continuar despues"].includes(command)) onBack()
        else if (command === "termine" && isLast) onFinish()
        else throw new Error("Di siguiente, atrás, repite o pausar.")
      }} />
      <section className="flex flex-col gap-3">
        <p className="text-lg">{guide.title}</p>
        <Progress value={((step + 1) / total) * 100} aria-label={`Paso ${step + 1} de ${total}`} />
        <p className="text-xl font-semibold">Paso {step + 1} de {total}</p>
      </section>

      <Card className="min-h-64 justify-center gap-4 p-7">
        <h1 className="text-4xl font-bold leading-tight">{current.title}</h1>
        <p className="text-2xl leading-relaxed">{current.body}</p>
      </Card>

      <Button variant="outline" size="xl" className="justify-center" onClick={() => speak(spoken, { rate: 0.75 }).catch(() => {})}>
        <RotateCcw /> Repetir despacio
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="min-h-20 text-xl" disabled={step === 0} onClick={() => onStep(step - 1)}>
          <ArrowLeft /> Atrás
        </Button>
        {isLast ? (
          <Button className="min-h-20 text-xl" onClick={onFinish}><Check /> Terminé</Button>
        ) : (
          <Button className="min-h-20 text-xl" onClick={() => onStep(step + 1)}>Siguiente <ArrowRight /></Button>
        )}
      </div>
      <Button variant="outline" onClick={onBack}>Pausar y ver otras guías</Button>
      <p>En Android, usa Inicio o el gesto de inicio para abrir otra aplicación sin cerrar esta. Vuelve a IA-Recuerdo para continuar: este prototipo aún no escucha comandos desde segundo plano.</p>
    </div>
  )
}
