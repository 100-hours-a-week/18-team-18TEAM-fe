'use client'

import { Button } from '@/shared'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { OcrMode } from '@/features/ocr'

interface OcrModeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectMode: (mode: OcrMode) => void
}

function OcrModeDialog({ open, onOpenChange, onSelectMode }: OcrModeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>종이 명함 추가</DialogTitle>
          <DialogDescription>
            어떤 명함을 추가할지 선택해 주세요.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col sm:justify-start">
          <Button variant="primary" onClick={() => onSelectMode('SELF')}>
            내 명함 추가
          </Button>
          <Button variant="outline" onClick={() => onSelectMode('OTHER')}>
            상대 명함 추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { OcrModeDialog }
export type { OcrModeDialogProps }
