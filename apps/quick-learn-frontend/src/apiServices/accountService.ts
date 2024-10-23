import { accountApiEnum } from '@src/constants/api.enum';
import axiosInstance, { AxiosSuccessResponse } from './axios';
import {
  TSkill,
  TRoadmapCategories,
  TCourseCategories,
  TRoadmapCategory,
  TCourseCategory,
  TSkills,
  TTeam,
} from '@src/shared/types/accountTypes';
import { mapQueryParams } from '@src/utils/helpers';

export const addSkill = async (
  data: Partial<TSkill>,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    accountApiEnum.SKILLS,
    data,
  );
  return response.data;
};

export const getSkills = async (): Promise<AxiosSuccessResponse<TSkills>> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TSkills>>(
    accountApiEnum.SKILLS,
  );
  return response.data;
};

export const updateSkill = async (
  id: number,
  data: Partial<TSkill>,
): Promise<AxiosSuccessResponse<Partial<TSkill>>> => {
  const response = await axiosInstance.patch<
    AxiosSuccessResponse<Partial<TSkill>>
  >(accountApiEnum.SKILLS + `/${id}`, data);
  return response.data;
};

export const deleteSkill = async (
  id: number,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.delete<AxiosSuccessResponse>(
    accountApiEnum.SKILLS + `/${id}`,
  );
  return response.data;
};

export const addRoadmapCategory = async (
  data: Partial<TRoadmapCategories>,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    accountApiEnum.ROADMAP_CATEGORIES,
    data,
  );
  return response.data;
};

export const updateRoadmapCategory = async (
  id: number,
  data: Partial<TRoadmapCategories>,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.patch<AxiosSuccessResponse>(
    accountApiEnum.ROADMAP_CATEGORIES + `/${id}`,
    data,
  );
  return response.data;
};

export const deleteRoadmapCategory = async (
  id: number,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.delete<AxiosSuccessResponse>(
    accountApiEnum.ROADMAP_CATEGORIES + `/${id}`,
  );
  return response.data;
};

export const getRoadmapCategories = async (
  query: { is_courses?: boolean; is_roadmap?: boolean } = {},
): Promise<AxiosSuccessResponse<TRoadmapCategory>> => {
  const queryMapper = mapQueryParams(query);
  const response = await axiosInstance.get<
    AxiosSuccessResponse<TRoadmapCategory>
  >(accountApiEnum.ROADMAP_CATEGORIES + queryMapper);
  return response.data;
};

export const addCourseCategory = async (
  data: Partial<TCourseCategories>,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.post<AxiosSuccessResponse>(
    accountApiEnum.COURSE_CATEGORIES,
    data,
  );
  return response.data;
};

export const getCourseCategories = async (): Promise<
  AxiosSuccessResponse<TCourseCategory>
> => {
  const response = await axiosInstance.get<
    AxiosSuccessResponse<TCourseCategory>
  >(accountApiEnum.COURSE_CATEGORIES);
  return response.data;
};

export const updateCourseCategory = async (
  id: number,
  data: Partial<TCourseCategories>,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.patch<AxiosSuccessResponse>(
    accountApiEnum.COURSE_CATEGORIES + `/${id}`,
    data,
  );
  return response.data;
};

export const deleteCourseCategory = async (
  id: number,
): Promise<AxiosSuccessResponse> => {
  const response = await axiosInstance.delete<AxiosSuccessResponse>(
    accountApiEnum.COURSE_CATEGORIES + `/${id}`,
  );
  return response.data;
};

export const getTeamDetails = async (): Promise<
  AxiosSuccessResponse<TTeam>
> => {
  const response = await axiosInstance.get<AxiosSuccessResponse<TTeam>>(
    accountApiEnum.TEAM,
  );
  return response.data;
};

export const updateTeamDetails = async (
  data: TTeam,
): Promise<AxiosSuccessResponse<TTeam>> => {
  const response = await axiosInstance.patch<AxiosSuccessResponse<TTeam>>(
    accountApiEnum.TEAM,
    data,
  );
  return response.data;
};
