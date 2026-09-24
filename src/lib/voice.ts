/**
 * Capa de voz.
 * - En el teléfono (Capacitor) usa los motores nativos de Android: TextToSpeech y SpeechRecognizer.
 * - En el navegador usa Web Speech API (útil para desarrollar y para la demo).
 * El micrófono solo se activa cuando la persona toca el botón (nunca escucha de fondo).
 */
import { Capacitor } from "@capacitor/core"
import { TextToSpeech } from "@capacitor-community/text-to-speech"
import { SpeechRecognition } from "@capacitor-community/speech-recognition"

const LANG = "es-MX"
const isNative = Capacitor.isNativePlatform()

/* ---------- Texto a voz ---------- */

export function canSpeak() {
  return isNative || (typeof window !== "undefined" && "speechSynthesis" in window)
}

function pickSpanishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  return voices.find((v) => v.lang === LANG) ?? voices.find((v) => v.lang.startsWith("es"))
}

export async function speak(text: string, { rate = 0.9 }: { rate?: number } = {}) {
  if (isNative) {
    await TextToSpeech.stop()
    await TextToSpeech.speak({ text, lang: LANG, rate, pitch: 1, volume: 1, category: "playback" })
    return
  }
  if (!("speechSynthesis" in window)) throw new Error("Este dispositivo no puede leer en voz alta.")
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = LANG
  u.rate = rate
  const voice = pickSpanishVoice()
  if (voice) u.voice = voice
  await new Promise<void>((resolve, reject) => {
    u.onend = () => resolve()
    u.onerror = (e) => (e.error === "interrupted" || e.error === "canceled" ? resolve() : reject(e))
    synth.speak(u)
  })
}

export async function stopSpeaking() {
  if (isNative) return TextToSpeech.stop()
  if ("speechSynthesis" in window) window.speechSynthesis.cancel()
}

/* ---------- Voz a texto ---------- */

type WebRecognition = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

function getWebRecognition(): (new () => WebRecognition) | undefined {
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => WebRecognition) | undefined
}

export function canListen() {
  return isNative || !!getWebRecognition()
}

/** Escucha una sola frase y devuelve el texto. */
export async function listenOnce(): Promise<string> {
  if (isNative) {
    const { available } = await SpeechRecognition.available()
    if (!available) throw new Error("El reconocimiento de voz no está disponible en este teléfono.")
    const perm = await SpeechRecognition.requestPermissions()
    if (perm.speechRecognition !== "granted") throw new Error("Hace falta permiso para usar el micrófono.")
    const res = await SpeechRecognition.start({
      language: LANG,
      maxResults: 1,
      partialResults: false,
      popup: false,
    })
    return res.matches?.[0] ?? ""
  }

  const Ctor = getWebRecognition()
  if (!Ctor) throw new Error("Este navegador no puede escuchar. Prueba en Chrome o escribe el aviso.")
  const rec = new Ctor()
  rec.lang = LANG
  rec.interimResults = false
  rec.maxAlternatives = 1
  return new Promise<string>((resolve, reject) => {
    let text = ""
    rec.onresult = (e) => {
      text = e.results[0]?.[0]?.transcript ?? ""
    }
    rec.onerror = (e) =>
      reject(new Error(e.error === "not-allowed" ? "Hace falta permiso para usar el micrófono." : "No se escuchó bien. Intenta otra vez."))
    rec.onend = () => resolve(text)
    rec.start()
  })
}
