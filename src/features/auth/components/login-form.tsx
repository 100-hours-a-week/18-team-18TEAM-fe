"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onKakaoLogin?: () => void
}

function LoginForm({
  onKakaoLogin,
  className,
  ...props
}: LoginFormProps) {
  return (
    <div
      data-slot="login-form"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <Button
        type="button"
        onClick={onKakaoLogin}
        className="w-full bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90"
      >
        카카오로 로그인
      </Button>
    </div>
  )
}

export { LoginForm }
export type { LoginFormProps }
