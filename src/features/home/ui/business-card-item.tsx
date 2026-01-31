'use client'

import * as React from 'react'
import { MoreHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropdownMenu, IconButton } from '@/shared'

const CARD_COLORS = [
  { bg: 'bg-[#022840]', text: 'text-white' },
  { bg: 'bg-[#1B6C8C]', text: 'text-white' },
  { bg: 'bg-[#EADFD8]', text: 'text-[#2d2c2c]' },
  { bg: 'bg-[#bfd8e7]', text: 'text-[#2d2c2c]' },
  { bg: 'bg-[#96b3cb]', text: 'text-[#2d2c2c]' },
  { bg: 'bg-[#ad9b8f]', text: 'text-[#2d2c2c]' },
] as const

interface BusinessCardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  company?: string
  department?: string
  position?: string
  phone_number?: string
  email?: string
  lined_number?: string
  colorIndex?: number
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
  colorIndex = 0,
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

  const colorScheme = CARD_COLORS[colorIndex % CARD_COLORS.length]

  const roleText =
    department && position
      ? `${department} / ${position}`
      : department || position || ''

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
        'relative h-[200px] w-full cursor-pointer rounded-[10px] px-[23px] py-[29px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]',
        colorScheme.bg,
        colorScheme.text,
        className
      )}
      {...props}
    >

      {hasMenu && (
        <div className="absolute right-3 top-3">
          <DropdownMenu
            trigger={
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="더보기"
                onClick={(e) => e.stopPropagation()}
                className={cn('hover:bg-white/10', colorScheme.text)}
              >
                <MoreHorizontalIcon className="size-4" />
              </IconButton>
            }
            items={menuItems}
          />
        </div>
      )}

      <div className="flex flex-col gap-[5px]">
        <h3 className="text-[20px] font-semibold leading-[22px] tracking-[-0.4px]">
          {name}
        </h3>
        <div className="flex flex-col text-[15px] leading-[22px] tracking-[-0.3px]">
          {company && <p>{company}</p>}
          {roleText && <p className="font-medium">{roleText}</p>}
        </div>
      </div>

      <div className="absolute bottom-[29px] right-[21px] flex flex-col gap-0 text-[12px] leading-[22px] tracking-[-0.24px]">
        {phone_number && <p>M: {phone_number}</p>}
        {email && <p>E: {email}</p>}
        {lined_number && <p>T: {lined_number}</p>}
      </div>
    </div>
  )
}

export { BusinessCardItem }
export type { BusinessCardItemProps }
