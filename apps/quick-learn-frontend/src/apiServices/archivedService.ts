import axiosInstance, { AxiosSuccessResponse } from './axios';
import { ArchivedApiEnum } from '@src/constants/api.enum';
import { TUser } from '@src/shared/types/userTypes';
import { PaginateWrapper } from '@src/shared/types/utilTypes';
import {
  TRoadmap,
  TCourse,
  TLesson,
} from '@src/shared/types/contentRepository';

/**
 * User activation service
 */
export const activateUser = async (payload: {
  active: boolean;
  userId: number;
}): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    ArchivedApiEnum.ACTIVATE_USER,
    payload,
  );
  return response.data;
};

/**
 * Delete user permanently
 */
export const deleteUser = async (
  userId: number,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.delete<AxiosSuccessResponse>(
    `/${ArchivedApiEnum.USERS}/${userId}`,
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
  const params = {
    mode: 'paginate',
    page,
    q,
  };
  const response = await axiosInstance.get<
    AxiosSuccessResponse<PaginateWrapper<TUser[]>>
  >(ArchivedApiEnum.ARCHIVED_USERS, { params });
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
 * Delete roadmap permanently
 */
export const deleteRoadmap = async (
  id: number,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.delete<AxiosSuccessResponse>(
    `/roadmap/${id}`,
  );
  return response.data;
};

/**
 * Get archived roadmaps with pagination
 */
export const getArchivedRoadmaps = async (
  page: number,
  q = '',
): Promise<AxiosSuccessResponse<PaginateWrapper<TRoadmap[]>>> => {
  const params = {
    mode: 'paginate',
    page,
    q,
  };
  const response = await axiosInstance.get<
    AxiosSuccessResponse<PaginateWrapper<TRoadmap[]>>
  >(ArchivedApiEnum.ARCHIVED_ROADMAPS, { params });
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
 * Delete course permanently
 */
export const deleteCourse = async (
  id: number,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.delete<AxiosSuccessResponse>(
    `/course/${id}`,
  );
  return response.data;
};

/**
 * Get archived courses with pagination
 */
export const getArchivedCourses = async (
  page: number,
  q = '',
): Promise<AxiosSuccessResponse<PaginateWrapper<TCourse[]>>> => {
  const params = {
    mode: 'paginate',
    page,
    q,
  };
  const response = await axiosInstance.get<
    AxiosSuccessResponse<PaginateWrapper<TCourse[]>>
  >(ArchivedApiEnum.ARCHIVED_COURSES, { params });
  return response.data;
};

/**
 * Lesson activation service
 */
export const activateLesson = async (payload: {
  active: boolean;
  id: number;
}): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    ArchivedApiEnum.ACTIVATE_LESSON,
    payload,
  );
  return response.data;
};

/**
 * Delete lesson permanently
 */
export const deleteLesson = async (
  id: number,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.delete<AxiosSuccessResponse>(
    `/lesson/${id}`,
  );
  return response.data;
};

/**
 * Get archived lessons with pagination
 */
export const getArchivedLessons = async (
  page: number,
  q = '',
): Promise<AxiosSuccessResponse<PaginateWrapper<TLesson[]>>> => {
  const params = {
    mode: 'paginate',
    page,
    q,
  };
  const response = await axiosInstance.get<
    AxiosSuccessResponse<PaginateWrapper<TLesson[]>>
  >(ArchivedApiEnum.ARCHIVED_LESSONS, { params });
  return response.data;
};
