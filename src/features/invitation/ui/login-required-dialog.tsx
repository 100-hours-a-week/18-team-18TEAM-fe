'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/shared'

interface LoginRequiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectPath: string
}

function LoginRequiredDialog({
  open,
  onOpenChange,
  redirectPath,
}: LoginRequiredDialogProps) {
  const router = useRouter()

  const handleLogin = () => {
    router.push(`/login?next=${encodeURIComponent(redirectPath)}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그인 필요</DialogTitle>
          <DialogDescription>
            로그인을 해야 명함 추가가 가능합니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            variant="primary"
            className="bg-[#022840] text-white hover:bg-[#022840]/90"
            onClick={handleLogin}
          >
            로그인하러 가기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { LoginRequiredDialog }
export type { LoginRequiredDialogProps }
