import { TArchivedUserType } from '@src/shared/types/archivedTypes';
import axiosInstance, { AxiosSuccessResponse } from './axios';
import { ArchivedApiEnum } from '@src/constants/api.enum';

export const getArchivedUsersService = async (): Promise<
  AxiosSuccessResponse<TArchivedUserType>
> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<TArchivedUserType>
  >(ArchivedApiEnum.ARCHIVED_USERS);
  return response.data;
};
