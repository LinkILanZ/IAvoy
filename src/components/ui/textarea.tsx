import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "bg-card placeholder:text-muted-foreground flex min-h-28 w-full rounded-xl border-2 px-4 py-3 text-xl focus-visible:border-ring",
        className
      )}
      {...props}
    />
  )
}
export { Textarea }
