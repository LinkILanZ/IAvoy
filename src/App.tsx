import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { ReminderAlert } from "@/components/reminder-alert"
import { HomeScreen } from "@/screens/home"
import { NewReminderScreen } from "@/screens/new-reminder"
import { RemindersScreen } from "@/screens/reminders"
import { GuideListScreen, GuideScreen } from "@/screens/guide"
import { demoReminders, guides, type Reminder } from "@/data/demo"
import { load, save } from "@/lib/storage"
import { formatWhen } from "@/lib/format"

type Screen =
  | { name: "home" }
  | { name: "new" }
  | { name: "list" }
  | { name: "guides" }
  | { name: "guide"; id: string }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" })
  const [reminders, setReminders] = useState<Reminder[]>(() => load("reminders", demoReminders))
  const [progress, setProgress] = useState<Record<string, number>>(() => load("progress", {}))
  const [lastGuide, setLastGuide] = useState<string>(() => load("lastGuide", guides[0].id))
  const [dailyQuestion, setDailyQuestion] = useState(() => load("dailyQuestion", false))
  const [alerting, setAlerting] = useState<Reminder | null>(null)

  useEffect(() => { save("reminders", reminders) }, [reminders])
  useEffect(() => { save("progress", progress) }, [progress])
  useEffect(() => { save("lastGuide", lastGuide) }, [lastGuide])
  useEffect(() => { save("dailyQuestion", dailyQuestion) }, [dailyQuestion])
  useEffect(() => { window.scrollTo(0, 0) }, [screen])


  useEffect(() => {
    const check = () => {
      if (alerting) return
      const due = reminders.find((r) => !r.done && new Date(r.when).getTime() <= Date.now())
      if (due) setAlerting(due)
    }
    const first = setTimeout(check, 1500)
    const id = setInterval(check, 15_000)
    return () => { clearTimeout(first); clearInterval(id) }
  }, [reminders, alerting])

  const pending = useMemo(
    () => reminders.filter((r) => !r.done).sort((a, b) => a.when.localeCompare(b.when)),
    [reminders]
  )
  const next = pending.find((r) => new Date(r.when).getTime() > Date.now()) ?? pending[0]

  const markDone = (id: string) => {
    setReminders((rs) => rs.map((r) => (r.id === id ? { ...r, done: true } : r)))
    setAlerting(null)
    toast.success("Aviso terminado")
  }
  const snooze = (id: string) => {
    const when = new Date(Date.now() + 10 * 60_000).toISOString()
    setReminders((rs) => rs.map((r) => (r.id === id ? { ...r, when } : r)))
    setAlerting(null)
    toast("Te aviso otra vez en 10 minutos")
  }
  const addReminder = (text: string, when: string) => {
    setReminders((rs) => [...rs, { id: crypto.randomUUID(), text, when, done: false }])
    toast.success(`Aviso guardado para ${formatWhen(when).toLowerCase()}`)
    setScreen({ name: "home" })
  }
  const openGuide = (id: string) => { setLastGuide(id); setScreen({ name: "guide", id }) }

  return (
    <div className="safe-area mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5">
      {screen.name === "home" && (
        <HomeScreen
          next={next}
          pendingCount={pending.length}
          dailyQuestion={dailyQuestion}
          onDailyQuestion={setDailyQuestion}
          onNewReminder={() => setScreen({ name: "new" })}
          onGuide={() => ((progress[lastGuide] ?? 0) > 0 ? openGuide(lastGuide) : setScreen({ name: "guides" }))}
          onList={() => setScreen({ name: "list" })}
        />
      )}
      {screen.name === "new" && <NewReminderScreen onCancel={() => setScreen({ name: "home" })} onSave={addReminder} />}
      {screen.name === "list" && (
        <RemindersScreen
          reminders={reminders}
          onBack={() => setScreen({ name: "home" })}
          onDone={markDone}
          onNew={() => setScreen({ name: "new" })}
          onResetDemo={() => { setReminders(demoReminders); setProgress({}); toast("Datos de demostración restablecidos") }}
        />
      )}
      {screen.name === "guides" && (
        <GuideListScreen progress={progress} onBack={() => setScreen({ name: "home" })} onOpen={openGuide} />
      )}
      {screen.name === "guide" && (
        <GuideScreen
          guideId={screen.id}
          step={progress[screen.id] ?? 0}
          onStep={(n) => setProgress((p) => ({ ...p, [screen.id]: n }))}
          onBack={() => setScreen({ name: "guides" })}
          onFinish={() => {
            setProgress((p) => ({ ...p, [screen.id]: 0 }))
            toast.success("¡Terminaste la guía!")
            setScreen({ name: "home" })
          }}
        />
      )}

      <ReminderAlert reminder={alerting} onDone={markDone} onLater={snooze} />
      <Toaster />
    </div>
  )
}
