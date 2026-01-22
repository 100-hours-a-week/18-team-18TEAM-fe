'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type Precision = 'day' | 'month'

interface FlexibleDateInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

function FlexibleDateInput({
  label,
  value,
  onChange,
  required,
  className,
  ...props
}: FlexibleDateInputProps) {
  const [precision, setPrecision] = React.useState<Precision>(
    value && value.length <= 7 ? 'month' : 'day'
  )

  const inputClassName = cn(
    'w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
  )

  const togglePrecision = () => {
    setPrecision((prev) => {
      const next = prev === 'day' ? 'month' : 'day'
      if (next === 'month' && value) {
        onChange(value.slice(0, 7))
      }
      if (next === 'day' && value && value.length === 7) {
        onChange(`${value}-01`)
      }
      return next
    })
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-foreground text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={togglePrecision}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          {precision === 'day' ? '년/월만 입력' : '년/월/일까지 입력'}
        </button>
      </div>
      <input
        type={precision === 'day' ? 'date' : 'month'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={inputClassName}
        {...props}
      />
    </div>
  )
}

export { FlexibleDateInput }
export type { FlexibleDateInputProps }
