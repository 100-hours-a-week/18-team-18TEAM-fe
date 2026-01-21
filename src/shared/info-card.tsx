"use client"

import * as React from "react"
import { PencilIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  editable?: boolean
  onEdit?: () => void
  children: React.ReactNode
}

function InfoCard({
  title,
  editable = false,
  onEdit,
  children,
  className,
  ...props
}: InfoCardProps) {
  return (
    <div
      data-slot="info-card"
      className={cn(
        "relative rounded-[10px] bg-surface/20 p-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {editable && (
          <button
            type="button"
            onClick={onEdit}
            className="p-1 rounded-md hover:bg-muted transition-colors"
            aria-label={`${title} 수정`}
          >
            <PencilIcon className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}

export { InfoCard }
export type { InfoCardProps }
