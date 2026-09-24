import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-10 w-18 shrink-0 items-center rounded-full border-2 border-border bg-muted transition-colors data-[state=checked]:border-accion-borde data-[state=checked]:bg-accion",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-7 rounded-full border-2 border-foreground bg-card transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-1" />
    </SwitchPrimitive.Root>
  )
}
export { Switch }
