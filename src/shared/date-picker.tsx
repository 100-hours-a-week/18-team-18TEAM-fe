"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  minDate?: string
  maxDate?: string
  className?: string
}

function DatePicker({
  label,
  value,
  onChange,
  placeholder = "날짜 선택",
  required,
  error,
  disabled,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempValue, setTempValue] = React.useState(value || "")
  const inputId = React.useId()

  const handleConfirm = () => {
    onChange?.(tempValue)
    setOpen(false)
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <button
        type="button"
        id={inputId}
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive",
          !value && "text-muted-foreground"
        )}
      >
        <span>{value ? formatDisplayDate(value) : placeholder}</span>
        <CalendarIcon className="size-4 text-muted-foreground" />
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle>날짜 선택</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="date"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              min={minDate}
              max={maxDate}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={handleConfirm}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { DatePicker }
export type { DatePickerProps }
