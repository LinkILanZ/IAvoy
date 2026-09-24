import { Toaster as Sonner, type ToasterProps } from "sonner"

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      offset={{ bottom: "max(env(safe-area-inset-bottom), 16px)" }}
      mobileOffset={{ bottom: "max(env(safe-area-inset-bottom), 16px)" }}
      toastOptions={{
        classNames: {
          toast: "!bg-card !text-foreground !border-2 !border-accion-borde !rounded-xl !text-lg !font-semibold !p-4",
        },
      }}
      {...props}
    />
  )
}
export { Toaster }
