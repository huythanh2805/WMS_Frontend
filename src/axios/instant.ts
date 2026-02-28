import { getAccessToken } from "@/libs/tokenStorage"
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios"
import { get } from "http"

const axiosAuth: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

axiosAuth.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken()
    console.log("AccessToken trong interceptor:", accessToken)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

// Response interceptor
axiosAuth.interceptors.response.use(
  (response: any) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Gọi API refresh token thông qua NextAuth
        const tokens: any = await axiosAuth.post(
          "/auth/refresh",
          {},
          { withCredentials: true },
        )
        console.log("Tokens sau khi refresh:", tokens)

        // Thử lại request gốc với token mới
        originalRequest.headers.Authorization = `Bearer ${tokens.data.accessToken}`
        return axiosAuth(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosAuth
