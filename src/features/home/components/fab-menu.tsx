"use client"

import * as React from "react"
import { ShareIcon, QrCodeIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

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
      id: "share",
      icon: <ShareIcon className="size-5" />,
      label: "내 명함 공유",
      onClick: onShareCard,
    },
    {
      id: "scan",
      icon: <QrCodeIcon className="size-5" />,
      label: "QR 코드 스캔",
      onClick: onScanQR,
    },
  ]

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        data-slot="fab-menu"
        className={cn(
          "fixed bottom-24 right-6 z-50 flex flex-col gap-3 animate-in slide-in-from-bottom-4 fade-in-0"
        )}
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
              "flex items-center gap-3 px-4 py-3 rounded-full bg-card text-foreground shadow-lg",
              "hover:bg-muted transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          >
            {item.icon}
            <span className="text-sm font-medium whitespace-nowrap">
              {item.label}
            </span>
          </button>
        ))}

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-lg",
            "hover:bg-muted/80 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
          aria-label="메뉴 닫기"
        >
          <XIcon className="size-6" />
        </button>
      </div>
    </>
  )
}

export { FABMenu }
export type { FABMenuProps, FABMenuItem }
