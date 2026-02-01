'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  startLabel?: string
  endLabel?: string
  startValue?: string
  endValue?: string
  onStartChange?: (value: string) => void
  onEndChange?: (value: string) => void
  startPlaceholder?: string
  endPlaceholder?: string
  startRequired?: boolean
  endRequired?: boolean
  startError?: string
  endError?: string
  disabled?: boolean
  hideEnd?: boolean
  className?: string
}

function DateRangePicker({
  startLabel = '시작일',
  endLabel = '종료일',
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  startPlaceholder = '시작일 선택',
  endPlaceholder = '종료일 선택',
  startRequired,
  endRequired,
  startError,
  endError,
  disabled,
  hideEnd = false,
  className,
}: DateRangePickerProps) {
  const [openStart, setOpenStart] = React.useState(false)
  const [openEnd, setOpenEnd] = React.useState(false)
  const [tempStartValue, setTempStartValue] = React.useState(startValue || '')
  const [tempEndValue, setTempEndValue] = React.useState(endValue || '')

  const startInputId = React.useId()
  const endInputId = React.useId()

  React.useEffect(() => {
    setTempStartValue(startValue || '')
  }, [startValue])

  React.useEffect(() => {
    setTempEndValue(endValue || '')
  }, [endValue])

  const handleStartConfirm = () => {
    onStartChange?.(tempStartValue)
    setOpenStart(false)
  }

  const handleEndConfirm = () => {
    onEndChange?.(tempEndValue)
    setOpenEnd(false)
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
    })
  }

  // 월 단위 input을 위한 값 변환 (YYYY-MM-DD -> YYYY-MM)
  const toMonthValue = (dateString: string) => {
    if (!dateString) return ''
    return dateString.substring(0, 7)
  }

  // 월 단위 input에서 날짜로 변환 (YYYY-MM -> YYYY-MM-01)
  const fromMonthValue = (monthString: string) => {
    if (!monthString) return ''
    return `${monthString}-01`
  }

  return (
    <div className={cn('flex gap-3', className)}>
      {/* 시작일 */}
      <div className="flex-1 space-y-2">
        {startLabel && (
          <Label htmlFor={startInputId} className="text-sm font-medium">
            {startLabel}
            {startRequired && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}

        <button
          type="button"
          id={startInputId}
          onClick={() => !disabled && setOpenStart(true)}
          disabled={disabled}
          className={cn(
            'border-input bg-background ring-offset-background flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm',
            'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            startError && 'border-destructive',
            !startValue && 'text-muted-foreground'
          )}
        >
          <span>
            {startValue ? formatDisplayDate(startValue) : startPlaceholder}
          </span>
          <CalendarIcon className="text-muted-foreground size-4" />
        </button>

        {startError && (
          <p className="text-destructive text-xs">{startError}</p>
        )}
      </div>

      {/* 종료일 */}
      {!hideEnd && (
        <div className="flex-1 space-y-2">
          {endLabel && (
            <Label htmlFor={endInputId} className="text-sm font-medium">
              {endLabel}
              {endRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}

          <button
            type="button"
            id={endInputId}
            onClick={() => !disabled && setOpenEnd(true)}
            disabled={disabled}
            className={cn(
              'border-input bg-background ring-offset-background flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm',
              'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              endError && 'border-destructive',
              !endValue && 'text-muted-foreground'
            )}
          >
            <span>
              {endValue ? formatDisplayDate(endValue) : endPlaceholder}
            </span>
            <CalendarIcon className="text-muted-foreground size-4" />
          </button>

          {endError && <p className="text-destructive text-xs">{endError}</p>}
        </div>
      )}

      {/* 시작일 Dialog */}
      <Dialog open={openStart} onOpenChange={setOpenStart}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle>시작일 선택</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="month"
              value={toMonthValue(tempStartValue)}
              onChange={(e) =>
                setTempStartValue(fromMonthValue(e.target.value))
              }
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenStart(false)}>
              취소
            </Button>
            <Button onClick={handleStartConfirm}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 종료일 Dialog */}
      <Dialog open={openEnd} onOpenChange={setOpenEnd}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle>종료일 선택</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="month"
              value={toMonthValue(tempEndValue)}
              onChange={(e) => setTempEndValue(fromMonthValue(e.target.value))}
              min={toMonthValue(startValue || '')}
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEnd(false)}>
              취소
            </Button>
            <Button onClick={handleEndConfirm}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { DateRangePicker }
export type { DateRangePickerProps }
