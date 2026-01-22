'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      data-slot="glass-card"
      className={cn(
        'bg-surface/20 relative rounded-[10px] border border-white/20 p-4 shadow-lg backdrop-blur-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function GlassCardContent({
  children,
  className,
  ...props
}: GlassCardContentProps) {
  return (
    <div
      data-slot="glass-card-content"
      className={cn('space-y-1', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { GlassCard, GlassCardContent }
export type { GlassCardProps, GlassCardContentProps }
