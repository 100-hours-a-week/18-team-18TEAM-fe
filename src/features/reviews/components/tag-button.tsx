"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TagButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

function TagButton({ selected = false, className, children, ...props }: TagButtonProps) {
  return (
    <button
      type="button"
      data-slot="tag-button"
      aria-pressed={selected}
      className={cn(
        "w-full rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
        "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        selected
          ? "border-foreground bg-background text-foreground"
          : "border-border bg-card text-foreground"
        ,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { TagButton }
export type { TagButtonProps }
