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

export const updateUserProfile = async (
  data: TUserProfileType,
): Promise<AxiosSuccessResponse<{}>> => {
  const response = await axiosInstance.post<AxiosSuccessResponse<{}>>(
    userApiEnum.GET_USER_PROFILE,
    data,
  );
  return response.data;
};
