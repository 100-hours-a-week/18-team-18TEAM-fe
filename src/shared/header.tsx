'use client'

import * as React from 'react'
import { XIcon, MoreHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from './icon-button'
import { DropdownMenu, type MenuItem } from './dropdown-menu'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  titleAlign?: 'left' | 'center'
  showClose?: boolean
  /** @deprecated Use menuItems prop instead */
  showMenu?: boolean
  onClose?: () => void
  /** @deprecated Use menuItems prop instead */
  onMenuClick?: () => void
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  menuItems?: MenuItem[]
}

function Header({
  title,
  titleAlign = 'left',
  showClose = false,
  showMenu = false,
  onClose,
  onMenuClick,
  leftContent,
  rightContent,
  menuItems,
  className,
  ...props
}: HeaderProps) {
  const showMenuButton = menuItems && menuItems.length > 0
  const showLegacyMenu = showMenu && !showMenuButton
  const isCenteredTitle = Boolean(title) && titleAlign === 'center'

  return (
    <header
      data-slot="header"
      className={cn(
        'bg-background fixed top-0 left-1/2 z-40 flex h-14 w-full max-w-[430px] -translate-x-1/2 items-center justify-between px-4',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {showClose && (
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="닫기"
          >
            <XIcon className="size-5" />
          </IconButton>
        )}
        {leftContent}
        {title && !isCenteredTitle && (
          <h1 className="text-foreground text-lg font-semibold">{title}</h1>
        )}
      </div>

      {title && isCenteredTitle && (
        <h1 className="text-foreground pointer-events-none absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate text-center text-lg font-semibold">
          {title}
        </h1>
      )}

      <div className="flex items-center gap-2">
        {rightContent}
        {showMenuButton && (
          <DropdownMenu
            trigger={
              <IconButton variant="ghost" size="sm" aria-label="메뉴">
                <MoreHorizontalIcon className="size-5" />
              </IconButton>
            }
            items={menuItems}
          />
        )}
        {showLegacyMenu && (
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            aria-label="메뉴"
          >
            <MoreHorizontalIcon className="size-5" />
          </IconButton>
        )}
      </div>
    </header>
  )
}

export { Header }
export type { HeaderProps }
