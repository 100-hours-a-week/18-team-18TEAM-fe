"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FlexibleDateInput } from "./flexible-date-input"

interface AwardFormData {
  title: string
  date: string
  description?: string
}

interface AwardFormProps extends React.HTMLAttributes<HTMLFormElement> {
  initialData?: Partial<AwardFormData>
  onSubmit: (data: AwardFormData) => void
  isLoading?: boolean
}

function AwardForm({
  initialData,
  onSubmit,
  isLoading = false,
  className,
  ...props
}: AwardFormProps) {
  const [formData, setFormData] = React.useState<AwardFormData>({
    title: initialData?.title ?? "",
    date: initialData?.date ?? "",
    description: initialData?.description ?? "",
  })

  const handleChange = (field: keyof AwardFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const inputClassName = cn(
    "w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
  )

  return (
    <form
      data-slot="award-form"
      onSubmit={handleSubmit}
      className={cn("space-y-4", className)}
      {...props}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          활동/수상 이력명 *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="활동 또는 수상 이력명을 입력하세요"
          required
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <FlexibleDateInput
          label="날짜"
          required
          value={formData.date}
          onChange={(value) => handleChange("date", value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">설명</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="상세 내용을 입력하세요"
          rows={3}
          className={cn(
            "w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "resize-none"
          )}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "저장 중..." : "저장"}
      </Button>
    </form>
  )
}

export { AwardForm }
export type { AwardFormProps, AwardFormData }
