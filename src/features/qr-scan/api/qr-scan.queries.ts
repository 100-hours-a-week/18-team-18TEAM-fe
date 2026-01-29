import { useMutation } from '@tanstack/react-query'
import { saveScannedCard } from './qr-scan.api'
import type { SaveCardRequest } from '../model'

/** 쿼리 키 */
export const qrScanKeys = {
  all: ['qr-scan'] as const,
}

/** QR 스캔 명함 저장 mutation */
export function useSaveScannedCard() {
  return useMutation({
    mutationFn: (data: SaveCardRequest) => saveScannedCard(data),
  })
}
