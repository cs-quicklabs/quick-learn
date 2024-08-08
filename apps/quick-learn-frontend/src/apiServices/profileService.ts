import { userApiEnum } from '@src/constants/api.enum';
import axiosInstance from './axios';
import { AxiosSuccessResponse } from './axios';
import { TUserProfileType } from '@src/shared/types/profileTypes';

export const getUserProfile = async (): Promise<
  AxiosSuccessResponse<TUserProfileType>
> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<TUserProfileType>
  >(userApiEnum.GET_USER_PROFILE);
  return response.data;
};
