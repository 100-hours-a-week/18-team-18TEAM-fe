import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveScannedCard } from './qr-scan.api'
import type { SaveCardRequest } from '../model'
import { walletKeys } from '@/features/home/api'

export const qrScanKeys = {
  all: ['qr-scan'] as const,
}

export function useSaveScannedCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SaveCardRequest) => saveScannedCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
    },
  })
}
