import { CircleHelp, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SpeakButton } from "@/components/speak-button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

export function HelpDialog({ helpText }: { helpText: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ayuda">
          <CircleHelp /> Ayuda
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Cómo te ayudo?</DialogTitle>
          <DialogDescription>{helpText}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <SpeakButton text={helpText} label="Escuchar explicación" slow className="w-full" />
          <Button variant="ayuda" className="w-full" asChild>
            {/* número de demostración */}
            <a href="tel:5500000000">
              <Phone /> Llamar a mi familiar
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
