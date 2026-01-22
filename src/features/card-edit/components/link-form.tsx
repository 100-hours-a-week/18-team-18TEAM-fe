"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface LinkFormData {
  title: string
  url: string
  description?: string
}

interface LinkFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialData?: Partial<LinkFormData>
  onSubmit: (data: LinkFormData) => void
  isLoading?: boolean
  clearOnSubmit?: boolean
}

function LinkForm({
  initialData,
  onSubmit,
  isLoading = false,
  clearOnSubmit = false,
  className,
  ...props
}: LinkFormProps) {
  const [formData, setFormData] = React.useState<LinkFormData>({
    title: initialData?.title ?? "",
    url: initialData?.url ?? "",
    description: initialData?.description ?? "",
  })

  const handleChange = (field: keyof LinkFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    if (clearOnSubmit) {
      setFormData({
        title: "",
        url: "",
        description: "",
      })
    }
  }

  const inputClassName = cn(
    "w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
  )

  return (
    <form
      data-slot="link-form"
      onSubmit={handleSubmit}
      className={cn("space-y-4", className)}
      {...props}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">링크명 *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="링크 이름을 입력하세요 (예: GitHub, Portfolio)"
          required
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">URL *</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => handleChange("url", e.target.value)}
          placeholder="https://"
          required
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">설명</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="링크에 대한 설명을 입력하세요"
          rows={2}
          className={cn(inputClassName, "resize-none")}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "저장 중..." : "저장"}
      </Button>
    </form>
  )
}

export { LinkForm }
export type { LinkFormProps, LinkFormData }
