import axiosInstance, { AxiosSuccessResponse } from './axios';
import { ArchivedApiEnum } from '@src/constants/api.enum';
import { TUser } from '@src/shared/types/userTypes';
import { PaginateWrapper } from '@src/shared/types/utilTypes';
import { TRoadmap, TCourse } from '@src/shared/types/contentRepository';

/**
 * User activation service
 */
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

/**
 * Roadmap activation service
 */
export const activateRoadmap = async (payload: {
  active: boolean;
  id: number;
}): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    ArchivedApiEnum.ACTIVATE_ROADMAP,
    payload,
  );
  return response.data;
};

/**
 * Course activation service
 */
export const activateCourse = async (payload: {
  active: boolean;
  id: number;
}): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    ArchivedApiEnum.ACTIVATE_COURSE,
    payload,
  );
  return response.data;
};
/**
 * Get archived users with pagination
 */
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

/**
 * Get archived roadmaps with pagination
 */
export const getArchivedRoadmaps = async (
  page: number,
  q = '',
): Promise<AxiosSuccessResponse<PaginateWrapper<TRoadmap[]>>> => {
  const body = {
    mode: 'paginate',
    page,
    q,
  };
  const response = await axiosInstance.post<
    AxiosSuccessResponse<PaginateWrapper<TRoadmap[]>>
  >(ArchivedApiEnum.ARCHIVED_ROADMAPS, body);
  return response.data;
};

/**
 * Get archived courses with pagination
 */
export const getArchivedCourses = async (
  page: number,
  q = '',
): Promise<AxiosSuccessResponse<PaginateWrapper<TCourse[]>>> => {
  const body = {
    mode: 'paginate',
    page,
    q,
  };
  const response = await axiosInstance.post<
    AxiosSuccessResponse<PaginateWrapper<TCourse[]>>
  >(ArchivedApiEnum.ARCHIVED_COURSES, body);
  return response.data;
};
