'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { IconButton } from './icon-button'

interface BottomNavItem {
  id: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  items: BottomNavItem[]
  activeId?: string
}

function BottomNav({ items, activeId, className, ...props }: BottomNavProps) {
  return (
    <nav
      data-slot="bottom-nav"
      className={cn(
        'bg-background/60 border-border fixed right-0 bottom-0 left-0 z-50 flex h-[67px] items-center justify-center gap-12 border-t backdrop-blur-md',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className={cn(
            'flex flex-col items-center justify-center gap-1 rounded-full p-2 transition-colors',
            activeId === item.id
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-label={item.label}
          aria-current={activeId === item.id ? 'page' : undefined}
        >
          <div
            className={cn(
              'flex size-[45px] items-center justify-center rounded-full',
              activeId === item.id && 'bg-surface/30'
            )}
          >
            {item.icon}
          </div>
        </button>
      ))}
    </nav>
  )
}

export { BottomNav }
export type { BottomNavProps, BottomNavItem }
