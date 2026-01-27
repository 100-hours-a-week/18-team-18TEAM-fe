'use client'

import * as React from 'react'
import { PlusIcon } from 'lucide-react'
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
  isOwner?: boolean
  onAdd?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

function CareerList({
  items,
  isOwner = false,
  onAdd,
  onEdit,
  onDelete,
  className,
  ...props
}: CareerListProps) {
  return (
    <div
      data-slot="career-list"
      className={cn('space-y-3', className)}
      {...props}
    >
      {isOwner && onAdd && (
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={onAdd}
            className="bg-surface/30 hover:bg-surface/50 flex size-10 items-center justify-center rounded-full backdrop-blur transition-colors"
            aria-label="경력 추가"
          >
            <PlusIcon className="text-foreground size-6" />
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          등록된 경력이 없습니다.
        </div>
      ) : (
        items.map((item) => (
          <InfoCard
            key={item.id}
            title={item.company}
            editable={isOwner}
            onEdit={() => onEdit?.(item.id)}
            onDelete={() => onDelete?.(item.id)}
            menuType="more"
          >
            <div className="space-y-1">
              <p className="font-medium">{item.position}</p>
              <p className="text-muted-foreground text-xs">{item.period}</p>
              {item.description && (
                <p className="text-muted-foreground mt-2">{item.description}</p>
              )}
            </div>
          </InfoCard>
        ))
      )}
    </div>
  )
}

export { CareerList }
export type { CareerListProps, CareerItem }
