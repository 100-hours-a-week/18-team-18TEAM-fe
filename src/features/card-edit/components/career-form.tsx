'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FlexibleDateInput } from './flexible-date-input'

interface CareerFormData {
  company: string
  position: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description?: string
}

interface CareerFormProps extends Omit<
  React.HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> {
  initialData?: Partial<CareerFormData>
  onSubmit: (data: CareerFormData) => void
  isLoading?: boolean
}

function CareerForm({
  initialData,
  onSubmit,
  isLoading = false,
  className,
  ...props
}: CareerFormProps) {
  const [formData, setFormData] = React.useState<CareerFormData>({
    company: initialData?.company ?? '',
    position: initialData?.position ?? '',
    startDate: initialData?.startDate ?? '',
    endDate: initialData?.endDate ?? '',
    isCurrent: initialData?.isCurrent ?? false,
    description: initialData?.description ?? '',
  })

  const handleChange = (
    field: keyof CareerFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      if (field === 'isCurrent' && value === true) {
        return { ...prev, isCurrent: true, endDate: '' }
      }
      return { ...prev, [field]: value }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const inputClassName = cn(
    'w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
  )

  return (
    <form
      data-slot="career-form"
      onSubmit={handleSubmit}
      className={cn('space-y-4', className)}
      {...props}
    >
      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">회사명 *</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="회사명을 입력하세요"
          required
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">직책 *</label>
        <input
          type="text"
          value={formData.position}
          onChange={(e) => handleChange('position', e.target.value)}
          placeholder="직책을 입력하세요"
          required
          className={inputClassName}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FlexibleDateInput
          label="시작일"
          required
          value={formData.startDate}
          onChange={(value) => handleChange('startDate', value)}
        />
        <FlexibleDateInput
          label="종료일"
          value={formData.endDate}
          onChange={(value) => handleChange('endDate', value)}
          disabled={formData.isCurrent}
          className={formData.isCurrent ? 'opacity-50' : undefined}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isCurrent}
          onChange={(e) => handleChange('isCurrent', e.target.checked)}
          className="border-border size-4 rounded"
        />
        <span className="text-foreground text-sm">현재 재직 중</span>
      </label>

      <div className="space-y-2">
        <label className="text-foreground text-sm font-medium">설명</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="업무 내용을 입력하세요"
          rows={3}
          className={cn(
            'bg-muted/50 border-border text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-3 py-2 text-sm',
            'focus:ring-ring focus:border-transparent focus:ring-2 focus:outline-none',
            'resize-none'
          )}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? '저장 중...' : '저장'}
      </Button>
    </form>
  )
}

export { CareerForm }
export type { CareerFormProps, CareerFormData }
