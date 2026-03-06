import { getAccessToken, setAccessToken } from '@/libs/tokenStorage';
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function onRefreshFailed(error: any) {
  refreshSubscribers = [];
}

const axiosAuth: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosAuth.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosAuth.interceptors.response.use(
  (response: any) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Gọi API refresh token thông qua NextAuth
          const tokens: any = await axiosAuth.post(
            '/auth/refresh',
            {},
            { withCredentials: true }
          );
          // Set access token mới vào storage để các request sau dùng
          setAccessToken(tokens.data.accessToken);
          isRefreshing = false;
          // Replay tất cả request đang chờ với token mới
          onRefreshed(tokens.data.accessToken);

          // Thử lại request gốc với token mới
          originalRequest.headers.Authorization = `Bearer ${tokens.data.accessToken}`;
          return axiosAuth(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          onRefreshFailed(refreshError);
          // TODO: logout user ở đây nếu muốn
          return Promise.reject(refreshError);
        }
      }

      // 🟡 CASE 2: Đang có refresh → request này vào queue
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosAuth(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosAuth;
