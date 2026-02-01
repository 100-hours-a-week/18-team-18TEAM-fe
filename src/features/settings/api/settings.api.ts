import { apiClient } from '@/shared/api'

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete('/users/me')
}
