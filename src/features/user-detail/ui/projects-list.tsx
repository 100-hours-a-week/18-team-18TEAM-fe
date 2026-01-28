'use client'

import * as React from 'react'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InfoCard } from '@/shared'

interface ProjectItem {
  id: string
  name: string
  period: string
  description?: string
}

interface ProjectsListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ProjectItem[]
  isOwner?: boolean
  onAdd?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

function ProjectsList({
  items,
  isOwner = false,
  onAdd,
  onEdit,
  onDelete,
  className,
  ...props
}: ProjectsListProps) {
  return (
    <div
      data-slot="projects-list"
      className={cn('space-y-3', className)}
      {...props}
    >
      {isOwner && onAdd && (
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={onAdd}
            className="bg-surface/30 hover:bg-surface/50 flex size-10 items-center justify-center rounded-full backdrop-blur transition-colors"
            aria-label="프로젝트 추가"
          >
            <PlusIcon className="text-foreground size-6" />
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          등록된 프로젝트가 없습니다.
        </div>
      ) : (
        items.map((item) => (
          <InfoCard
            key={item.id}
            title={item.name}
            editable={isOwner}
            onEdit={() => onEdit?.(item.id)}
            onDelete={() => onDelete?.(item.id)}
            menuType="more"
          >
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">{item.period}</p>
              {item.description && (
                <p className="text-muted-foreground mt-2 line-clamp-4">
                  {item.description}
                </p>
              )}
            </div>
          </InfoCard>
        ))
      )}
    </div>
  )
}

export { ProjectsList }
export type { ProjectsListProps, ProjectItem }
