import { apiClient } from '@/shared/api'
import type {
  GetWalletsParams,
  GetWalletsResponse,
} from '../model/wallet.types'

export async function getWallets(
  params: GetWalletsParams = {}
): Promise<GetWalletsResponse> {
  const { size = 5, cursorId, keyword } = params

  const response = await apiClient.get<GetWalletsResponse>('/wallets', {
    params: {
      size,
      ...(cursorId && { cursorId }),
      ...(keyword && { keyword }),
    },
  })

  return response.data
}

export async function deleteWalletCard(cardId: number): Promise<void> {
  await apiClient.delete(`/wallets/${cardId}`)
}
