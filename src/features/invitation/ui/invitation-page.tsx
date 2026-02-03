'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2Icon } from 'lucide-react'
import { Header, Button } from '@/shared'
import { useUser } from '@/features/auth/api'
import { useCardByUuid, useSaveCardToWallet } from '../api'
import { LoginRequiredDialog } from './login-required-dialog'
import type { InvitationCardData } from '../model'

/** 명함 카드 컴포넌트 */
function InvitationBusinessCard({ data }: { data: InvitationCardData }) {
  return (
    <div className="relative h-[200px] w-full max-w-[366px] rounded-[10px] bg-[#022840] px-6 py-7 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      {/* 왼쪽 상단: 이름, 회사, 부서/직책 */}
      <div className="flex flex-col gap-[5px] text-white">
        <h3 className="font-pretendard text-[20px] leading-[22px] font-semibold tracking-[-0.4px]">
          {data.name}
        </h3>
        <div className="flex flex-col text-[15px] leading-[22px] tracking-[-0.3px]">
          <p className="font-pretendard font-normal">{data.company}</p>
          <p className="font-pretendard font-medium">
            {data.department} / {data.position}
          </p>
        </div>
      </div>

      {/* 오른쪽 하단: 연락처 정보 */}
      <div className="absolute right-6 bottom-7 flex flex-col text-[12px] leading-[22px] tracking-[-0.24px] text-white">
        <p className="font-pretendard font-normal">M: {data.phone_number}</p>
        <p className="font-pretendard font-normal">E: {data.email}</p>
        <p className="font-pretendard font-normal">T: {data.lined_number}</p>
      </div>
    </div>
  )
}

/** 안내 카드 컴포넌트 */
function InvitationInfoCard({
  onSave,
  isLoading,
}: {
  onSave: () => void
  isLoading: boolean
}) {
  return (
    <div className="flex w-full max-w-[340px] flex-col items-center rounded-[25px] bg-white px-6 py-10 shadow-[4px_10px_30px_0px_rgba(87,87,87,0.25)]">
      <CheckCircle2Icon className="size-16 text-green-500" strokeWidth={1.5} />

      <h2 className="text-foreground mt-6 text-[24px] font-semibold">
        공유받은 명함
      </h2>

      <p className="text-muted-foreground mt-4 text-center text-[16px] leading-[24px]">
        공유받은 명함입니다.
        <br />
        저장 버튼을 누르면 명함 목록에 추가됩니다.
      </p>

      <Button
        variant="primary"
        fullWidth
        className="mt-8 rounded-[10px] bg-[#022840] text-white hover:bg-[#022840]/90"
        onClick={onSave}
        disabled={isLoading}
      >
        {isLoading ? '저장 중...' : '저장'}
      </Button>
    </div>
  )
}

function InvitationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const uuid = searchParams.get('uuid')

  const { data: user, isLoading: isUserLoading } = useUser()
  const { data: cardResponse, isLoading: isCardLoading, isError } = useCardByUuid(uuid ?? '')
  const { mutate: saveCard, isPending: isSaving } = useSaveCardToWallet()

  const [showLoginDialog, setShowLoginDialog] = React.useState(false)

  const handleClose = () => {
    router.push('/home')
  }

  const handleSave = () => {
    // 유저 정보 로딩 중이면 무시
    if (isUserLoading) return

    // 미로그인 상태
    if (!user) {
      setShowLoginDialog(true)
      return
    }

    // 로그인 상태: 명함 저장
    if (uuid) {
      saveCard(
        { uuid },
        {
          onSuccess: () => {
            router.push('/home')
          },
        }
      )
    }
  }

  // uuid 없는 경우
  if (!uuid) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">잘못된 접근입니다.</p>
        <Button
          variant="primary"
          className="bg-[#022840] text-white hover:bg-[#022840]/90"
          onClick={() => router.push('/home')}
        >
          홈으로 이동
        </Button>
      </div>
    )
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">명함을 찾을 수 없습니다.</p>
        <Button
          variant="primary"
          className="bg-[#022840] text-white hover:bg-[#022840]/90"
          onClick={() => router.push('/home')}
        >
          홈으로 이동
        </Button>
      </div>
    )
  }

  // 로딩 상태
  if (isCardLoading || !cardResponse) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-[#022840] border-t-transparent" />
          <p className="text-muted-foreground">명함 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <Header showClose onClose={handleClose} />

      <main className="flex flex-col items-center gap-[59px] px-5 pt-[95px]">
        {/* 명함 카드 */}
        <InvitationBusinessCard data={cardResponse.data} />

        {/* 안내 카드 */}
        <InvitationInfoCard onSave={handleSave} isLoading={isSaving} />
      </main>

      {/* 로그인 필요 모달 */}
      <LoginRequiredDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        redirectPath={`/invitation?uuid=${uuid}`}
      />
    </div>
  )
}

export { InvitationPage }
