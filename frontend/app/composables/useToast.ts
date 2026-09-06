import {
  toast,
  useToast as useSbtToast,
  type ToastOptions,
  type ToastVariant,
  type ToastPosition
} from 'super-beautiful-toast'

export { toast, type ToastOptions, type ToastVariant, type ToastPosition }

/**
 * Composable para invocar notificaciones con super-beautiful-toast.
 * Soporta animación física de resorte (spring), apilamiento en baraja (deck)
 * y metamorfosis desde el elemento activador (origin morphing).
 */
export function useToast() {
  const api = useSbtToast()

  return {
    toast: api,
    success: (message: string, options?: ToastOptions) => api.success(message, options),
    error: (message: string, options?: ToastOptions) => api.error(message, options),
    warning: (message: string, options?: ToastOptions) => api.warning(message, options),
    info: (message: string, options?: ToastOptions) => api.info(message, options),
    neutral: (message: string, options?: ToastOptions) => api.neutral(message, options),
    dismiss: (id: number) => api.dismiss(id),
    dismissAll: () => api.dismissAll(),
    configure: (settings: Parameters<typeof api.configure>[0]) => api.configure(settings)
  }
}
