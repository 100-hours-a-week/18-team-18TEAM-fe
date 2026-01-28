'use client'

import * as React from 'react'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InfoCard } from '@/shared'

interface ActivityItem {
  id: string
  title: string
  period?: string
  description?: string
}

interface ActivitiesListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityItem[]
  isOwner?: boolean
  onAdd?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

function ActivitiesList({
  items,
  isOwner = false,
  onAdd,
  onEdit,
  onDelete,
  className,
  ...props
}: ActivitiesListProps) {
  return (
    <div
      data-slot="activities-list"
      className={cn('space-y-3', className)}
      {...props}
    >
      {isOwner && onAdd && (
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={onAdd}
            className="bg-surface/30 hover:bg-surface/50 flex size-10 items-center justify-center rounded-full backdrop-blur transition-colors"
            aria-label="활동 추가"
          >
            <PlusIcon className="text-foreground size-6" />
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          등록된 활동이 없습니다.
        </div>
      ) : (
        items.map((item) => (
          <InfoCard
            key={item.id}
            title={item.title}
            editable={isOwner}
            onEdit={() => onEdit?.(item.id)}
            onDelete={() => onDelete?.(item.id)}
            menuType="more"
          >
            <div className="space-y-1">
              {item.period && (
                <p className="text-muted-foreground text-xs">{item.period}</p>
              )}
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

export { ActivitiesList }
export type { ActivitiesListProps, ActivityItem }
