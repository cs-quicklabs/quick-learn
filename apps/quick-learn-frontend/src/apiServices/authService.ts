import { authApiEnum } from '@src/constants/api.enum';
import { LoginCredentials, LoginResponse } from '../shared/types/authTypes';
import axiosInstance from './axios';

export const loginApiCall = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    authApiEnum.LOGIN,
    credentials,
  );
  return response.data;
};

export const logoutApiCall = async (): Promise<LoginResponse> => {
  const response = await axiosInstance.post(authApiEnum.LOGOUT);
  return response.data;
};
