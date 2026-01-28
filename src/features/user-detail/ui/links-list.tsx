'use client'

import * as React from 'react'
import { ExternalLinkIcon, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InfoCard } from '@/shared'

interface LinkItem {
  id: string
  title: string
  url: string
  description?: string
}

interface LinksListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: LinkItem[]
  isOwner?: boolean
  onAdd?: () => void
  onEdit?: (id: string) => void
}

function LinksList({
  items,
  isOwner = false,
  onAdd,
  onEdit,
  className,
  ...props
}: LinksListProps) {
  return (
    <div
      data-slot="links-list"
      className={cn('space-y-3', className)}
      {...props}
    >
      {isOwner && onAdd && (
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={onAdd}
            className="bg-surface/30 hover:bg-surface/50 flex size-10 items-center justify-center rounded-full backdrop-blur transition-colors"
            aria-label="링크 추가"
          >
            <PlusIcon className="text-foreground size-6" />
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          등록된 링크가 없습니다.
        </div>
      ) : (
        items.map((item) => (
          <InfoCard
            key={item.id}
            title={item.title}
            editable={isOwner}
            onEdit={() => onEdit?.(item.id)}
            menuType="pencil"
          >
            <div className="space-y-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 hover:underline"
              >
                {item.url}
                <ExternalLinkIcon className="size-3" />
              </a>
              {item.description && (
                <p className="text-muted-foreground">{item.description}</p>
              )}
            </div>
          </InfoCard>
        ))
      )}
    </div>
  )
}

export { LinksList }
export type { LinksListProps, LinkItem }
