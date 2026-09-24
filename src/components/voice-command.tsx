import { useEffect, useRef, useState } from "react"
import { Mic } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { canListen, listenOnce, stopListening, stopSpeaking } from "@/lib/voice"

export function VoiceCommand({ onCommand, hint, onListening }: { onCommand: (text: string) => void | Promise<void>; hint: string; onListening?: (active: boolean) => void }) {
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState("")
  const active = useRef(true)
  const busy = useRef(false)
  useEffect(() => { active.current = true; return () => { active.current = false; if (busy.current) void stopListening() } }, [])
  async function listen() {
    if (busy.current) { await stopListening(); return }
    busy.current = true
    setListening(true)
    onListening?.(true)
    try {
      await stopSpeaking()
      const text = await listenOnce()
      if (!active.current) return
      setHeard(text)
      if (!text) throw new Error("No escuché una frase. Inténtalo otra vez.")
      await onCommand(text)
    } catch (error) {
      if (active.current) toast.error(error instanceof Error ? error.message : "No se pudo escuchar.")
    } finally {
      busy.current = false
      if (active.current) { setListening(false); onListening?.(false) }
    }
  }
  return <section className="flex flex-col gap-2">
    <Button variant="outline" onClick={listen} disabled={!canListen()}><Mic />{listening ? "Detener escucha" : "Hablar"}</Button>
    <p className="text-lg">{hint}</p>
    <p role="status" className="text-lg">{listening ? "Te escucho…" : heard ? `Escuché: ${heard}` : !canListen() ? "El dictado no está disponible aquí. Puedes usar los controles." : "Toca Hablar antes de cada frase."}</p>
  </section>
}
