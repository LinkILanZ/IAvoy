import { CircleHelp, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SpeakButton } from "@/components/speak-button"
import { load } from "@/lib/storage"
import { defaultProfile } from "@/lib/profile"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

export function HelpDialog({ helpText }: { helpText: string }) {
  const profile = load("profile", defaultProfile)
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
          {profile.tutorPhone ? <Button variant="ayuda" className="w-full" asChild>
            <a href={`tel:${profile.tutorPhone}`}>
              <Phone /> Llamar a {profile.tutorName || "mi tutor"}
            </a>
          </Button> : <p>Agrega el teléfono de tu tutor en Mi perfil y tutor, desde el inicio.</p>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
