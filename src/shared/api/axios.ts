import axios from 'axios'

declare module 'axios' {
  // 커스텀 플래그로 401 처리(자동 리다이렉트) 우회
  export interface AxiosRequestConfig {
    skipAuthHandling?: boolean
  }
}

export const apiClient = axios.create({
  baseURL: '/bff',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  if (config.skipAuthHandling) {
    config.headers = config.headers || {}
    config.headers['x-skip-auth-handling'] = '1'
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const originalRequest = error.config

    if (status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest?.skipAuthHandling) {
      return Promise.reject(error)
    }

    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
