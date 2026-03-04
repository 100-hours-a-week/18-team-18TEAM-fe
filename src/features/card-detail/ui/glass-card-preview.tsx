'use client'

import * as React from 'react'
import {
  ScanSearchIcon,
  BrainIcon,
  ListChecksIcon,
  FileTextIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type ProfileData } from '@/shared'
import { Switch } from '@/components/ui/switch'

interface GlassCardPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ProfileData
  isFlip?: boolean
  onFlipChange?: (isFlip: boolean) => void
  aiDescription?: string
}

const AI_PROGRESS_PHASE_ONE_READ_HOLD_MS = 700
const AI_PROGRESS_PHASE_ONE_THINK_HOLD_MS = 1000
const AI_PROGRESS_PHASE_ONE_ANALYZE_HOLD_MS = 1500
const AI_FILE_TRANSFER_DURATION_MS = 1200
const AI_PROGRESS_PHASE_TWO_DURATION_MS = 4000
const AI_PROGRESS_PHASE_ONE_STEPS = [
  {
    id: 'read',
    label: '작성해주신 경력을 확인하고 있어요.',
    icon: ScanSearchIcon,
  },
  {
    id: 'think',
    label: '핵심 정보를 정리하고 있어요',
    icon: BrainIcon,
  },
  {
    id: 'analyze',
    label: '경력을 분석해 결과를 만들고 있어요',
    icon: ListChecksIcon,
  },
] as const

function GlassCardPreview({
  data,
  isFlip = false,
  onFlipChange,
  aiDescription,
  className,
  ...props
}: GlassCardPreviewProps) {
  const displayData = data
  const showDescription = isFlip
  const descriptionText = aiDescription?.trim() || ''
  const isAiDescriptionPending = !descriptionText
  const [aiProgressPhase, setAiProgressPhase] = React.useState<1 | 2>(1)
  const [phaseOneStepIndex, setPhaseOneStepIndex] = React.useState(0)
  const [activeTransferSegment, setActiveTransferSegment] = React.useState<
    number | null
  >(null)

  React.useEffect(() => {
    if (!showDescription || !isAiDescriptionPending) return

    setAiProgressPhase(1)
    setPhaseOneStepIndex(0)
    setActiveTransferSegment(null)

    let isCancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutId = setTimeout(() => {
          resolve()
        }, ms)
      })

    const runLoop = async () => {
      while (!isCancelled) {
        setAiProgressPhase(1)
        setPhaseOneStepIndex(0)
        setActiveTransferSegment(null)

        await wait(AI_PROGRESS_PHASE_ONE_READ_HOLD_MS)
        if (isCancelled) return

        setActiveTransferSegment(0)
        await wait(AI_FILE_TRANSFER_DURATION_MS)
        if (isCancelled) return

        setActiveTransferSegment(null)
        setPhaseOneStepIndex(1)
        await wait(AI_PROGRESS_PHASE_ONE_THINK_HOLD_MS)
        if (isCancelled) return

        setActiveTransferSegment(1)
        await wait(AI_FILE_TRANSFER_DURATION_MS)
        if (isCancelled) return

        setActiveTransferSegment(null)
        setPhaseOneStepIndex(2)
        await wait(AI_PROGRESS_PHASE_ONE_ANALYZE_HOLD_MS)
        if (isCancelled) return

        setAiProgressPhase(2)
        await wait(AI_PROGRESS_PHASE_TWO_DURATION_MS)
      }
    }

    void runLoop()

    return () => {
      isCancelled = true
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isAiDescriptionPending, showDescription])

  return (
    <div
      data-slot="glass-card-preview"
      className={cn(
        'relative h-[140px] w-full rounded-[10px] bg-[#BFAE9F]/90 px-5 py-4 shadow-lg',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-inter text-[22px] font-semibold text-black">
          {displayData.name}
        </h3>
        {onFlipChange && (
          <Switch
            checked={isFlip}
            onCheckedChange={onFlipChange}
            aria-label="AI 설명 토글"
          />
        )}
      </div>

      <div className="mt-2">
        {showDescription ? (
          <div className="max-h-[76px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20 hover:[&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-track]:bg-transparent">
            {isAiDescriptionPending ? (
              aiProgressPhase === 1 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    {AI_PROGRESS_PHASE_ONE_STEPS.map((step, index) => {
                      const Icon = step.icon
                      const isActive = index === phaseOneStepIndex
                      const isTransferSegment = activeTransferSegment === index

                      return (
                        <React.Fragment key={step.id}>
                          <div
                            className={cn(
                              'flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors',
                              isActive
                                ? 'border-black bg-black text-[#BFAE9F] animate-pulse'
                                : 'border-black/20 bg-black/10 text-black/70'
                            )}
                          >
                            <Icon className="size-3.5" />
                          </div>
                          {index < AI_PROGRESS_PHASE_ONE_STEPS.length - 1 && (
                            <div className="relative h-[2px] min-w-[26px] flex-1 overflow-visible rounded-full bg-black/25">
                              <span
                                className={cn(
                                  'absolute top-1/2 left-0 -translate-y-1/2 text-black/75 opacity-0',
                                  isTransferSegment &&
                                  'animate-ai-file-transfer opacity-100'
                                )}
                              >
                                <FileTextIcon className="size-3.5" />
                              </span>
                            </div>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>
                  <p className="font-inter text-[12px] leading-snug font-normal text-black/85">
                    {AI_PROGRESS_PHASE_ONE_STEPS[phaseOneStepIndex]?.label}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="font-inter text-[16px] leading-snug font-medium text-black">
                    AI 직무 분석 및 요약을 준비 중
                    <span className="ml-1 inline-flex items-center gap-1 align-middle">
                      <span className="bg-black/75 inline-block size-1.5 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="bg-black/75 inline-block size-1.5 rounded-full animate-bounce [animation-delay:120ms]" />
                      <span className="bg-black/75 inline-block size-1.5 rounded-full animate-bounce [animation-delay:240ms]" />
                    </span>
                  </p>
                  <p className="font-inter text-[12px] leading-snug font-normal whitespace-pre-line text-black/80">
                    반영까지 다소 시간이 걸릴 수 있으며,{"\n"} 경력 정보가 추가되거나 수정되면 분석이 진행됩니다.
                  </p>
                </div>
              )
            ) : (
              <p className="font-inter text-[18px] leading-snug font-normal whitespace-pre-line text-black">
                {descriptionText}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            <p className="font-inter text-[18px] font-normal text-black">
              {displayData.company || (
                <span style={{ color: '#757575' }}>회사명</span>
              )}
            </p>
            <p className="font-inter text-[18px] font-normal text-black">
              {displayData.department || (
                <span style={{ color: '#757575' }}>부서</span>
              )}
              {' / '}
              {displayData.position || (
                <span style={{ color: '#757575' }}>직책</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export { GlassCardPreview }
export type { GlassCardPreviewProps }
