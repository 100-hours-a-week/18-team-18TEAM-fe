import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 브라우저 쿠키에서 accessToken 값을 읽어 Authorization 헤더로 추가
apiClient.interceptors.request.use(
  (config) => {
    if (typeof document === 'undefined') {
      return config
    }

    const rawTokenCookie = document.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('accessToken='))

    const accessToken = rawTokenCookie
      ? decodeURIComponent(rawTokenCookie.split('=')[1] ?? '')
      : null

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 401 응답 시 만료된 토큰을 쿠키에서 제거하고 로그인 페이지로 돌려보낸다
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (typeof document !== 'undefined' && status === 401) {
      // 쿠키 제거
      document.cookie = 'accessToken=; path=/; max-age=0'
      // 세션 상태 동기화
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)
