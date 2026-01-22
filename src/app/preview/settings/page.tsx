"use client"

import * as React from "react"
import { toast, Toaster } from "@/shared"
import {
  SettingsMenu,
  LogoutDialog,
  WithdrawDialog,
} from "@/features/settings/components"

export default function SettingsPreviewPage() {
  const [logoutOpen, setLogoutOpen] = React.useState(false)
  const [withdrawOpen, setWithdrawOpen] = React.useState(false)

  const menuItems = [
    { id: "profile", label: "프로필 수정", onClick: () => toast.info("프로필 수정 이동") },
    { id: "password", label: "비밀번호 변경", onClick: () => toast.info("비밀번호 변경") },
    { id: "logout", label: "로그아웃", onClick: () => setLogoutOpen(true) },
    { id: "withdraw", label: "회원 탈퇴", onClick: () => setWithdrawOpen(true), danger: true },
  ]

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <Toaster />
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Settings Component Preview</h1>
        <p className="text-sm text-muted-foreground">설정 메뉴와 확인 다이얼로그를 테스트할 수 있습니다.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">SettingsMenu</h2>
        <div className="max-w-md">
          <SettingsMenu items={menuItems} />
        </div>
      </section>

      <LogoutDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => {
          toast.success("로그아웃 완료")
          setLogoutOpen(false)
        }}
      />

      <WithdrawDialog
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        onConfirm={() => {
          toast.success("탈퇴 완료")
          setWithdrawOpen(false)
        }}
      />
    </div>
  )
}
