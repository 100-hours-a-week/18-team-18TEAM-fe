'use client'

import * as React from 'react'
import { PlusIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  open?: boolean
  openIcon?: React.ReactNode
}

function FAB({ icon, openIcon, open = false, className, ...props }: FABProps) {
  const renderIcon = open
    ? openIcon || <XIcon className="size-7" />
    : icon || <PlusIcon className="size-7" />

  return (
    <button
      type="button"
      data-slot="fab"
      aria-pressed={open}
      className={cn(
        'bg-primary text-primary-foreground fixed bottom-10 z-50 flex size-14 items-center justify-center rounded-full shadow-lg',
        'hover:bg-primary/90 transition-all active:scale-95',
        'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none',
        className
      )}
      style={{ right: 'max(1.5rem, calc((100vw - 430px) / 2 + 1.5rem))' }}
      {...props}
    >
      {renderIcon}
    </button>
  )
}

export { FAB }
export type { FABProps }
