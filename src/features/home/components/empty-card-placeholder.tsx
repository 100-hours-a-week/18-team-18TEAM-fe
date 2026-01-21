"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyCardPlaceholderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onAdd?: () => void
}

function EmptyCardPlaceholder({
  onAdd,
  className,
  ...props
}: EmptyCardPlaceholderProps) {
  return (
    <div
      data-slot="empty-card-placeholder"
      className={cn(
        "flex flex-col items-center justify-center w-full h-[110px] rounded-[10px] border-2 border-dashed border-border bg-muted/30",
        className
      )}
      {...props}
    >
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center justify-center size-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        aria-label="명함 추가"
      >
        <PlusIcon className="size-5" />
      </button>
    </div>
  )
}

export { EmptyCardPlaceholder }
export type { EmptyCardPlaceholderProps }
