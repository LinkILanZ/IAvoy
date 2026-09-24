import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn("bg-card flex min-h-14 w-full rounded-xl border-2 px-4 text-xl focus-visible:border-ring", className)}
      {...props}
    />
  )
}
export { Input }
