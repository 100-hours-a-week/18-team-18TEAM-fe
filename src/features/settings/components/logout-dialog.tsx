'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading?: boolean
}

function LogoutDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: LogoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그아웃</DialogTitle>
          <DialogDescription>정말 로그아웃 하시겠습니까?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? '로그아웃 중...' : '로그아웃'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { LogoutDialog }
export type { LogoutDialogProps }
