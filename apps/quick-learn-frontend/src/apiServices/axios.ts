import axios, { AxiosError, AxiosResponse } from 'axios';
import { authApiEnum } from '@src/constants/api.enum';
import { getClientIp } from './ipService';
// eslint-disable-next-line import/no-cycle
import { getAccessToken } from './authService';

const baseURL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${
  process.env.NEXT_PUBLIC_API_VERSION || 'v1'
}`;

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
  async (config) => {
    // Use a module-level variable to cache the IP
    const clientIp = await getClientIp();
    if (config.headers && clientIp) {
      // eslint-disable-next-line no-param-reassign
      config.headers['X-Client-IP'] = clientIp;
      // eslint-disable-next-line no-param-reassign
      config.headers['x-forwarded-for'] = clientIp;
    }

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
  async (error: AxiosErrorObject) => {
    console.error('Api error:', error);
    // Handle expired refresh token
    if (
      error.response &&
      error.response.data.errorCode === 401 &&
      error.config?.url !== authApiEnum.REFRESH_TOKEN
    ) {
      try {
        // create a new token
        await getAccessToken();
        const originalRequest = error.config;
        if (originalRequest) {
          return axios(originalRequest);
        }
        throw new Error('Original request is undefined');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
      } catch (err) {
        setTimeout(() => {
          window.location.replace('/');
        }, 400);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
