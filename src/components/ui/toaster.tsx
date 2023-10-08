import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Icons } from '@/components/icons'
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function({ id, title, description, action, variant, duration, ...props }) {
        return (
          <Toast key={id} variant={variant} duration={duration} {...props}>
            <div className="grid gap-1">
              {title && (!variant || variant === 'default') && (
                <div className="flex gap-2 items-center mb-4">
                  <Icons.help />
                  <ToastTitle className="flex gap-2">{title}</ToastTitle>
                </div>
              )}
              {title && variant === 'destructive' && (
                <div className="flex gap-2 items-center mb-4">
                  <Icons.warning className="text-destructive" />
                  <ToastTitle className="flex gap-2">{title}</ToastTitle>
                </div>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
