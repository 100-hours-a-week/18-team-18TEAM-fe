'use client'

import * as React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { cn } from '@/lib/utils'

interface QrCodeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  size?: number
}

function QrCodeCard({
  value,
  size = 282,
  className,
  ...props
}: QrCodeCardProps) {
  return (
    <div
      data-slot="qr-code-card"
      className={cn(
        'flex items-center justify-center rounded-[25px] bg-white p-[29px] shadow-[4px_10px_30px_0px_rgba(87,87,87,0.25)]',
        className
      )}
      {...props}
    >
      <QRCodeSVG value={value} size={size} level="M" />
    </div>
  )
}

export { QrCodeCard }
export type { QrCodeCardProps }
