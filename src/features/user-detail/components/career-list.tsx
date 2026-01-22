'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { InfoCard } from '@/shared'

interface CareerItem {
  id: string
  company: string
  position: string
  period: string
  description?: string
}

interface CareerListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CareerItem[]
  editable?: boolean
  onEdit?: (id: string) => void
}

function CareerList({
  items,
  editable = false,
  onEdit,
  className,
  ...props
}: CareerListProps) {
  if (items.length === 0) {
    return (
      <div className={cn('text-muted-foreground py-8 text-center', className)}>
        등록된 경력이 없습니다.
      </div>
    )
  }

  return (
    <div
      data-slot="career-list"
      className={cn('space-y-3', className)}
      {...props}
    >
      {items.map((item) => (
        <InfoCard
          key={item.id}
          title={item.company}
          editable={editable}
          onEdit={() => onEdit?.(item.id)}
        >
          <div className="space-y-1">
            <p className="font-medium">{item.position}</p>
            <p className="text-muted-foreground text-xs">{item.period}</p>
            {item.description && (
              <p className="text-muted-foreground mt-2">{item.description}</p>
            )}
          </div>
        </InfoCard>
      ))}
    </div>
  )
}

export { CareerList }
export type { CareerListProps, CareerItem }
