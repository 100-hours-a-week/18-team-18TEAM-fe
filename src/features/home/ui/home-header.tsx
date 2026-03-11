import Image from 'next/image'
import Link from 'next/link'
import { MessageCircleIcon, UserIcon } from 'lucide-react'
import { IconButton } from '@/shared'

function HomeHeader() {
  return (
    <header className="relative flex items-center justify-center px-6 py-4">
      <Image
        src="/icons/Bizkit_logo.png"
        alt="BizKit"
        width={184}
        height={47}
        priority
      />
      <div className="absolute right-6 flex items-center gap-2">
        <IconButton
          variant="surface"
          size="default"
          aria-label="채팅방 목록으로 이동"
          asChild
        >
          <Link href="/chat">
            <MessageCircleIcon className="size-5" />
          </Link>
        </IconButton>
        <IconButton
          variant="surface"
          size="default"
          aria-label="내 명함 보기"
          asChild
        >
          <Link href="/my-card">
            <UserIcon className="size-5" />
          </Link>
        </IconButton>
      </div>
    </header>
  )
}

export { HomeHeader }
