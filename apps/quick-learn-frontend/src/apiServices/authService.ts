import { LoginCredentials, LoginResponse } from '../shared/types/authTypes';
import axiosInstance from './axios';

export const loginApiCall = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    '/auth/login',
    credentials,
  );
  return response.data;
};
