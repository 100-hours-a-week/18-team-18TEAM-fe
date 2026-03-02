'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { getCareers, careerKeys } from '@/features/career-edit'
import { walletKeys } from '@/features/home/api'
import { getMyLatestCard, qrShareKeys } from '@/features/qr-share/api'
import { Button, DateRangePicker, Field, Header, toast } from '@/shared'
import { getOcrJobResult, submitOcrResult } from '../api'
import { ocrFlowAtom, type OcrJobResult, type OcrMode } from '../model'
import { useAtom } from 'jotai'

const ocrResultSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('이메일 형식이 올바르지 않습니다.'),
  company: z.string().min(1, '회사명을 입력해주세요.'),
  phone_number: z.string().min(1, '휴대폰 번호를 입력해주세요.'),
  lined_number: z.string().optional().or(z.literal('')),
  position: z.string().optional().or(z.literal('')),
  department: z.string().optional().or(z.literal('')),
  is_progress: z.boolean().default(false),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
})

type OcrResultFormData = z.infer<typeof ocrResultSchema>

function toFormData(result: OcrJobResult): OcrResultFormData {
  return {
    name: result.name || '',
    email: result.email || '',
    company: result.company || '',
    phone_number: result.phone_number || '',
    lined_number: result.lined_number || '',
    position: result.position || '',
    department: result.department || '',
    is_progress: result.is_progress || false,
    start_date: result.start_date || '',
    end_date: result.end_date || '',
  }
}

function OcrResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const taskId = searchParams.get('task_id')

  const [ocrFlow, setOcrFlow] = useAtom(ocrFlowAtom)
  const [result, setResult] = React.useState<OcrJobResult | null>(null)
  const [isLoadingResult, setIsLoadingResult] = React.useState(true)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OcrResultFormData>({
    resolver: zodResolver(ocrResultSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone_number: '',
      lined_number: '',
      position: '',
      department: '',
      is_progress: false,
      start_date: '',
      end_date: '',
    },
  })

  React.useEffect(() => {
    if (!taskId) {
      router.replace('/ocr')
      return
    }

    let isMounted = true

    const fetchResult = async () => {
      try {
        setIsLoadingResult(true)
        const response = await getOcrJobResult(taskId)

        if (!isMounted) return

        setResult(response)
        reset(toFormData(response))
      } catch (error) {
        console.error('Failed to load OCR result:', error)
        router.replace('/ocr/failure')
      } finally {
        if (isMounted) {
          setIsLoadingResult(false)
        }
      }
    }

    fetchResult()

    return () => {
      isMounted = false
    }
  }, [taskId, reset, router])

  const mode: OcrMode | null = result?.mode ?? ocrFlow.mode
  const isSelfMode = mode === 'SELF'
  const isProgress = watch('is_progress')

  const handleClose = () => {
    setOcrFlow({ mode: null, capturedImageUrl: null })
    router.replace('/home')
  }

  const onSubmit = async (data: OcrResultFormData) => {
    if (!taskId) {
      toast.error('OCR 작업 정보를 찾을 수 없습니다.')
      router.replace('/ocr')
      return
    }

    if (!mode) {
      toast.error('명함 추가 타입을 찾을 수 없습니다.')
      router.replace('/home')
      return
    }

    if (isSelfMode) {
      if (!data.start_date) {
        setError('start_date', { message: '시작일을 선택해주세요.' })
        return
      }

      if (!data.is_progress && !data.end_date) {
        setError('end_date', { message: '종료일을 선택해주세요.' })
        return
      }

      if (data.start_date && data.end_date && data.start_date > data.end_date) {
        setError('end_date', { message: '종료일은 시작일 이후여야 합니다.' })
        return
      }
    }

    try {
      await submitOcrResult(taskId, mode, {
        ...data,
        lined_number: data.lined_number ?? '',
        position: data.position ?? '',
        department: data.department ?? '',
        start_date: data.start_date ?? '',
        end_date: data.end_date ?? '',
      })
      toast.success('명함 정보가 저장되었습니다.')
      setOcrFlow({ mode: null, capturedImageUrl: null })

      if (mode === 'SELF') {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: careerKeys.lists() }),
          queryClient.invalidateQueries({
            queryKey: qrShareKeys.myLatestCard(),
          }),
        ])

        await Promise.allSettled([
          queryClient.fetchQuery({
            queryKey: careerKeys.list(),
            queryFn: async () => {
              const response = await getCareers()
              return response.data
            },
          }),
          queryClient.fetchQuery({
            queryKey: qrShareKeys.myLatestCard(),
            queryFn: async () => {
              try {
                const response = await getMyLatestCard()
                return response.data ?? null
              } catch (error) {
                if (
                  error instanceof AxiosError &&
                  error.response?.status === 404
                ) {
                  return null
                }
                throw error
              }
            },
          }),
        ])

        router.replace('/my-card?tab=user-detail')
        return
      }

      await queryClient.invalidateQueries({ queryKey: walletKeys.all })
      router.replace('/home')
    } catch (error) {
      console.error('Failed to submit OCR result:', error)
      toast.error('명함 저장 중 오류가 발생했습니다.')
    }
  }

  if (isLoadingResult) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-[#022840] border-t-transparent" />
          <p className="text-muted-foreground">OCR 결과를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const previewImageUrl = result.capturedImageUrl || ocrFlow.capturedImageUrl

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header showClose onClose={handleClose} title="OCR 결과 확인" />

      <main className="flex flex-1 flex-col gap-6 px-4 pt-16 pb-8">
        <section className="w-full overflow-hidden rounded-xl border">
          {previewImageUrl ? (
            <img
              src={previewImageUrl}
              alt="촬영한 명함 이미지"
              className="aspect-video w-full object-cover"
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex aspect-video items-center justify-center text-sm">
              촬영 이미지를 찾을 수 없습니다.
            </div>
          )}
        </section>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field
            label="이름"
            placeholder="이름을 입력해주세요"
            error={errors.name?.message}
            required
            {...register('name')}
          />

          <Field
            label="이메일"
            placeholder="예) email@domain.com"
            error={errors.email?.message}
            required
            {...register('email')}
          />

          <Field
            label="회사명"
            placeholder="회사명을 입력해주세요"
            error={errors.company?.message}
            required
            {...register('company')}
          />

          <Field
            label="휴대폰"
            placeholder="예) 010-0000-0000"
            error={errors.phone_number?.message}
            required
            {...register('phone_number')}
          />

          <Field
            label="유선전화"
            placeholder="예) 02-123-4567"
            error={errors.lined_number?.message}
            {...register('lined_number')}
          />

          <Field
            label="직책"
            placeholder="직책을 입력해주세요"
            error={errors.position?.message}
            {...register('position')}
          />

          <Field
            label="직무"
            placeholder="직무를 입력해주세요"
            error={errors.department?.message}
            {...register('department')}
          />

          {isSelfMode && (
            <>
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
                        onStartChange={startField.onChange}
                        onEndChange={endField.onChange}
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
            </>
          )}

          <Button
            type="submit"
            fullWidth
            className="mt-2"
            loading={isSubmitting}
          >
            저장
          </Button>
        </form>
      </main>
    </div>
  )
}

export { OcrResultPage }
