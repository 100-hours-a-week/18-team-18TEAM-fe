"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
}

function FAB({ icon, className, ...props }: FABProps) {
  return (
    <button
      type="button"
      data-slot="fab"
      className={cn(
        "fixed bottom-24 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg",
        "hover:bg-primary/90 active:scale-95 transition-all",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      aria-label="메뉴 열기"
      {...props}
    >
      {icon || <PlusIcon className="size-7" />}
    </button>
  )
}

export { FAB }
export type { FABProps }
