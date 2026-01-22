"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  children: React.ReactNode
}

function ChartCard({ title, description, children, className, ...props }: ChartCardProps) {
  return (
    <div
      data-slot="chart-card"
      className={cn(
        "rounded-[10px] bg-card border border-border p-4",
        className
      )}
      {...props}
    >
      {title && (
        <div className="mb-3 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export { ChartCard }
export type { ChartCardProps }
