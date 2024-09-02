import axios, { AxiosError, AxiosResponse } from 'axios';
import { getAccessToken } from './authService';
import { RouteEnum } from '@src/constants/route.enum';
import { authApiEnum } from '@src/constants/api.enum';

const baseURL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}`;

export type AxiosErrorObject = AxiosError & {
  response: {
    data: {
      error: null | string;
      errorCode: number;
      success: boolean;
      message: string;
    };
  };
};

export type AxiosSuccessResponse<T = Record<string, never>> = {
  success: boolean;
  message: string;
  data: T;
};

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosErrorObject) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<AxiosSuccessResponse>) => {
    // You can modify the response data here
    return response;
  },
  (error: AxiosErrorObject) => {
    console.error('Api error:', error);
    // Handle expired refresh token
    if (
      error.response &&
      error.response.data.errorCode === 401 &&
      error.config?.url != authApiEnum.REFRESH_TOKEN
    ) {
      // create a new token
      getAccessToken()
        .then(() => {
          // Do nothing;
          window.location.reload();
        })
        .catch(() => {
          window.location.replace(RouteEnum.LOGIN);
        });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
