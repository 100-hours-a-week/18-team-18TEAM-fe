'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button, Field, DateRangePicker, toast } from '@/shared'
import { careerFormSchema, type CareerFormData } from '../model'
import {
  useCareer,
  useCreateCareer,
  useUpdateCareer,
  type CareerResponse,
} from '../api'

interface CareerEditFormProps {
  cardId?: string
}

function CareerEditForm({ cardId }: CareerEditFormProps) {
  const router = useRouter()
  const isEditMode = Boolean(cardId)

  const { data: careerData, isLoading: isLoadingCareer } = useCareer(
    cardId || '',
    { enabled: isEditMode }
  )
  const createCareer = useCreateCareer()
  const updateCareer = useUpdateCareer()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CareerFormData>({
    resolver: zodResolver(careerFormSchema),
    defaultValues: {
      name: '',
      company: '',
      department: '',
      position: '',
      phone_number: '',
      email: '',
      lined_number: '',
      start_date: '',
      end_date: '',
      is_progress: false,
      ai_image_key: '',
    },
  })

  const isProgress = watch('is_progress')
  const startDate = watch('start_date')

  // 수정 모드일 때 데이터 로드
  React.useEffect(() => {
    if (careerData) {
      reset({
        name: careerData.name || '',
        company: careerData.company || '',
        department: careerData.department || '',
        position: careerData.position || '',
        phone_number: careerData.phone_number || '',
        email: careerData.email || '',
        lined_number: careerData.lined_number || '',
        start_date: careerData.start_date || '',
        end_date: careerData.end_date || '',
        is_progress: careerData.is_progress || false,
        ai_image_key: careerData.ai_image_key || '',
      })
    }
  }, [careerData, reset])

  const onSubmit = async (data: CareerFormData) => {
    try {
      if (isEditMode && cardId) {
        await updateCareer.mutateAsync({ cardId, data })
        toast.success('경력이 수정되었습니다.')
      } else {
        await createCareer.mutateAsync(data)
        toast.success('경력이 추가되었습니다.')
      }
      router.back()
    } catch {
      toast.error(
        isEditMode
          ? '경력 수정 중 오류가 발생했습니다.'
          : '경력 추가 중 오류가 발생했습니다.'
      )
    }
  }

  if (isEditMode && isLoadingCareer) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-4">
      {/* 이름 */}
      <Field
        label="이름"
        placeholder="이름을 입력해주세요"
        error={errors.name?.message}
        {...register('name')}
      />

      {/* 회사명 */}
      <Field
        label="회사명"
        placeholder="회사명을 입력해주세요"
        error={errors.company?.message}
        {...register('company')}
      />

      {/* 부서 */}
      <Field
        label="부서"
        placeholder="부서를 입력해주세요"
        error={errors.department?.message}
        {...register('department')}
      />

      {/* 직책 */}
      <Field
        label="직책"
        placeholder="직책을 입력해주세요"
        error={errors.position?.message}
        {...register('position')}
      />

      {/* 휴대폰 (필수) */}
      <Field
        label="휴대폰"
        placeholder="휴대폰 번호를 입력해주세요. '-' 포함"
        error={errors.phone_number?.message}
        required
        {...register('phone_number')}
      />

      {/* 이메일 (필수) */}
      <Field
        label="이메일"
        type="email"
        placeholder="예) email@domain.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      {/* 유선전화 */}
      <Field
        label="유선전화"
        placeholder="예) 02-000-0000"
        error={errors.lined_number?.message}
        {...register('lined_number')}
      />

      {/* 현재 재직 중 체크박스 */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">현재 재직 중</Label>
        <Controller
          name="is_progress"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked)
                if (checked) {
                  setValue('end_date', '', { shouldDirty: true })
                }
              }}
            />
          )}
        />
      </div>

      {/* 근무 기간 */}
      <Controller
        name="start_date"
        control={control}
        render={({ field: startField }) => (
          <Controller
            name="end_date"
            control={control}
            render={({ field: endField }) => (
              <DateRangePicker
                startLabel="시작일"
                endLabel="종료일"
                startValue={startField.value}
                endValue={endField.value}
                onStartChange={(value) => {
                  startField.onChange(value)
                }}
                onEndChange={(value) => {
                  endField.onChange(value)
                }}
                startRequired
                endRequired={!isProgress}
                startError={errors.start_date?.message}
                endError={errors.end_date?.message}
                hideEnd={isProgress}
              />
            )}
          />
        )}
      />

      {/* 저장 버튼 */}
      <Button
        type="submit"
        fullWidth
        loading={
          isSubmitting || createCareer.isPending || updateCareer.isPending
        }
        disabled={
          !isDirty ||
          isSubmitting ||
          createCareer.isPending ||
          updateCareer.isPending
        }
        className="mt-4"
      >
        저장
      </Button>
    </form>
  )
}

export { CareerEditForm }
export type { CareerEditFormProps }
