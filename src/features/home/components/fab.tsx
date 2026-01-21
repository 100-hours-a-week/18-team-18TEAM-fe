"use client"

import * as React from "react"
import { PlusIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

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
        "fixed bottom-24 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg",
        "hover:bg-primary/90 active:scale-95 transition-all",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {renderIcon}
    </button>
  )
}

export { FAB }
export type { FABProps }
