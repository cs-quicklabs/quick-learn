import {
  SystemPreferences,
  TContentRepositoryMetadata,
  TCourse,
  TCreateCourse,
  TCreateRoadmap,
  TRoadmap,
  TUserRoadmap,
} from '@src/shared/types/contentRepository';
import axiosInstance, { AxiosSuccessResponse } from './axios';
import { ContentRepositoryApiEnum } from '@src/constants/api.enum';
import { PaginateWrapper } from '@src/shared/types/utilTypes';

export const getContentRepositoryMetadata = async (): Promise<
  AxiosSuccessResponse<TContentRepositoryMetadata>
> => {
  // If not in store, make the API call
  const response = await axiosInstance.get<
    AxiosSuccessResponse<TContentRepositoryMetadata>
  >(ContentRepositoryApiEnum.METADATA);

  return response.data;
};

export const getRoadmaps = async (): Promise<
  AxiosSuccessResponse<TRoadmap[]>
> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TRoadmap[]>>(
    ContentRepositoryApiEnum.ROADMAP,
  );
  return response.data;
};

export const getRoadmap = async (
  id: string,
  courseId?: string,
  archived?: boolean,
): Promise<AxiosSuccessResponse<TRoadmap>> => {
  let url = ContentRepositoryApiEnum.ROADMAP + `/${id}`;
  const params = new URLSearchParams();

  if (courseId) {
    params.append('courseId', courseId);
  }

  if (archived) {
    params.append('archived', 'true');
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const response = await axiosInstance.get<AxiosSuccessResponse<TRoadmap>>(url);
  return response.data;
};

export const createRoadmap = async (
  data: TCreateRoadmap,
): Promise<AxiosSuccessResponse<TRoadmap>> => {
  const response = await axiosInstance.post<AxiosSuccessResponse<TRoadmap>>(
    ContentRepositoryApiEnum.ROADMAP,
    data,
  );
  return response.data;
};

export const updateRoadmap = async (
  id: string,
  data: TCreateRoadmap,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.patch<AxiosSuccessResponse>(
    ContentRepositoryApiEnum.ROADMAP + `/${id}`,
    data,
  );
  return response.data;
};

export const createCourse = async (
  data: TCreateCourse & { roadmap_id: number },
): Promise<AxiosSuccessResponse<TCourse>> => {
  const response = await axiosInstance.post<AxiosSuccessResponse<TCourse>>(
    ContentRepositoryApiEnum.COURSE,
    data,
  );
  return response.data;
};

export const getCourse = async (
  id: string,
): Promise<AxiosSuccessResponse<TCourse>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TCourse>>(
    ContentRepositoryApiEnum.COURSE + `/${id}`,
  );
  return response.data;
};

export const updateCourse = async (
  id: string,
  data: TCreateCourse,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.patch<AxiosSuccessResponse>(
    ContentRepositoryApiEnum.COURSE + `/${id}`,
    data,
  );
  return response.data;
};

export const assignCoursesToRoadmap = async (
  id: string,
  data: string[],
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.patch<AxiosSuccessResponse>(
    ContentRepositoryApiEnum.ROADMAP + `/${id}/assign`,
    {
      courses: data,
    },
  );
  return response.data;
};

export const assignRoadmapsToCourse = async (
  id: string,
  data: string[],
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.patch<AxiosSuccessResponse>(
    ContentRepositoryApiEnum.COURSE + `/${id}/assign`,
    {
      roadmaps: data,
    },
  );
  return response.data;
};

export const createLesson = async (payload: {
  name: string;
  content: string;
  course_id: string;
}): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    ContentRepositoryApiEnum.LESSON,
    payload,
  );
  return response.data;
};

export const getCommunityCourses = async () => {
  const response = await axiosInstance.get<AxiosSuccessResponse>(
    ContentRepositoryApiEnum.COMMUNITY_COURSES,
  );
  return response.data;
};

export const getCommunityCourse = async (
  id: string,
): Promise<AxiosSuccessResponse<TCourse>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TCourse>>(
    ContentRepositoryApiEnum.COMMUNITY + `/${id}`,
  );
  return response.data;
};

export const getUserRoadmapsService = async (): Promise<
  AxiosSuccessResponse<TUserRoadmap[]>
> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<TUserRoadmap[]>
  >(`${ContentRepositoryApiEnum.GET_USER_ROADMAPS}?include_courses=true`);
  return response.data;
};

export const getSystemPreferences = async (): Promise<
  AxiosSuccessResponse<SystemPreferences>
> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<SystemPreferences>
  >(`${ContentRepositoryApiEnum.SYSTEM_PREFERNCES}`);
  return response.data;
};

export const getOrphanCourses = async (
  page = 1,
  limit = 10,
  q = '',
): Promise<AxiosSuccessResponse<PaginateWrapper<TCourse[]>>> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<PaginateWrapper<TCourse[]>>
  >(
    `${ContentRepositoryApiEnum.ORPHAN_COURSES}?page=${page}&limit=${limit}&q=${q}`,
  );
  return response.data;
};
