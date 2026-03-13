'use client'

import * as React from 'react'
import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

const fabMenuActionClassName =
  'bg-card text-foreground flex items-center gap-3 rounded-full px-4 py-3 shadow-lg hover:bg-muted transition-colors focus:ring-ring focus:ring-2 focus:outline-none'

interface FABMenuProps {
  open: boolean
  onClose: () => void
  navActions?: React.ReactNode
  onScanOCR?: () => void
}

function FABMenu({ open, onClose, navActions, onScanOCR }: FABMenuProps) {
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
      {navActions}
      <button
        type="button"
        onClick={() => {
          onScanOCR?.()
          onClose()
        }}
        className={cn(fabMenuActionClassName)}
      >
        <Camera className="size-5" />
        <span className="text-sm font-medium whitespace-nowrap">
          종이명함 추가
        </span>
      </button>
    </div>
  )
}

export { FABMenu }
export type { FABMenuProps }
