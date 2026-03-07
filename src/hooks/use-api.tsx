import { useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import axiosAuth from '@/axios/instant';
import { toast } from 'sonner';
export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}
type ApiOptions<T> = {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: ApiResponse<T>) => void;
};
/**
 * Call API request using axios
 *
 * @param config Axios request configuration
 * @param options Additional options for toast and callbacks
 *
 * @example
 * await request(
 *   {
 *     url: "/tasks",
 *     method: "POST",
 *     data: { name: "Test task" }
 *   },
 *   {
 *     successMessage: "Create task successfully",
 *     errorMessage: "Create task failed"
 *   }
 * )
 */
export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);

  const request = async (
    config: AxiosRequestConfig,
    options?: ApiOptions<T>
  ): Promise<ApiResponse<T> | null> => {
    try {
      setLoading(true);

      const res = await axiosAuth(config);

      if (config.method != 'get') {
        if (options?.successMessage) {
          toast.success(options.successMessage);
        } else {
          toast.success(res.data.message);
        }
      }

      options?.onSuccess?.(res.data);

      return res.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        options?.errorMessage ||
        'Something went wrong';

      toast.error(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    request,
    loading,
  };
}
