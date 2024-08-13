import { authApiEnum } from '@src/constants/api.enum';
import {
  ForgotPasswordPayload,
  LoginCredentials,
  LoginResponse,
  ResetPasswordPayload,
} from '../shared/types/authTypes';
import axiosInstance, { AxiosSuccessResponse } from './axios';

// type LoginSuccessResData = {
//   access_token: string;
// };
type ForgotPasswordResData = {
  resetURL: string;
};

export const loginApiCall = async (
  credentials: LoginCredentials,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    authApiEnum.LOGIN,
    credentials,
  );
  return response.data;
};

export const forgotPasswordApiCall = async (
  payload: ForgotPasswordPayload,
): Promise<AxiosSuccessResponse<ForgotPasswordResData>> => {
  const response = await axiosInstance.post<
    AxiosSuccessResponse<ForgotPasswordResData>
  >(authApiEnum.FORGOT_PASSWORD, payload);
  return response.data;
};

export const resetPasswordApiCall = async (
  payload: ResetPasswordPayload,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    authApiEnum.RESET_PASSWORD,
    payload,
  );
  return response.data;
};

export const logoutApiCall = async (): Promise<LoginResponse> => {
  const response = await axiosInstance.post(authApiEnum.LOGOUT);
  return response.data;
};
