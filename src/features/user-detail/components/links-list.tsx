"use client"

import * as React from "react"
import { ExternalLinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { InfoCard } from "@/shared"

interface LinkItem {
  id: string
  title: string
  url: string
  description?: string
}

interface LinksListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: LinkItem[]
  editable?: boolean
  onEdit?: (id: string) => void
}

function LinksList({
  items,
  editable = false,
  onEdit,
  className,
  ...props
}: LinksListProps) {
  if (items.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        등록된 링크가 없습니다.
      </div>
    )
  }

  return (
    <div
      data-slot="links-list"
      className={cn("space-y-3", className)}
      {...props}
    >
      {items.map((item) => (
        <InfoCard
          key={item.id}
          title={item.title}
          editable={editable}
          onEdit={() => onEdit?.(item.id)}
        >
          <div className="space-y-1">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              {item.url}
              <ExternalLinkIcon className="size-3" />
            </a>
            {item.description && (
              <p className="text-muted-foreground">{item.description}</p>
            )}
          </div>
        </InfoCard>
      ))}
    </div>
  )
}

export { LinksList }
export type { LinksListProps, LinkItem }
