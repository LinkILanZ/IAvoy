import { useEffect } from "react"
import { BellRing, Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SpeakButton } from "@/components/speak-button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { reminderPhrase, formatTime } from "@/lib/format"
import { speak } from "@/lib/voice"
import type { Reminder } from "@/data/demo"

type Props = {
  reminder: Reminder | null
  onDone: (id: string) => void
  onLater: (id: string) => void
}

/**
 * "Notificación" dentro de la app: aparece cuando llega la hora de un aviso
 * y lo lee en voz alta. (La notificación del sistema con la app cerrada queda
 * para la siguiente versión, como indica la diapositiva 9.)
 */
export function ReminderAlert({ reminder, onDone, onLater }: Props) {
  const phrase = reminder ? reminderPhrase(reminder.text) : ""

  useEffect(() => {
    // En el teléfono se lee solo; algunos navegadores lo bloquean hasta que la persona toca la pantalla.
    if (reminder) speak(phrase).catch(() => {})
  }, [reminder, phrase])

  return (
    <Dialog open={!!reminder}>
      <DialogContent showClose={false} onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="pr-0">
          <div className="mb-2 grid size-16 place-items-center rounded-full border-2 border-ayuda-borde bg-ayuda">
            <BellRing className="size-9" />
          </div>
          <DialogTitle className="text-3xl">{reminder?.text}</DialogTitle>
          <DialogDescription className="text-xl text-foreground">{phrase}</DialogDescription>
          {reminder && <p className="text-muted-foreground text-lg">Aviso de las {formatTime(reminder.when)}</p>}
        </DialogHeader>
        <DialogFooter>
          <Button size="xl" className="justify-center" onClick={() => reminder && onDone(reminder.id)}>
            <Check /> Listo
          </Button>
          <Button variant="outline" className="min-h-16 w-full text-xl" onClick={() => reminder && onLater(reminder.id)}>
            <Clock /> Más tarde
          </Button>
          <SpeakButton text={phrase} label="Escuchar otra vez" className="w-full" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
