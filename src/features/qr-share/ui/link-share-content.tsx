'use client'

import { Copy, MessageCircle } from 'lucide-react'
import { Button, toast } from '@/shared'

interface LinkShareContentProps {
  shareUrl: string
}

function LinkShareContent({ shareUrl }: LinkShareContentProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('링크가 복사되었습니다.')
    } catch {
      toast.error('링크 복사에 실패했습니다.')
    }
  }

  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      toast.error('카카오 SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: 'CARO 명함',
        description: '명함 정보를 확인해보세요.',
        imageUrl: '',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '명함 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    })
  }

  return (
    <div className="flex w-full max-w-[349px] flex-col items-center gap-4">
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={handleCopyLink}
      >
        <Copy className="size-4" />
        URL 복사하기
      </Button>

      <Button
        className="w-full gap-2 bg-[#FEE500] text-[#191919] hover:bg-[#FDD800]"
        onClick={handleKakaoShare}
      >
        <MessageCircle className="size-4" />
        카카오톡으로 공유하기
      </Button>

      <p className="font-inter text-center text-[12px] leading-normal text-[#666]">
        링크를 통해 누구나 회원님의 명함 정보를 확인할 수 있습니다.
      </p>
    </div>
  )
}

export { LinkShareContent }
export type { LinkShareContentProps }
