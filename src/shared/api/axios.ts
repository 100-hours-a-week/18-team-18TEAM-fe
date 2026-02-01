import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 쿠키 자동 전송
  headers: {
    'Content-Type': 'application/json',
  },
})

// refresh 동시 호출 방지
let isRefreshing = false
let refreshPromise: Promise<void> | null = null

// 응답 인터셉터: 401 → refresh → 재요청
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const originalRequest = error.config

    // 401 아니면 그대로 에러
    if (status !== 401) {
      return Promise.reject(error)
    }

    // 무한 루프 방지
    if (originalRequest._retry) {
      // refresh도 실패 → 로그아웃 처리
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
    originalRequest._retry = true

    // refresh는 한 번만 실행
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = apiClient
        .post('/auth/rotation')
        .then(() => {})
        .catch(() => {
          // refresh 실패 → 로그아웃
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        })
        .finally(() => {
          isRefreshing = false
          refreshPromise = null
        })
    }

    // refresh 끝날 때까지 대기
    await refreshPromise

    // 원래 요청 재시도
    return apiClient(originalRequest)
  }
)
