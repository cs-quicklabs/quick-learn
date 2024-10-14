import { TRoadmapCategory } from '@src/shared/types/accountTypes';
import axiosInstance, { AxiosSuccessResponse } from './axios';
import { ArchivedApiEnum } from '@src/constants/api.enum';
import { TRoadmap } from '@src/shared/types/contentRepository';
import { TUser } from '@src/shared/types/userTypes';
import { PaginateWrapper } from '@src/shared/types/utilTypes';

// export const getArchivedUsers = async (
//   payload: TArchivedUserPayload,
// ): Promise<AxiosSuccessResponse<TUser[]>> => {
//   const response = await axiosInstance.post<AxiosSuccessResponse<TUser[]>>(
//     ArchivedApiEnum.ARCHIVED_USERS,
//     payload,
//   );
//   console.log('api response', response);
//   return response.data;
// };
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
