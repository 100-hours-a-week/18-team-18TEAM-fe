'use client'

import * as React from 'react'
import { PencilIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  editable?: boolean
  onEdit?: () => void
  children?: React.ReactNode
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
      className={cn('bg-surface/20 relative rounded-[10px] p-4', className)}
      {...props}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        {editable && (
          <button
            type="button"
            onClick={onEdit}
            className="hover:bg-muted rounded-md p-1 transition-colors"
            aria-label={`${title} 수정`}
          >
            <PencilIcon className="text-muted-foreground size-4" />
          </button>
        )}
      </div>
      {children && <div className="text-foreground text-sm">{children}</div>}
    </div>
  )
}

export { InfoCard }
export type { InfoCardProps }
