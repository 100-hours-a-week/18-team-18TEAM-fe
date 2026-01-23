'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PrivacyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function PrivacyDialog({ open, onOpenChange }: PrivacyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>개인정보처리방침</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm text-muted-foreground">
          <p>
            1. 개인정보의 수집 항목 회사는 다음과 같은 개인정보를 수집합니다.
          </p>
          <p>
            필수 항목: 이름, 이메일 주소, 휴대전화 번호, 로그인 정보(소셜 로그인
            식별값 포함)
          </p>
          <p>선택 항목: 회사명, 직책, 프로필 이미지, 명함 정보</p>
          {/* 실제 개인정보처리방침 내용이 들어갈 자리 */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { PrivacyDialog }
export type { PrivacyDialogProps }
