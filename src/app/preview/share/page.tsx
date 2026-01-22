"use client"

import * as React from "react"
import { toast, Toaster } from "@/shared"
import { ShareCard, ShareActions } from "@/features/share/components"

const sampleProfile = {
  name: "홍길동",
  department: "개발팀",
  position: "시니어 개발자",
  company: "CARO Inc.",
  phone: "010-1234-5678",
  email: "hong@caro.kr",
  tel: "02-1234-5678",
  avatarSrc: null,
}

export default function SharePreviewPage() {
  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <Toaster />
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Share Component Preview</h1>
        <p className="text-sm text-muted-foreground">명함 공유 관련 컴포넌트를 확인합니다.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">ShareCard</h2>
        <div className="max-w-md">
          <ShareCard data={sampleProfile} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">ShareActions</h2>
        <ShareActions
          onDownload={() => toast.success("다운로드")}
          onCopyLink={() => toast.success("링크 복사")}
          onShareKakao={() => toast.success("카카오 공유")}
        />
      </section>
    </div>
  )
}
