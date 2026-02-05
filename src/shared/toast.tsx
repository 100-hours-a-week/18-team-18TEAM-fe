'use client'

// import { toast as sonnerToast } from 'sonner'
// import { Toaster as ShadcnToaster } from '@/components/ui/sonner'
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner'
type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

function toast(message: string, options?: ToastOptions) {
  return sonnerToast(message, {
    description: options?.description,
    duration: options?.duration ?? 3000,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  })
}

toast.success = (message: string, options?: ToastOptions) => {
  return sonnerToast.success(message, {
    description: options?.description,
    duration: options?.duration ?? 3000,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  })
}

toast.error = (message: string, options?: ToastOptions) => {
  return sonnerToast.error(message, {
    description: options?.description,
    duration: options?.duration ?? 4000,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  })
}

toast.info = (message: string, options?: ToastOptions) => {
  return sonnerToast.info(message, {
    description: options?.description,
    duration: options?.duration ?? 3000,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  })
}

toast.warning = (message: string, options?: ToastOptions) => {
  return sonnerToast.warning(message, {
    description: options?.description,
    duration: options?.duration ?? 3500,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  })
}

toast.promise = sonnerToast.promise

toast.dismiss = sonnerToast.dismiss

function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      toastOptions={{
        classNames: {
          title: 'text-foreground',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          success: 'bg-green-500 text-white',
          error: 'bg-red-500 text-white',
        },
      }}
    />
  )
}

export { toast, Toaster }
export type { ToastOptions, ToastType }
