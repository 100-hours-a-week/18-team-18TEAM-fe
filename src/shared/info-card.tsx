'use client'

import * as React from 'react'
import { PencilIcon, MoreHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropdownMenu, type MenuItem } from './dropdown-menu'

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  editable?: boolean
  onEdit?: () => void
  onDelete?: () => void
  menuType?: 'pencil' | 'more'
  children?: React.ReactNode
}

function InfoCard({
  title,
  editable = false,
  onEdit,
  onDelete,
  menuType = 'pencil',
  children,
  className,
  ...props
}: InfoCardProps) {
  const menuItems: MenuItem[] = React.useMemo(() => {
    const items: MenuItem[] = []
    if (onEdit) {
      items.push({
        id: 'edit',
        label: '수정',
        onClick: onEdit,
      })
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
      data-slot="info-card"
      className={cn('bg-surface/20 relative rounded-[10px] p-4', className)}
      {...props}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        {editable && menuType === 'pencil' && (
          <button
            type="button"
            onClick={onEdit}
            className="hover:bg-muted rounded-md p-1 transition-colors"
            aria-label={`${title} 수정`}
          >
            <PencilIcon className="text-muted-foreground size-4" />
          </button>
        )}
        {editable && menuType === 'more' && menuItems.length > 0 && (
          <DropdownMenu
            trigger={
              <button
                type="button"
                className="hover:bg-muted rounded-md p-1 transition-colors"
                aria-label={`${title} 메뉴`}
              >
                <MoreHorizontalIcon className="text-muted-foreground size-5" />
              </button>
            }
            items={menuItems}
            align="end"
          />
        )}
      </div>
      {children && <div className="text-foreground text-sm">{children}</div>}
    </div>
  )
}

export { InfoCard }
export type { InfoCardProps }
