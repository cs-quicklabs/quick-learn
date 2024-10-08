import axiosInstance, { AxiosSuccessResponse } from './axios';
import { ArchivedApiEnum } from '@src/constants/api.enum';
import { TArchivedUserPayload } from '@src/shared/types/archivedTypes';
import { TUser } from '@src/shared/types/userTypes';

export const getArchivedUsers = async (
  payload: TArchivedUserPayload,
): Promise<AxiosSuccessResponse<TUser[]>> => {
  const response = await axiosInstance.post<AxiosSuccessResponse<TUser[]>>(
    ArchivedApiEnum.ARCHIVED_USERS,
    payload,
  );
  return response.data;
};
