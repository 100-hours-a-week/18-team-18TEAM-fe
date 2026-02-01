'use client'

import * as React from 'react'
import { QrCodeIcon, ShareIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FABMenuItem {
  id: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

interface FABMenuProps {
  open: boolean
  onClose: () => void
  onShareCard?: () => void
  onScanQR?: () => void
}

function FABMenu({ open, onClose, onShareCard, onScanQR }: FABMenuProps) {
  const menuItems: FABMenuItem[] = [
    {
      id: 'share',
      icon: <ShareIcon className="size-5" />,
      label: '내 명함 공유',
      onClick: onShareCard,
    },
    {
      id: 'scan',
      icon: <QrCodeIcon className="size-5" />,
      label: 'QR 코드 스캔',
      onClick: onScanQR,
    },
  ]

  if (!open) return null

  return (
    <div
      data-slot="fab-menu"
      className={cn(
        'fixed bottom-30 z-50 flex flex-col gap-3',
        'animate-in slide-in-from-bottom-2 fade-in-0'
      )}
      style={{ right: 'max(1.5rem, calc((100vw - 430px) / 2 + 1.5rem))' }}
    >
      {menuItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            item.onClick?.()
            onClose()
          }}
          className={cn(
            'bg-card text-foreground flex items-center gap-3 rounded-full px-4 py-3 shadow-lg',
            'hover:bg-muted transition-colors',
            'focus:ring-ring focus:ring-2 focus:outline-none'
          )}
        >
          {item.icon}
          <span className="text-sm font-medium whitespace-nowrap">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  )
}

export { FABMenu }
export type { FABMenuProps, FABMenuItem }
