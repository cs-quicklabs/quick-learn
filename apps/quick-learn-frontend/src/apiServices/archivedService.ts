import { TRoadmapCategory } from '@src/shared/types/accountTypes';
import axiosInstance, { AxiosSuccessResponse } from './axios';
import { ArchivedApiEnum } from '@src/constants/api.enum';
import { TUser } from '@src/shared/types/userTypes';
import { PaginateWrapper } from '@src/shared/types/utilTypes';

export const activateUser = async (payload: {
  active: boolean;
  uuid: string;
}): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    ArchivedApiEnum.ACTIVATE_USER,
    payload,
  );
  return response.data;
};

export const getArchivedUsers = async (
  page: number,
  q = '',
): Promise<AxiosSuccessResponse<PaginateWrapper<TUser[]>>> => {
  const body = {
    mode: 'paginate',
    page,
    q,
  };

  const response = await axiosInstance.post<
    AxiosSuccessResponse<PaginateWrapper<TUser[]>>
  >(ArchivedApiEnum.ARCHIVED_USERS, body);
  return response.data;
};

export const getArchivedRoadmaps = async (): // payload: TArchivedUserPayload,
Promise<AxiosSuccessResponse<TRoadmapCategory>> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<TRoadmapCategory>
  >(
    ArchivedApiEnum.ARCHIVED_ROADMAPS,
    // payload,
  );
  return response.data;
};
