"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/shared"

interface ProfileFormData {
  name: string
  department?: string
  position?: string
  company?: string
  phone: string
  email?: string
  avatarSrc?: string | null
}

interface ProfileFormProps extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialData?: Partial<ProfileFormData>
  onSubmit: (data: ProfileFormData) => void
  isLoading?: boolean
}

function ProfileForm({
  initialData,
  onSubmit,
  isLoading = false,
  className,
  ...props
}: ProfileFormProps) {
  const [formData, setFormData] = React.useState<ProfileFormData>({
    name: initialData?.name ?? "",
    department: initialData?.department ?? "",
    position: initialData?.position ?? "",
    company: initialData?.company ?? "",
    phone: initialData?.phone ?? "",
    email: initialData?.email ?? "",
    avatarSrc: initialData?.avatarSrc ?? null,
  })

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleAvatarChange = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result?.toString() ?? null
      setFormData((prev) => ({ ...prev, avatarSrc: result }))
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarClear = () => {
    setFormData((prev) => ({ ...prev, avatarSrc: null }))
  }

  const inputClassName = cn(
    "w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
  )

  return (
    <form
      data-slot="profile-form"
      onSubmit={handleSubmit}
      className={cn("space-y-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar src={formData.avatarSrc} size="xl" />
          {formData.avatarSrc && (
            <button
              type="button"
              onClick={handleAvatarClear}
              className="absolute -right-2 -top-2 rounded-full bg-muted text-muted-foreground hover:text-destructive hover:bg-muted/80 size-7 flex items-center justify-center"
              aria-label="프로필 사진 제거"
            >
              ×
            </button>
          )}
        </div>
        <label className="text-sm text-primary underline underline-offset-4 cursor-pointer">
          프로필 사진 추가
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">이름 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="이름을 입력하세요"
            required
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">회사</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="회사명을 입력하세요"
            className={inputClassName}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">부서</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              placeholder="부서"
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">직책</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
              placeholder="직책"
              className={inputClassName}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">전화번호 *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="010-0000-0000"
            required
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">이메일</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="email@example.com"
            className={inputClassName}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "저장 중..." : "저장"}
      </Button>
    </form>
  )
}

export { ProfileForm }
export type { ProfileFormProps, ProfileFormData }
