import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HelpDialog } from "@/components/help-dialog"

type Props = { onBack?: () => void; helpText: string }

/** Barra superior: "Volver" a la izquierda, "Ayuda" siempre a la derecha. */
export function ScreenHeader({ onBack, helpText }: Props) {
  return (
    <header className="flex items-center justify-between gap-3">
      {onBack ? (
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft /> Volver
        </Button>
      ) : (
        <span />
      )}
      <HelpDialog helpText={helpText} />
    </header>
  )
}
