'use client'

import * as React from 'react'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  onAction?: () => void
}

function EmptyState({
  icon,
  title,
  description,
  action,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'border-border bg-muted/30 flex flex-col items-center justify-center rounded-[10px] border-2 border-dashed p-8 text-center',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="bg-muted text-muted-foreground mb-4 flex size-12 items-center justify-center rounded-full">
          {icon}
        </div>
      )}
      {!icon && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mb-4 flex size-12 items-center justify-center rounded-full transition-colors"
          aria-label="추가"
        >
          <PlusIcon className="size-6" />
        </button>
      )}
      {title && (
        <h3 className="text-foreground text-sm font-medium">{title}</h3>
      )}
      {description && (
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
