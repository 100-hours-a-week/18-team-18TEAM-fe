'use client'

import * as React from 'react'
import { MoreHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropdownMenu, IconButton } from '@/shared'

interface BusinessCardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  company?: string
  department?: string
  position?: string
  phone_number?: string
  email?: string
  lined_number?: string
  onPress?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function BusinessCardItem({
  name,
  company,
  department,
  position,
  phone_number,
  email,
  lined_number,
  onPress,
  onEdit,
  onDelete,
  className,
  ...props
}: BusinessCardItemProps) {
  const hasMenu = onEdit || onDelete
  const menuItems = React.useMemo(() => {
    const items = []
    if (onEdit) {
      items.push({ id: 'edit', label: '수정', onClick: onEdit })
    }
    if (onDelete) {
      items.push({
        id: 'delete',
        label: '삭제',
        onClick: onDelete,
        destructive: true,
      })
    }
    return items
  }, [onEdit, onDelete])

  return (
    <div
      data-slot="business-card-item"
      role="button"
      tabIndex={0}
      onClick={onPress}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onPress?.()
        }
      }}
      className={cn(
        'bg-card border-border relative w-full cursor-pointer rounded-[10px] border p-4 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
      {...props}
    >
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-foreground text-lg font-semibold">{name}</h3>
        <div className="flex items-center gap-2">
          {company && (
            <span className="text-muted-foreground text-md">{company}</span>
          )}
          {hasMenu && (
            <DropdownMenu
              trigger={
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="더보기"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontalIcon className="size-4" />
                </IconButton>
              }
              items={menuItems}
            />
          )}
        </div>
      </div>

      <div className="mb-4 space-y-0.5">
        {department && (
          <p className="text-muted-foreground text-sm">{department}</p>
        )}
        {position && (
          <p className="text-muted-foreground text-sm">{position}</p>
        )}
      </div>

      <div className="border-border space-y-0.5 border-t pt-3">
        {phone_number && (
          <p className="text-foreground text-sm">{phone_number}</p>
        )}
        {email && <p className="text-foreground text-sm">{email}</p>}
        {lined_number && (
          <p className="text-foreground text-sm">{lined_number}</p>
        )}
      </div>
    </div>
  )
}

export { BusinessCardItem }
export type { BusinessCardItemProps }
