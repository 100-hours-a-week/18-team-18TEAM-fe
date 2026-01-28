'use client'

import * as React from 'react'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InfoCard } from '@/shared'

interface SkillsListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[]
  isOwner?: boolean
  onAdd?: () => void
  onEdit?: (skill: string) => void
}

function SkillsList({
  items,
  isOwner = false,
  onAdd,
  onEdit,
  className,
  ...props
}: SkillsListProps) {
  return (
    <div
      data-slot="skills-list"
      className={cn('space-y-3', className)}
      {...props}
    >
      {isOwner && onAdd && (
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={onAdd}
            className="bg-surface/30 hover:bg-surface/50 flex size-10 items-center justify-center rounded-full backdrop-blur transition-colors"
            aria-label="기술 추가"
          >
            <PlusIcon className="text-foreground size-6" />
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          등록된 기술이 없습니다.
        </div>
      ) : (
        items.map((item) => (
          <InfoCard
            key={item}
            title={item}
            editable={isOwner}
            onEdit={() => onEdit?.(item)}
            menuType="pencil"
          />
        ))
      )}
    </div>
  )
}

export { SkillsList }
export type { SkillsListProps }
