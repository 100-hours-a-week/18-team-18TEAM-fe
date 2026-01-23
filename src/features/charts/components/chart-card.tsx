'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  children: React.ReactNode
}

function ChartCard({
  title,
  description,
  children,
  className,
  ...props
}: ChartCardProps) {
  return (
    <div
      data-slot="chart-card"
      className={cn(
        'bg-card border-border rounded-[10px] border p-4',
        className
      )}
      {...props}
    >
      {title && (
        <div className="mb-3 space-y-1">
          <h3 className="text-foreground text-sm font-semibold">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export { ChartCard }
export type { ChartCardProps }
