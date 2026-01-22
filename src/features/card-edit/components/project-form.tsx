"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FlexibleDateInput } from "./flexible-date-input"

interface ProjectFormData {
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description?: string
}

interface ProjectFormProps extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initialData?: Partial<ProjectFormData>
  onSubmit: (data: ProjectFormData) => void
  isLoading?: boolean
}

function ProjectForm({
  initialData,
  onSubmit,
  isLoading = false,
  className,
  ...props
}: ProjectFormProps) {
  const [formData, setFormData] = React.useState<ProjectFormData>({
    name: initialData?.name ?? "",
    startDate: initialData?.startDate ?? "",
    endDate: initialData?.endDate ?? "",
    isCurrent: initialData?.isCurrent ?? false,
    description: initialData?.description ?? "",
  })

  const handleChange = (field: keyof ProjectFormData, value: string | boolean) => {
    setFormData((prev) => {
      if (field === "isCurrent" && value === true) {
        return { ...prev, isCurrent: true, endDate: "" }
      }
      return { ...prev, [field]: value }
    })
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
      data-slot="project-form"
      onSubmit={handleSubmit}
      className={cn("space-y-4", className)}
      {...props}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          프로젝트명 *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="프로젝트명을 입력하세요"
          required
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          프로젝트 기간 *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <FlexibleDateInput
            label="시작일"
            required
            value={formData.startDate}
            onChange={(value) => handleChange("startDate", value)}
          />
          <FlexibleDateInput
            label="종료일"
            value={formData.endDate}
            onChange={(value) => handleChange("endDate", value)}
            disabled={formData.isCurrent}
            className={formData.isCurrent ? "opacity-50" : undefined}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isCurrent}
          onChange={(e) => handleChange("isCurrent", e.target.checked)}
          className="size-4 rounded border-border"
        />
        <span className="text-sm text-foreground">현재 진행 중</span>
      </label>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          프로젝트 내용
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="프로젝트 내용을 입력하세요"
          rows={4}
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

export { ProjectForm }
export type { ProjectFormProps, ProjectFormData }
