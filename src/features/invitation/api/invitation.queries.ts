import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCardByUuid, saveCardToWallet } from './invitation.api'
import type { SaveCardRequest } from '../model'
import { walletKeys } from '@/features/home/api'

export const invitationKeys = {
  all: ['invitation'] as const,
  card: (uuid: string) => [...invitationKeys.all, 'card', uuid] as const,
}

export function useCardByUuid(uuid: string) {
  return useQuery({
    queryKey: invitationKeys.card(uuid),
    queryFn: () => getCardByUuid(uuid),
    enabled: !!uuid,
  })
}

export function useSaveCardToWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SaveCardRequest) => saveCardToWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
    },
  })
}
