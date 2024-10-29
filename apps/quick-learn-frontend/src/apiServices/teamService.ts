import {
  TAddUserPayload,
  TAddUserResponse,
  TAssignRoadmapsPayload,
  TGetUserParams,
  TTeamListingReponse,
  TUserDetailsResponse,
  TUserMetadataResponse,
} from '@src/shared/types/teamTypes';
import axiosInstance from './axios';
import { userApiEnum } from '@src/constants/api.enum';
import { mapQueryParams } from '@src/utils/helpers';

export const teamListApiCall = async (
  page: number,
  filterByUserType = '',
  q = '',
): Promise<TTeamListingReponse> => {
  const body = {
    mode: 'paginate',
    page,
    q,
  };
  const route = `${userApiEnum.GET_USER_LIST}${
    filterByUserType ? '?user_type_code=' + filterByUserType : ''
  }`;
  const response = await axiosInstance.post<TTeamListingReponse>(route, body);
  return response.data;
};

export const getUserMetadataCall = async (): Promise<TUserMetadataResponse> => {
  const response = await axiosInstance.get<TUserMetadataResponse>(
    userApiEnum.GET_USER_METADATA,
  );
  return response.data;
};

export const getUserDetails = async (
  uuid: string,
  params: TGetUserParams = {},
): Promise<TUserDetailsResponse> => {
  const mappedParams = mapQueryParams(params);
  const response = await axiosInstance.get<TUserDetailsResponse>(
    userApiEnum.GET_USER.replace(':uuid', uuid) + mappedParams,
  );
  return response.data;
};

export const createUser = async (
  body: TAddUserPayload,
): Promise<TAddUserResponse> => {
  const response = await axiosInstance.post<TAddUserResponse>(
    userApiEnum.CREATE_USER,
    body,
  );
  return response.data;
};

export const updateUser = async (
  uuid: string,
  body: Partial<TAddUserPayload & { active: string }>,
): Promise<TAddUserResponse> => {
  const response = await axiosInstance.patch<TAddUserResponse>(
    userApiEnum.GET_USER.replace(':uuid', uuid),
    body,
  );
  return response.data;
};

export const assignRoadmapsToUser = async (
  uuid: string,
  body: TAssignRoadmapsPayload,
): Promise<TAddUserResponse> => {
  const response = await axiosInstance.patch<TAddUserResponse>(
    userApiEnum.ASSIGN_ROADMAPS.replace(':uuid', uuid),
    body,
  );
  return response.data;
};
