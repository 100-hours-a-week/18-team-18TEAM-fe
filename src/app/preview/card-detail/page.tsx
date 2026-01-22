"use client"

import * as React from "react"
import { toast, Toaster } from "@/shared"
import {
  CardInfoSection,
  DetailBottomNav,
  GlassCardPreview,
} from "@/features/card-detail/components"

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

export default function CardDetailPreviewPage() {
  const [isFlip, setIsFlip] = React.useState(false)
  const [activeTab, setActiveTab] =
    React.useState<"user-detail" | "charts" | "reviews">("user-detail")

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <Toaster />
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Card Detail Component Preview
        </h1>
        <p className="text-sm text-muted-foreground">
          카드 상세 관련 컴포넌트를 단독으로 확인하는 페이지입니다.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          GlassCardPreview
        </h2>
        <div className="bg-gradient-to-br from-primary/30 to-secondary/30 p-6 rounded-xl">
          <GlassCardPreview
            data={sampleProfile}
            isFlip={isFlip}
            onFlipChange={(value) => {
              setIsFlip(value)
              toast.info(`AI 설명 토글: ${value ? "켜짐" : "꺼짐"}`)
            }}
            className="max-w-xl"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          CardInfoSection
        </h2>
        <div className="max-w-md rounded-lg border">
          <CardInfoSection
            info={{
              phone: sampleProfile.phone,
              email: sampleProfile.email,
              tel: sampleProfile.tel,
            }}
            onPhoneClick={() => toast.info("전화 걸기")}
            onEmailClick={() => toast.info("메일 보내기")}
            onTelClick={() => toast.info("유선전화 걸기")}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          DetailBottomNav
        </h2>
        <p className="text-sm text-muted-foreground">
          탭을 전환하면 토스트로 상태를 확인할 수 있습니다.
        </p>
        <div className="relative h-28 border rounded-lg flex items-center justify-center">
          <DetailBottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab)
              toast.info(`탭 전환: ${tab}`)
            }}
          />
        </div>
      </section>
    </div>
  )
}
