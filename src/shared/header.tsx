'use client'

import * as React from 'react'
import { XIcon, MoreHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from './icon-button'
import { DropdownMenu, type MenuItem } from './dropdown-menu'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
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

  return (
    <header
      data-slot="header"
      className={cn(
        'bg-background sticky top-0 z-40 flex h-14 items-center justify-between px-4',
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
        {title && (
          <h1 className="text-foreground text-lg font-semibold">{title}</h1>
        )}
      </div>

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
