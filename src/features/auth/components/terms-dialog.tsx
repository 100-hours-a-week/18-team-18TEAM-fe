"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TermsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function TermsDialog({ open, onOpenChange }: TermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>이용약관</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm text-muted-foreground">
          <p>
            제1조 (목적) 본 약관은 CARO(이하 &quot;회사&quot;)가 제공하는 디지털 명함 및
            네트워크 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의
            권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
          <p>
            제2조 (정의) 1. &quot;서비스&quot;란 회사가 제공하는 디지털 명함 생성, 관리,
            공유 및 네트워킹 관련 서비스를 말합니다. 2. &quot;이용자&quot;란 본 약관에
            따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.
          </p>
          {/* 실제 이용약관 내용이 들어갈 자리 */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { TermsDialog }
export type { TermsDialogProps }
